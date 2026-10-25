'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/hooks/useT';
import { toast } from 'sonner';
import { Sliders, RotateCcw, User, Wrench, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';

export function DemoPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const t = useT();

  const role = useAppStore((state) => state.currentUser?.role) || 'customer';
  const setRole = useAppStore((state) => state.setRole);
  const resetState = useAppStore((state) => state.resetState);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'customer') router.push('/customer/home');
    if (newRole === 'worker') router.push('/worker/home');
    if (newRole === 'admin') router.push('/admin');
    toast.success(`Switched role to ${newRole.toUpperCase()}`);
  };

  const handleReset = () => {
    resetState();
    toast.success(t('demo.resetSuccess'));
    router.push('/customer/home');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-2 p-4 bg-slate-900/95 backdrop-blur-md text-white rounded-3xl border border-slate-700 shadow-2xl w-72 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
            <span className="text-xs font-bold tracking-wider uppercase text-amber-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              {t('demo.title')}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Close
            </button>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1.5 font-medium">
              {t('demo.switchRole')}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleRoleChange('customer')}
                className={clsx(
                  'flex flex-col items-center py-2 px-1 rounded-xl text-xs font-semibold transition-all',
                  role === 'customer'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                )}
              >
                <User className="w-4 h-4 mb-1" />
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('worker')}
                className={clsx(
                  'flex flex-col items-center py-2 px-1 rounded-xl text-xs font-semibold transition-all',
                  role === 'worker'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                )}
              >
                <Wrench className="w-4 h-4 mb-1" />
                Worker
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={clsx(
                  'flex flex-col items-center py-2 px-1 rounded-xl text-xs font-semibold transition-all',
                  role === 'admin'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                )}
              >
                <Shield className="w-4 h-4 mb-1" />
                Admin
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t('demo.resetData')}
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Demo Controls"
        className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-900 text-amber-400 font-bold text-xs px-3.5 py-2.5 rounded-full shadow-2xl border border-amber-400/40 backdrop-blur-md transition-all active:scale-95"
      >
        <Sliders className="w-4 h-4" />
        <span>Demo Controls</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
