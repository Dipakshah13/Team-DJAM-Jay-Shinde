'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/hooks/useT';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { JobProofCard } from '@/components/domain/JobProofCard';
import { Receipt } from '@/components/domain/Receipt';
import { PageTransition } from '@/components/layout/PageTransition';
import {
  Phone,
  Navigation,
  MapPin,
  KeyRound,
  PlusCircle,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertTriangle,
  Wallet,
  QrCode,
  FileText,
  Camera,
  X
} from 'lucide-react';
import { toast } from 'sonner';

export default function WorkerJobPage() {
  const router = useRouter();
  const params = useParams();
  const t = useT();

  const bookingId = params?.bookingId;
  const bookings = useAppStore((state) => state.bookings);
  const startJobWithOtp = useAppStore((state) => state.startJobWithOtp);
  const raiseExtraCharge = useAppStore((state) => state.raiseExtraCharge);
  const endJobWithOtp = useAppStore((state) => state.endJobWithOtp);
  const updateJobProofPhoto = useAppStore((state) => state.updateJobProofPhoto);
  const toggleChecklistTask = useAppStore((state) => state.toggleChecklistTask);

  const booking = bookings.find((b) => b.id === bookingId);

  // Active Stage in Stitch UI: 1 = Start OTP, 2 = Live Timer, 3 = Extra Charge, 4 = Complete & Pay
  const [activeStage, setActiveStage] = useState(1);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(1458); // ~24:18

  // Extra Charge State
  const [extraReason, setExtraReason] = useState('Parts / Spare');
  const [extraAmount, setExtraAmount] = useState(120);
  const [isExtraModalOpen, setIsExtraModalOpen] = useState(false);

  const bookingStatus = booking?.status;
  const startedTimeStr = booking?.startedAt
    ? new Date(booking.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Just now';

  useEffect(() => {
    if (!bookingStatus) return;
    if (bookingStatus === 'CONFIRMED') setActiveStage(1);
    else if (['STARTED', 'EXTRA_PENDING'].includes(bookingStatus)) setActiveStage(2);
    else if (['COMPLETED', 'RATED'].includes(bookingStatus)) setActiveStage(4);
  }, [bookingStatus]);

  // Digital stopwatch timer
  useEffect(() => {
    let interval;
    if (booking?.status === 'STARTED' || activeStage === 2) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [booking?.status, activeStage]);

  const formatTimer = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!booking) {
    return (
      <Screen title="Worker Terminal" back>
        <div className="p-8 text-center text-sm text-slate-500">
          Booking not found.
        </div>
      </Screen>
    );
  }

  const isCompleted = booking.status === 'COMPLETED' || booking.status === 'RATED' || activeStage === 4;

  // On-screen numeric keypad logic
  const handleKeypadPress = (digit) => {
    if (enteredOtp.length < 4) {
      setEnteredOtp((prev) => prev + digit);
    }
  };

  const handleKeypadBackspace = () => {
    setEnteredOtp((prev) => prev.slice(0, -1));
  };

  const handleKeypadClear = () => {
    setEnteredOtp('');
  };

  const handleVerifyStartJob = (codeToVerify) => {
    const code = codeToVerify || enteredOtp;
    if (code.length !== 4) {
      toast.error('Enter 4-digit customer Start OTP');
      return;
    }
    const result = startJobWithOtp(booking.id, code);
    if (result.success) {
      toast.success('Start OTP verified! Job is now in progress.');
      setActiveStage(2);
      setEnteredOtp('');
    } else {
      toast.error(result.message || 'Invalid Start OTP. Check customer screen.');
    }
  };

  const handleVerifyEndJob = (codeToVerify) => {
    const code = codeToVerify || enteredOtp;
    if (code.length !== 4) {
      toast.error('Enter 4-digit customer End OTP');
      return;
    }
    const result = endJobWithOtp(booking.id, code);
    if (result.success) {
      toast.success('End OTP verified! Job completed and added to Skill Passport.');
      setActiveStage(4);
      setEnteredOtp('');
    } else {
      toast.error(result.message || 'Invalid End OTP. Check customer screen.');
    }
  };

  const handleSendExtraCharge = () => {
    raiseExtraCharge(booking.id, {
      reason: extraReason,
      amount: Number(extraAmount),
    });
    setIsExtraModalOpen(false);
    setActiveStage(3);
    toast.info(`Extra charge of ₹${extraAmount} sent to customer for phone approval.`);
  };

  const netEarnings = Math.max(0, (booking.finalPrice || 500) - 28);

  return (
    <Screen
      title="Worker Terminal"
      subtitle={`#BMS-${booking.id.slice(-4).toUpperCase()} · Live`}
      back
      className="bg-[#071c36] text-slate-900 pb-24"
    >
      {/* 4-Stage Interactive Switcher Strip (Stitch Master S13) */}
      <div className="sticky top-0 z-30 -mx-4 -mt-4 bg-[#071c36] text-white px-4 py-2.5 shadow-md overflow-x-auto no-scrollbar border-b border-white/10">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[10px] text-amber-300 uppercase font-black tracking-wider mr-1">
            STAGE:
          </span>
          <button
            type="button"
            onClick={() => setActiveStage(1)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeStage === 1
                ? 'bg-[#ff6f00] text-white shadow-sm'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            1. Start OTP
          </button>
          <button
            type="button"
            onClick={() => setActiveStage(2)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeStage === 2
                ? 'bg-[#ff6f00] text-white shadow-sm'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            2. Live Timer
          </button>
          <button
            type="button"
            onClick={() => setActiveStage(3)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeStage === 3
                ? 'bg-[#ff6f00] text-white shadow-sm'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            3. Extra Charge
          </button>
          <button
            type="button"
            onClick={() => setActiveStage(4)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeStage === 4
                ? 'bg-[#ff6f00] text-white shadow-sm'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            4. Complete & Pay
          </button>
        </div>
      </div>

      {/* Navy Canopy Hero Context (Stitch Master S13) */}
      <section className="-mx-4 bg-[#071c36] text-white px-4 pt-3 pb-6 space-y-3">
        {/* Customer Profile Card */}
        <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md shadow-xs flex items-center justify-between border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center border border-white/20">
              <span className="text-xl">👩</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-white">Sunita Sharma</h2>
                <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Verified Customer · {booking.landmark || 'Bandra-Khar'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:+919820012345"
              className="h-9 px-3 rounded-full bg-white text-slate-900 text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
            >
              <Phone className="w-3.5 h-3.5 text-[#ff6f00]" />
              <span>Call</span>
            </a>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white active:scale-95 transition-transform"
            >
              <Navigation className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Prominent Amber Landmark Card (Stitch Master S13) */}
        <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/30 backdrop-blur-md text-amber-100 shadow-xs flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-full bg-amber-500/40 text-white flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4 text-amber-300" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] uppercase font-black bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded">
                Landmark Guide
              </span>
              <span className="text-[10px] text-amber-200">{booking.landmark ? 'Local Landmark' : 'Mumbai'}</span>
            </div>
            <p className="text-xs font-bold text-white">
              &ldquo;{booking.landmark || 'Opposite the blue temple, next to society gate 2'}&rdquo;
            </p>
            <p className="text-[10px] text-amber-200/80 mt-0.5 italic">
              अतिशय महत्त्वाचे: निळ्या जैन मंदिरासमोर, गेट क्रमांक २
            </p>
          </div>
        </div>
      </section>

      {/* Rising Curved Body */}
      <div className="relative -mt-3 -mx-4 rounded-t-[32px] bg-[#f9f9ff] px-4 pt-4 pb-12 shadow-2xl space-y-4">
        
        {/* Flat address banner */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-[#ff6f00] mt-0.5 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-[#071c36]">Flat 402, Sea Breeze Apartments</p>
            <p className="text-slate-500 text-[11px]">
              {booking.description || 'Water dripping continuously from kitchen sink flexi pipe'}
            </p>
          </div>
        </div>

        {/* ==================================================== */}
        {/* PHASE 1: ENTER START OTP WITH TACTILE ON-SCREEN KEYPAD */}
        {/* ==================================================== */}
        {activeStage === 1 && (
          <section className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-[#ff6f00] flex items-center justify-center mb-1.5">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#071c36]">Enter Start Job OTP</h3>
              <p className="text-xs text-slate-500 mt-0.5 max-w-[260px]">
                Ask customer for the 4-digit code shown on her BookMyService app
              </p>

              {/* 4 Large Box Indicators */}
              <div className="flex items-center justify-center gap-2.5 my-3">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="w-13 h-15 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl font-black text-[#071c36] font-mono shadow-inner"
                  >
                    {enteredOtp[index] ? enteredOtp[index] : index === enteredOtp.length ? '|' : '-'}
                  </div>
                ))}
              </div>

              {/* Demo auto-fill */}
              <button
                type="button"
                onClick={() => {
                  setEnteredOtp(booking.startOtp || '4821');
                  handleVerifyStartJob(booking.startOtp || '4821');
                }}
                className="text-xs font-bold text-[#ff6f00] underline flex items-center gap-1 active:scale-95"
              >
                <span>Customer says code is: {booking.startOtp || '4821'} (Tap to auto-start)</span>
              </button>
            </div>

            {/* Tactile On-Screen Numeric Keypad */}
            <div className="p-3.5 rounded-3xl bg-slate-100 border border-slate-200/80 shadow-xs space-y-2">
              <div className="grid grid-cols-3 gap-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleKeypadPress(digit)}
                    className="h-12 rounded-2xl bg-white font-bold text-base text-slate-800 shadow-xs active:scale-95 active:bg-orange-100 transition-all flex items-center justify-center"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleKeypadClear}
                  className="h-12 rounded-2xl bg-slate-200 font-bold text-sm text-red-600 active:scale-95 transition-all flex items-center justify-center"
                >
                  C
                </button>
                <button
                  type="button"
                  onClick={() => handleKeypadPress('0')}
                  className="h-12 rounded-2xl bg-white font-bold text-base text-slate-800 shadow-xs active:scale-95 transition-all flex items-center justify-center"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleKeypadBackspace}
                  className="h-12 rounded-2xl bg-slate-200 font-bold text-sm text-slate-700 active:scale-95 transition-all flex items-center justify-center"
                >
                  ⌫
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleVerifyStartJob()}
                className={`w-full h-12 rounded-full font-bold text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all ${
                  enteredOtp.length === 4
                    ? 'bg-gradient-to-r from-[#ff6f00] to-amber-500 text-white'
                    : 'bg-slate-300 text-slate-600 opacity-60'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Verify & Start Work</span>
              </button>
            </div>
          </section>
        )}

        {/* ==================================================== */}
        {/* PHASE 2: LIVE RUNNING TIMER & WORK SCOPE BREAKDOWN   */}
        {/* ==================================================== */}
        {activeStage === 2 && (
          <section className="space-y-4 animate-fade-in">
            {/* Live Timer Bento Box */}
            <div className="p-5 rounded-3xl bg-[#071c36] text-white shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#ff6f00]/20 blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold uppercase tracking-wider text-amber-300">
                <span className="w-2 h-2 rounded-full bg-[#ff6f00] animate-ping" />
                <span>Service in Progress</span>
              </div>

              {/* Big Digital Stopwatch */}
              <div className="text-4xl font-black font-mono tracking-wider my-2 text-white">
                {formatTimer(timerSeconds)}
              </div>
              <p className="text-[11px] text-slate-400">
                Started at {startedTimeStr} · {booking.landmark || 'Customer Location'}
              </p>

              {/* Live Step Tracker Pill */}
              <div className="w-full mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-left">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#ff6f00] text-white flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Diagnostic & Dismantle</p>
                    <p className="text-[10px] text-slate-300">Replaced old threaded flexi nipple</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  Active
                </span>
              </div>
            </div>

            {/* Scope of Work Card */}
            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#071c36]">Scope of Work</span>
                <span className="text-sm font-extrabold text-[#ff6f00]">
                  Base ₹{booking.finalPrice || 500}
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Leak diagnosis & sink pipeline inspection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Replacement flexi-hose fitment & Teflon seal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pressure water test & clean-up</span>
                </div>
              </div>

              {/* Extra Charge Trigger */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#071c36]">Need extra parts?</p>
                  <p className="text-[10px] text-slate-500">Client must approve via her phone</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsExtraModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-full bg-[#9e4200] text-white text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Extra Charge</span>
                </button>
              </div>
            </div>

            {/* Before & After Job Proof Card */}
            <JobProofCard
              booking={booking}
              isWorker
              onUpdatePhoto={updateJobProofPhoto}
              onToggleTask={toggleChecklistTask}
            />

            {/* Move to Wrap Up */}
            <button
              type="button"
              onClick={() => setActiveStage(4)}
              className="w-full h-12 rounded-full bg-[#071c36] text-white font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <span>Proceed to Wrap Up & OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </section>
        )}

        {/* ==================================================== */}
        {/* PHASE 3: EXTRA CHARGE APPROVAL VIEW                  */}
        {/* ==================================================== */}
        {activeStage === 3 && (
          <section className="space-y-4 animate-fade-in">
            <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm text-center flex flex-col items-center">
              <div className="relative w-14 h-14 rounded-full bg-orange-100 text-[#ff6f00] flex items-center justify-center mb-2">
                <Clock className="w-7 h-7" />
                <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#ff6f00] animate-ping" />
              </div>
              <h3 className="font-bold text-base text-[#071c36]">Waiting for Sunita&apos;s Approval</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-[260px]">
                Prompt of <strong className="text-[#071c36]">₹{extraAmount}</strong> sent to customer&apos;s phone.
              </p>

              <div className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-100 mt-3 text-left">
                <div className="flex items-center justify-between text-xs font-bold text-[#071c36]">
                  <span>{extraReason}</span>
                  <span className="text-[#ff6f00]">+₹{extraAmount}</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Parts & Materials · Photo attached
                </span>
              </div>

              {/* Demo Simulation buttons */}
              <div className="flex items-center gap-2 mt-4 w-full">
                <button
                  type="button"
                  onClick={() => {
                    toast.success(`Customer approved extra charge of ₹${extraAmount}!`);
                    setActiveStage(4);
                  }}
                  className="flex-1 h-10 rounded-full bg-emerald-600 text-white font-bold text-xs active:scale-95 transition-transform"
                >
                  Simulate Customer OK ✓
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.error('Customer declined extra charge.');
                    setActiveStage(2);
                  }}
                  className="px-4 h-10 rounded-full bg-slate-100 text-red-600 font-bold text-xs active:scale-95"
                >
                  Decline
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================== */}
        {/* PHASE 4: COMPLETE & PAY / WORKER NET EARNINGS        */}
        {/* ==================================================== */}
        {activeStage === 4 && (
          <section className="space-y-4 animate-fade-in">
            {/* If job not ended yet, show End OTP Input */}
            {booking.status !== 'COMPLETED' && booking.status !== 'RATED' ? (
              <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-md space-y-4 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#071c36]">Enter Completion OTP</h3>
                  <p className="text-xs text-slate-500">
                    Ask customer for the code shown on her phone to finalize
                  </p>
                </div>

                {/* 4 Box Digits Display */}
                <div className="flex items-center justify-center gap-2.5">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className="w-13 h-15 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl font-black text-emerald-700 font-mono shadow-inner"
                    >
                      {enteredOtp[index] ? enteredOtp[index] : index === enteredOtp.length ? '|' : '-'}
                    </div>
                  ))}
                </div>

                {/* Auto-fill demo helper */}
                <button
                  type="button"
                  onClick={() => {
                    setEnteredOtp(booking.endOtp || '9142');
                    handleVerifyEndJob(booking.endOtp || '9142');
                  }}
                  className="text-xs font-bold text-emerald-700 underline block"
                >
                  Customer says code is: {booking.endOtp || '9142'} (Tap to complete)
                </button>

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handleKeypadPress(digit)}
                      className="h-11 rounded-2xl bg-slate-100 font-bold text-base text-slate-800 active:scale-95"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleKeypadClear}
                    className="h-11 rounded-2xl bg-slate-200 font-bold text-sm text-red-600"
                  >
                    C
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('0')}
                    className="h-11 rounded-2xl bg-slate-100 font-bold text-base text-slate-800"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handleKeypadBackspace}
                    className="h-11 rounded-2xl bg-slate-200 font-bold text-sm text-slate-700"
                  >
                    ⌫
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleVerifyEndJob()}
                  className="w-full h-12 rounded-full bg-emerald-600 text-white font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Verify End OTP & Get Paid</span>
                </button>
              </div>
            ) : (
              <>
                {/* Celebration Header Card */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 shadow-xs flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Job Completed Successfully! 🎉</h3>
                    <p className="text-[11px] text-emerald-800">
                      End OTP verified by Sunita Sharma at 10:48 AM
                    </p>
                  </div>
                </div>

                {/* Itemised Worker Earnings Bento Card (Stitch Master S13) */}
                <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-md space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Technician Breakdown
                      </span>
                      <h4 className="text-base font-bold text-[#071c36]">Earnings Summary</h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#9e4200] text-xs font-bold">
                      #BMS-8421
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Labour & Inspection base</span>
                      <span className="font-bold text-slate-800">+₹350</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Parts supplied (Flexi-hose & washer)</span>
                      <span className="font-bold text-slate-800">+₹150</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Customer Approved Extra</span>
                      <span className="font-bold text-[#ff6f00]">+₹120</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 font-bold text-slate-900 text-sm">
                      <span>Gross Job Total</span>
                      <span>₹620</span>
                    </div>
                    <div className="flex items-center justify-between text-red-600">
                      <span>BMS Platform Fee (5%)</span>
                      <span className="font-bold">−₹28</span>
                    </div>
                  </div>

                  {/* Net Technician Payout Highlight Box */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-blue-900 tracking-wider">
                        Net Technician Payout
                      </p>
                      <p className="text-2xl font-black text-[#071c36]">₹592</p>
                      <p className="text-[10px] text-blue-700">
                        Credited instantly to your BMS Wallet
                      </p>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-white shadow-xs flex items-center justify-center text-[#ff6f00]">
                      <Wallet className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Cash / UPI Collection Notice */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs">
                    <QrCode className="w-4 h-4 text-slate-600 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#071c36]">Payment from Sunita: ₹620</p>
                      <p className="text-[10px] text-slate-500">
                        Customer opted to scan your partner UPI QR or pay in cash.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => router.push('/worker/home')}
                    className="w-full h-12 rounded-full bg-gradient-to-r from-[#ff6f00] to-amber-500 text-white font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
                  >
                    <span>Ready for Next Job</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </section>
        )}

        {/* Modal: Raise Extra Charge (Stitch S13 Bottom Sheet) */}
        {isExtraModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in">
            <div className="w-full max-w-md bg-white rounded-t-[32px] p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-slide-up">
              <div className="w-12 h-1.5 rounded-full bg-slate-200 mx-auto" />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#071c36]">Raise Extra Charge</h3>
                  <p className="text-xs text-slate-500">Requires customer approval on her phone</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsExtraModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Reason Chips */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Select Reason</label>
                <div className="flex flex-wrap gap-2">
                  {['Parts / Spare', 'Extra Work', 'Additional Labour'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setExtraReason(r)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        extraReason === r
                          ? 'bg-[#ff6f00] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Stepper */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Amount to Add (₹)</label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setExtraAmount((prev) => Math.max(20, prev - 20))}
                    className="w-10 h-10 rounded-xl bg-white shadow-xs font-bold text-lg text-[#ff6f00] active:scale-95"
                  >
                    −
                  </button>
                  <span className="text-3xl font-black text-[#071c36]">₹{extraAmount}</span>
                  <button
                    type="button"
                    onClick={() => setExtraAmount((prev) => prev + 20)}
                    className="w-10 h-10 rounded-xl bg-white shadow-xs font-bold text-lg text-[#ff6f00] active:scale-95"
                  >
                    +
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  {[50, 100, 150].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setExtraAmount(preset)}
                      className="py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800 active:scale-95"
                    >
                      +₹{preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Camera Photo simulation */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#ff6f00] flex items-center justify-center flex-shrink-0">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#071c36]">Brass flexi-pipe photo attached</p>
                  <p className="text-[10px] text-slate-500">Receipt proof will be shown to customer</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendExtraCharge}
                className="w-full h-12 rounded-full bg-gradient-to-r from-[#ff6f00] to-amber-500 text-white font-bold text-sm shadow-md active:scale-95 transition-transform"
              >
                Send Extra Charge Request (₹{extraAmount})
              </button>
            </div>
          </div>
        )}

      </div>
    </Screen>
  );
}
