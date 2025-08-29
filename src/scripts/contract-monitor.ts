/**
 * Contract Monitor Script
 * Continuously monitors for new contracts and automatically solves them
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
import { CodingContract } from '../types/contracts';

interface MonitoredContract {
  hostname: string;
  filename: string;
  contract: CodingContract;
  lastChecked: number;
  attempts: number;
}

class ContractMonitor {
  private ns: NS;
  private monitoredContracts: Map<string, MonitoredContract> = new Map();
  private scanInterval: number;
  private solveInterval: number;
  private stats: {
    totalFound: number;
    totalSolved: number;
    totalFailed: number;
    lastScan: number;
  };

  constructor(ns: NS) {
    this.ns = ns;
    this.scanInterval = 30000; // 30 seconds
    this.solveInterval = 5000;  // 5 seconds
    this.stats = {
      totalFound: 0,
      totalSolved: 0,
      totalFailed: 0,
      lastScan: 0
    };
  }

  /**
   * Main execution method
   */
  async run(): Promise<void> {
    log(this.ns, 'Starting contract monitor...', 'INFO');

    // Parse command line arguments
    const args = this.ns.args;

    if (args.includes('--help') || args.includes('-h')) {
      this.showHelp();
      return;
    }

    // Set custom intervals if provided
    if (args.includes('--scan-interval')) {
      const index = args.indexOf('--scan-interval');
      if (index + 1 < args.length) {
        const value = args[index + 1];
        if (value) {
          this.scanInterval = parseInt(value) * 1000;
        }
      }
    }

    if (args.includes('--solve-interval')) {
      const index = args.indexOf('--solve-interval');
      if (index + 1 < args.length) {
        const value = args[index + 1];
        if (value) {
          this.solveInterval = parseInt(value) * 1000;
        }
      }
    }

    log(this.ns, `Scan interval: ${this.scanInterval / 1000}s`, 'INFO');
    log(this.ns, `Solve interval: ${this.solveInterval / 1000}s`, 'INFO');

    // Start monitoring
    await this.startMonitoring();
  }

  /**
   * Start the monitoring process
   */
  private async startMonitoring(): Promise<void> {
    log(this.ns, 'Starting continuous monitoring...', 'INFO');

    // Initial scan
    await this.scanForNewContracts();

    // Start monitoring loop
    while (true) {
      try {
        // Check for new contracts
        if (Date.now() - this.stats.lastScan >= this.scanInterval) {
          await this.scanForNewContracts();
        }

        // Try to solve contracts
        await this.trySolveContracts();

        // Display status
        this.displayStatus();

        // Wait before next iteration
        await this.ns.sleep(this.solveInterval);

      } catch (error) {
        log(this.ns, `Error in monitoring loop: ${error}`, 'ERROR');
        await this.ns.sleep(10000); // Wait 10 seconds on error
      }
    }
  }

  /**
   * Scan for new contracts
   */
  private async scanForNewContracts(): Promise<void> {
    log(this.ns, 'Scanning for new contracts...', 'INFO');

    const contractFiles = findAllContracts(this.ns);
    let newContracts = 0;

    for (const { hostname, filename } of contractFiles) {
      const key = `${hostname}:${filename}`;

      if (!this.monitoredContracts.has(key)) {
        const contract = getContractInfo(this.ns, hostname, filename);
        if (contract) {
          this.monitoredContracts.set(key, {
            hostname,
            filename,
            contract,
            lastChecked: Date.now(),
            attempts: 0
          });
          newContracts++;
        }
      }
    }

    this.stats.lastScan = Date.now();

    if (newContracts > 0) {
      log(this.ns, `Found ${newContracts} new contract(s)`, 'INFO');
      this.stats.totalFound += newContracts;
    }

    // Remove contracts that no longer exist
    const existingKeys = new Set(contractFiles.map(c => `${c.hostname}:${c.filename}`));
    for (const [key] of this.monitoredContracts) {
      if (!existingKeys.has(key)) {
        this.monitoredContracts.delete(key);
      }
    }
  }

  /**
   * Try to solve available contracts
   */
  private async trySolveContracts(): Promise<void> {
    const solvableContracts = Array.from(this.monitoredContracts.values())
      .filter(c => hasContractSolver(c.contract.type) && isContractWorthAttempting(c.contract));

    if (solvableContracts.length === 0) {
      return;
    }

    log(this.ns, `Attempting to solve ${solvableContracts.length} contract(s)...`, 'INFO');

    for (const contractInfo of solvableContracts) {
      await this.solveContract(contractInfo);
    }
  }

  /**
   * Solve a single contract
   */
  private async solveContract(contractInfo: MonitoredContract): Promise<void> {
    const { hostname, filename, contract } = contractInfo;
    const key = `${hostname}:${filename}`;

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
        log(this.ns, `Successfully solved contract ${filename}!`, 'INFO');
        this.stats.totalSolved += 1;

        // Remove solved contract from monitoring
        this.monitoredContracts.delete(key);
      } else {
        log(this.ns, `Failed to solve contract ${filename}`, 'WARN');
        this.stats.totalFailed += 1;

        // Update attempt count
        contractInfo.attempts += 1;
        contractInfo.lastChecked = Date.now();
      }

    } catch (error) {
      log(this.ns, `Error solving contract ${filename}: ${error}`, 'ERROR');
      this.stats.totalFailed += 1;

      // Update attempt count
      contractInfo.attempts += 1;
      contractInfo.lastChecked = Date.now();
    }

    // Small delay between contracts
    await this.ns.sleep(100);
  }

  /**
   * Display current status
   */
  private displayStatus(): void {
    const now = Date.now();
    const timeSinceLastScan = Math.floor((now - this.stats.lastScan) / 1000);

    log(this.ns, `=== Contract Monitor Status ===`, 'INFO');
    log(this.ns, `Time since last scan: ${timeSinceLastScan}s`, 'INFO');
    log(this.ns, `Contracts being monitored: ${this.monitoredContracts.size}`, 'INFO');
    log(this.ns, `Total contracts found: ${this.stats.totalFound}`, 'INFO');
    log(this.ns, `Total contracts solved: ${this.stats.totalSolved}`, 'INFO');
    log(this.ns, `Total contracts failed: ${this.stats.totalFailed}`, 'INFO');

    if (this.stats.totalFound > 0) {
      const successRate = (this.stats.totalSolved / this.stats.totalFound) * 100;
      log(this.ns, `Success rate: ${successRate.toFixed(1)}%`, 'INFO');
    }

    // Show contracts being monitored
    if (this.monitoredContracts.size > 0) {
      log(this.ns, '=== Monitored Contracts ===', 'INFO');

      for (const [, contractInfo] of this.monitoredContracts) {
        const status = this.getContractStatus(contractInfo);
        const timeSinceChecked = Math.floor((now - contractInfo.lastChecked) / 1000);

        log(this.ns, `${contractInfo.filename} (${contractInfo.hostname}): ${status}`, 'INFO');
        log(this.ns, `  Type: ${contractInfo.contract.type}`, 'INFO');
        log(this.ns, `  Attempts: ${contractInfo.contract.numTries}/${contractInfo.contract.maxTries}`, 'INFO');
        log(this.ns, `  Last checked: ${timeSinceChecked}s ago`, 'INFO');
        log(this.ns, `  Our attempts: ${contractInfo.attempts}`, 'INFO');
      }
    }
  }

  /**
   * Get contract status string
   */
  private getContractStatus(contractInfo: MonitoredContract): string {
    if (!hasContractSolver(contractInfo.contract.type)) return 'NO_SOLVER';
    if (!isContractWorthAttempting(contractInfo.contract)) return 'NO_ATTEMPTS_LEFT';
    return 'READY_TO_SOLVE';
  }

  /**
   * Show help information
   */
  private showHelp(): void {
    log(this.ns, '=== Contract Monitor Help ===', 'INFO');
    log(this.ns, 'Usage: run contract-monitor.js [options]', 'INFO');
    log(this.ns, '', 'INFO');
    log(this.ns, 'Options:', 'INFO');
    log(this.ns, '  --scan-interval <seconds>   - Set scan interval (default: 30)', 'INFO');
    log(this.ns, '  --solve-interval <seconds>   - Set solve interval (default: 5)', 'INFO');
    log(this.ns, '  --help, -h                   - Show this help', 'INFO');
    log(this.ns, '', 'INFO');
    log(this.ns, 'Examples:', 'INFO');
    log(this.ns, '  run contract-monitor.js', 'INFO');
    log(this.ns, '  run contract-monitor.js --scan-interval 60 --solve-interval 10', 'INFO');
    log(this.ns, '', 'INFO');
    log(this.ns, 'The monitor will continuously:', 'INFO');
    log(this.ns, '  1. Scan for new contracts at the specified interval', 'INFO');
    log(this.ns, '  2. Automatically solve contracts that have available solvers', 'INFO');
    log(this.ns, '  3. Remove solved contracts from monitoring', 'INFO');
    log(this.ns, '  4. Display status information', 'INFO');
  }
}

/**
 * Main function
 */
export async function main(ns: NS): Promise<void> {
  const monitor = new ContractMonitor(ns);
  await monitor.run();
}

// Auto-execute if run directly
if (typeof ns !== 'undefined') {
  main(ns).catch(error => {
    ns.tprint(`Error in contract monitor: ${error}`);
  });
}
