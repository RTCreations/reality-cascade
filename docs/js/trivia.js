import { showToast } from "./notifications.js";

const trivia = [
    "Lightning is about five times hotter than the surface of the Sun.",
    "A single bolt of lightning carries enough energy to toast almost 100,000 slices of bread.",
    "The Sun converts roughly 4 million tons of mass into energy every second.",
    "Photons have zero rest mass, yet they still carry energy and momentum.",
    "One kilogram of matter, fully converted to energy, would release about as much energy as 21 megatons of TNT.",
    "A sugar-cube-sized piece of neutron star would weigh roughly a billion tons on Earth.",
    "The energy the Sun radiates in a single second could power human civilization for over 500,000 years.",
    "When matter meets antimatter, essentially all of their mass converts directly into energy."
];

let recentlyShown = [];

function pickTrivia() {
    let pool = trivia.filter((fact) => !recentlyShown.includes(fact));

    if (pool.length === 0) {
        recentlyShown = [];
        pool = trivia;
    }

    const pick = pool[Math.floor(Math.random() * pool.length)];

    recentlyShown.push(pick);
    if (recentlyShown.length > Math.ceil(trivia.length / 2)) {
        recentlyShown.shift();
    }

    return pick;
}

let triviaInterval = null;

// Shows a random trivia toast every `intervalMs` (default 2 minutes).
// Safe to call multiple times - only ever starts one loop.
export function startTriviaLoop(intervalMs = 120000) {
    if (triviaInterval) return;

    triviaInterval = setInterval(() => {
        showToast({
            title: "Did You Know?",
            message: pickTrivia(),
            variant: "trivia"
        });
    }, intervalMs);
}
