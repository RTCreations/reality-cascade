import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";
import { showToast } from "./notifications.js";

const achievementDefinitions = [
    {
        id: "primon1",
        title: "First Cascade",
        requirement: "Reach 1e-90 Primons",
        reward: "2x Primons",
        unlocked: (p) => p.primon.gte(new Decimal("1e-90")),
    },
    {
        id: "primon2",
        title: "Primon Simulator",
        requirement: "Reach 1e-80 Primons",
        reward: "5x Primons",
        unlocked: (p) => p.primon.gte(new Decimal("1e-80")),
    },
    {
        id: "primon3",
        title: "Not Enough Primons",
        requirement: "Reach 1e-70 Primons",
        reward: "10x Primons",
        unlocked: (p) => p.primon.gte(new Decimal("1e-70")),
    },
    {
        id: "primon4",
        title: "MASSIVE Primons",
        requirement: "Reach 1e-50 Primons",
        reward: "1Kx Primons",
        unlocked: (p) => p.primon.gte(new Decimal("1e-50")),
    },
    {
        id: "antiEnergy1",
        title: "Anti Joules Are Not Real",
        requirement: "Reach 1e-181 Anti Energy",
        reward: "2x Primons, 2x Anti Energy, 2x Energy",
        unlocked: (p) => p.antiEnergy.gte(new Decimal("1e-181")),
    },
    {
        id: "antiEnergy2",
        title: "2e-178 Anti J is Not a Lot",
        requirement: "Reach 2e-178 Anti Energy",
        reward: "2x Anti Energy, 2x Energy",
        unlocked: (p) => p.antiEnergy.gte(new Decimal("2e-178")),
    },
    {
        id: "energy1",
        title: "Primodial Energy",
        requirement: "Reach 1e-185 Energy",
        reward: "3x Energy",
        unlocked: (p) => p.energy.gte(new Decimal("1e-185"))
    },
    {
        id: "energy2",
        title: "BIG Energy",
        requirement: "Reach 1e-165 Energy",
        reward: "1Kx Energy",
        unlocked: (p) => p.energy.gte(new Decimal("1e-165"))
    },
    {
        id: "light1",
        title: "Photon Glow",
        requirement: "Reach 1 Light",
        reward: "Unlock Light",
        unlocked: (p) => p.light.gte(new Decimal(1))
    },
    {
        id: "amplifier",
        title: "Amplified",
        requirement: "Buy 1 Energy Amplifier",
        reward: "Energy gain doubled",
        unlocked: (p) => p.boughtUpgrades.gte(new Decimal(1))
    },
    {
        id: "boost",
        title: "Energy Boost",
        requirement: "Buy 1 Energy Boost",
        reward: "Energy gain boosted",
        unlocked: (p) => p.boughtUpgrades.gte(new Decimal(2))
    }
];

const gridContainer = document.getElementById("achievements-grid");
const tooltip = document.getElementById("achievement-tooltip");

function getAchievementState(def) {
    const saved = Boolean(player.achievements[def.id]);
    return { completed: saved, definition: def };
}

function getTooltipText(def, completed) {
    if (completed) {
        return `Completed: ${def.reward}`;
    }
    return `${def.requirement}\nReward: ${def.reward}`;
}

function createCell(def) {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "achievement-cell";
    cell.dataset.id = def.id;
    cell.innerHTML = `
        <div class="achievement-cell-title">${def.title}</div>
        <div class="achievement-cell-state">${def.reward}</div>
    `;

    cell.addEventListener("mouseenter", (event) => {
        const completed = Boolean(player.achievements[def.id]);
        tooltip.textContent = "";
        tooltip.innerHTML = `<strong>${def.title}</strong><p>${getTooltipText(def, completed).replace(/\n/g, "<br>")}</p>`;
        tooltip.classList.add("visible");
        tooltip.setAttribute("aria-hidden", "false");
        positionTooltip(event.currentTarget);
    });

    cell.addEventListener("mouseleave", () => {
        tooltip.classList.remove("visible");
        tooltip.setAttribute("aria-hidden", "true");
    });

    return cell;
}

function positionTooltip(target) {
    const rect = target.getBoundingClientRect();
    const viewportX = rect.left + rect.width / 2;
    const viewportY = rect.top;

    tooltip.style.left = `${viewportX}px`;
    tooltip.style.top = `${viewportY - 10}px`;
}

export function refreshAchievementsGrid() {
    if (!gridContainer) return;
    gridContainer.innerHTML = "";

    achievementDefinitions.forEach((def) => {
        const cell = createCell(def);
        const completed = Boolean(player.achievements[def.id]);
        if (completed) {
            cell.classList.add("completed");
        }
        gridContainer.appendChild(cell);
    });
}

export function checkAchievements() {
    let changed = false;

    achievementDefinitions.forEach((def) => {
        if (!player.achievements[def.id] && def.unlocked(player)) {
            player.achievements[def.id] = true;

            showToast({
                title: "Achievement Unlocked!",
                message: `${def.title} — ${def.reward}`,
                variant: "achievement"
            });

            if (def.id === "primon1") {
                player.primonAchievementBonus = player.primonAchievementBonus.times(2);
                player.primonsPerSecond = new Decimal(1e-100)
                    .times(player.primonMultiplier)
                    .times(player.primonAchievementBonus);
            }

            if (def.id === "primon2") {
                player.primonAchievementBonus = player.primonAchievementBonus.times(5);
                player.primonsPerSecond = new Decimal(1e-100)
                    .times(player.primonMultiplier)
                    .times(player.primonAchievementBonus);
            }

            if (def.id === "primon3") {
                player.primonAchievementBonus = player.primonAchievementBonus.times(10);
                player.primonsPerSecond = new Decimal(1e-100)
                    .times(player.primonMultiplier)
                    .times(player.primonAchievementBonus);
            }

            if (def.id === "primon4") {
                player.primonAchievementBonus = player.primonAchievementBonus.times(1e3);
                player.primonsPerSecond = new Decimal(1e-100)
                    .times(player.primonMultiplier)
                    .times(player.primonAchievementBonus);
            }

            if (def.id === "antiEnergy1") {
                player.primonAchievementBonus = player.primonAchievementBonus.times(2);
                player.antiEnergyMultiplier = player.antiEnergyMultiplier.times(2);
                player.energyMultiplier = player.energyMultiplier.times(2);
                player.primonsPerSecond = new Decimal(1e-100)
                    .times(player.primonMultiplier)
                    .times(player.primonAchievementBonus);
            }

            if (def.id === "antiEnergy2") {
                player.antiEnergyMultiplier = player.antiEnergyMultiplier.times(2);
                player.energyMultiplier = player.energyMultiplier.times(2);
            }

            if (def.id === "energy1") {
                player.energyMultiplier = player.energyMultiplier.times(3);
            }

            if (def.id === "energy2") {
                player.energyMultiplier = player.energyMultiplier.times(1e3);
            }

            changed = true;
        }
    });

    if (changed) {
        refreshAchievementsGrid();
    }
}

window.addEventListener("load", () => {
    refreshAchievementsGrid();
});
