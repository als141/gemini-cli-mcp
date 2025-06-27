# Gemini CLI MCP Server - Publication Guide

## Prerequisites

1. Create an npm account at https://www.npmjs.com/
2. Login to npm: `npm login`
3. Ensure you have access to publish under your username

## Publishing Steps

### 1. Dry Run (Test Publishing)
```bash
# Test the publication without actually publishing
npm publish --dry-run
```

### 2. Publish to npm
```bash
# Publish the package
npm publish
```

### 3. Verify Publication
```bash
# Check if the package was published successfully
npm info gemini-cli-mcp
```

## Installation for Users

Once published, users can install the package globally:

```bash
# Install globally
npm install -g gemini-cli-mcp

# Use the command
gemini-mcp --serve-mcp
```

## Package Configuration

- **Package name**: `gemini-cli-mcp` (avoiding conflicts with original `@google/gemini-cli`)
- **Binary command**: `gemini-mcp` (avoiding conflicts with original `gemini` command)
- **Version**: `1.0.0`
- **Repository**: `als141/gemini-cli-mcp`

## Files Included in Publication

The following files will be included when publishing:
- `bundle/` - Main executable and assets
- `README.md` - Package documentation
- `LICENSE` - Apache 2.0 license

## MCP Server Usage

After installation, users can add the MCP server to Claude Code:

```bash
# Add to Claude Code (user scope)
claude mcp add gemini-cli -s user gemini-mcp --serve-mcp

# Add with API key
claude mcp add gemini-cli -e GEMINI_API_KEY=your-api-key gemini-mcp --serve-mcp
```

## Updating Documentation

The following files contain setup instructions for users:
- `CLAUDE_CODE_SETUP.md` - Claude Code integration guide
- `MCP_SERVER_USAGE.md` - English usage documentation
- `MCP_SERVER_USAGE_JA.md` - Japanese usage documentation

These will need to be updated to reference the npm package installation instead of local build paths.