import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";
import { upgrades } from "./upgrades.js";
import { saveGame, loadGame, loaded, importSave, exportSave } from "./save.js";
import { energyUpgradesLightUp, primonUpgradesLightUp } from "./animations.js";
import { getPlaytime, getPrimonTime, getEnergyTime, getLightTime, formatTime } from "./time.js";
import { getFact, checkFactPopup } from "./facts.js";
import { checkPrimonMilestone } from "./milestones.js";
import { checkInfoUnlocks } from "./info.js";
import { getNotationMode, initSettings } from "./settings.js";
import { playPulse, playShake, playResetFlash } from "./feedback.js";
import { startTriviaLoop } from "./trivia.js";
import { getUnlock } from "./unlock.js";
import { checkAchievements } from "./achievements.js";

function isZeroishValue(value) {
    const decimalValue = new Decimal(value);
    const text = decimalValue.toString();

    return decimalValue.eq(0) || text === "NaN" || text === "Infinity" || text === "-Infinity";
}

function formatScientificNumber(value) {
    if (isZeroishValue(value)) return "0";

    let exponent = value.log10().floor();
    let mantissa = value.div(Decimal.pow(10, exponent));

    return `${mantissa.toFixed(2)}e${exponent}`;
}

function formatShortNumber(val) {
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
    "Ce", "UCe"
    ]; //Up to e308 Support

    let exponent = num.log10().floor();
    let index = exponent.div(3).floor().toNumber() - 1;

    if (index < suffixes.length) {
        let divided = num.div(Decimal.pow(1000, index + 1));
        return divided.toFixed(2) + suffixes[index];
    }

    return formatScientificNumber(num);
}

export function format(value) {
    const num = new Decimal(value);

    if (getNotationMode() === "scientific" || num.gte("1e308") || num.lte("1e0")) {
        return formatScientificNumber(num);
    }

    return formatShortNumber(num);
}

export function gameLoop() {
    //main production loop, runs every tick ms
    getTime();

    updateDisplay();
}

export function updateDisplay() {
    document.getElementById("primon").textContent = format(player.primon) + " Primons";
    document.getElementById("pps").textContent = format(player.primonsPerSecond.mul(new Decimal(1000).div(player.primonSpeed))) + " Primons Per Second";
    document.getElementById("ptm").textContent = format(player.primonMultiplier) + "x Total Multiplier";

    const antiEnergyMultiplier = upgrades.getAntiEnergyMultiplier();
    document.getElementById("antiBoost").textContent = 
    format(antiEnergyMultiplier) + "x Primon Boost\nGain +" + format(upgrades.getAntiEnergyMultiplier(true)) + "x Primon Boost After Reset";
    document.getElementById("primonBtn").innerHTML = `
        <span class="upgrade-name" style="font-family: monospace;">Primon Enhancer</span>
        <span class="upgrade-cost" style="font-family: monospace;">${format(upgrades.primonBtn.cost)} Primons</span>
        <span class="upgrade-level" style="font-family: monospace;">Level ${upgrades.primonBtn.level}</span>
    `;


    document.getElementById("antiEnergy").textContent = 
    "Anti Energy: " + format(player.antiEnergy) + " Anti J";
    document.getElementById("antiEnergyReset").textContent = 
    "Reset for " + format(upgrades.getAntiEnergyGain()) + " Anti Energy";

    const energyGain = document.getElementById("energyGain");
    if (energyGain) {
        energyGain.textContent = format(upgrades.getEnergyBoostMultiplier()) + "x Boost To Anti Energy Gain\n+" + format(upgrades.getEnergyBoostMultiplier(true)) + "x Boost To Anti Energy Gain After Reset";
    }

    const energyResetBtn = document.getElementById("energyResetBtn");
    if (energyResetBtn) {
        energyResetBtn.innerHTML = `
            <span class="upgrade-name" style="font-family: monospace;">Convert Anti Energy</span>
            <span class="upgrade-cost" style="font-family: monospace;">Gain ${format(upgrades.getEnergyFromAntiEnergyGain())} Energy</span>
            <span class="upgrade-level" style="font-family: monospace;">Resets Anti Energy, Primons, and all Upgrades Above</span>
        `;
    }

    const energyPerSecond = player.energyPerSecond.mul(new Decimal("1000").div(player.energySpeed));
    document.getElementById("energy").textContent = 
    "Energy: " + format(player.energy) + " J";
    const ampEffect = new Decimal("1.1").pow(upgrades.energyAmplifier.level);
    const boostEffect = new Decimal("1.2").pow(upgrades.energyBoost.level);

    document.getElementById("energyAmplifierBtn").innerHTML = `
        <span class="upgrade-name" style="font-family: monospace;">Amplifier</span>
        <span class="upgrade-cost" style="font-family: monospace;">Cost: ${format(upgrades.energyAmplifier.cost)}</span>
        <span class="upgrade-level" style="font-family: monospace;">Level ${upgrades.energyAmplifier.level}</span>
        <span class="upgrade-effect" style="font-family: monospace;">Effect: ${format(ampEffect)}x Energy</span>
    `;
    document.getElementById("energyBoostBtn").innerHTML = `
        <span class="upgrade-name" style="font-family: monospace;">Boost</span>
        <span class="upgrade-cost" style="font-family: monospace;">Cost: ${format(upgrades.energyBoost.cost)}</span>
        <span class="upgrade-level" style="font-family: monospace;">Level ${upgrades.energyBoost.level}</span>
        <span class="upgrade-effect" style="font-family: monospace;">Effect: ${format(boostEffect)}x Energy</span>
    `;
    document.getElementById("lightAccelerateBtn").innerHTML = `
        <span class="upgrade-name" style="font-family: monospace;">Light Acceleration</span>
        <span class="upgrade-cost" style="font-family: monospace;">Cost: ${format(upgrades.lightAccelerate.cost)} Light</span>
        <span class="upgrade-level" style="font-family: monospace;">Level ${upgrades.lightAccelerate.level} • ${player.energySpeed.toFixed(0)}ms</span>
    `;

    const lightEnergyMultiplier = upgrades.lightEnergyBoost();
    document.getElementById("light").innerHTML = `
        <span class="light-value" data-label="Light">${format(player.light)} Light (${format(player.lightPerSecond.mul(new Decimal("1000").div(player.energySpeed)))}/s)</span>
        <span class="light-boost" data-label="Boost">${format(lightEnergyMultiplier)}x Energy</span>
    `;
    document.getElementById("photons").textContent = format(player.photons);
    document.getElementById("photons").setAttribute("data-label", "Photons");

    document.getElementById("playtime").textContent = 
    "Playtime: " + formatTime(player.stats.playtime);
    document.getElementById("energyStats").textContent = getFact();

    document.getElementById("highestPrimonStat").textContent = 
    "Highest Primons Ever: " + format(player.stats.highestPrimon);
    document.getElementById("totalAntiEnergyStat").textContent = 
    "Total Anti Energy Earned: " + format(player.stats.totalAntiEnergyEarned);
    document.getElementById("antiEnergyResetsStat").textContent = 
    "Anti Energy Resets: " + player.stats.antiEnergyResetCount;
    document.getElementById("energyResetsStat").textContent = 
    "Energy Resets: " + player.stats.energyResetCount;

    document.getElementById("primonAchievementMulti").textContent = format(player.primonAchievementBonus) + "x Primon Achievement Bonus";
    document.getElementById("antiEnergyAchievementMulti").textContent = format(player.antiEnergyAchievementBonus) + "x Anti Energy Achievement Bonus";
    document.getElementById("energyAchievementMulti").textContent = format(player.energyAchievementBonus) + "x Energy Achievement Bonus";

    primonUpgradesLightUp();
    energyUpgradesLightUp();
    getUnlock();
    checkAchievements();
    checkFactPopup();
    checkPrimonMilestone();
    checkInfoUnlocks();
}

let playtimeInterval = null;
let primonInterval = null;
let energyInterval = null;
let lightInterval = null;

export function startTimer() {
    if (!loaded) {
        return;
    }
    clearInterval(playtimeInterval);
    clearInterval(primonInterval);
    clearInterval(energyInterval);
    clearInterval(lightInterval);

    playtimeInterval = setInterval(() => {
        getPlaytime();
        getUnlock();
    }, 1000);

    primonInterval = setInterval(() => {
        getPrimonTime();
        getUnlock();
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
export function speedUp(upgradeType) {
    if (player.unlockedLight && upgradeType === "lightAccelerate") {
        player.energySpeed = player.energySpeed * 0.9; // Cut the time in half
    }
    startTimer(); //Restart intervals with new speed
}

let intervalId2 = null;
let intervalId3 = null;

export async function heldBuy() {
    clearInterval(intervalId2);
    intervalId2 = null;
    
    intervalId2 = setInterval(() => {
        if (player.autoBuyPrimon) {
            upgrades.buyPrimonBtnMax();
        } else {
            upgrades.buyPrimonBtn();
        }
        /*upgrades.buyEnergyAmplifier();
        upgrades.buyEnergyBoost();
        upgrades.buyEnergyAccelerate();*/
    }, 50);
}

export function energy() {
    clearInterval(intervalId3);
    intervalId3 = null;

    intervalId3 = setInterval(() => {
        upgrades.resetAntiEnergyForEnergy();
    }, 1000)
}

window.addEventListener('keydown', (event) => {
    event.preventDefault();

    if (!intervalId2 && event.code === 'KeyM') {
        heldBuy();
    }

    if (!intervalId3 && event.code === "KeyE") {
        energy();
    }
});

window.addEventListener('keyup', (event) => {
    event.preventDefault();

    if (intervalId2 && event.code === 'KeyM') {
        clearInterval(intervalId2);
        intervalId2 = null;
    }

    if (intervalId3 && event.code === 'KeyE') {
        clearInterval(intervalId3);
        intervalId3 = null;
    }
});

document.getElementById("primonBtn").onclick = (e) => {
    e.preventDefault();
    const btn = e.currentTarget;
    const bought = player.autoBuyPrimon ? upgrades.buyPrimonBtnMax() : upgrades.buyPrimonBtn();
    bought ? playPulse(btn) : playShake(btn);
};

const primonBuyMaxInput = document.getElementById("primonBuyMax");
if (primonBuyMaxInput) {
    primonBuyMaxInput.checked = player.autoBuyPrimon;
    primonBuyMaxInput.addEventListener("change", (event) => {
        player.autoBuyPrimon = event.target.checked;
    });
}

document.getElementById("antiEnergyReset").onclick = (e) => {
    e.preventDefault();
    const btn = e.currentTarget;
    const didReset = upgrades.resetPrimonForAntiEnergy();
    if (didReset) {
        playPulse(btn);
        playResetFlash(document.getElementById("resources"));
    } else {
        playShake(btn);
    }
};

document.getElementById("energyResetBtn").onclick = (e) => {
    e.preventDefault();
    const btn = e.currentTarget;
    const didReset = upgrades.resetAntiEnergyForEnergy();
    if (didReset) {
        playPulse(btn);
        playResetFlash(document.getElementById("resources"));
    } else {
        playShake(btn);
    }
};

document.getElementById("energyAmplifierBtn").onclick = (e) => {
    e.preventDefault();
    const btn = e.currentTarget;
    upgrades.buyEnergyAmplifier() ? playPulse(btn) : playShake(btn);
};

document.getElementById("energyBoostBtn").onclick = (e) => {
    e.preventDefault();
    const btn = e.currentTarget;
    upgrades.buyEnergyBoost() ? playPulse(btn) : playShake(btn);
};

document.getElementById("lightAccelerateBtn").onclick = (e) => {
    e.preventDefault();
    const btn = e.currentTarget;
    upgrades.buyLightAccelerate() ? playPulse(btn) : playShake(btn);
};

document.getElementById("save").onclick = (e) => {
    e.preventDefault();
    saveGame();
};

document.getElementById("export").onclick = (e) => {
    e.preventDefault();
    exportSave();
};

document.getElementById("import").onclick = (e) => {
    e.preventDefault();
    importSave();
};

document.getElementById("wipe").onclick = (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.reload();
};

loadGame();
getUnlock();

if (primonBuyMaxInput) {
    primonBuyMaxInput.checked = player.autoBuyPrimon;
}

startTimer();
checkAchievements();
startTriviaLoop();
initSettings();

setInterval(updateDisplay, 60); // Run the display update loop every 100ms
setInterval(saveGame, 10000); // Run the save game loop every 10 seconds
