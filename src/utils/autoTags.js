// Runtime auto-tag derivation.
// Returns tags that aren't already in recipe.tags so there are no duplicates.
//
// Two sources:
//   1. Section → cuisine/type tag (100% reliable, no false positives)
//   2. Ingredient keywords → dietary/protein/characteristic tags
//
// These tags behave exactly like manual tags: they appear in the modal meta
// line, match searches, and populate the tag browser counts.

// Maps a section key to a single cuisine/type tag.
// FOR REVIEW sections carry their underlying type tag (e.g. CURRY → #curry #asian).
const SECTION_TAG_MAP = {
  'AMERICAN':                     ['#american'],
  'MEXICAN':                      ['#mexican'],
  'ASIAN':                        ['#asian'],
  'ITALIAN':                      ['#italian'],
  'MIDDLE EASTERN':               ['#middle-eastern'],
  'BREAKFAST':                    ['#breakfast'],
  'SLOW COOKER':                  ['#slow-cooker'],
  'SOUPS':                        ['#soup'],
  'SANDWICHES':                   ['#sandwich'],
  'SIDES':                        ['#side-dish'],
  'SNACKS':                       ['#snack'],
  'SMOOTHIES':                    ['#smoothie'],
  'BREAD':                        ['#bread'],
  'MARINADES':                    ['#marinade'],
  'SEASONINGS':                   ['#seasoning'],
  'DOUGHS':                       ['#dough'],
  // FOR REVIEW sections — strip prefix before matching
  'CURRY':                        ['#curry', '#asian'],
  'SOUPS-MORE':                   ['#soup'],
  'MARINADES-CHICKEN':            ['#marinade'],
  'MARINADES-BEEF':               ['#marinade'],
  'MARINADES-PORK':               ['#marinade'],
};

// Ingredient substrings that signal #spicy.
const SPICY_NEEDLES = [
  'jalapeño', 'jalapeno', 'habanero', 'serrano', 'cayenne',
  'sriracha', 'ghost pepper', 'thai chili', "bird's eye",
  'crushed red pepper', 'red pepper flakes', 'chili pepper',
  'gochujang', 'gochugaru', 'chile de arbol', 'ancho', 'chipotle',
  'scorpion pepper', 'carolina reaper',
];

// Ingredient substrings for protein tags.
const PROTEIN_RULES = [
  { needles: ['chicken', 'poultry'],                                                   tag: '#chicken' },
  { needles: ['ground beef', 'beef', 'steak', 'brisket', 'chuck', 'short rib'],       tag: '#beef'    },
  { needles: ['pork', 'bacon', 'ham', 'prosciutto', 'pancetta', 'chorizo', 'salami'], tag: '#pork'    },
  { needles: ['sausage'],                                                               tag: '#pork'    },
  { needles: ['salmon', 'tuna', 'cod', 'halibut', 'tilapia', 'mahi', 'fish'],         tag: '#seafood' },
  { needles: ['shrimp', 'scallop', 'crab', 'lobster', 'clam', 'mussel', 'prawn'],    tag: '#seafood' },
  { needles: ['lamb', 'mutton'],                                                       tag: '#lamb'    },
  { needles: ['turkey'],                                                                tag: '#turkey'  },
];

export function getAutoTags(recipe) {
  if (!recipe || recipe.is_blank) return [];

  const result = new Set();

  // ── 1. Section tags ──────────────────────────────────────────────────────
  // Strip the "FOR REVIEW --- " prefix that marks review sections.
  const sectionKey = (recipe.section ?? '').replace(/^FOR REVIEW --- /, '');
  const sectionTags = SECTION_TAG_MAP[sectionKey];
  if (sectionTags) sectionTags.forEach((t) => result.add(t));

  // ── 2. Ingredient-derived tags ───────────────────────────────────────────
  const ingText = recipe.ingredients
    ?.filter((i) => i.type === 'item')
    .map((i) => i.text.toLowerCase())
    .join(' ') ?? '';

  if (SPICY_NEEDLES.some((n) => ingText.includes(n))) result.add('#spicy');

  for (const { needles, tag } of PROTEIN_RULES) {
    if (needles.some((n) => ingText.includes(n))) result.add(tag);
  }

  // ── 3. Remove tags already set manually (dedup) ──────────────────────────
  const manual = new Set(recipe.tags ?? []);
  return [...result].filter((t) => !manual.has(t));
}

// Convenience: returns manual + auto tags merged, deduped.
export function getEffectiveTags(recipe) {
  return [...(recipe?.tags ?? []), ...getAutoTags(recipe)];
}
