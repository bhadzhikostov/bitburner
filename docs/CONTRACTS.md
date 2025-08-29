# Contract Infrastructure

This directory contains a comprehensive infrastructure for creating and solving coding contracts in Bitburner.

## Overview

The contract infrastructure provides:
- **Automatic contract detection** across all accessible servers
- **Built-in solvers** for common contract types
- **Contract management tools** for filtering and batch operations
- **Continuous monitoring** for new contracts
- **Statistics and reporting** on contract performance

## Components

### 1. Type Definitions (`src/types/contracts.d.ts`)

Defines interfaces for:
- `CodingContract` - Basic contract information
- `ContractSolution` - Contract solutions and metadata
- `ContractResult` - Results of contract attempts
- `ContractStats` - Statistics tracking
- `ContractSolver` - Function type for contract solvers

### 2. Contract Helpers (`src/utils/contract-helpers.ts`)

Utility functions for:
- Finding contracts on servers
- Getting contract information
- Attempting to solve contracts
- Formatting contract data
- Calculating statistics

### 3. Contract Solvers (`src/utils/contract-solvers.ts`)

Built-in solvers for contract types:
- Array Jumping Game (I & II)
- Find Largest Prime Factor
- Generate IP Addresses
- Merge Overlapping Intervals
- Minimum Path Sum in a Triangle
- Sanitize Parentheses in Expression
- Spiralize Matrix
- Subarray with Maximum Sum
- Total Ways to Sum (I & II)
- Unique Paths in a Grid (I & II)
- Vigenère Cipher

### 4. Contract Solver Script (`src/scripts/contract-solver.ts`)

Simple script that:
- Scans for all contracts
- Automatically solves them using available solvers
- Provides basic statistics

### 5. Contract Manager Script (`src/scripts/contract-manager.ts`)

Advanced management with commands:
- `scan` - Scan for contracts
- `list` - List contracts with filtering
- `solve` - Solve all available contracts
- `solve-type <type>` - Solve contracts of specific type
- `solve-server <server>` - Solve contracts on specific server
- `stats` - Show statistics
- `help` - Show help

### 6. Contract Monitor Script (`src/scripts/contract-monitor.ts`)

Continuous monitoring that:
- Automatically scans for new contracts
- Solves contracts as they become available
- Provides real-time status updates
- Configurable scan and solve intervals

## Usage

### Basic Contract Solving

```bash
# Solve all contracts once
run contract-solver.js

# Or use the manager
run contract-manager.js solve
```

### Advanced Contract Management

```bash
# Scan for contracts
run contract-manager.js scan

# List all contracts
run contract-manager.js list

# List only contracts with available solvers
run contract-manager.js list --has-solver

# List only contracts that can be attempted
run contract-manager.js list --worth-attempting

# Solve contracts of a specific type
run contract-manager.js solve-type "Array Jumping Game"

# Solve contracts on a specific server
run contract-manager.js solve-server "n00dles"

# Show statistics
run contract-manager.js stats
```

### Continuous Monitoring

```bash
# Start monitoring with default intervals (30s scan, 5s solve)
run contract-monitor.js

# Custom intervals (60s scan, 10s solve)
run contract-monitor.js --scan-interval 60 --solve-interval 10

# Show help
run contract-monitor.js --help
```

## Adding New Contract Solvers

To add support for a new contract type:

1. **Create the solver function** in `src/utils/contract-solvers.ts`:
```typescript
const solveNewContractType: ContractSolver = (data: any): any => {
  // Your solution logic here
  return solution;
};
```

2. **Add it to the registry**:
```typescript
export const contractSolvers: ContractSolverRegistry = {
  // ... existing solvers
  'New Contract Type': solveNewContractType
};
```

3. **The infrastructure will automatically detect and use it**

## Contract Types and Data Formats

### Array Jumping Game
- **Data**: `number[]` - Array of jump distances
- **Solution**: `number` - Minimum jumps needed

### Find Largest Prime Factor
- **Data**: `number` - Number to factorize
- **Solution**: `number` - Largest prime factor

### Generate IP Addresses
- **Data**: `string` - String of digits
- **Solution**: `string[]` - Valid IP addresses

### Merge Overlapping Intervals
- **Data**: `number[][]` - Array of [start, end] intervals
- **Solution**: `number[][]` - Merged intervals

### Minimum Path Sum in a Triangle
- **Data**: `number[][]` - Triangle as 2D array
- **Solution**: `number` - Minimum path sum

### Sanitize Parentheses in Expression
- **Data**: `string` - Expression with parentheses
- **Solution**: `string[]` - Valid expressions

### Spiralize Matrix
- **Data**: `number[][]` - 2D matrix
- **Solution**: `number[]` - Elements in spiral order

### Subarray with Maximum Sum
- **Data**: `number[]` - Array of numbers
- **Solution**: `number` - Maximum subarray sum

### Total Ways to Sum
- **Data**: `number` - Target sum
- **Solution**: `number` - Number of ways to sum

### Total Ways to Sum II
- **Data**: `[number, number[]]` - [target, available numbers]
- **Solution**: `number` - Number of ways to sum

### Unique Paths in a Grid I
- **Data**: `[number, number]` - [rows, columns]
- **Solution**: `number` - Number of unique paths

### Unique Paths in a Grid II
- **Data**: `number[][]` - Grid with obstacles (1 = blocked, 0 = open)
- **Solution**: `number` - Number of unique paths

### Vigenère Cipher
- **Data**: `[string, string]` - [encrypted text, keyword]
- **Solution**: `string` - Decrypted text

## Error Handling

The infrastructure includes comprehensive error handling:
- Graceful handling of missing contracts
- Logging of all operations and errors
- Statistics tracking for failed attempts
- Automatic retry logic where appropriate

## Performance Considerations

- **Scan intervals** can be adjusted based on server performance
- **Solve intervals** control how frequently contracts are attempted
- **Batch operations** are available for processing multiple contracts
- **Memory usage** is optimized for long-running monitoring

## Troubleshooting

### Common Issues

1. **"No solver available"** - Contract type not yet implemented
2. **"Failed to solve"** - Solution algorithm needs debugging
3. **"Error accessing server"** - Server access permissions
4. **"No attempts remaining"** - Contract has been attempted too many times

### Debug Mode

Enable verbose logging by modifying the log level in the scripts or checking the console output for detailed information about contract processing.

## Future Enhancements

Potential improvements:
- Machine learning-based contract solving
- Contract difficulty estimation
- Reward optimization strategies
- Integration with other Bitburner systems
- Web-based contract management interface
- Contract sharing and collaboration features
