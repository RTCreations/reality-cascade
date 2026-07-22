import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { upgrades } from "./upgrades.js";

export const player = {
    primon: new Decimal(1e-100),
    primonsPerSecond: new Decimal(1e-100),
    primonSpeed: 1000,
    primonMultiplier: new Decimal(1),
    primonAchievementBonus: new Decimal(1),
    autoBuyPrimon: false,

    antiEnergy: new Decimal(0),
    antiEnergyPerSecond: new Decimal(0),
    antiEnergySpeed: 1000,
    antiEnergyMultiplier: new Decimal(1),
    unlockedAntiEnergy: false,

    energy: new Decimal(0),
    energyPerSecond: new Decimal(0),
    energySpeed: 1000,
    energyMultiplier: new Decimal(1),
    unlockedEnergy: false,
    
    photons: new Decimal(1),
    photonsPerSecond: new Decimal(0),
    photonsMultiplier: new Decimal(1),
    lightPerSecond: new Decimal(0),
    lightMultiplier: new Decimal(1),
    light: new Decimal(1),
    unlockedLight: false,
    
    boughtUpgrades: new Decimal(0),
    lastSave: Date.now(),

    stats: {
        playtime: 0,
        totalEnergy: new Decimal(1e-35)
    },

    achievements: {},

    reality: {
        essence: new Decimal(0),
        level: 0
    }
};
