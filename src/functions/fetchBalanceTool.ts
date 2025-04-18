import { JsonRpcProvider, formatEther } from "ethers";
// Dùng URL từ .env
const RPC_URL = process.env.METIS_RPC_URL!;
const provider = new JsonRpcProvider(RPC_URL, Number(process.env.METIS_CHAIN_ID));

/**
 * Trả về balance (in wei) của address trên Metis Sepolia Devnet
 */
export async function getBalance(address: string): Promise<{ balance: string }> {
  // provider.getBalance trả về BigNumber
  const bal = await provider.getBalance(address);
  return { balance: formatEther(bal) };
}