import RecipeRow from '../RecipeRow/RecipeRow.jsx';
import styles from './SectionBlock.module.css';

export default function SectionBlock({ section, recipes, onViewRecipe, hideSource }) {
  const headerClass = section.review
    ? `${styles.sectionHeader} ${styles.review}`
    : styles.sectionHeader;

  return (
    <div className={styles.sectionBlock} id={section.id}>
      <div className={headerClass}>{section.label}</div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: '40%' }}>Recipe</th>
            <th>Tags</th>
            {!hideSource && <th style={{ width: '100px' }}>Source</th>}
            <th style={{ width: '60px' }}></th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe, i) => (
            <RecipeRow
              key={`${section.id}-${i}`}
              recipe={recipe}
              onViewRecipe={onViewRecipe}
              hideSource={hideSource}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
