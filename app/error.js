'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ErrorBoundary({ error, reset }) {
  const resetState = useAppStore((state) => state.resetState);

  useEffect(() => {
    console.error('App Error Boundary caught:', error);
  }, [error]);

  const handleResetData = () => {
    resetState();
    window.location.href = '/customer/home';
  };

  return (
    <div className="min-h-screen bg-[#0B1F3A] flex flex-col items-center justify-center p-6 text-center text-white font-sans">
      <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-6 shadow-xl">
        <AlertCircle className="w-10 h-10" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2">
        Something went wrong
      </span>

      <h1 className="text-2xl font-black text-white mb-2">
        Demo state encountered an issue
      </h1>

      <p className="text-xs text-slate-300 max-w-xs mb-8 leading-relaxed">
        {error?.message || 'An unexpected state error occurred. You can reset demo data to return to a clean working state.'}
      </p>

      <div className="space-y-3 w-full max-w-xs">
        <Button
          variant="accent"
          fullWidth
          size="lg"
          onClick={handleResetData}
          icon={RotateCcw}
        >
          Reset Demo Data
        </Button>

        <Button
          variant="outline"
          fullWidth
          size="md"
          onClick={() => reset()}
          className="text-white border-white/20 hover:bg-white/10"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
