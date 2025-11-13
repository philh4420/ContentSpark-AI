import React from 'react';

export const TikTokIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16.5 6.5a6.5 6.5 0 1 0-8.5-5.5V16a5 5 0 1 0 5 5V6.5a1.5 1.5 0 1 1 3 0V16a1 1 0 1 0 2 0V6.5a6.5 6.5 0 0 0-6.5-6.5z"></path>
  </svg>
);
