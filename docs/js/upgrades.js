import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";
import { speedUp } from "./main.js";

export const upgrades = {
    energyAmplifier: {
        name: "Energy Amplifier",
        level: 0,
        cost: new Decimal(10),

        buy() {
            if (player.energy.gte(this.cost)) {
                player.energy = player.energy.minus(this.cost);
                this.level++;
                player.boughtUpgrades = player.boughtUpgrades.plus(1);
                player.energyPerSecond = player.energyPerSecond
                .times(2);
                this.cost = this.cost.times(3);
            }
        }
    },

    energyBoost: {
        name: "Energy Boost",
        level: 0,
        cost: new Decimal(50),

        buy() {
            if (player.energy.gte(this.cost)) {
                player.energy = player.energy.minus(this.cost);
                this.level++;
                player.boughtUpgrades = player.boughtUpgrades.plus(1);
                player.energyPerSecond = player.energyPerSecond.times(3);
                this.cost = this.cost.times(5);
            }
        }
    },

    energySpeed: {
        name: "Energy Accelerator",
        level: 0,
        cost: new Decimal(50),

        buy() {
            if (player.energy.gte(this.cost)) {
                player.energy = player.energy.minus(this.cost);
                this.level++;
                player.boughtUpgrades = player.boughtUpgrades.plus(1);
                speedUp();
                this.cost = this.cost.times(10);
            }
        }
    }
};