import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";

const firstUnlock = document.querySelector("#unlock1");
const secondUnlock = document.querySelector("#unlock2");
const thirdUnlock = document.querySelector("#unlock3");
const lightDivider = document.querySelector("#lightDivider");
const primonColumn = document.querySelector(".primon-column");
const antiEnergyColumn = document.querySelector(".anti-energy-column");
const energyColumn = document.querySelector(".energy-column")
const lightColumn = document.querySelector(".light-column");

const antiEnergy = new Decimal(1e-90);
const energy = new Decimal(1e-50);
const light = new Decimal(1e-28);

export function getUnlock() {
    if (!antiEnergyColumn || !energyColumn || !lightColumn) {
        return;
    }

    const currentPrimon = player.primon;
    const currentAntiEnergy = player.antiEnergy;
    const currentEnergy = player.energy;

    if (player.primon.gte(antiEnergy)) {
        player.unlockedAntiEnergy = true;
    }

    if (player.primon.gte(energy)) {
        player.unlockedEnergy = true;
    }

    if (player.energy.gte(light)) {
        player.unlockedLight = true;
    }

    firstUnlock.classList.toggle("active", !player.unlockedAntiEnergy);
    secondUnlock.classList.toggle("active", !player.unlockedEnergy && player.unlockedAntiEnergy);
    thirdUnlock.classList.toggle("active", !player.unlockedLight && player.unlockedEnergy);
    lightDivider.classList.toggle("active", player.unlockedLight);
    antiEnergyColumn.classList.toggle("active", player.unlockedAntiEnergy);
    energyColumn.classList.toggle("active", player.unlockedEnergy);
    lightColumn.classList.toggle("active", player.unlockedLight);
}