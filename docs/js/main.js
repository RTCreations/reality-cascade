import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";
import { upgrades } from "./upgrades.js";
import { saveGame, loadGame, loaded } from "./save.js";
import { energyUpgradesLightUp, primonUpgradesLightUp } from "./animations.js";
import { getPlaytime, getPrimonTime, getEnergyTime, getLightTime, formatTime } from "./time.js";
import { getFact } from "./facts.js";
import { getUnlock } from "./unlock.js";

function isZeroishValue(value) {
    const decimalValue = new Decimal(value);
    const text = decimalValue.toString();

    return decimalValue.eq(0) || text === "NaN" || text === "Infinity" || text === "-Infinity";
}

export function formatE(num) {
    const value = new Decimal(num);

    if (isZeroishValue(value)) return "0";

    let exponent = value.log10().floor();
    let mantissa = value.div(Decimal.pow(10, exponent));

    return `${mantissa.toFixed(2)}e${exponent}`;
}

export function formatF(val) {
    let num = new Decimal(val);

    if (isZeroishValue(num)) return "0";

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
    document.getElementById("primon").textContent = "Primons: " + formatE(player.primon);
    document.getElementById("pps").textContent = "Primons/s: " + formatE(player.primonsPerSecond);
    
    const antiEnergyMultiplier = upgrades.getAntiEnergyMultiplier();
    document.getElementById("antiBoost").textContent = 
    "Primon Boost: " + formatF(antiEnergyMultiplier) + "x";
    document.getElementById("primonBtn").innerHTML = `
        <span class="upgrade-name">Primon Enhancer</span>
        <span class="upgrade-cost">Cost: ${formatE(upgrades.primonBtn.cost)}</span>
        <span class="upgrade-level">Level ${upgrades.primonBtn.level}</span>
    `;


    document.getElementById("antiEnergy").textContent = 
    "Anti Energy: " + formatE(player.antiEnergy) + " Anti J";
    document.getElementById("antiEnergyReset").textContent = 
    "Reset for " + formatE(upgrades.getAntiEnergyGain()) + " Anti Energy";

    const energyPerSecond = player.energyPerSecond.times(new Decimal(1000).div(player.energySpeed));
    document.getElementById("energy").textContent = 
    "Energy: " + formatE(player.energy) + " J • " + formatE(energyPerSecond) + " J/s";
    document.getElementById("energyAmplifierBtn").innerHTML = `
        <span class="upgrade-name">Amplifier</span>
        <span class="upgrade-cost">Cost: ${formatE(upgrades.energyAmplifier.cost)}</span>
        <span class="upgrade-level">Level ${upgrades.energyAmplifier.level}</span>
    `;
    document.getElementById("energyBoostBtn").innerHTML = `
        <span class="upgrade-name">Boost</span>
        <span class="upgrade-cost">Cost: ${formatE(upgrades.energyBoost.cost)}</span>
        <span class="upgrade-level">Level ${upgrades.energyBoost.level}</span>
    `;
    document.getElementById("energyAccelerateBtn").innerHTML = `
        <span class="upgrade-name">Accelerate</span>
        <span class="upgrade-cost">Cost: ${formatE(upgrades.energyAccelerate.cost)}</span>
        <span class="upgrade-level">Level ${upgrades.energyAccelerate.level} • ${player.energySpeed.toFixed(0)}ms</span>
    `;

    document.getElementById("light").textContent = 
    "Light: " + formatE(player.light) + " | Boosts Energy By " + formatE(player.light.pow(1.5));
    document.getElementById("photons").textContent = 
    "Photons: " + formatE(player.photons);

    document.getElementById("playtime").textContent = 
    "Playtime: " + formatTime(player.stats.playtime);
    document.getElementById("energyStats").textContent = getFact();

    primonUpgradesLightUp();
    energyUpgradesLightUp();
    getUnlock();
}

let playtimeInterval = null;
let primonInterval = null;
let energyInterval = null;
let lightInterval = null;

export function startTimer() {
    clearInterval(playtimeInterval);
    clearInterval(primonInterval);
    clearInterval(energyInterval);
    clearInterval(lightInterval);

    playtimeInterval = setInterval(() => {
        getPlaytime();
    }, 1000);

    primonInterval = setInterval(() => {
        getPrimonTime();
    }, player.primonSpeed);

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
        upgrades.buyPrimonBtn();
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

document.getElementById("primonBtn").onclick = (e) => {
    e.preventDefault();
    upgrades.buyPrimonBtn();
};

document.getElementById("antiEnergyReset").onclick = (e) => {
    e.preventDefault();
    upgrades.resetPrimonForAntiEnergy();
};

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
