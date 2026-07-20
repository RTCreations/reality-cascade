import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";
import { upgrades } from "./upgrades.js";
import { applyOfflineProgress } from "./time.js";

let countSaves = 0;

export function saveGame() {
    player.lastSave = Date.now();

    let saveData = {
        primon: player.primon.toString(),
        primonsPerSecond: player.primonsPerSecond.toString(),
        primonSpeed: String(player.primonSpeed),

        antiEnergy: player.antiEnergy.toString(),
        antiEnergyPerSecond: player.antiEnergyPerSecond.toString(),
        antiEnergySpeed: String(player.antiEnergySpeed),
        antiEnergyUnlocked: String(player.antiEnergyUnlocked),

        energy: player.energy.toString(),
        energyPerSecond: player.energyPerSecond.toString(),
        energySpeed: String(player.energySpeed),
        energyUnlocked: String(player.energyUnlocked),

        photons: player.photons.toString(),
        photonsPerSecond: player.photonsPerSecond.toString(),
        light: player.light.toString(),
        lightPerSecond: player.light.toString(),
        lightUnlocked: String(player.unlockedLight),

        lastSave: player.lastSave,

        upgrades: {
            primonBtn: {
                name: upgrades.primonBtn.name,
                level: upgrades.primonBtn.level,
                cost: upgrades.primonBtn.cost.toString()
            },

            energyAmplifier: {
                name: upgrades.energyAmplifier.name,
                level: upgrades.energyAmplifier.level,
                cost: upgrades.energyAmplifier.cost.toString()
            },
            energyBoost: {
                name: upgrades.energyBoost.name,
                level: upgrades.energyBoost.level,
                cost: upgrades.energyBoost.cost.toString()
            },
            energyAccelerate: {
                name: upgrades.energyAccelerate.name,
                level: upgrades.energyAccelerate.level,
                cost: upgrades.energyAccelerate.cost.toString()
            }
        },

        stats: {
            playtime: player.stats.playtime,
            totalEnergy: player.stats.totalEnergy.toString()
        },

        reality: {
            essence: player.reality.essence.toString(),
            level: player.reality.level
        }
    };

    localStorage.setItem(
        "RealityCascadeSave",
        JSON.stringify(saveData)
    );

    countSaves++;
    document.getElementById("saves").textContent = `Game saves every 10s • Saved ${countSaves} times`;
    console.log("Game saved!");
}


export function loadGame() {
    let save = JSON.parse(localStorage.getItem("RealityCascadeSave"));

    if (save) {
        player.primon = new Decimal(save.primon ?? 1e-100);
        player.primonsPerSecond = new Decimal(save.primonsPerSecond ?? 1e-100);
        player.primonSpeed = Number(save.primonSpeed ?? 1000);

        player.antiEnergy = new Decimal(save.antiEnergy ?? 0);
        player.antiEnergyPerSecond = new Decimal(save.antiEnergyPerSecond ?? 0);
        player.antiEnergySpeed = Number(save.antiEnergySpeed ?? 1000);
        player.unlockedAntiEnergy = Boolean(save.unlockedAntiEnergy ?? false);

        player.energy = new Decimal(save.energy ?? 0);
        player.energyPerSecond = new Decimal(save.energyPerSecond ?? 1e-35);
        player.energySpeed = Number(save.energySpeed ?? 1000);
        player.energyUnlocked = Boolean(save.unlockedEnergy ?? false);

        player.light = new Decimal(save.light ?? 1);
        player.lightPerSecond = new Decimal(save.lightPerSecond ?? 0);
        player.photons = new Decimal(save.photons ?? 1);
        player.photons = new Decimal(save.photonsPerSecond ?? 0);
        player.unlockedLight = Boolean(save.unlockedLight ?? false);

        upgrades.primonBtn = {
            name: save.upgrades?.primonBtn?.name ?? upgrades.primonBtn.name,
            level: Number(save.upgrades?.primonBtn?.level ?? 0),
            cost: new Decimal(save.upgrades?.primonBtn?.cost ?? 5e-100)
        },

        upgrades.energyAmplifier = {
            name: save.upgrades?.energyAmplifier?.name ?? upgrades.energyAmplifier.name,
            level: Number(save.upgrades?.energyAmplifier?.level ?? 0),
            cost: new Decimal(save.upgrades?.energyAmplifier?.cost ?? 1e-34)
        };

        upgrades.energyBoost = {
            name: save.upgrades?.energyBoost?.name ?? upgrades.energyBoost.name,
            level: Number(save.upgrades?.energyBoost?.level ?? 0),
            cost: new Decimal(save.upgrades?.energyBoost?.cost ?? 5e-34)
        };
        
        upgrades.energyAccelerate = {
            name: save.upgrades?.energyAccelerate?.name ?? upgrades.energyAccelerate.name,
            level: Number(save.upgrades?.energyAccelerate?.level ?? 0),
            cost: new Decimal(save.upgrades?.energyAccelerate?.cost ?? 5e-34)
        };

        player.stats.playtime = Number(save.stats?.playtime ?? 0);
        player.stats.totalEnergy = new Decimal(save.stats?.totalEnergy ?? 0);

        player.lastSave = save.lastSave ?? Date.now();

        player.reality.essence = new Decimal(save.reality?.essence ?? 0);
        player.reality.level = Number(save.reality?.level ?? 0);
    }

    const now = Date.now();
    const secondsAway = (now - player.lastSave) / 1000;

    applyOfflineProgress(secondsAway);

    console.log("Game loaded!");
}
