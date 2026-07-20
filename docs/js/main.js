import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";
import { upgrades } from "./upgrades.js";
import { saveGame, loadGame } from "./save.js";
import { energyUpgradesLightUp } from "./animations.js";
import { getPlaytime } from "./time.js";
import { getPrimonTime } from "./time.js";
import { getEnergyTime } from "./time.js";
import { getLightTime } from "./time.js";
import { formatTime } from "./time.js";
import { getFact } from "./facts.js";
import { getUnlock } from "./unlock.js";

export function formatE(num) {
    num = new Decimal(num);
    let exponent = num.log10().floor();
    let mantissa = num.div(Decimal.pow(10, exponent));

    return `${mantissa.toFixed(2)}e${exponent}`;
}

export function formatF(val) {
    let num = new Decimal(val);

    if (num.lt(1000)) return num.toFixed(0);

    const suffixes = ["K", "M", "B", "T", "Qa", "Qn", "Sx", "Sp", "Oc", "No", "De",
    "UDe", "DDe", "TDe", "QaDe", "QnDe", "SxDe", "SpDe", "OcDe", "NoDe", 
    "Vg", "UVg", "DVg", "TVg", "QaVg", "QnVg", "SxVg", "SpVg", "OcVg", "NoVg",
    "Tg", "UTg", "DTg", "TTg", "QaTg", "QnTg", "SxTg", "SpTg", "OcTg", "NoTg",
    "qg", "Uqg", "Dqg", "Tqg", "Qaqg", "Qnqg", "Sxqg", "Spqg", "Ocqg", "Noqg",
    "Qg", "UQg", "DQg", "TQg", "QaQg", "QnQg", "SxQg", "SpQg", "OcQg", "NoQg",
    "sg", "Usg", "Dsg", "Tsg", "Qasg", "Qnsg", "Sxsg", "Spsg", "Ocsg", "Nosg",
    "Sg", "USg", "DSg", "TSg", "QaSg", "QnSg", "SxSg", "SpSg", "OcSg", "NoSg",
    "Og", "UOg", "DOg", "TOg", "QaOg", "QnOg", "SxOg", "SpOg", "OcOg", "NoOg",
    "Ng", "UNg", "DNg", "TNg", "QaNg", "QnNg", "SxNg", "SpNg", "OcNg", "NoNg",
    "Ce", "Uce"
    ]; //Up to e308 Support

    let exponent = num.log10().floor();
    let index = exponent.div(3).floor().toNumber() - 1;

    if (index < suffixes.length) {
        let divided = num.div(Decimal.pow(1000, index + 1));
        return divided.toFixed(2) + suffixes[index];
    }

    return num.toExponential(2);
}

export function gameLoop() {
    //main production loop, runs every tick ms
    getTime();

    updateDisplay();
}

export function updateDisplay() {
    document.getElementById("primon").textContent = 
    "Primons: " + formatE(player.primon);
    document.getElementById("pps").textContent = 
    "Primons/s: " + formatE(player.primonsPerSecond);

    document.getElementById("antiEnergy").textContent = 
    "Anti Energy: " + formatE(player.antiEnergy) + " Anti J";
    document.getElementById("antiEnergyReset").textContent = 
    "Reset Primons for " + formatE(player.primon.pow(0.5)) + " Anti Energy";

    document.getElementById("energy").textContent = 
    "Energy: " + formatE(player.energy) + " J";
    document.getElementById("eps").textContent = 
    "Energy/sec: " + formatE(player.energyPerSecond.times(new Decimal(1000).div(player.energySpeed))) + " J";
    document.getElementById("energyAmplifierBtn").textContent = 
    "Energy Amplifier (2x): " + formatE(upgrades.energyAmplifier.cost) + " Energy (Level: " + upgrades.energyAmplifier.level + ")";
    document.getElementById("energyBoostBtn").textContent = 
    "Energy Boost (1.5x): " + formatE(upgrades.energyBoost.cost) + " Energy (Level: " + upgrades.energyBoost.level + ")";
    document.getElementById("energyAccelerateBtn").textContent = 
    "Accelerate: " + formatE(upgrades.energyAccelerate.cost) + " Energy (Level: " + upgrades.energyAccelerate.level + " / " + player.energySpeed.toFixed(0) + "ms" + ")";

    document.getElementById("light").textContent = 
    "Light: " + formatE(player.light) + " | Boosts Energy By " + formatE(player.light.pow(1.5));
    document.getElementById("photons").textContent = 
    "Photons: " + formatE(player.photons);

    document.getElementById("playtime").textContent = 
    "Playtime: " + formatTime(player.stats.playtime);
    document.getElementById("energyStats").textContent = getFact();

    energyUpgradesLightUp();
    getUnlock();
}

let playtimeInterval = null;
let primonInterval = null;
let energyInterval = null;
let lightInterval = null;

export function startTimer() {
    // Clear any existing interval to prevent overlapping
    clearInterval(playtimeInterval);
    clearInterval(primonInterval);
    clearInterval(energyInterval); 
    clearInterval(lightInterval);

    // Start intervals using the current value of the delay variable
    if (!playtimeInterval) {
        playtimeInterval = setInterval(() => {
            getPlaytime();
        }, 1000);
    }

    if (!primonInterval) {
        primonInterval = setInterval(() => {
            getPrimonTime();
        }, player.primonSpeed);
    }

    if (player.unlockedEnergy) {
        energyInterval = setInterval(() => {
            getEnergyTime();
        }, player.energySpeed);
    }

    if (player.unlockedLight) {
        lightInterval = setInterval(() => {
            getLightTime();
        }, player.energySpeed);
    }
}

// Update the variable dynamically
export function speedUp() {
  player.energySpeed = player.energySpeed * 0.9; // Cut the time in half
  startTimer(); // Restart the interval with the new delay
}

let intervalId2 = null;

export function heldBuy() {
    clearInterval(intervalId2);
    intervalId2 = null;

    intervalId2 = setInterval(() => {
        upgrades.buyEnergyAmplifier();
        upgrades.buyEnergyBoost();
        upgrades.buyEnergyAccelerate();
    }, 50);
}

window.addEventListener('keydown', (event) => {
    if (event.code !== 'KeyM') return;

    event.preventDefault();

    if (event.repeat) return;
    if (!intervalId2) {
        heldBuy();
    }
});

window.addEventListener('keyup', (event) => {
    if (event.code !== 'KeyM') return;

    event.preventDefault();

    if (intervalId2) {
        clearInterval(intervalId2);
        intervalId2 = null;
    }
});

document.getElementById("energyAmplifierBtn").onclick = (e) => {
    e.preventDefault();
    upgrades.buyEnergyAmplifier();
};

document.getElementById("energyBoostBtn").onclick = (e) => {
    e.preventDefault();
    upgrades.buyEnergyBoost();
};

document.getElementById("energyAccelerateBtn").onclick = (e) => {
    e.preventDefault();
    upgrades.buyEnergyAccelerate();
};

document.getElementById("save").onclick = (e) => {
    e.preventDefault();
    saveGame();
};

document.getElementById("wipe").onclick = (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.reload();
};

loadGame();
startTimer();

setInterval(updateDisplay, 60); // Run the display update loop every 100ms
setInterval(saveGame, 10000); // Run the save game loop every 1 seconds
