'use client';

import clsx from 'clsx';

export function Skeleton({ className = '', rounded = 'rounded-xl', ...props }) {
  return (
    <div
      className={clsx(
        'animate-pulse bg-slate-200/80',
        rounded,
        className
      )}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="w-1/2 h-4" />
          <Skeleton className="w-1/3 h-3" />
        </div>
      </div>
      <Skeleton className="w-full h-8 rounded-full" />
    </div>
  );
}
