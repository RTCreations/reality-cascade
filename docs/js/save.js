import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";
import { upgrades } from "./upgrades.js";

let countSaves = 0;

export function saveGame() {
    let saveData = {
        energy: player.energy.toString(),
        energyPerSecond: player.energyPerSecond.toString(),
        energySpeed: player.energySpeed.toString(),

        upgrades: { 
            energyAmplifier: upgrades.energyAmplifier,
            energyBoost: upgrades.energyBoost,
            energyAccelerate: upgrades.energyAccelerate
        },

        stats: {
            playtime: player.stats.playtime.toString(),
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
        player.energy = new Decimal(save.energy);
        player.energyPerSecond = new Decimal(save.energyPerSecond);
        player.energySpeed = new Decimal(save.energySpeed);
        upgrades.energyAmplifier = save.upgrades.energyAmplifier;
        upgrades.energyBoost = save.upgrades.energyBoost;
        upgrades.energyAccelerate = save.upgrades.energyAccelerate;
        player.stats.playtime = save.stats.playtime;
        player.stats.totalEnergy = save.stats.totalEnergy;
        player.reality.essence = new Decimal(save.reality.essence);
        player.reality.level = save.reality.level;
    }

    console.log("Game loaded!");
}
