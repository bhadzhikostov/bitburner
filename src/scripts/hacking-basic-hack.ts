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
  // Parse positional args only
  const rawArgs = ns.args;
  const positional: Array<string> = rawArgs.map((arg) => String(arg));
  const target = typeof positional[0] === 'string' ? positional[0] : '';

  if (!target) {
    ns.tprint('ERROR: Please provide a target server');
    ns.tprint('Usage: run hacking-basic-hack.js <target>');
    return;
  }

  // Thread count is determined by how the script was started; no need to compute here

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

  ns.print(`Starting hack cycle on ${target}`);
  ns.print(
    `Server money: $${ns.formatNumber(server.moneyAvailable)} / $${ns.formatNumber(server.moneyMax)}`
  );
  ns.print(
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
