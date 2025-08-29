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
    crime_success_mult: number;
    crime_money_mult: number;
    isInvulnerable: boolean;
    bitNodeN: number;
    totalPlaytime: number;
    location: string;
    city: string;
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
    crime_success_mult: number;
    crime_money_mult: number;
    isInvulnerable: boolean;
    bitNodeN: number;
    totalPlaytime: number;
  }

  // Game API functions
  interface NS {
    // Command line arguments
    args: string[];

    // Logging and display
    clearLog(): void;
    // File operations
    read(filename: string): string;
    write(filename: string, data: string, mode?: 'w' | 'a'): void;
    rm(filename: string, host?: string): boolean;
    exists(filename: string, host?: string): boolean;
    fileExists(filename: string, host?: string): boolean;
    ls(host?: string, grep?: string): string[];
    mv(filename: string, destination: string, host?: string): boolean;
    cp(filename: string, destination: string, host?: string): boolean;

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
    getHackingChance(hostname: string): number;
    getHackingTime(hostname: string): number;
    getGrowTime(hostname: string): number;
    getWeakenTime(hostname: string): number;

    // Utility functions
    sleep(ms: number): Promise<void>;
    print(message: string): void;
    tprint(message: string): void;
    alert(message: string): void;
    prompt(message: string): string | null;
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

    // Coding contracts
    getCodingContract(hostname: string, filename: string): any;
    attemptCodingContract(filename: string, answer: any): boolean;

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

    // Formulas
    formulas: {
      hacking: {
        hackChance(server: Server, player: Player): number;
        hackTime(server: Server, player: Player): number;
        hackExp(server: Server, player: Player): number;
        hackPercent(server: Server, player: Player): number;
        hackTime(server: Server, player: Player): number;
        hackExp(server: Server, player: Player): number;
        hackPercent(server: Server, player: Player): number;
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
