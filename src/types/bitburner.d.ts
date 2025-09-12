/**
 * Bitburner Game Type Definitions
 * These types represent the game's API and data structures
 */

declare global {
  // Basic types
  type ScriptArg = string | number | boolean;
  type FilenameOrPID = number | string;
  type _ValueOf<T> = T[keyof T];

  // Basic game objects
  interface Server {
    /** Hostname. Must be unique */
    hostname: string;
    /** IP Address. Must be unique */
    ip: string;
    /** Whether or not the SSH Port is open */
    sshPortOpen: boolean;
    /** Whether or not the FTP port is open */
    ftpPortOpen: boolean;
    /** Whether or not the SMTP Port is open */
    smtpPortOpen: boolean;
    /** Whether or not the HTTP Port is open */
    httpPortOpen: boolean;
    /** Whether or not the SQL Port is open */
    sqlPortOpen: boolean;
    /** Flag indicating whether player has admin/root access to this server */
    hasAdminRights: boolean;
    /** How many CPU cores this server has. Affects magnitude of grow and weaken ran from this server. */
    cpuCores: number;
    /** Flag indicating whether player is currently connected to this server */
    isConnectedTo: boolean;
    /** RAM (GB) used. i.e. unavailable RAM */
    ramUsed: number;
    /** RAM (GB) available on this server */
    maxRam: number;
    /** Name of company/faction/etc. that this server belongs to, not applicable to all Servers */
    organizationName: string;
    /** Flag indicating whether this is a purchased server */
    purchasedByPlayer: boolean;
    /** Flag indicating whether this server has a backdoor installed by a player */
    backdoorInstalled?: boolean;
    /** Server's initial server security level at creation. */
    baseDifficulty?: number;
    /** Server Security Level */
    hackDifficulty?: number;
    /** Minimum server security level that this server can be weakened to */
    minDifficulty?: number;
    /** How much money currently resides on the server and can be hacked */
    moneyAvailable?: number;
    /** Maximum amount of money that this server can hold */
    moneyMax?: number;
    /** Number of open ports required in order to gain admin/root access */
    numOpenPortsRequired?: number;
    /** How many ports are currently opened on the server */
    openPortCount?: number;
    /** Hacking level required to hack this server */
    requiredHackingSkill?: number;
    /** Growth effectiveness statistic. Higher values produce more growth with ns.grow() */
    serverGrowth?: number;
  }

  interface HP {
    current: number;
    max: number;
  }

  interface Skills {
    hacking: number;
    strength: number;
    defense: number;
    dexterity: number;
    agility: number;
    charisma: number;
    intelligence: number;
  }

  interface Multipliers {
    /** Multiplier to hacking skill */
    hacking: number;
    /** Multiplier to strength skill */
    strength: number;
    /** Multiplier to defense skill */
    defense: number;
    /** Multiplier to dexterity skill */
    dexterity: number;
    /** Multiplier to agility skill */
    agility: number;
    /** Multiplier to charisma skill */
    charisma: number;
    /** Multiplier to hacking experience gain rate */
    hacking_exp: number;
    /** Multiplier to strength experience gain rate */
    strength_exp: number;
    /** Multiplier to defense experience gain rate */
    defense_exp: number;
    /** Multiplier to dexterity experience gain rate */
    dexterity_exp: number;
    /** Multiplier to agility experience gain rate */
    agility_exp: number;
    /** Multiplier to charisma experience gain rate */
    charisma_exp: number;
    /** Multiplier to chance of successfully performing a hack */
    hacking_chance: number;
    /** Multiplier to hacking speed */
    hacking_speed: number;
    /** Multiplier to amount of money the player gains from hacking */
    hacking_money: number;
    /** Multiplier to amount of money injected into servers using grow */
    hacking_grow: number;
    /** Multiplier to amount of reputation gained when working */
    company_rep: number;
    /** Multiplier to amount of reputation gained when working */
    faction_rep: number;
    /** Multiplier to amount of money gained from crimes */
    crime_money: number;
    /** Multiplier to crime success rate */
    crime_success: number;
    /** Multiplier to amount of money gained from working */
    work_money: number;
    /** Multiplier to amount of money produced by Hacknet Nodes */
    hacknet_node_money: number;
    /** Multiplier to cost of purchasing a Hacknet Node */
    hacknet_node_purchase_cost: number;
    /** Multiplier to cost of ram for a Hacknet Node */
    hacknet_node_ram_cost: number;
    /** Multiplier to cost of core for a Hacknet Node */
    hacknet_node_core_cost: number;
    /** Multiplier to cost of leveling up a Hacknet Node */
    hacknet_node_level_cost: number;
    /** Multiplier to Bladeburner max stamina */
    bladeburner_max_stamina: number;
    /** Multiplier to Bladeburner stamina gain rate */
    bladeburner_stamina_gain: number;
    /** Multiplier to effectiveness in Bladeburner Field Analysis */
    bladeburner_analysis: number;
    /** Multiplier to success chance in Bladeburner contracts/operations */
    bladeburner_success_chance: number;
  }

  interface Person {
    hp: HP;
    skills: Skills;
    exp: Skills;
    mults: Multipliers;
    city: CityName;
  }

  interface Player extends Person {
    money: number;
    numPeopleKilled: number;
    entropy: number;
    jobs: Partial<Record<CompanyName, JobName>>;
    factions: string[];
    totalPlaytime: number;
    location: LocationName;
    karma: number;
  }

  interface SleevePerson extends Person {
    /** Number 0-100 Experience earned and shared is multiplied with shock% before sync% */
    shock: number;
    /** Number 1-100 Experience earned by this sleeve and shared with the player is multiplied with sync% after shock% */
    sync: number;
    /** Number 1-100 initial Value of sync on BN start */
    memory: number;
    /** Number of 200ms cycles which are stored as bonus time */
    storedCycles: number;
  }

  // Type definitions for enums
  type CityNameEnumType = {
    Aevum: "Aevum";
    Chongqing: "Chongqing";
    Sector12: "Sector-12";
    NewTokyo: "New Tokyo";
    Ishima: "Ishima";
    Volhaven: "Volhaven";
  };

  type CityName = _ValueOf<CityNameEnumType>;

  type LocationNameEnumType = {
    AevumAeroCorp: "AeroCorp";
    AevumBachmanAndAssociates: "Bachman & Associates";
    AevumClarkeIncorporated: "Clarke Incorporated";
    AevumCrushFitnessGym: "Crush Fitness Gym";
    AevumECorp: "ECorp";
    AevumFulcrumTechnologies: "Fulcrum Technologies";
    AevumGalacticCybersystems: "Galactic Cybersystems";
    AevumNetLinkTechnologies: "NetLink Technologies";
    AevumPolice: "Aevum Police Headquarters";
    AevumRhoConstruction: "Rho Construction";
    AevumSnapFitnessGym: "Snap Fitness Gym";
    AevumSummitUniversity: "Summit University";
    AevumWatchdogSecurity: "Watchdog Security";
    AevumCasino: "Iker Molina Casino";
    ChongqingKuaiGongInternational: "KuaiGong International";
    ChongqingSolarisSpaceSystems: "Solaris Space Systems";
    ChongqingChurchOfTheMachineGod: "Church of the Machine God";
    Sector12AlphaEnterprises: "Alpha Enterprises";
    Sector12BladeIndustries: "Blade Industries";
    Sector12CIA: "Central Intelligence Agency";
    Sector12CarmichaelSecurity: "Carmichael Security";
    Sector12CityHall: "Sector-12 City Hall";
    Sector12DeltaOne: "DeltaOne";
    Sector12FoodNStuff: "FoodNStuff";
    Sector12FourSigma: "Four Sigma";
    Sector12IcarusMicrosystems: "Icarus Microsystems";
    Sector12IronGym: "Iron Gym";
    Sector12JoesGuns: "Joe's Guns";
    Sector12MegaCorp: "MegaCorp";
    Sector12NSA: "National Security Agency";
    Sector12PowerhouseGym: "Powerhouse Gym";
    Sector12RothmanUniversity: "Rothman University";
    Sector12UniversalEnergy: "Universal Energy";
    NewTokyoDefComm: "DefComm";
    NewTokyoGlobalPharmaceuticals: "Global Pharmaceuticals";
    NewTokyoNoodleBar: "Noodle Bar";
    NewTokyoVitaLife: "VitaLife";
    NewTokyoArcade: "Arcade";
    IshimaNovaMedical: "Nova Medical";
    IshimaOmegaSoftware: "Omega Software";
    IshimaStormTechnologies: "Storm Technologies";
    IshimaGlitch: "0x6C1";
    VolhavenCompuTek: "CompuTek";
    VolhavenHeliosLabs: "Helios Labs";
    VolhavenLexoCorp: "LexoCorp";
    VolhavenMilleniumFitnessGym: "Millenium Fitness Gym";
    VolhavenNWO: "NWO";
    VolhavenOmniTekIncorporated: "OmniTek Incorporated";
    VolhavenOmniaCybersystems: "Omnia Cybersystems";
    VolhavenSysCoreSecurities: "SysCore Securities";
    VolhavenZBInstituteOfTechnology: "ZB Institute of Technology";
    Hospital: "Hospital";
    Slums: "The Slums";
    TravelAgency: "Travel Agency";
    WorldStockExchange: "World Stock Exchange";
    Void: "The Void";
  };

  type LocationName = _ValueOf<LocationNameEnumType>;

  type CompanyNameEnumType = {
    ECorp: "ECorp";
    MegaCorp: "MegaCorp";
    BachmanAndAssociates: "Bachman & Associates";
    BladeIndustries: "Blade Industries";
    NWO: "NWO";
    ClarkeIncorporated: "Clarke Incorporated";
    OmniTekIncorporated: "OmniTek Incorporated";
    FourSigma: "Four Sigma";
    KuaiGongInternational: "KuaiGong International";
    FulcrumTechnologies: "Fulcrum Technologies";
    StormTechnologies: "Storm Technologies";
    DefComm: "DefComm";
    HeliosLabs: "Helios Labs";
    VitaLife: "VitaLife";
    IcarusMicrosystems: "Icarus Microsystems";
    UniversalEnergy: "Universal Energy";
    GalacticCybersystems: "Galactic Cybersystems";
    AeroCorp: "AeroCorp";
    OmniaCybersystems: "Omnia Cybersystems";
    SolarisSpaceSystems: "Solaris Space Systems";
    DeltaOne: "DeltaOne";
    GlobalPharmaceuticals: "Global Pharmaceuticals";
    NovaMedical: "Nova Medical";
    CIA: "Central Intelligence Agency";
    NSA: "National Security Agency";
    WatchdogSecurity: "Watchdog Security";
    LexoCorp: "LexoCorp";
    RhoConstruction: "Rho Construction";
    AlphaEnterprises: "Alpha Enterprises";
    Police: "Aevum Police Headquarters";
    SysCoreSecurities: "SysCore Securities";
    CompuTek: "CompuTek";
    NetLinkTechnologies: "NetLink Technologies";
    CarmichaelSecurity: "Carmichael Security";
    FoodNStuff: "FoodNStuff";
    JoesGuns: "Joe's Guns";
    OmegaSoftware: "Omega Software";
    NoodleBar: "Noodle Bar";
  };

  type CompanyName = _ValueOf<CompanyNameEnumType>;

  type JobNameEnumType = {
    software0: "Software Engineering Intern";
    software1: "Junior Software Engineer";
    software2: "Senior Software Engineer";
    software3: "Lead Software Developer";
    software4: "Head of Software";
    software5: "Head of Engineering";
    software6: "Vice President of Technology";
    software7: "Chief Technology Officer";
    it0: "IT Intern";
    it1: "IT Analyst";
    it2: "IT Manager";
    it3: "Systems Administrator";
    securityEngineer: "Security Engineer";
    networkEngineer: "Network Engineer";
    business0: "Business Intern";
    business1: "Business Analyst";
    business2: "Business Manager";
    business3: "Operations Manager";
    business4: "Chief Financial Officer";
    business5: "Chief Executive Officer";
    security0: "Police Officer";
    security1: "Police Chief";
    security2: "Security Guard";
    security3: "Security Officer";
    security4: "Security Supervisor";
    security5: "Head of Security";
    agent0: "Field Agent";
    agent1: "Secret Agent";
    agent2: "Special Operative";
    employee: "Employee";
    partTimeEmployee: "Part-time Employee";
    waiter: "Waiter";
    employeePT: "Part-time Employee";
    waiterPT: "Part-time Waiter";
    intern: "Intern";
    temp: "Temp";
    // Add more job types as needed
  };

  type JobName = _ValueOf<JobNameEnumType>;

  type JobFieldEnumType = {
    software: "Software";
    it: "IT";
    security: "Security";
    business: "Business";
    agent: "Agent";
    employee: "Employee";
    partTimeEmployee: "Part-time Employee";
    waiter: "Waiter";
    employeePT: "Part-time Employee";
    waiterPT: "Part-time Waiter";
    intern: "Intern";
    temp: "Temp";
  };

  type JobField = _ValueOf<JobFieldEnumType>;

  // Corporation types
  type CorpEmployeePosition =
    | "Operations"
    | "Engineer"
    | "Business"
    | "Management"
    | "Research & Development"
    | "Intern"
    | "Unassigned";

  type CorpIndustryName =
    | "Water Utilities"
    | "Agriculture"
    | "Fishing"
    | "Mining"
    | "Refinery"
    | "Restaurant"
    | "Tobacco"
    | "Chemical"
    | "Pharmaceutical"
    | "Computer Hardware"
    | "Robotics"
    | "Software"
    | "Healthcare"
    | "Real Estate";

  type CorpSmartSupplyOption = "leftovers" | "imports" | "none";

  type CorpMaterialName =
    | "Minerals"
    | "Ore"
    | "Water"
    | "Food"
    | "Plants"
    | "Metal"
    | "Hardware"
    | "Chemicals"
    | "Drugs"
    | "Robots"
    | "AI Cores"
    | "Real Estate";

  type CorpUnlockName =
    | "Export"
    | "Smart Supply"
    | "Market Research - Demand"
    | "Market Data - Competition"
    | "Shady Accounting"
    | "Government Partnership"
    | "Warehouse API"
    | "Office API";

  type CorpUpgradeName =
    | "Smart Factories"
    | "Smart Storage"
    | "Wilson Analytics"
    | "Nuoptimal Nootropic Injector Implants"
    | "Speech Processor Implants"
    | "Neural Accelerators"
    | "FocusWires"
    | "ABC SalesBots"
    | "Project Insight";

  type CorpResearchName =
    | "Hi-Tech R&D Laboratory"
    | "AutoBrew"
    | "AutoPartyManager"
    | "Automatic Drug Administration"
    | "CPH4 Injections"
    | "Drones"
    | "Drones - Assembly"
    | "Drones - Transport"
    | "Go-Juice"
    | "HRBuddy-Recruitment"
    | "HRBuddy-Training"
    | "Market-TA.I"
    | "Market-TA.II"
    | "Overclock"
    | "Self-Correcting Assemblers"
    | "Sti.mu"
    | "uPgrade: Capacity.I"
    | "uPgrade: Capacity.II"
    | "uPgrade: Dashboard"
    | "uPgrade: Fulcrum";

  type CorpStateName = "START" | "PURCHASE" | "PRODUCTION" | "EXPORT" | "SALE";

  interface Office {
    /** City of the office */
    city: CityName;
    /** Maximum number of employee */
    size: number;
    /** Maximum amount of energy of the employees */
    maxEnergy: number;
    /** Maximum morale of the employees */
    maxMorale: number;
    /** Amount of employees */
    numEmployees: number;
    /** Average energy of the employees */
    avgEnergy: number;
    /** Average morale of the employees */
    avgMorale: number;
    /** Total experience of all employees */
    totalExperience: number;
    /** Production of the employees */
    employeeProductionByJob: Record<CorpEmployeePosition, number>;
    /** Positions of the employees */
    employeeJobs: Record<CorpEmployeePosition, number>;
    /** List of employee names */
    employees: string[];
  }

  interface Division {
    /** Name of the division */
    name: string;
    /** Industry of division, like Agriculture */
    industry: CorpIndustryName;
    /** Awareness of the division */
    awareness: number;
    /** Popularity of the division */
    popularity: number;
    /** Production multiplier */
    productionMult: number;
    /** Amount of research in that division */
    researchPoints: number;
    /** Revenue last cycle */
    lastCycleRevenue: number;
    /** Expenses last cycle */
    lastCycleExpenses: number;
    /** Revenue this cycle */
    thisCycleRevenue: number;
    /** Expenses this cycle */
    thisCycleExpenses: number;
    /** Number of times AdVert has been bought */
    numAdVerts: number;
    /** Cities in which this division has expanded */
    cities: CityName[];
    /** Names of Products developed by this division */
    products: string[];
    /** Whether the industry of this division is capable of developing and producing products */
    makesProducts: boolean;
    /** How many products this division can support */
    maxProducts: number;
    /** Materials produced by this division */
    producedMaterials?: string[];
    /** Research data */
    research?: any;
  }

  interface InvestmentOffer {
    /** Amount of funds you will get from this investment */
    funds: number;
    /** Amount of share you will give in exchange for this investment */
    shares: number;
    /** Current round of funding (max 4) */
    round: number;
  }

  interface WarehouseAPI {
    setSmartSupply(divisionName: string, city: string, enabled: boolean): void;
    sellMaterial(divisionName: string, city: string, materialName: string, amt: string, price: string): void;
    sellProduct(divisionName: string, city: string, productName: string, amt: string, price: string, all: boolean): void;
    discontinueProduct(divisionName: string, productName: string): void;
    setSmartSupplyOption(divisionName: string, city: string, materialName: string, option: string): void;
    buyMaterial(divisionName: string, city: string, materialName: string, amt: number): void;
    // Add more warehouse methods as needed
  }

  interface OfficeAPI {
    hireEmployee(divisionName: string, city: string, employeePosition?: string): boolean;
    upgradeOfficeSize(divisionName: string, city: string, size: number): void;
    throwParty(divisionName: string, city: string, costPerEmployee: number): number;
    buyTea(divisionName: string, city: string): boolean;
    hireAdVert(divisionName: string): void;
    research(divisionName: string, researchName: string): void;
    getOffice(divisionName: string, city: string): Office;
    getHireAdVertCost(divisionName: string): number;
    getOfficeSizeUpgradeCost(divisionName: string, city: string, size: number): number;
    // Add more office methods as needed
  }

  interface Corporation extends WarehouseAPI, OfficeAPI {
    hasCorporation(): boolean;
    canCreateCorporation(selfFund: boolean): any; // CreatingCorporationCheckResult
    createCorporation(corporationName: string, selfFund?: boolean): boolean;
    hasUnlock(upgradeName: string): boolean;
    getUnlockCost(upgradeName: string): number;
    getUpgradeLevel(upgradeName: string): number;
    getUpgradeLevelCost(upgradeName: string): number;
    getInvestmentOffer(): InvestmentOffer;
    
    // Additional corporation methods
    expandIndustry(industry: string, divisionName: string): void;
    getDivision(divisionName: string): Division;
    expandCity(divisionName: string, city: string): void;
    levelUpgrade(upgradeName: string): void;
    unlockUpgrade(unlockName: string): void;
    hasResearched(divisionName: string, researchName: string): boolean;
    getResearchCost(divisionName: string, researchName: string): number;
    research(divisionName: string, researchName: string): void;
    makeProduct(divisionName: string, city: string, productName: string, designInvestment: number, marketingInvestment: number): void;
    sellProduct(divisionName: string, city: string, productName: string, amt: string, price: string, all?: boolean): void;
    setMaterialMarketTA1(divisionName: string, city: string, material: string, on: boolean): void;
    setMaterialMarketTA2(divisionName: string, city: string, material: string, on: boolean): void;
    setProductMarketTA1(divisionName: string, productName: string, on: boolean): void;
    setProductMarketTA2(divisionName: string, productName: string, on: boolean): void;
    setAutoJobAssignment(divisionName: string, city: string, job: string, amount: number): void;
    getCorporation(): any; // CorporationInfo
  }

  interface OfficeInfo {
    size: number;
    employees: string[];
    employeeJobs?: { [job: string]: number };
  }

  interface DivisionInfo {
    name: string;
    type: string;
    cities: string[];
    products?: string[];
    research?: number;
    producedMaterials?: string[];
  }

  interface CorporationInfo {
    name: string;
    funds: number;
    revenue: number;
    expenses: number;
    profit: number;
    public: boolean;
    totalShares: number;
    numShares: number; // player-owned
    shareSaleCooldown?: number;
    issuedShares?: number;
    sharePrice?: number;
    valuation?: number;
    divisions: string[]; // division names
    state?: string; // corporation state string
    nextStateTime?: number; // ms until next state
    cycle?: number;
    researchPoints?: number; // legacy/global
    // Extra fields maintained by game may exist; keep interface open-ended
  }

  // Game API functions
  interface NS {
    // Namespace properties
    readonly hacknet: any; // Hacknet interface
    readonly bladeburner: any; // Bladeburner interface
    readonly codingcontract: any; // CodingContract interface
    readonly format: any; // Format interface
    readonly gang: any; // Gang interface
    readonly go: any; // Go interface
    readonly sleeve: any; // Sleeve interface
    readonly stock: any; // TIX interface
    readonly formulas: any; // Formulas interface
    readonly stanek: any; // Stanek interface
    readonly infiltration: any; // Infiltration interface
    readonly corporation: Corporation;
    readonly ui: any; // UserInterface interface
    readonly singularity: any; // Singularity interface
    readonly grafting: any; // Grafting interface

    // Command line arguments
    readonly args: ScriptArg[];
    readonly pid: number;

    // Logging and display
    clearLog(): void;
    disableLog(functionName: string): void;
    enableLog(functionName: string): void;
    isLogEnabled(functionName: string): boolean;
    print(...args: any[]): void;
    printRaw(node: any): void; // ReactNode
    printf(format: string, ...args: any[]): void;
    tprint(...args: any[]): void;
    alert(message: string): void;
    prompt(message: string): string | null;

    // File operations
    read(filename: string): string;
    write(filename: string, data: string, mode?: 'w' | 'a'): void;
    rm(filename: string, host?: string): boolean;
    exists(filename: string, host?: string): boolean;
    fileExists(filename: string, host?: string): boolean;
    ls(host?: string, grep?: string): string[];
    mv(host: string, source: string, destination: string): boolean;
    cp(host: string, source: string, destination: string): boolean;
    scp(files: string | string[], destination: string, source?: string): boolean;
    copy(filename: string, destination: string, source?: string): boolean;
    mkdir(dirname: string): boolean;

    // Server operations
    scan(host?: string): string[];
    getServer(hostname: string): Server;
    getServerMoneyAvailable(hostname: string): number;
    getServerMaxMoney(hostname: string): number;
    getServerGrowth(hostname: string): number;
    getServerSecurityLevel(hostname: string): number;
    getServerMinSecurityLevel(hostname: string): number;
    getServerRequiredHackingLevel(hostname: string): number;
    getServerNumPortsRequired(hostname: string): number;
    getServerOpenPortCount(hostname: string): number;
    getServerMaxRam(hostname: string): number;
    getServerUsedRam(hostname: string): number;
    getServerRam(hostname: string): number;
    hasRootAccess(hostname: string): boolean;

    // Hacking operations
    hack(host: string, opts?: any): Promise<number>; // BasicHGWOptions
    grow(host: string, opts?: any): Promise<number>; // BasicHGWOptions
    weaken(host: string, opts?: any): Promise<number>; // BasicHGWOptions
    weakenAnalyze(threads: number, cores?: number): number;
    hackAnalyzeThreads(host: string, hackAmount: number): number;
    hackAnalyze(host: string): number;
    hackAnalyzeSecurity(threads: number, host?: string): number;
    hackAnalyzeChance(host: string): number;
    growthAnalyze(host: string, multiplier: number, cores?: number): number;
    growthAnalyzeSecurity(threads: number, host?: string, cores?: number): number;

    // Port opening operations
    brutessh(hostname: string): void;
    ftpcrack(hostname: string): void;
    relaysmtp(hostname: string): void;
    httpworm(hostname: string): void;
    sqlinject(hostname: string): void;
    nuke(hostname: string): void;

    // Script operations
    exec(script: string, host: string, threads?: number, ...args: any[]): number;
    run(script: string, threads?: number, ...args: any[]): number;
    kill(script: string, host?: string, ...args: any[]): boolean;
    killall(host?: string, script?: string): boolean;
    isRunning(script: string, host?: string, ...args: any[]): boolean;
    getScriptName(): string;
    getHostname(): string;
    getScriptRam(script: string, host?: string): number;
    getScriptIncome(script: string, host?: string, ...args: any[]): number;
    getScriptExpGain(script: string, host?: string, ...args: any[]): number;

    // Player operations
    getPlayer(): Player;
    getHackingLevel(): number;
    getHackingMultipliers(): any;
    hackAnalyzeChance(hostname: string): number;
    getHackingTime(hostname: string): number;
    getGrowTime(hostname: string): number;
    getWeakenTime(hostname: string): number;

    // Utility functions
    sleep(millis?: number): Promise<true>;
    asleep(millis?: number): Promise<true>;
    getTimeSinceLastAug(): number;
    getResetInfo(): any;
    formatNumber(num: number): string;
    formatPercent(value: number, decimalPlaces?: number): string;
    formatRam(ram: number): string;
    formatTime(timeInMilliseconds: number): string;
    formatNumberShort(value: number, decimalPlaces?: number): string;
    formatHashes(hashes: number): string;
    formatMoney(amount: number, decimalPlaces?: number): string;
    formatBigNumber(num: number): string;
    formatRespect(amount: number): string;
    formatWanted(amount: number): string;
    formatReputation(amount: number): string;
    formatSkill(exp: number): string;
    formatExp(exp: number): string;
    formatSleeveMemory(sleeveNum: number): string;
    formatSleeveShock(sleeveNum: number): string;
    formatSleeveSync(sleeveNum: number): string;
    formatStaneksGiftPower(power: number, decimals?: number): string;
    formatStaneksGiftCharge(charge: number, decimals?: number): string;
    formatStaneksGiftTime(seconds: number): string;

    // Stock market
    getStockSymbols(): string[];
    getStockPrice(symbol: string): number;
    getStockForecast(symbol: string): number;
    getStockVolatility(symbol: string): number;
    getStockPosition(symbol: string): [number, number];
    buyStock(symbol: string, shares: number): boolean;
    sellStock(symbol: string, shares: number): boolean;
    shortStock(symbol: string, shares: number): boolean;
    sellShort(symbol: string, shares: number): boolean;

    // Newer TIX API namespace style
    stock?: {
      getSymbols(): string[];
      getPrice(symbol: string): number;
      getForecast(symbol: string): number;
      getVolatility(symbol: string): number;
      // In the game this typically returns 4 entries: [longShares, longAvg, shortShares, shortAvg]
      getPosition(symbol: string): [number, number, number?, number?];
      buy(symbol: string, shares: number): number; // returns cost or 0 on failure
      sell(symbol: string, shares: number): number; // returns revenue or 0 on failure
    };

    // Corporation
    getCorporation(): any;
    createCorporation(corpName: string, selfFund: boolean): boolean;

    // Bladeburner
    getBladeburner(): any;
    joinBladeburner(): boolean;

    // Gang
    getGang(): any;
    createGang(faction: string): boolean;

    // Singularity
    getSingularity(): any;

    // Heart
    readonly heart: {
      break(): number;
    };

    // Enums
    readonly enums: {
      CrimeType: any;
      FactionWorkType: any;
      UniversityClassType: any;
      GymType: any;
      JobName: any;
      JobField: any;
      CorpEmployeePosition: any;
      CorpIndustryName: any;
      CorpMaterialName: any;
      CorpUnlockName: any;
      CorpUpgradeName: any;
      CorpResearchName: any;
      CityName: any;
      LocationName: any;
      CompanyName: any;
      FactionName: any;
    };


    // Ports
    getPortHandle(portNumber: number): any;
    writePort(portNumber: number, data: any): boolean;
    readPort(portNumber: number): any;
    tryWritePort(portNumber: number, data: any): boolean;
    tryReadPort(portNumber: number): any;

    // Server management
    getPurchasedServers(): string[];
    purchaseServer(name: string, ram: number): boolean;
    upgradePurchasedServer(name: string, ram: number): boolean;
    getPurchasedServerCost(ram: number): number;
    getPurchasedServerUpgradeCost(name: string, ram: number): number;

    // Process management
    ps(hostname?: string): Array<{
      filename: string;
      threads: number;
      args: string[];
      pid: number;
    }>;

    codingcontract: {
      attempt(answer: any, filename: string, hostname?: string): boolean;
      createDummyContract(type: string): string;
      getContractType(filename: string, hostname?: string): string;
      getData(filename: string, hostname?: string): any;
      getDescription(filename: string, hostname?: string): string;
      getNumTriesRemaining(filename: string, hostname?: string): number;
    }

    // Formulas
    formulas: {
      hacking: {
        hackChance(server: Server, player: Player): number;
        hackExp(server: Server, player: Player): number;
        hackPercent(server: Server, player: Player): number;
        hackTime(server: Server, player: Player): number;
        growPercent(server: Server, player: Player, threads: number, cores?: number): number;
        growThreads(server: Server, player: Player, targetMoney: number, cores?: number): number;
        growTime(server: Server, player: Player): number;
        weakenTime(server: Server, player: Player): number;
      };
      growth: {
        growTime(server: Server, player: Player, threads: number): number;
        growPercent(server: Server, player: Player, threads: number, cores: number): number;
        growExp(server: Server, player: Player, threads: number): number;
      };
      weaken: {
        weakenTime(server: Server, player: Player): number;
        weakenEffect(threads: number): number;
        weakenExp(server: Server, player: Player, threads: number): number;
      };
    };
  }

  // Additional essential types
  type CrimeType = "Shoplift" | "Rob Store" | "Mug" | "Larceny" | "Deal Drugs" | "Bond Forgery" | "Traffick Arms" | "Homicide" | "Grand Theft Auto" | "Kidnap" | "Assassination" | "Heist";
  
  type FactionWorkType = "hacking" | "field" | "security";
  
  type UniversityClassType = "Computer Science" | "Data Structures" | "Networks" | "Algorithms" | "Management" | "Leadership";
  
  type GymType = "str" | "def" | "dex" | "agi";
  
  type FactionName = "Illuminati" | "Daedalus" | "The Covenant" | "ECorp" | "MegaCorp" | "Bachman & Associates" | "Blade Industries" | "NWO" | "Clarke Incorporated" | "OmniTek Incorporated" | "Four Sigma" | "KuaiGong International" | "Fulcrum Secret Technologies" | "BitRunners" | "The Black Hand" | "NiteSec" | "Aevum" | "Chongqing" | "Ishima" | "New Tokyo" | "Sector-12" | "Volhaven" | "Speakers for the Dead" | "The Dark Army" | "The Syndicate" | "Silhouette" | "Tetrads" | "Slum Snakes" | "Netburners" | "Tian Di Hui" | "CyberSec" | "Bladeburners" | "Church of the Machine God" | "Shadows of Anarchy";

  // React types
  type ReactNode = any;
  interface ReactElement {
    type: string | ((props: any) => ReactElement | null) | (new (props: any) => object);
    props: any;
    key: string | number | null;
  }

  // Global NS object
  const ns: NS;
}

export {};
