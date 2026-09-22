import React from 'react';

export default function AppLogo({ className = 'h-9 w-9', showText = false, textClassName = 'font-bold text-slate-800' }) {
  return (
    <div className="flex items-center gap-2">
      <svg
        viewBox="0 0 64 64"
        className={className}
        role="img"
        aria-label="ComplaintBuddy logo"
      >
        <defs>
          <linearGradient id="complaintbuddy-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="56" height="56" rx="18" fill="url(#complaintbuddy-gradient)" />
        <path
          d="M20 22.5c0-3.3 2.7-6 6-6h12c3.3 0 6 2.7 6 6v13c0 3.3-2.7 6-6 6H29l-9 7v-7h0c-3.3 0-6-2.7-6-6v-13Z"
          fill="#e0f2fe"
          opacity="0.95"
        />
        <path
          d="M23.5 25.5h17M23.5 31h11.5M23.5 36.5h7.5"
          stroke="#1d4ed8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M40 16.5l5.5 5.5L52 14.5"
          stroke="#22c55e"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {showText && <span className={textClassName}>ComplaintBuddy</span>}
    </div>
  );
}
