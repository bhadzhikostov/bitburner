/**
 * Contract Manager Script
 * Advanced contract management with monitoring, filtering, and batch operations
 */

import {
  findAllContracts,
  getContractInfo,
  attemptContract,
  formatContractData,
  isContractWorthAttempting
} from '../utils/contract-helpers';
import {
  getContractSolver,
  hasContractSolver
} from '../utils/contract-solvers';
import { log } from '../utils/helpers';
import { CodingContract, ContractStats } from '../types/contracts';

interface ContractInfo {
  hostname: string;
  filename: string;
  contract: CodingContract;
  hasSolver: boolean;
  worthAttempting: boolean;
}

interface ContractFilter {
  types?: string[];
  hasSolver?: boolean;
  worthAttempting?: boolean;
  servers?: string[];
}

class ContractManager {
  private ns: NS;
  private contracts: ContractInfo[] = [];
  private stats: ContractStats;

  constructor(ns: NS) {
    this.ns = ns;
    this.stats = {
      totalAttempted: 0,
      totalSolved: 0,
      totalFailed: 0,
      successRate: 0,
      averageAttempts: 0
    };
  }

  /**
   * Main execution method
   */
  async run(): Promise<void> {
    log(this.ns, 'Starting contract manager...', 'INFO');

    // Parse command line arguments
    const args = this.ns.args;
    const command = args[0] || 'help';

    switch (command) {
      case 'scan':
        await this.scanContracts();
        break;
      case 'list':
        await this.listContracts();
        break;
      case 'solve':
        await this.solveContracts();
        break;
      case 'solve-type':
        const contractType = args[1];
        if (!contractType) {
          log(this.ns, 'Usage: run contract-manager.js solve-type <contract-type>', 'ERROR');
          return;
        }
        await this.solveContractsByType(contractType);
        break;
      case 'solve-server':
        const server = args[1];
        if (!server) {
          log(this.ns, 'Usage: run contract-manager.js solve-server <server>', 'ERROR');
          return;
        }
        await this.solveContractsOnServer(server);
        break;
      case 'stats':
        await this.showStats();
        break;
      case 'help':
      default:
        this.showHelp();
        break;
    }
  }

  /**
   * Scan for all contracts and store them
   */
  private async scanContracts(): Promise<void> {
    log(this.ns, 'Scanning for contracts...', 'INFO');

    const contractFiles = findAllContracts(this.ns);
    this.contracts = [];

    for (const { hostname, filename } of contractFiles) {
      const contract = getContractInfo(this.ns, hostname, filename);
      if (contract) {
        this.contracts.push({
          hostname,
          filename,
          contract,
          hasSolver: hasContractSolver(contract.type),
          worthAttempting: isContractWorthAttempting(contract)
        });
      }
    }

    log(this.ns, `Found ${this.contracts.length} contract(s)`, 'INFO');
    this.updateStats();
  }

  /**
   * List all contracts with filtering options
   */
  private async listContracts(): Promise<void> {
    if (this.contracts.length === 0) {
      await this.scanContracts();
    }

    const args = this.ns.args;
    const filter: ContractFilter = {};

    // Parse filter arguments
    if (args.includes('--has-solver')) filter.hasSolver = true;
    if (args.includes('--worth-attempting')) filter.worthAttempting = true;
    if (args.includes('--no-solver')) filter.hasSolver = false;

    // Filter contracts
    let filteredContracts = this.contracts;

    if (filter.hasSolver !== undefined) {
      filteredContracts = filteredContracts.filter(c => c.hasSolver === filter.hasSolver);
    }

    if (filter.worthAttempting !== undefined) {
      filteredContracts = filteredContracts.filter(c => c.worthAttempting === filter.worthAttempting);
    }

    // Display contracts
    log(this.ns, `=== Contracts (${filteredContracts.length}/${this.contracts.length}) ===`, 'INFO');

    for (const contractInfo of filteredContracts) {
      const status = this.getContractStatus(contractInfo);
      log(this.ns, `${contractInfo.filename} (${contractInfo.hostname}): ${status}`, 'INFO');
      log(this.ns, `  Type: ${contractInfo.contract.type}`, 'INFO');
      log(this.ns, `  Attempts: ${contractInfo.contract.numTries}/${contractInfo.contract.maxTries}`, 'INFO');
      log(this.ns, `  Solver: ${contractInfo.hasSolver ? 'Available' : 'Not available'}`, 'INFO');
    }
  }

  /**
   * Solve all contracts that can be solved
   */
  private async solveContracts(): Promise<void> {
    if (this.contracts.length === 0) {
      await this.scanContracts();
    }

    const solvableContracts = this.contracts.filter(c => c.hasSolver && c.worthAttempting);

    if (solvableContracts.length === 0) {
      log(this.ns, 'No contracts available to solve', 'INFO');
      return;
    }

    log(this.ns, `Solving ${solvableContracts.length} contract(s)...`, 'INFO');

    for (const contractInfo of solvableContracts) {
      await this.solveContract(contractInfo);
    }

    this.updateStats();
    await this.showStats();
  }

  /**
   * Solve contracts of a specific type
   */
  private async solveContractsByType(contractType: string): Promise<void> {
    if (this.contracts.length === 0) {
      await this.scanContracts();
    }

    const typeContracts = this.contracts.filter(c =>
      c.contract.type === contractType && c.hasSolver && c.worthAttempting
    );

    if (typeContracts.length === 0) {
      log(this.ns, `No contracts of type '${contractType}' available to solve`, 'INFO');
      return;
    }

    log(this.ns, `Solving ${typeContracts.length} contract(s) of type '${contractType}'...`, 'INFO');

    for (const contractInfo of typeContracts) {
      await this.solveContract(contractInfo);
    }

    this.updateStats();
  }

  /**
   * Solve contracts on a specific server
   */
  private async solveContractsOnServer(server: string): Promise<void> {
    if (this.contracts.length === 0) {
      await this.scanContracts();
    }

    const serverContracts = this.contracts.filter(c =>
      c.hostname === server && c.hasSolver && c.worthAttempting
    );

    if (serverContracts.length === 0) {
      log(this.ns, `No contracts on server '${server}' available to solve`, 'INFO');
      return;
    }

    log(this.ns, `Solving ${serverContracts.length} contract(s) on server '${server}'...`, 'INFO');

    for (const contractInfo of serverContracts) {
      await this.solveContract(contractInfo);
    }

    this.updateStats();
  }

  /**
   * Solve a single contract
   */
  private async solveContract(contractInfo: ContractInfo): Promise<void> {
    const { hostname, filename, contract } = contractInfo;

    log(this.ns, `Solving contract: ${filename} on ${hostname}`, 'INFO');

    const solver = getContractSolver(contract.type);
    if (!solver) {
      log(this.ns, `No solver available for ${contract.type}`, 'ERROR');
      return;
    }

    try {
      const solution = solver(contract.data);
      log(this.ns, `Generated solution: ${formatContractData(solution)}`, 'INFO');

      const result = attemptContract(this.ns, hostname, filename, solution);
      if (result.success) {
        this.ns.tprint(`SUCCESS: Solved contract ${filename}!`);
        this.stats.totalSolved += 1;
      } else {
        this.ns.tprint(`WARN: Failed to solve contract ${filename}`);
        this.stats.totalFailed += 1;
      }

      this.stats.totalAttempted += 1;

    } catch (error) {
      log(this.ns, `Error solving contract ${filename}: ${error}`, 'ERROR');
      this.stats.totalFailed += 1;
      this.stats.totalAttempted += 1;
    }

    // Small delay between contracts
    await this.ns.sleep(100);
  }

  /**
   * Get contract status string
   */
  private getContractStatus(contractInfo: ContractInfo): string {
    if (!contractInfo.hasSolver) return 'NO_SOLVER';
    if (!contractInfo.worthAttempting) return 'NO_ATTEMPTS_LEFT';
    return 'READY_TO_SOLVE';
  }

  /**
   * Update statistics
   */
  private updateStats(): void {
    const totalAttempts = this.contracts.reduce((sum, c) => sum + c.contract.numTries, 0);

    this.stats = {
      totalAttempted: this.stats.totalAttempted,
      totalSolved: this.stats.totalSolved,
      totalFailed: this.stats.totalFailed,
      successRate: this.stats.totalAttempted > 0 ?
        (this.stats.totalSolved / this.stats.totalAttempted) * 100 : 0,
      averageAttempts: this.stats.totalAttempted > 0 ?
        totalAttempts / this.stats.totalAttempted : 0
    };
  }

  /**
   * Show statistics
   */
  private async showStats(): Promise<void> {
    if (this.contracts.length === 0) {
      await this.scanContracts();
    }

    log(this.ns, '=== Contract Manager Statistics ===', 'INFO');
    log(this.ns, `Total contracts found: ${this.contracts.length}`, 'INFO');
    log(this.ns, `Contracts with solvers: ${this.contracts.filter(c => c.hasSolver).length}`, 'INFO');
    log(this.ns, `Contracts ready to solve: ${this.contracts.filter(c => c.hasSolver && c.worthAttempting).length}`, 'INFO');
    log(this.ns, `Total attempted: ${this.stats.totalAttempted}`, 'INFO');
    log(this.ns, `Total solved: ${this.stats.totalSolved}`, 'INFO');
    log(this.ns, `Total failed: ${this.stats.totalFailed}`, 'INFO');
    log(this.ns, `Success rate: ${this.stats.successRate.toFixed(1)}%`, 'INFO');
    log(this.ns, `Average attempts per contract: ${this.stats.averageAttempts.toFixed(1)}`, 'INFO');
  }

  /**
   * Show help information
   */
  private showHelp(): void {
    log(this.ns, '=== Contract Manager Help ===', 'INFO');
    log(this.ns, 'Usage: run contract-manager.js <command> [options]', 'INFO');
    log(this.ns, '', 'INFO');
    log(this.ns, 'Commands:', 'INFO');
    log(this.ns, '  scan                    - Scan for all contracts', 'INFO');
    log(this.ns, '  list [options]          - List contracts with optional filtering', 'INFO');
    log(this.ns, '  solve                   - Solve all available contracts', 'INFO');
    log(this.ns, '  solve-type <type>       - Solve contracts of specific type', 'INFO');
    log(this.ns, '  solve-server <server>   - Solve contracts on specific server', 'INFO');
    log(this.ns, '  stats                   - Show statistics', 'INFO');
    log(this.ns, '  help                    - Show this help', 'INFO');
    log(this.ns, '', 'INFO');
    log(this.ns, 'List options:', 'INFO');
    log(this.ns, '  --has-solver            - Only show contracts with available solvers', 'INFO');
    log(this.ns, '  --worth-attempting      - Only show contracts that can be attempted', 'INFO');
    log(this.ns, '  --no-solver             - Only show contracts without solvers', 'INFO');
    log(this.ns, '', 'INFO');
    log(this.ns, 'Examples:', 'INFO');
    log(this.ns, '  run contract-manager.js scan', 'INFO');
    log(this.ns, '  run contract-manager.js list --has-solver', 'INFO');
    log(this.ns, '  run contract-manager.js solve', 'INFO');
    log(this.ns, '  run contract-manager.js solve-type "Array Jumping Game"', 'INFO');
    log(this.ns, '  run contract-manager.js solve-server "n00dles"', 'INFO');
  }
}

/**
 * Main function
 */
export async function main(ns: NS): Promise<void> {
  const manager = new ContractManager(ns);
  await manager.run();
}

// Auto-execute if run directly
if (typeof ns !== 'undefined') {
  main(ns).catch(error => {
    ns.tprint(`Error in contract manager: ${error}`);
  });
}
