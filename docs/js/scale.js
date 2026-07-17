import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

export function getScale(key, level = 0) {
    const levelValue = new Decimal(level);

    switch (key) {
        case "energyAmplifier":
            if (levelValue.lt(10)) {
                console.log("level < 10");
                return {
                    Multi: new Decimal(2)
                };
            } else if (levelValue.lt(20)) {
                console.log("level < 20");
                return {
                    Multi: new Decimal(3)
                };
            } else if (levelValue.lt(30)) {
                console.log("level < 30");
                return {
                    Multi: new Decimal(4)
                };
            } else if (levelValue.lt(40)) {
                console.log("level < 40");
                return {
                    Multi: new Decimal(5)
                };
            } else if (levelValue.lt(50)) {
                console.log("level < 50");
                return {
                    Multi: new Decimal(6)
                };
            }

        case "energyBoost":
            if (levelValue.lt(10)) {
                console.log("level < 10");
                return {
                    Multi: new Decimal(4)
                };
            } else if (levelValue.lt(20)) {
                console.log("level < 20");
                return {
                    Multi: new Decimal(5)
                };
            } else if (levelValue.lt(30)) {
                console.log("level < 30");
                return {
                    Multi: new Decimal(6)
                };
            } else if (levelValue.lt(40)) {
                console.log("level < 40");
                return {
                    Multi: new Decimal(7)
                };
            }

        case "energyAccelerate":
            if (levelValue.lt(25)) {
                return {
                    Multi: new Decimal(15),
                    Pow: new Decimal(1),
                    Max: 50
                };
            } else {
                return {
                    Multi: new Decimal(15),
                    Pow: new Decimal(1),
                    Max: 50
                };
            }
        default:
            return {
                Multi: new Decimal(1),
                Pow: new Decimal(1),
                Max: Infinity
            };
    }
}

export const scale = {
    energyAmplifier: getScale("energyAmplifier"),
    energyBoost: getScale("energyBoost"),
    energyAccelerate: getScale("energyAccelerate")
};
