import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

import { player } from "./player.js";
import { formatE } from "./main.js";

let planck = new Decimal(6.626e-34);
let infrared = new Decimal(1.987e-19);
let erg = new Decimal(1e-7);

export function getFact() {
    if (player.energy.gte(erg)) {
        return "You have " + formatE(player.energy) + "J, which is enough energy to make a fly do " + formatE(player.energy.div(erg)) + " pushups!";
    } else if (player.energy.gte(infrared)) {
        return "You have " + formatE(player.energy) + "J, which is enough energy to power " + formatE(player.energy.div(infrared)) + " infrared light photons that are 1 micrometer!";
    } else if (player.energy.gte(planck)) {
        return "You have " + formatE(player.energy) + "J, which is enough energy to power " + formatE(player.energy.div(planck)) + " photons with a frequency of 1Hz!";
    } 
}