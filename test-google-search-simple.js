#!/usr/bin/env node

/**
 * Simple Google Search Test
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function testSearch() {
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['packages/cli/dist/index.js', '--serve-mcp']
  });

  const client = new Client(
    { name: 'test-client', version: '1.0.0' },
    { capabilities: {} }
  );

  try {
    await client.connect(transport);
    console.log('Connected to MCP server');

    // Test Google search
    const result = await client.callTool({
      name: 'gemini_google_web_search',
      arguments: { query: 'hello world' }
    });

    console.log('Search result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testSearch();