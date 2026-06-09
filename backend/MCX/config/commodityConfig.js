// ============================================================
// MCX COMMODITY CONFIG
// marginPerLot  → INR margin required to trade 1 lot
// pointValue    → INR P&L per ₹1 price move per lot
// lotSize       → units per lot (grams / barrels / kg etc.)
// riskPercent   → % of available balance to risk per trade
// category      → grouping for display / filtering
// ============================================================

module.exports = {

    // ─── BULLION ───────────────────────────────────────────

    GOLD: {
        marginPerLot:  45000,
        pointValue:    10,
        lotSize:       1,
        riskPercent:   2,
        leverage:      5,
        category:      "BULLION"
    },

    GOLDM: {
        marginPerLot:  4500,
        pointValue:    1,
        lotSize:       10,
        riskPercent:   2,
        leverage:      5,
        category:      "BULLION"
    },

    GOLDPETAL: {
        marginPerLot:  800,
        pointValue:    1,
        lotSize:       1,
        riskPercent:   2,
        leverage:      5,
        category:      "BULLION"
    },

    GOLDGUINEA: {
        marginPerLot:  3500,
        pointValue:    8,
        lotSize:       1,
        riskPercent:   2,
        leverage:      5,
        category:      "BULLION"
    },

    SILVER: {
        marginPerLot:  55000,
        pointValue:    30,
        lotSize:       30,
        riskPercent:   2,
        leverage:      5,
        category:      "BULLION"
    },

    SILVERM: {
        marginPerLot:  9000,
        pointValue:    5,
        lotSize:       5,
        riskPercent:   2,
        leverage:      5,
        category:      "BULLION"
    },

    SILVERMIC: {
        marginPerLot:  1800,
        pointValue:    1,
        lotSize:       1,
        riskPercent:   2,
        leverage:      5,
        category:      "BULLION"
    },

    // ─── ENERGY ────────────────────────────────────────────

    CRUDEOIL: {
        marginPerLot:  18000,
        pointValue:    100,
        lotSize:       100,
        riskPercent:   2,
        leverage:      8,
        category:      "ENERGY"
    },

    CRUDEOILM: {
        marginPerLot:  2000,
        pointValue:    10,
        lotSize:       10,
        riskPercent:   2,
        leverage:      8,
        category:      "ENERGY"
    },

    NATURALGAS: {
        marginPerLot:  12000,
        pointValue:    1250,
        lotSize:       1250,
        riskPercent:   2,
        leverage:      8,
        category:      "ENERGY"
    },

    NATGASMINI: {
        marginPerLot:  2500,
        pointValue:    250,
        lotSize:       250,
        riskPercent:   2,
        leverage:      8,
        category:      "ENERGY"
    },

    // ─── BASE METALS ───────────────────────────────────────

    COPPER: {
        marginPerLot:  15000,
        pointValue:    1,
        lotSize:       1,
        riskPercent:   2,
        leverage:      5,
        category:      "METAL"
    },

    ZINC: {
        marginPerLot:  5000,
        pointValue:    1,
        lotSize:       1,
        riskPercent:   2,
        leverage:      5,
        category:      "METAL"
    },

    ZINCMINI: {
        marginPerLot:  1200,
        pointValue:    1,
        lotSize:       1,
        riskPercent:   2,
        leverage:      5,
        category:      "METAL"
    },

    LEAD: {
        marginPerLot:  4500,
        pointValue:    1,
        lotSize:       1,
        riskPercent:   2,
        leverage:      5,
        category:      "METAL"
    },

    LEADMINI: {
        marginPerLot:  1100,
        pointValue:    1,
        lotSize:       1,
        riskPercent:   2,
        leverage:      5,
        category:      "METAL"
    },

    NICKEL: {
        marginPerLot:  8000,
        pointValue:    1,
        lotSize:       1,
        riskPercent:   2,
        leverage:      5,
        category:      "METAL"
    },

    ALUMINIUM: {
        marginPerLot:  4000,
        pointValue:    1,
        lotSize:       1,
        riskPercent:   2,
        leverage:      5,
        category:      "METAL"
    },

    ALUMINI: {
        marginPerLot:  1000,
        pointValue:    1,
        lotSize:       1,
        riskPercent:   2,
        leverage:      5,
        category:      "METAL"
    },

    STEELREBAR: {
        marginPerLot:  3000,
        pointValue:    1,
        lotSize:       1,
        riskPercent:   2,
        leverage:      5,
        category:      "METAL"
    },

    // ─── AGRI ──────────────────────────────────────────────

    COTTON: {
        marginPerLot:  8000,
        pointValue:    1,
        lotSize:       1,
        riskPercent:   1.5,
        leverage:      3,
        category:      "AGRI"
    },

    CARDAMOM: {
        marginPerLot:  5000,
        pointValue:    1,
        lotSize:       1,
        riskPercent:   1.5,
        leverage:      3,
        category:      "AGRI"
    },

    MENTHAOIL: {
        marginPerLot:  4000,
        pointValue:    1,
        lotSize:       1,
        riskPercent:   1.5,
        leverage:      3,
        category:      "AGRI"
    }

};