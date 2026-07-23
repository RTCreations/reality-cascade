import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";
import { upgrades } from "./upgrades.js";
import { applyOfflineProgress } from "./time.js";

let countSaves = 0;

export async function exportSave() {
    const save = localStorage.getItem("RealityCascadeSave");

    if (!save) {
        alert("No save found!");
        return;
    }

    // Encode as Base64
    const exportString = btoa(unescape(encodeURIComponent(save)));

    try {
        await navigator.clipboard.writeText(exportString);
        alert("Save copied to clipboard!");
    } catch {
        prompt("Copy your save:", exportString);
    }
}

export function importSave() {
    const input = document.getElementById("saveInput").value.trim();

    if (!input) {
        alert("Paste a save first.");
        return;
    }

    try {
        const decoded = decodeURIComponent(escape(atob(input)));

        JSON.parse(decoded); // Validate

        localStorage.setItem("RealityCascadeSave", decoded);

        alert("Save imported!");
        location.reload();
    } catch (err) {
        console.error(err);
        alert("Invalid save.");
    }
}

export function saveGame() {
    player.lastSave = Date.now();

    let saveData = {
        primon: player.primon.toString(),
        primonsPerSecond: player.primonsPerSecond.toString(),
        primonSpeed: String(player.primonSpeed),
        primonMultiplier: player.primonMultiplier.toString(),
        primonAchievementBonus: player.primonAchievementBonus.toString(),
        autoBuyPrimon: player.autoBuyPrimon,

        antiEnergy: player.antiEnergy.toString(),
        antiEnergyPerSecond: player.antiEnergyPerSecond.toString(),
        antiEnergySpeed: String(player.antiEnergySpeed),
        antiEnergyMultiplier: player.antiEnergyMultiplier.toString(),
        antiEnergyUnlocked: String(player.antiEnergyUnlocked),

        energy: player.energy.toString(),
        energyPerSecond: player.energyPerSecond.toString(),
        energySpeed: String(player.energySpeed),
        energyMultiplier: player.energyMultiplier.toString(),
        energyUnlocked: String(player.energyUnlocked),

        photons: player.photons.toString(),
        photonsPerSecond: player.photonsPerSecond.toString(),
        photonsMultiplier: player.photonsMultiplier.toString(),
        light: player.light.toString(),
        lightPerSecond: player.lightPerSecond.toString(),
        lightMultiplier: player.lightMultiplier.toString(),
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

        achievements: player.achievements,

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
        player.primonMultiplier = new Decimal(save.primonMultiplier ?? 1);
        player.primonAchievementBonus = new Decimal(save.primonAchievementBonus ?? 1);
        player.autoBuyPrimon = Boolean(save.autoBuyPrimon ?? false);

        player.antiEnergy = new Decimal(save.antiEnergy ?? 0);
        player.antiEnergyPerSecond = new Decimal(save.antiEnergyPerSecond ?? 0);
        player.antiEnergySpeed = Number(save.antiEnergySpeed ?? 1000);
        player.antiEnergyMultiplier = new Decimal(save.antiEnergyMultiplier ?? 1);
        player.unlockedAntiEnergy = Boolean(save.unlockedAntiEnergy ?? false);

        player.energy = new Decimal(save.energy ?? 0);
        player.energyPerSecond = new Decimal(save.energyPerSecond ?? 1e-35);
        player.energySpeed = Number(save.energySpeed ?? 1000);
        player.energyMultiplier = new Decimal(save.energyMultiplier ?? 1);
        player.energyUnlocked = Boolean(save.unlockedEnergy ?? false);

        player.light = new Decimal(save.light ?? 1);
        player.lightPerSecond = new Decimal(save.lightPerSecond ?? 0);
        player.lightMultiplier = new Decimal(save.lightMultiplier ?? 1);
        player.photons = new Decimal(save.photons ?? 1);
        player.photonsPerSecond = new Decimal(save.photonsPerSecond ?? 0);
        player.photonsMultiplier = new Decimal(save.photonsMultiplier ?? 1);
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
        player.achievements = save.achievements ?? {};
        player.primonAchievementBonus = new Decimal(save.primonAchievementBonus ?? 1);

        if (player.achievements.primon1 && player.primonAchievementBonus.eq(1)) {
            player.primonAchievementBonus = new Decimal(2);
        }

        player.primonsPerSecond = new Decimal(1e-100)
            .times(player.primonMultiplier)
            .times(player.primonAchievementBonus);

        player.lastSave = save.lastSave ?? Date.now();

        player.reality.essence = new Decimal(save.reality?.essence ?? 0);
        player.reality.level = Number(save.reality?.level ?? 0);
    }

    const now = Date.now();
    const secondsAway = (now - player.lastSave) / 1000;

    applyOfflineProgress(secondsAway);

    console.log("Game loaded!");
}

export const loaded = true;
