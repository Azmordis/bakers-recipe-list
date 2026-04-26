// Converts a parsed ingredient { quantity, unit, name } to grams.
// Returns a number, or null if the unit isn't convertible (e.g. "each" for
// items where we don't have a per-piece weight estimate for the name).
//
// 1 cup defaults to 240g (water/liquid). For solid ingredients the cup
// weight varies wildly, so CUP_OVERRIDES handles common cases.

const BASE = {
  g: 1,
  kg: 1000,
  oz: 28.35,
  lb: 453.6,
  ml: 1,            // assume liquid density ~1
  l: 1000,
  cup: 240,
  tbsp: 15,
  tsp: 5,
  pinch: 0.5,
  dash: 0.5,
  clove: 5,         // garlic clove ~5g
  slice: 25,        // bread slice ~25g
  can: 400,         // 14oz can ~400g
  jar: 350,
  package: 200,
  bunch: 100,
  stalk: 40,        // celery stalk
  head: 500,        // head of lettuce/cabbage
};

// Per-cup weight overrides for solids (matched against ingredient name substring).
// Order matters — more specific matches first.
const CUP_OVERRIDES = [
  ['brown sugar', 220],
  ['powdered sugar', 120],
  ['confectioners', 120],
  ['peanut butter', 258],
  ['almond butter', 258],
  ['breadcrumbs', 108],
  ['bread crumbs', 108],
  ['panko', 60],
  ['rolled oats', 90],
  ['oats', 90],
  ['cocoa', 85],
  ['flour', 125],
  ['sugar', 200],
  ['butter', 227],
  ['honey', 340],
  ['maple syrup', 320],
  ['rice', 185],
  ['cooked rice', 158],
  ['quinoa', 170],
  ['pasta', 100],
  ['cheese', 113],
  ['parmesan', 100],
  ['shredded cheese', 113],
  ['yogurt', 245],
  ['greek yogurt', 245],
  ['sour cream', 230],
  ['mayonnaise', 220],
  ['mayo', 220],
  ['nuts', 130],
  ['almonds', 144],
  ['walnuts', 117],
  ['pecans', 109],
  ['raisins', 145],
  ['cranberries', 100],
  ['chocolate chips', 175],
  ['cornmeal', 138],
  ['lentils', 200],
  ['beans', 180],
  ['chickpeas', 200],
  ['salsa', 240],
  ['tomato sauce', 245],
  ['tomato paste', 262],
  ['marinara', 245],
  ['broth', 240],
  ['stock', 240],
  ['milk', 240],
  ['cream', 240],
  ['olive oil', 216],
  ['vegetable oil', 216],
  ['oil', 216],
];

// Per-piece weight estimates for "each"-unit items (e.g. "1 egg").
const EACH_OVERRIDES = [
  ['egg', 50],
  ['onion', 110],
  ['garlic clove', 5],
  ['lemon', 60],         // lemon juice ~3 tbsp = 45ml; whole lemon ~58g of usable
  ['lime', 44],
  ['orange', 130],
  ['apple', 180],
  ['banana', 120],
  ['avocado', 150],
  ['tomato', 120],
  ['carrot', 60],
  ['celery stalk', 40],
  ['potato', 200],
  ['bell pepper', 120],
  ['pepper', 30],         // catch-all for chiles, etc.
  ['cucumber', 300],
  ['zucchini', 200],
];

function lookupOverride(name, table) {
  const lower = name.toLowerCase();
  for (const [needle, val] of table) {
    if (lower.includes(needle)) return val;
  }
  return null;
}

export function convertToGrams({ quantity, unit, name }) {
  if (!quantity || quantity <= 0) return null;

  // Cup needs name-based override for accuracy
  if (unit === 'cup') {
    const override = lookupOverride(name, CUP_OVERRIDES);
    return quantity * (override ?? BASE.cup);
  }

  // "each" — only convert if we have a per-piece weight for this name
  if (unit === 'each') {
    const override = lookupOverride(name, EACH_OVERRIDES);
    if (override) return quantity * override;
    return null;
  }

  const base = BASE[unit];
  if (base == null) return null;
  return quantity * base;
}
