/**
 * Deploy Script - Deploys a file to all servers in the network
 *
 * Usage: run deploy.js <filename> [options]
 *
 * Examples:
 *   run deploy.js hacking-basic-hack.js
 *   run deploy.js contract-solver.js --overwrite
 *   run deploy.js growth-server-manager.js --exclude home
 */

import { getAllServers } from '../utils/helpers';

interface DeployOptions {
  overwrite: boolean;
  exclude: string[];
  verbose: boolean;
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
    ns.tprint('');
    ns.tprint('Examples:');
    ns.tprint('  run deploy.js hacking-basic-hack.js');
    ns.tprint('  run deploy.js contract-solver.js --overwrite');
    ns.tprint('  run deploy.js growth-server-manager.js --exclude home --exclude n00dles');
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
    verbose: false
  };

  // Parse options
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--overwrite') {
      options.overwrite = true;
    } else if (arg === '--verbose') {
      options.verbose = true;
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
  ns.tprint(`Options: overwrite=${options.overwrite}, exclude=${options.exclude.join(', ') || 'none'}`);

  // Get all servers
  const allServers = getAllServers(ns);
  const targetServers = allServers.filter(server => !options.exclude.includes(server));

  ns.tprint(`Found ${targetServers.length} target servers (${allServers.length} total, ${options.exclude.length} excluded)`);

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  // Deploy to each server
  for (const server of targetServers) {
    try {
      const serverInfo = ns.getServer(server);

      // Check if server has admin rights
      if (!serverInfo.hasAdminRights) {
        if (options.verbose) {
          ns.tprint(`SKIP: ${server} - No admin rights`);
        }
        skipCount++;
        continue;
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

  // Print summary
  ns.tprint('');
  ns.tprint('=== DEPLOYMENT SUMMARY ===');
  ns.tprint(`File: ${filename}`);
  ns.tprint(`Total servers: ${allServers.length}`);
  ns.tprint(`Target servers: ${targetServers.length}`);
  ns.tprint(`Successful deployments: ${successCount}`);
  ns.tprint(`Skipped: ${skipCount}`);
  ns.tprint(`Failed: ${failCount}`);

  if (successCount > 0) {
    ns.tprint(`✅ Deployment completed successfully on ${successCount} servers`);
  } else {
    ns.tprint(`❌ No servers were deployed to successfully`);
  }
}

// Auto-start if run directly
main(ns);
