/**
 * Stock Trader Script
 *
 * This script automatically trades stocks to make money.
 * It uses a simple strategy: buy low, sell high.
 *
 * Usage: run money-stock-trader.js
 */

export async function main(ns: NS): Promise<void> {
  // Check if we have access to the stock market
  if (!ns.getStockSymbols || ns.getStockSymbols().length === 0) {
    ns.tprint('ERROR: Stock market not available yet');
    return;
  }

  const symbols = ns.getStockSymbols();
  ns.tprint(`Starting stock trading with ${symbols.length} symbols available`);

  // Trading parameters
  const buyThreshold = 0.6; // Buy when forecast is below 60%
  const sellThreshold = 0.7; // Sell when forecast is above 70%
  const maxInvestment = 0.1; // Use max 10% of money per stock

  // Main trading loop
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const player = ns.getPlayer();
    const availableMoney = player.money * 0.8; // Keep 20% in reserve

    ns.print(`\n=== Stock Market Update ===`);
    ns.print(`Available money: $${ns.formatNumber(availableMoney)}`);

    // Check each stock
    for (const symbol of symbols) {
      const price = ns.getStockPrice(symbol);
      const forecast = ns.getStockForecast(symbol);
      const volatility = ns.getStockVolatility(symbol);

      // Get current position
      const position = ns.getStockPosition(symbol);
      const shares = position[0];
      const avgPrice = position[1];
      // const totalCost = shares * avgPrice; // Unused variable

      ns.print(
        `${symbol}: $${ns.formatNumber(price)} | Forecast: ${(forecast * 100).toFixed(1)}% | Vol: ${(volatility * 100).toFixed(1)}%`
      );

      if (shares > 0) {
        const profit = (price - avgPrice) * shares;
        const profitPercent = ((price - avgPrice) / avgPrice) * 100;
        ns.print(
          `  Position: ${ns.formatNumber(shares)} shares | Profit: $${ns.formatNumber(profit)} (${profitPercent.toFixed(1)}%)`
        );

        // Sell if forecast is good or we have good profit
        if (forecast > sellThreshold || profitPercent > 20) {
          ns.print(`  Selling ${symbol} - Good forecast or profit target reached`);
          if (ns.sellStock(symbol, shares)) {
            ns.tprint(
              `Sold ${ns.formatNumber(shares)} shares of ${symbol} for $${ns.formatNumber(price * shares)}`
            );
          }
        }
      } else {
        // Buy if forecast is bad (contrarian strategy)
        if (forecast < buyThreshold && availableMoney > 100000) {
          const investment = Math.min(availableMoney * maxInvestment, 1000000);
          const sharesToBuy = Math.floor(investment / price);

          if (sharesToBuy > 0) {
            ns.print(
              `  Buying ${symbol} - Low forecast, investing $${ns.formatNumber(investment)}`
            );
            if (ns.buyStock(symbol, sharesToBuy)) {
              ns.tprint(
                `Bought ${ns.formatNumber(sharesToBuy)} shares of ${symbol} for $${ns.formatNumber(investment)}`
              );
            }
          }
        }
      }
    }

    // Wait before next update
    await ns.sleep(6000); // 6 seconds (game time)
  }
}
