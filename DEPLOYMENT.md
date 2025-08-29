# Deployment Script

The `deploy.js` script allows you to deploy any file to all servers in your Bitburner network.

## Usage

```bash
run deploy.js <filename> [options]
```

## Examples

### Basic deployment
```bash
run deploy.js hacking-basic-hack.js
```

### Overwrite existing files
```bash
run deploy.js contract-solver.js --overwrite
```

### Exclude specific servers
```bash
run deploy.js growth-server-manager.js --exclude home
run deploy.js money-stock-trader.js --exclude home --exclude n00dles
```

### Verbose output
```bash
run deploy.js utility-monitor.js --verbose
```

### Combine options
```bash
run deploy.js contract-manager.js --overwrite --exclude home --verbose
```

## Options

- `--overwrite`: Overwrite existing files on target servers
- `--exclude <server>`: Exclude specific servers from deployment (can be used multiple times)
- `--verbose`: Show detailed deployment information for each server

## How it works

1. **File validation**: Checks if the specified file exists and is a valid script
2. **Server discovery**: Recursively scans the network to find all accessible servers
3. **Server filtering**: Excludes servers specified with `--exclude` option
4. **Requirements check**: For each server, verifies:
   - Admin rights (root access)
   - Available RAM (if not using `--overwrite`)
   - File doesn't already exist (unless `--overwrite` is used)
5. **Deployment**: Uses `ns.scp()` to copy files to target servers
6. **Summary**: Provides a detailed report of successful, skipped, and failed deployments

## Output

The script provides:
- Real-time status updates during deployment
- Detailed information about skipped servers (with `--verbose`)
- Final summary with counts of successful, skipped, and failed deployments
- Clear success/failure indicators

## Common use cases

- **Deploy hacking scripts**: `run deploy.js hacking-basic-hack.js`
- **Update utility scripts**: `run deploy.js utility-monitor.js --overwrite`
- **Exclude home server**: `run deploy.js contract-solver.js --exclude home`
- **Force update all servers**: `run deploy.js growth-server-manager.js --overwrite --verbose`

## Notes

- The script automatically skips servers where you don't have admin rights
- RAM requirements are checked to ensure the script can run on target servers
- Use `--overwrite` carefully as it will replace existing files
- The `--verbose` option is useful for debugging deployment issues
