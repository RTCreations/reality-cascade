import { isReducedMotion } from "./settings.js";

function trigger(el, className) {
    if (!el || isReducedMotion()) return;

    // Remove-then-reflow-then-add lets the animation restart even if it's
    // still playing from a rapid previous click, instead of doing nothing.
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);

    el.addEventListener("animationend", () => {
        el.classList.remove(className);
    }, { once: true });
}

// A satisfying little pulse/glow - use on any button after a successful purchase or action.
export function playPulse(el) {
    trigger(el, "purchase-pulse");
}

// A quick shake with a red border flash - use when a purchase/action fails (can't afford it, etc).
export function playShake(el) {
    trigger(el, "shake-denied");
}

// A brief brightness flash across a whole panel - use for big prestige-style resets.
export function playResetFlash(el) {
    trigger(el, "reset-flash");
}
