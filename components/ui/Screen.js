'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

export function Screen({
  children,
  title,
  subtitle,
  back = false,
  onBack,
  rightAction,
  hasNav = false,
  className = '',
  headerClassName = '',
}) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className={clsx('flex flex-col min-h-full bg-surface text-heading', className)}>
      {/* Header */}
      {(title || back || rightAction) && (
        <header
          className={clsx(
            'sticky top-0 z-30 flex items-center justify-between px-4 py-3.5 bg-white/95 backdrop-blur-md border-b border-slate-100',
            headerClassName
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            {back && (
              <button
                type="button"
                onClick={handleBack}
                aria-label="Go back"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-700 active:scale-95 transition-all flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="min-w-0">
              {title && (
                <h1 className="text-lg font-bold text-primary truncate leading-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-xs text-muted truncate mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          {rightAction && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {rightAction}
            </div>
          )}
        </header>
      )}

      {/* Main Content Area */}
      <main
        className={clsx(
          'flex-1 flex flex-col p-4 md:p-5',
          hasNav ? 'pb-24' : 'pb-8'
        )}
      >
        {children}
      </main>
    </div>
  );
}
