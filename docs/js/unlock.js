import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";

const firstUnlock = document.querySelector("#unlock1");
const lightColumn = document.querySelector(".light-column");

const light = new Decimal(1e-28);

export function getUnlock() {
    if (!lightColumn) {
        return;
    }

    const currentEnergy = player.energy;

    firstUnlock.classList.toggle("active", !currentEnergy.gte(light));
    lightColumn.classList.toggle("active", currentEnergy.gte(light));
}