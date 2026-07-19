import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { upgrades } from "./upgrades.js";

export const player = {
    energy: new Decimal(1e-35),
    energyPerSecond: new Decimal(1e-35),
    energySpeed: 1000,
    
    photons: new Decimal(1),
    photonsPerSecond: new Decimal(0),
    lightPerSecond: new Decimal(0),
    light: new Decimal(1),
    
    boughtUpgrades: new Decimal(0),
    lastSave: Date.now(),

    stats: {
        playtime: 0,
        totalEnergy: new Decimal(1e-35)
    },

    reality: {
        essence: new Decimal(0),
        level: 0
    }
};
