import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";
import { upgrades } from "./upgrades.js";
import { applyOfflineProgress } from "./time.js";

let countSaves = 0;

function getSaveBoolean(save, keys, fallback = false) {
    if (!save || typeof save !== "object") {
        return fallback;
    }

    for (const key of keys) {
        if (save[key] !== undefined && save[key] !== null) {
            const value = save[key];

            if (typeof value === "boolean") {
                return value;
            }

            if (typeof value === "string") {
                return value === "true";
            }

            return Boolean(value);
        }
    }

    return fallback;
}

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
        antiEnergyAchievementBonus: player.antiEnergyAchievementBonus.toString(),
        antiEnergyUnlocked: String(player.unlockedAntiEnergy),

        energy: player.energy.toString(),
        energyPerSecond: player.energyPerSecond.toString(),
        energySpeed: String(player.energySpeed),
        energyMultiplier: player.energyMultiplier.toString(),
        energyAchievementBonus: player.energyAchievementBonus.toString(),
        energyUnlocked: String(player.unlockedEnergy),

        photons: player.photons.toString(),
        photonsPerSecond: player.photonsPerSecond.toString(),
        photonsMultiplier: player.photonsMultiplier.toString(),
        light: player.light.toString(),
        lightPerSecond: player.lightPerSecond.toString(),
        lightMultiplier: player.lightMultiplier.toString(),
        lightUnlocked: String(player.unlockedLight),

        unlockedAntiEnergy: String(player.unlockedAntiEnergy),
        unlockedEnergy: String(player.unlockedEnergy),
        unlockedLight: String(player.unlockedLight),

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
            lightAccelerate: {
                name: upgrades.lightAccelerate.name,
                level: upgrades.lightAccelerate.level,
                cost: upgrades.lightAccelerate.cost.toString()
            }
        },

        stats: {
            playtime: player.stats.playtime,
            totalEnergy: player.stats.totalEnergy.toString(),
            highestPrimon: player.stats.highestPrimon.toString(),
            totalAntiEnergyEarned: player.stats.totalAntiEnergyEarned.toString(),
            antiEnergyResetCount: player.stats.antiEnergyResetCount,
            energyResetCount: player.stats.energyResetCount
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
        player.primon = new Decimal(save.primon ?? "1");
        player.primonsPerSecond = new Decimal(save.primonsPerSecond ?? "1");
        player.primonSpeed = Number(save.primonSpeed ?? 500);
        player.primonMultiplier = new Decimal(save.primonMultiplier ?? "1");
        player.primonAchievementBonus = new Decimal(save.primonAchievementBonus ?? "1");
        player.autoBuyPrimon = Boolean(save.autoBuyPrimon ?? false);

        player.antiEnergy = new Decimal(save.antiEnergy ?? "0");
        player.antiEnergyPerSecond = new Decimal(save.antiEnergyPerSecond ?? "0");
        player.antiEnergySpeed = Number(save.antiEnergySpeed ?? 1000);
        player.antiEnergyMultiplier = new Decimal(save.antiEnergyMultiplier ?? "1");
        player.antiEnergyAchievementBonus = new Decimal(save.antiEnergyAchievementBonus ?? "1");
        player.unlockedAntiEnergy = getSaveBoolean(save, ["unlockedAntiEnergy", "antiEnergyUnlocked"], false);

        player.energy = new Decimal(save.energy ?? "0");
        player.energyPerSecond = new Decimal(save.energyPerSecond ?? "1e-34");
        player.energySpeed = Number(save.energySpeed ?? "1000");
        player.energyMultiplier = new Decimal(save.energyMultiplier ?? "1");
        player.energyAchievementBonus = new Decimal(save.energyAchievementBonus ?? "1");
        player.unlockedEnergy = getSaveBoolean(save, ["unlockedEnergy", "energyUnlocked"], false);

        player.light = new Decimal(save.light ?? "1");
        player.lightPerSecond = new Decimal(save.lightPerSecond ?? "0");
        player.lightMultiplier = new Decimal(save.lightMultiplier ?? "1");
        player.photons = new Decimal(save.photons ?? "1");
        player.photonsPerSecond = new Decimal(save.photonsPerSecond ?? "0");
        player.photonsMultiplier = new Decimal(save.photonsMultiplier ?? "1");
        player.unlockedLight = getSaveBoolean(save, ["unlockedLight", "lightUnlocked"], false);

        upgrades.primonBtn = {
            name: save.upgrades?.primonBtn?.name ?? upgrades.primonBtn.name,
            level: Number(save.upgrades?.primonBtn?.level ?? 0),
            cost: new Decimal(save.upgrades?.primonBtn?.cost ?? "2")
        },

        upgrades.energyAmplifier = {
            name: save.upgrades?.energyAmplifier?.name ?? upgrades.energyAmplifier.name,
            level: Number(save.upgrades?.energyAmplifier?.level ?? 0),
            cost: new Decimal(save.upgrades?.energyAmplifier?.cost ?? "1e-34")
        };

        upgrades.energyBoost = {
            name: save.upgrades?.energyBoost?.name ?? upgrades.energyBoost.name,
            level: Number(save.upgrades?.energyBoost?.level ?? 0),
            cost: new Decimal(save.upgrades?.energyBoost?.cost ?? "5e-34")
        };
        
        upgrades.lightAccelerate = {
            name: save.upgrades?.lightAccelerate?.name ?? upgrades.lightAccelerate.name,
            level: Number(save.upgrades?.lightAccelerate?.level ?? 0),
            cost: new Decimal(save.upgrades?.lightAccelerate?.cost ?? "200")
        };

        player.stats.playtime = Number(save.stats?.playtime ?? 0);
        player.stats.totalEnergy = new Decimal(save.stats?.totalEnergy ?? "0");
        player.stats.highestPrimon = new Decimal(save.stats?.highestPrimon ?? player.primon.toString());
        player.stats.totalAntiEnergyEarned = new Decimal(save.stats?.totalAntiEnergyEarned ?? "0");
        player.stats.antiEnergyResetCount = Number(save.stats?.antiEnergyResetCount ?? 0);
        player.stats.energyResetCount = Number(save.stats?.energyResetCount ?? 0);
        player.achievements = save.achievements ?? {};
        player.primonAchievementBonus = new Decimal(save.primonAchievementBonus ?? "1");

        if (player.achievements.primon1 && player.primonAchievementBonus.eq("1")) {
            player.primonAchievementBonus = new Decimal("2");
        }

        player.primonsPerSecond = new Decimal("1")
            .mul(player.primonMultiplier)
            .mul(player.primonAchievementBonus);

        player.lastSave = save.lastSave ?? Date.now();

        player.reality.essence = new Decimal(save.reality?.essence ?? "0");
        player.reality.level = Number(save.reality?.level ?? 0);
    }

    const now = Date.now();
    const secondsAway = (now - player.lastSave) / 1000;

    applyOfflineProgress(secondsAway);

    console.log("Game loaded!");
}

export const loaded = true;
