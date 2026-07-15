import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";
import { upgrades } from "./upgrades.js";
import { saveGame, loadGame } from "./save.js";

loadGame();

export function formatE(num) {
    num = new Decimal(num);

    if (num.lt(1000)) return num.toFixed(0);

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
    //main production loop, runs every energySpeed ms
    player.energy = player.energy.plus(player.energyPerSecond.div(1));

    updateDisplay();
}

export function updateDisplay() {
    document.getElementById("energy").textContent = "Energy: " + formatF(player.energy);
    document.getElementById("eps").textContent = "Energy/sec: " + formatF(player.energyPerSecond.times(new Decimal(player.energySpeed).div(1000)));
    document.getElementById("upgrade").textContent = "Energy Amplifier (2x): " + formatF(upgrades.energyAmplifier.cost) + " Energy (Level: " + upgrades.energyAmplifier.level + ")";
    document.getElementById("energyBoostBtn").textContent = "Energy Boost (3x): " + formatF(upgrades.energyBoost.cost) + " Energy (Level: " + upgrades.energyBoost.level + ")";
    document.getElementById("upgrade2").textContent = "Accelerate: " + formatF(upgrades.energySpeed.cost) + " Energy (Level: " + upgrades.energySpeed.level + " / " + player.energySpeed.toFixed(0) + "ms" + ")";
}

document.getElementById("upgrade").onclick = () => {
    upgrades.energyAmplifier.buy();
};

document.getElementById("energyBoostBtn").onclick = () => {
    upgrades.energyBoost.buy();
};

document.getElementById("upgrade2").onclick = () => {
    upgrades.energySpeed.buy();
};

let intervalId;

export function startTimer() {
  // Clear any existing interval to prevent overlapping
  clearInterval(intervalId); 

  // Start a new interval using the current value of the delay variable
  intervalId = setInterval(() => {
    gameLoop();
    console.log(`Timer running at every ${player.energySpeed}ms`);
  }, player.energySpeed);
}

// Update the variable dynamically
export function speedUp() {
  player.energySpeed = player.energySpeed * 0.9; // Cut the time in half
  startTimer(); // Restart the interval with the new delay
}

startTimer();

setInterval(updateDisplay, 50); // Run the display update loop every 100ms
setInterval(saveGame, 10000); // Run the save game loop every 10 seconds