import React from 'react';

interface BackButtonProps {
    onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 text-slate-400 hover:text-white transition-colors duration-300"
            aria-label="Go back"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
        </button>
    );
};

export default BackButton;
