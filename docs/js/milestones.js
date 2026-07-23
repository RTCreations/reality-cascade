import { player } from "./player.js";
import { showToast } from "./notifications.js";

// Fires once each time primon crosses a new multiple-of-10 order of magnitude,
// e.g. 1e-100 -> 1e-90 -> 1e-80 ..
const MILESTONE_STEP = 10;

let lastMilestone = null;

export function checkPrimonMilestone() {
    if (player.primon.lte(0)) return;

    const magnitude = player.primon.log10().floor().toNumber();
    const milestone = Math.floor(magnitude / MILESTONE_STEP) * MILESTONE_STEP;

    if (lastMilestone === null) {
        // Establish a baseline on first run instead of firing immediately on page load
        lastMilestone = milestone;
        return;
    }

    if (milestone > lastMilestone) {
        lastMilestone = milestone;
        showToast({
            title: "Milestone Reached",
            message: `Your Primons just crossed 1e${milestone}!`,
            variant: "milestone"
        });
    }
}

// Call this whenever primon resets (e.g. resetPrimonForAntiEnergy), so milestones
// can be re-earned each ascension instead of only ever firing once, forever.
export function resetPrimonMilestoneTracking() {
    lastMilestone = null;
}
