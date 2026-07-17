import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { upgrades } from "./upgrades.js";

export const player = {
    energy: new Decimal(0),
    energyPerSecond: new Decimal(1e-35),
    energySpeed: 1000,
    boughtUpgrades: new Decimal(0),

    stats: {
        playtime: 3245234532412312,
        totalEnergy: new Decimal(1e-35)
    },

    reality: {
        essence: new Decimal(0),
        level: 0
    }
};
