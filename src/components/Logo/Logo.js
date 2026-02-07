import React from 'react';
import './Logo.css';

function Logo({ size = 'default' }) {
  return (
    <div className={`logo logo--${size}`}>
      <svg className="logo__icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Playwright mask symbol */}
        <circle cx="24" cy="24" r="22" fill="url(#logoGradient)" opacity="0.1" />
        <circle cx="24" cy="24" r="22" stroke="url(#logoGradient)" strokeWidth="1.5" opacity="0.5" />

        {/* Stylized P for Playwright */}
        <path
          d="M16 12L16 36M16 12L28 12C31.3137 12 34 14.6863 34 18V18C34 21.3137 31.3137 24 28 24L16 24"
          stroke="#34d399"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Play triangle */}
        <path
          d="M26 28L34 33L26 38V28Z"
          fill="#3b82f6"
          opacity="0.8"
        />

        {/* TS badge */}
        <rect x="30" y="6" width="16" height="12" rx="3" fill="#3b82f6" />
        <text x="38" y="14.5" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="Inter, sans-serif">TS</text>

        <defs>
          <linearGradient id="logoGradient" x1="0" y1="0" x2="48" y2="48">
            <stop stopColor="#34d399" />
            <stop offset="1" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="logo__text">
        <span className="logo__title">
          <span className="logo__pw">Playwright</span>
          <span className="logo__amp">&</span>
          <span className="logo__ts">TS</span>
        </span>
        <span className="logo__subtitle">Academy</span>
      </div>
    </div>
  );
}

export default Logo;
