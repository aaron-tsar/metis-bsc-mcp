import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";
dotenv.config();

// Import tool registrations
import { registerTransferNativeToken } from "./tools/transferNativeToken.js";
import { registerTransferERC20Token } from "./tools/registerTransferERC20Token.js";
import { registerGetWalletInfo } from "./tools/getWalletInfo.js";

// Main server entry
export async function main() {
    const server = new McpServer({
        name: "metis-mcp",
        version: "0.1.0"
    });

    // Register all tools
    registerTransferNativeToken(server);
    registerTransferERC20Token(server);
    registerGetWalletInfo(server);

    const transport = new StdioServerTransport();

    transport.onmessage = (message /** @type {JSONRPCMessage} */) => {
        console.log("📩 Received message:", JSON.stringify(message, null, 2));
    };

    transport.onerror = (error) => {
        console.error("🚨 Transport error:", error);
    };

    await server.connect(transport);
}
