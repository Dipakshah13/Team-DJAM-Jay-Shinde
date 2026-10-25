'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useT } from '@/hooks/useT';
import {
  Wrench,
  Zap,
  Sparkles,
  Utensils,
  Check,
  ShieldCheck,
  Handshake,
  KeyRound,
  ArrowRight,
  PhoneCall,
  Rocket,
  Home,
  MapPin,
  Lock
} from 'lucide-react';

export default function TutorialPage() {
  const router = useRouter();
  const t = useT();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < 2) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push('/role');
    }
  };

  const handleSkip = () => {
    router.push('/role');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050C16] flex items-center justify-center font-sans select-none overflow-hidden text-slate-800">
      {/* Mobile Frame Container */}
      <div className="relative w-full max-w-[390px] h-[844px] bg-[#F4F7FB] overflow-hidden sm:rounded-[44px] shadow-2xl flex flex-col justify-between border border-slate-700/20">
        
        {/* Top Absolute Bar: Brand Logo Tag & Glass Skip Button */}
        <header className="absolute top-0 left-0 right-0 z-30 pt-10 pb-3 px-5 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/25 shadow-sm">
            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-[#FF6F00] to-[#FFB020] flex items-center justify-center text-white text-xs shadow-xs">
              <Home className="w-3 h-3" />
            </div>
            <span className="text-white text-xs font-bold tracking-tight">
              Book My Service
            </span>
          </div>

          {currentSlide < 2 && (
            <button
              type="button"
              onClick={handleSkip}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-semibold tracking-wide active:scale-95 transition-all shadow-xs"
            >
              <span>{t('tutorial.skip')}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </header>

        {/* ============================================================ */}
        {/* SLIDE 1: INSTANT DISCOVERY & 2X2 SERVICE GRID               */}
        {/* ============================================================ */}
        {currentSlide === 0 && (
          <div className="w-full h-full flex flex-col justify-between animate-fade-in">
            {/* Top 56% Illustrated Scene Card */}
            <div className="relative h-[56%] w-full bg-gradient-to-b from-[#08172E] via-[#0B254E] to-[#164387] overflow-hidden flex flex-col items-center justify-center pt-10 px-5">
              <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-[#FFB020]/25 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#1B5BB5]/40 blur-2xl pointer-events-none" />

              {/* Tag */}
              <div className="absolute top-14 left-5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-md border border-white/10 text-[10px] font-medium text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>10,000+ Mumbai Experts</span>
              </div>

              {/* Central Phone Mockup */}
              <div className="relative w-[230px] bg-white/[0.08] backdrop-blur-xl border border-white/20 rounded-[26px] p-3 shadow-2xl mt-6">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-white">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#FFB020]" />
                    <span className="text-[10px] font-semibold">Bandra West, Mumbai</span>
                  </div>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1 py-0.2 rounded font-bold">
                    15m arrival
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="relative bg-gradient-to-br from-white to-[#F0F5FF] rounded-xl p-2 border-2 border-[#FF6F00] shadow-md flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#FF6F00] text-sm mb-1 shadow-inner">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800">Plumber</span>
                    <span className="text-[9px] text-slate-500">नल काम • ₹199</span>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6F00] text-white rounded-full flex items-center justify-center text-[9px]">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/15 flex flex-col items-center text-center text-white">
                    <div className="w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center text-[#FFB020] text-sm mb-1">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold">Electrician</span>
                    <span className="text-[9px] text-white/70">विद्युत काम</span>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/15 flex flex-col items-center text-center text-white">
                    <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center text-cyan-300 text-sm mb-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold">Deep Clean</span>
                    <span className="text-[9px] text-white/70">घर स्वच्छता</span>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/15 flex flex-col items-center text-center text-white">
                    <div className="w-8 h-8 rounded-lg bg-rose-400/20 flex items-center justify-center text-rose-300 text-sm mb-1">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold">Cook & Maid</span>
                    <span className="text-[9px] text-white/70">घरगुती काम</span>
                  </div>
                </div>
              </div>

              {/* Floating Badges */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md border border-white px-2 py-1 rounded-xl shadow-lg flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span className="text-[10px] font-bold text-slate-800">Police Verified</span>
              </div>
              <div className="absolute top-20 right-4 bg-white/90 backdrop-blur-md border border-white px-2 py-1 rounded-xl shadow-lg flex items-center gap-1.5">
                <Handshake className="w-3.5 h-3.5 text-blue-700" />
                <span className="text-[10px] font-bold text-slate-800">42 Bandra Flats</span>
              </div>
            </div>

            {/* Bottom 44% Light Sheet */}
            <div className="relative flex-1 bg-[#F4F7FB] -mt-6 rounded-t-[32px] px-6 pt-6 pb-24 shadow-2xl flex flex-col justify-between border-t border-white/60">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FF6F00]/10 text-[#FF6F00] text-xs font-bold mb-2">
                  <span>Step 1 of 3</span>
                  <span className="w-1 h-1 rounded-full bg-[#FF6F00]" />
                  <span>Instant Discovery</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1.5">
                  {t('tutorial.step1.title')}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t('tutorial.step1.desc')}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#FF6F00] flex items-center justify-center text-xs">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">20-min Emergency Response</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Live GPS
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SLIDE 2: 100% PRICE CLARITY & NEGOTIATION HANDSHAKE         */}
        {/* ============================================================ */}
        {currentSlide === 1 && (
          <div className="w-full h-full flex flex-col justify-between animate-fade-in">
            {/* Top 56% Illustrated Scene Card */}
            <div className="relative h-[56%] w-full bg-gradient-to-b from-[#08172E] via-[#0B254E] to-[#164387] overflow-hidden flex flex-col items-center justify-center pt-10 px-5">
              <div className="absolute -top-12 -left-12 w-56 h-56 rounded-full bg-[#FFB020]/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-[#1B5BB5]/40 blur-2xl pointer-events-none" />

              <div className="absolute top-14 left-5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-md border border-white/10 text-[10px] font-medium text-amber-300">
                <Lock className="w-3 h-3" />
                <span>Municipal Rate Cards</span>
              </div>

              {/* Price comparison layout */}
              <div className="relative w-full max-w-[290px] h-[220px] flex items-center justify-center mt-6">
                {/* Offline Rate */}
                <div className="absolute left-0 top-6 bg-white/95 rounded-2xl p-2.5 border border-slate-200 shadow-xl flex flex-col w-[100px]">
                  <span className="text-[9px] font-semibold text-slate-400 uppercase">Market</span>
                  <span className="text-sm font-bold text-slate-400 line-through">₹450</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">Offline quote</span>
                </div>

                {/* Best Price */}
                <div className="absolute right-0 top-3 bg-gradient-to-br from-white to-orange-50 rounded-2xl p-2.5 border-2 border-[#FF6F00] shadow-2xl flex flex-col w-[115px] z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-[#FF6F00] uppercase">Best Price</span>
                    <span className="w-3.5 h-3.5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[8px]">✓</span>
                  </div>
                  <div className="text-xl font-extrabold text-slate-900 my-0.5">
                    ₹288
                  </div>
                  <span className="text-[9px] text-emerald-700 font-bold bg-emerald-100 px-1 py-0.2 rounded">
                    Zero Hidden Fees
                  </span>
                </div>

                {/* Central Handshake Emblem */}
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#1B5BB5] to-[#FF6F00] p-0.5 shadow-2xl">
                  <div className="w-full h-full bg-[#08172E] rounded-[22px] flex flex-col items-center justify-center text-white">
                    <Handshake className="w-8 h-8 text-[#FFB020]" />
                    <span className="text-[9px] font-bold mt-0.5">Fair Deal</span>
                  </div>
                </div>

                {/* Counter-offer bubble */}
                <div className="absolute -bottom-2 z-20 bg-white rounded-2xl py-1.5 px-3 border border-slate-200 shadow-xl flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-orange-100 text-[#FF6F00] flex items-center justify-center text-[10px]">
                    💬
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-slate-800 block">Counter-offer Accepted</span>
                    <span className="text-[9px] text-slate-500">&ldquo;Tap washer replacement included @ ₹288&rdquo;</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom 44% Light Sheet */}
            <div className="relative flex-1 bg-[#F4F7FB] -mt-6 rounded-t-[32px] px-6 pt-6 pb-24 shadow-2xl flex flex-col justify-between border-t border-white/60">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FF6F00]/10 text-[#FF6F00] text-xs font-bold mb-2">
                  <span>Step 2 of 3</span>
                  <span className="w-1 h-1 rounded-full bg-[#FF6F00]" />
                  <span>100% Price Clarity</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1.5">
                  {t('tutorial.step2.title')}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t('tutorial.step2.desc')}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">₹10,000 Service Guarantee</span>
                </div>
                <span className="text-[10px] font-bold text-slate-600">UPI / Cash</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SLIDE 3: 100% SECURE START WITH DOORSTEP OTP                */}
        {/* ============================================================ */}
        {currentSlide === 2 && (
          <div className="w-full h-full flex flex-col justify-between animate-fade-in">
            {/* Top 56% Illustrated Scene Card */}
            <div className="relative h-[56%] w-full bg-gradient-to-b from-[#08172E] via-[#0B254E] to-[#164387] overflow-hidden flex flex-col items-center justify-center pt-10 px-5">
              <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-[#FFB020]/25 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#1B5BB5]/40 blur-2xl pointer-events-none" />

              <div className="absolute top-14 left-5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-md border border-white/10 text-[10px] font-medium text-emerald-300">
                <ShieldCheck className="w-3 h-3" />
                <span>Doorstep Verification</span>
              </div>

              {/* Smartphone mockup showing 4 OTP digits */}
              <div className="relative w-[200px] bg-white/[0.09] backdrop-blur-xl border border-white/25 rounded-[30px] p-3 shadow-2xl flex flex-col items-center mt-6">
                <div className="w-14 h-1.5 bg-black/40 rounded-full mb-2" />

                <div className="flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded-full border border-white/20 mb-2 w-full justify-center text-white text-[10px]">
                  <span className="font-bold">🛵 Ramesh Gokhale arriving</span>
                </div>

                <span className="text-white/70 text-[9px] uppercase tracking-wider mb-1 font-semibold">
                  Doorstep Start Code
                </span>

                <div className="flex items-center gap-1.5 my-1">
                  {['4', '8', '2', '9'].map((digit, i) => (
                    <div
                      key={i}
                      className={`w-8 h-10 rounded-xl font-bold text-lg flex items-center justify-center shadow-md font-mono ${
                        i === 3
                          ? 'bg-[#FF6F00] text-white border border-[#FFB020] animate-pulse'
                          : 'bg-white text-slate-900 border border-slate-200'
                      }`}
                    >
                      {digit}
                    </div>
                  ))}
                </div>

                <span className="text-[8px] text-white/60 text-center mt-1">
                  Share code only when tech arrives
                </span>
              </div>

              {/* Floating Shield */}
              <div className="absolute right-4 top-20 bg-[#08231C] border border-emerald-400/40 p-2.5 rounded-2xl shadow-xl flex flex-col items-center text-center">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span className="text-[8px] font-extrabold uppercase text-emerald-300 mt-0.5">Secure</span>
              </div>

              {/* Floating ID badge */}
              <div className="absolute left-4 bottom-4 bg-white rounded-xl p-2 shadow-xl border border-slate-200 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
                  🪪
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-bold text-slate-800 block">Aadhaar Verified</span>
                  <span className="text-[8px] text-slate-500">Government ID clearance</span>
                </div>
              </div>
            </div>

            {/* Bottom 44% Light Sheet */}
            <div className="relative flex-1 bg-[#F4F7FB] -mt-6 rounded-t-[32px] px-6 pt-6 pb-24 shadow-2xl flex flex-col justify-between border-t border-white/60">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Step 3 of 3</span>
                  <span className="w-1 h-1 rounded-full bg-emerald-600" />
                  <span>100% Secure Start</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1.5">
                  {t('tutorial.step3.title')}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t('tutorial.step3.desc')}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">Masked Calling & SOS Help</span>
                </div>
                <span className="text-[10px] font-bold text-slate-600">24x7 Help</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* FIXED BOTTOM ACTION BAR                                      */}
        {/* ============================================================ */}
        <div className="absolute bottom-0 left-0 right-0 z-30 px-6 pb-6 pt-3 bg-gradient-to-t from-[#F4F7FB] via-[#F4F7FB]/95 to-transparent flex items-center justify-between">
          {/* Stretched Pill Page Indicator (Stitch Master) */}
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentSlide(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === i ? 'w-8 bg-[#FF6F00]' : 'w-2.5 bg-slate-300'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF6F00] to-amber-500 text-white font-bold text-sm shadow-[0_8px_20px_rgba(255,111,0,0.38)] active:scale-95 transition-all"
          >
            <span>{currentSlide === 2 ? t('tutorial.getStarted') : t('tutorial.next')}</span>
            {currentSlide === 2 ? (
              <Rocket className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
