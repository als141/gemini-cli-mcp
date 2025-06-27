#!/usr/bin/env node

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  Config,
  ToolRegistry,
  EditTool,
  GlobTool,
  GrepTool,
  LSTool,
  ReadFileTool,
  ReadManyFilesTool,
  WriteFileTool,
  ShellTool,
  WebFetchTool,
  WebSearchTool,
  MemoryTool,
  sessionId,
} from '@google/gemini-cli-core';
import { loadCliConfig } from '../config/config.js';
import { loadSettings } from '../config/settings.js';
import { loadExtensions } from '../config/extension.js';

/**
 * Gemini CLI MCP Server
 * Exposes all built-in Gemini CLI tools as MCP tools
 */
export class GeminiCliMcpServer {
  private server: Server;
  private toolRegistry!: ToolRegistry;
  private config!: Config;

  constructor() {
    // Initialize MCP server
    this.server = new Server(
      {
        name: 'gemini-cli-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    this.setupHandlers();
  }

  async initialize(): Promise<void> {
    // Load settings and create config asynchronously
    const workspaceRoot = process.cwd();
    const settings = loadSettings(workspaceRoot);
    const extensions = loadExtensions(workspaceRoot);

    this.config = await loadCliConfig(settings.merged, extensions, sessionId);

    // Initialize authentication if needed
    const selectedAuthType = settings.merged.selectedAuthType;
    const hasApiKey = !!process.env.GEMINI_API_KEY;
    
    console.error('[MCP Server] Environment check:');
    console.error('- GEMINI_API_KEY present:', hasApiKey);
    console.error('- Selected auth type:', selectedAuthType);
    
    if (selectedAuthType) {
      console.error('[MCP Server] Initializing authentication with:', selectedAuthType);
      try {
        await this.config.refreshAuth(selectedAuthType);
        console.error('[MCP Server] Authentication initialized successfully');
      } catch (error) {
        console.error('[MCP Server] Authentication failed:', error);
        throw new Error(`Failed to initialize authentication: ${error}`);
      }
    } else if (hasApiKey) {
      // Fallback to API key authentication
      console.error('[MCP Server] Falling back to API key authentication');
      try {
        const { AuthType } = await import('@google/gemini-cli-core');
        await this.config.refreshAuth(AuthType.USE_GEMINI);
        console.error('[MCP Server] API key authentication initialized successfully');
      } catch (error) {
        console.error('[MCP Server] API key authentication failed:', error);
        throw new Error(`Failed to initialize API key authentication: ${error}`);
      }
    } else {
      console.error('[MCP Server] No authentication method configured and no API key found');
      throw new Error('No authentication method available. Please set GEMINI_API_KEY or configure authentication.');
    }

    // Initialize tool registry
    this.toolRegistry = new ToolRegistry(this.config);
    this.registerBuiltinTools();
  }

  private registerBuiltinTools(): void {
    // Register all built-in Gemini CLI tools
    const targetDir = this.config.getTargetDir();
    const tools = [
      new EditTool(this.config),
      new GlobTool(targetDir, this.config),
      new GrepTool(targetDir),
      new LSTool(targetDir, this.config),
      new ReadFileTool(targetDir, this.config),
      new ReadManyFilesTool(targetDir, this.config),
      new WriteFileTool(this.config),
      new ShellTool(this.config),
      new WebFetchTool(this.config),
      new WebSearchTool(this.config),
      new MemoryTool(),
    ];

    tools.forEach((tool) => {
      this.toolRegistry.registerTool(tool);
    });
  }

  private setupHandlers(): void {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = this.toolRegistry.getAllTools();

      return {
        tools: tools.map((tool) => ({
          name: `gemini_${tool.name}`,
          description: tool.description,
          inputSchema: tool.schema.parameters || {},
        })),
      };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      // Remove 'gemini_' prefix if present
      const toolName = name.startsWith('gemini_') ? name.slice(7) : name;
      const tool = this.toolRegistry.getTool(toolName);

      if (!tool) {
        throw new Error(`Tool not found: ${toolName}`);
      }

      try {
        // Create an AbortController for cancellation support
        const abortController = new AbortController();

        // Execute the tool
        const result = await tool.execute(args || {}, abortController.signal);

        // Tool executed successfully

        // Convert result to MCP format
        // For web search, include the full LLM content for better results
        const textContent = toolName === 'google_web_search' && result.llmContent
          ? result.llmContent.toString()
          : (typeof result.returnDisplay === 'string'
              ? result.returnDisplay
              : JSON.stringify(result.returnDisplay));

        return {
          content: [
            {
              type: 'text',
              text: textContent,
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error executing tool ${toolName}: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async start(): Promise<void> {
    // Initialize config and tools first
    await this.initialize();

    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    // Log to stderr (won't interfere with MCP protocol on stdout)
    console.error('Gemini CLI MCP Server started successfully');
    console.error(`Available tools: ${this.toolRegistry.getAllTools().length}`);
  }
}

// Start server if this module is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new GeminiCliMcpServer();
  server.start().catch((error) => {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  });
}
