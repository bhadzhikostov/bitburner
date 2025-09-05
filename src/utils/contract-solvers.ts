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
  const canReach = new Array(n).fill(false);
  canReach[0] = true;

  for (let i = 0; i < n; i++) {
    if (canReach[i]) {
      const jumpDistance = data[i];
      if (typeof jumpDistance === 'number') {
        for (let j = 1; j <= jumpDistance && i + j < n; j++) {
          canReach[i + j] = true;
        }
      }
    }
  }

  return canReach[n - 1] ? 1 : 0;
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
 * Algorithmic Stock Trader III solver
 * Finds maximum profit with at most 2 transactions
 */
const solveAlgorithmicStockTraderIII: ContractSolver = (data: any): any => {
  if (!Array.isArray(data) || data.length < 2) return 0;
  
  const prices = data.filter((price: any) => typeof price === 'number');
  if (prices.length < 2) return 0;
  
  const n = prices.length;
  const firstPrice = prices[0];
  if (firstPrice === undefined) return 0;
  
  // Track maximum profit with 0, 1, and 2 transactions
  // buy1: cost of first buy (negative, we want to minimize this)
  // sell1: profit after first sell (we want to maximize this)
  // buy2: cost of second buy (negative, we want to minimize this)
  // sell2: profit after second sell (we want to maximize this)
  let buy1 = -firstPrice;
  let sell1 = 0;
  let buy2 = -firstPrice;
  let sell2 = 0;
  
  for (let i = 1; i < n; i++) {
    const price = prices[i];
    if (price === undefined) continue;
    
    // Update first transaction
    buy1 = Math.max(buy1, -price); // Buy at lowest price
    sell1 = Math.max(sell1, buy1 + price); // Sell at highest profit
    
    // Update second transaction
    buy2 = Math.max(buy2, sell1 - price); // Buy with profit from first transaction
    sell2 = Math.max(sell2, buy2 + price); // Sell at highest total profit
  }
  
  return Math.max(0, sell2); // Return 0 if no profit can be made
};

/**
 * Merge Overlapping Intervals solver
 */
const solveMergeOverlappingIntervals: ContractSolver = (data: any): any => {
  if (!Array.isArray(data) || data.length === 0) return [];

  // Validate and normalize intervals
  const intervals: [number, number][] = [];
  for (const item of data) {
    if (
      Array.isArray(item) &&
      item.length === 2 &&
      typeof item[0] === 'number' &&
      typeof item[1] === 'number'
    ) {
      intervals.push([item[0], item[1]]);
    }
  }

  if (intervals.length === 0) return [];

  // Sort by start ascending, and then by end ascending
  intervals.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]));

  const merged: [number, number][] = [];
  const firstInterval = intervals[0]!;
  let [currentStart, currentEnd] = firstInterval;

  for (let i = 1; i < intervals.length; i++) {
    const nextInterval = intervals[i]!;
    const start = nextInterval[0];
    const end = nextInterval[1];
    if (start <= currentEnd) {
      // Overlap, extend the current interval
      currentEnd = Math.max(currentEnd, end);
    } else {
      // No overlap, push current and move on
      merged.push([currentStart, currentEnd]);
      currentStart = start;
      currentEnd = end;
    }
  }

  // Push the last interval
  merged.push([currentStart, currentEnd]);

  return merged;
};

// (removed duplicate definition)

/**
 * Proper 2-Coloring of a Graph solver
 */
const solveProper2ColoringGraph: ContractSolver = (data: any): any => {
  if (!Array.isArray(data) || data.length !== 2) return [];
  
  const [numVertices, edges] = data;
  if (typeof numVertices !== 'number' || !Array.isArray(edges)) return [];
  
  // Create adjacency list
  const graph: number[][] = Array.from({ length: numVertices }, () => []);
  
  for (const edge of edges) {
    if (Array.isArray(edge) && edge.length === 2) {
      const [u, v] = edge;
      if (typeof u === 'number' && typeof v === 'number' && 
          u >= 0 && u < numVertices && v >= 0 && v < numVertices) {
        graph[u]?.push(v);
        graph[v]?.push(u);
      }
    }
  }
  
  // Colors: -1 = uncolored, 0 = color 0, 1 = color 1
  const colors: number[] = new Array(numVertices).fill(-1);
  
  // Try to color each connected component
  for (let i = 0; i < numVertices; i++) {
    if (colors[i] === -1) {
      // BFS to color this component
      const queue: number[] = [i];
      colors[i] = 0;
      
      while (queue.length > 0) {
        const current = queue.shift()!;
        
        for (const neighbor of graph[current] || []) {
          if (colors[neighbor] === -1) {
            // Assign opposite color
            colors[neighbor] = 1 - (colors[current] || 0);
            queue.push(neighbor);
          } else if (colors[neighbor] === colors[current]) {
            // Conflict found - graph is not bipartite
            return [];
          }
        }
      }
    }
  }
  
  return colors;
};

/**
 * Registry of contract solvers
 */
export const contractSolvers: ContractSolverRegistry = {
  'Array Jumping Game': solveArrayJumpingGame,
  'Find Largest Prime Factor': solveFindLargestPrimeFactor,
  'Subarray with Maximum Sum': solveSubarrayWithMaximumSum,
  'Total Ways to Sum': solveTotalWaysToSum,
  'Proper 2-Coloring of a Graph': solveProper2ColoringGraph,
  'Algorithmic Stock Trader III': solveAlgorithmicStockTraderIII,
  'Merge Overlapping Intervals': solveMergeOverlappingIntervals
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
// (removed duplicate definition)
