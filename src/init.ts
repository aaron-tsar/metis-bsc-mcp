import prompts, { PromptObject } from 'prompts';
import figlet from 'figlet';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';
import os from 'os';
import { fileURLToPath } from 'url';
import { encryptPrivateKey } from './PrivateAES.js';

import dotenv from "dotenv";
import { Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
dotenv.config();

// Binance Gold Color
const yellow = chalk.hex('#F0B90B');

// ESModule __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cancel handler
const onCancel = () => {
    console.log(chalk.red('\n❌ Configuration cancelled by user (Ctrl+C or ESC). Exiting...'));
    process.exit(0);
};

// Show Banner
const showBanner = () => {
    const banner = figlet.textSync('METIS MCP', { font: 'Big' });
    console.log(yellow(banner));
    console.log(yellow('🚀 Welcome to the METIS MCP Configurator\n'));
};

// User Input Types
interface UserInputs {
    walletPassword: string;
    privateKey: string;
    rpcUrl?: string;
}
function validatePassword(password: string) {
    // 至少8个字符
    if (password.trim() === '') return 'Wallet Password is required!';
    if (password.length < 8 || password.length > 128) return 'Wallet Password must be between 8 and 128 characters!';
    
    // 检查是否包含至少一个小写字母
    if (!/[a-z]/.test(password)) return  'Wallet Password contains at least one lowercase letter!';
    
    // 检查是否包含至少一个大写字母
    if (!/[A-Z]/.test(password)) return  'Wallet Password contains at least one uppercase letter!';
    
    // 检查是否包含至少一个数字
    if (!/[0-9]/.test(password)) return 'Wallet Password contains at least one number!';
    
    // 检查是否包含至少一个特殊字符
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return  'Wallet Password contains at least one special character!(!@#$%^&*()_+-=[]{};\':\"|,.<>\/?)';
    
    return true;
  }
// Ask for credentials
const getInputs = async (): Promise<UserInputs> => {
    const questions: PromptObject[] = [
        {
            type: 'password',
            name: 'walletPassword',
            message: '🔐 Enter your Wallet Password (The password must be between 8 and 128 characters):',
            validate: (val: string) => {
                return validatePassword(val);
            },
        },
        {
            type: 'password',
            name: 'privateKey',
            message: '🔑 Enter your METIS Wallet Private Key:',
            validate: (val: string) =>
                val.trim() === '' ? 'Private key is required!' : true,
        },
        {
            type: 'text',
            name: 'rpcUrl',
            message: '🌐 Enter your METIS RPC URL (optional):',
        },
    ];

    return await prompts(questions, { onCancel }) as UserInputs;
};

// Generate .env file
const generateEnvFile = async (privateKey: string, address: string, rpcUrl?: string, ): Promise<void> => {
    const envContent = `
METIS_WALLET_PRIVATE_KEY=${privateKey}
METIS_WALLET_ADDRESS=${address}
METIS_RPC_URL=${rpcUrl || ''}
METIS_CHAIN_ID=59902
`.trim();

    await fs.writeFile('.env', envContent);
    console.log(yellow('✅ .env file generated.'));
};

// Generate config object
const generateConfig = async (privateKey: string, address: string, rpcUrl?: string, ): Promise<any> => {
    const indexPath = path.resolve(__dirname, '..', 'build', 'index.js'); // one level up from cli/

    return {
        'metis-mcp': {
            command: 'node',
            args: [indexPath],
            env: {
                METIS_WALLET_PRIVATE_KEY: privateKey,
                METIS_WALLET_ADDRESS: address,
                METIS_RPC_URL: rpcUrl || '',
            },
            disabled: false,
            autoApprove: []
        }
    };
};

// Configure Claude Desktop
const configureClaude = async (config: object): Promise<boolean> => {
    const userHome = os.homedir();
    let claudePath;
    const platform = os.platform();
    if (platform == "darwin") {
        claudePath = path.join(userHome, 'Library/Application Support/Claude/claude_desktop_config.json');
    } else if (platform == "win32") {
        claudePath = path.join(userHome, 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json');
    } else {
        console.log(chalk.red('❌ Unsupported platform.'));
        return false;
    }
    
    if (!fs.existsSync(claudePath)) {
        console.log(chalk.yellow('⚠️ Claude config file not found. Creating a new one with default configuration.'));
        // Create a default configuration object
        const defaultConfig = {
            mcpServers: {}
        };
        // Write the default configuration to the file
        await fs.writeJSON(claudePath, defaultConfig, { spaces: 2 });
    }

    
    const jsonData = fs.readFileSync(claudePath, 'utf8');
    const data = JSON.parse(jsonData);
    
    data.mcpServers = {
        ...data.mcpServers,
        ...config,
    };
    
    await fs.writeJSON(claudePath, data, { spaces: 2 });
    console.log(yellow('✅ METIS MCP configured for Claude Desktop. Please RESTART your Claude to enjoy it 🎉'));
    return true;
};

// Save fallback config file
const saveFallbackConfig = async (config: object): Promise<void> => {
    await fs.writeJSON('config.json', config, { spaces: 2 });
    console.log(yellow('📁 Saved config.json in root project folder.'));
};

// Main logic
const init = async () => {
    showBanner();

    const { privateKey, rpcUrl, walletPassword } = await getInputs();
    const _0xPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`
    const account = privateKeyToAccount(
        _0xPrivateKey as Hex
    );

    const privateKeyEncrypt = await encryptPrivateKey(_0xPrivateKey, walletPassword);

    await generateEnvFile(privateKeyEncrypt, account.address, rpcUrl);

    const config = await generateConfig(privateKeyEncrypt, account.address, rpcUrl);

    const { setupClaude } = await prompts({
        type: 'confirm',
        name: 'setupClaude',
        message: '🧠 Do you want to configure in Claude Desktop?',
        initial: true
    }, { onCancel });

    if (setupClaude) {
        const success = await configureClaude(config);
        if (!success) {
            await saveFallbackConfig(config);
        }
    } else {
        await saveFallbackConfig(config);
    }
};

init(); 