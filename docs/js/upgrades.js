import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";
import { getScale } from "./scale.js";
import { speedUp } from "./main.js";

export const upgrades = {
    primonBtn: {
        name: "Primon Enhancer",
        level: 0,
        cost: new Decimal(5e-100)
    },

    energyAmplifier: {
        name: "Energy Amplifier",
        level: 0,
        cost: new Decimal(1e-34)
    },

    energyBoost: {
        name: "Energy Boost",
        level: 0,
        cost: new Decimal(5e-34)
    },

    energyAccelerate: {
        name: "Energy Accelerator",
        level: 0,
        cost: new Decimal(5e-34),
    },

    buyPrimonBtn() {
        if (player.primon.gte(this.primonBtn.cost)) {
            player.primon = player.primon.minus(this.primonBtn.cost);
            this.primonBtn.level++;
            player.primonsPerSecond = player.primonsPerSecond.times(2.2);
            const primonScale = getScale("primonBtn", this.primonBtn.level);
            this.primonBtn.cost = new Decimal(this.primonBtn.cost).times(primonScale.Multi);
        }
    },

    getAntiEnergyGain() {
        return new Decimal(player.primon).pow(1.5);
    },

    getAntiEnergyMultiplier() {
        if (player.antiEnergy.lte(0)) {
            return 1;
        }

        const baseline = new Decimal(1e-100);
        const ratio = player.antiEnergy.div(baseline);
        const boost = new Decimal(1).plus(ratio.pow(0.1));

        return boost.toNumber();
    },

    resetPrimonForAntiEnergy() {
        if (player.primon.lte(0)) {
            return false;
        }

        const gain = this.getAntiEnergyGain();
        player.antiEnergy = player.antiEnergy.plus(gain);
        player.primon = new Decimal(0);

        const multiplier = this.getAntiEnergyMultiplier();
        player.primonsPerSecond = player.primonsPerSecond.times(multiplier);

        return true;
    },

    buyEnergyAmplifier() {
        if (player.energy.gte(this.energyAmplifier.cost)) {
            player.energy = player.energy.minus(this.energyAmplifier.cost);
            this.energyAmplifier.level++;
            player.boughtUpgrades = player.boughtUpgrades.plus(1);
            player.energyPerSecond = player.energyPerSecond
            .times(2);
            const amplifierScale = getScale("energyAmplifier", this.energyAmplifier.level);
            this.energyAmplifier.cost = new Decimal(this.energyAmplifier.cost).times(amplifierScale.Multi);
        }
    },

    buyEnergyBoost() {
        if (player.energy.gte(this.energyBoost.cost)) {
            player.energy = player.energy.minus(this.energyBoost.cost);
            this.energyBoost.level++;
            player.boughtUpgrades = player.boughtUpgrades.plus(1);
            player.energyPerSecond = player.energyPerSecond.times(1.5);
            const boostScale = getScale("energyBoost", this.energyBoost.level);
            this.energyBoost.cost = new Decimal(this.energyBoost.cost).times(boostScale.Multi);
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
