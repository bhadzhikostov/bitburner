/**
 * System Monitor Script
 *
 * This script provides real-time monitoring of your Bitburner status,
 * including money, skills, servers, and running scripts.
 *
 * Usage: run utility-monitor.js
 */

export async function main(ns: NS): Promise<void> {
  // Configuration
  const updateInterval = 1000; // Update every 1 second
  const showDetailedStats = ns.args.includes('--detailed');
  const showNetworkMap = ns.args.includes('--network');

  ns.tprint('Starting system monitor...');
  ns.tprint('Use --detailed for detailed stats, --network for network map');

  // Main monitoring loop
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Clear the screen (optional)
    if (ns.args.includes('--clear')) {
      ns.clearLog();
    }

    const player = ns.getPlayer();
    const currentTime = new Date().toLocaleTimeString();

    // Basic stats
    ns.print(`\n=== SYSTEM MONITOR [${currentTime}] ===`);
    ns.print(`Money: $${ns.formatNumber(player.money)} | Bank: $${ns.formatNumber(player.bank)}`);
    ns.print(`Total Money: $${ns.formatNumber(player.totalMoney)}`);
    ns.print(`Karma: ${player.karma.toFixed(0)} | City: ${player.city}`);

    // Skills
    ns.print(`\n=== SKILLS ===`);
    ns.print(`Hacking: ${player.hacking} (${ns.formatNumber(player.hacking_exp)} exp)`);
    ns.print(`Strength: ${player.strength} | Defense: ${player.defense}`);
    ns.print(`Dexterity: ${player.dexterity} | Agility: ${player.agility}`);
    ns.print(`Charisma: ${player.charisma} | Intelligence: ${player.intelligence}`);

    // Work status
    if (player.isWorking) {
      ns.print(`\n=== WORK STATUS ===`);
      ns.print(`Company: ${player.companyName} | Job: ${player.jobTitle}`);
      ns.print(
        `Performance: ${player.jobPerformance.toFixed(2)} | Time: ${await formatTime(
          player.timeWorked
        )}`
      );
      ns.print(
        `Exp Gain: H:${player.workHackExpGain}/s S:${player.workStrExpGain}/s D:${player.workDefExpGain}/s`
      );
    }

    // Crime status
    if (player.crimeType !== '') {
      ns.print(`\n=== CRIME STATUS ===`);
      ns.print(`Crime: ${player.crimeType} | Karma: ${player.crimeKarma}`);
    }

    // Server information
    if (showDetailedStats) {
      ns.print(`\n=== SERVER STATUS ===`);
      const homeServer = ns.getServer('home');
      ns.print(`Home RAM: ${homeServer.ramUsed.toFixed(1)}/${homeServer.maxRam.toFixed(1)} GB`);

      const purchasedServers = ns.getPurchasedServers();
      if (purchasedServers.length > 0) {
        let totalRam = 0;
        let usedRam = 0;

        for (const serverName of purchasedServers) {
          const server = ns.getServer(serverName);
          totalRam += server.maxRam;
          usedRam += server.ramUsed;
        }

        ns.print(
          `Purchased Servers: ${purchasedServers.length} | Total RAM: ${totalRam.toFixed(1)} GB`
        );
        ns.print(
          `RAM Usage: ${usedRam.toFixed(1)}/${totalRam.toFixed(1)} GB (${((usedRam / totalRam) * 100).toFixed(1)}%)`
        );
      }
    }

    // Running scripts
    ns.print(`\n=== RUNNING SCRIPTS ===`);
    const allServers = await getAllServers(ns);
    let totalScripts = 0;
    let totalIncome = 0;
    let totalExp = 0;

    for (const hostname of allServers) {
      const runningScripts = ns.ps(hostname);

      for (const script of runningScripts) {
        if (script.filename !== 'utility-monitor.js') {
          // Don't count this script
          totalScripts++;
          totalIncome += ns.getScriptIncome(script.filename, hostname, ...script.args);
          totalExp += ns.getScriptExpGain(script.filename, hostname, ...script.args);

          if (showDetailedStats) {
            ns.print(`${hostname}: ${script.filename} (${script.threads} threads)`);
          }
        }
      }
    }

    ns.print(
      `Total Scripts: ${totalScripts} | Income: $${ns.formatNumber(totalIncome)}/s | Exp: ${ns.formatNumber(totalExp)}/s`
    );

    // Network map (if requested)
    if (showNetworkMap) {
      ns.print(`\n=== NETWORK MAP ===`);
      await displayNetworkMap(ns);
    }

    // Wait before next update
    await ns.sleep(updateInterval);
  }
}

/**
 * Get all servers in the network recursively
 */
export async function getAllServers(ns: NS, startServer: string = 'home'): Promise<string[]> {
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
 * Display a simple network map
 */
export async function displayNetworkMap(ns: NS): Promise<void> {
  const visited = new Set<string>();
  const queue = [{ server: 'home', depth: 0 }];

  while (queue.length > 0) {
    const item = queue.shift();
    if (!item) continue;

    const { server, depth } = item;
    if (!visited.has(server)) {
      visited.add(server);

      const indent = '  '.repeat(depth);
      const serverInfo = ns.getServer(server);
      const status = serverInfo.hasAdminRights ? '✓' : '✗';

      ns.print(`${indent}${status} ${server} (${serverInfo.maxRam.toFixed(1)}GB)`);

      if (depth < 3) {
        // Limit depth to avoid spam
        const connections = ns.scan(server);
        for (const connection of connections) {
          if (!visited.has(connection)) {
            queue.push({ server: connection, depth: depth + 1 });
          }
        }
      }
    }
  }
}

/**
 * Format time in milliseconds to human readable format
 */
export async function formatTime(ms: number): Promise<string> {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}
