#!/usr/bin/env node

/**
 * Bitburner Script Deployment Tool
 *
 * This tool helps deploy your compiled scripts to the Bitburner game.
 * It copies scripts from the dist/ folder to your game's scripts directory.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  SOURCE_DIR: './dist',
  GAME_SCRIPTS_DIR: process.env.BITBURNER_SCRIPTS_DIR || './game-scripts',
  BACKUP_DIR: './backups',
  CREATE_BACKUP: true,
  VERBOSE: true
};

/**
 * Main deployment function
 */
async function main() {
  console.log('🚀 Starting Bitburner script deployment...\n');

  try {
    // Check if source directory exists
    if (!fs.existsSync(CONFIG.SOURCE_DIR)) {
      console.error(`❌ Source directory '${CONFIG.SOURCE_DIR}' not found!`);
      console.error('   Run "npm run build" first to compile your scripts.');
      process.exit(1);
    }

    // Create backup if enabled
    if (CONFIG.CREATE_BACKUP) {
      await createBackup();
    }

    // Deploy scripts
    await deployScripts();

    console.log('\n✅ Deployment completed successfully!');
    console.log(`📁 Scripts deployed to: ${CONFIG.GAME_SCRIPTS_DIR}`);

  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

/**
 * Create backup of existing scripts
 */
async function createBackup() {
  if (!fs.existsSync(CONFIG.GAME_SCRIPTS_DIR)) {
    return; // No existing scripts to backup
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(CONFIG.BACKUP_DIR, `backup-${timestamp}`);

  console.log(`📦 Creating backup at: ${backupPath}`);

  // Create backup directory
  if (!fs.existsSync(CONFIG.BACKUP_DIR)) {
    fs.mkdirSync(CONFIG.BACKUP_DIR, { recursive: true });
  }

  // Copy existing scripts to backup
  await copyDirectory(CONFIG.GAME_SCRIPTS_DIR, backupPath);
}

/**
 * Deploy compiled scripts
 */
async function deployScripts() {
  console.log(`📤 Deploying scripts from ${CONFIG.SOURCE_DIR}...`);

  // Create game scripts directory if it doesn't exist
  if (!fs.existsSync(CONFIG.GAME_SCRIPTS_DIR)) {
    fs.mkdirSync(CONFIG.GAME_SCRIPTS_DIR, { recursive: true });
    console.log(`📁 Created directory: ${CONFIG.GAME_SCRIPTS_DIR}`);
  }

  // Copy all files from source to destination
  await copyDirectory(CONFIG.SOURCE_DIR, CONFIG.GAME_SCRIPTS_DIR);

  // Count deployed files
  const deployedFiles = countFiles(CONFIG.GAME_SCRIPTS_DIR);
  console.log(`📊 Deployed ${deployedFiles} files`);
}

/**
 * Copy directory recursively
 */
async function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      if (CONFIG.VERBOSE) {
        console.log(`  📄 ${entry.name}`);
      }
    }
  }
}

/**
 * Count files in directory recursively
 */
function countFiles(dir) {
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      count += countFiles(fullPath);
    } else {
      count++;
    }
  }

  return count;
}

/**
 * Display help information
 */
function showHelp() {
  console.log(`
Bitburner Script Deployment Tool

Usage: node tools/deploy.js [options]

Options:
  --help              Show this help message
  --no-backup         Skip backup creation
  --quiet             Reduce output verbosity
  --game-dir <path>   Specify game scripts directory

Environment Variables:
  BITBURNER_SCRIPTS_DIR  Path to your game's scripts directory

Examples:
  node tools/deploy.js
  node tools/deploy.js --game-dir ~/Documents/Bitburner/scripts
  BITBURNER_SCRIPTS_DIR=./scripts node tools/deploy.js
`);
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.includes('--help')) {
  showHelp();
  process.exit(0);
}

if (args.includes('--no-backup')) {
  CONFIG.CREATE_BACKUP = false;
}

if (args.includes('--quiet')) {
  CONFIG.VERBOSE = false;
}

const gameDirIndex = args.indexOf('--game-dir');
if (gameDirIndex !== -1 && args[gameDirIndex + 1]) {
  CONFIG.GAME_SCRIPTS_DIR = args[gameDirIndex + 1];
}

// Run deployment
main().catch(console.error);
