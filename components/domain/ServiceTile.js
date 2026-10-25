'use client';

import { useT } from '@/hooks/useT';
import { Wrench, Zap, Paintbrush, Sparkles, Home, Utensils } from 'lucide-react';
import clsx from 'clsx';

const iconMap = {
  Wrench,
  Zap,
  Paintbrush,
  Sparkles,
  Home,
  Utensils,
};

export function ServiceTile({ service, onClick, selected = false }) {
  const t = useT();
  const Icon = iconMap[service.icon] || Wrench;

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex flex-col items-start p-4 rounded-3xl bg-white border text-left transition-all duration-200 shadow-card hover:shadow-card-hover group relative overflow-hidden',
        selected
          ? 'border-accent ring-2 ring-accent/30 bg-amber-50/20'
          : 'border-slate-100 hover:border-slate-200'
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-primary flex items-center justify-center mb-3 transition-transform group-hover:scale-110">
        <Icon className="w-6 h-6" />
      </div>

      <h3 className="text-base font-bold text-heading group-hover:text-primary leading-tight">
        {t(service.labelKey)}
      </h3>

      <p className="text-xs text-muted mt-1 line-clamp-1">
        {t(service.descKey)}
      </p>

      <div className="mt-3 pt-2.5 border-t border-slate-100 w-full flex items-center justify-between text-xs">
        <span className="text-slate-400">Typical:</span>
        <span className="font-bold text-slate-800">
          ₹{service.baseRange[0]} - ₹{service.baseRange[1]}
        </span>
      </div>
    </button>
  );
}
