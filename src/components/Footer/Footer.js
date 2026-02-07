import React from 'react';
import { Link } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__grid">
          <div className="footer__section">
            <h4 className="footer__title">Playwright & TS Academy</h4>
            <p className="footer__desc">
              Your complete guide to mastering test automation with Playwright and TypeScript.
              From basics to enterprise-level patterns.
            </p>
          </div>

          <div className="footer__section">
            <h4 className="footer__title">Pages</h4>
            <div className="footer__links">
              <Link to="/" className="footer__link">Home</Link>
              <Link to="/playwright" className="footer__link">Playwright Basics</Link>
              <Link to="/typescript" className="footer__link">TypeScript Basics</Link>
              <Link to="/pom" className="footer__link">Page Object Model</Link>
            </div>
          </div>

          <div className="footer__section">
            <h4 className="footer__title">Resources</h4>
            <div className="footer__links">
              <a href="https://playwright.dev/" target="_blank" rel="noopener noreferrer" className="footer__link">
                Playwright Docs <FiExternalLink size={12} />
              </a>
              <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer" className="footer__link">
                TypeScript Docs <FiExternalLink size={12} />
              </a>
              <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" className="footer__link">
                Node.js <FiExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} Playwright & TS Academy. Built for the test automation community.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
