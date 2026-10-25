'use client';

import Link from 'next/link';
import { Home, Wrench, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B1F3A] flex flex-col items-center justify-center p-6 text-center text-white font-sans selection:bg-[#FF6F00]/30 selection:text-white">
      <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 mb-6 shadow-xl animate-pulse">
        <Wrench className="w-10 h-10" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
        404 — Page Not Found
      </span>

      <h1 className="text-2xl font-black text-white mb-2">
        Looks like you took a wrong turn
      </h1>

      <p className="text-xs text-slate-300 max-w-xs mb-8 leading-relaxed">
        The service or page you are looking for does not exist in this demo. Let&apos;s get you back to trusted local pros.
      </p>

      <Link href="/customer/home" className="w-full max-w-xs">
        <Button variant="accent" fullWidth size="lg" icon={Home}>
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
