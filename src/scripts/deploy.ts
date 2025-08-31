/**
 * Deploy Script - Deploys a file to all servers in the network
 *
 * Usage: run deploy.js <filename> [options]
 *
 * Examples:
 *   run deploy.js hacking-basic-hack.js
 *   run deploy.js contract-solver.js --overwrite
 *   run deploy.js growth-server-manager.js --exclude home
 *   run deploy.js hacking-basic-hack.js --run
 *   run deploy.js hacking-basic-hack.js --run n00dles
 *   run deploy.js contract-solver.js --overwrite --run foodnstuff 1000
 */

import { getAllServers, tryGainRoot, canHackServer, getAvailablePortOpeners } from '../utils/helpers';

interface DeployOptions {
  overwrite: boolean;
  exclude: string[];
  verbose: boolean;
  run: boolean;
  runArgs: string[];
}

export async function main(ns: NS): Promise<void> {
  // Parse command line arguments
  const args = ns.args as string[];

  if (args.length === 0) {
    ns.tprint('ERROR: Please specify a file to deploy');
    ns.tprint('Usage: run deploy.js <filename> [options]');
    ns.tprint('Options:');
    ns.tprint('  --overwrite    Overwrite existing files');
    ns.tprint('  --exclude <server>  Exclude specific servers (can use multiple times)');
    ns.tprint('  --verbose      Show detailed deployment information');
    ns.tprint('  --run [args...]  Run the script on all servers after deployment with optional arguments');
    ns.tprint('');
    ns.tprint('Examples:');
    ns.tprint('  run deploy.js hacking-basic-hack.js');
    ns.tprint('  run deploy.js contract-solver.js --overwrite');
    ns.tprint('  run deploy.js growth-server-manager.js --exclude home --exclude n00dles');
    ns.tprint('  run deploy.js hacking-basic-hack.js --run');
    ns.tprint('  run deploy.js hacking-basic-hack.js --run n00dles');
    ns.tprint('  run deploy.js contract-solver.js --overwrite --run foodnstuff 1000');
    return;
  }

  const filename = args[0];
  if (!filename) {
    ns.tprint('ERROR: Filename is required');
    return;
  }

  const options: DeployOptions = {
    overwrite: false,
    exclude: [],
    verbose: false,
    run: false,
    runArgs: []
  };

  // Parse options
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--overwrite') {
      options.overwrite = true;
    } else if (arg === '--verbose') {
      options.verbose = true;
    } else if (arg === '--run') {
      options.run = true;
      // Collect all arguments after --run
      for (let j = i + 1; j < args.length; j++) {
        const arg = args[j];
        if (arg !== undefined) {
          options.runArgs.push(arg);
        }
      }
      break; // Stop parsing after --run as all remaining args are for the script
    } else if (arg === '--exclude' && i + 1 < args.length) {
      const excludeServer = args[i + 1];
      if (excludeServer) {
        options.exclude.push(excludeServer);
      }
      i++; // Skip next argument as it's the server name
    }
  }

  // Check if file exists
  if (!ns.fileExists(filename)) {
    ns.tprint(`ERROR: File '${filename}' not found`);
    return;
  }

  // Get file size
  const fileSize = ns.getScriptRam(filename);
  if (fileSize === 0) {
    ns.tprint(`ERROR: File '${filename}' is not a valid script or has 0 RAM usage`);
    return;
  }

  ns.tprint(`Starting deployment of '${filename}' (${fileSize.toFixed(2)} GB RAM)`);
  ns.tprint(`Options: overwrite=${options.overwrite}, exclude=${options.exclude.join(', ') || 'none'}, run=${options.run}`);
  if (options.run && options.runArgs.length > 0) {
    ns.tprint(`Script arguments: ${options.runArgs.join(' ')}`);
  }

  // Get all servers
  const allServers = getAllServers(ns);
  const targetServers = allServers.filter(server => !options.exclude.includes(server));

  ns.tprint(`Found ${targetServers.length} target servers (${allServers.length} total, ${options.exclude.length} excluded)`);

  // Show available port openers if verbose mode
  if (options.verbose) {
    const availablePortOpeners = getAvailablePortOpeners(ns);
    ns.tprint(`Available port openers: ${availablePortOpeners.join(', ') || 'none'}`);
  }

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;
  const deployedServers: string[] = [];


  // Deploy to each server
  for (const server of targetServers) {
    try {
      let serverInfo = ns.getServer(server);

      // Check if server has admin rights, try to gain root access if not
      if (!serverInfo.hasAdminRights) {
        if (options.verbose) {
          ns.tprint(`ATTEMPTING: ${server} - No admin rights, attempting to gain root access...`);
        }

        // Check if we can potentially gain access
        const hackCheck = canHackServer(ns, server);
        if (!hackCheck.canHack) {
          if (options.verbose) {
            ns.tprint(`SKIP: ${server} - ${hackCheck.reason}`);
          }
          skipCount++;
          continue;
        }

        const rootGained = tryGainRoot(ns, server);
        if (rootGained) {
          if (options.verbose) {
            ns.tprint(`SUCCESS: ${server} - Root access gained`);
          }
          // Refresh server info after gaining root
          serverInfo = ns.getServer(server);
        } else {
          if (options.verbose) {
            const availablePortOpeners = getAvailablePortOpeners(ns);
            ns.tprint(`SKIP: ${server} - Could not gain root access. Available port openers: ${availablePortOpeners.join(', ') || 'none'}`);
          }
          skipCount++;
          continue;
        }
      }

      // Check if file already exists
      if (ns.fileExists(filename, server) && !options.overwrite) {
        if (options.verbose) {
          ns.tprint(`SKIP: ${server} - File already exists (use --overwrite to force)`);
        }
        skipCount++;
        continue;
      }

      // Check if server has enough RAM
      const availableRam = serverInfo.maxRam - serverInfo.ramUsed;
      if (availableRam < fileSize) {
        if (options.verbose) {
          ns.tprint(`SKIP: ${server} - Insufficient RAM (${availableRam.toFixed(2)} GB available, ${fileSize.toFixed(2)} GB needed)`);
        }
        skipCount++;
        continue;
      }

      // Deploy the file
      const success = ns.scp(filename, server);
      if (success) {
        if (options.verbose) {
          ns.tprint(`SUCCESS: ${server} - Deployed successfully`);
        }
        successCount++;
        deployedServers.push(server);
      } else {
        if (options.verbose) {
          ns.tprint(`FAIL: ${server} - Deployment failed`);
        }
        failCount++;
      }

    } catch (error) {
      if (options.verbose) {
        ns.tprint(`ERROR: ${server} - ${error}`);
      }
      failCount++;
    }
  }

  // Run the script on all deployed servers if --run option is specified
  let runSuccessCount = 0;
  let runFailCount = 0;

  if (options.run && deployedServers.length > 0) {
    ns.tprint('');
    ns.tprint('=== RUNNING SCRIPTS ===');
    const argsDisplay = options.runArgs.length > 0 ? ` with arguments: ${options.runArgs.join(' ')}` : '';
    ns.tprint(`Attempting to run '${filename}' on ${deployedServers.length} servers${argsDisplay}...`);

    for (const server of deployedServers) {
      try {
        // Execute the script with 1 thread and any provided arguments
        const pid = ns.exec(filename, server, 1, ...options.runArgs);
        if (pid > 0) {
          if (options.verbose) {
            ns.tprint(`RUN SUCCESS: ${server} - Script started with PID ${pid}`);
          }
          runSuccessCount++;
        } else {
          if (options.verbose) {
            ns.tprint(`RUN FAIL: ${server} - Failed to start script`);
          }
          runFailCount++;
        }
      } catch (error) {
        if (options.verbose) {
          ns.tprint(`RUN ERROR: ${server} - ${error}`);
        }
        runFailCount++;
      }
    }

    ns.tprint(`Script execution summary: ${runSuccessCount} successful, ${runFailCount} failed`);
  }

  // Print summary
  ns.tprint('');
  ns.tprint('=== DEPLOYMENT SUMMARY ===');
  ns.tprint(`File: ${filename}`);
  ns.tprint(`Total servers: ${allServers.length}`);
  ns.tprint(`Target servers: ${targetServers.length}`);
  ns.tprint(`Successful deployments: ${successCount}`);
  ns.tprint(`Skipped: ${skipCount}`);
  ns.tprint(`Failed: ${failCount}`);

  if (options.run) {
    ns.tprint(`Script execution: ${runSuccessCount} successful, ${runFailCount} failed`);
  }

  if (successCount > 0) {
    ns.tprint(`✅ Deployment completed successfully on ${successCount} servers`);
    if (options.run && runSuccessCount > 0) {
      ns.tprint(`✅ Script execution started on ${runSuccessCount} servers`);
    }
  } else {
    ns.tprint(`❌ No servers were deployed to successfully`);
  }
}
