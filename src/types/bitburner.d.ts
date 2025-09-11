/**
 * Bitburner Game Type Definitions
 * These types represent the game's API and data structures
 */

declare global {
  // Basic game objects
  interface Server {
    hostname: string;
    ip: string;
    sshPortOpen: boolean;
    ftpPortOpen: boolean;
    smtpPortOpen: boolean;
    httpPortOpen: boolean;
    sqlPortOpen: boolean;
    hasAdminRights: boolean;
    cpuCores: number;
    isConnectedTo: boolean;
    ramUsed: number;
    maxRam: number;
    organizationName: string;
    purchasedByPlayer: boolean;
    backdoorInstalled: boolean;
    baseDifficulty: number;
    hackDifficulty: number;
    minDifficulty: number;
    moneyAvailable: number;
    moneyMax: number;
    numOpenPortsRequired: number;
    openPortCount: number;
    requiredHackingSkill: number;
    serverGrowth: number;
  }

  interface Player {
    hacking: number;
    strength: number;
    defense: number;
    dexterity: number;
    agility: number;
    charisma: number;
    intelligence: number;
    hacking_exp: number;
    strength_exp: number;
    defense_exp: number;
    dexterity_exp: number;
    agility_exp: number;
    charisma_exp: number;
    intelligence_exp: number;
    hacking_mult: number;
    strength_mult: number;
    defense_mult: number;
    dexterity_mult: number;
    agility_mult: number;
    charisma_mult: number;
    intelligence_mult: number;
    hacking_chance_mult: number;
    hacking_speed_mult: number;
    hacking_money_mult: number;
    hacking_grow_mult: number;
    hacking_exp_mult: number;
    strength_exp_mult: number;
    defense_exp_mult: number;
    dexterity_exp_mult: number;
    agility_exp_mult: number;
    charisma_exp_mult: number;
    intelligence_exp_mult: number;
    company_rep_mult: number;
    faction_rep_mult: number;
    crime_money_mult: number;
    crime_success_mult: number;
    hacknet_node_money_mult: number;
    hacknet_node_purchase_cost_mult: number;
    hacknet_node_ram_cost_mult: number;
    hacknet_node_core_cost_mult: number;
    hacknet_node_level_cost_mult: number;
    bladeburner_max_stamina_mult: number;
    bladeburner_stamina_gain_mult: number;
    bladeburner_field_analysis_mult: number;
    bladeburner_contract_success_mult: number;
    bladeburner_contract_rep_mult: number;
    bladeburner_action_rep_mult: number;
    bladeburner_rank_mult: number;
    bladeburner_skill_cost_mult: number;
    work_money_mult: number;
    work_rep_mult: number;
    work_exp_mult: number;
    crime_exp_mult: number;
    money: number;
    bank: number;
    totalMoney: number;
    numPeopleKilled: number;
    karma: number;
    city: string;
    location: string;
    companyName: string;
    jobTitle: string;
    jobDuties: string[];
    jobRequiredSkills: { [key: string]: number };
    jobRequiredExperience: number;
    jobPerformance: number;
    jobPerformanceType: number;
    maxHp: number;
    hp: number;
    workHackExpGain: number;
    workStrExpGain: number;
    workDefExpGain: number;
    workDexExpGain: number;
    workAgiExpGain: number;
    workChaExpGain: number;
    workRepGain: number;
    workMoneyGain: number;
    timeWorked: number;
    workType: number;
    currentWorkFactionDescription: string;
    crimeType: string;
    crimeKarma: number;
    crimeTypeDescription: string;
    isWorking: boolean;
    workTypeDescription: string;
    className: string;
    isInvulnerable: boolean;
    bitNodeN: number;
    totalPlaytime: number;
  }

  interface Warehouse {
    // Warehouse- and material-related helpers (per docs)
    setSmartSupply(divisionName: string, city: string, enabled: boolean): void;
    sellMaterial(
      divisionName: string,
      city: string,
      material: string,
      amt: string | number,
      price: string | number
    ): void;
    setMaterialMarketTA1(divisionName: string, city: string, material: string, on: boolean): void;
    setMaterialMarketTA2(divisionName: string, city: string, material: string, on: boolean): void;
  }

  interface Office {
    // Office/employee management (per docs)
    getOffice(divisionName: string, city: string): OfficeInfo;
    upgradeOfficeSize(divisionName: string, city: string, size: number): void;
    hireEmployee(divisionName: string, city: string): void;
    setAutoJobAssignment(
      divisionName: string,
      city: string,
      job: 'Operations' | 'Engineer' | 'Business' | 'Management' | 'Research & Development',
      amount: number
    ): void;
  }

  interface Corporation extends Warehouse, Office {
    // High-level corporation controls (per docs)
    hasCorporation(): boolean;
    createCorporation(name: string, selfFund: boolean): boolean;

    getCorporation(): CorporationInfo;

    // Divisions
    expandIndustry(industry: string, divisionName: string): void;
    getDivision(divisionName: string): DivisionInfo;
    expandCity(divisionName: string, city: string): void;

    // Upgrades and AdVert
    getUpgradeLevelCost(upgradeName: string): number;
    levelUpgrade(upgradeName: string): void;
    getHireAdVertCost(divisionName: string): number;
    hireAdVert(divisionName: string): void;

    // Unlocks (Smart Supply, R&D lab, etc.)
    hasUnlock(unlockName: string): boolean;
    getUnlockCost(unlockName: string): number;
    unlockUpgrade(unlockName: string): void;

    // Research
    getResearchCost(divisionName: string, researchName: string): number;
    hasResearched(divisionName: string, researchName: string): boolean;
    research(divisionName: string, researchName: string): void;

    // Products (for product industries)
    makeProduct(
      divisionName: string,
      city: string,
      productName: string,
      designInvestment: number,
      marketingInvestment: number
    ): void;
    sellProduct(
      divisionName: string,
      city: string,
      productName: string,
      amt: string | number,
      price: string | number
    ): void;
    setProductMarketTA1(divisionName: string, productName: string, on: boolean): void;
    setProductMarketTA2(divisionName: string, productName: string, on: boolean): void;
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
    // Command line arguments
    args: string[];

    // Logging and display
    clearLog(): void;
    disableLog(functionName: string): void;
    enableLog(functionName: string): void;
    isLogEnabled(functionName: string): boolean;
    print(message: string): void;
    tprint(message: string): void;
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
    hack(hostname: string, opts?: { threads?: number; stock?: boolean }): Promise<number>;
    grow(hostname: string, opts?: { threads?: number; stock?: boolean }): Promise<number>;
    weaken(hostname: string, opts?: { threads?: number; stock?: boolean }): Promise<number>;

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
    sleep(ms: number): Promise<void>;
    getTimeSinceLastAug(): number;
    getResetInfo(): any;
    formatNumber(num: number): string;

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
    corporation?: Corporation;

    // Bladeburner
    getBladeburner(): any;
    joinBladeburner(): boolean;

    // Gang
    getGang(): any;
    createGang(faction: string): boolean;

    // Singularity
    getSingularity(): any;


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

  // Global NS object
  const ns: NS;
}

export {};
