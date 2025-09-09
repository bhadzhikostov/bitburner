/**
 * Jest tests for contract solvers
 */

import { 
  contractSolvers, 
  getContractSolver, 
  hasContractSolver,
  solveTotalWaysToSumII,
  solveSquareRoot,
  solveArrayJumpingGameII,
  solveAlgorithmicStockTraderIV
} from '../src/utils/contract-solvers';

describe('Contract Solvers', () => {
  describe('Encryption I: Caesar Cipher', () => {
    const solver = contractSolvers['Encryption I: Caesar Cipher'];
    
    test('should encrypt text with left shift', () => {
      const data = ["SHELL ARRAY CACHE LOGIN SHIFT", 7];
      const result = solver!(data);
      expect(result).toBe('LAXEE TKKTR VTVAX EHZBG LABYM');
    });

    test('should handle empty input', () => {
      expect(solver!([])).toBe('');
      expect(solver!(['', 5])).toBe('');
      expect(solver!(['test', 'invalid'])).toBe('');
    });

    test('should handle different shift values', () => {
      const data = ["HELLO", 1];
      const result = solver!(data);
      expect(result).toBe('GDKKN');
    });
  });

  describe('Array Jumping Game', () => {
    const solver = contractSolvers['Array Jumping Game'];
    
    test('should return 1 for reachable array', () => {
      const data = [2,8,5,3,6,1,3,10,5,2,8,9,0,0,9,0,10,10];
      const result = solver!(data);
      expect(result).toBe(1);
    });

    test('should return 0 for unreachable array', () => {
      const data = [0,1,2,3];
      const result = solver!(data);
      expect(result).toBe(0);
    });

    test('should handle edge cases', () => {
      expect(solver!([])).toBe(0);
      expect(solver!([1])).toBe(0);
      expect(solver!([1,0])).toBe(1);
    });
  });

  describe('Merge Overlapping Intervals', () => {
    const solver = contractSolvers['Merge Overlapping Intervals'];
    
    test('should merge overlapping intervals', () => {
      const data = [[6,11],[6,12],[22,30],[9,12]];
      const result = solver!(data);
      expect(result).toEqual([[6,12],[22,30]]);
    });

    test('should handle example from contract', () => {
      const data = [[1, 3], [8, 10], [2, 6], [10, 16]];
      const result = solver!(data);
      expect(result).toEqual([[1, 6], [8, 16]]);
    });

    test('should handle empty input', () => {
      expect(solver!([])).toEqual([]);
      expect(solver!([['invalid']])).toEqual([]);
    });
  });

  describe('Algorithmic Stock Trader III', () => {
    const solver = contractSolvers['Algorithmic Stock Trader III'];
    
    test('should calculate maximum profit with at most 2 transactions', () => {
      const data = [13,104,69,47,70,114,146,116,1,108,61,50,174,85,10,73,184,147,21,99,138,141,36];
      const result = solver!(data);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });

    test('should return 0 for no profit scenario', () => {
      const data = [5,4,3,2,1];
      const result = solver!(data);
      expect(result).toBe(0);
    });

    test('should handle edge cases', () => {
      expect(solver!([])).toBe(0);
      expect(solver!([1])).toBe(0);
      expect(solver!([1,2])).toBe(1);
    });
  });

  describe('Generate IP Addresses', () => {
    const solver = contractSolvers['Generate IP Addresses'];
    
    test('should generate valid IP addresses', () => {
      const data = "1347537248";
      const result = solver!(data);
      expect(Array.isArray(result)).toBe(true);
      result.forEach((ip: string) => {
        expect(typeof ip).toBe('string');
        const parts = ip.split('.');
        expect(parts).toHaveLength(4);
        parts.forEach((part: string) => {
          const num = parseInt(part, 10);
          expect(num).toBeGreaterThanOrEqual(0);
          expect(num).toBeLessThanOrEqual(255);
          expect(part).not.toMatch(/^0\d/); // No leading zeros
        });
      });
    });

    test('should handle example cases', () => {
      const data1 = "25525511135";
      const result1 = solver!(data1);
      expect(result1).toContain("255.255.11.135");
      expect(result1).toContain("255.255.111.35");

      const data2 = "1938718066";
      const result2 = solver!(data2);
      expect(result2).toContain("193.87.180.66");
    });

    test('should handle invalid input', () => {
      expect(solver!("")).toEqual([]);
      expect(solver!("123")).toEqual([]);
    });
  });

  describe('Proper 2-Coloring of a Graph', () => {
    const solver = contractSolvers['Proper 2-Coloring of a Graph'];
    
    test('should return valid coloring when possible', () => {
      const data = [9,[[1,6],[3,7],[1,7],[4,8],[1,5],[0,1],[3,8]]];
      const result = solver!(data);
      expect(Array.isArray(result)).toBe(true);
      
      if (result.length > 0) {
        expect(result).toHaveLength(9);
        result.forEach((color: number) => {
          expect([0, 1]).toContain(color);
        });
      }
    });

    test('should handle example cases', () => {
      const data1 = [4, [[0, 2], [0, 3], [1, 2], [1, 3]]];
      const result1 = solver!(data1);
      expect(result1).toEqual([0, 0, 1, 1]);

      const data2 = [3, [[0, 1], [0, 2], [1, 2]]];
      const result2 = solver!(data2);
      expect(result2).toEqual([]);
    });

    test('should handle invalid input', () => {
      expect(solver!([])).toEqual([]);
      expect(solver!([5])).toEqual([]);
      expect(solver!([3, 'invalid'])).toEqual([]);
    });
  });

  describe('Find All Valid Math Expressions', () => {
    const solver = contractSolvers['Find All Valid Math Expressions'];
    
    test('should find valid math expressions', () => {
      const data = ["11626", 0];
      const result = solver!(data);
      expect(Array.isArray(result)).toBe(true);
      result.forEach((expr: string) => {
        expect(typeof expr).toBe('string');
        expect(expr).not.toMatch(/0\d/); // No leading zeros
      });
    });

    test('should handle example cases', () => {
      const data1 = ["123", 6];
      const result1 = solver!(data1);
      expect(result1).toContain("1+2+3");
      expect(result1).toContain("1*2*3");

      const data2 = ["105", 5];
      const result2 = solver!(data2);
      expect(result2).toContain("1*0+5");
      expect(result2).toContain("10-5");
    });

    test('should handle invalid input', () => {
      expect(solver!([])).toEqual([]);
      expect(solver!(["123"])).toEqual([]);
      expect(solver!([123, 5])).toEqual([]);
    });
  });

  describe('Compression I: RLE Compression', () => {
    const solver = contractSolvers['Compression I: RLE Compression'];
    
    test('should compress string using RLE', () => {
      const data = "6fffffffffffWNN44h777777777777OOOOOOOOddQMMPcccccccccccccc3aE44444444AAAAAAAAAA4OOHH";
      const result = solver!(data);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test('should handle example cases', () => {
      expect(solver!("aaaaabccc")).toBe("5a1b3c");
      expect(solver!("aAaAaA")).toBe("1a1A1a1A1a1A");
      expect(solver!("111112333")).toBe("511233");
    });

    test('should handle long runs by splitting', () => {
      const data = "zzzzzzzzzzzzzzzzzzz";
      const result = solver!(data);
      expect(result).toMatch(/9z9z1z/);
    });

    test('should handle empty input', () => {
      expect(solver!("")).toBe("");
    });
  });

  describe('Total Ways to Sum II', () => {
    test('should count ways to sum with given numbers', () => {
      const testCases = [
        {
          input: [5, [1, 2, 3]],
          expected: 5 // 1+1+1+1+1, 1+1+1+2, 1+1+3, 1+2+2, 2+3
        },
        {
          input: [4, [1, 2]],
          expected: 3 // 1+1+1+1, 1+1+2, 2+2
        },
        {
          input: [10, [2, 3, 5]],
          expected: 4 // 2+2+2+2+2, 2+2+3+3, 2+3+5, 5+5
        }
      ];

      testCases.forEach(({ input, expected }) => {
        const result = solveTotalWaysToSumII(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('Square Root', () => {
    test('should find square root of BigInt numbers', () => {
      const testCases = [
        {
          input: '16',
          expected: '4'
        },
        {
          input: '25',
          expected: '5'
        },
        {
          input: '100',
          expected: '10'
        },
        {
          input: '0',
          expected: '0'
        },
        {
          input: '1',
          expected: '1'
        },
        {
          input: '76579161825613687329744221191804782919366028247465629706632956859963834911105657496036487475936435976512638051733913988598263851829798287346946864278000432117387513880019904597654677781166685913197257',
          expected: '8750952052526267117608203306421746603163495235410786666221624552116259239714427386944110603233181048'
        }
      ];

      testCases.forEach(({ input, expected }) => {
        const result = solveSquareRoot(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('Array Jumping Game II', () => {
    test('should find minimum jumps to reach end', () => {
      const testCases = [
        {
          input: [2, 3, 1, 1, 4],
          expected: 2 // 0 -> 1 -> 4
        },
        {
          input: [2, 3, 0, 1, 4],
          expected: 2 // 0 -> 1 -> 4
        },
        {
          input: [1, 2, 3, 4, 5],
          expected: 3 // 0 -> 1 -> 2 -> 4
        },
        {
          input: [3, 2, 1, 0, 4],
          expected: 0 // Cannot reach end
        },
        {
          input: [1],
          expected: 0 // Already at end
        }
      ];

      testCases.forEach(({ input, expected }) => {
        const result = solveArrayJumpingGameII(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('Algorithmic Stock Trader IV', () => {
    test('should find maximum profit with k transactions', () => {
      const testCases = [
        {
          input: [2, [2, 4, 1]],
          expected: 2 // Buy at 2, sell at 4
        },
        {
          input: [2, [3, 2, 6, 5, 0, 3]],
          expected: 7 // Buy at 2, sell at 6 (profit 4), buy at 0, sell at 3 (profit 3)
        },
        {
          input: [1, [1, 2, 3, 4, 5]],
          expected: 4 // Buy at 1, sell at 5
        },
        {
          input: [2, [5, 4, 3, 2, 1]],
          expected: 0 // No profit possible
        }
      ];

      testCases.forEach(({ input, expected }) => {
        const result = solveAlgorithmicStockTraderIV(input);
        expect(result).toBe(expected);
      });
    });
  });

  describe('Shortest Path in a Grid', () => {
    const solver = contractSolvers['Shortest Path in a Grid'];
    
    test('should find shortest path in grid', () => {
      const data = [
        [0,1,0,0,0],
        [0,0,0,1,0]
      ];
      const result = solver!(data);
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^[UDLR]*$/);
    });

    test('should return empty string when no path exists', () => {
      const data = [
        [0,1],
        [1,0]
      ];
      const result = solver!(data);
      expect(result).toBe('');
    });

    test('should handle edge cases', () => {
      expect(solver!([])).toBe('');
      expect(solver!([[1]])).toBe('');
      expect(solver!([[0]])).toBe('');
    });
  });

  describe('Spiralize Matrix', () => {
    const solver = contractSolvers['Spiralize Matrix'];
    
    test('should spiralize matrix correctly', () => {
      const data = [
        [1,2,3],
        [4,5,6],
        [7,8,9]
      ];
      const result = solver!(data);
      expect(result).toEqual([1,2,3,6,9,8,7,4,5]);
    });

    test('should handle rectangular matrices', () => {
      const data = [
        [1,2,3,4],
        [5,6,7,8],
        [9,10,11,12]
      ];
      const result = solver!(data);
      expect(result).toEqual([1,2,3,4,8,12,11,10,9,5,6,7]);
    });

    test('should handle edge cases', () => {
      expect(solver!([])).toEqual([]);
      expect(solver!([[1]])).toEqual([1]);
    });
  });

  describe('Unique Paths in a Grid II', () => {
    const solver = contractSolvers['Unique Paths in a Grid II'];
    
    test('should count unique paths with obstacles', () => {
      const data = [
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,1,0]
      ];
      const result = solver!(data);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });

    test('should return 0 when start or end is blocked', () => {
      const data1 = [[1,0],[0,0]];
      const data2 = [[0,0],[0,1]];
      expect(solver!(data1)).toBe(0);
      expect(solver!(data2)).toBe(0);
    });

    test('should handle edge cases', () => {
      expect(solver!([])).toBe(0);
      expect(solver!([[0]])).toBe(1);
    });
  });

  describe('Minimum Path Sum in a Triangle', () => {
    const solver = contractSolvers['Minimum Path Sum in a Triangle'];
    
    test('should find minimum path sum in triangle', () => {
      const data = [
        [2],
        [3,4],
        [6,5,7],
        [4,1,8,3]
      ];
      const result = solver!(data);
      expect(result).toBe(11);
    });

    test('should handle single row triangle', () => {
      const data = [[5]];
      const result = solver!(data);
      expect(result).toBe(5);
    });

    test('should handle edge cases', () => {
      expect(solver!([])).toBe(0);
    });
  });

  describe('Encryption II: Vigenère Cipher', () => {
    const solver = contractSolvers['Encryption II: Vigenère Cipher'];
    
    test('should encrypt with Vigenère cipher', () => {
      const data = ['DASHBOARD', 'LINUX'];
      const result = solver!(data);
      expect(result).toBe('OIFBYZIEX');
    });

    test('should handle different keyword lengths', () => {
      const data = ['HELLO', 'KEY'];
      const result = solver!(data);
      expect(typeof result).toBe('string');
      expect(result).toHaveLength(5);
    });

    test('should handle edge cases', () => {
      expect(solver!([])).toBe('');
      expect(solver!(['', 'KEY'])).toBe('');
      expect(solver!(['HELLO', ''])).toBe('HELLO');
    });
  });

  describe('Algorithmic Stock Trader I', () => {
    const solver = contractSolvers['Algorithmic Stock Trader I'];
    
    test('should find maximum profit with single transaction', () => {
      const data = [112,136,115,124,92,129,189,190,2,79,108,87,80,111,28,161,99,66,144,117,153,72,191,177,184,139,71,9,147,134,9,153,66,97,75,152,134,197,169,182,123,175,116,171,114,96,150];
      const result = solver!(data);
      expect(result).toBe(195);
    });

    test('should return 0 for decreasing prices', () => {
      const data = [5,4,3,2,1];
      const result = solver!(data);
      expect(result).toBe(0);
    });

    test('should handle edge cases', () => {
      expect(solver!([])).toBe(0);
      expect(solver!([1])).toBe(0);
      expect(solver!([1,2])).toBe(1);
    });
  });

  describe('HammingCodes: Integer to Encoded Binary', () => {
    const solver = contractSolvers['HammingCodes: Integer to Encoded Binary'];
    
    test('should encode numbers with Hamming codes', () => {
      const result8 = solver!(8);
      expect(result8).toBe('11110000');
      
      const result21 = solver!(21);
      expect(result21).toBe('1001101011');
    });

    test('should handle string inputs', () => {
      const result = solver!('8');
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^[01]+$/);
    });

    test('should handle edge cases', () => {
      expect(solver!(0)).toBe('0000');
      expect(solver!(1)).toBe('1111');
    });
  });

  describe('Compression III: LZ Compression', () => {
    const solver = contractSolvers['Compression III: LZ Compression'];
    
    test('should compress strings using LZ', () => {
      const result = solver!('abracadabra');
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^\d+[a-z]+\d+$/);
    });

    test('should handle example cases', () => {
      const result1 = solver!('mississippi');
      expect(typeof result1).toBe('string');
      expect(result1).toMatch(/^\d+[a-z]+\d+$/);
      
      const result2 = solver!('aAAaAAaAaAA');
      expect(typeof result2).toBe('string');
      expect(result2).toMatch(/^\d+[a-zA-Z]+\d+$/);
    });

    test('should handle edge cases', () => {
      expect(solver!('')).toBe('');
      expect(solver!('a')).toBe('1a');
    });
  });

  describe('Compression II: LZ Decompression', () => {
    const solver = contractSolvers['Compression II: LZ Decompression'];
    
    test('should decompress LZ encoded strings', () => {
      const result = solver!('5aaabb450723abb');
      expect(result).toBe('aaabbaaababababaabb');
    });

    test('should handle example cases', () => {
      const result1 = solver!('4miss433ppi');
      expect(result1).toBe('mississippi');
      
      const result2 = solver!('3aAA53035');
      expect(result2).toBe('aAAaAAaAaAA');
    });

    test('should handle edge cases', () => {
      expect(solver!('')).toBe('');
    });
  });

  describe('Unique Paths in a Grid I', () => {
    const solver = contractSolvers['Unique Paths in a Grid I'];
    
    test('should count unique paths in grid', () => {
      const result = solver!([2, 14]);
      expect(result).toBe(14);
    });

    test('should handle different grid sizes', () => {
      const result1 = solver!([3, 3]);
      expect(result1).toBe(6);
      
      const result2 = solver!([1, 1]);
      expect(result2).toBe(1);
    });

    test('should handle edge cases', () => {
      expect(solver!([])).toBe(0);
      expect(solver!([0, 5])).toBe(0);
      expect(solver!([5, 0])).toBe(0);
    });
  });

  describe('Solver Registry Functions', () => {
    test('getContractSolver should return correct solver', () => {
      const solver = getContractSolver('Array Jumping Game');
      expect(typeof solver).toBe('function');
    });

    test('getContractSolver should return null for unknown type', () => {
      const solver = getContractSolver('Unknown Contract');
      expect(solver).toBeNull();
    });

    test('hasContractSolver should return correct boolean', () => {
      expect(hasContractSolver('Array Jumping Game')).toBe(true);
      expect(hasContractSolver('Unknown Contract')).toBe(false);
    });

    test('contractSolvers should contain all expected types', () => {
      const expectedTypes = [
        'Encryption I: Caesar Cipher',
        'Array Jumping Game',
        'Find Largest Prime Factor',
        'Subarray with Maximum Sum',
        'Total Ways to Sum',
        'Proper 2-Coloring of a Graph',
        'Algorithmic Stock Trader III',
        'Merge Overlapping Intervals',
        'Generate IP Addresses',
        'Find All Valid Math Expressions',
        'Compression I: RLE Compression',
        'Total Ways to Sum II',
        'Square Root',
        'Array Jumping Game II',
        'Algorithmic Stock Trader IV',
        'Shortest Path in a Grid',
        'Spiralize Matrix',
        'Unique Paths in a Grid II',
        'Minimum Path Sum in a Triangle',
        'Encryption II: Vigenère Cipher',
        'Algorithmic Stock Trader I',
        'HammingCodes: Integer to Encoded Binary',
        'Compression III: LZ Compression',
        'Compression II: LZ Decompression',
        'Unique Paths in a Grid I'
      ];

      expectedTypes.forEach(type => {
        expect(contractSolvers[type]).toBeDefined();
        expect(typeof contractSolvers[type]).toBe('function');
      });
    });
  });
});
