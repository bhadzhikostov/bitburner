/**
 * Basic Hacking Script
 *
 * This script performs a simple hack-grow-weaken cycle on a target server.
 * It's designed for early-game progression and learning the basics.
 *
 * Usage: run hacking-basic-hack.js <target>
 * Example: run hacking-basic-hack.js n00dles
 */

export async function main(ns: NS): Promise<void> {
  const target = ns.args[0];

  if (!target) {
    ns.tprint('ERROR: Please provide a target server');
    ns.tprint('Usage: run hacking-basic-hack.js <target>');
    return;
  }

  // Main hacking loop
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const minSecurityLevel = ns.getServerMinSecurityLevel(target);
    const securityLevel = ns.getServerSecurityLevel(target);
    const hackChance = ns.hackAnalyzeChance(target);

    // Check if we can hack the server
    if (hackChance < 0.8 && Math.floor(securityLevel) !== minSecurityLevel) {
      ns.print(`WARNING: Low hack chance on ${target}, weakening... chance: ${ns.formatNumber(hackChance)}, securityLevel: ${ns.formatNumber(securityLevel)}, minSecurityLevel: ${ns.formatNumber(minSecurityLevel)}`);

      // Weaken the server to improve hack chance
      await ns.weaken(target);
      continue;
    }

    // Check if server has money to hack
    if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target) * 0.1) {
      ns.print(`Server ${target} is low on money, growing...`);

      // Grow the server to restore money
      await ns.grow(target);
      continue;
    }

    // Check if security is too high
    if (securityLevel > (minSecurityLevel + 5)) {
      ns.print(`Server ${target} security too high, weakening...`);

      // Weaken the server to reduce security
      await ns.weaken(target);
      continue;
    }

    // All conditions met, perform the hack
    ns.print(`Hacking ${target}...`);
    const moneyStolen = await ns.hack(target);

    if (moneyStolen > 0) {
      ns.tprint(`Successfully hacked $${ns.formatNumber(moneyStolen)} from ${target}`);
    } else {
      ns.print(`Hack failed on ${target}`);
    }

    // Small delay between cycles
    await ns.sleep(100);
  }
}
