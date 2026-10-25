'use client';

import { useAppStore } from '@/store/useAppStore';
import en from '@/lib/i18n/en';
import mr from '@/lib/i18n/mr';
import hi from '@/lib/i18n/hi';

const dictionaries = { en, mr, hi };

export function useT() {
  const language = useAppStore((state) => state.language) || 'en';
  const dict = dictionaries[language] || dictionaries.en;

  function t(key, fallback = '') {
    if (dict && dict[key] !== undefined) {
      return dict[key];
    }
    if (dictionaries.en && dictionaries.en[key] !== undefined) {
      return dictionaries.en[key];
    }
    return fallback || key;
  }

  function tf(key, vars = {}) {
    let str = t(key);
    if (!vars) return str;
    Object.keys(vars).forEach((varKey) => {
      str = str.replace(new RegExp(`\\{${varKey}\\}`, 'g'), vars[varKey]);
    });
    return str;
  }

  t.tf = tf;
  return t;
}

export function tf(key, vars = {}) {
  let lang = 'en';
  try {
    const raw = localStorage.getItem('bms-storage');
    if (raw) lang = JSON.parse(raw)?.state?.language || 'en';
  } catch (e) {}
  const dict = dictionaries[lang] || dictionaries.en;
  let str = dict?.[key] || dictionaries.en?.[key] || key;
  if (!vars) return str;
  Object.keys(vars).forEach((varKey) => {
    str = str.replace(new RegExp(`\\{${varKey}\\}`, 'g'), vars[varKey]);
  });
  return str;
}
