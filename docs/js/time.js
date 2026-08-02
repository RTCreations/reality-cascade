import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";
import { formatE } from "./main.js"

let playtimeLastUpdate = Date.now();
let energyLastUpdate = Date.now();
let lightLastUpdate = Date.now();
let offlineNoticeTimer = null;
let offlineNoticeInterval = null;
let offlineNoticeSecondsRemaining = 10;

function hideOfflineProgressNotice() {
    const notice = document.getElementById("offline-progress");
    const countdown = document.getElementById("offline-progress-countdown");

    if (notice) {
        notice.classList.remove("visible");
    }

    if (offlineNoticeTimer) {
        clearTimeout(offlineNoticeTimer);
        offlineNoticeTimer = null;
    }

    if (offlineNoticeInterval) {
        clearInterval(offlineNoticeInterval);
        offlineNoticeInterval = null;
    }

    if (countdown) {
        countdown.textContent = "Closing in 10s";
    }
}

function showOfflineProgressNotice(seconds) {
    const notice = document.getElementById("offline-progress");
    const message = document.getElementById("offline-progress-message");
    const countdown = document.getElementById("offline-progress-countdown");
    
    const primonsEarned = new Decimal(player.primonsPerSecond).mul(new Decimal(seconds));
    player.primon = new Decimal(player.primon).plus(primonsEarned);
    player.stats.playtime += seconds;

    if (player.primon.gt(player.stats.highestPrimon)) {
        player.stats.highestPrimon = player.primon;
    }
    
    if (!notice || !message || !countdown) {
        return;
    }

    hideOfflineProgressNotice();

    message.textContent = `You earned ${formatE(primonsEarned.toString())} primons while away for ${formatTime(seconds)}!`;
    offlineNoticeSecondsRemaining = 10;
    countdown.textContent = "Closing in 10s";
    notice.classList.add("visible");

    offlineNoticeInterval = window.setInterval(() => {
        offlineNoticeSecondsRemaining -= 1;

        if (offlineNoticeSecondsRemaining <= 0) {
            hideOfflineProgressNotice();
            return;
        }

        countdown.textContent = `Closing in ${offlineNoticeSecondsRemaining}s`;
    }, 1000);

    offlineNoticeTimer = window.setTimeout(() => {
        hideOfflineProgressNotice();
    }, 10000);
}

const closeOfflineProgressButton = document.getElementById("offline-progress-close");

if (closeOfflineProgressButton) {
    closeOfflineProgressButton.addEventListener("click", hideOfflineProgressNotice);
}

export function getPlaytime() {
    const now = Date.now();
    const delta = (now - playtimeLastUpdate) / 1000; // seconds
    playtimeLastUpdate = now;

    player.stats.playtime += delta;
}

export function getPrimonTime() {
    player.primon = new Decimal(player.primon).plus(player.primonsPerSecond);

    if (player.primon.gt(player.stats.highestPrimon)) {
        player.stats.highestPrimon = player.primon;
    }
}

export function getEnergyTime() {
    const now = Date.now();
    const delta = (now - energyLastUpdate) / 1000;
    energyLastUpdate = now;

    const energyGain = player.energyPerSecond.mul(player.light.pow(1.5)).mul(delta);
    player.energy = new Decimal(player.energy).plus(energyGain);

    if (player.energy.gt(player.stats.highestEnergy)) {
        player.stats.highestEnergy = player.energy;
    }
}

export function getLightTime() {
    const now = Date.now();
    const delta = (now - lightLastUpdate) / 1000; // seconds
    lightLastUpdate = now;

    const photonThreshold = new Decimal("1e-29");
    const photonBaseRate = new Decimal("1").mul(player.photonsMultiplier);

    if (player.energy.gte(photonThreshold)) {
        if (player.photonsPerSecond.lte(0)) {
            player.photonsPerSecond = photonBaseRate;
        }

        player.photons = new Decimal(player.photons).plus(new Decimal(player.photonsPerSecond).mul(delta));
        const lightRate = new Decimal(player.photons).sqrt().mul(player.lightMultiplier);
        player.lightPerSecond = lightRate;
        player.light = new Decimal(player.light).plus(new Decimal(player.lightPerSecond).mul(delta));
    }
}

export function applyOfflineProgress(seconds) {
    const maxOfflineTime = 60 * 60 * 24 * 14;
    seconds = Math.min(seconds, maxOfflineTime);

    if (seconds > 0) {
        showOfflineProgressNotice(seconds);
    }
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
