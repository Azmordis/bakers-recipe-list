import styles from './RecipeRow.module.css';

export default function RecipeRow({ recipe, onViewRecipe, hideSource }) {
  const rowClass = recipe.is_blank ? styles.blankRow : '';
  const tags = recipe.tags?.length ? recipe.tags.join(' ') : '';

  return (
    <tr className={rowClass}>
      <td className={styles.recipeName}>
        {recipe.name}
        {recipe.is_blank && <span className={styles.blankBadge}>coming soon</span>}
      </td>
      <td className={styles.recipeTags}>{tags}</td>
      {!hideSource && (
        <td className={styles.recipeSource}>{recipe.source || ''}</td>
      )}
      <td style={{ textAlign: 'right' }}>
        <button
          type="button"
          className={styles.viewBtn}
          onClick={() => onViewRecipe(recipe)}
        >
          View
        </button>
      </td>
    </tr>
  );
}
