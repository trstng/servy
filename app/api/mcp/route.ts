import { NextRequest, NextResponse } from 'next/server'
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { tools, handleToolCall } from '@/lib/mcp/tools'

// Create MCP server
const server = new Server(
  {
    name: 'servy',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
)

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: tools,
  }
})

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name: toolName, arguments: args } = request.params

  try {
    const result = await handleToolCall(toolName, args || {})
    return result
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    }
  }
})

// Create transport
const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: () => crypto.randomUUID(),
})

// Connect server to transport
server.connect(transport)

// POST handler for MCP protocol
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Create a mock Node.js request/response for the transport
    // The transport expects Node.js IncomingMessage and ServerResponse
    // We'll handle this differently by directly processing the message

    // Send message to server
    await transport.onmessage?.(body)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('MCP Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

// GET handler - return server info
export async function GET() {
  return NextResponse.json({
    name: 'Servy MCP Server',
    version: '1.0.0',
    description: 'MCP server for booking home services',
    tools: tools.map((t) => ({ name: t.name, description: t.description })),
  })
}
