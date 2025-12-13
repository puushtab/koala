import google.generativeai as genai
from google.generativeai.types import FunctionDeclaration, Tool
from config import Config

class GeminiAgent:
    def __init__(self):
        if not Config.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is required. Please set it in your .env file.")
        genai.configure(api_key=Config.GEMINI_API_KEY)
        self.model_name = "gemini-2.5-flash" # or gemini-1.5-pro
        self.chat_session = None
        self.tools_map = {} # Maps tool names to actual callables or definitions

    def _convert_mcp_tools_to_gemini(self, mcp_tools: list):
        """
        Converts MCP tool definitions into Gemini FunctionDeclarations.
        This is a basic mapping block.
        """
        if not mcp_tools:
            return None
            
        gemini_funcs = []
        for tool in mcp_tools:
            # Get the input schema and clean it for Gemini
            input_schema = tool.inputSchema if hasattr(tool, 'inputSchema') else {}
            
            # Clean the schema - remove fields that Gemini doesn't support
            cleaned_schema = self._clean_schema_for_gemini(input_schema)
            
            # Convert MCP tool schema to Gemini format
            func_decl = FunctionDeclaration(
                name=tool.name,
                description=tool.description or "",
                parameters=cleaned_schema
            )
            gemini_funcs.append(func_decl)
            # Store mapping for later use
            self.tools_map[tool.name] = tool
        
        return [Tool(function_declarations=gemini_funcs)] if gemini_funcs else None
    
    def _clean_schema_for_gemini(self, schema: dict) -> dict:
        """
        Cleans a JSON schema to be compatible with Gemini's expectations.
        Removes unsupported fields like 'default', 'examples', etc.
        """
        if not isinstance(schema, dict):
            return schema
        
        cleaned = {}
        # Fields that Gemini supports
        supported_fields = {'type', 'description', 'properties', 'required', 'items', 'enum', 'format'}
        
        for key, value in schema.items():
            if key in supported_fields:
                if key == 'properties' and isinstance(value, dict):
                    # Recursively clean nested properties
                    cleaned[key] = {
                        prop_name: self._clean_schema_for_gemini(prop_value)
                        for prop_name, prop_value in value.items()
                    }
                elif key == 'items' and isinstance(value, dict):
                    # Clean array items schema
                    cleaned[key] = self._clean_schema_for_gemini(value)
                else:
                    cleaned[key] = value
        
        return cleaned

    def start_chat(self, mcp_tools: list = None):
        """Initializes the chat with tools."""
        
        # Convert MCP tools to Gemini format
        gemini_tools = self._convert_mcp_tools_to_gemini(mcp_tools)
        
        # Initialize model with tools if present
        model = genai.GenerativeModel(
            model_name=self.model_name,
            tools=gemini_tools
        )
        self.chat_session = model.start_chat(history=[])

    async def send_message(self, user_input: str, mcp_client=None, return_tool_results=False):
        """
        Sends message to Gemini and handles the response loop 
        (checking for function calls).
        
        Args:
            user_input: The message to send
            mcp_client: The MCP client handler
            return_tool_results: If True, returns (text_response, tool_results_list)
        """
        if not self.chat_session:
            raise ValueError("Chat session not started.")

        response = self.chat_session.send_message(user_input)
        
        # Track tool results if requested
        all_tool_results = []
        
        # Loop to handle multiple function calls
        max_iterations = 10  # Prevent infinite loops
        iteration = 0
        
        while iteration < max_iterations:
            iteration += 1
            
            # Check if response contains function calls
            parts = response.candidates[0].content.parts
            function_calls = [p for p in parts if hasattr(p, 'function_call') and p.function_call]
            
            if not function_calls:
                # No more function calls, return text
                break
            
            # Execute all function calls
            function_responses = []
            for part in function_calls:
                fn_name = part.function_call.name
                fn_args = dict(part.function_call.args)
                
                if mcp_client:
                    print(f"\n🛠️  Calling tool: {fn_name}")
                    # Execute tool on MCP
                    tool_result = await mcp_client.call_tool(fn_name, fn_args)
                    
                    # Store tool result if tracking
                    if return_tool_results:
                        all_tool_results.append({
                            "tool_name": fn_name,
                            "arguments": fn_args,
                            "result": tool_result
                        })
                    
                    # Convert result to proper format
                    result_dict = {"result": str(tool_result)}
                    
                    # Create function response using protos
                    from google.generativeai import protos
                    function_responses.append(
                        protos.Part(function_response=protos.FunctionResponse(
                            name=fn_name,
                            response=result_dict
                        ))
                    )
                else:
                    return f"[System: Gemini wanted to call {fn_name}, but no MCP client attached]"
            
            # Send function results back to Gemini
            response = self.chat_session.send_message(function_responses)
        
        # Extract final text response
        text_parts = [p.text for p in response.candidates[0].content.parts if hasattr(p, 'text')]
        text_response = ''.join(text_parts) if text_parts else "[No response generated]"
        
        if return_tool_results:
            return text_response, all_tool_results
        return text_response