import { useEffect } from 'react';
import styles from './RecipeModal.module.css';

function isUrl(str) {
  return typeof str === 'string' && /^https?:\/\//i.test(str);
}

function MetaLine({ recipe }) {
  const tags = recipe.tags?.length ? recipe.tags.join(' ') : '';
  const hasSource = recipe.source && recipe.source !== 'Original';
  return (
    <div className={styles.modalMeta}>
      {tags && <span>{tags}</span>}
      {tags && <span> · </span>}
      {hasSource ? (
        <span>
          Source:{' '}
          {isUrl(recipe.source) ? (
            <a href={recipe.source} target="_blank" rel="noreferrer noopener" className={styles.sourceLink}>
              {recipe.source}
            </a>
          ) : (
            recipe.source
          )}
        </span>
      ) : (
        <span>Original recipe</span>
      )}
    </div>
  );
}

function Ingredients({ items }) {
  if (!items?.length) return null;
  return (
    <>
      <div className={styles.modalSectionTitle}>Ingredients</div>
      <ul className={styles.ingList}>
        {items.map((ing, i) => (
          <li key={i} className={ing.type === 'section' ? styles.ingSection : ''}>
            {ing.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function Instructions({ steps }) {
  if (!steps?.length) return null;
  let stepNum = 0;
  return (
    <>
      <div className={styles.modalSectionTitle}>Instructions</div>
      <div className={styles.stepList}>
        {steps.map((s, i) => {
          if (s.type === 'section') {
            stepNum = 0;
            return (
              <div key={i} className={styles.verHeader}>
                {s.step}
              </div>
            );
          }
          stepNum++;
          return (
            <div key={i} className={styles.stepItem}>
              <div className={styles.stepNum}>{stepNum}</div>
              <div>
                <div className={styles.stepName}>{s.step}</div>
                {s.detail && <div className={styles.stepDetail}>{s.detail}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function RecipeModal({ recipe, onClose }) {
  useEffect(() => {
    if (!recipe) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [recipe, onClose]);

  if (!recipe) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalCard} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className={styles.modalHeader}>
          <div>
            <div id="modal-title" className={styles.modalTitle}>{recipe.name}</div>
            <MetaLine recipe={recipe} />
          </div>
          <button
            type="button"
            className={styles.modalClose}
            onClick={onClose}
            aria-label="Close"
          >
            &#x2715;
          </button>
        </div>
        <div className={styles.modalBody}>
          {recipe.is_blank ? (
            <div className={styles.comingSoon}>🍳 Recipe coming soon — this one is on the list!</div>
          ) : (
            <>
              <Ingredients items={recipe.ingredients} />
              <Instructions steps={recipe.instructions} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
