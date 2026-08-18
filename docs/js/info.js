import { player } from "./player.js";

// Each entry maps to an #info card in index.html. isUnlocked reads the same
// flags getUnlock() already maintains, so these stay in sync with the Game tab.
const infoEntries = [
    {
        id: "infoAntiEnergy",
        isUnlocked: () => player.unlockedAntiEnergy,
        title: "Anti Energy (Anti J)",
        body: `Anti Energy, one of the last fictional energies, measured in Anti Joules ("Anti J"), is what happens when a Primon field is
            deliberately collapsed instead of left to decay on its own. Real physics already flirts with
            negative energy with the Casimir effect and theoretical exotic matter both describe regions where
            energy density can dip below the vacuum's normal zero-point baseline. Reality Cascade takes that
            seed of real science and multiplies it by an entire universe of imagination: collapse enough
            Primons, and you get a burst of Anti Energy roughly proportional to the square root of what you
            had, refined by whatever Extraction Efficiency and Boosts you've unlocked along the way.`,
        formula: "Conversion (approximate): Anti Energy ≈ Primons^0.35, then multiplied by your Anti Energy Multiplier and Energy Boost."
    },
    {
        id: "infoEnergy",
        isUnlocked: () => player.unlockedEnergy,
        title: "Energy (J)",
        body: `Energy is what you get when Anti Energy crosses back over the boundary into something usable —
            Reality Cascade's stylized take on matter-antimatter annihilation, if the antimatter in question
            had to file some paperwork first. Cashing in Anti Energy releases ordinary Joules, scaling with
            the logarithm of how much you convert: bigger stockpiles yield diminishing, but never negative,
            returns, and not unlike how real annihilation reactions are ultimately bounded by mass-energy
            equivalence (E = mc²), just with a much heavier layer of fiction stacked on top.`,
        formula: "Conversion (approximate): once Energy ≥ 1e-34 J, Energy ≈ 1e-34 × log10(Anti Energy) × Energy Multiplier. Below that threshold, Energy ≈ Anti Energy^1.01 × Energy Multiplier instead, which is a steeper early payout before the logarithmic curve takes over."
    },
    {
        id: "infoLight",
        isUnlocked: () => player.unlockedLight,
        title: "Light & Photons",
        body: `Once your Energy output crosses a critical threshold, it begins spontaneously emitting Photons,
            quantized packets of light, echoing the real photoelectric effect, where light was first shown to
            behave as discrete particles rather than a continuous wave. Enough accumulated Photons condense
            into Light, which loops back around to boost your Energy generation even further: a small, mostly
            fictional nod to how real stars convert nuclear energy into light that, billions of years later,
            becomes the energy powering... well, everything, including this simulation.`,
        formula: "Growth (approximate): Light += √Photons × Light Multiplier each tick, once Energy ≥ 1e-29 J."
    }
];

const revealed = {};

function renderCard(el, entry) {
    el.innerHTML = `
        <h3>${entry.title}</h3>
        <p class="info-body">${entry.body}</p>
        <div class="info-formula">${entry.formula}</div>
    `;
}

// Call periodically (e.g. from the game loop). Swaps in the real lore text and
// fades a card from its locked state to unlocked the moment its currency unlocks.
export function checkInfoUnlocks() {
    infoEntries.forEach((entry) => {
        const el = document.getElementById(entry.id);
        if (!el) return;

        const unlocked = Boolean(entry.isUnlocked());

        if (unlocked && !revealed[entry.id]) {
            revealed[entry.id] = true;
            renderCard(el, entry);
            el.classList.remove("locked");

            // Force a reflow so the browser registers the "locked" state before
            // we flip to "unlocked" - otherwise the transition can get skipped.
            void el.offsetWidth;

            el.classList.add("unlocked");
        }
    });
}
