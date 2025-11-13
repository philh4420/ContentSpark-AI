
import React from 'react';

export const LightbulbIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M9 18h6"></path>
    <path d="M10 22h4"></path>
    <path d="M12 2a7 7 0 0 0-7 7c0 3.03 1.09 5.4 2.5 6.94.3.33.6.66.86.96.26.3.46.58.59.81.13.23.15.42.15.59v.21c0 .28.22.5.5.5h3c.28 0 .5-.22.5-.5v-.21c0-.17.02-.36.15-.59.13-.23.33-.51.59-.81.26-.3.56-.63.86-.96C17.91 14.4 19 11.03 19 9a7 7 0 0 0-7-7z"></path>
  </svg>
);
