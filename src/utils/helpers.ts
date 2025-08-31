/**
 * Utility functions for Bitburner scripts
 */

// Note: Server interface is defined globally in types/bitburner.d.ts

/**
 * Format money values for display
 */
export function formatMoney(amount: number): string {
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (absAmount >= 1e12) {
    return `$${sign}${(absAmount / 1e12).toFixed(2)}t`;
  } else if (absAmount >= 1e9) {
    return `$${sign}${(absAmount / 1e9).toFixed(2)}b`;
  } else if (absAmount >= 1e6) {
    return `$${sign}${(absAmount / 1e6).toFixed(2)}m`;
  } else if (absAmount >= 1e3) {
    return `$${sign}${(absAmount / 1e3).toFixed(2)}k`;
  } else {
    return `$${sign}${absAmount.toFixed(2)}`;
  }
}

/**
 * Format time in milliseconds to human readable format
 */
export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Calculate optimal thread count for a script based on available RAM
 */
export function calculateOptimalThreads(
  scriptRam: number,
  availableRam: number,
  reserveRam: number = 0
): number {
  const usableRam = availableRam - reserveRam;
  return Math.floor(usableRam / scriptRam);
}

/**
 * Get all servers in the network recursively
 */
export function getAllServers(ns: NS, startServer: string = 'home'): string[] {
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

/**
 * Get servers that can be hacked by the player
 */
export function getHackableServers(ns: NS): Server[] {
  const player = ns.getPlayer();
  const allServers = getAllServers(ns);
  const hackableServers: Server[] = [];

  for (const hostname of allServers) {
    const server = ns.getServer(hostname);
    if (
      server.hasAdminRights &&
      server.requiredHackingSkill <= player.hacking &&
      server.moneyMax > 0
    ) {
      hackableServers.push(server);
    }
  }

  return hackableServers.sort((a, b) => b.moneyMax - a.moneyMax);
}

/**
 * Calculate the best target server for hacking
 */
export function getBestHackTarget(ns: NS): Server | null {
  const hackableServers = getHackableServers(ns);
  if (hackableServers.length === 0) return null;

  // Score servers based on money, security, and growth
  const scoredServers = hackableServers.map(server => {
    const moneyScore = server.moneyMax / 1e9; // Normalize to billions
    const securityScore = 1 / (server.hackDifficulty / 100); // Lower security = higher score
    const growthScore = server.serverGrowth / 100; // Normalize growth

    const totalScore = moneyScore * 0.5 + securityScore * 0.3 + growthScore * 0.2;

    return { server, score: totalScore };
  });

  // Return the server with the highest score
  scoredServers.sort((a, b) => b.score - a.score);
  return scoredServers[0]?.server || null;
}

/**
 * Wait for a condition to be true
 */
export async function waitFor(
  condition: () => boolean,
  timeout: number = 30000,
  checkInterval: number = 100
): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (condition()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, checkInterval));
  }

  return false;
}

/**
 * Log message with timestamp
 */
export function log(ns: NS, message: string, level: 'INFO' | 'WARN' | 'ERROR' = 'INFO'): void {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;

  switch (level) {
    case 'ERROR':
      ns.tprint(logMessage);
      break;
    case 'WARN':
      ns.print(logMessage);
      break;
    default:
      ns.print(logMessage);
  }
}

/**
 * Check if a script is running on any server
 */
export function isScriptRunningAnywhere(ns: NS, scriptName: string): boolean {
  const allServers = getAllServers(ns);

  for (const hostname of allServers) {
    if (ns.isRunning(scriptName, hostname)) {
      return true;
    }
  }

  return false;
}

/**
 * Kill all instances of a script across all servers
 */
export function killAllInstances(ns: NS, scriptName: string): void {
  const allServers = getAllServers(ns);

  for (const hostname of allServers) {
    ns.killall(hostname, scriptName);
  }
}

/**
 * Try to gain root access using available port openers.
 * @param ns - The Netscript API
 * @param host - The target hostname
 * @returns true if root is obtained or already present
 */
export function tryGainRoot(ns: NS, host: string): boolean {
  // Check if we already have root access
  if (ns.hasRootAccess(host)) return true;

  // Get server info to check requirements
  const serverInfo = ns.getServer(host);
  const player = ns.getPlayer();

  // Check if player has required hacking level
  if (player.hacking < serverInfo.requiredHackingSkill) {
    return false; // Can't hack this server yet
  }

  let portsOpened = 0;

  // Try to open ports using available port openers
  if (ns.fileExists('BruteSSH.exe', 'home')) {
    try {
      ns.brutessh(host);
      portsOpened++;
    } catch (error) {
      // Port opener failed, continue with next one
    }
  }

  if (ns.fileExists('FTPCrack.exe', 'home')) {
    try {
      ns.ftpcrack(host);
      portsOpened++;
    } catch (error) {
      // Port opener failed, continue with next one
    }
  }

  if (ns.fileExists('relaySMTP.exe', 'home')) {
    try {
      ns.relaysmtp(host);
      portsOpened++;
    } catch (error) {
      // Port opener failed, continue with next one
    }
  }

  if (ns.fileExists('HTTPWorm.exe', 'home')) {
    try {
      ns.httpworm(host);
      portsOpened++;
    } catch (error) {
      // Port opener failed, continue with next one
    }
  }

  if (ns.fileExists('SQLInject.exe', 'home')) {
    try {
      ns.sqlinject(host);
      portsOpened++;
    } catch (error) {
      // Port opener failed, continue with next one
    }
  }

  // Check if we opened enough ports to nuke the server
  const requiredPorts = serverInfo.numOpenPortsRequired;
  if (portsOpened >= requiredPorts) {
    try {
      ns.nuke(host);
    } catch (error) {
      // Nuke failed, but we might still have access
    }
  }

  // Return whether we now have root access
  return ns.hasRootAccess(host);
}

/**
 * Get a list of available port openers that the player has
 * @param ns - The Netscript API
 * @returns Array of port opener names
 */
export function getAvailablePortOpeners(ns: NS): string[] {
  const portOpeners: string[] = [];

  if (ns.fileExists('BruteSSH.exe', 'home')) {
    portOpeners.push('BruteSSH.exe');
  }
  if (ns.fileExists('FTPCrack.exe', 'home')) {
    portOpeners.push('FTPCrack.exe');
  }
  if (ns.fileExists('relaySMTP.exe', 'home')) {
    portOpeners.push('relaySMTP.exe');
  }
  if (ns.fileExists('HTTPWorm.exe', 'home')) {
    portOpeners.push('HTTPWorm.exe');
  }
  if (ns.fileExists('SQLInject.exe', 'home')) {
    portOpeners.push('SQLInject.exe');
  }

  return portOpeners;
}

/**
 * Check if a server can potentially be hacked with current tools
 * @param ns - The Netscript API
 * @param host - The target hostname
 * @returns Object with canHack boolean and reason string
 */
export function canHackServer(ns: NS, host: string): { canHack: boolean; reason: string } {
  if (ns.hasRootAccess(host)) {
    return { canHack: true, reason: 'Already have root access' };
  }

  const serverInfo = ns.getServer(host);
  const player = ns.getPlayer();
  const availablePortOpeners = getAvailablePortOpeners(ns);

  if (player.hacking < serverInfo.requiredHackingSkill) {
    return {
      canHack: false,
      reason: `Required hacking level: ${serverInfo.requiredHackingSkill}, player level: ${player.hacking}`
    };
  }

  if (availablePortOpeners.length < serverInfo.numOpenPortsRequired) {
    return {
      canHack: false,
      reason: `Required ports: ${serverInfo.numOpenPortsRequired}, available port openers: ${availablePortOpeners.length}`
    };
  }

  return { canHack: true, reason: 'Can hack with available tools' };
}
