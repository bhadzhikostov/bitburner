/**
 * Test setup file for Bitburner scripts
 *
 * This file sets up mocks and test environment for the game APIs
 */

// Mock the global ns object
const mockNS = {
  // File operations
  read: jest.fn(),
  write: jest.fn(),
  rm: jest.fn(),
  exists: jest.fn(),
  ls: jest.fn(),
  mv: jest.fn(),
  cp: jest.fn(),

  // Server operations
  scan: jest.fn(),
  getServer: jest.fn(),
  getServerMoneyAvailable: jest.fn(),
  getServerMaxMoney: jest.fn(),
  getServerGrowth: jest.fn(),
  getServerSecurityLevel: jest.fn(),
  getServerMinSecurityLevel: jest.fn(),
  getServerRequiredHackingLevel: jest.fn(),
  getServerNumPortsRequired: jest.fn(),
  getServerOpenPortCount: jest.fn(),
  getServerMaxRam: jest.fn(),
  getServerUsedRam: jest.fn(),
  getServerRam: jest.fn(),

  // Hacking operations
  hack: jest.fn(),
  grow: jest.fn(),
  weaken: jest.fn(),

  // Script operations
  exec: jest.fn(),
  kill: jest.fn(),
  killall: jest.fn(),
  isRunning: jest.fn(),
  getScriptName: jest.fn(),
  getHostname: jest.fn(),
  getScriptRam: jest.fn(),
  getScriptIncome: jest.fn(),
  getScriptExpGain: jest.fn(),

  // Player operations
  getPlayer: jest.fn(),
  getHackingLevel: jest.fn(),
  getHackingMultipliers: jest.fn(),
  hackAnalyzeChance: jest.fn(),
  getHackingTime: jest.fn(),
  getGrowTime: jest.fn(),
  getWeakenTime: jest.fn(),

  // Utility functions
  sleep: jest.fn(),
  print: jest.fn(),
  tprint: jest.fn(),
  alert: jest.fn(),
  prompt: jest.fn(),
  getTimeSinceLastAug: jest.fn(),
  getResetInfo: jest.fn(),

  // Stock market
  getStockSymbols: jest.fn(),
  getStockPrice: jest.fn(),
  getStockForecast: jest.fn(),
  getStockVolatility: jest.fn(),
  buyStock: jest.fn(),
  sellStock: jest.fn(),
  shortStock: jest.fn(),
  sellShort: jest.fn(),

  // Corporation
  getCorporation: jest.fn(),
  createCorporation: jest.fn(),

  // Bladeburner
  getBladeburner: jest.fn(),
  joinBladeburner: jest.fn(),

  // Gang
  getGang: jest.fn(),
  createGang: jest.fn(),

  // Singularity
  getSingularity: jest.fn(),

  // Coding contracts
  codingcontract: {
    attempt: jest.fn(),
    createDummyContract: jest.fn(),
    getContractType: jest.fn(),
    getData: jest.fn(),
    getDescription: jest.fn(),
    getNumTriesRemaining: jest.fn(),
  },

  // Ports
  getPortHandle: jest.fn(),
  writePort: jest.fn(),
  readPort: jest.fn(),
  tryWritePort: jest.fn(),
  tryReadPort: jest.fn(),

  // Server management
  getPurchasedServers: jest.fn(),
  purchaseServer: jest.fn(),
  upgradePurchasedServer: jest.fn(),
  getPurchasedServerCost: jest.fn(),
  getPurchasedServerUpgradeCost: jest.fn(),

  // Process management
  ps: jest.fn(),

  // Formatting
  formatNumber: jest.fn((num) => num.toLocaleString()),

  // Formulas
  formulas: {
    hacking: {
      hackChance: jest.fn(),
      hackTime: jest.fn(),
      hackExp: jest.fn(),
      hackPercent: jest.fn(),
    },
    growth: {
      growTime: jest.fn(),
      growPercent: jest.fn(),
      growExp: jest.fn(),
    },
    weaken: {
      weakenTime: jest.fn(),
      weakenEffect: jest.fn(),
      weakenExp: jest.fn(),
    },
  },
} as any;

// Assign to global
(global as any).ns = mockNS;

// Mock console methods
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

// Mock setTimeout and setInterval - use simple mocks to avoid recursion
jest.spyOn(global, 'setTimeout').mockImplementation((callback: any, _delay: any) => {
  const id = Math.random();
  // Use process.nextTick to avoid recursion
  process.nextTick(() => callback());
  return id as any;
});

jest.spyOn(global, 'setInterval').mockImplementation((callback: any, _delay: any) => {
  const id = Math.random();
  // Use process.nextTick to avoid recursion
  process.nextTick(() => callback());
  return id as any;
});

// Mock clearTimeout and clearInterval
jest.spyOn(global, 'clearTimeout').mockImplementation(() => {});
jest.spyOn(global, 'clearInterval').mockImplementation(() => {});

// Mock Date
global.Date = class extends Date {
  constructor(...args: any[]) {
    if (args.length === 0) {
      super(1000000000000); // Default timestamp for tests
    } else {
      super(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    }
  }
} as any;

// Mock Math.random for predictable tests
const originalRandom = Math.random;
let randomCounter = 0;
Math.random = jest.fn(() => {
  randomCounter++;
  return (randomCounter % 100) / 100; // Cycle through 0.00 to 0.99
});

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  randomCounter = 0;
});

// Restore original Math.random after all tests
afterAll(() => {
  Math.random = originalRandom;
});
