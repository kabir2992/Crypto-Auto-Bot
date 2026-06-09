const BASE_NAMES = {
  GOLD:        "GOLD",
  GOLDM:       "GOLD MINI",
  GOLDPETAL:   "GOLD PETAL",
  GOLDGUINEA:  "GOLD GUINEA",
  GOLDTEN:     "GOLD TEN",
  SILVER:      "SILVER",
  SILVERM:     "SILVER MINI",
  SILVERMIC:   "SILVER MICRO",
  COPPER:      "COPPER",
  ZINC:        "ZINC",
  ZINCMINI:    "ZINC MINI",
  LEAD:        "LEAD",
  LEADMINI:    "LEAD MINI",
  NICKEL:      "NICKEL",
  ALUMINIUM:   "ALUMINIUM",
  ALUMINI:     "ALUMI MINI",
  CRUDEOIL:    "CRUDE OIL",
  CRUDEOILM:   "CRUDE OIL MINI",
  NATURALGAS:  "NATURAL GAS",
  NATGASMINI:  "NAT GAS MINI",
  COTTON:      "COTTON",
  COTTONOIL:   "COTTON OIL",
  CARDAMOM:    "CARDAMOM",
  MENTHAOIL:   "MENTHA OIL",
  STEELREBAR:  "STEEL REBAR",
  KAPAS:       "KAPAS",
  ELECDMBL:    "ELECTRICITY – MONTHLY BASE LOAD"
};

const MONTH_MAP = {
  JAN:"Jan", FEB:"Feb", MAR:"Mar", APR:"Apr",
  MAY:"May", JUN:"Jun", JUL:"Jul", AUG:"Aug",
  SEP:"Sep", OCT:"Oct", NOV:"Nov", DEC:"Dec",
};

// Longest match first so GOLDPETAL doesn't match GOLD
const BASE_KEYS = Object.keys(BASE_NAMES).sort((a, b) => b.length - a.length);

/**
 * GOLDM26JULFUT → "Gold Mini 26 Jul 26 Future"
 * SILVERMIC30JUN26FUT → "Silver Micro 30 Jun 26 Future"
 */
export function formatSymbol(sym) {
  if (!sym) return "";

  let base = sym;
  let rest = "";

  for (const key of BASE_KEYS) {
    if (sym.startsWith(key)) {
      base = key;
      rest = sym.slice(key.length);
      break;
    }
  }

  const baseName = BASE_NAMES[base] || base;

  // Parse rest: e.g. "26JULFUT", "30JUN26FUT", "05JUN26FUT"
  const match = rest.match(/^(\d+)([A-Z]{3})(\d{2})FUT$/);
  if (match) {
    const [, day, mon, yr] = match;
    const month = MONTH_MAP[mon] || mon;
    return `${baseName} ${day} ${month} ${yr} Future`;
  }

  return sym;
}

/**
 * Returns just the base readable name without expiry
 * GOLDM26JULFUT → "Gold Mini"
 */
export function formatBase(sym) {
  if (!sym) return "";
  for (const key of BASE_KEYS) {
    if (sym.startsWith(key)) return BASE_NAMES[key] || key;
  }
  return sym;
}

/**
 * Extract base symbol key
 * GOLDM26JULFUT → "GOLDM"
 */
export function extractBase(sym) {
  if (!sym) return sym;
  for (const key of BASE_KEYS) {
    if (sym.startsWith(key)) return key;
  }
  return sym;
}