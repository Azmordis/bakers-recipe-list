import RecipeRow from '../RecipeRow/RecipeRow.jsx';
import styles from './SectionBlock.module.css';

export default function SectionBlock({ section, recipes, onViewRecipe }) {
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
            <th style={{ width: '100px' }}>Source</th>
            <th style={{ width: '60px' }}></th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe) => (
            <RecipeRow
              key={recipe._index}
              recipe={recipe}
              onViewRecipe={onViewRecipe}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
