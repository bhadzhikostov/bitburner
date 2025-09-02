/**
 * Basic Hacking Script
 *
 * This script performs a simple hack-grow-weaken cycle on a target server.
 * It's designed for early-game progression and learning the basics.
 *
 * Usage: run hacking-basic-hack.js <target> [threads] [--verbose]
 * Example: run hacking-basic-hack.js n00dles 1
 * Example: run hacking-basic-hack.js foodnstuff 10 --verbose
 */

export async function main(ns: NS): Promise<void> {
  // Parse flags and positional args manually to avoid type issues
  const rawArgs = ns.args;
  const verbose = rawArgs.some((arg) => arg === '--verbose' || arg === '-v');
  const positional = rawArgs.filter((arg) => !(typeof arg === 'string' && arg.startsWith('-')));

  const target = typeof positional[0] === 'string' ? positional[0] : String(positional[0] || '');
  const requestedThreads =
    typeof positional[1] === 'number' ? positional[1] : parseInt(String(positional[1] || '0')) || 0;

  const vprint = (message: string): void => {
    if (verbose) ns.tprint(message);
  };

  if (!target) {
    ns.tprint('ERROR: Please provide a target server');
    ns.tprint('Usage: run hacking-basic-hack.js <target> [threads] [--verbose]');
    ns.tprint('Example: run hacking-basic-hack.js n00dles 1');
    return;
  }

  // Calculate optimal thread count
  let threads: number;
  if (requestedThreads && requestedThreads > 0) {
    // Use user-specified thread count
    threads = requestedThreads;
    vprint(`Using requested thread count: ${threads}`);
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

    vprint(`Auto-calculated optimal thread count: ${threads}`);
    vprint(`Current server: ${currentServer}`);
    vprint(`Available RAM: ${(ramAvailable / 1024).toFixed(2)} GB`);
    vprint(`RAM per thread: ${ramPerThread.toFixed(3)} GB`);
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

  vprint(`Starting hack cycle on ${target} with ${threads} thread${threads > 1 ? 's' : ''}`);
  vprint(
    `Server money: $${ns.formatNumber(server.moneyAvailable)} / $${ns.formatNumber(server.moneyMax)}`
  );
  vprint(
    `Security level: ${server.hackDifficulty.toFixed(2)} / ${server.minDifficulty.toFixed(2)}`
  );

  // Main hacking loop
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const minSecurityLevel = ns.getServerMinSecurityLevel(target);
    const securityLevel = ns.getServerSecurityLevel(target);
    const hackChance = ns.hackAnalyzeChance(target);

    // Check if we can hack the server
    if (hackChance < 0.8 && Math.floor(securityLevel) !== minSecurityLevel) {
      vprint(`WARNING: Low hack chance on ${target}, weakening... chance: ${ns.formatNumber(hackChance)}, securityLevel: ${ns.formatNumber(securityLevel)}, minSecurityLevel: ${ns.formatNumber(minSecurityLevel)}`);

      // Weaken the server to improve hack chance
      await ns.weaken(target, { threads });
      continue;
    }

    // Check if server has money to hack
    if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target) * 0.1) {
      vprint(`Server ${target} is low on money, growing with ${threads} thread${threads > 1 ? 's' : ''}...`);

      // Grow the server to restore money
      await ns.grow(target, { threads });
      continue;
    }

    // Check if security is too high
    if (securityLevel > (minSecurityLevel + 5)) {
      vprint(`Server ${target} security too high, weakening with ${threads} thread${threads > 1 ? 's' : ''}...`);

      // Weaken the server to reduce security
      await ns.weaken(target, { threads });
      continue;
    }

    // All conditions met, perform the hack
    vprint(`Hacking ${target} with ${threads} thread${threads > 1 ? 's' : ''}...`);
    const moneyStolen = await ns.hack(target, { threads });

    if (moneyStolen > 0) {
      ns.tprint(`Successfully hacked $${ns.formatNumber(moneyStolen)} from ${target}`);
    } else {
      vprint(`Hack failed on ${target}`);
    }

    // Small delay between cycles
    await ns.sleep(100);
  }
}
