import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";

let lastUpdate = Date.now();

export function getTime() {
    const now = Date.now();
    const delta = (now - lastUpdate) / 1000; // seconds
    lastUpdate = now;
    console.log("wr")
    player.stats.playtime += delta;

    player.energy = new Decimal(player.energy).plus(new Decimal(player.energyPerSecond).times(delta));
}

export function applyOfflineProgress(seconds) {
    const maxOfflineTime = 60 * 60 * 24 * 14;
    seconds = Math.min(seconds, maxOfflineTime);
    const earned = new Decimal(player.energyPerSecond).times(seconds);
    player.energy = new Decimal(player.energy).plus(earned);

    console.log(`You earned ${earned} energy while away for ` + formatTime(seconds));
}

export function formatTime(seconds) {
    seconds = Math.floor(seconds);

    const YEAR = 31557600; // 365.25d
    const MA = YEAR * 1_000_000;
    const GA = YEAR * 1_000_000_000;

    // Gigaannum (1b years)
    if (seconds >= GA) {
        return `${(seconds / GA).toFixed(2)} Ga`;
    }

    // Megaannum (1m years)
    if (seconds >= MA) {
        return `${(seconds / MA).toFixed(2)} Ma`;
    }

    const years = Math.floor(seconds / YEAR);
    seconds %= YEAR;

    const days = Math.floor(seconds / 86400);
    seconds %= 86400;

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;

    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    const parts = [];

    if (years > 0) parts.push(`${years}y`);
    if (days > 0 || years > 0) parts.push(`${days}d`);
    if (hours > 0 || days > 0 || years > 0) parts.push(`${hours}h`);
    if (minutes > 0 || hours > 0 || days > 0 || years > 0) parts.push(`${minutes}m`);

    parts.push(`${seconds}s`);

    return parts.join(" ");
}
