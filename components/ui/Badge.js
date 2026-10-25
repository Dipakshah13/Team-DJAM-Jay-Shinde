'use client';

import clsx from 'clsx';
import { ShieldCheck, Handshake, Sparkles, CheckCircle2 } from 'lucide-react';

export function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  icon = true,
  onClick,
}) {
  const variants = {
    verified: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    vouched: 'bg-blue-50 text-blue-700 border border-blue-200/80',
    new: 'bg-slate-100 text-slate-700 border border-slate-200/80',
    accent: 'bg-amber-50 text-amber-800 border border-amber-200/80',
    danger: 'bg-red-50 text-red-700 border border-red-200/80',
    sample: 'bg-slate-100/90 text-slate-600 border border-slate-300/80 text-[11px] font-medium tracking-wide uppercase',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200/80',
  };

  const sizes = {
    xs: 'text-[11px] px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
  };

  const icons = {
    verified: ShieldCheck,
    vouched: Handshake,
    new: Sparkles,
    accent: CheckCircle2,
  };

  const IconComponent = icon && icons[variant];

  return (
    <span
      onClick={onClick}
      className={clsx(
        'inline-flex items-center font-medium rounded-full select-none',
        variants[variant] || variants.neutral,
        sizes[size] || sizes.sm,
        onClick && 'cursor-pointer hover:opacity-90 active:scale-95',
        className
      )}
    >
      {IconComponent && <IconComponent className="w-3.5 h-3.5 flex-shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
