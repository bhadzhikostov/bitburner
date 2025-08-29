/**
 * Contract-related type definitions for Bitburner
 */

export interface CodingContract {
  type: string;
  description: string;
  data: any;
  numTries: number;
  maxTries: number;
}

export interface ContractSolution {
  type: string;
  solution: any;
  description: string;
}

export interface ContractResult {
  success: boolean;
  message: string;
  reward?: any;
}

export interface ContractStats {
  totalAttempted: number;
  totalSolved: number;
  totalFailed: number;
  successRate: number;
  averageAttempts: number;
}

export type ContractSolver = (data: any) => any;

export interface ContractSolverRegistry {
  [contractType: string]: ContractSolver;
}
