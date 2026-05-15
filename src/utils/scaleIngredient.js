// Shared helper — scales the leading quantity in an ingredient text string.
// Used by RecipeModal (display) and App.jsx (shopping list export).
import { parseIngredient } from './parseIngredient.js';
import { formatQuantity } from './fractions.js';

const LEADING_QTY_RE = /^([\d½¼¾⅓⅔⅛⅜⅝⅞⅕⅖⅗⅘./\s]+)/;

export function scaleIngredientText(text, scale) {
  if (scale === 1) return text;
  const parsed = parseIngredient(text);
  if (!parsed) return text;
  const newQty = parsed.quantity * scale;
  const qStr = formatQuantity(newQty);
  const after = text.replace(LEADING_QTY_RE, '').trimStart();
  return after ? `${qStr} ${after}` : qStr;
}
