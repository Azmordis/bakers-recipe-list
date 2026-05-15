import styles from './TopBar.module.css';

export default function TopBar({ onMenuToggle, onListToggle, listItemCount }) {
  return (
    <div className={styles.topBar}>
      <h1 className={styles.title}>
        Baker's Recipe List
        <small className={styles.subtitle}>· Adam's Kitchen</small>
      </h1>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.listButton}
          onClick={onListToggle}
          aria-label="Shopping list"
          title="Shopping list"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {listItemCount > 0 && (
            <span className={styles.badge} aria-label={`${listItemCount} items`}>{listItemCount}</span>
          )}
        </button>
        <button
          type="button"
          className={styles.menuButton}
          onClick={onMenuToggle}
          aria-label="Open sections menu"
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>
      </div>
    </div>
  );
}
