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

    const suffixes = ["K", "M", "B", "T", "Qa", "Qi"];

    let exponent = num.log10().floor();
    let index = exponent.div(3).floor().toNumber() - 1;

    if (index < suffixes.length) {
        let divided = num.div(Decimal.pow(1000, index + 1));
        return divided.toFixed(2) + suffixes[index];
    }

    return num.toExponential(2);
}

export function gameLoop() {
    //main production loop, runs every 100ms
    player.energy = player.energy.plus(player.energyPerSecond.div(1));

    updateDisplay();
}

export function updateDisplay() {
    document.getElementById("energy").textContent = "Energy: " + formatE(player.energy);
    document.getElementById("eps").textContent = "Energy/sec: " + formatE(player.energyPerSecond);
    document.getElementById("upgrade").textContent = "Upgrade: " + formatE(upgrades.energyBoost.cost) + " Energy (Level: " + upgrades.energyBoost.level + ")";
}

document.getElementById("upgrade").onclick = () => {
    upgrades.energyBoost.buy();
};

setInterval(gameLoop, 1); // Run the game loop every 100ms
setInterval(saveGame, 10000); // Run the save game loop every 10 seconds