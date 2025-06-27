# Gemini CLI as MCP Server

This project extends the Google Gemini CLI to function as an MCP (Model Context Protocol) server, exposing all built-in Gemini CLI tools for use by other MCP clients.

## Features

The Gemini CLI MCP server exposes the following 11 tools:

### File Operations

- **`gemini.read_file`** - Read content from a single file (supports text, images, PDFs)
- **`gemini.read_many_files`** - Read multiple files using paths or glob patterns
- **`gemini.write_file`** - Write content to a file
- **`gemini.replace`** - Replace text within files with precision editing

### File System Navigation

- **`gemini.list_directory`** - List files and directories with optional filtering
- **`gemini.glob`** - Find files using glob patterns (e.g., `src/**/*.ts`)
- **`gemini.search_file_content`** - Search file contents using regular expressions

### Shell Operations

- **`gemini.run_shell_command`** - Execute shell commands with full subprocess support

### Web & Search

- **`gemini.web_fetch`** - Fetch and process content from URLs (including localhost)
- **`gemini.google_web_search`** - Perform Google web searches via Gemini API

### Memory Management

- **`gemini.save_memory`** - Save information to long-term memory

## Installation

```bash
npm install -g gemini-cli-mcp
```

## Usage

### Authentication Setup

#### Method 1: Google Account Authentication (Recommended)

Set up Google Account authentication before starting the MCP server:

```bash
# Authenticate with Google Account (one-time setup)
gemini-mcp --prompt "test" --yolo

# After authentication, start MCP server
gemini-mcp --serve-mcp
```

Authentication credentials are stored in `~/.gemini/` and automatically used when the MCP server starts.

#### Method 2: API Key Authentication

Set the Gemini API key via environment variable:

```bash
export GEMINI_API_KEY="your-api-key-here"
gemini-mcp --serve-mcp
```

### Starting the MCP Server

```bash
# Start as MCP server using stdio transport
gemini-mcp --serve-mcp
```

The server will:

- Start listening on stdin/stdout for MCP protocol messages
- Log startup information to stderr
- Expose all 11 built-in tools with `gemini.` prefix

### Configuration in MCP Clients

#### Claude Desktop Configuration

Add to your `claude_desktop_config.json`:

**Using Google Account Authentication (Recommended):**

```json
{
  "mcpServers": {
    "gemini-cli": {
      "command": "gemini-mcp",
      "args": [
        "--serve-mcp"
      ],
      "cwd": "/path/to/your/workspace"
    }
  }
}
```

**Using API Key Authentication:**

```json
{
  "mcpServers": {
    "gemini-cli": {
      "command": "gemini-mcp",
      "args": [
        "--serve-mcp"
      ],
      "env": {
        "GEMINI_API_KEY": "your-api-key-here"
      },
      "cwd": "/path/to/your/workspace"
    }
  }
}
```

#### Other MCP Clients

For clients supporting stdio transport:

```bash
# Command to start the server
gemini-mcp --serve-mcp
```

### Example Tool Calls

#### List Directory Contents

```json
{
  "name": "gemini.list_directory",
  "arguments": {
    "path": "/path/to/directory"
  }
}
```

#### Search File Contents

```json
{
  "name": "gemini.search_file_content",
  "arguments": {
    "pattern": "function\\s+\\w+",
    "path": "/path/to/search",
    "include": "*.ts"
  }
}
```

#### Execute Shell Command

```json
{
  "name": "gemini.run_shell_command",
  "arguments": {
    "command": "npm test",
    "description": "Run test suite"
  }
}
```

#### Read Multiple Files

```json
{
  "name": "gemini.read_many_files",
  "arguments": {
    "paths": ["src/**/*.ts", "docs/*.md"],
    "exclude": ["**/node_modules/**"]
  }
}
```

#### Web Search

```json
{
  "name": "gemini.google_web_search",
  "arguments": {
    "query": "TypeScript best practices 2024"
  }
}
```

## Development

### Building the Project

```bash
npm install
npm run build
```

### Installation from Source

```bash
git clone https://github.com/als141/gemini-cli-mcp.git
cd gemini-cli-mcp
npm install
npm run build
npm install -g .
```

### Testing MCP Functionality

A test client is provided to verify MCP functionality:

```bash
node test-mcp-client.js
```

This will:

1. Start the MCP server
2. Connect as a client
3. List available tools
4. Test a sample tool call
5. Clean up and exit

### Project Structure

```
packages/
├── cli/
│   ├── src/
│   │   ├── commands/
│   │   │   └── serve-mcp.ts     # MCP server implementation
│   │   ├── config/
│   │   │   └── config.ts        # CLI configuration with --serve-mcp flag
│   │   └── gemini.tsx           # Main CLI entry point
│   └── dist/                    # Built JavaScript files
└── core/
    └── src/
        └── tools/               # All tool implementations
```

## Key Implementation Details

### Architecture

- **`GeminiCliMcpServer`**: Main MCP server class that wraps Gemini CLI tools
- **Tool Registry**: Manages and exposes all available tools
- **Transport**: Uses stdio for MCP communication
- **Configuration**: Inherits all Gemini CLI configuration capabilities

### Tool Wrapping

Each Gemini CLI tool is wrapped to:

- Add `gemini.` prefix to tool names
- Convert tool parameters to MCP schema format
- Handle tool execution and response formatting
- Provide proper error handling

### Security & Safety

- All tools inherit Gemini CLI's built-in safety mechanisms
- File operations are restricted to the working directory
- Shell commands can be configured with approval modes
- Web access follows Gemini CLI's network policies

## Environment Variables

The MCP server respects all standard Gemini CLI environment variables:

- `GEMINI_API_KEY` - Required for web search functionality (not needed with Google Account auth)
- `GEMINI_MODEL` - Model to use for AI-powered features
- `GEMINI_CLI_NO_RELAUNCH` - Prevent memory relaunch behavior

## Authentication Details

### Google Account Authentication Setup

1. **Initial Authentication**:
   ```bash
   gemini-mcp --prompt "test" --yolo
   ```
2. **Verify Authentication**:

   ```bash
   ls ~/.gemini/
   ```

   Check that authentication files are created

3. **Start MCP Server**:
   ```bash
   gemini-mcp --serve-mcp
   ```

### Authentication File Locations

- **Linux/macOS**: `~/.gemini/`
- **Windows**: `%USERPROFILE%\.gemini\`

Authentication information is encrypted and stored securely, then automatically loaded when the MCP server starts.

### Authentication Types

The Gemini CLI supports three authentication methods:

1. **`oauth-personal`** - Google Account authentication (recommended)
2. **`gemini-api-key`** - Direct API key usage
3. **`vertex-ai`** - Google Cloud Vertex AI authentication

## Troubleshooting

### Server Won't Start

1. Ensure the project is built: `npm run build`
2. Check Node.js version: requires Node.js 18+
3. Verify MCP SDK dependencies are installed

### Tools Not Working

1. Check that GEMINI_API_KEY is set for web/search tools
2. Verify file permissions for file system tools
3. Check working directory for path-based operations

### Client Connection Issues

1. Ensure stdio transport is configured correctly
2. Check that server process starts without errors
3. Verify client and server MCP SDK versions are compatible

### Authentication Issues

1. **Google Account authentication fails**:

   ```bash
   # Reset authentication
   rm -rf ~/.gemini/
   # Re-authenticate
   gemini-mcp --prompt "test" --yolo
   ```

2. **API key not recognized**:

   ```bash
   echo $GEMINI_API_KEY  # Verify environment variable is set
   ```

3. **Check authentication status**:
   ```bash
   # Test if authentication works
   gemini-mcp --prompt "Hello" --yolo
   ```

## Contributing

This project extends the Google Gemini CLI. To contribute:

1. Fork the repository
2. Make changes to the MCP server implementation
3. Test with the provided test client
4. Submit a pull request

## License

This project maintains the same license as the original Google Gemini CLI project.
