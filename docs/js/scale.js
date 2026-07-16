import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

export function getScale(key, level = 0) {
    const levelValue = new Decimal(level);

    switch (key) {
        case "energyAmplifier":
            if (levelValue.lt(10)) {
                console.log("level < 10");
                return {
                    Multi: new Decimal(2),
                    Pow: new Decimal(1)
                };
            } else if (levelValue.lt(20)) {
                console.log("level < 20");
                return {
                    Multi: new Decimal(3),
                    Pow: new Decimal(1.001)
                };
            } else if (levelValue.lt(30)) {
                console.log("level < 30");
                return {
                    Multi: new Decimal(4),
                    Pow: new Decimal(1.002)
                };
            } else if (levelValue.lt(40)) {
                console.log("level < 40");
                return {
                    Multi: new Decimal(5),
                    Pow: new Decimal(1.003)
                };
            }

        case "energyBoost":
            if (levelValue.lt(10)) {
                console.log("level < 10");
                return {
                    Multi: new Decimal(3),
                    Pow: new Decimal(1)
                };
            } else if (levelValue.lt(20)) {
                console.log("level < 20");
                return {
                    Multi: new Decimal(4),
                    Pow: new Decimal(1.01)
                };
            } else if (levelValue.lt(30)) {
                console.log("level < 30");
                return {
                    Multi: new Decimal(5),
                    Pow: new Decimal(1.015)
                };
            } else if (levelValue.lt(40)) {
                console.log("level < 40");
                return {
                    Multi: new Decimal(6),
                    Pow: new Decimal(1.02)
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
                    Pow: new Decimal(15),
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
