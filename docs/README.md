# Documentation

This directory contains comprehensive documentation for the Gemini CLI MCP Server.

## Files

### Setup and Installation
- **[QUICK_START.md](QUICK_START.md)** - Quick start guide for setting up and using the MCP server (Japanese)
- **[CLAUDE_CODE_SETUP.md](CLAUDE_CODE_SETUP.md)** - Detailed Claude Code integration guide (Japanese)

### Usage Documentation
- **[MCP_SERVER_USAGE.md](MCP_SERVER_USAGE.md)** - Complete MCP server usage guide (English)
- **[MCP_SERVER_USAGE_JA.md](MCP_SERVER_USAGE_JA.md)** - Complete MCP server usage guide (Japanese)

### Development
- **[PUBLISH_GUIDE.md](PUBLISH_GUIDE.md)** - Guide for publishing the package to npm

## Quick Installation

```bash
npm install -g gemini-cli-mcp
```

## Quick Setup for Claude Code

```bash
# Add to Claude Code
claude mcp add gemini-cli -s user gemini-mcp --serve-mcp

# Or with API key
claude mcp add gemini-cli -e GEMINI_API_KEY=your-key gemini-mcp --serve-mcp
```

## Available Tools

The MCP server exposes 11 tools with `gemini_` prefix:

### File Operations
- `gemini_read_file` - Read files (text, images, PDFs)
- `gemini_read_many_files` - Read multiple files  
- `gemini_write_file` - Write files
- `gemini_replace` - Replace text in files

### File System
- `gemini_list_directory` - List directories
- `gemini_glob` - Find files with glob patterns
- `gemini_search_file_content` - Search file contents

### System
- `gemini_run_shell_command` - Execute shell commands

### Web & Search
- `gemini_web_fetch` - Fetch web content
- `gemini_google_web_search` - Google search

### Memory
- `gemini_save_memory` - Save to long-term memory

## Authentication

### Google Account (Recommended)
```bash
gemini-mcp --prompt "test" --yolo  # Initial setup
gemini-mcp --serve-mcp            # Start server
```

### API Key
```bash
export GEMINI_API_KEY="your-key"
gemini-mcp --serve-mcp
```

For detailed information, see the specific documentation files listed above.