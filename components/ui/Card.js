'use client';

import clsx from 'clsx';

export function Card({
  children,
  className = '',
  onClick,
  hoverable = false,
  highlight = false,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-3xl p-4 md:p-5 border border-slate-100 shadow-card transition-all duration-200',
        hoverable && 'hover:shadow-card-hover hover:border-slate-200 cursor-pointer active:scale-[0.99]',
        highlight && 'border-accent/40 ring-1 ring-accent/30',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
