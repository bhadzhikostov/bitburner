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
  // Get the target server from command line arguments
  const target = ns.args[0];

  if (!target) {
    ns.tprint('ERROR: Please provide a target server');
    ns.tprint('Usage: run hacking-basic-hack.js <target>');
    return;
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

  ns.tprint(`Starting hack cycle on ${target}`);
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
      ns.tprint(`WARNING: Low hack chance on ${target}, weakening...`);

      // Weaken the server to improve hack chance
      await ns.weaken(target);
      continue;
    }

    // Check if server has money to hack
    if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target) * 0.1) {
      ns.tprint(`Server ${target} is low on money, growing...`);

      // Grow the server to restore money
      await ns.grow(target);
      continue;
    }

    // Check if security is too high
    if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) + 5) {
      ns.tprint(`Server ${target} security too high, weakening...`);

      // Weaken the server to reduce security
      await ns.weaken(target);
      continue;
    }

    // All conditions met, perform the hack
    ns.tprint(`Hacking ${target}...`);
    const moneyStolen = await ns.hack(target);

    if (moneyStolen > 0) {
      ns.tprint(`Successfully hacked $${ns.formatNumber(moneyStolen)} from ${target}`);
    } else {
      ns.tprint(`Hack failed on ${target}`);
    }

    // Small delay between cycles
    await ns.sleep(100);
  }
}
