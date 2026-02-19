import { motion } from 'framer-motion';

export default function Loader({ size = 'md', text = '' }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <motion.div
        className={`${sizes[size]} border-2 border-[var(--border-secondary)] border-t-primary-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      {text && <p className="text-sm text-hint">{text}</p>}
    </div>
  );
}
