import React, { useState, useEffect } from 'react';
import './Navigation.css';

function Navigation({ sections }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="page-nav">
      <div className="page-nav__label">On this page</div>
      <ul className="page-nav__list">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <button
              className={`page-nav__link ${activeId === id ? 'page-nav__link--active' : ''}`}
              onClick={() => handleClick(id)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;
