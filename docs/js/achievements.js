import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";
import { showToast } from "./notifications.js";

const achievementDefinitions = [
    {
        id: "primon1",
        title: "First Cascade",
        requirement: "Reach 1K Primons",
        reward: "2x Primons",
        unlocked: (p) => p.primon.gte(new Decimal("1e3")),
    },
    {
        id: "primon2",
        title: "Primon Simulator",
        requirement: "Reach 10B Primons",
        reward: "5x Primons",
        unlocked: (p) => p.primon.gte(new Decimal("1e10")),
    },
    {
        id: "primon3",
        title: "Not Enough Primons",
        requirement: "Reach 1Qn Primons",
        reward: "10x Primons",
        unlocked: (p) => p.primon.gte(new Decimal("1e18")),
    },
    {
        id: "primon4",
        title: "MASSIVE Primons",
        requirement: "Reach 100Oc Primons",
        reward: "1Kx Primons",
        unlocked: (p) => p.primon.gte(new Decimal("1e26")),
    },
    {
        id: "antiEnergy1",
        title: "Anti Joules Are Not Real",
        requirement: "Reach 100 Anti Energy",
        reward: "2x Primons, 2x Anti Energy, 2x Energy",
        unlocked: (p) => p.antiEnergy.gte(new Decimal("1e2")),
    },
    {
        id: "antiEnergy2",
        title: "200K Anti J is Not a Lot",
        requirement: "Reach 200K Anti Energy",
        reward: "2x Anti Energy, 2x Energy",
        unlocked: (p) => p.antiEnergy.gte(new Decimal("2e5")),
    },
    {
        id: "antiEnergy3",
        title: "2B Anti J is a Lot",
        requirement: "Reach 2B Anti Energy",
        reward: "2x Anti Energy, 5x Primons",
        unlocked: (p) => p.antiEnergy.gte(new Decimal("2e9")),
    },
    {
        id: "energy1",
        title: "Primodial Energy",
        requirement: "Reach 1e-32 Energy",
        reward: "3x Energy",
        unlocked: (p) => p.energy.gte(new Decimal("1e-32"))
    },
    {
        id: "energy2",
        title: "BIG Energy",
        requirement: "Reach 1e-31 Energy",
        reward: "50x Energy",
        unlocked: (p) => p.energy.gte(new Decimal("1e-31"))
    },
    {
        id: "light1",
        title: "Photon Glow",
        requirement: "Reach 1 Light",
        reward: "1.2x Light",
        unlocked: (p) => p.light.gte(new Decimal("1"))
    },
    {
        id: "amplifier",
        title: "Amplified",
        requirement: "Buy 1 Energy Amplifier",
        reward: "2x Energy",
        unlocked: (p) => p.boughtUpgrades.gte(new Decimal(1))
    },
    {
        id: "boost",
        title: "Energy Boost",
        requirement: "Buy 1 Energy Boost",
        reward: "1.67x Energy",
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
                message: `${def.title} > ${def.reward}`,
                variant: "achievement"
            });

            if (def.id === "primon1") {
                player.primonAchievementBonus = player.primonAchievementBonus.mul(2);
                player.primonsPerSecond = new Decimal("1")
                    .mul(player.primonMultiplier)
                    .mul(player.primonAchievementBonus);
            }

            if (def.id === "primon2") {
                player.primonAchievementBonus = player.primonAchievementBonus.mul(5);
                player.primonsPerSecond = new Decimal("1")
                    .mul(player.primonMultiplier)
                    .mul(player.primonAchievementBonus);
            }

            if (def.id === "primon3") {
                player.primonAchievementBonus = player.primonAchievementBonus.mul(10);
                player.primonsPerSecond = new Decimal("1")
                    .mul(player.primonMultiplier)
                    .mul(player.primonAchievementBonus);
            }

            if (def.id === "primon4") {
                player.primonAchievementBonus = player.primonAchievementBonus.mul(1e3);
                player.primonsPerSecond = new Decimal("1")
                    .mul(player.primonMultiplier)
                    .mul(player.primonAchievementBonus);
            }

            if (def.id === "antiEnergy1") {
                player.primonAchievementBonus = player.primonAchievementBonus.mul("2");
                player.antiEnergyMultiplier = player.antiEnergyMultiplier.mul("2");
                player.energyMultiplier = player.energyMultiplier.mul("2");
                player.primonsPerSecond = new Decimal("1")
                    .mul(player.primonMultiplier)
                    .mul(player.primonAchievementBonus);
            }

            if (def.id === "antiEnergy2") {
                player.antiEnergyMultiplier = player.antiEnergyMultiplier.mul("2");
                player.energyMultiplier = player.energyMultiplier.mul("2");
            }

            if (def.id === "antiEnergy3") {
                player.antiEnergyMultiplier = player.antiEnergyMultiplier.mul("2");
                player.primonAchievementBonus = player.primonAchievementBonus.mul("5");
            }

            if (def.id === "energy1") {
                player.energyMultiplier = player.energyMultiplier.mul("3");
            }

            if (def.id === "energy2") {
                player.energyMultiplier = player.energyMultiplier.mul("5e1");
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
