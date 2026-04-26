import styles from './TopBar.module.css';

export default function TopBar() {
  return (
    <div className={styles.topBar}>
      <h1 className={styles.title}>
        Baker's Recipe List
        <small className={styles.subtitle}>· Adam's Kitchen</small>
      </h1>
    </div>
  );
}
