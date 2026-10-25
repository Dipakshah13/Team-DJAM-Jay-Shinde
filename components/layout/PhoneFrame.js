'use client';

import { Wifi, Battery, Signal } from 'lucide-react';
import { DemoPanel } from './DemoPanel';
import { LanguageSwitch } from './LanguageSwitch';

export function PhoneFrame({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-0 sm:py-6 sm:px-4">
      {/* Background glow and desktop title */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-[420px] mb-3 px-2 text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">
            Book My Service · Demo Mode
          </span>
        </div>
        <LanguageSwitch />
      </div>

      {/* Phone container */}
      <div className="relative w-full sm:max-w-[400px] h-screen sm:h-[844px] bg-surface sm:rounded-[44px] shadow-2xl sm:ring-8 sm:ring-slate-800/80 overflow-hidden flex flex-col border border-slate-700/40">
        {/* Notch / Dynamic Island */}
        <div className="flex-shrink-0 h-10 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between text-xs font-semibold text-slate-800 border-b border-slate-100/60 select-none z-40">
          <span>9:41</span>
          <div className="w-20 h-4 bg-slate-900 rounded-full" />
          <div className="flex items-center gap-1.5 text-slate-700">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Inner Phone Screen */}
        <div className="flex-1 overflow-y-auto relative flex flex-col">
          {children}
        </div>
      </div>

      {/* Floating Demo Control Panel */}
      <DemoPanel />
    </div>
  );
}
