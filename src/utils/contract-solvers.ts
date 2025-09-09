/**
 * Contract Solvers
 * Simple implementations for common contract types
 */

import { ContractSolver, ContractSolverRegistry } from '../types/contracts';

/**
 * Encryption I: Caesar Cipher solver
 */
const solveCaesarCipher: ContractSolver = (data: any): any => {
  if (!Array.isArray(data) || data.length !== 2) return '';

  const [plaintext, shift] = data;
  if (typeof plaintext !== 'string' || typeof shift !== 'number') return '';

  const normalizedShift = ((shift % 26) + 26) % 26; // ensure 0..25

  let result = '';
  for (let i = 0; i < plaintext.length; i++) {
    const ch = plaintext[i] as string;
    const code = ch.toUpperCase().charCodeAt(0);
    if (code >= 65 && code <= 90) {
      // left shift
      const shifted = ((code - 65 - normalizedShift + 26) % 26) + 65;
      result += String.fromCharCode(shifted);
    } else {
      result += ch; // keep spaces and other chars
    }
  }

  return result.toUpperCase();
};

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
 * Generate IP Addresses solver
 */
const solveGenerateIPAddresses: ContractSolver = (data: any): any => {
  if (typeof data !== 'string' || data.length === 0) return [];

  const s = data.trim();
  const results: string[] = [];

  const isValidOctet = (str: string): boolean => {
    if (str.length === 0 || str.length > 3) return false;
    if (str[0] === '0' && str.length > 1) return false;
    const num = Number(str);
    return num >= 0 && num <= 255;
  };

  const backtrack = (start: number, parts: string[]): void => {
    if (parts.length === 4) {
      if (start === s.length) results.push(parts.join('.'));
      return;
    }

    // remaining characters must be feasible for remaining parts
    const remainingParts = 4 - parts.length;
    const remainingChars = s.length - start;
    if (remainingChars < remainingParts || remainingChars > remainingParts * 3) return;

    for (let len = 1; len <= 3 && start + len <= s.length; len++) {
      const segment = s.substring(start, start + len);
      if (!isValidOctet(segment)) break; // longer will not be valid if leading zero or >255
      parts.push(segment);
      backtrack(start + len, parts);
      parts.pop();
    }
  };

  backtrack(0, []);
  return results;
};

/**
 * Find All Valid Math Expressions solver
 */
const solveFindAllValidMathExpressions: ContractSolver = (data: any): any => {
  if (!Array.isArray(data) || data.length !== 2) return [];

  const [digits, target] = data;
  if (typeof digits !== 'string' || typeof target !== 'number') return [];

  const results: string[] = [];

  const isValidNumber = (str: string): boolean => {
    if (str.length === 0) return false;
    if (str.length > 1 && str[0] === '0') return false;
    return true;
  };

  const evaluate = (expr: string): number => {
    try {
      // Simple evaluation respecting operator precedence
      // Split by + and - first, then handle * within each part
      const parts = expr.split(/([+-])/);
      let result = 0;
      let sign = 1;
      
      for (let i = 0; i < parts.length; i += 2) {
        const part = parts[i]?.trim() || '';
        if (part === '') continue;
        
        // Handle multiplication within this part
        const multParts = part.split('*');
        let multResult = 1;
        for (const multPart of multParts) {
          const num = Number(multPart.trim());
          if (isNaN(num)) return NaN;
          multResult *= num;
        }
        
        result += sign * multResult;
        
        // Set sign for next part
        if (i + 1 < parts.length) {
          sign = parts[i + 1] === '+' ? 1 : -1;
        }
      }
      
      return result;
    } catch {
      return NaN;
    }
  };

  const hasLeadingZeros = (expr: string): boolean => {
    const numbers = expr.split(/[+\-*]/);
    return numbers.some(num => num.length > 1 && num[0] === '0');
  };

  const backtrack = (start: number, current: string): void => {
    if (start === digits.length) {
      if (isValidNumber(current) && !hasLeadingZeros(current) && evaluate(current) === target) {
        results.push(current);
      }
      return;
    }

    const currentChar = digits[start];
    if (currentChar === undefined) return;

    // Add operator and next digit
    if (current.length > 0) {
      for (const op of ['+', '-', '*']) {
        const nextExpression = current + op + currentChar;
        // Check if the new expression would be valid by ensuring no leading zeros
        if (!hasLeadingZeros(nextExpression)) {
          backtrack(start + 1, nextExpression);
        }
      }
    }

    // Add digit without operator (if current is empty or we're continuing a number)
    const newCurrent = current + currentChar;
    if (isValidNumber(newCurrent) && !hasLeadingZeros(newCurrent)) {
      backtrack(start + 1, newCurrent);
    }
  };

  backtrack(0, '');
  return results;
};

/**
 * Compression I: RLE Compression solver
 */
const solveRLECompression: ContractSolver = (data: any): any => {
  if (typeof data !== 'string' || data.length === 0) return '';

  const input = data.trim();
  let result = '';
  let i = 0;

  while (i < input.length) {
    const char = input[i];
    if (char === undefined) break;
    
    let count = 1;
    // Count consecutive identical characters
    while (i + count < input.length && input[i + count] === char) {
      count++;
    }

    const originalCount = count;

    // Encode runs of 10 or more by splitting into multiple runs
    while (count > 0) {
      const runLength = Math.min(count, 9);
      result += runLength.toString() + char;
      count -= runLength;
    }

    i += originalCount;
  }

  return result;
};

/**
 * Shortest Path in a Grid solver
 */
const solveShortestPathInGrid: ContractSolver = (data: any): any => {
  if (!Array.isArray(data) || data.length === 0) return '';

  const grid = data;
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  
  if (rows === 0 || cols === 0) return '';
  if (grid[0]?.[0] === 1 || grid[rows - 1]?.[cols - 1] === 1) return '';

  // BFS to find shortest path
  const queue: Array<{row: number, col: number, path: string}> = [];
  const visited = new Set<string>();
  
  queue.push({row: 0, col: 0, path: ''});
  visited.add('0,0');

  const directions = [
    {dr: -1, dc: 0, dir: 'U'},
    {dr: 1, dc: 0, dir: 'D'},
    {dr: 0, dc: -1, dir: 'L'},
    {dr: 0, dc: 1, dir: 'R'}
  ];

  while (queue.length > 0) {
    const {row, col, path} = queue.shift()!;
    
    if (row === rows - 1 && col === cols - 1) {
      return path;
    }

    for (const {dr, dc, dir} of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      const key = `${newRow},${newCol}`;
      
      if (newRow >= 0 && newRow < rows && 
          newCol >= 0 && newCol < cols &&
          !visited.has(key) &&
          grid[newRow]?.[newCol] === 0) {
        visited.add(key);
        queue.push({row: newRow, col: newCol, path: path + dir});
      }
    }
  }

  return ''; // No path found
};

/**
 * Spiralize Matrix solver
 */
const solveSpiralizeMatrix: ContractSolver = (data: any): any => {
  if (!Array.isArray(data) || data.length === 0) return [];

  const matrix = data;
  const result: number[] = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0]?.length - 1 || 0;

  while (top <= bottom && left <= right) {
    // Traverse right
    for (let col = left; col <= right; col++) {
      const value = matrix[top]?.[col];
      if (typeof value === 'number') {
        result.push(value);
      }
    }
    top++;

    // Traverse down
    for (let row = top; row <= bottom; row++) {
      const value = matrix[row]?.[right];
      if (typeof value === 'number') {
        result.push(value);
      }
    }
    right--;

    // Traverse left (if we still have rows)
    if (top <= bottom) {
      for (let col = right; col >= left; col--) {
        const value = matrix[bottom]?.[col];
        if (typeof value === 'number') {
          result.push(value);
        }
      }
      bottom--;
    }

    // Traverse up (if we still have columns)
    if (left <= right) {
      for (let row = bottom; row >= top; row--) {
        const value = matrix[row]?.[left];
        if (typeof value === 'number') {
          result.push(value);
        }
      }
      left++;
    }
  }

  return result;
};

/**
 * Unique Paths in a Grid II solver
 */
const solveUniquePathsInGridII: ContractSolver = (data: any): any => {
  if (!Array.isArray(data) || data.length === 0) return 0;

  const grid = data;
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  
  if (rows === 0 || cols === 0) return 0;
  if (grid[0]?.[0] === 1 || grid[rows - 1]?.[cols - 1] === 1) return 0;

  // Create DP table
  const dp: number[][] = Array(rows).fill(null).map(() => Array(cols).fill(0));
  
  // Initialize starting position
  dp[0]![0] = 1;
  
  // Fill first row
  for (let col = 1; col < cols; col++) {
    if (grid[0]?.[col] === 0) {
      dp[0]![col] = dp[0]![col - 1] || 0;
    }
  }
  
  // Fill first column
  for (let row = 1; row < rows; row++) {
    if (grid[row]?.[0] === 0) {
      dp[row]![0] = dp[row - 1]![0] || 0;
    }
  }
  
  // Fill rest of the table
  for (let row = 1; row < rows; row++) {
    for (let col = 1; col < cols; col++) {
      if (grid[row]?.[col] === 0) {
        dp[row]![col] = (dp[row - 1]![col] || 0) + (dp[row]![col - 1] || 0);
      }
    }
  }
  
  return dp[rows - 1]?.[cols - 1] || 0;
};

/**
 * Minimum Path Sum in a Triangle solver
 */
const solveMinimumPathSumInTriangle: ContractSolver = (data: any): any => {
  if (!Array.isArray(data) || data.length === 0) return 0;

  const triangle = data;
  const n = triangle.length;
  
  if (n === 0) return 0;
  if (n === 1) return triangle[0]?.[0] || 0;

  // Start from the second-to-last row and work upwards
  for (let row = n - 2; row >= 0; row--) {
    for (let col = 0; col <= row; col++) {
      const current = triangle[row]?.[col];
      const left = triangle[row + 1]?.[col];
      const right = triangle[row + 1]?.[col + 1];
      
      if (typeof current === 'number' && 
          typeof left === 'number' && 
          typeof right === 'number') {
        triangle[row][col] = current + Math.min(left, right);
      }
    }
  }

  return triangle[0]?.[0] || 0;
};

/**
 * Registry of contract solvers
 */
export const contractSolvers: ContractSolverRegistry = {
  'Encryption I: Caesar Cipher': solveCaesarCipher,
  'Array Jumping Game': solveArrayJumpingGame,
  'Find Largest Prime Factor': solveFindLargestPrimeFactor,
  'Subarray with Maximum Sum': solveSubarrayWithMaximumSum,
  'Total Ways to Sum': solveTotalWaysToSum,
  'Proper 2-Coloring of a Graph': solveProper2ColoringGraph,
  'Algorithmic Stock Trader III': solveAlgorithmicStockTraderIII,
  'Merge Overlapping Intervals': solveMergeOverlappingIntervals,
  'Generate IP Addresses': solveGenerateIPAddresses,
  'Find All Valid Math Expressions': solveFindAllValidMathExpressions,
  'Compression I: RLE Compression': solveRLECompression,
  'Total Ways to Sum II': solveTotalWaysToSumII,
  'Square Root': solveSquareRoot,
  'Array Jumping Game II': solveArrayJumpingGameII,
  'Algorithmic Stock Trader IV': solveAlgorithmicStockTraderIV,
  'Shortest Path in a Grid': solveShortestPathInGrid,
  'Spiralize Matrix': solveSpiralizeMatrix,
  'Unique Paths in a Grid II': solveUniquePathsInGridII,
  'Minimum Path Sum in a Triangle': solveMinimumPathSumInTriangle
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
 * Solve Total Ways to Sum II - unbounded knapsack problem
 */
export function solveTotalWaysToSumII(data: any[]): number {
  if (!Array.isArray(data) || data.length !== 2) return 0;
  
  const [target, numbers] = data;
  if (typeof target !== 'number' || !Array.isArray(numbers)) return 0;
  
  // Use dynamic programming to count ways
  const dp = new Array(target + 1).fill(0);
  dp[0] = 1; // One way to make sum 0 (use no numbers)
  
  for (const num of numbers) {
    for (let i = num; i <= target; i++) {
      dp[i] += dp[i - num];
    }
  }
  
  return dp[target];
}

/**
 * Computes the nearest integer square root of a large number.
 * Accepts a BigInt or a decimal string and returns a decimal string.
 * Rounds half-way cases down (change `<` to `<=` if you prefer “round half up”).
 */
export function solveSquareRoot(n: any): string {
  // Convert to BigInt if needed
  n = typeof n === 'bigint' ? n : BigInt(n);
  if (n < 0n) throw new RangeError('sqrtBigIntNearest: negative input');
  if (n < 2n) return n.toString(); // 0n or 1n

  // Initial guess: 2^(ceil(bitLength/2)) — ensures convergence
  const bitLen = n.toString(2).length;
  let x = 1n << BigInt(Math.ceil(bitLen / 2));

  // Newton–Raphson (Heron’s method) iteration to find floor(sqrt(n))
  while (true) {
    const y = (x + n / x) >> 1n;
    if (y >= x) break;
    x = y;
  }

  // At this point, x is floor(sqrt(n)); check which is nearer
  const d1 = n - x * x;
  const xPlusOne = x + 1n;
  const d2 = xPlusOne * xPlusOne - n;
  // If (n – x^2) < ((x+1)^2 – n), return x; otherwise round up
  return (d2 < d1 ? xPlusOne : x).toString();
}

/**
 * Solve Array Jumping Game II - minimum jumps
 */
export function solveArrayJumpingGameII(data: any[]): number {
  if (!Array.isArray(data)) return 0;
  
  const nums = data;
  if (nums.length === 0) return 0;
  if (nums.length === 1) return 0;
  
  let jumps = 0;
  let currentEnd = 0;
  let farthest = 0;
  
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    
    if (i === currentEnd) {
      jumps++;
      currentEnd = farthest;
      
      if (currentEnd >= nums.length - 1) {
        return jumps;
      }
    }
  }
  
  return 0; // Cannot reach the end
}

/**
 * Solve Algorithmic Stock Trader IV - k transactions
 */
export function solveAlgorithmicStockTraderIV(data: any[]): number {
  if (!Array.isArray(data) || data.length !== 2) return 0;
  
  const [k, prices] = data;
  if (typeof k !== 'number' || !Array.isArray(prices)) return 0;
  
  if (prices.length < 2) return 0;
  
  // If k is greater than or equal to half the length, we can make unlimited transactions
  if (k >= Math.floor(prices.length / 2)) {
    let profit = 0;
    for (let i = 1; i < prices.length; i++) {
      if (prices[i] > prices[i - 1]) {
        profit += prices[i] - prices[i - 1];
      }
    }
    return profit;
  }
  
  // Dynamic programming approach for limited transactions
  const buy = new Array(k + 1).fill(-Infinity);
  const sell = new Array(k + 1).fill(0);
  
  for (const price of prices) {
    for (let i = k; i >= 1; i--) {
      sell[i] = Math.max(sell[i], buy[i] + price);
      buy[i] = Math.max(buy[i], sell[i - 1] - price);
    }
  }
  
  return sell[k];
}

/**
 * Get list of supported contract types
 */
export function getSupportedContractTypes(): string[] {
  return Object.keys(contractSolvers);
}

