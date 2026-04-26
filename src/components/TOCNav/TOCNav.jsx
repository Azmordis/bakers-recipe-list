import { useEffect } from 'react';
import { SECTIONS } from '../../data/sections.js';
import styles from './TOCNav.module.css';

// Hamburger drawer that lists every section as a vertical link.
// Visibility is controlled by the parent (App) via `open` + `onClose`.
export default function TOCNav({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleClick = (e, id) => {
    e.preventDefault();
    onClose();
    // Defer the scroll so the drawer can close + body unfreeze first.
    // Smooth scroll comes from `html { scroll-behavior: smooth }` in globals.css.
    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ block: 'start' });
      history.replaceState(null, '', `#${id}`);
    }, 50);
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <nav
        className={styles.drawer}
        onClick={(e) => e.stopPropagation()}
        aria-label="Recipe sections"
      >
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>Sections</span>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close sections menu"
          >
            &#x2715;
          </button>
        </div>
        <ul className={styles.list}>
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={section.review ? `${styles.link} ${styles.review}` : styles.link}
                onClick={(e) => handleClick(e, section.id)}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
