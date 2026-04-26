import { SECTIONS } from '../../data/sections.js';
import styles from './TOCNav.module.css';

export default function TOCNav() {
  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className={styles.tocWrap}>
      {SECTIONS.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={styles.pill}
          onClick={(e) => handleClick(e, section.id)}
        >
          {section.label}
        </a>
      ))}
    </div>
  );
}
