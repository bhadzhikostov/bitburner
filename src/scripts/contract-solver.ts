/**
 * Contract Solver Script
 * Automatically finds and solves coding contracts across all accessible servers
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
  hasContractSolver,
  getSupportedContractTypes
} from '../utils/contract-solvers';
import { log } from '../utils/helpers';

interface ContractAttempt {
  hostname: string;
  filename: string;
  type: string;
  success: boolean;
  attempts: number;
  maxAttempts: number;
}

class ContractSolver {
  private ns: NS;
  private stats: {
    totalFound: number;
    totalSolved: number;
    totalFailed: number;
    totalAttempts: number;
    attempts: ContractAttempt[];
  };

  constructor(ns: NS) {
    this.ns = ns;
    this.stats = {
      totalFound: 0,
      totalSolved: 0,
      totalFailed: 0,
      totalAttempts: 0,
      attempts: []
    };
  }

  /**
   * Main execution method
   */
  async run(): Promise<void> {
    log(this.ns, 'Starting contract solver...', 'INFO');

    // Display supported contract types
    this.displaySupportedTypes();

    // Find all contracts
    const contracts = findAllContracts(this.ns);
    this.stats.totalFound = contracts.length;

    if (contracts.length === 0) {
      log(this.ns, 'No contracts found.', 'INFO');
      return;
    }

    log(this.ns, `Found ${contracts.length} contract(s)`, 'INFO');

    // Process each contract
    for (const contract of contracts) {
      await this.processContract(contract.hostname, contract.filename);
    }

    // Display final statistics
    this.displayStats();
  }

  /**
   * Process a single contract
   */
  private async processContract(hostname: string, filename: string): Promise<void> {
    log(this.ns, `Processing contract: ${filename} on ${hostname}`, 'INFO');

    const contractInfo = getContractInfo(this.ns, hostname, filename);
    if (!contractInfo) {
      log(this.ns, `Failed to get contract info for ${filename}`, 'ERROR');
      return;
    }

    log(this.ns, `Contract type: ${contractInfo.type}`, 'INFO');
    log(this.ns, `Description: ${contractInfo.description}`, 'INFO');
    log(this.ns, `Data: ${formatContractData(contractInfo.data)}`, 'INFO');
    log(this.ns, `Attempts: ${contractInfo.numTries}/${contractInfo.maxTries}`, 'INFO');

    // Check if we have a solver for this contract type
    if (!hasContractSolver(contractInfo.type)) {
      log(this.ns, `No solver available for contract type: ${contractInfo.type}`, 'WARN');
      return;
    }

    // Check if contract is worth attempting
    if (!isContractWorthAttempting(contractInfo)) {
      log(this.ns, `Contract ${filename} has no attempts remaining`, 'WARN');
      return;
    }

    // Attempt to solve the contract
    const solver = getContractSolver(contractInfo.type);
    if (!solver) {
      log(this.ns, `Failed to get solver for ${contractInfo.type}`, 'ERROR');
      return;
    }

    try {
      const solution = solver(contractInfo.data);
      log(this.ns, `Generated solution: ${formatContractData(solution)}`, 'INFO');

      const result = attemptContract(this.ns, hostname, filename, solution);

      // Record attempt
      const attempt: ContractAttempt = {
        hostname,
        filename,
        type: contractInfo.type,
        success: result.success,
        attempts: contractInfo.numTries + 1,
        maxAttempts: contractInfo.maxTries
      };

      this.stats.attempts.push(attempt);
      this.stats.totalAttempts += 1;

      if (result.success) {
        this.stats.totalSolved += 1;
        log(this.ns, `Successfully solved contract ${filename}!`, 'INFO');
        log(this.ns, `Reward: ${result.reward}`, 'INFO');
      } else {
        this.stats.totalFailed += 1;
        log(this.ns, `Failed to solve contract ${filename}`, 'WARN');
        log(this.ns, `Message: ${result.message}`, 'WARN');
      }

    } catch (error) {
      log(this.ns, `Error solving contract ${filename}: ${error}`, 'ERROR');
      this.stats.totalFailed += 1;
    }

    // Small delay between contracts
    await this.ns.sleep(100);
  }

  /**
   * Display supported contract types
   */
  private displaySupportedTypes(): void {
    const supportedTypes = getSupportedContractTypes();
    log(this.ns, `Supported contract types (${supportedTypes.length}):`, 'INFO');

    for (const type of supportedTypes) {
      log(this.ns, `  - ${type}`, 'INFO');
    }
  }

  /**
   * Display final statistics
   */
  private displayStats(): void {
    log(this.ns, '=== Contract Solver Statistics ===', 'INFO');
    log(this.ns, `Total contracts found: ${this.stats.totalFound}`, 'INFO');
    log(this.ns, `Total contracts solved: ${this.stats.totalSolved}`, 'INFO');
    log(this.ns, `Total contracts failed: ${this.stats.totalFailed}`, 'INFO');
    log(this.ns, `Total attempts made: ${this.stats.totalAttempts}`, 'INFO');

    if (this.stats.totalFound > 0) {
      const successRate = (this.stats.totalSolved / this.stats.totalFound) * 100;
      log(this.ns, `Success rate: ${successRate.toFixed(1)}%`, 'INFO');
    }

    // Display individual contract results
    if (this.stats.attempts.length > 0) {
      log(this.ns, '=== Individual Contract Results ===', 'INFO');

      for (const attempt of this.stats.attempts) {
        const status = attempt.success ? 'SUCCESS' : 'FAILED';
        log(this.ns, `${attempt.filename} (${attempt.hostname}): ${status}`, 'INFO');
      }
    }
  }
}

/**
 * Main function
 */
export async function main(ns: NS): Promise<void> {
  const solver = new ContractSolver(ns);
  await solver.run();
}

// Auto-execute if run directly
if (typeof ns !== 'undefined') {
  main(ns).catch(error => {
    ns.tprint(`Error in contract solver: ${error}`);
  });
}
