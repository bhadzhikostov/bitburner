/**
 * Loop Hack Script - Minimal Version
 *
 * Basic continuous hacking with minimal overhead.
 * Usage: run loop-hack.js <target>
 */

export async function main(ns: NS): Promise<void> {
  const target = ns.args[0] as string;

  if (!target) {
    ns.tprint('ERROR: Please provide a target server');
    return;
  }

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const maxMoney = ns.getServerMaxMoney(target);
    const currentMoney = ns.getServerMoneyAvailable(target);
    const isAboveThreshold = currentMoney >= (maxMoney * 0.5);

    if (maxMoney <= 0) break;

    if (isAboveThreshold) {
      await ns.hack(target);
    } else {
      await ns.sleep(1000);
    }
  }
}