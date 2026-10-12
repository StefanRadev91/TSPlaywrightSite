'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { doc, setDoc, getDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FiExternalLink, FiEye } from 'react-icons/fi';

const AGENCY_URL = 'https://www.newwavedevelopement.online/en';

function Footer() {
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    async function trackVisit() {
      const ref = doc(db, 'stats', 'visitors');

      // Only count once per session
      if (!sessionStorage.getItem('visited')) {
        sessionStorage.setItem('visited', '1');
        await setDoc(ref, { count: increment(1) }, { merge: true });
      }

      const snap = await getDoc(ref);
      if (snap.exists()) {
        setVisitorCount(snap.data().count);
      }
    }
    trackVisit();
  }, []);

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
              <Link href="/" className="footer__link">Home</Link>
              <Link href="/playwright" className="footer__link">Playwright Basics</Link>
              <Link href="/typescript" className="footer__link">TypeScript Basics</Link>
              <Link href="/pom" className="footer__link">Page Object Model</Link>
              <Link href="/qa-ci" className="footer__link">QA in CI/CD</Link>
              <Link href="/k6" className="footer__link">K6 Performance</Link>
              <Link href="/postman" className="footer__link">Postman Testing</Link>
              <Link href="/ai-eval" className="footer__link">AI Evaluation</Link>
              <Link href="/news" className="footer__link">QA News</Link>
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
          <a
            href={AGENCY_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Powered by New Wave Web Intelligence"
            className="footer__powered"
          >
            <span className="footer__powered-text">Powered by</span>
            <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
              <rect width="64" height="64" rx="14" fill="#c8ff2e" />
              <text x="32" y="43" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontSize="30" fill="#0a0a0b">NW</text>
            </svg>
          </a>
          {visitorCount !== null && (
            <div className="footer__visitors">
              <FiEye size={13} />
              <span>{visitorCount.toLocaleString()} visitors since launch</span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
