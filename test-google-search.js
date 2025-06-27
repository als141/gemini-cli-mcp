#!/usr/bin/env node

/**
 * Google Search Test for MCP Server
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

async function testGoogleSearch() {
  console.log('Starting Google Search test...');

  // Check for API key
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY environment variable not set');
    console.log('Please set your Gemini API key:');
    console.log('export GEMINI_API_KEY="your-api-key-here"');
    process.exit(1);
  }

  console.log('✅ GEMINI_API_KEY is set');

  // Create MCP client
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['packages/cli/dist/index.js', '--serve-mcp'],
    env: {
      ...process.env,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY
    }
  });

  const client = new Client(
    {
      name: 'test-google-search-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  try {
    // Connect to server
    console.log('🔌 Connecting to MCP server...');
    await client.connect(transport);
    console.log('✅ Connected to MCP server');

    // List available tools
    const toolsResponse = await client.listTools();
    console.log(`✅ Found ${toolsResponse.tools.length} tools`);
    
    const googleSearchTool = toolsResponse.tools.find(tool => 
      tool.name === 'gemini_google_web_search'
    );
    
    if (!googleSearchTool) {
      console.error('❌ Google search tool not found');
      return;
    }
    
    console.log('✅ Google search tool found:', googleSearchTool.name);

    // Test Google search
    console.log('\n🔍 Testing Google search...');
    const searchResult = await client.callTool({
      name: 'gemini_google_web_search',
      arguments: {
        query: 'Model Context Protocol MCP 2024'
      }
    });

    console.log('✅ Search completed!');
    console.log('Result:', JSON.stringify(searchResult, null, 2));

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await client.close();
    console.log('🔚 Test completed');
  }
}

testGoogleSearch().catch(console.error);