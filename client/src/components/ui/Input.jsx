import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-dark-700">{label}</label>
      )}
      <input
        ref={ref}
        className={`
          w-full px-4 py-2.5 rounded-xl border border-dark-200 bg-white
          text-dark-900 placeholder:text-dark-400
          focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400
          transition-all duration-200
          ${error ? 'border-red-400 focus:ring-red-300' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
