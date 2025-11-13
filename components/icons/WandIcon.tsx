
import React from 'react';

export const WandIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M15 4V2"/>
    <path d="M15 10V8"/>
    <path d="M12.5 7.5 14 6"/>
    <path d="M12.5 13.5 14 15"/>
    <path d="m22 2-3 3"/>
    <path d="M10.4 3.6 3.6 10.4c-1.3 1.3-1.3 3.4 0 4.7l.7.7c1.3 1.3 3.4 1.3 4.7 0L19.4 5.4"/>
    <path d="m18 11 1 1"/>
    <path d="m20.5 8.5 1 1"/>
    <path d="M7 13H5"/>
    <path d="M11 17H9"/>
  </svg>
);
