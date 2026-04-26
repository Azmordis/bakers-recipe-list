import styles from './TopBar.module.css';

export default function TopBar({ onMenuToggle }) {
  return (
    <div className={styles.topBar}>
      <h1 className={styles.title}>
        Baker's Recipe List
        <small className={styles.subtitle}>· Adam's Kitchen</small>
      </h1>
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
  );
}
