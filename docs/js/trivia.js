import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";
import { formatE, formatF } from "./main.js";
import { showToast } from "./notifications.js";

// Each entry is either a plain string, or a function that reads live player
// state and returns a freshly-generated string. Functions let the "fact"
// change every time it's shown, based on how much the player currently has.
const triviaPool = [
    // --- Anti Energy ---
    () => {
        const antiJ = player.antiEnergy;
        if (antiJ.lte(0)) {
            return "You haven't banked any Anti Energy yet. The universe currently owes you nothing, which is, legally speaking, fair.";
        }
        const fictionalJoules = new Decimal(1).div(antiJ);
        return `You've stockpiled ${formatE(antiJ)} Anti J. Under the Universal Inversion Treaty (still unratified), that converts to roughly ${formatE(fictionalJoules)} real Joules — enough to reheat a cold coffee in a universe that hasn't been invented yet.`;
    },

    () => {
        const antiJ = player.antiEnergy;
        if (antiJ.lte(0)) {
            return "Anti Joules are measured in negative exponents because Primon scientists ran out of universe to put them in.";
        }
        const dread = antiJ.times(new Decimal("1e3"));
        return `At the black-market exchange rate of 1 Anti J = 1,000 Existential Dread Units, your ${formatE(antiJ)} Anti J is worth ${formatF(dread)} EDU. Please dread responsibly.`;
    },

    "Anti Energy isn't the opposite of energy, it's energy's IOU to a universe that never signed the contract.",

    // --- Primons ---
    () => {
        const primon = player.primon;
        if (primon.lte(0)) {
            return "You have zero Primons. Somewhere, a physicist is relieved this simplifies their spreadsheet.";
        }
        const sandGrains = primon.times(new Decimal("7.5e18"));
        return `Your ${formatE(primon)} Primons, run through the Bureau of Fictional Metrology's official table, convert to ${formatF(sandGrains)} grains of sand, which is either a beach or a filing error.`;
    },

    () => {
        const primon = player.primon;
        if (primon.lte(0)) {
            return "Primons are so fundamental that even they don't know what they're made of, or know anything.";
        }
        const atomsInBody = primon.times(new Decimal("7e27"));
        return `${formatE(primon)} Primons is about ${formatF(atomsInBody)} atoms' worth of you, which raises some uncomfortable questions about where the rest of you is, unless it's above the average 7e27 atoms in a human. But, are you really human?`;
    },

    // --- Energy ---
    () => {
        const e = player.energy;
        if (e.lte(0)) {
            return "You have no Energy yet. The multiverse's calorie count remains untouched by your efforts.";
        }
        const calories = e.times(new Decimal("2.39e17"));
        return `Your ${formatE(e)} J of Energy, according to a diet plan no nutritionist will endorse, is worth ${formatF(calories)} imaginary calories. You burn them by simply existing.`;
    },

    () => {
        const e = player.energy;
        const realBolt = new Decimal("1e9"); // a real lightning bolt is roughly 1 billion joules
        if (e.lte(0)) {
            return "A real lightning bolt carries about 1 billion Joules. Your Energy currently carries about zero. The gap is, frankly, embarrassing.";
        }
        const ratio = e.div(realBolt);
        return `A real lightning bolt is about 1e9 J. Your ${formatE(e)} J of Energy is ${formatE(ratio)}x that — the universe is still deciding whether to classify it as weather or as a rounding error.`;
    },

    // --- Light / Photons ---
    () => {
        const light = player.light;
        if (light.lte(0)) {
            return "You haven't generated any Light yet. The darkness respects your commitment to the bit.";
        }
        return `Your ${formatE(light)} Light, if bottled and sold at a certain Swedish furniture store, would be called the GLÖDLAMPA — and it would still be perpetually out of stock.`;
    },

    // --- Cross-currency absurdity ---
    () => {
        const primon = player.primon;
        const antiJ = player.antiEnergy;
        if (primon.lte(0) || antiJ.lte(0)) {
            return "Somewhere, a filing cabinet exists solely to store the exchange rate between Primons and Anti Energy. It has never been opened.";
        }
        const rate = primon.div(antiJ.plus(1));
        return `Right now, your Primon-to-Anti-Energy ratio sits at ${formatE(rate)}. Nobody knows what unit this is measured in, including the person who invented the ratio.`;
    },

    "Primons and Anti Energy exist in a delicate balance, in the sense that nobody has explained the physics and everyone has agreed not to ask."
];

let recentIndices = [];

function pickTriviaEntry() {
    let availableIndices = triviaPool.map((_, i) => i).filter((i) => !recentIndices.includes(i));

    if (availableIndices.length === 0) {
        recentIndices = [];
        availableIndices = triviaPool.map((_, i) => i);
    }

    const index = availableIndices[Math.floor(Math.random() * availableIndices.length)];

    recentIndices.push(index);
    if (recentIndices.length > Math.ceil(triviaPool.length / 2)) {
        recentIndices.shift();
    }

    const entry = triviaPool[index];
    return typeof entry === "function" ? entry() : entry;
}

let triviaInterval = null;

// Shows a random trivia toast every `intervalMs` (default 2 minutes).
// Safe to call multiple times - only ever starts one loop.
export function startTriviaLoop(intervalMs = 20000) {
    if (triviaInterval) return;

    triviaInterval = setInterval(() => {
        showToast({
            title: "Reality News",
            message: pickTriviaEntry(),
            variant: "trivia"
        });
    }, intervalMs);
}