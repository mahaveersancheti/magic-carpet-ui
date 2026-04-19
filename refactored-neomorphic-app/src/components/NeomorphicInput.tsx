import React from 'react';

interface NeomorphicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const NeomorphicInput: React.FC<NeomorphicInputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-xs font-bold font-sora uppercase tracking-[3px] text-[#777] ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777]
              group-focus-within:text-[#C1272D] transition-colors"
          >
            {icon}
          </div>
        )}
        <input
          className={`
            w-full py-3 px-4 rounded-neo neo-inset bg-transparent outline-none
            font-dm text-sm text-[#1A1A1A] placeholder:text-[#aaa]
            transition-all duration-200
            ${icon ? 'pl-11' : ''}
            ${error ? 'text-[#C1272D] placeholder:text-[#C1272D]/50' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <span className="text-[10px] text-[#C1272D] ml-1 font-bold font-sora uppercase tracking-wider">
          {error}
        </span>
      )}
    </div>
  );
};

export default React.memo(NeomorphicInput);
