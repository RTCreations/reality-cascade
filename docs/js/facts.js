import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";
import { formatE } from "./main.js";
import { formatF } from "./main.js";
import { showToast } from "./notifications.js";

const planck = new Decimal(6.626e-34);
const infrared = new Decimal(1.987e-19);
const erg = new Decimal(1e-7);

// Ordered lowest threshold -> highest threshold
const factTiers = [
    {
        id: "planck",
        threshold: planck,
        text: (e) => "You have " + formatE(e) + "J, which is enough energy to power " + formatF(e.div(planck)) + " photons with a frequency of 1Hz!"
    },
    {
        id: "infrared",
        threshold: infrared,
        text: (e) => "You have " + formatE(e) + "J, which is enough energy to power " + formatF(e.div(infrared)) + " infrared light photons that are 1 micrometer!"
    },
    {
        id: "erg",
        threshold: erg,
        text: (e) => "You have " + formatE(e) + "J, which is enough energy to make a fly do " + formatF(e.div(erg)) + " pushups!"
    }
];

function getCurrentTierIndex() {
    const energy = player.energy;

    for (let i = factTiers.length - 1; i >= 0; i--) {
        if (energy.gte(factTiers[i].threshold)) {
            return i;
        }
    }

    return -1;
}

export function getFact() {
    const index = getCurrentTierIndex();
    if (index === -1) return "";

    return factTiers[index].text(player.energy);
}

let lastAnnouncedTier = -1;

// Call this periodically (e.g. from the game loop). Pops up a toast the moment
// the player crosses into a new, higher fact tier — fires once per tier, not every tick.
export function checkFactPopup() {
    const index = getCurrentTierIndex();

    if (index > lastAnnouncedTier) {
        lastAnnouncedTier = index;

        if (index !== -1) {
            showToast({
                title: "Fun Fact",
                message: factTiers[index].text(player.energy),
                variant: "fact"
            });
        }
    }
}
