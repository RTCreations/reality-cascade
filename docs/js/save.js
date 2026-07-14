import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js"

export function saveGame() {
    let saveData = {
        energy: player.energy.toString(),
        energyPerSecond: player.energyPerSecond.toString(),
        upgrades: player.upgrades,

        reality: {
            essence: player.reality.essence.toString(),
            level: player.reality.level
        }
    };

    localStorage.setItem(
        "RealityCascadeSave",
        JSON.stringify(saveData)
    );
}


export function loadGame() {
    let save = JSON.parse(localStorage.getItem("RealityCascadeSave"));

    if (save) {
        player.energy = new Decimal(save.energy);
        player.energyPerSecond = new Decimal(save.energyPerSecond);
        player.upgrades = save.upgrades;
        player.reality.essence = new Decimal(save.reality.essence);
        player.reality.level = save.reality.level;
    }
}