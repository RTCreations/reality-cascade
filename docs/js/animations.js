import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";
import { upgrades } from "./upgrades.js";

export function primonUpgradesLightUp() {
    const primons = new Decimal(player.primon);
    const primonBtn = document.getElementById("primonBtn");

    if (!primonBtn) return;

    if (primons.gte(upgrades.primonBtn.cost)) {
        primonBtn.style.backgroundColor = "#0e1f31";
        primonBtn.style.borderColor = "#e5e7eb";
    } else {
        primonBtn.style.backgroundColor = "#0e1f31";
        primonBtn.style.borderColor = "#9ca3af";
    }
}

export function energyUpgradesLightUp() {
    const energy = new Decimal(player.energy);

    const amplifierBtn = document.getElementById("energyAmplifierBtn");
    const boostBtn = document.getElementById("energyBoostBtn");
    const accelerateBtn = document.getElementById("energyAccelerateBtn");

    if (amplifierBtn) {
        amplifierBtn.style.backgroundColor = energy.gte(upgrades.energyAmplifier.cost) ? "#0e1f31" : "#2a2f37";
        amplifierBtn.style.borderColor = energy.gte(upgrades.energyAmplifier.cost) ? "#e5e7eb" : "#6b7280";
    }

    if (boostBtn) {
        boostBtn.style.backgroundColor = energy.gte(upgrades.energyBoost.cost) ? "#0e1f31" : "#2a2f37";
        boostBtn.style.borderColor = energy.gte(upgrades.energyBoost.cost) ? "#e5e7eb" : "#6b7280";
    }

    if (accelerateBtn) {
        accelerateBtn.style.backgroundColor = energy.gte(upgrades.energyAccelerate.cost) ? "#0e1f31" : "#2a2f37";
        accelerateBtn.style.borderColor = energy.gte(upgrades.energyAccelerate.cost) ? "#e5e7eb" : "#6b7280";
    }
}

export const anim = {
    primonUpgradesLightUp: primonUpgradesLightUp(),
    energyUpgradesLightUp: energyUpgradesLightUp()
}