#!/usr/bin/env node

/**
 * MCP Client Test Script
 * Tests connection to Gemini CLI MCP Server
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

async function testMcpClient() {
  console.log('Starting MCP client test...');

  // Spawn the Gemini CLI MCP server
  const serverProcess = spawn(
    'node',
    ['packages/cli/dist/index.js', '--serve-mcp'],
    {
      stdio: ['pipe', 'pipe', 'inherit'], // stdin/stdout for MCP, stderr for logs
    },
  );

  // Create MCP client
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['packages/cli/dist/index.js', '--serve-mcp'],
  });

  const client = new Client(
    {
      name: 'test-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    },
  );

  try {
    // Connect to server
    await client.connect(transport);
    console.log('✅ Connected to MCP server');

    // List available tools
    const toolsResponse = await client.listTools();
    console.log(`✅ Found ${toolsResponse.tools.length} tools:`);

    toolsResponse.tools.forEach((tool, index) => {
      console.log(
        `  ${index + 1}. ${tool.name} - ${tool.description?.substring(0, 100)}...`,
      );
    });

    // Test a simple tool call (list_directory)
    console.log('\n🔧 Testing gemini_list_directory tool...');
    const result = await client.callTool({
      name: 'gemini_list_directory',
      arguments: {
        path: process.cwd(),
      },
    });

    console.log('✅ Tool call successful!');
    console.log(
      'Result preview:',
      JSON.stringify(result).substring(0, 200) + '...',
    );
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await client.close();
    serverProcess.kill();
    console.log('🔚 Test completed');
  }
}

testMcpClient().catch(console.error);
