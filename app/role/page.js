'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/hooks/useT';
import {
  ArrowLeft,
  Home,
  ShieldCheck,
  CheckCircle2,
  Wrench,
  TrendingUp,
  ArrowRight,
  Shield,
  Lock,
  Wallet,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

export default function RolePage() {
  const router = useRouter();
  const t = useT();
  const setRole = useAppStore((state) => state.setRole);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const currentLang = useAppStore((state) => state.language);

  const [selectedRole, setSelectedRole] = useState(null);

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setRole(role);

    if (role === 'customer') {
      toast.success('Entering Customer Mode');
      setTimeout(() => router.push('/customer/home'), 400);
    } else if (role === 'worker') {
      toast.success('Entering Worker Terminal');
      setTimeout(() => router.push('/worker/home'), 400);
    } else if (role === 'admin') {
      toast.info('Entering Admin Control Panel');
      setTimeout(() => router.push('/admin'), 400);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050B14] flex items-center justify-center font-sans text-slate-100 selection:bg-[#FF6F00] selection:text-white overflow-hidden p-0 sm:p-4">
      {/* Mobile Simulator Frame */}
      <div className="w-full max-w-[390px] h-[844px] bg-[#071324] relative overflow-hidden flex flex-col justify-between shadow-2xl sm:rounded-[44px] sm:border-[7px] sm:border-[#1E293B]">
        
        {/* Ambient Glows & Grid */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#FF9800]/15 blur-[90px] pointer-events-none" />
        <div className="absolute top-1/3 -left-28 w-80 h-80 rounded-full bg-[#1E40AF]/25 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 right-0 w-72 h-72 rounded-full bg-[#FF6F00]/20 blur-[85px] pointer-events-none" />

        {/* Top Header / Nav Zone */}
        <header className="relative z-20 pt-10 px-5 pb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 transition backdrop-blur-md border border-white/15 text-xs text-white/90"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="font-semibold">Back</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#FF6F00] animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-slate-200 uppercase">
              Book My Service
            </span>
          </div>

          <div className="flex items-center bg-white/10 border border-white/15 rounded-full p-0.5 text-xs font-bold backdrop-blur-md">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                currentLang === 'en' ? 'bg-[#FF6F00] text-white shadow-xs' : 'text-slate-300'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('mr')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                currentLang === 'mr' ? 'bg-[#FF6F00] text-white shadow-xs' : 'text-slate-300'
              }`}
            >
              म
            </button>
          </div>
        </header>

        {/* Main Title & Prompt */}
        <div className="relative z-20 px-5 pt-2 pb-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-[10px] font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Step 3 of 3 • Profile Setup</span>
          </div>

          <h1 className="text-[24px] leading-tight font-extrabold text-white tracking-tight">
            How will you use <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-[#FF6F00]">
              Book My Service?
            </span>
          </h1>
          <p className="text-xs text-slate-300/80 mt-1 leading-snug">
            Choose your role to customize your experience. You can switch between booking and earning anytime.
          </p>
        </div>

        {/* Bento Cards Section (Stitch S3) */}
        <div className="relative z-20 px-5 flex-1 flex flex-col justify-center gap-3.5 py-2">
          
          {/* CARD 1: CUSTOMER */}
          <div
            onClick={() => handleSelectRole('customer')}
            className={`group cursor-pointer relative rounded-[26px] p-4 bg-gradient-to-br from-white/[0.12] via-white/[0.06] to-[#0D2447]/60 border backdrop-blur-xl shadow-xl overflow-hidden transition-all duration-300 active:scale-98 ${
              selectedRole === 'customer'
                ? 'border-blue-400 ring-2 ring-blue-400/50 scale-[1.02]'
                : 'border-blue-400/30 hover:border-blue-400/60'
            }`}
          >
            <div className="flex items-center justify-between relative z-10 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-[10px] font-bold uppercase tracking-wider">
                <Home className="w-3 h-3 text-blue-300" />
                <span>Customer Mode</span>
              </span>
              <span className="text-[11px] text-slate-300/70 font-medium">घरगुती सेवा हवी आहे</span>
            </div>

            <div className="flex items-center justify-between gap-3 relative z-10">
              <div className="flex-1 pr-1">
                <h2 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
                  I need a service
                </h2>
                <p className="text-xs text-slate-200 font-medium mt-0.5 leading-snug">
                  Book trusted help nearby
                </p>

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-slate-200 border border-white/10">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>20-min response</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-slate-200 border border-white/10">
                    <ShieldCheck className="w-3 h-3 text-blue-300" />
                    <span>Police-verified</span>
                  </span>
                </div>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                🏡
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Bandra, Dadar, Juhu & 14 localities</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-200 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all shadow-xs">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* CARD 2: WORKER / PARTNER */}
          <div
            onClick={() => handleSelectRole('worker')}
            className={`group cursor-pointer relative rounded-[26px] p-4 bg-gradient-to-br from-white/[0.12] via-white/[0.06] to-[#3A1E07]/60 border backdrop-blur-xl shadow-xl overflow-hidden transition-all duration-300 active:scale-98 ${
              selectedRole === 'worker'
                ? 'border-[#FF6F00] ring-2 ring-[#FF6F00]/50 scale-[1.02]'
                : 'border-amber-500/35 hover:border-amber-500/60'
            }`}
          >
            <div className="flex items-center justify-between relative z-10 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/35 text-amber-200 text-[10px] font-bold uppercase tracking-wider">
                <Wrench className="w-3 h-3 text-amber-300" />
                <span>Partner / Karigar</span>
              </span>
              <span className="text-[11px] text-amber-200/80 font-medium">कामगार / व्यावसायिक बना</span>
            </div>

            <div className="flex items-center justify-between gap-3 relative z-10">
              <div className="flex-1 pr-1">
                <h2 className="text-xl font-bold text-white group-hover:text-amber-200 transition-colors">
                  I offer a service
                </h2>
                <p className="text-xs text-amber-100 font-medium mt-0.5 leading-snug">
                  Get jobs, set your own price
                </p>

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-amber-100 border border-white/10">
                    <Wallet className="w-3 h-3 text-amber-400" />
                    <span>Daily UPI payouts</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-amber-100 border border-white/10">
                    <Sparkles className="w-3 h-3 text-orange-400" />
                    <span>0% commission month</span>
                  </span>
                </div>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-amber-600/30 border border-amber-400/30 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                👷
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-1.5 text-[10px] text-amber-200 font-medium">
                <TrendingUp className="w-3 h-3 text-amber-400" />
                <span>Earn up to ₹42,000 / month</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-200 flex items-center justify-center group-hover:bg-[#FF6F00] group-hover:text-white transition-all shadow-xs">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Security Trust & Admin Switch */}
        <footer className="relative z-20 px-5 pb-6 pt-1 text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <Lock className="w-3.5 h-3.5 text-slate-300" />
            <span>Bank-grade Aadhaar & Police verification for all members</span>
          </div>

          <button
            type="button"
            onClick={() => handleSelectRole('admin')}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-white px-3 py-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Switch to Admin Oversight Panel</span>
          </button>
        </footer>

      </div>
    </div>
  );
}
