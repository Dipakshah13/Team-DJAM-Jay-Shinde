'use client';

import { useAppStore } from '@/store/useAppStore';
import en from '@/lib/i18n/en';
import mr from '@/lib/i18n/mr';
import hi from '@/lib/i18n/hi';

const dictionaries = { en, mr, hi };

export function useT() {
  const language = useAppStore((state) => state.language) || 'en';
  const dict = dictionaries[language] || dictionaries.en;

  return function t(key, fallback = '') {
    if (dict && dict[key] !== undefined) {
      return dict[key];
    }
    if (dictionaries.en && dictionaries.en[key] !== undefined) {
      return dictionaries.en[key];
    }
    return fallback || key;
  };
}
