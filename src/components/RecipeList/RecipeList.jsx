import { useMemo } from 'react';
import recipes from '../../data/recipes.json';
import { SECTIONS } from '../../data/sections.js';
import { expandVersionedRecipe } from '../../data/expandVersions.js';
import SectionBlock from '../SectionBlock/SectionBlock.jsx';

export default function RecipeList({ onViewRecipe }) {
  const recipesBySection = useMemo(() => {
    const map = new Map();
    recipes.forEach((recipe) => {
      if (!map.has(recipe.section)) map.set(recipe.section, []);
      map.get(recipe.section).push(recipe);
    });
    return map;
  }, []);

  return (
    <main>
      {SECTIONS.map((section) => {
        const raw = recipesBySection.get(section.key) || [];
        if (raw.length === 0) return null;
        const displayed = section.review
          ? raw.flatMap(expandVersionedRecipe)
          : raw;
        return (
          <SectionBlock
            key={section.id}
            section={section}
            recipes={displayed}
            onViewRecipe={onViewRecipe}
            hideSource={section.review}
          />
        );
      })}
    </main>
  );
}
