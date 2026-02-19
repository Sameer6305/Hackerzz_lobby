export default function Badge({ children, variant = 'default', className = '' }) {
  const styles = {
    default: 'surface-elevated text-label',
    primary: 'bg-primary-100 text-primary-700 dark:bg-indigo-500/20 dark:text-indigo-400',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    danger: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}
