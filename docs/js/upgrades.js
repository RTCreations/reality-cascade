import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";
import { getScale } from "./scale.js";
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
            const amplifierScale = getScale("energyAmplifier", this.energyAmplifier.level);
            this.energyAmplifier.cost = new Decimal(this.energyAmplifier.cost).times(amplifierScale.Multi).pow(amplifierScale.Pow);
        }
    },

    buyEnergyBoost() {
        if (player.energy.gte(this.energyBoost.cost)) {
            player.energy = player.energy.minus(this.energyBoost.cost);
            this.energyBoost.level++;
            player.boughtUpgrades = player.boughtUpgrades.plus(1);
            player.energyPerSecond = player.energyPerSecond.times(2);
            const boostScale = getScale("energyBoost", this.energyBoost.level);
            this.energyBoost.cost = new Decimal(this.energyBoost.cost).times(boostScale.Multi).pow(boostScale.Pow);
        }
    },

    buyEnergyAccelerate() {
            if (player.energy.gte(this.energyAccelerate.cost)) {
                player.energy = player.energy.minus(this.energyAccelerate.cost);
                this.energyAccelerate.level++;
                player.boughtUpgrades = player.boughtUpgrades.plus(1);
                speedUp();
                const accelerateScale = getScale("energyAccelerate", this.energyAccelerate.level);
                this.energyAccelerate.cost = new Decimal(this.energyAccelerate.cost).times(accelerateScale.Multi);
            }
        }
};
