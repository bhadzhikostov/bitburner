/**
 * Utility functions for working with coding contracts
 */

import { CodingContract, ContractResult, ContractStats } from '../types/contracts';

/**
 * Find all coding contracts on a server
 */
export function findContractsOnServer(ns: NS, hostname: string): string[] {
  try {
    const files = ns.ls(hostname);
    return files.filter(file => file.endsWith('.cct'));
  } catch (error) {
    ns.print(`Error scanning server ${hostname}: ${error}`);
    return [];
  }
}

/**
 * Find all coding contracts across all accessible servers
 */
export function findAllContracts(ns: NS): Array<{ hostname: string; filename: string }> {
  const contracts: Array<{ hostname: string; filename: string }> = [];
  const allServers = getAllServers(ns);

  for (const hostname of allServers) {
    try {
      if (ns.hasRootAccess(hostname)) {
        const contractFiles = findContractsOnServer(ns, hostname);
        for (const filename of contractFiles) {
          contracts.push({ hostname, filename });
        }
      }
    } catch (error) {
      ns.print(`Error accessing server ${hostname}: ${error}`);
    }
  }

  return contracts;
}

/**
 * Get contract information
 */
export function getContractInfo(ns: NS, hostname: string, filename: string): CodingContract | null {
  try {
    const type = ns.codingcontract.getContractType(filename, hostname);
    const description = ns.codingcontract.getDescription(filename, hostname);
    const data = ns.codingcontract.getData(filename, hostname);
    const numTries = ns.codingcontract.getNumTriesRemaining(filename, hostname);
    
    if (!type) return null;

    return {
      type,
      description,
      data,
      numTries,
      maxTries: 3 // Standard max tries for coding contracts
    };
  } catch (error) {
    ns.print(`Error getting contract info for ${filename} on ${hostname}: ${error}`);
    return null;
  }
}

/**
 * Attempt to solve a contract
 */
export function attemptContract(
  ns: NS,
  hostname: string,
  filename: string,
  solution: any
): ContractResult {
  try {
    const success = ns.codingcontract.attempt(solution, filename, hostname);

    if (success) {
      return {
        success: true,
        message: `Successfully solved contract ${filename} on ${hostname}`,
        reward: 'Contract reward received'
      };
    } else {
      return {
        success: false,
        message: `Failed to solve contract ${filename} on ${hostname}`
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Error attempting contract ${filename} on ${hostname}: ${error}`
    };
  }
}

/**
 * Calculate contract statistics
 */
export function calculateContractStats(
  attempted: number,
  solved: number,
  failed: number,
  totalAttempts: number
): ContractStats {
  return {
    totalAttempted: attempted,
    totalSolved: solved,
    totalFailed: failed,
    successRate: attempted > 0 ? (solved / attempted) * 100 : 0,
    averageAttempts: attempted > 0 ? totalAttempts / attempted : 0
  };
}

/**
 * Format contract data for display
 */
export function formatContractData(data: any): string {
  if (Array.isArray(data)) {
    return `[${data.join(', ')}]`;
  } else if (typeof data === 'object' && data !== null) {
    return JSON.stringify(data, null, 2);
  } else {
    return String(data);
  }
}

/**
 * Check if a contract is worth attempting based on remaining tries
 */
export function isContractWorthAttempting(contract: CodingContract): boolean {
  return contract.numTries < contract.maxTries;
}

/**
 * Get all servers in the network recursively (helper function)
 */
function getAllServers(ns: NS, startServer: string = 'home'): string[] {
  const servers = new Set<string>();
  const toVisit = [startServer];

  while (toVisit.length > 0) {
    const current = toVisit.pop()!;
    if (!servers.has(current)) {
      servers.add(current);
      const connections = ns.scan(current);
      toVisit.push(...connections);
    }
  }

  return Array.from(servers);
}
