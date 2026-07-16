import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";
import { speedUp } from "./main.js";

export const upgrades = {
    energyAmplifier: {
        name: "Energy Amplifier",
        level: 0,
        cost: new Decimal(10)
    },

    energyBoost: {
        name: "Energy Boost",
        level: 0,
        cost: new Decimal(50)
    },

    energyAccelerate: {
        name: "Energy Accelerator",
        level: 0,
        cost: new Decimal(50),
    },

    buyEnergyAmplifier() {
        if (player.energy.gte(this.energyAmplifier.cost)) {
            player.energy = player.energy.minus(this.energyAmplifier.cost);
            this.energyAmplifier.level++;
            player.boughtUpgrades = player.boughtUpgrades.plus(1);
            player.energyPerSecond = player.energyPerSecond
            .times(2);
            this.energyAmplifier.cost = new Decimal(this.energyAmplifier.cost).times(4).pow(1.01);
        }
    },

    buyEnergyBoost() {
        if (player.energy.gte(this.energyBoost.cost)) {
            player.energy = player.energy.minus(this.energyBoost.cost);
            this.energyBoost.level++;
            player.boughtUpgrades = player.boughtUpgrades.plus(1);
            player.energyPerSecond = player.energyPerSecond.times(2);
            this.energyBoost.cost = new Decimal(this.energyBoost.cost).times(5);
        }
    },

    buyEnergyAccelerate() {
            if (player.energy.gte(this.energyAccelerate.cost)) {
                player.energy = player.energy.minus(this.energyAccelerate.cost);
                this.energyAccelerate.level++;
                player.boughtUpgrades = player.boughtUpgrades.plus(1);
                speedUp();
                this.energyAccelerate.cost = new Decimal(this.energyAccelerate.cost).times(15);
            }
        }
};