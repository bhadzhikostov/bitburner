/**
 * Server Manager Script
 *
 * This script automatically purchases and upgrades servers to maximize
 * your computing power for running scripts.
 *
 * Usage: run growth-server-manager.js
 */

export async function main(ns: NS): Promise<void> {
  // Configuration
  const maxServers = 25; // Maximum number of servers to own
  const minRam = 8; // Minimum RAM for new servers (GB)
  const targetRam = 64; // Target RAM to upgrade servers to (GB)
  const reserveMoney = 0.1; // Keep 10% of money in reserve

  ns.tprint('Starting server management...');
  ns.tprint(`Max servers: ${maxServers}, Min RAM: ${minRam}GB, Target RAM: ${targetRam}GB`);

  // Main management loop
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const player = ns.getPlayer();
    const availableMoney = player.money * (1 - reserveMoney);

    ns.print(`\n=== Server Management Update ===`);
    ns.print(`Available money: $${ns.formatNumber(availableMoney)}`);
    ns.print(`Current servers: ${ns.getPurchasedServers().length}/${maxServers}`);

    // Check if we can buy more servers
    if (ns.getPurchasedServers().length < maxServers) {
      const serverCost = ns.getPurchasedServerCost(minRam);

      if (availableMoney >= serverCost) {
        const serverName = `pserv-${ns.getPurchasedServers().length + 1}`;

        if (ns.purchaseServer(serverName, minRam)) {
          ns.tprint(`Purchased new server: ${serverName} with ${minRam}GB RAM`);
        }
      } else {
        ns.print(`Need $${ns.formatNumber(serverCost)} to buy new server with ${minRam}GB RAM`);
      }
    }

    // Upgrade existing servers
    const purchasedServers = ns.getPurchasedServers();
    for (const serverName of purchasedServers) {
      const server = ns.getServer(serverName);
      const currentRam = server.maxRam;

      if (currentRam < targetRam) {
        const upgradeCost = ns.getPurchasedServerUpgradeCost(serverName, targetRam);

        if (availableMoney >= upgradeCost) {
          if (ns.upgradePurchasedServer(serverName, targetRam)) {
            ns.tprint(`Upgraded ${serverName} to ${targetRam}GB RAM`);
          }
        } else {
          ns.print(
            `Need $${ns.formatNumber(upgradeCost)} to upgrade ${serverName} to ${targetRam}GB RAM`
          );
        }
      }
    }

    // Display server status
    ns.print('\n=== Server Status ===');
    let totalRam = 0;
    let totalCost = 0;

    for (const serverName of purchasedServers) {
      const server = ns.getServer(serverName);
      const serverCost = ns.getPurchasedServerCost(server.maxRam);
      totalRam += server.maxRam;
      totalCost += serverCost;

      ns.print(`${serverName}: ${server.maxRam}GB RAM | Cost: $${ns.formatNumber(serverCost)}`);
    }

    ns.print(`Total RAM: ${totalRam}GB | Total Value: $${ns.formatNumber(totalCost)}`);

    // Wait before next update
    await ns.sleep(10000); // 10 seconds (game time)
  }
}
