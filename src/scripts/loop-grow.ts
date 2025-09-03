/**
 * Loop Grow Script - Minimal Version
 *
 * Basic continuous growing with minimal overhead.
 * Usage: run loop-grow.js <target>
 */

export async function main(ns: NS): Promise<void> {
  const target = ns.args[0] as string;

  if (!target) {
    ns.tprint('ERROR: Please provide a target server');
    return;
  }

  // eslint-disable-next-line no-constant-condition
  while (true) {
    await ns.grow(target);
  }
}