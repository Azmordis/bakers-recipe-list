import { useMemo } from 'react';
import recipes from '../../data/recipes.json';
import { SECTIONS } from '../../data/sections.js';
import SectionBlock from '../SectionBlock/SectionBlock.jsx';

export default function RecipeList({ onViewRecipe }) {
  const recipesBySection = useMemo(() => {
    const map = new Map();
    recipes.forEach((recipe, index) => {
      if (!map.has(recipe.section)) map.set(recipe.section, []);
      map.get(recipe.section).push({ ...recipe, _index: index });
    });
    return map;
  }, []);

  return (
    <main>
      {SECTIONS.map((section) => {
        const sectionRecipes = recipesBySection.get(section.key) || [];
        if (sectionRecipes.length === 0) return null;
        return (
          <SectionBlock
            key={section.id}
            section={section}
            recipes={sectionRecipes}
            onViewRecipe={onViewRecipe}
          />
        );
      })}
    </main>
  );
}
