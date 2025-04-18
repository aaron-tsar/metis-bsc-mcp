import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  JsonRpcProvider,
  Wallet,
  Contract,
  parseUnits,
  isAddress
} from "ethers";
import { erc20Abi } from "../lib/erc20Abi.js";
import { buildTxUrl, checkTransactionHash } from "../util.js";

// RPC endpoint của Metis (mainnet)
const METIS_RPC_URL =
  process.env.METIS_RPC_URL ||
  "https://sepolia.metisdevops.link";

export function registerTransferERC20Token(server: McpServer) {
  server.tool(
    "Send_ERC20_Token",
    "📤 Send any ERC-20 token to another wallet on Metis (requires wallet check first)",
    {
      recipientAddress: z
        .string()
        .refine((addr) => isAddress(addr), {
          message: "Invalid recipient address",
        }),
      amount: z.string(), // sẽ parse dựa trên decimals
      tokenAddress: z
        .string()
        .refine((addr) => isAddress(addr), {
          message: "Invalid token contract address",
        }),
    },
    async ({ recipientAddress, amount, tokenAddress }) => {
      try {
        // 1. Khởi tạo provider + wallet từ PRIVATE_KEY
        const provider = new JsonRpcProvider(METIS_RPC_URL);
        const privateKey = process.env.PRIVATE_KEY;
        if (!privateKey) {
          throw new Error(
            "Server private key not configured. Set PRIVATE_KEY in env."
          );
        }
        const wallet = new Wallet(privateKey, provider);

        // 2. Tạo instance contract ERC‑20
        const contract = new Contract(tokenAddress, erc20Abi, wallet);

        // 3. Lấy decimals và parse amount
        const decimals: number = await contract.decimals();
        const parsedAmount = parseUnits(amount, decimals);

        // 4. Gửi transaction
        const txResponse = await contract.transfer(
          recipientAddress,
          parsedAmount,
          { gasLimit: 100_000 }
        );

        // 5. Ép kiểu hash về template literal `0x${string}` để TS không complain
        const txHash = txResponse.hash as `0x${string}`;
        const txUrl = await checkTransactionHash(txHash);

        return {
          content: [
            {
              type: "text",
              text: `✅ ERC-20 token transfer sent successfully! ${txUrl}`,
              url: txUrl,
            },
          ],
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        // Nếu muốn, bạn có thể build URL từ txHash trong trường hợp một phần tx đã đi qua
        return {
          content: [
            {
              type: "text",
              text: `❌ Transaction failed: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
