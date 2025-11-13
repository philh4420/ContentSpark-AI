
import React from 'react';

export const HeroSparkle: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 160 160" 
        className={className}
        style={style}
        fill="currentColor"
    >
        <style>
            {`
                @keyframes sparkle-spin {
                    0% { transform: rotate(0deg) scale(0.8); opacity: 0.5; }
                    50% { transform: rotate(180deg) scale(1); opacity: 1; }
                    100% { transform: rotate(360deg) scale(0.8); opacity: 0.5; }
                }
                .sparkle {
                    animation: sparkle-spin 5s linear infinite;
                    animation-delay: var(--delay);
                    transform-origin: center;
                }
            `}
        </style>
        <g className="sparkle">
            <path d="M80 0 L90 70 L160 80 L90 90 L80 160 L70 90 L0 80 L70 70 Z" />
        </g>
    </svg>
);
