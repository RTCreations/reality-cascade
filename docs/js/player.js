import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

export const player = {
    energy: new Decimal(0),
    energyPerSecond: new Decimal(1),
    energySpeed: 1000,
    boughtUpgrades: new Decimal(0),

    upgrades: {},

    reality: {
        essence: new Decimal(0),
        level: 0
    }
};