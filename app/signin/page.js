'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/hooks/useT';
import { DEMO_OTP } from '@/lib/constants';
import { verifyDemoOtp } from '@/lib/otp';
import { toast } from 'sonner';
import {
  Wrench,
  Lightbulb,
  Paintbrush,
  Sparkles,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Clock,
  RotateCcw,
  Check,
  Home
} from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const t = useT();
  const signIn = useAppStore((state) => state.signIn);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const currentLang = useAppStore((state) => state.language);

  const [phone, setPhone] = useState('9820194820');
  const [role, setRole] = useState('customer'); // 'customer' | 'worker'
  const [step, setStep] = useState('PHONE'); // 'PHONE' | 'OTP' | 'SUCCESS'
  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(24);

  // Resend countdown
  useEffect(() => {
    let interval;
    if (step === 'OTP' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleSendOtp = (e) => {
    e?.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setStep('OTP');
    setResendTimer(24);
    toast.success(`OTP dispatched to +91 ${cleanPhone}! Demo code: 1234`);
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto advance focus
    if (digit && index < 3) {
      const nextInput = document.getElementById(`signin-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`signin-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleFillDemoOtp = () => {
    setOtp(['1', '2', '3', '4']);
    handleVerifyOtp(['1', '2', '3', '4'].join(''));
  };

  const handleVerifyOtp = (codeToVerify) => {
    const code = codeToVerify || otp.join('');
    if (code.length !== 4) {
      toast.error('Please enter the 4-digit code');
      return;
    }

    if (verifyDemoOtp(code) || code === '1234') {
      setStep('SUCCESS');
      toast.success('Mobile verified successfully!');
      setTimeout(() => {
        signIn(`+91 ${phone}`, role);
        router.push('/tutorial');
      }, 1400);
    } else {
      toast.error('Invalid OTP. Use demo OTP: 1234');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0B1F3A] overflow-hidden flex flex-col justify-between font-sans selection:bg-[#FF6F00]/30 selection:text-white">
      {/* Background Gradient & Ambient Glows (Stitch Master) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#061120] via-[#0B1F3A] to-[#164387] z-0 pointer-events-none" />
      <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-[#FFB020] opacity-25 blur-[75px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-[#1B5BB5] opacity-40 blur-[65px] pointer-events-none" />

      {/* Floating 3D Tool Icons (Stitch Master) */}
      <div className="absolute top-[82px] left-[26px] z-10 pointer-events-none animate-bounce" style={{ animationDuration: '4s' }}>
        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center text-amber-300">
          <Wrench className="w-6 h-6" />
        </div>
      </div>

      <div className="absolute top-[92px] right-[28px] z-10 pointer-events-none animate-bounce" style={{ animationDuration: '5s' }}>
        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center text-amber-200">
          <Lightbulb className="w-6 h-6" />
        </div>
      </div>

      <div className="absolute top-[210px] left-[18px] z-10 pointer-events-none animate-pulse" style={{ animationDuration: '4.5s' }}>
        <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center text-sky-200">
          <Paintbrush className="w-5 h-5" />
        </div>
      </div>

      <div className="absolute top-[200px] right-[20px] z-10 pointer-events-none animate-pulse" style={{ animationDuration: '5.2s' }}>
        <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center text-emerald-200">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>

      {/* Brand Hero & Logo Section */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-12 pb-6 max-w-sm mx-auto">
        {/* Emblem */}
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-[24px] bg-gradient-to-tr from-[#FF6F00] via-[#FF9800] to-[#FFB020] p-0.5 shadow-xl shadow-orange-950/40 flex items-center justify-center">
            <div className="w-full h-full bg-[#0B1F3A]/90 backdrop-blur rounded-[22px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
              <div className="relative flex items-center justify-center text-white">
                <Home className="w-9 h-9" />
                <div className="absolute -bottom-1 -right-2 bg-gradient-to-r from-[#FF9800] to-[#FF6F00] p-1 rounded-full text-white shadow-sm ring-2 ring-[#0B1F3A]">
                  <Wrench className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -inset-1 rounded-[26px] bg-[#FFB020]/25 blur-sm -z-10" />
        </div>

        {/* 10,000+ Experts Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-semibold tracking-wider text-emerald-300 uppercase">
            10,000+ Mumbai Experts
          </span>
        </div>

        <h1 className="font-extrabold text-2xl tracking-tight text-white mb-1 drop-shadow-sm">
          Book My Service
        </h1>
        <p className="text-sky-100/80 text-xs font-medium">
          Trusted help, nearby. <span className="text-[#FFB020]">| विश्वासार्ह सेवा</span>
        </p>

        {/* Hyperlocal Localities Ticker */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-[10px]">
          <MapPin className="w-3 h-3 text-[#FFB020]" />
          <span>Bandra • Khar • Juhu • Andheri • Dadar</span>
        </div>
      </div>

      {/* Bottom Rising Sheet (32px radius) */}
      <div className="relative z-20 w-full max-w-sm mx-auto bg-white rounded-t-[32px] shadow-[0_-12px_40px_rgba(0,0,0,0.38)] px-6 pt-5 pb-8 flex flex-col transition-all duration-300">
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-4" />

        {/* STEP 1: ENTER PHONE NUMBER */}
        {step === 'PHONE' && (
          <div className="space-y-4 animate-fade-in">
            {/* Language Switcher */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Choose Language:</span>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                    currentLang === 'en'
                      ? 'bg-[#0B1F3A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('mr')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all ${
                    currentLang === 'mr'
                      ? 'bg-[#0B1F3A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  मराठी
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all ${
                    currentLang === 'hi'
                      ? 'bg-[#0B1F3A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  हिंदी
                </button>
              </div>
            </div>

            <div>
              <h2 className="font-bold text-xl text-slate-900 leading-tight">
                Get started with mobile
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">
                We will send a 4-digit verification code to confirm your booking.
              </p>
            </div>

            {/* Role selection chips */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                  role === 'customer'
                    ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                👤 I&apos;m a Customer
              </button>
              <button
                type="button"
                onClick={() => setRole('worker')}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                  role === 'worker'
                    ? 'bg-[#FF6F00] text-white border-[#FF6F00] shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🔧 I&apos;m a Worker
              </button>
            </div>

            {/* Mobile field with +91 chip */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Mobile Number
              </label>
              <div className="flex items-center bg-[#F4F7FB] border-2 border-slate-200 rounded-2xl focus-within:border-[#FF6F00] focus-within:bg-white h-[52px] px-3 shadow-xs transition-all">
                <div className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded-xl shadow-xs mr-2">
                  <span className="text-xs font-bold text-slate-800">+91</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit number"
                  className="w-full bg-transparent text-slate-900 font-bold text-base focus:outline-none tracking-wide"
                />
              </div>
            </div>

            {/* Trust Hint */}
            <div className="flex items-center justify-between bg-amber-50/80 border border-amber-200/70 rounded-xl px-3 py-2 text-xs">
              <div className="flex items-center gap-1.5 text-amber-900">
                <ShieldCheck className="w-4 h-4 text-[#FF6F00]" />
                <span className="text-[11px] font-medium">100% Spam Free • Police Verified Techs</span>
              </div>
              <span className="text-[10px] bg-white text-amber-800 font-bold px-1.5 py-0.5 rounded border border-amber-200">
                Sample: 1234
              </span>
            </div>

            {/* Saffron Pill Button */}
            <button
              type="button"
              onClick={handleSendOtp}
              className="w-full h-[52px] rounded-full bg-gradient-to-r from-[#FF9800] to-[#FF6F00] text-white font-bold text-base flex items-center justify-center gap-2 shadow-[0_10px_24px_-4px_rgba(255,111,0,0.48)] active:scale-95 transition-all"
            >
              <span>Get OTP</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-center text-[10px] text-slate-400">
              By continuing you agree to Book My Service&apos;s Terms of Use & Privacy Policy
            </p>
          </div>
        )}

        {/* STEP 2: VERIFY 4-DIGIT OTP */}
        {step === 'OTP' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('PHONE')}
                className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full hover:bg-blue-100"
              >
                ← Edit Number
              </button>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <Check className="w-3 h-3" />
                <span>SMS Dispatched</span>
              </div>
            </div>

            <div>
              <h2 className="font-bold text-xl text-slate-900">
                Verify 4-digit OTP
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Sent to <strong className="text-slate-800">+91 {phone}</strong>
              </p>
            </div>

            {/* 4 Large Rounded OTP Boxes */}
            <div className="flex items-center justify-between gap-2.5 my-2">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  id={`signin-otp-${index}`}
                  type="tel"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-14 h-15 rounded-2xl bg-[#F4F7FB] border-2 border-slate-200 text-center font-bold text-2xl text-slate-900 focus:border-[#FF6F00] focus:bg-white shadow-xs focus:outline-none transition-all"
                />
              ))}
            </div>

            {/* Demo OTP Quick Fill Chip & Resend */}
            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleFillDemoOtp}
                className="px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF6F00] font-bold text-[11px] active:scale-95"
              >
                ✨ Fill Demo OTP: 1234
              </button>

              <span className="text-[11px] text-slate-500">
                {resendTimer > 0 ? (
                  `Resend in 0:${resendTimer < 10 ? '0' : ''}${resendTimer}`
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setResendTimer(24);
                      toast.info('OTP resent: 1234');
                    }}
                    className="text-blue-700 font-bold underline"
                  >
                    Resend OTP now
                  </button>
                )}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleVerifyOtp()}
              className="w-full h-[52px] rounded-full bg-gradient-to-r from-[#FF9800] to-[#FF6F00] text-white font-bold text-base flex items-center justify-center gap-2 shadow-[0_10px_24px_-4px_rgba(255,111,0,0.48)] active:scale-95 transition-all"
            >
              <span>Verify & Proceed</span>
              <ShieldCheck className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 3: SUCCESS MORPH STATE */}
        {step === 'SUCCESS' && (
          <div className="py-6 flex flex-col items-center text-center space-y-3 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900">
              Mobile Verified!
            </h3>
            <p className="text-slate-500 text-xs">
              Welcome to Book My Service. Routing to Bandra & Khar pros...
            </p>
            <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-gradient-to-r from-[#FF9800] to-emerald-500 rounded-full w-full animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
