const STORAGE_KEY = "RealityCascadeSettings";

const defaultSettings = {
    theme: "default",
    reduceMotion: false,
    notation: "scientific"
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

function applyNotation(mode) {
    document.documentElement.dataset.notation = mode;

    const notationSelect = document.getElementById("notationSelect");
    if (notationSelect) {
        notationSelect.value = mode === "short" ? "short" : "scientific";
    }
}

// Read by feedback.js before playing any purchase/shake/reset animation.
export function isReducedMotion() {
    return Boolean(currentSettings.reduceMotion);
}

export function getNotationMode() {
    return currentSettings.notation === "short" ? "short" : "scientific";
}

// Call once at startup, after the Settings tab's DOM exists.
export function initSettings() {
    applyTheme(currentSettings.theme);
    applyReduceMotion(currentSettings.reduceMotion);
    applyNotation(currentSettings.notation);

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

    const notationSelect = document.getElementById("notationSelect");
    if (notationSelect) {
        notationSelect.value = currentSettings.notation === "short" ? "short" : "scientific";
        notationSelect.addEventListener("change", (event) => {
            currentSettings.notation = event.target.value;
            applyNotation(currentSettings.notation);
            persistSettings();
        });
    }
}
