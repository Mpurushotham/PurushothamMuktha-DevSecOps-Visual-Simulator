import React from 'react';

interface Props {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

const SimpleTooltip: React.FC<Props> = ({ content, children, side = 'right' }) => {
  return (
    <div className="relative group flex items-center">
      {children}
      <div className={`
        absolute z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200
        bg-slate-900 text-slate-200 text-xs px-3 py-2 rounded shadow-xl border border-slate-700 w-48 text-center
        ${side === 'right' ? 'left-full ml-2' : ''}
        ${side === 'left' ? 'right-full mr-2' : ''}
        ${side === 'top' ? 'bottom-full mb-2' : ''}
        ${side === 'bottom' ? 'top-full mt-2' : ''}
      `}>
        {content}
        {/* Triangle Arrow */}
        <div className={`
            absolute w-2 h-2 bg-slate-900 border-l border-b border-slate-700 transform rotate-45
            ${side === 'right' ? 'top-1/2 -left-1 -translate-y-1/2' : ''}
        `}></div>
      </div>
    </div>
  );
};

export default SimpleTooltip;