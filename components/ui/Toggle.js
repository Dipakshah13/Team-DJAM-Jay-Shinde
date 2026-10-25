'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';

export function Toggle({ enabled, onChange, label, className = '' }) {
  return (
    <label className={clsx('inline-flex items-center gap-3 cursor-pointer select-none', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={clsx(
          'relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          enabled ? 'bg-verified' : 'bg-slate-300'
        )}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={clsx(
            'pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-md',
            enabled ? 'translate-x-6' : 'translate-x-0'
          )}
        />
      </button>
      {label && <span className="text-sm font-medium text-heading">{label}</span>}
    </label>
  );
}
