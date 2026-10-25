'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/hooks/useT';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { StatusStepper } from '@/components/domain/StatusStepper';
import { ExtraChargeSheet } from '@/components/domain/ExtraChargeSheet';
import { Receipt } from '@/components/domain/Receipt';
import { JobProofCard } from '@/components/domain/JobProofCard';
import { PageTransition } from '@/components/layout/PageTransition';
import {
  Phone,
  ShieldAlert,
  KeyRound,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Navigation,
  Lock,
  Star,
  MessageCircle,
  AlertOctagon,
  LifeBuoy,
  Check,
  Clock,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerJobPage() {
  const router = useRouter();
  const params = useParams();
  const t = useT();

  const bookingId = params?.bookingId;
  const bookings = useAppStore((state) => state.bookings);
  const workers = useAppStore((state) => state.workers);
  const respondToExtraCharge = useAppStore((state) => state.respondToExtraCharge);
  const startJobWithOtp = useAppStore((state) => state.startJobWithOtp);
  const endJobWithOtp = useAppStore((state) => state.endJobWithOtp);
  const setPaymentDetails = useAppStore((state) => state.setPaymentDetails);

  const booking = bookings.find((b) => b.id === bookingId);
  const worker = workers.find((w) => w.id === booking?.workerId);

  // Check for pending extra charge
  const pendingExtra = booking?.extras?.find((e) => e.status === 'PENDING');

  if (!booking || !worker) {
    return (
      <Screen title="Job Details" back>
        <div className="p-8 text-center text-sm text-slate-500">
          Job details not found.
        </div>
      </Screen>
    );
  }

  const isCompleted = booking.status === 'COMPLETED' || booking.status === 'RATED';
  const startOtpDigits = (booking.startOtp || '4829').split('');
  const endOtpDigits = (booking.endOtp || '9142').split('');

  const handleApproveExtra = () => {
    if (pendingExtra) {
      respondToExtraCharge(booking.id, pendingExtra.id, true);
      toast.success(t('extra.approved') + pendingExtra.amount);
    }
  };

  const handleDeclineExtra = () => {
    if (pendingExtra) {
      respondToExtraCharge(booking.id, pendingExtra.id, false);
      toast.error(t('extra.declined'));
    }
  };

  return (
    <Screen
      title="Live Partner Tracking"
      subtitle={`#${booking.id.slice(-6).toUpperCase()} · Khar West`}
      back
      className="bg-[#f9f9ff] pb-24"
    >
      <PageTransition className="space-y-4 max-w-sm mx-auto w-full py-1">
        
        {/* Top SOS & Live Tracking Bar (Stitch Master) */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3 py-1.5 rounded-full shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-[#071c36]">Live Tracking</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toast.error('Emergency SOS alert notified to Mumbai Control Hub & BMS Security.')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-100 text-red-700 font-bold text-xs active:scale-95 transition-transform"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>SOS Help</span>
            </button>
            <button
              type="button"
              onClick={() => router.push('/help')}
              aria-label="Support Desk"
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 active:scale-95"
            >
              <LifeBuoy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Map Visual Area with Animated Partner Marker (Stitch Master) */}
        {!isCompleted && (
          <div className="relative w-full h-52 rounded-3xl overflow-hidden shadow-md border border-slate-200/80 bg-slate-900">
            {/* Ambient Map Grid Simulation */}
            <div
              className="w-full h-full bg-cover bg-center opacity-85"
              style={{
                backgroundImage:
                  "radial-gradient(#ffffff15 1px, transparent 1px), radial-gradient(#ffffff10 1px, #071c36 1px)",
                backgroundSize: '24px 24px',
                backgroundColor: '#071c36',
              }}
            />

            {/* Stylized dark scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#071c36]/90 via-[#071c36]/30 to-transparent pointer-events-none" />

            {/* Animated Partner Scooter Marker */}
            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
              <div className="w-10 h-10 rounded-full bg-[#ff6f00] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(255,111,0,0.5)]">
                <Navigation className="w-5 h-5 -rotate-45" />
              </div>
              <div className="w-2 h-2 rounded-full bg-[#ff6f00] mt-1 shadow-xs" />
            </div>

            {/* Destination Pin */}
            <div className="absolute top-1/3 right-1/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-[#1c5cb6] text-white flex items-center justify-center shadow-lg">
                <span className="text-xs font-bold">🏠</span>
              </div>
              <span className="mt-1 px-2 py-0.5 rounded-full bg-[#071c36]/80 text-white text-[10px] font-bold backdrop-blur-xs">
                Your Home
              </span>
            </div>

            {/* Floating Live ETA Status Pill */}
            <div className="absolute bottom-2.5 inset-x-2.5 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 text-[#ff6f00]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff6f00] animate-ping opacity-75" />
                  <Clock className="w-4 h-4 text-[#ff6f00] absolute" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#071c36] leading-tight">
                    {booking.status === 'STARTED' ? 'Service In Progress' : '8 mins away'}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    1.4 km • Khar West Junction
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold">
                {booking.status === 'STARTED' ? 'Working' : 'On Time'}
              </span>
            </div>
          </div>
        )}

        {/* Secure Start OTP Bento Box (Stitch Master) */}
        {booking.status === 'CONFIRMED' && (
          <section className="w-full bg-gradient-to-br from-[#FFF7ED] via-white to-[#FFF3E0] rounded-3xl p-4 shadow-sm border border-orange-200/80">
            <div className="flex items-start gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#ff6f00]/15 flex items-center justify-center text-[#ff6f00] shrink-0 mt-0.5">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#071c36]">Secure Start Code</h2>
                <p className="text-xs text-slate-500">
                  Share OTP only when technician arrives at your doorstep
                </p>
              </div>
            </div>

            {/* 4 Large Bold Digits */}
            <div className="grid grid-cols-4 gap-2.5 my-3">
              {startOtpDigits.map((digit, i) => (
                <div
                  key={i}
                  className="h-14 rounded-2xl bg-white shadow-[0_6px_16px_rgba(255,111,0,0.12)] border border-orange-100 flex items-center justify-center text-2xl font-black text-[#ff6f00] font-mono"
                >
                  {digit}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1.5 pt-1 text-slate-500 text-[11px]">
              <Lock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span>Partner {worker.name} will ask for this code to verify arrival.</span>
            </div>

            {/* Demo Simulation button */}
            <div className="mt-3 pt-2 border-t border-orange-100">
              <button
                type="button"
                onClick={() => {
                  startJobWithOtp(booking.id, booking.startOtp);
                  toast.success('Technician arrived! Service started.');
                }}
                className="w-full py-2 rounded-full bg-gradient-to-r from-[#ff6f00] to-amber-500 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
              >
                Demo: Simulate Partner Arrival & Start
              </button>
            </div>
          </section>
        )}

        {/* Secure End OTP Bento Box (When STARTED) */}
        {booking.status === 'STARTED' && (
          <section className="w-full bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-3xl p-4 shadow-sm border border-emerald-200">
            <div className="flex items-start gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#071c36]">Secure Completion OTP</h2>
                <p className="text-xs text-slate-500">
                  Inspect the repair and share code only when fully satisfied
                </p>
              </div>
            </div>

            {/* 4 Large Bold Digits */}
            <div className="grid grid-cols-4 gap-2.5 my-3">
              {endOtpDigits.map((digit, i) => (
                <div
                  key={i}
                  className="h-14 rounded-2xl bg-white shadow-[0_6px_16px_rgba(16,185,129,0.12)] border border-emerald-100 flex items-center justify-center text-2xl font-black text-emerald-700 font-mono"
                >
                  {digit}
                </div>
              ))}
            </div>

            {/* Demo End Job button */}
            <div className="mt-2 pt-2 border-t border-emerald-100">
              <button
                type="button"
                onClick={() => {
                  endJobWithOtp(booking.id, booking.endOtp);
                  toast.success('Service completed & verified via End OTP!');
                }}
                className="w-full py-2 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
              >
                Demo: Verify End OTP & Complete Job
              </button>
            </div>
          </section>
        )}

        {/* Partner Profile Card (Stitch Master) */}
        <section className="w-full bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
              <img
                src={worker.avatar}
                alt={worker.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 shadow-xs flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base text-[#071c36] truncate">
                  {worker.name}
                </h3>
                <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs">
                <span className="flex items-center text-amber-600 font-bold">
                  ★ {worker.rating || '4.93'}
                </span>
                <span className="text-slate-400">
                  • {worker.jobsDone || '820'}+ jobs done
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                🛵 Hero Splendor • MH-02-EE-4120
              </p>
            </div>
          </div>

          {/* Trust Badges Strip */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold">
              <ShieldCheck className="w-3 h-3" />
              Verified Expert
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-semibold">
              Vouched in Bandra
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
              100% On-Time
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={`tel:${worker.phone}`}
              className="h-10 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <Phone className="w-4 h-4" />
              <span>Call {worker.name.split(' ')[0]}</span>
            </a>
            <button
              type="button"
              onClick={() => toast.info(`Direct chat with ${worker.name} opened.`)}
              className="h-10 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message</span>
            </button>
          </div>

          <div className="text-center">
            <span className="text-[10px] text-slate-400">
              Supports Marathi • Hindi • English
            </span>
          </div>
        </section>

        {/* 5-Stage Service Progress Stepper */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
          <StatusStepper status={booking.status} />
        </div>

        {/* ₹10,000 Damage Protection Assurance Banner */}
        <div className="w-full bg-[#ECFDF5] border border-emerald-100 rounded-2xl p-3 flex items-center gap-2.5 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-emerald-950 font-bold leading-tight">
              ₹10,000 Damage Protection
            </p>
            <p className="text-[10px] text-emerald-800">
              100% insured repairs under Book My Service Promise.
            </p>
          </div>
        </div>

        {/* Completed State: Job Proof Card & Receipt */}
        {isCompleted && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <JobProofCard booking={booking} isWorker={false} />

            <Receipt
              estimate={booking.estimate}
              finalLabourPrice={booking.finalPrice}
              partsAmount={booking.estimate?.parts}
              extras={booking.extras}
              workerName={worker.name}
              bookingId={booking.id}
              initialPayment={booking.payment}
              onPaymentSuccess={(details) => setPaymentDetails(booking.id, details)}
            />

            {booking.status !== 'RATED' ? (
              <Button
                variant="accent"
                fullWidth
                size="lg"
                onClick={() => router.push(`/customer/rate/${booking.id}`)}
                icon={CheckCircle}
              >
                {t('receipt.done')}
              </Button>
            ) : (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-xs font-bold text-emerald-800">
                Feedback recorded. Thank you for using Book My Service!
              </div>
            )}
          </div>
        )}

        {/* Extra Charge Sheet Modal for Customer Approval */}
        <ExtraChargeSheet
          isOpen={Boolean(pendingExtra)}
          extra={pendingExtra}
          onApprove={handleApproveExtra}
          onDecline={handleDeclineExtra}
        />

        {/* Reschedule & Cancel options */}
        {!isCompleted && (
          <div className="flex flex-col items-center gap-2 pt-1 text-center">
            <button
              type="button"
              onClick={() => toast.info('Rescheduling request sent to partner.')}
              className="w-full h-10 rounded-full bg-slate-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <span>Need to Reschedule?</span>
            </button>
            <button
              type="button"
              onClick={() => {
                toast.error('Booking cancelled without penalty.');
                router.push('/customer/home');
              }}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors py-1"
            >
              Cancel Booking (Zero penalty before partner arrives)
            </button>
          </div>
        )}

      </PageTransition>
    </Screen>
  );
}
