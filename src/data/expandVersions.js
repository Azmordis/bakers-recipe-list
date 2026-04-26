// Splits a recipe whose ingredients/instructions contain { type: "section" }
// markers into one recipe per version, so each version gets its own table row
// and View button. Recipes without version markers pass through unchanged.

function splitByVersion(arr, textField) {
  if (!arr || arr.length === 0) return [];
  const versions = [];
  let current = null;
  arr.forEach((item) => {
    if (item.type === 'section') {
      current = { label: item[textField], items: [] };
      versions.push(current);
    } else {
      if (!current) {
        current = { label: '', items: [] };
        versions.push(current);
      }
      current.items.push(item);
    }
  });
  return versions;
}

export function expandVersionedRecipe(recipe) {
  const ingHasSection = recipe.ingredients?.some((i) => i.type === 'section');
  const stepHasSection = recipe.instructions?.some((s) => s.type === 'section');
  if (!ingHasSection && !stepHasSection) return [recipe];

  const ingVersions = splitByVersion(recipe.ingredients, 'text');
  const stepVersions = splitByVersion(recipe.instructions, 'step');
  const labels = (ingHasSection ? ingVersions : stepVersions).map((v) => v.label);

  return labels.map((label, i) => {
    const sourceFromLabel = label.replace(/^Version\s*\d+\s*[—\-]\s*/i, '').trim();
    const displayName = sourceFromLabel
      ? `${recipe.name} (${sourceFromLabel})`
      : recipe.name;
    return {
      ...recipe,
      name: displayName,
      source: sourceFromLabel || recipe.source,
      ingredients: ingVersions[i]?.items || [],
      instructions: stepVersions[i]?.items || [],
    };
  });
}
