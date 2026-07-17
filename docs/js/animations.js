import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";
import { upgrades } from "./upgrades.js";

export function energyUpgradesLightUp() {
    const playerEnergy = player.energy;

    if (playerEnergy.gte(upgrades.energyAmplifier.cost)) {
        document.getElementById("energyAmplifierBtn").style.backgroundColor = "#3c4c7f";
    } else {
        document.getElementById("energyAmplifierBtn").style.backgroundColor = "#2b3452";
    }

    if (playerEnergy.gte(upgrades.energyBoost.cost)) {
        document.getElementById("energyBoostBtn").style.backgroundColor = "#3c4c7f";
    } else {
        document.getElementById("energyBoostBtn").style.backgroundColor = "#2b3452";
    }

    if (playerEnergy.gte(upgrades.energyAccelerate.cost)) {
        document.getElementById("energyAccelerateBtn").style.backgroundColor = "#3c4c7f";
    } else {
        document.getElementById("energyAccelerateBtn").style.backgroundColor = "#2b3452";
    }
}

export const anim = {
    energyUpgradesLightUp: energyUpgradesLightUp()
}