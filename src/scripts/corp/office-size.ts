    export async function main(ns: NS): Promise<void> {
        // Get command line arguments
        const args = ns.args;
        if (args.length < 2) {
            ns.tprint("Usage: run corp-office-size.js <divisionName> <targetSize>");
            ns.tprint("Example: run corp-office-size.js Agro 8");
            return;
        }

        const divisionName = args[0] as string;
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

        ns.tprint(`Upgrading offices for division ${divisionName} to size ${targetSize}...`);

        let totalUpgraded = 0;
        let totalCost = 0;

        for (const city of cities) {
            try {
                // Check if office exists in this city
                const office = ns.corporation.getOffice(divisionName, city);
                
                if (office.size < targetSize) {
                    const sizeIncrease = targetSize - office.size;
                    const cost = ns.corporation.getOfficeSizeUpgradeCost(divisionName, city, sizeIncrease);
                    
                    ns.tprint(`${city}: Upgrading from size ${office.size} to ${targetSize} (cost: $${ns.formatNumber(cost)})`);
                    
                    ns.corporation.upgradeOfficeSize(divisionName, city, sizeIncrease);
                    totalUpgraded++;
                    totalCost += cost;
                } else {
                    ns.tprint(`${city}: Already at size ${office.size} (target: ${targetSize})`);
                }

                // Hire to fill all positions
                const updated = ns.corporation.getOffice(divisionName, city);
                const toHire = updated.size - updated.numEmployees;
                for (let i = 0; i < toHire; i++) {
                    ns.corporation.hireEmployee(divisionName, city);
                }

                // Refresh office and distribute employees by ratio
                const refreshed = ns.corporation.getOffice(divisionName, city);
                assignByRatio(ns, divisionName, city, refreshed.numEmployees);
            } catch (error) {
                // Office doesn't exist in this city, skip it
                ns.tprint(`${city}: No office found, skipping with error ${error as string}`);
            }
        }

        ns.tprint(`\nCompleted! Upgraded ${totalUpgraded} offices for a total cost of $${ns.formatNumber(totalCost)}`);
    }

    function assignByRatio(ns: NS, divisionName: string, city: CityName, totalEmployees: number): void {
        // Target ratios (sane defaults across industries)
        const ratios = {
            Operations: 0.25,
            Engineer: 0.25,
            Business: 0.15,
            Management: 0.25,
            "Research & Development": 0.1,
        } as const;

        // Reset all assignments first
        ns.corporation.setAutoJobAssignment(divisionName, city, "Operations", 0);
        ns.corporation.setAutoJobAssignment(divisionName, city, "Engineer", 0);
        ns.corporation.setAutoJobAssignment(divisionName, city, "Business", 0);
        ns.corporation.setAutoJobAssignment(divisionName, city, "Management", 0);
        ns.corporation.setAutoJobAssignment(divisionName, city, "Research & Development", 0);
        ns.corporation.setAutoJobAssignment(divisionName, city, "Intern", 0);

        // Compute counts
        const ops = Math.max(0, Math.floor(totalEmployees * ratios.Operations));
        const eng = Math.max(0, Math.floor(totalEmployees * ratios.Engineer));
        const bus = Math.max(0, Math.floor(totalEmployees * ratios.Business));
        const man = Math.max(0, Math.floor(totalEmployees * ratios.Management));
        const rnd = Math.max(0, totalEmployees - (ops + eng + bus + man));
        
        // Assign
        ns.corporation.setAutoJobAssignment(divisionName, city, "Operations", ops);
        ns.corporation.setAutoJobAssignment(divisionName, city, "Engineer", eng);
        ns.corporation.setAutoJobAssignment(divisionName, city, "Business", bus);
        ns.corporation.setAutoJobAssignment(divisionName, city, "Management", man);
        ns.corporation.setAutoJobAssignment(divisionName, city, "Research & Development", rnd);
        ns.corporation.setAutoJobAssignment(divisionName, city, "Intern", 0);
    }