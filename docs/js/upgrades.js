import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";

export const upgrades = {
    energyBoost: {
        name: "Energy Amplifier",
        level: 0,
        cost: new Decimal(100),

        buy() {
            if (player.energy.gte(this.cost)) {
                player.energy = player.energy.minus(this.cost);
                this.level++;
                player.boughtUpgrades = player.boughtUpgrades.plus(1);
                player.energyPerSecond = player.energyPerSecond.times(2).times(Decimal.pow(1.67, this.level - 1));
                this.cost = this.cost.times(1.67);
            }
        }
    }
};