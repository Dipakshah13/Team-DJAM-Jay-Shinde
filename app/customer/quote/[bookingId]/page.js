'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/hooks/useT';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { StatusStepper } from '@/components/domain/StatusStepper';
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
  Send,
  Ban,
  Clock,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export default function QuotePage() {
  const router = useRouter();
  const params = useParams();
  const t = useT();

  const bookingId = params?.bookingId;
  const bookings = useAppStore((state) => state.bookings) || [];
  const workers = useAppStore((state) => state.workers) || [];
  const sendCounterOffer = useAppStore((state) => state.sendCounterOffer);
  const workerRespondToCounter = useAppStore((state) => state.workerRespondToCounter);
  const confirmBookingPrice = useAppStore((state) => state.confirmBookingPrice);
  const cancelBooking = useAppStore((state) => state.cancelBooking);
  const setPriceAgreedByCustomer = useAppStore((state) => state.setPriceAgreedByCustomer);

  const booking = bookings.find((b) => b.id === bookingId);
  const worker = workers.find((w) => w.id === booking?.workerId);

  const [counterAmount, setCounterAmount] = useState('');
  const [selectedQuickDiscount, setSelectedQuickDiscount] = useState(null);

  // Auto-navigate to job tracking once worker accepts and price is confirmed
  useEffect(() => {
    if (booking?.status === 'CONFIRMED') {
      const timer = setTimeout(() => {
        router.push(`/customer/job/${booking.id}`);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [booking?.status, booking?.id, router]);

  if (!booking || !worker) {
    return (
      <Screen title="Quote & Negotiation" back>
        <div className="p-8 text-center text-sm text-slate-500">
          Booking not found. Please create a booking first.
        </div>
      </Screen>
    );
  }

  const isConfirmed = booking.status === 'CONFIRMED';
  const isCancelled = booking.status === 'CANCELLED';
  const hasCountered = booking.counter?.offered !== null;
  const initialLabour = booking.estimate?.labour || worker.baseFare || 350;
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

  const handleSendRequestAtBase = () => {
    setPriceAgreedByCustomer(booking.id);
    toast.success(`Request sent to ${worker.name} at ₹${initialLabour}!`);
  };

  const handleAcceptHeldRate = () => {
    confirmBookingPrice(booking.id, initialLabour);
    toast.success(`Accepted rate ₹${initialLabour}! Price locked.`);
  };

  const handleCancel = () => {
    const success = cancelBooking(booking.id);
    if (success) {
      toast.info('Booking request cancelled.');
      router.push('/customer/home');
    } else {
      toast.error('Could not cancel this booking.');
    }
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

        {/* Worker Mini Card — Honest Data (no fake stars) */}
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
                  <TrustBadge worker={worker} showDetailButton={false} />
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                  <span>{worker.role || 'Service Pro'}</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-700">
                    {worker.jobsDone ? `${worker.jobsDone} jobs` : 'New on platform'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                  <span>{worker.area} ({worker.distanceKm || '1.0'} km)</span>
                  <span>•</span>
                  <span className="text-[#ff6f00] font-bold">
                    ETA {worker.etaLabel || 'about 15 min'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={`tel:${worker.phone}`}
                aria-label={`Call ${worker.name}`}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-blue-700 hover:bg-slate-200 active:scale-95 transition-transform"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => toast.info(`Direct chat with ${worker.name} opened.`)}
                aria-label={`Chat with ${worker.name}`}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-blue-700 hover:bg-slate-200 active:scale-95 transition-transform"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 text-[11px] text-blue-900 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Police & Skill Vetted • {worker.area} Guild Verified</span>
          </div>
        </div>

        {/* Main Quote Breakdown Card */}
        <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-slate-100 overflow-hidden flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {isConfirmed ? 'Locked Total' : 'Estimated Total'}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#071c36] font-mono">
                  ₹{booking.finalPrice ? booking.finalPrice + initialParts : initialTotal}
                </span>
                <span className="text-xs text-slate-500">
                  (Labour ₹{booking.finalPrice || initialLabour} + Parts ₹{initialParts})
                </span>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold flex items-center gap-1">
              <Lock className="w-3 h-3 text-blue-600" />
              <span>{isConfirmed ? 'Price Locked' : 'Estimate Open'}</span>
            </div>
          </div>

          {/* Two-Tone Stacked Progress Bar */}
          <div className="space-y-1">
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-[#ff6f00] transition-all duration-700" style={{ width: '70%' }} />
              <div className="h-full bg-blue-400 transition-all duration-700" style={{ width: '30%' }} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold px-0.5">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#ff6f00]" />
                <span>Labour (₹{booking.finalPrice || initialLabour})</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Parts & Spares (₹{initialParts})</span>
              </div>
            </div>
          </div>
        </div>

        {/* DYNAMIC FLOW STATES */}
        {isCancelled ? (
          /* CANCELLED STATE */
          <div className="p-4 rounded-3xl bg-slate-100 border border-slate-200 text-slate-700 text-center space-y-3">
            <Ban className="w-8 h-8 text-slate-400 mx-auto" />
            <div>
              <p className="font-bold text-sm">Booking Request Cancelled</p>
              <p className="text-xs text-slate-500 mt-0.5">This booking has been cancelled and closed.</p>
            </div>
            <Button
              variant="outline"
              fullWidth
              onClick={() => router.push('/customer/home')}
            >
              Back to Home
            </Button>
          </div>
        ) : isConfirmed ? (
          /* CONFIRMED / PRICE LOCKED STATE */
          <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="text-sm font-bold block">
                  Price Locked 🔒 at ₹{booking.finalPrice}
                </span>
                <span className="text-xs text-emerald-800">
                  {worker.name} accepted the booking. Moving to live tracking...
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleCancel}
                className="h-11 rounded-full bg-white border border-slate-200 text-slate-600 font-semibold text-xs active:scale-95 transition-transform"
              >
                Cancel Request
              </button>
              <button
                type="button"
                onClick={() => router.push(`/customer/job/${booking.id}`)}
                className="h-11 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-transform"
              >
                <span>Go to Job</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : booking.status === 'COUNTERED' && !booking.counter?.response ? (
          /* COUNTERED — WAITING FOR WORKER TO RESPOND */
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 bg-amber-50 p-3 rounded-2xl border border-amber-200">
              <Clock className="w-5 h-5 text-amber-600 animate-spin shrink-0" />
              <div className="text-xs leading-snug">
                <span className="font-bold block">Counter-offer sent: ₹{booking.counter?.offered}</span>
                <span>Waiting for {worker.name} to respond from their terminal...</span>
              </div>
            </div>

            {/* Optional Demo shortcut visible only in DEMO mode */}
            {process.env.NEXT_PUBLIC_DEMO_SHORTCUTS === 'true' && (
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1">
                <span className="font-bold text-slate-600 block">Demo Shortcut: Act as {worker.name}</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => workerRespondToCounter(booking.id, true)}
                    className="py-1 bg-emerald-600 text-white rounded-lg font-bold"
                  >
                    Accept ₹{booking.counter?.offered}
                  </button>
                  <button
                    type="button"
                    onClick={() => workerRespondToCounter(booking.id, false)}
                    className="py-1 bg-slate-700 text-white rounded-lg font-bold"
                  >
                    Hold ₹{initialLabour}
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleCancel}
              className="w-full h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1 active:scale-95 transition-transform"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Cancel Request</span>
            </button>
          </div>
        ) : booking.status === 'COUNTERED' && booking.counter?.response === 'DECLINED' ? (
          /* COUNTERED — WORKER DECLINED (HELD ORIGINAL BASE RATE) */
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-200 space-y-3">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{worker.name} maintained original rate of ₹{initialLabour}</span>
              </div>
              <p className="text-amber-800 text-[11px]">
                The technician held their standard base fare. You can accept to proceed, or cancel the request.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleCancel}
                className="h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1 active:scale-95 transition-transform"
              >
                <span>Cancel Request</span>
              </button>
              <button
                type="button"
                onClick={handleAcceptHeldRate}
                className="h-11 rounded-full bg-gradient-to-r from-[#ff6f00] to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md active:scale-95 transition-transform"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Accept ₹{initialLabour} & Book</span>
              </button>
            </div>
          </div>
        ) : booking.status === 'REQUESTED' && booking.priceAgreedByCustomer ? (
          /* REQUESTED — CUSTOMER SENT REQUEST, WAITING FOR WORKER TO ACCEPT */
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
            <div className="flex items-center gap-2 text-blue-900 bg-blue-50 p-3.5 rounded-2xl border border-blue-200">
              <Clock className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
              <div className="text-xs leading-snug">
                <span className="font-bold block">Request sent at ₹{initialLabour}</span>
                <span>Waiting for {worker.name} to accept ticket...</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              className="w-full h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1 active:scale-95 transition-transform"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Cancel Request</span>
            </button>
          </div>
        ) : (
          /* REQUESTED — INITIAL OPEN NEGOTIATION SCREEN */
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

            <p className="text-xs text-slate-500 leading-relaxed">
              Accept base fare of ₹{initialLabour}, or propose a counter-offer once.
            </p>

            {/* Quick Negotiation Preset Chips */}
            <div className="grid grid-cols-3 gap-2">
              {[initialLabour - 30, initialLabour - 60, initialLabour - 90].map((quick) => (
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

            {/* Custom Counter Input */}
            <div className="flex items-center gap-2 pt-1">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  value={counterAmount}
                  onChange={(e) => {
                    setCounterAmount(e.target.value);
                    setSelectedQuickDiscount(null);
                  }}
                  placeholder="Custom offer"
                  className="w-full h-10 pl-7 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-heading outline-none focus:border-primary"
                />
              </div>

              <button
                type="button"
                onClick={() => handleSendCounter()}
                className="h-10 px-3.5 rounded-xl bg-[#0B1F3A] hover:bg-[#16335C] text-white font-bold text-xs flex items-center gap-1 active:scale-95 transition-transform shrink-0"
              >
                <Send className="w-3 h-3" />
                <span>Counter</span>
              </button>
            </div>

            {/* Action Buttons: Send at base fare OR Cancel */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={handleSendRequestAtBase}
                className="w-full h-12 rounded-full bg-gradient-to-r from-[#ff6f00] to-amber-500 text-white font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Send request at ₹{initialLabour}</span>
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="w-full h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs flex items-center justify-center gap-1 active:scale-95 transition-transform"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Cancel request</span>
              </button>
            </div>
          </div>
        )}

      </PageTransition>
    </Screen>
  );
}
