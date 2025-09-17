/**
 * Corporation Manager
 *
 * Automates corporation creation and early-to-mid game management:
 * - Creates corporation (self-funded) if missing
 * - Ensures one division exists (default: Agriculture)
 * - Sets up offices in starter city (default: Sector-12), hires and assigns
 * - Buys sensible upgrades/research within a safe budget fraction
 * - For material divisions: enables Smart Supply and sets simple sell
 * - For product divisions: develops products up to capacity and sells with TA
 *
 * Usage examples:
 *  run corp-manager.js              // defaults
 *  run corp-manager.js MegaCorp Agri "Sector-12"
 *  run corp-manager.js MyCorp Tobacco Aevum
 */

const DEFAULT_CORP_NAME = 'Bitburner-Corpo';
const DEFAULT_INDUSTRY = 'Agriculture';
const DEFAULT_CITY = 'Sector-12';

// Safe spending fraction of available funds per tick
const SPEND_FRACTION = 0.15; // 15%
const LOOP_INTERVAL = 4000; // ms

type CorpNS = Corporation; // Use typed Corporation from bitburner.d.ts

export async function main(ns: NS): Promise<void> {
  ns.disableLog('sleep');
  ns.disableLog('getServerMoneyAvailable');

  const corp: CorpNS | undefined = (ns as unknown as { corporation?: CorpNS }).corporation;
  if (!corp) {
    ns.tprint('ERROR: Corporation API not available. BN3 or API access required.');
    return;
  }

  const corpName = String(ns.args[0] ?? DEFAULT_CORP_NAME);
  const industry = String(ns.args[1] ?? DEFAULT_INDUSTRY);
  const city = String(ns.args[2] ?? DEFAULT_CITY);

  // Create corporation if missing
  tryCreateCorporation(ns, corp, corpName);

  // Ensure division exists
  const divisionName = industry;
  ensureDivision(ns, corp, industry, divisionName);

  // Ensure office in chosen city
  ensureOffice(corp, divisionName, city, 9);

  // Enable Smart Supply if possible for material divisions
  enableSmartSupplyIfPossible(corp, divisionName);

  // Main management loop
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Spend within a safe fraction of funds each loop
    const funds = getSafeFunds(corp);

    // Core upgrades (cheap to mid):
    buyUpgrades(corp, funds);

    // Research priorities
    doResearch(corp, divisionName);

    // Expand and staff offices modestly
    growOffice(corp, divisionName, city, 30);
    assignEmployees(corp, divisionName, city);

    // Division-specific actions
    if (isProductIndustry(industry)) {
      manageProducts(corp, divisionName, city);
    } else {
      manageMaterials(corp, divisionName, city);
    }

    await ns.sleep(LOOP_INTERVAL);
  }
}

function tryCreateCorporation(ns: NS, corp: CorpNS, name: string): void {
  try {
    if (!corp.hasCorporation()) {
      // self-funded creation; ignore failures if not enough money
      corp.createCorporation(name, true);
      ns.tprint(`Created corporation: ${name}`);
    }
  } catch (e) {
    // Ignore if already exists or cannot create yet
  }
}

function ensureDivision(ns: NS, corp: CorpNS, industry: string, divisionName: string): void {
  const divisions = safeListDivisions(corp);
  if (!divisions.includes(divisionName)) {
    try {
      corp.expandIndustry(industry, divisionName);
      ns.tprint(`Expanded into ${industry} as division '${divisionName}'.`);
    } catch (e) {
      // Possibly cannot expand yet; ignore for now
    }
  }
}

function ensureOffice(corp: CorpNS, divisionName: string, city: string, targetEmployees: number): void {
  const cities = safeListCities(corp, divisionName);
  if (!cities.includes(city)) {
    try {
      corp.expandCity(divisionName, city);
    } catch (e) {
      // Might already exist or not enough funds
    }
  }
  try {
    const office = corp.getOffice(divisionName, city);
    const size = office.size ?? 3;
    if (size < targetEmployees) {
      const toBuy = targetEmployees - size;
      corp.upgradeOfficeSize(divisionName, city, toBuy);
    }
  } catch (e) {
    // ignore
  }
  try {
    const office = corp.getOffice(divisionName, city);
    let employed = office.employees?.length ?? 0;
    while (employed < targetEmployees) {
      corp.hireEmployee(divisionName, city);
      employed++;
    }
  } catch (e) {
    // ignore
  }
}

function growOffice(corp: CorpNS, divisionName: string, city: string, maxEmployees: number): void {
  try {
    const office = corp.getOffice(divisionName, city);
    const current = office.size ?? 3;
    if (current < maxEmployees) {
      const step = Math.min(5, maxEmployees - current);
      corp.upgradeOfficeSize(divisionName, city, step);
      for (let i = 0; i < step; i++) corp.hireEmployee(divisionName, city);
    }
  } catch (e) {
    // ignore
  }
}

function assignEmployees(corp: CorpNS, divisionName: string, city: string): void {
  try {
    const office = corp.getOffice(divisionName, city);
    const total = office.employees?.length ?? 0;
    if (total === 0) return;

    // Simple early-game split
    const ops = Math.max(1, Math.floor(total * 0.35));
    const eng = Math.max(1, Math.floor(total * 0.35));
    const bus = Math.max(1, Math.floor(total * 0.15));
    const man = Math.max(1, Math.floor(total * 0.1));
    const rnd = Math.max(0, total - (ops + eng + bus + man));

    // Reset and assign
    corp.setAutoJobAssignment(divisionName, city, 'Operations', 0);
    corp.setAutoJobAssignment(divisionName, city, 'Engineer', 0);
    corp.setAutoJobAssignment(divisionName, city, 'Business', 0);
    corp.setAutoJobAssignment(divisionName, city, 'Management', 0);
    corp.setAutoJobAssignment(divisionName, city, 'Research & Development', 0);

    corp.setAutoJobAssignment(divisionName, city, 'Operations', ops);
    corp.setAutoJobAssignment(divisionName, city, 'Engineer', eng);
    corp.setAutoJobAssignment(divisionName, city, 'Business', bus);
    corp.setAutoJobAssignment(divisionName, city, 'Management', man);
    corp.setAutoJobAssignment(divisionName, city, 'Research & Development', rnd);
  } catch (e) {
    // ignore
  }
}

function buyUpgrades(corp: CorpNS, funds: number): void {
  const desiredUpgrades = [
    'Smart Factories',
    'Smart Storage',
    'DreamSense',
    'Wilson Analytics',
    'Neural Accelerators',
    'FocusWires',
    'Speech Processor Implants',
    'Nuoptimal Nootropic Injector Implants'
  ];

  for (const name of desiredUpgrades) {
    try {
      const cost = corp.getUpgradeLevelCost(name);
      if (cost <= funds * SPEND_FRACTION) {
        corp.levelUpgrade(name);
      }
    } catch (e) {
      // ignore missing upgrade name or insufficient funds
    }
  }

  // AdVert if affordable
  try {
    const divs = safeListDivisions(corp);
    for (const d of divs) {
      const cost = corp.getHireAdVertCost(d);
      if (cost <= funds * SPEND_FRACTION) corp.hireAdVert(d);
    }
  } catch (e) {
    // ignore
  }
}

function doResearch(corp: CorpNS, divisionName: string): void {
  try {
    // Unlock Lab, Smart Supply, Market-TA I/II when possible
    if (!corp.hasUnlock('Hi-Tech R&D Laboratory')) {
      const cost = corp.getUnlockCost('Hi-Tech R&D Laboratory');
      if (cost <= getSafeFunds(corp) * SPEND_FRACTION) corp.unlockUpgrade('Hi-Tech R&D Laboratory');
    }
    if (!corp.hasUnlock('Smart Supply')) {
      const cost = corp.getUnlockCost('Smart Supply');
      if (cost <= getSafeFunds(corp) * SPEND_FRACTION) corp.unlockUpgrade('Smart Supply');
    }
  } catch (e) {
    // ignore older API differences
  }

  try {
    const research = corp.getDivision(divisionName)?.research ?? 0;
    const need = (name: string): boolean => !corp.hasResearched(divisionName, name);
    const researchIfPossible = (name: string) => {
      try {
        const cost = corp.getResearchCost(divisionName, name);
        if (research >= cost) corp.research(divisionName, name);
      } catch (e) {}
    };

    if (need('Hi-Tech R&D Laboratory')) researchIfPossible('Hi-Tech R&D Laboratory');
    if (need('Hi-Tech R&D Laboratory')) return; // wait until lab unlocked first

    if (need('Market-TA.I')) researchIfPossible('Market-TA.I');
    if (need('Market-TA.II')) researchIfPossible('Market-TA.II');
    if (need('Smart Supply')) researchIfPossible('Smart Supply');
    if (need('Overclock')) researchIfPossible('Overclock');
    if (need('uPgrade: Capacity.I')) researchIfPossible('uPgrade: Capacity.I');
    if (need('uPgrade: Capacity.II')) researchIfPossible('uPgrade: Capacity.II');
  } catch (e) {
    // ignore
  }
}

function enableSmartSupplyIfPossible(corp: CorpNS, divisionName: string): void {
  try {
    if (corp.hasUnlock?.('Smart Supply')) {
      const cities = safeListCities(corp, divisionName);
      for (const c of cities) {
        try { corp.setSmartSupply(divisionName, c, true); } catch (e) {}
      }
    }
  } catch (e) {
    // ignore
  }
}

function manageMaterials(corp: CorpNS, divisionName: string, city: string): void {
  // For simple material divisions, just sell all produced at market price; Smart Supply handles inputs
  try {
    const mats: string[] = corp.getDivision(divisionName)?.producedMaterials ?? [];
    for (const mat of mats) {
      try {
        // Use Market-TA when available; otherwise, sell all at MP
        if (corp.hasResearched(divisionName, 'Market-TA.II')) {
          corp.setMaterialMarketTA2(divisionName, city, mat, true);
        } else if (corp.hasResearched(divisionName, 'Market-TA.I')) {
          corp.setMaterialMarketTA1(divisionName, city, mat, true);
        } else {
          corp.sellMaterial(divisionName, city, mat, 'MAX', 'MP');
        }
      } catch (e) {}
    }
  } catch (e) {
    // ignore
  }
}

function manageProducts(corp: CorpNS, divisionName: string, city: string): void {
  try {
    // Keep up to 3 products; make new when fewer than 3 or an existing is outdated
    const div = corp.getDivision(divisionName);
    const products: string[] = div?.products ?? [];
    const maxProducts = 3;

    // Start new product if capacity available
    if (products.length < maxProducts) {
      const id = Date.now().toString().slice(-6);
      const name = `${divisionName}-${id}`;
      const budget = Math.max(1e6, Math.floor(getSafeFunds(corp) * 0.05));
      try {
        corp.makeProduct(divisionName, city, name, budget, budget);
      } catch (e) {}
    }

    // Set selling strategy
    for (const p of products) {
      try {
        if (corp.hasResearched(divisionName, 'Market-TA.II')) {
          corp.setProductMarketTA2(divisionName, p, true);
        } else if (corp.hasResearched(divisionName, 'Market-TA.I')) {
          corp.setProductMarketTA1(divisionName, p, true);
        } else {
          corp.sellProduct(divisionName, city, p, 'MAX', 'MP');
        }
      } catch (e) {}
    }
  } catch (e) {
    // ignore
  }
}

function isProductIndustry(industry: string): boolean {
  // Common product industries; treat others as material-based
  const productIndustries = new Set([
    'Tobacco',
    'Pharmaceutical',
    'Food',
    'Chemical',
    'Computer Hardware',
    'Robotics',
    'Software',
    'Healthcare',
    'RealEstate'
  ]);
  return productIndustries.has(industry);
}

function safeListDivisions(corp: CorpNS): string[] {
  try { return corp.getCorporation()?.divisions ?? []; } catch { return []; }
}

function safeListCities(corp: CorpNS, divisionName: string): string[] {
  try { return corp.getDivision(divisionName)?.cities ?? []; } catch { return []; }
}

function getSafeFunds(corp: CorpNS): number {
  try { return corp.getCorporation()?.funds ?? 0; } catch { return 0; }
}


