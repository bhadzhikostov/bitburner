# Loop Algorithms Bundle

This bundle implements the "Loop algorithms" pattern from the Bitburner documentation, providing a coordinated approach to hacking, weakening, and growing servers for maximum efficiency.

## Overview

The Loop Algorithms bundle consists of four main scripts that work together to create an efficient hacking operation:

1. **loop-hack.ts** - Continuously hacks a target server with optimal timing
2. **loop-weaken.ts** - Continuously weakens server security to maintain optimal levels
3. **loop-grow.ts** - Continuously grows server money to maintain optimal levels
4. **loop-deployer.ts** - Deploys and manages the entire bundle across multiple servers

## Scripts

### loop-hack.ts

Performs continuous hacking on a target server with intelligent timing based on server conditions.

**Usage:**
```bash
run loop-hack.js <target> [threads]
```

**Features:**
- Only hacks when server has sufficient money (≥75% of max)
- Only hacks when security is manageable (≤min + 5)
- Provides detailed statistics on hack success and money stolen
- Calculates optimal timing based on hack duration

**Example:**
```bash
run loop-hack.js n00dles 1
```

### loop-weaken.ts

Continuously weakens a target server to maintain optimal security levels.

**Usage:**
```bash
run loop-weaken.js <target> [threads]
```

**Features:**
- Only weakens when security is above minimum level
- Provides detailed statistics on security reduction
- Calculates optimal timing based on weaken duration
- Waits intelligently when security is already optimal

**Example:**
```bash
run loop-weaken.js n00dles 1
```

### loop-grow.ts

Continuously grows a target server to maintain optimal money levels.

**Usage:**
```bash
run loop-grow.js <target> [threads]
```

**Features:**
- Only grows when server money is below threshold (≤90% of max)
- Provides detailed statistics on money gained
- Calculates optimal timing based on grow duration
- Waits intelligently when money is already sufficient

**Example:**
```bash
run loop-grow.js n00dles 1
```

### loop-deployer.ts

Deploys and manages the entire loop algorithm bundle across multiple servers.

**Usage:**
```bash
run loop-deployer.js <target> [options]
```

**Options:**
- `--hack-ratio <number>` - Ratio of threads for hacking (default: 0.4)
- `--weaken-ratio <number>` - Ratio of threads for weakening (default: 0.3)
- `--grow-ratio <number>` - Ratio of threads for growing (default: 0.3)
- `--exclude <server>` - Exclude specific servers (can use multiple times)
- `--verbose` - Show detailed deployment information
- `--kill-existing` - Kill existing loop scripts before deploying

**Features:**
- Automatically gains root access on target servers
- Calculates optimal thread distribution based on available RAM
- Deploys all three scripts simultaneously
- Provides comprehensive deployment statistics
- Excludes home server by default to preserve resources

**Examples:**
```bash
# Basic deployment (uses optimized 1:2:10 ratios)
run loop-deployer.js n00dles

# Custom thread ratios
run loop-deployer.js n00dles --hack-ratio 0.1 --weaken-ratio 0.2 --grow-ratio 0.7

# Exclude specific servers
run loop-deployer.js n00dles --exclude home --exclude foodnstuff

# Verbose deployment with existing script cleanup
run loop-deployer.js n00dles --verbose --kill-existing
```

## How It Works

The Loop Algorithms pattern works by running three coordinated scripts simultaneously:

1. **Hack Script** - Steals money when conditions are optimal
2. **Weaken Script** - Reduces security to maintain hackable conditions
3. **Grow Script** - Restores money to maintain profitable conditions

This creates a self-sustaining cycle where:
- The weaken script keeps security low enough for effective hacking
- The grow script keeps money high enough for profitable hacking
- The hack script steals money when both conditions are met

## Thread Distribution

The deployer script automatically calculates optimal thread distribution based on:

- Available RAM on each server
- Configurable ratios for each script type
- Minimum thread requirements (at least 1 thread per script)

Default ratios (optimized for maximum efficiency):
- **Hack**: 1 part (≈7.7% of threads)
- **Weaken**: 2 parts (≈15.4% of threads)
- **Grow**: 10 parts (≈76.9% of threads)

These ratios can be customized based on your specific needs and server characteristics.

## Best Practices

1. **Start with a single server** to test the setup before deploying across your network
2. **Monitor server money and security** - money should hover around maximum, security around minimum
3. **Adjust thread ratios** if money/security levels aren't optimal (use analyze functions for precision)
4. **Use the deployer** to manage the entire operation rather than running scripts individually
5. **Exclude home server** to preserve resources for other operations
6. **Staggered startup** prevents overhacking issues (automatically handled by deployer)

## Integration with Existing Scripts

The Loop Algorithms bundle is designed to work alongside your existing Bitburner scripts:

- Use `deploy.ts` to deploy the loop scripts to your network
- Use `utility-monitor.ts` to monitor the performance of your loop operations
- Use `hacking-priority-targets.ts` to identify the best targets for loop algorithms

## Performance Considerations

- Each script runs independently, so they can be distributed across multiple servers
- Minimal overhead with basic continuous loops for maximum efficiency
- Thread distribution is optimized with 1:2:10 ratios (hack:weaken:grow)
- Staggered startup timing prevents overhacking issues
- Monitor target server money/security levels and adjust ratios as needed

## Troubleshooting

**Scripts not starting:**
- Check that you have root access to the target server
- Verify your hacking level meets the server requirements
- Ensure sufficient RAM is available on the deployment servers

**Poor performance:**
- Adjust thread ratios based on your target server's characteristics
- Monitor the scripts to identify bottlenecks
- Consider excluding servers with insufficient RAM

**Scripts conflicting:**
- Use `--kill-existing` flag when redeploying
- Check for other hacking scripts running on the same target
- Ensure only one set of loop algorithms is running per target
