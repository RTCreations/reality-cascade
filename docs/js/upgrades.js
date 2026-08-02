import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";
import { getScale } from "./scale.js";
import { speedUp } from "./main.js";

export const upgrades = {
    primonBtn: {
        name: "Primon Enhancer",
        level: 0,
        cost: new Decimal("2")
    },

    energyAmplifier: {
        name: "Energy Amplifier",
        level: 0,
        cost: new Decimal("1e-34")
    },

    energyBoost: {
        name: "Energy Boost",
        level: 0,
        cost: new Decimal("5e-34")
    },

    energyAccelerate: {
        name: "Energy Accelerator",
        level: 0,
        cost: new Decimal("5e-34"),
    },

    buyPrimonBtn() {
        if (player.primon.gte(this.primonBtn.cost)) {
            player.primon = player.primon.minus(this.primonBtn.cost);
            this.primonBtn.level++;
            player.primonMultiplier = player.primonMultiplier.mul("2");
            player.primonsPerSecond = new Decimal("1")
                .mul(player.primonMultiplier)
                .mul(player.primonAchievementBonus);
            player.antiEnergyMultiplier = player.antiEnergyMultiplier.mul("1");
            const primonScale = getScale("primonBtn", this.primonBtn.level);
            this.primonBtn.cost = new Decimal(this.primonBtn.cost).mul(primonScale.Multi);
            return true;
        }
        return false;
    },

    buyPrimonBtnMax() {
        let purchases = 0;

        while (player.primon.gte(this.primonBtn.cost)) {
            player.primon = player.primon.minus(this.primonBtn.cost);
            this.primonBtn.level++;
            player.primonMultiplier = player.primonMultiplier.mul("2");
            player.primonsPerSecond = new Decimal("1")
                .mul(player.primonMultiplier)
                .mul(player.primonAchievementBonus);
            player.antiEnergyMultiplier = player.antiEnergyMultiplier.mul("1");
            player.energyMultiplier = player.energyMultiplier.mul("1");
            player.photonsMultiplier = player.photonsMultiplier.mul("1");
            player.lightMultiplier = player.lightMultiplier.mul("1");
            const primonScale = getScale("primonBtn", this.primonBtn.level);
            this.primonBtn.cost = new Decimal(this.primonBtn.cost).mul(primonScale.Multi);
            purchases++;

            if (purchases >= 200) {
                break;
            }
        }

        return purchases > 0;
    },

    getAntiEnergyGain() {
        let baseGain = player.primon.pow("0.5");
        let difficultyRate = new Decimal("1");

        difficultyRate = new Decimal(player.primon.log10().div(player.primon.log(5)));

        let antiEnergyGain = baseGain.pow(difficultyRate);

        return new Decimal(antiEnergyGain.mul(player.antiEnergyMultiplier).mul(this.getEnergyBoostMultiplier()));
    },

    getAntiEnergyMultiplier(afterReset = false) {
        if (player.antiEnergy.lt("0")) {
            return player.antiEnergyMultiplier.toString();
        }

        if (afterReset) {
            const baseline = new Decimal("1");
            const ratio = player.antiEnergy.plus(this.getAntiEnergyGain()).div(baseline);
            const boost = new Decimal(player.antiEnergyMultiplier).mul(new Decimal("1").plus(ratio.pow("0.54")));
            return new Decimal(boost).sub(this.getAntiEnergyMultiplier()).toString();
        }

        const baseline = new Decimal("1");
        const ratio = player.antiEnergy.div(baseline);
        const boost = new Decimal(player.antiEnergyMultiplier).mul(new Decimal("1").plus(ratio.pow("0.54")));

        return new Decimal(boost);
    },

    resetPrimonForAntiEnergy() {
        if (player.primon.lt("0")) {
            return false;
        }

        const gain = this.getAntiEnergyGain();
        player.antiEnergy = player.antiEnergy.plus(gain);
        player.primon = new Decimal("0");

        const multiplier = this.getAntiEnergyMultiplier();
        player.primonMultiplier = new Decimal("1").mul(multiplier);
        player.primonsPerSecond = new Decimal("1")
            .mul(player.primonMultiplier)
            .mul(player.primonAchievementBonus);
        this.primonBtn.level = 0;
        this.primonBtn.cost = new Decimal("2");
        player.stats.totalAntiEnergyEarned = player.stats.totalAntiEnergyEarned.plus(gain);
        player.stats.antiEnergyResetCount++;

        return true;
    },

    getEnergyBoostMultiplier(afterReset = false) {
        if (afterReset) {
            const baseline = new Decimal("1e-34");
            const ratio = player.energy.plus(this.getEnergyFromAntiEnergyGain()).div(baseline);
            return new Decimal("1").plus(new Decimal(ratio.pow("0.7"))).sub(this.getEnergyBoostMultiplier());
        }

        const baseline = new Decimal("1e-34");
        const ratio = player.energy.div(baseline);
        return new Decimal("1").plus(new Decimal(ratio.pow("0.7")));
    },

    getEnergyFromAntiEnergyGain() {
        if (!player.unlockedEnergy || player.antiEnergy.lt("1")) {
            return new Decimal("0");
        }

        let baseGain = new Decimal("1e-34").mul(new Decimal("1").plus(player.antiEnergy.log10().mul(1.2)));

        return baseGain.mul(player.energyMultiplier);
    },

    resetAntiEnergyForEnergy() {
        if (player.antiEnergy.lt("0")) {
            return false;
        }

        const gain = this.getEnergyFromAntiEnergyGain();
        player.energy = player.energy.plus(gain);
        player.antiEnergy = new Decimal("0");
        player.primon = new Decimal("1");
        player.primonsPerSecond = new Decimal("1");
        player.primonMultiplier = new Decimal("1").mul(player.primonAchievementBonus);
        this.primonBtn.cost = new Decimal("2");
        this.primonBtn.level = 0;
        player.stats.totalEnergy = player.stats.totalEnergy.plus(gain);
        player.stats.highestEnergy = player.stats.highestEnergy.max(player.energy);
        player.stats.energyResetCount++;

        return true;
    },

    buyEnergyAmplifier() {
        if (player.energy.gte(this.energyAmplifier.cost)) {
            player.energy = player.energy.minus(this.energyAmplifier.cost);
            this.energyAmplifier.level++;
            player.boughtUpgrades = player.boughtUpgrades.plus(1);
            player.energyMultiplier = player.energyMultiplier.mul(2);
            player.energyPerSecond = new Decimal(1e-35).mul(player.energyMultiplier);
            const amplifierScale = getScale("energyAmplifier", this.energyAmplifier.level);
            this.energyAmplifier.cost = new Decimal(this.energyAmplifier.cost).mul(amplifierScale.Multi);
            return true;
        }
        return false;
    },

    buyEnergyBoost() {
        if (player.energy.gte(this.energyBoost.cost)) {
            player.energy = player.energy.minus(this.energyBoost.cost);
            this.energyBoost.level++;
            player.boughtUpgrades = player.boughtUpgrades.plus(1);
            player.energyMultiplier = player.energyMultiplier.mul(1.5);
            player.energyPerSecond = new Decimal(1e-35).mul(player.energyMultiplier);
            const boostScale = getScale("energyBoost", this.energyBoost.level);
            this.energyBoost.cost = new Decimal(this.energyBoost.cost).mul(boostScale.Multi);
            return true;
        }
        return false;
    },

    buyEnergyAccelerate() {
        if (player.energy.gte(this.energyAccelerate.cost)) {
            player.energy = player.energy.minus(this.energyAccelerate.cost);
            this.energyAccelerate.level++;
            player.boughtUpgrades = player.boughtUpgrades.plus(1);
            speedUp();
            const accelerateScale = getScale("energyAccelerate", this.energyAccelerate.level);
            this.energyAccelerate.cost = new Decimal(this.energyAccelerate.cost).mul(accelerateScale.Multi);
            return true;
        }
        return false;
    }
};
