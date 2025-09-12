export async function main(ns: NS): Promise<void> {
    // Get command line arguments
    const args = ns.args;
    if (args.length < 2) {
        ns.tprint("Usage: run corp-office-size.js <corporationName> <targetSize>");
        ns.tprint("Example: run corp-office-size.js agro-CORP 8");
        return;
    }

    const corporationName = args[0] as string;
    const targetSize = args[1] as number;

    if (isNaN(targetSize) || targetSize < 1) {
        ns.tprint("Error: Target size must be a positive number");
        return;
    }

    // Check if corporation exists
    if (!ns.corporation.hasCorporation()) {
        ns.tprint("Error: You don't have a corporation");
        return;
    }

    // Get all cities
    const cities = [
        ns.enums.CityName.Sector12,
        ns.enums.CityName.Aevum,
        ns.enums.CityName.Volhaven,
        ns.enums.CityName.Chongqing,
        ns.enums.CityName.NewTokyo,
        ns.enums.CityName.Ishima
    ];

    ns.tprint(`Upgrading offices for ${corporationName} to size ${targetSize}...`);

    let totalUpgraded = 0;
    let totalCost = 0;

    for (const city of cities) {
        try {
            // Check if office exists in this city
            const office = ns.corporation.getOffice(corporationName, city);
            
            if (office.size < targetSize) {
                const sizeIncrease = targetSize - office.size;
                const cost = ns.corporation.getOfficeSizeUpgradeCost(corporationName, city, sizeIncrease);
                
                ns.tprint(`${city}: Upgrading from size ${office.size} to ${targetSize} (cost: $${ns.formatNumber(cost)})`);
                
                ns.corporation.upgradeOfficeSize(corporationName, city, sizeIncrease);
                totalUpgraded++;
                totalCost += cost;
            } else {
                ns.tprint(`${city}: Already at size ${office.size} (target: ${targetSize})`);
            }
        } catch (error) {
            // Office doesn't exist in this city, skip it
            ns.tprint(`${city}: No office found, skipping`);
        }
    }

    ns.tprint(`\nCompleted! Upgraded ${totalUpgraded} offices for a total cost of $${ns.formatNumber(totalCost)}`);
}