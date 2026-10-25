'use client';

import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  icon: Icon,
  ...props
}) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium rounded-full transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] select-none min-h-[44px]';

  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary-light focus:ring-primary shadow-sm',
    accent:
      'bg-accent text-primary-dark font-semibold hover:bg-accent-hover focus:ring-accent shadow-sm',
    secondary:
      'bg-slate-100 text-heading hover:bg-slate-200 focus:ring-slate-300',
    outline:
      'border-2 border-slate-300 text-heading hover:bg-slate-50 focus:ring-slate-400',
    danger:
      'bg-danger text-white hover:bg-red-700 focus:ring-danger shadow-sm',
    ghost:
      'text-muted hover:text-heading hover:bg-slate-100/70 focus:ring-slate-300',
  };

  const sizes = {
    sm: 'text-sm px-4 py-2 gap-1.5',
    md: 'text-base px-5 py-2.5 gap-2',
    lg: 'text-lg px-6 py-3.5 gap-2.5',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        isDisabled && 'opacity-60 cursor-not-allowed active:scale-100',
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
