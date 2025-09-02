/**
 * Bitburner Script Configuration
 *
 * This file contains common configuration settings that can be
 * imported and used across different scripts.
 */

export const CONFIG = {
  // Hacking settings
  HACKING: {
    MIN_HACK_CHANCE: 0.8,           // Minimum hack chance before attempting
    MONEY_THRESHOLD: 0.1,           // Minimum money percentage before growing
    SECURITY_BUFFER: 5,              // Security level buffer above minimum
    HACK_PERCENT: 0.25,             // Percentage of money to hack per cycle
    GROW_PERCENT: 0.75,             // Percentage of money to grow per cycle
  },

  // Server management
  SERVERS: {
    MAX_PURCHASED_SERVERS: 25,       // Maximum number of servers to own
    MIN_RAM: 8,                     // Minimum RAM for new servers (GB)
    TARGET_RAM: 64,                 // Target RAM to upgrade servers to (GB)
    RESERVE_MONEY: 0.1,             // Keep 10% of money in reserve
    UPGRADE_THRESHOLD: 0.8,         // Upgrade when money allows 80% of target
  },

  // Stock market
  STOCKS: {
    BUY_THRESHOLD: 0.6,             // Buy when forecast is below 60%
    SELL_THRESHOLD: 0.7,            // Sell when forecast is above 70%
    MAX_INVESTMENT: 0.1,            // Use max 10% of money per stock
    PROFIT_TARGET: 0.2,             // Sell when profit reaches 20%
    UPDATE_INTERVAL: 6000,          // Update every 6 seconds (game time)
  },

  // Script management
  SCRIPTS: {
    RESERVE_RAM: 0.1,               // Reserve 10% of RAM on each server
    MAX_THREADS_PER_SERVER: 100,    // Maximum threads per server
    SCRIPT_TIMEOUT: 30000,          // Script timeout in milliseconds
    LOG_LEVEL: 'INFO',              // Default log level (INFO, WARN, ERROR)
  },

  // Monitoring
  MONITORING: {
    UPDATE_INTERVAL: 1000,          // Update every 1 second
    SHOW_DETAILED_STATS: false,     // Show detailed statistics by default
    SHOW_NETWORK_MAP: false,        // Show network map by default
    CLEAR_SCREEN: false,            // Clear screen on each update
  },

  // Combat (when available)
  COMBAT: {
    MIN_STRENGTH: 100,              // Minimum strength before combat
    MIN_DEFENSE: 100,               // Minimum defense before combat
    MIN_DEXTERITY: 100,             // Minimum dexterity before combat
    MIN_AGILITY: 100,               // Minimum agility before combat
    COMBAT_INTERVAL: 5000,          // Combat action interval
  },

  // Work and crime
  ACTIVITIES: {
    WORK_INTERVAL: 10000,           // Work action interval
    CRIME_INTERVAL: 5000,           // Crime action interval
    MIN_WORK_PERFORMANCE: 0.8,      // Minimum work performance
    MAX_CRIME_KARMA: -1000,         // Maximum negative karma from crime
  },

  // Factions and corporations
  ORGANIZATIONS: {
    MIN_REP_FOR_JOIN: 1000,        // Minimum reputation to join faction
    MAX_FACTIONS: 5,                // Maximum factions to join
    CORP_INVESTMENT: 0.2,           // Percentage of money to invest in corp
  },

  // Advanced features
  ADVANCED: {
    USE_FORMULAS: true,             // Use game formulas when available
    AUTO_BACKDOOR: true,           // Automatically install backdoors
    AUTO_NUKE: true,               // Automatically nuke servers
    PRIORITY_TARGETS: [             // Priority hacking targets
      'n00dles',
      'foodnstuff',
      'sigma-cosmetics',
      'joesguns',
      'hong-fang-tea',
      'harakiri-sushi',
      'neo-net',
      'zer0',
      'max-hardware',
      'iron-gym'
    ],
  }
};

/**
 * Get configuration value with fallback
 */
export function getConfig(path: string, defaultValue: any = null): any {
  const keys = path.split('.');
  let value: any = CONFIG;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }

  return value;
}

/**
 * Update configuration value
 */
export function setConfig(path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  let current: any = CONFIG;

  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
}

/**
 * Validate configuration
 */
export function validateConfig(): string[] {
  const errors: string[] = [];

  // Check required fields
  if (CONFIG.SERVERS.MAX_PURCHASED_SERVERS <= 0) {
    errors.push('MAX_PURCHASED_SERVERS must be positive');
  }

  if (CONFIG.SERVERS.MIN_RAM <= 0) {
    errors.push('MIN_RAM must be positive');
  }

  if (CONFIG.HACKING.MIN_HACK_CHANCE <= 0 || CONFIG.HACKING.MIN_HACK_CHANCE >= 1) {
    errors.push('MIN_HACK_CHANCE must be between 0 and 1');
  }

  return errors;
}
