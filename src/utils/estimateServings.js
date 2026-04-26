// Auto-estimates the serving yield of a recipe from ingredient quantities,
// recipe name, and section. Returns { servings: number, basis: string } or null.
//
// Priority:
//   1. Explicit yield numbers parsed from instruction text
//      ("makes 8 patties", "yields 6", "serves 4")
//   2. Primary protein weight from ingredients
//      (1 lb → 4, 2 lb → 6-8, etc.)
//   3. Recipe section defaults
//
// Returns null for blank recipes, Seasonings, Doughs, or anything else
// where a serving estimate isn't meaningful.

const SECTIONS_NO_SERVINGS = new Set(['SEASONINGS', 'DOUGHS']);

const SECTION_DEFAULTS = {
  'BREAKFAST': 2,
  'SLOW COOKER': 7,
  'AMERICAN': 4,
  'MEXICAN': 4,
  'ASIAN': 4,
  'ITALIAN': 4,
  'MIDDLE EASTERN': 4,
  'SANDWICHES': 2,
  'SIDES': 5,
  'SNACKS': 12,
  'SOUPS': 5,
  'MARINADES': 4,
  'SMOOTHIES': 1,
  'BREAD': 12,
  'FOR REVIEW --- CURRY': 4,
  'FOR REVIEW --- SOUPS': 5,
  'FOR REVIEW - SOUPS': 5,
  'FOR REVIEW - MARINADES - CHICKEN': 4,
  'FOR REVIEW - MARINADES - BEEF': 4,
  'FOR REVIEW - MARINADES - PORK': 4,
};

const PROTEIN_KEYWORDS = [
  'pork', 'beef', 'chicken', 'turkey', 'lamb', 'fish', 'salmon',
  'tuna', 'shrimp', 'tofu', 'sausage', 'bacon', 'steak', 'ground',
];

const LIQUID_KEYWORDS = [
  'milk', 'water', 'broth', 'stock', 'juice', 'coconut milk',
  'cream', 'almond milk', 'oat milk', 'soy milk',
];

const GRAIN_KEYWORDS = [
  'oats', 'rice', 'quinoa', 'lentils', 'barley', 'bulgur', 'couscous',
  'pasta', 'noodles',
];

// Convert a quantity token (incl. unicode fractions and mixed numbers) → number.
const UNICODE_FRAC = {
  '½': 0.5, '¼': 0.25, '¾': 0.75,
  '⅓': 1 / 3, '⅔': 2 / 3,
  '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875,
  '⅕': 0.2, '⅖': 0.4, '⅗': 0.6, '⅘': 0.8,
};

function parseQuantity(s) {
  if (!s) return NaN;
  const trimmed = s.trim();
  // Mixed number with unicode: "1½"
  const mixUni = trimmed.match(/^(\d+)([½¼¾⅓⅔⅛⅜⅝⅞⅕⅖⅗⅘])$/);
  if (mixUni) return parseInt(mixUni[1], 10) + UNICODE_FRAC[mixUni[2]];
  // Mixed number with ASCII fraction: "1 1/2"
  const mixAscii = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixAscii) return parseInt(mixAscii[1], 10) + parseInt(mixAscii[2], 10) / parseInt(mixAscii[3], 10);
  // Pure unicode: "½"
  if (UNICODE_FRAC[trimmed]) return UNICODE_FRAC[trimmed];
  // ASCII fraction: "3/4"
  const asciiFrac = trimmed.match(/^(\d+)\/(\d+)$/);
  if (asciiFrac) return parseInt(asciiFrac[1], 10) / parseInt(asciiFrac[2], 10);
  // Decimal or integer: "1", "1.5"
  const num = parseFloat(trimmed);
  if (!isNaN(num)) return num;
  return NaN;
}

// Look for "makes/yields/serves N" in instruction text.
function findExplicitYield(recipe) {
  const all = (recipe.instructions || [])
    .map((s) => `${s?.step || ''} ${s?.detail || ''}`)
    .join(' ');
  const m = all.match(/\b(?:makes?|yields?|serves?)\s+(?:about\s+|approximately\s+|~)?(\d+)\b/i);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n > 0 && n < 50) return n;
  }
  return null;
}

// Look at ingredient text for a primary-protein weight, return total grams (approx).
// Returns null if no protein found.
function findProteinWeight(recipe) {
  for (const ing of recipe.ingredients || []) {
    if (ing.type === 'section') continue;
    const text = (ing.text || '').toLowerCase();
    if (!PROTEIN_KEYWORDS.some((k) => text.includes(k))) continue;
    // Look for "X lb" or "X oz" early in the string
    const lbMatch = text.match(/^([\d./\s½¼¾⅓⅔⅛⅜⅝⅞⅕⅖⅗⅘]+)\s*(?:lb|lbs|pound|pounds)\b/);
    if (lbMatch) {
      const q = parseQuantity(lbMatch[1]);
      if (!isNaN(q)) return q * 453.6; // grams
    }
    const ozMatch = text.match(/^([\d./\s½¼¾⅓⅔⅛⅜⅝⅞⅕⅖⅗⅘]+)\s*(?:oz|ounce|ounces)\b/);
    if (ozMatch) {
      const q = parseQuantity(ozMatch[1]);
      if (!isNaN(q)) return q * 28.35;
    }
  }
  return null;
}

// Per-serving protein weight depends on the dish format. Small bites
// (patties, meatballs, burgers) yield more servings per pound than a
// big slow-cooker pot of pulled pork.
function gramsPerServingForRecipe(recipe) {
  const name = (recipe.name || '').toLowerCase();
  if (/\b(patties?|meatballs?|burgers?|muffins?|bites?|nuggets?|skewers?|wings?)\b/.test(name)) {
    return 55;  // small-bite portion
  }
  if (recipe.section === 'SLOW COOKER') {
    return 150; // big-meal portion
  }
  return 115;   // standard ~4oz cooked protein
}

// Sum up "X cup(s)" amounts for ingredients matching a keyword set.
function sumCupsFor(recipe, keywords) {
  let total = 0;
  for (const ing of recipe.ingredients || []) {
    if (ing.type === 'section') continue;
    const text = (ing.text || '').toLowerCase();
    if (!keywords.some((k) => text.includes(k))) continue;
    // Match leading "QTY cup(s)" — handles "1 cup", "2 ½ cups", "1/2 cup", "¼ cup"
    const m = text.match(/^([\d./\s½¼¾⅓⅔⅛⅜⅝⅞⅕⅖⅗⅘]+)\s*cups?\b/);
    if (!m) continue;
    const q = parseQuantity(m[1].trim());
    if (!isNaN(q) && q > 0) total += q;
  }
  return total;
}

function servingsFromProteinGrams(grams, recipe) {
  const perServing = gramsPerServingForRecipe(recipe);
  const s = Math.round(grams / perServing);
  if (s < 1) return 1;
  if (s > 12) return 12;
  return s;
}

export function estimateServings(recipe) {
  if (!recipe || recipe.is_blank) return null;
  if (SECTIONS_NO_SERVINGS.has(recipe.section)) return null;

  const explicit = findExplicitYield(recipe);
  if (explicit) {
    return { servings: explicit, basis: 'Estimated from recipe text' };
  }

  const proteinGrams = findProteinWeight(recipe);
  if (proteinGrams && proteinGrams >= 100) {
    return {
      servings: servingsFromProteinGrams(proteinGrams, recipe),
      basis: 'Estimated from ingredients',
    };
  }

  // No primary protein — look at total liquid base (oatmeal, soup, smoothie, etc.).
  // ~1.25 cups of liquid per serving for porridge/oatmeal-style; ~1.5 cups for soup.
  const liquidCups = sumCupsFor(recipe, LIQUID_KEYWORDS);
  if (liquidCups >= 3) {
    const perServing = recipe.section?.includes('SOUP') ? 1.5 : 1.25;
    const s = Math.max(2, Math.min(12, Math.round(liquidCups / perServing)));
    return { servings: s, basis: 'Estimated from ingredients' };
  }

  // Grain-heavy recipe with no protein/liquid signal: ~30g dry grain per serving,
  // and 1 cup of dry oats/rice ≈ 180g, so 1 cup ≈ 6 servings.
  const grainCups = sumCupsFor(recipe, GRAIN_KEYWORDS);
  if (grainCups >= 1) {
    const s = Math.max(2, Math.min(12, Math.round(grainCups * 6)));
    return { servings: s, basis: 'Estimated from ingredients' };
  }

  const def = SECTION_DEFAULTS[recipe.section];
  if (def) {
    return { servings: def, basis: 'Estimated from recipe type' };
  }

  return null;
}
