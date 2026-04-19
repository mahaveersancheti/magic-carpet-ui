import React from 'react';

interface NeomorphicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'brand';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const NeomorphicButton: React.FC<NeomorphicButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const base =
    'neo-transition neo-btn font-sora font-bold tracking-wide rounded-neo flex items-center justify-center gap-2 cursor-pointer border-none outline-none';

  const widthStyles = fullWidth ? 'w-full' : 'w-fit';

  const sizeStyles: Record<string, string> = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  /** Uses Magic Carpet brand palette from index.css tokens */
  const variantStyles: Record<string, string> = {
    // Red gradient CTA — primary brand action
    brand:
      'text-white'
      + ' bg-gradient-to-br from-[#C1272D] to-[#F7941D]'
      + ' shadow-[3px_3px_10px_rgba(193,39,45,0.35)]'
      + ' hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(193,39,45,0.45)]',

    // Raised neomorphic light — accent colour text
    primary:
      'text-[#C1272D] neo-outset hover:text-[#8B1A1E] hover:-translate-y-0.5',

    // Neutral raised
    secondary:
      'text-[#1A1A1A] neo-outset hover:opacity-80 hover:-translate-y-0.5',

    // Danger / destructive — red text
    danger:
      'text-[#C1272D] neo-outset hover:text-[#8B1A1E]',

    // Flat / ghost — no shadow
    ghost:
      'text-[#777] hover:text-[#1A1A1A]',
  };

  return (
    <button
      className={`${base} ${widthStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default React.memo(NeomorphicButton);
