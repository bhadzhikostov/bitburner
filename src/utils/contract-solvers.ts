/**
 * Contract Solvers
 * Simple implementations for common contract types
 */

import { ContractSolver, ContractSolverRegistry } from '../types/contracts';

/**
 * Array Jumping Game solver
 */
const solveArrayJumpingGame: ContractSolver = (data: any): any => {
  if (!Array.isArray(data) || data.length <= 1) return 0;

  const n = data.length;
  const jumps = new Array(n).fill(Infinity);
  jumps[0] = 0;

  for (let i = 0; i < n; i++) {
    const jumpDistance = data[i];
    if (typeof jumpDistance === 'number') {
      for (let j = 1; j <= jumpDistance && i + j < n; j++) {
        jumps[i + j] = Math.min(jumps[i + j], jumps[i] + 1);
      }
    }
  }

  return jumps[n - 1] === Infinity ? 0 : jumps[n - 1];
};

/**
 * Find Largest Prime Factor solver
 */
const solveFindLargestPrimeFactor: ContractSolver = (data: any): any => {
  if (typeof data !== 'number') return 0;

  let n = data;
  let largestPrime = 2;

  // Handle even numbers
  while (n % 2 === 0) {
    largestPrime = 2;
    n = n / 2;
  }

  // Check odd numbers up to sqrt(n)
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    while (n % i === 0) {
      largestPrime = i;
      n = n / i;
    }
  }

  // If n is a prime number greater than 2
  if (n > 2) {
    largestPrime = n;
  }

  return largestPrime;
};

/**
 * Subarray with Maximum Sum solver
 */
const solveSubarrayWithMaximumSum: ContractSolver = (data: any): any => {
  if (!Array.isArray(data) || data.length === 0) return 0;

  let maxSoFar = data[0] || 0;
  let maxEndingHere = data[0] || 0;

  for (let i = 1; i < data.length; i++) {
    const current = data[i];
    if (typeof current === 'number') {
      maxEndingHere = Math.max(current, maxEndingHere + current);
      maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
  }

  return maxSoFar;
};

/**
 * Total Ways to Sum solver
 */
const solveTotalWaysToSum: ContractSolver = (data: any): any => {
  if (typeof data !== 'number') return 0;

  const dp: number[] = new Array(data + 1).fill(0);
  dp[0] = 1;

  for (let i = 1; i < data; i++) {
    for (let j = i; j <= data; j++) {
      const current = dp[j];
      const previous = dp[j - i];
      if (current !== undefined && previous !== undefined) {
        dp[j] = current + previous;
      }
    }
  }

  return dp[data] || 0;
};

/**
 * Registry of contract solvers
 */
export const contractSolvers: ContractSolverRegistry = {
  'Array Jumping Game': solveArrayJumpingGame,
  'Find Largest Prime Factor': solveFindLargestPrimeFactor,
  'Subarray with Maximum Sum': solveSubarrayWithMaximumSum,
  'Total Ways to Sum': solveTotalWaysToSum
};

/**
 * Get solver for a specific contract type
 */
export function getContractSolver(contractType: string): ContractSolver | null {
  return contractSolvers[contractType] || null;
}

/**
 * Check if we have a solver for a contract type
 */
export function hasContractSolver(contractType: string): boolean {
  return contractType in contractSolvers;
}

/**
 * Get list of supported contract types
 */
export function getSupportedContractTypes(): string[] {
  return Object.keys(contractSolvers);
}
