/**
 * Hack Priority Targets
 *
 * Ensures root access on all configured priority targets and launches
 * the basic hacking loop against each one.
 *
 * Usage: run src/scripts/hacking-priority-targets.js [threadsPerTarget]
 */

/**
 * Try to gain root access using available port openers.
 * @param {NS} ns
 * @param {string} host
 * @returns {boolean} true if root is obtained or already present
 */
function tryGainRoot(ns, host) {
  if (ns.hasRootAccess(host)) return true;

  let portsOpened = 0;
  try {
    if (ns.fileExists('BruteSSH.exe', 'home')) {
      ns.brutessh(host);
      portsOpened++;
    }
  } catch {}
  try {
    if (ns.fileExists('FTPCrack.exe', 'home')) {
      ns.ftpcrack(host);
      portsOpened++;
    }
  } catch {}
  try {
    if (ns.fileExists('relaySMTP.exe', 'home')) {
      ns.relaysmtp(host);
      portsOpened++;
    }
  } catch {}
  try {
    if (ns.fileExists('HTTPWorm.exe', 'home')) {
      ns.httpworm(host);
      portsOpened++;
    }
  } catch {}
  try {
    if (ns.fileExists('SQLInject.exe', 'home')) {
      ns.sqlinject(host);
      portsOpened++;
    }
  } catch {}

  const req = ns.getServerNumPortsRequired(host);
  if (portsOpened >= req) {
    try {
      ns.nuke(host);
    } catch {}
  }

  return ns.hasRootAccess(host);
}

/** @param {NS} ns */
export async function main(ns) {
  const targets = getConfig('ADVANCED.PRIORITY_TARGETS', []);
  if (!Array.isArray(targets) || targets.length === 0) {
    ns.tprint('ERROR: No PRIORITY_TARGETS configured in settings');
    return;
  }

  const script = 'src/scripts/hacking-basic-hack.js';
  const home = 'home';
  const threadsArg = Number(ns.args[0]);
  const defaultThreads = Number.isFinite(threadsArg) && threadsArg > 0 ? Math.floor(threadsArg) : 1;

  // Ensure the script exists and determine RAM usage
  if (!ns.fileExists(script, home)) {
    ns.tprint(`ERROR: Missing script '${script}'.`);
    ns.tprint('Make sure it is deployed to the game.');
    return;
  }

  const scriptRam = ns.getScriptRam(script, home);

  for (const target of targets) {
    // Ensure we have discovered the server (game auto-discovers common ones)
    // Attempt to gain root access
    const rooted = tryGainRoot(ns, target);
    if (!rooted) {
      ns.tprint(`WARN: Could not gain root on ${target} yet (missing port openers).`);
      continue;
    }

    // Check hacking level vs requirement
    const reqHack = ns.getServerRequiredHackingLevel(target);
    const lvl = ns.getHackingLevel();
    if (lvl < reqHack) {
      ns.tprint(`INFO: Skipping ${target} (requires hacking ${reqHack}, have ${lvl}).`);
      continue;
    }

    // Avoid duplicate runs for same target
    if (ns.isRunning(script, home, target)) {
      ns.print(`Already hacking ${target}`);
      continue;
    }

    // Calculate feasible threads given home RAM and reserve
    const maxRam = ns.getServerMaxRam(home);
    const usedRam = ns.getServerUsedRam(home);
    const reserveFrac = getConfig('SCRIPTS.RESERVE_RAM', 0.1);
    const reserveRam = Math.max(0, Math.floor(maxRam * reserveFrac));
    const freeRam = Math.max(0, maxRam - usedRam - reserveRam);

    let threads = Math.min(defaultThreads, Math.floor(freeRam / scriptRam));
    if (threads < 1) {
      ns.tprint(`WARN: Not enough free RAM to start hacking ${target}.`);
      continue;
    }

    const pid = ns.exec(script, home, threads, target);
    if (pid === 0) {
      ns.tprint(`ERROR: Failed to start ${script} for ${target}.`);
    } else {
      ns.tprint(`Started hacking ${target} with ${threads} thread(s) (pid ${pid}).`);
    }
  }
}

