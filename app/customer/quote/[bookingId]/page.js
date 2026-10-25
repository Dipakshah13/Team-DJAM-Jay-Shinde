'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/hooks/useT';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { StatusStepper } from '@/components/domain/StatusStepper';
import { PriceBreakdown } from '@/components/domain/PriceBreakdown';
import { TrustBadge } from '@/components/domain/TrustBadge';
import { PageTransition } from '@/components/layout/PageTransition';
import {
  Lock,
  Scale,
  CheckCircle2,
  ArrowRight,
  XCircle,
  AlertCircle,
  Phone,
  MessageCircle,
  ShieldCheck,
  Zap,
  Sliders,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

export default function QuotePage() {
  const router = useRouter();
  const params = useParams();
  const t = useT();

  const bookingId = params?.bookingId;
  const bookings = useAppStore((state) => state.bookings);
  const workers = useAppStore((state) => state.workers);
  const sendCounterOffer = useAppStore((state) => state.sendCounterOffer);
  const workerRespondToCounter = useAppStore((state) => state.workerRespondToCounter);
  const confirmBookingPrice = useAppStore((state) => state.confirmBookingPrice);

  const booking = bookings.find((b) => b.id === bookingId);
  const worker = workers.find((w) => w.id === booking?.workerId);

  const [counterAmount, setCounterAmount] = useState('');
  const [selectedQuickDiscount, setSelectedQuickDiscount] = useState(null);

  if (!booking || !worker) {
    return (
      <Screen title="Quote & Negotiation" back>
        <div className="p-8 text-center text-sm text-slate-500">
          Booking not found. Please create a booking first.
        </div>
      </Screen>
    );
  }

  const isLocked = booking.status !== 'REQUESTED' && booking.status !== 'COUNTERED';
  const hasCountered = booking.counter?.offered !== null;
  const initialLabour = booking.estimate?.labour || 350;
  const initialParts = booking.estimate?.parts || 150;
  const initialTotal = initialLabour + initialParts;

  const handleSendCounter = (customAmount) => {
    const amount = Number(customAmount || counterAmount);
    if (!amount || amount < 100) {
      toast.error('Please enter a reasonable counter-offer (min ₹100)');
      return;
    }
    sendCounterOffer(booking.id, amount);
    toast.success(`Counter-offer of ₹${amount} sent to ${worker.name}!`);
    setCounterAmount('');
  };

  const handleConfirmPrice = () => {
    confirmBookingPrice(booking.id, booking.finalPrice || booking.estimate.labour);
    toast.success('Price locked! Booking confirmed.');
    router.push(`/customer/job/${booking.id}`);
  };

  return (
    <Screen
      title="Quote & Negotiation"
      subtitle="Verified Guarantee"
      back
      className="bg-[#f9f9ff] pb-24"
    >
      <PageTransition className="space-y-4 max-w-sm mx-auto w-full py-1">
        
        {/* Status Stepper */}
        <div className="bg-white rounded-3xl p-3.5 border border-slate-100 shadow-sm">
          <StatusStepper status={booking.status} />
        </div>

        {/* Worker Mini Card (Stitch Master S8) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col gap-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-13 h-13 rounded-full overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                <img
                  src={worker.avatar}
                  alt={worker.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px]">
                  ✓
                </div>
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-bold text-sm text-[#071c36] truncate">
                    {worker.name}
                  </h2>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-xs">
                  <span>{worker.role || 'Master Plumber'}</span>
                  <span>•</span>
                  <span className="text-amber-600 font-bold">★ {worker.rating || '4.94'}</span>
                  <span className="text-[10px] text-slate-400">({worker.jobsDone || '840'}+)</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                  <span>Khar West (0.8 km)</span>
                  <span>•</span>
                  <span className="text-[#ff6f00] font-bold">ETA ~18 min</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={`tel:${worker.phone}`}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-blue-700 hover:bg-slate-200 active:scale-95 transition-transform"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => toast.info(`Direct chat with ${worker.name} opened.`)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-blue-700 hover:bg-slate-200 active:scale-95 transition-transform"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 text-[11px] text-blue-900 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Police & Skill Vetted • Khar Technicians Guild Verified</span>
          </div>
        </div>

        {/* Main Quote Breakdown Card (Stitch Master S8) */}
        <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-slate-100 overflow-hidden flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Estimated Total
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#071c36] font-mono">
                  ₹{booking.finalPrice || initialTotal}
                </span>
                <span className="text-sm font-semibold line-through text-slate-400">
                  ₹{initialTotal + 120}
                </span>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold flex items-center gap-1">
              <Lock className="w-3 h-3 text-blue-600" />
              <span>{isLocked ? 'Price Locked' : 'Estimate Open'}</span>
            </div>
          </div>

          {/* Two-Tone Stacked Progress Bar (Stitch Master S8) */}
          <div className="space-y-1">
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-[#ff6f00] transition-all duration-700" style={{ width: '70%' }} />
              <div className="h-full bg-blue-400 transition-all duration-700" style={{ width: '30%' }} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold px-0.5">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#ff6f00]" />
                <span>Labour (70% · ₹{initialLabour})</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Parts & Spares (30% · ₹{initialParts})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Lock Banner or Interactive Negotiation */}
        {isLocked ? (
          <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-bold">
                Price Locked at ₹{booking.finalPrice}
              </span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Worker cannot alter this rate without your app OTP approval.
            </p>
            <button
              type="button"
              onClick={() => router.push(`/customer/job/${booking.id}`)}
              className="w-full h-11 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
            >
              <span>Go to Live Tracking Screen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-[#071c36] flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-[#ff6f00]" />
                <span>Negotiate Rate (1 Round Protocol)</span>
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                Strict 1-Turn
              </span>
            </div>

            {!hasCountered ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Offer a fair counter-offer once. If {worker.name} accepts, the fare locks instantly.
                </p>

                {/* Quick Negotiation Preset Chips */}
                <div className="grid grid-cols-3 gap-2">
                  {[initialLabour - 50, initialLabour - 80, initialLabour - 100].map((quick) => (
                    <button
                      key={quick}
                      type="button"
                      onClick={() => {
                        setSelectedQuickDiscount(quick);
                        setCounterAmount(String(quick));
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                        counterAmount === String(quick)
                          ? 'bg-[#ff6f00] text-white border-[#ff6f00]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Offer ₹{quick}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={counterAmount}
                      onChange={(e) => setCounterAmount(e.target.value)}
                      placeholder="Or enter custom amount..."
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-[#ff6f00]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSendCounter()}
                    className="h-10 px-4 rounded-xl bg-[#9e4200] text-white font-bold text-xs shadow-xs active:scale-95 transition-transform"
                  >
                    Send Counter
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                  <span className="text-slate-500 block">
                    Counter-offer sent: <strong className="text-slate-900 text-sm">₹{booking.counter.offered}</strong>
                  </span>

                  {booking.counter.response === 'ACCEPTED' && (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      {worker.name} accepted your rate of ₹{booking.counter.offered}!
                    </span>
                  )}

                  {booking.counter.response === 'DECLINED' && (
                    <span className="text-red-700 font-bold flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      {worker.name} maintained original rate of ₹{booking.estimate.labour}
                    </span>
                  )}

                  {!booking.counter.response && (
                    <span className="text-amber-700 font-medium flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 animate-pulse" />
                      Waiting for {worker.name}&apos;s response...
                    </span>
                  )}
                </div>

                {/* Demo Simulator Buttons */}
                {!booking.counter.response && (
                  <div className="p-2.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-1.5">
                    <span className="font-bold text-amber-900 block text-[11px]">
                      Demo Simulator:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => workerRespondToCounter(booking.id, true)}
                        className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                      >
                        Worker Accepts (₹{booking.counter.offered})
                      </button>
                      <button
                        type="button"
                        onClick={() => workerRespondToCounter(booking.id, false)}
                        className="py-1.5 px-2 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
                      >
                        Worker Holds (₹{initialLabour})
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Confirm Price Action */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleConfirmPrice}
                className="w-full h-12 rounded-full bg-gradient-to-r from-[#ff6f00] to-amber-500 text-white font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center justify-center gap-1.5"
              >
                <Lock className="w-4 h-4" />
                <span>
                  Confirm & Lock Fare (₹
                  {booking.counter?.response === 'ACCEPTED'
                    ? booking.counter.offered
                    : initialLabour}
                  )
                </span>
              </button>
            </div>
          </div>
        )}

      </PageTransition>
    </Screen>
  );
}
