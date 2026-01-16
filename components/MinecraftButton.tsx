import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'disabled';
}

export const MinecraftButton: React.FC<Props> = ({ children, variant = 'default', className = '', ...props }) => {
  const isDiabled = variant === 'disabled' || props.disabled;
  
  return (
    <button
      {...props}
      className={`
        relative font-pixel text-xl px-4 py-2 border-2 
        transition-all duration-75 active:scale-95
        ${isDiabled 
          ? 'bg-mc-panelDark text-gray-500 border-gray-600 cursor-not-allowed' 
          : 'bg-[#7E7E7E] hover:bg-[#8f8f8f] text-white border-black border-b-4 border-r-4 border-t-2 border-l-2 shadow-[inset_2px_2px_0px_#C6C6C6,inset_-2px_-2px_0px_#555555]'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};
