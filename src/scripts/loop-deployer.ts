/**
 * Loop Deployer Script
 *
 * This script deploys and manages the loop algorithm bundle (hack, weaken, grow scripts)
 * across all available servers for maximum efficiency. It automatically calculates
 * optimal thread distribution and manages the coordination of all three scripts.
 * Based on the Bitburner Loop Algorithms documentation.
 *
 * Usage: run loop-deployer.js <target> [options]
 * Example: run loop-deployer.js n00dles
 * Example: run loop-deployer.js n00dles --hack-ratio 0.4 --weaken-ratio 0.3 --grow-ratio 0.3
 */

import { getAllServers, tryGainRoot, canHackServer, getAvailablePortOpeners, log } from '../utils/helpers';

interface LoopDeployOptions {
  hackRatio: number;
  weakenRatio: number;
  growRatio: number;
  exclude: string[];
  verbose: boolean;
  killExisting: boolean;
}

export async function main(ns: NS): Promise<void> {
  const target = ns.args[0] as string;

  if (!target) {
    ns.tprint('ERROR: Please provide a target server');
    ns.tprint('Usage: run loop-deployer.js <target> [options]');
    ns.tprint('Options:');
    ns.tprint('  --hack-ratio <number>    Ratio of threads for hacking (default: 1/13)');
    ns.tprint('  --weaken-ratio <number>  Ratio of threads for weakening (default: 2/13)');
    ns.tprint('  --grow-ratio <number>    Ratio of threads for growing (default: 10/13)');
    ns.tprint('  --exclude <server>       Exclude specific servers (can use multiple times)');
    ns.tprint('  --verbose                Show detailed deployment information');
    ns.tprint('  --kill-existing          Kill existing loop scripts before deploying');
    return;
  }

  // Parse options
  const options: LoopDeployOptions = {
    hackRatio: 1/13,  // 1 part out of 13 total (1+10+2)
    weakenRatio: 2/13, // 2 parts out of 13 total
    growRatio: 10/13,  // 10 parts out of 13 total
    exclude: [],
    verbose: false,
    killExisting: false
  };

  // Parse command line arguments
  for (let i = 1; i < ns.args.length; i++) {
    const arg = ns.args[i] as string;
    if (arg === '--hack-ratio' && i + 1 < ns.args.length) {
      options.hackRatio = parseFloat(ns.args[i + 1] as string) || 1/13;
      i++;
    } else if (arg === '--weaken-ratio' && i + 1 < ns.args.length) {
      options.weakenRatio = parseFloat(ns.args[i + 1] as string) || 2/13;
      i++;
    } else if (arg === '--grow-ratio' && i + 1 < ns.args.length) {
      options.growRatio = parseFloat(ns.args[i + 1] as string) || 10/13;
      i++;
    } else if (arg === '--exclude' && i + 1 < ns.args.length) {
      options.exclude.push(ns.args[i + 1] as string);
      i++;
    } else if (arg === '--verbose') {
      options.verbose = true;
    } else if (arg === '--kill-existing') {
      options.killExisting = true;
    }
  }

  // Validate ratios
  const totalRatio = options.hackRatio + options.weakenRatio + options.growRatio;
  if (Math.abs(totalRatio - 1.0) > 0.01) {
    ns.tprint(`WARNING: Thread ratios don't sum to 1.0 (${totalRatio.toFixed(2)}). Normalizing...`);
    options.hackRatio /= totalRatio;
    options.weakenRatio /= totalRatio;
    options.growRatio /= totalRatio;
  }

  // Validate target server
  try {
    ns.getServer(target);
  } catch {
    ns.tprint(`ERROR: Server '${target}' does not exist`);
    return;
  }

  // Check if we have root access to target
  if (!ns.hasRootAccess(target)) {
    ns.tprint(`ERROR: No root access to target server '${target}'`);
    return;
  }

  // Check hacking level requirement
  const requiredLevel = ns.getServerRequiredHackingLevel(target);
  const playerLevel = ns.getHackingLevel();
  if (playerLevel < requiredLevel) {
    ns.tprint(`ERROR: Insufficient hacking level. Required: ${requiredLevel}, Current: ${playerLevel}`);
    return;
  }

  // Check if Formulas.exe is available
  const hasFormulas = ns.fileExists('Formulas.exe', 'home');

  ns.tprint(`Starting loop deployment for target: ${target}`);
  ns.tprint(`Formulas.exe available: ${hasFormulas ? 'YES' : 'NO'}`);
  ns.tprint(`Thread ratios - Hack: ${(options.hackRatio * 100).toFixed(1)}%, Weaken: ${(options.weakenRatio * 100).toFixed(1)}%, Grow: ${(options.growRatio * 100).toFixed(1)}%`);
  ns.tprint(`Ratio breakdown: 1 part hack, 2 parts weaken, 10 parts grow (total: 13 parts)`);

  // Script names
  const scripts = {
    hack: 'scripts/loop-hack.js',
    weaken: 'scripts/loop-weaken.js',
    grow: 'scripts/loop-grow.js'
  };

  // Check if all scripts exist
  for (const script of Object.values(scripts)) {
    if (!ns.fileExists(script)) {
      ns.tprint(`ERROR: Script '${script}' not found`);
      return;
    }
  }

  // Get all available servers
  const allServers = getAllServers(ns);
  const targetServers = allServers.filter(server => !options.exclude.includes(server));

  ns.tprint(`Found ${targetServers.length} servers for deployment (${allServers.length} total, ${options.exclude.length} excluded)`);

  // Kill existing loop scripts if requested
  if (options.killExisting) {
    ns.tprint('Killing existing loop scripts...');
    for (const server of targetServers) {
      for (const script of Object.values(scripts)) {
        ns.killall(server, script);
      }
    }
  }

  let deployedCount = 0;
  let totalThreads = 0;

  // Deploy to each server
  for (const server of targetServers) {
    try {
      // Try to gain root access if needed
      if (!ns.hasRootAccess(server)) {
        const hackCheck = canHackServer(ns, server);
        if (!hackCheck.canHack) {
          if (options.verbose) {
            log(ns, `SKIP: ${server} - ${hackCheck.reason}`, 'WARN');
          }
          continue;
        }

        const rootGained = tryGainRoot(ns, server);
        if (!rootGained) {
          if (options.verbose) {
            const availablePortOpeners = getAvailablePortOpeners(ns);
            log(ns, `SKIP: ${server} - Could not gain root access. Available port openers: ${availablePortOpeners.join(', ') || 'none'}`, 'WARN');
          }
          continue;
        }
      }

      const serverInfo = ns.getServer(server);
      const availableRam = serverInfo.maxRam - serverInfo.ramUsed;

      // Calculate RAM requirements (all scripts have identical RAM usage)
      const scriptRam = ns.getScriptRam(scripts.grow);
      const totalScriptRam = scriptRam * 3; // 3 scripts total

      if (availableRam < totalScriptRam) {
        if (options.verbose) {
          log(ns, `SKIP: ${server} - Insufficient RAM (${availableRam.toFixed(2)} GB available, ${totalScriptRam.toFixed(2)} GB needed)`, 'WARN');
        }
        continue;
      }

      // Deploy all scripts
      let deploymentSuccess = true;
      for (const script of Object.values(scripts)) {
        const success = ns.scp(script, server);
        if (!success) {
          log(ns, `FAIL: ${server} - Failed to deploy ${script}`, 'ERROR');
          deploymentSuccess = false;
          break;
        }
      }

      if (!deploymentSuccess) {
        continue;
      }

      // Calculate optimal thread distribution
      const maxThreads = Math.floor(availableRam / scriptRam);

      let hackThreads, weakenThreads, growThreads;

      if (hasFormulas) {
        // Use Formulas.exe for optimal thread calculation
        const targetServer = ns.getServer(target);
        const player = ns.getPlayer();

        // Calculate optimal threads for each operation
        // hackPercent returns decimal (e.g., 0.25 for 25%), so to get 100% we need 1/hackPercent threads
        const hackPercent = ns.formulas.hacking.hackPercent(targetServer, player);
        const optimalHackThreads = Math.ceil(1 / hackPercent);
        const optimalWeakenThreads = Math.ceil((targetServer.hackDifficulty - targetServer.minDifficulty) / 0.05);

        // Use growThreads function from Formulas.exe API
        const targetMoney = targetServer.moneyMax * 0.95; // Target 95% of max money
        const cores = serverInfo.cpuCores; // Use cores from the executing server

        // Use the official growThreads function from Formulas.exe
        const optimalGrowThreads = Math.ceil(ns.formulas.hacking.growThreads(targetServer, player, targetMoney, cores));

        // Calculate ratios based on optimal thread counts
        const totalOptimal = optimalHackThreads + optimalWeakenThreads + optimalGrowThreads;
        const hackRatio = optimalHackThreads / totalOptimal;
        const weakenRatio = optimalWeakenThreads / totalOptimal;
        const growRatio = optimalGrowThreads / totalOptimal;

        // Distribute available threads based on optimal ratios
        hackThreads = Math.max(1, Math.floor(maxThreads * hackRatio));
        weakenThreads = Math.max(1, Math.floor(maxThreads * weakenRatio));
        growThreads = Math.max(1, Math.floor(maxThreads * growRatio));
      } else {
        // Fallback to ratio-based distribution
        hackThreads = Math.max(1, Math.floor(maxThreads * options.hackRatio));
        weakenThreads = Math.max(1, Math.floor(maxThreads * options.weakenRatio));
        growThreads = Math.max(1, Math.floor(maxThreads * options.growRatio));
      }

      // Start scripts with staggered timing to prevent overhacking
      const pids = {
        hack: ns.exec(scripts.hack, server, hackThreads, target),
        weaken: 0,
        grow: 0
      };

      // Stagger the start times to prevent overhacking
      await ns.sleep(100); // Small delay between script starts
      pids.weaken = ns.exec(scripts.weaken, server, weakenThreads, target);

      await ns.sleep(100); // Another small delay
      pids.grow = ns.exec(scripts.grow, server, growThreads, target);

      // Check if all scripts started successfully
      const allStarted = Object.values(pids).every(pid => pid > 0);

      if (allStarted) {
        deployedCount++;
        totalThreads += hackThreads + weakenThreads + growThreads;

        if (options.verbose) {
          const method = hasFormulas ? 'Formulas.exe' : 'Ratio-based';
          log(ns, `SUCCESS: ${server} - Deployed with ${hackThreads}H/${weakenThreads}W/${growThreads}G threads (${method}, PIDs: ${pids.hack}/${pids.weaken}/${pids.grow})`, 'INFO');
        }
      } else {
        log(ns, `FAIL: ${server} - Some scripts failed to start`, 'ERROR');
      }

    } catch (error) {
      log(ns, `ERROR: ${server} - ${error}`, 'ERROR');
    }
  }

  // Print summary
  ns.tprint('');
  ns.tprint('=== LOOP DEPLOYMENT SUMMARY ===');
  ns.tprint(`Target: ${target}`);
  ns.tprint(`Servers deployed: ${deployedCount}/${targetServers.length}`);
  ns.tprint(`Total threads: ${totalThreads}`);
  ns.tprint(`Thread distribution:`);
  ns.tprint(`  Hack: ${Math.floor(totalThreads * options.hackRatio)} threads`);
  ns.tprint(`  Weaken: ${Math.floor(totalThreads * options.weakenRatio)} threads`);
  ns.tprint(`  Grow: ${Math.floor(totalThreads * options.growRatio)} threads`);

  if (deployedCount > 0) {
    ns.tprint(`✅ Loop algorithms deployed successfully on ${deployedCount} servers`);
    ns.tprint(`🎯 All scripts are now targeting: ${target}`);
  } else {
    ns.tprint(`❌ No servers were deployed to successfully`);
  }
}
