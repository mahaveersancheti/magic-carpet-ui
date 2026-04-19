import React from 'react';

interface NeomorphicCardProps {
  children: React.ReactNode;
  className?: string;
  /** inset = pressed/sunken style; outset = raised (default) */
  inset?: boolean;
  /** top border accent colour matching Magic Carpet brand */
  accent?: 'red' | 'orange' | 'dark' | 'none';
  /** hover lift effect */
  hoverable?: boolean;
}

const NeomorphicCard: React.FC<NeomorphicCardProps> = ({
  children,
  className = '',
  inset = false,
  accent = 'none',
  hoverable = true,
}) => {
  const accentClass: Record<string, string> = {
    red:    'accent-red',
    orange: 'accent-orange',
    dark:   'accent-dark',
    none:   '',
  };

  return (
    <div
      className={[
        'p-5 rounded-neo neo-transition',
        inset ? 'neo-inset' : 'neo-outset',
        accentClass[accent],
        hoverable && !inset
          ? 'hover:-translate-y-0.5 hover:shadow-[4px_4px_12px_rgba(180,181,185,0.85),_-4px_-4px_12px_rgba(255,255,255,0.95)]'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
};

export default React.memo(NeomorphicCard);
