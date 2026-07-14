import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

export const player = {
    energy: new Decimal(10),
    energyPerSecond: new Decimal(1),
    boughtUpgrades: new Decimal(0),

    upgrades: {},

    reality: {
        essence: new Decimal(0),
        level: 0
    }
};