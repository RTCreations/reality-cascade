import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";
import { showToast } from "./notifications.js";

const firstUnlock = document.querySelector("#unlock1");
const secondUnlock = document.querySelector("#unlock2");
const thirdUnlock = document.querySelector("#unlock3");
const lightDivider = document.querySelector("#lightDivider");
const primonColumn = document.querySelector(".primon-column");
const antiEnergyColumn = document.querySelector(".anti-energy-column");
const energyColumn = document.querySelector(".energy-column")
const lightColumn = document.querySelector(".light-column");
const energyResetButton = document.querySelector("#energyResetBtn");

const antiEnergy = new Decimal("1e4");
const energy = new Decimal("5e8");
const light = new Decimal("1e-29");

// Tracks which unlocks we've already announced this session, so reloading an
// already-progressed save doesn't re-fire the "you just unlocked X" toast.
let announcedInit = false;
const announced = {
    antiEnergy: false,
    energy: false,
    light: false
};

function announceUnlocks() {
    if (!announcedInit) {
        // First run after page load: adopt whatever's already true from the save
        // without toasting for it - only toast for genuinely new unlocks from here on.
        announced.antiEnergy = player.unlockedAntiEnergy;
        announced.energy = player.unlockedEnergy;
        announced.light = player.unlockedLight;
        announcedInit = true;
        return;
    }

    if (player.unlockedAntiEnergy && !announced.antiEnergy) {
        announced.antiEnergy = true;
        showToast({
            title: "New Feature: Anti Energy!",
            message: "You can now collapse Primons into Anti Energy from the Game tab. Check the Info tab to see how the conversion works.",
            variant: "milestone",
            duration: 9000
        });
    }

    if (player.unlockedEnergy && !announced.energy) {
        announced.energy = true;
        showToast({
            title: "New Feature: Energy!",
            message: "You can now convert Anti Energy into Energy from the Game tab. Check the Info tab for the conversion formula.",
            variant: "milestone",
            duration: 9000
        });
    }

    if (player.unlockedLight && !announced.light) {
        announced.light = true;
        showToast({
            title: "New Feature: Light & Photons!",
            message: "Your Energy is now emitting Photons, which condense into Light and boost Energy generation further. See the Info tab for details.",
            variant: "milestone",
            duration: 9000
        });
    }
}

function isUnlockThresholdReached(value, threshold) {
    return value.gte(threshold);
}

export function getUnlock() {
    if (!antiEnergyColumn || !energyColumn || !lightColumn) {
        return;
    }

    const currentPrimon = player.primon;
    const currentAntiEnergy = player.antiEnergy;
    const currentEnergy = player.energy;
    const currentLight = player.light;

    if (isUnlockThresholdReached(currentPrimon, antiEnergy)) {
        player.unlockedAntiEnergy = true;
    }

    if (isUnlockThresholdReached(currentPrimon, energy)) {
        player.unlockedEnergy = true;
    }

    if (energyResetButton) {
        energyResetButton.classList.toggle("active", isUnlockThresholdReached(currentPrimon, energy));
    }

    if (isUnlockThresholdReached(currentEnergy, light)) {
        player.unlockedLight = true;
    }

    announceUnlocks();

    firstUnlock.classList.toggle("active", !player.unlockedAntiEnergy);
    secondUnlock.classList.toggle("active", !player.unlockedEnergy && player.unlockedAntiEnergy);
    thirdUnlock.classList.toggle("active", !player.unlockedLight && player.unlockedEnergy);
    antiEnergyColumn.classList.toggle("active", player.unlockedAntiEnergy);
    energyColumn.classList.toggle("active", player.unlockedEnergy);
    lightColumn.classList.toggle("active", player.unlockedLight);
}