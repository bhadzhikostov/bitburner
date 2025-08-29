/**
 * Basic Hacking Script
 *
 * This script performs a simple hack-grow-weaken cycle on a target server.
 * It's designed for early-game progression and learning the basics.
 *
 * Usage: run hacking-basic-hack.js <target> [threads]
 * Example: run hacking-basic-hack.js n00dles 1
 * Example: run hacking-basic-hack.js foodnstuff 10
 */

export async function main(ns: NS): Promise<void> {
  // Get the target server and thread count from command line arguments
  const target = ns.args[0];
  const requestedThreads = parseInt(ns.args[1] as string) || 0;

  if (!target) {
    ns.tprint('ERROR: Please provide a target server');
    ns.tprint('Usage: run hacking-basic-hack.js <target> [threads]');
    ns.tprint('Example: run hacking-basic-hack.js n00dles 1');
    return;
  }

  // Calculate optimal thread count
  let threads: number;
  if (requestedThreads && requestedThreads > 0) {
    // Use user-specified thread count
    threads = requestedThreads;
    ns.tprint(`Using requested thread count: ${threads}`);
  } else {
    // Calculate max threads based on available RAM on the current server
    const currentServer = ns.getHostname();
    const ramAvailable = ns.getServerMaxRam(currentServer) - ns.getServerUsedRam(currentServer);

    // Calculate RAM cost per thread for this entire script
    const ramPerThread = ns.getScriptRam('hacking-basic-hack.js');

    // Calculate max threads this server can support
    threads = Math.floor(ramAvailable / ramPerThread);

    // Ensure at least 1 thread
    threads = Math.max(1, threads);

    ns.tprint(`Auto-calculated optimal thread count: ${threads}`);
    ns.tprint(`Current server: ${currentServer}`);
    ns.tprint(`Available RAM: ${(ramAvailable / 1024).toFixed(2)} GB`);
    ns.tprint(`RAM per thread: ${ramPerThread.toFixed(3)} GB`);
  }

  // Check if we can hack the target
  const player = ns.getPlayer();
  const server = ns.getServer(target);

  if (!server.hasAdminRights) {
    ns.tprint(`ERROR: No admin rights on ${target}`);
    return;
  }

  if (player.hacking < server.requiredHackingSkill) {
    ns.tprint(`ERROR: Need ${server.requiredHackingSkill} hacking skill, have ${player.hacking}`);
    return;
  }

  ns.tprint(`Starting hack cycle on ${target} with ${threads} thread${threads > 1 ? 's' : ''}`);
  ns.tprint(
    `Server money: $${ns.formatNumber(server.moneyAvailable)} / $${ns.formatNumber(server.moneyMax)}`
  );
  ns.tprint(
    `Security level: ${server.hackDifficulty.toFixed(2)} / ${server.minDifficulty.toFixed(2)}`
  );

  // Main hacking loop
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Check if we can hack the server
    if (ns.getHackingChance(target) < 0.8) {
      ns.tprint(`WARNING: Low hack chance on ${target}, weakening with ${threads} thread${threads > 1 ? 's' : ''}...`);

      // Weaken the server to improve hack chance
      await ns.weaken(target, { threads });
      continue;
    }

    // Check if server has money to hack
    if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target) * 0.1) {
      ns.tprint(`Server ${target} is low on money, growing with ${threads} thread${threads > 1 ? 's' : ''}...`);

      // Grow the server to restore money
      await ns.grow(target, { threads });
      continue;
    }

    // Check if security is too high
    if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) + 5) {
      ns.tprint(`Server ${target} security too high, weakening with ${threads} thread${threads > 1 ? 's' : ''}...`);

      // Weaken the server to reduce security
      await ns.weaken(target, { threads });
      continue;
    }

    // All conditions met, perform the hack
    ns.tprint(`Hacking ${target} with ${threads} thread${threads > 1 ? 's' : ''}...`);
    const moneyStolen = await ns.hack(target, { threads });

    if (moneyStolen > 0) {
      ns.tprint(`Successfully hacked $${ns.formatNumber(moneyStolen)} from ${target}`);
    } else {
      ns.tprint(`Hack failed on ${target}`);
    }

    // Small delay between cycles
    await ns.sleep(100);
  }
}
