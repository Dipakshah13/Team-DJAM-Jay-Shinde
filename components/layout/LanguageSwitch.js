'use client';

import { useAppStore } from '@/store/useAppStore';
import { LANGUAGES } from '@/lib/constants';
import clsx from 'clsx';
import { Globe } from 'lucide-react';
import { useMounted } from '@/hooks/useMounted';

export function LanguageSwitch({ compact = false }) {
  const mounted = useMounted();
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  if (!mounted) {
    return <div className="h-7 w-28 bg-white/10 rounded-full" />;
  }

  return (
    <div className="flex items-center gap-1 bg-white/10 sm:bg-white/90 backdrop-blur-md p-1 rounded-full border border-white/20 sm:border-slate-200 shadow-sm">
      {!compact && <Globe className="w-3.5 h-3.5 ml-1.5 text-slate-400 hidden sm:block" />}
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => setLanguage(lang.code)}
          className={clsx(
            'px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-150',
            language === lang.code
              ? 'bg-primary text-white shadow-sm'
              : 'text-slate-200 sm:text-slate-600 hover:text-white sm:hover:text-primary hover:bg-white/10 sm:hover:bg-slate-100'
          )}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
