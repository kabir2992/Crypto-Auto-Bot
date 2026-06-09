const mappings =
[
    "GOLDGUINEA",
    "GOLDPETAL",
    "GOLDTEN",
    "SILVERMIC",
    "NATURALGAS",
    "NATGASMINI",
    "CRUDEOILM",
    "CRUDEOIL",
    "LEADMINI",
    "STEELREBAR",
    "COTTONOIL",
    "CARDAMOM",
    "MENTHAOIL",
    "ALUMINIUM",
    "ALUMINI",
    "SILVERM",
    "SILVER",
    "COPPER",
    "NICKEL",
    "KAPAS",
    "COTTON",
    "LEAD",
    "ZINC",
    "GOLDM",
    "GOLD"
];

module.exports = (symbol) =>
{
    return mappings.find(
        commodity =>
        symbol.startsWith(commodity)
    ) || symbol;
};