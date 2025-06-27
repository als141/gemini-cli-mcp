# Gemini CLI MCP Server

A Model Context Protocol (MCP) server that exposes all Gemini CLI tools to MCP clients like Claude Code.

## Overview

This project extends the Google Gemini CLI to function as an MCP server, making all 11 built-in Gemini CLI tools available to MCP clients. It provides a bridge between the powerful Gemini CLI toolset and the MCP ecosystem.

## Features

### 🔧 Complete Tool Suite
- **File Operations**: Read, write, edit files (supports text, images, PDFs)
- **File System**: Directory listing, glob search, content search
- **Shell Integration**: Execute system commands
- **Web Capabilities**: Fetch URLs, Google Search via Gemini API
- **Memory Management**: Long-term information storage

### 🔌 MCP Integration
- **Claude Code**: Native integration with Claude Code
- **Claude Desktop**: Compatible with Claude Desktop
- **Standard MCP**: Works with any MCP-compatible client
- **Stdio Transport**: Uses standard input/output for communication

## Quick Start

### Installation

```bash
npm install -g gemini-cli-mcp
```

### Setup with Claude Code

```bash
# Add to Claude Code (recommended)
claude mcp add gemini-cli -s user gemini-mcp -- --serve-mcp

# With API key
claude mcp add gemini-cli -s user -e GEMINI_API_KEY=your-key gemini-mcp -- --serve-mcp
```

### Authentication

#### Google Account (Recommended)
```bash
# Initial setup
gemini-mcp --prompt "test" --yolo

# Start MCP server
gemini-mcp --serve-mcp
```

#### API Key
```bash
export GEMINI_API_KEY="your-api-key"
gemini-mcp --serve-mcp
```

## Available Tools

All tools are exposed with `gemini_` prefix:

| Tool | Description |
|------|-------------|
| `gemini_read_file` | Read file content (text, images, PDFs) |
| `gemini_read_many_files` | Read multiple files with glob patterns |
| `gemini_write_file` | Write content to files |
| `gemini_replace` | Precise text replacement in files |
| `gemini_list_directory` | List directory contents |
| `gemini_glob` | Find files using glob patterns |
| `gemini_search_file_content` | Search file contents with regex |
| `gemini_run_shell_command` | Execute shell commands |
| `gemini_web_fetch` | Fetch web content |
| `gemini_google_web_search` | Google Search via Gemini API |
| `gemini_save_memory` | Save to long-term memory |

## Configuration Examples

### Claude Code
```bash
# User scope (recommended)
claude mcp add gemini-cli -s user gemini-mcp -- --serve-mcp

# Project scope
claude mcp add gemini-cli -s project gemini-mcp -- --serve-mcp

# With environment variables
claude mcp add gemini-cli -s user -e GEMINI_API_KEY=your-key gemini-mcp -- --serve-mcp
```

### Claude Desktop
Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "gemini-cli": {
      "command": "gemini-mcp",
      "args": ["--serve-mcp"],
      "env": {
        "GEMINI_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Use Cases

### Code Analysis
```
> Use gemini_search_file_content to find all React components using hooks
> Read the main configuration files and explain the project structure
```

### File Management
```
> List all TypeScript files in the src directory
> Read multiple test files and summarize the testing strategy
```

### System Operations
```
> Run the test suite and show me the results
> Check git status and recent commits
```

### Research & Web Search
```
> Search for the latest TypeScript best practices
> Fetch documentation from the project's homepage
```

## Authentication Methods

1. **Google Account** (Recommended): Interactive OAuth flow
2. **API Key**: Direct Gemini API key usage
3. **Vertex AI**: Google Cloud authentication

## Troubleshooting

### Installation Issues
```bash
npm uninstall -g gemini-cli-mcp
npm install -g gemini-cli-mcp
```

### Authentication Problems
```bash
# Reset authentication
rm -rf ~/.gemini/
gemini-mcp --prompt "test" --yolo
```

### MCP Server Issues
```bash
# Test server directly
gemini-mcp --serve-mcp

# Check logs in Claude Code
/mcp
```

## Documentation

- **[Quick Start Guide](docs/QUICK_START.md)** - Get started quickly (Japanese)
- **[Claude Code Setup](docs/CLAUDE_CODE_SETUP.md)** - Detailed Claude Code integration (Japanese)
- **[Complete Usage Guide](docs/MCP_SERVER_USAGE.md)** - Comprehensive documentation (English)
- **[日本語ガイド](docs/MCP_SERVER_USAGE_JA.md)** - Complete usage guide (Japanese)
- **[Publishing Guide](docs/PUBLISH_GUIDE.md)** - For developers

## Development

### Building from Source
```bash
git clone https://github.com/als141/gemini-cli-mcp.git
cd gemini-cli-mcp
npm install
npm run build
npm install -g .
```

### Project Structure
```
packages/
├── cli/                 # Main CLI package
│   ├── src/commands/serve-mcp.ts  # MCP server implementation
│   └── dist/           # Built files
└── core/               # Core functionality
    └── src/tools/      # Tool implementations
```

## Requirements

- **Node.js**: 18.0.0 or higher
- **Gemini API Key** or **Google Account** for authentication
- **MCP Client**: Claude Code, Claude Desktop, or compatible client

## License

Apache License 2.0 - Same as the original Google Gemini CLI

## Related Projects

- [Google Gemini CLI](https://github.com/google-gemini/gemini-cli) - Original CLI tool
- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP specification
- [Claude Code](https://claude.ai/code) - AI-powered development environment

## Support

For issues and questions:
- Check the [troubleshooting guide](docs/MCP_SERVER_USAGE.md#troubleshooting)
- Review the [documentation](docs/)
- Open an issue on GitHub