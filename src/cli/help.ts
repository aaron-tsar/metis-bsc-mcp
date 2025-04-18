// src/cli/help.ts
export function printHelp(): void {
    console.log(`
  📦 METIS MCP CLI
  
  Usage:
    metis-mcp [options]
  
  Options:
    -i, --init      Initialize configuration
    -v, --version   Show CLI version
    -h, --help      Show help info
  
  Examples:
    metis-mcp --init
    metis-mcp --version
    metis-mcp
    `);
}