const STORAGE_KEY = "RealityCascadeSettings";

const defaultSettings = {
    theme: "default",
    reduceMotion: false
};

function loadSettings() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { ...defaultSettings };
        return { ...defaultSettings, ...JSON.parse(raw) };
    } catch {
        return { ...defaultSettings };
    }
}

function persistSettings() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSettings));
    } catch {
        // Ignore storage errors (e.g. private browsing quota) - theme just won't persist.
    }
}

let currentSettings = loadSettings();

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;

    document.querySelectorAll(".theme-swatch").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.theme === theme);
    });
}

function applyReduceMotion(enabled) {
    document.documentElement.classList.toggle("reduce-motion", enabled);
}

// Read by feedback.js before playing any purchase/shake/reset animation.
export function isReducedMotion() {
    return Boolean(currentSettings.reduceMotion);
}

// Call once at startup, after the Settings tab's DOM exists.
export function initSettings() {
    applyTheme(currentSettings.theme);
    applyReduceMotion(currentSettings.reduceMotion);

    document.querySelectorAll(".theme-swatch").forEach((btn) => {
        btn.addEventListener("click", () => {
            currentSettings.theme = btn.dataset.theme;
            applyTheme(currentSettings.theme);
            persistSettings();
        });
    });

    const reduceMotionToggle = document.getElementById("reduceMotionToggle");
    if (reduceMotionToggle) {
        reduceMotionToggle.checked = currentSettings.reduceMotion;
        reduceMotionToggle.addEventListener("change", (event) => {
            currentSettings.reduceMotion = event.target.checked;
            applyReduceMotion(currentSettings.reduceMotion);
            persistSettings();
        });
    }
}
