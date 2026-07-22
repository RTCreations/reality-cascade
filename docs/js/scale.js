import Decimal from "../libraries/break_eternity.js-2.1.3/break_eternity.esm.js";

export function getScale(key, level = 0) {
    const levelValue = new Decimal(level);

    switch (key) {
        case "primonBtn":
            if (levelValue.lt(10)) {
                return {
                    Multi: new Decimal(1.7)
                };
            } else if (levelValue.lt(25)) {
                return {
                    Multi: new Decimal(2)
                };
            } else if (levelValue.lt(50)) {
                return {
                    Multi: new Decimal(4)
                };
            } else if (levelValue.lt(100)) {
                return {
                    Multi: new Decimal(18)
                };
            }
            return {
                Multi: new Decimal(2.6)
            };

        case "energyAmplifier":
            if (levelValue.lt(10)) {
                return {
                    Multi: new Decimal(2)
                };
            } else if (levelValue.lt(20)) {
                return {
                    Multi: new Decimal(3)
                };
            } else if (levelValue.lt(30)) {
                return {
                    Multi: new Decimal(4)
                };
            } else if (levelValue.lt(40)) {
                return {
                    Multi: new Decimal(5)
                };
            }
            return {
                Multi: new Decimal(6)
            };

        case "energyBoost":
            if (levelValue.lt(10)) {
                return {
                    Multi: new Decimal(4)
                };
            } else if (levelValue.lt(20)) {
                return {
                    Multi: new Decimal(5)
                };
            } else if (levelValue.lt(30)) {
                return {
                    Multi: new Decimal(6)
                };
            } else if (levelValue.lt(40)) {
                return {
                    Multi: new Decimal(7)
                };
            } 
            return {
                Multi: new Decimal(8)
            };

        case "energyAccelerate":
            return {
                Multi: new Decimal(15),
                Pow: new Decimal(1),
                Max: 50
            };

        default:
            return {
                Multi: new Decimal(1),
                Pow: new Decimal(1),
                Max: Infinity
            };
    }
}

export const scale = {
    primonBtn: getScale("primonBtn"),
    energyAmplifier: getScale("energyAmplifier"),
    energyBoost: getScale("energyBoost"),
    energyAccelerate: getScale("energyAccelerate")
};
