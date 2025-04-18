---

## 📦 Metis MCP – METIS Chain Tool Server (MCP + CLI Ready)

> A plug-and-play MCP tool server to **send METIS**, **transfer ERC-20 tokens**, **deploy tokens**, and **interact with smart contracts** on the **METIS CHAIN** — built for **Claude Desktop**, **AI agents**, and **developers.**

---

### ⚙️ Core Capabilities

- 🔐 Secure token & native transfers via CLI or MCP
- 🧱 Interact with smart contracts (ABI/function-based)
- 🔄 PancakeSwap integration for swaps & liquidity
- ⚙️ Create meme tokens & deploy ERC-20 smart contracts
- 🧠 Native Claude Desktop integration via MCP
- 🔧 CLI-ready, MCP-compliant, developer-friendly
- 🔑 Password-protected private keys

---

## 🛠 Installation & Setup

### 1. Install

```bash
npm install -g metis-mcp
```

### 2. Run the CLI Setup Wizard

```bash
metis-mcp --init
```

You’ll be prompted to enter:

- ✅ **METIS Wallet Private Key** _(required)_
- ✅ **Wallet Password** _(required, must be 6 characters)_
- ✅ **Custom RPC URL** _(optional, defaults to:_ `https://sepolia.metisdevops.link` \*)

---

## 🧠 Claude Desktop Integration

After CLI setup, the tool can **auto-configure itself into Claude Desktop**.

📍 File modified:

```
~/Library/Application Support/Claude/claude_desktop_config.json
```

Claude will detect and run this MCP server with your selected tools.

---

## 🔨 Supported MCP Tools

| Tool Name                  | Description                              |
| -------------------------- | ---------------------------------------- |
| `transferNativeToken`      | Send METIS to a wallet                   |
| `transferERC20Token`       | Transfer ERC-20 token via symbol/address |
| `getWalletInfo`            | Get wallet info for an address           |
| ...and more coming soon 🔧 |

---

## 🧪 Development Workflow

### Compile TypeScript:

```bash
npm run build
```

### Start MCP Server:

```bash
npm start
# or
node build/index.js
```

### Re-configure:

```bash
metis-mcp --init
```

---

## 📘 Model Context Protocol (MCP)

This project is built on **Model Context Protocol** – a standard to help agents and models interact with structured tool APIs.

**MCP Benefits**:

- ✅ Structured input/output
- ✅ Claude + OpenAI compatible
- ✅ Secure + serverless-ready

---

## ✅ Roadmap

- [x] CLI Configuration Wizard
- [x] Claude Desktop Integration
- [x] Token Transfer
- [ ] Token charting tools (DEXTools, Gecko)
- [ ] Telegram auto-trading agent
- [ ] AI assistant with Metis on-chain brain

---

## 🤝 Contributing

Feel free to fork, PR, or raise issues.
We're building **tool-first, AI-ready infrastructure** for the next wave of Web3 agents. Join us!

---

## 🛡️ License

MIT — Use freely, contribute openly.

---
