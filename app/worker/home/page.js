'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/hooks/useT';
import { Screen } from '@/components/ui/Screen';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { TrustBadge } from '@/components/domain/TrustBadge';
import { PageTransition } from '@/components/layout/PageTransition';
import { LanguageSwitch } from '@/components/layout/LanguageSwitch';
import { calculateReceipt } from '@/lib/pricing';
import { FEE_RATE } from '@/lib/constants';
import {
  MapPin,
  ArrowRight,
  Check,
  X,
  Award,
  Banknote,
  ShieldCheck,
  Wallet,
  Smartphone,
  Sparkles,
  Radar,
  Power,
  Zap,
  Clock,
  Star,
  CheckCircle2,
  TrendingUp,
  Headphones,
  Wrench,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export default function WorkerHomePage() {
  const router = useRouter();
  const t = useT();

  const [showWalletModal, setShowWalletModal] = useState(false);
  const [activeStreamTab, setActiveStreamTab] = useState('incoming'); // 'incoming' | 'countered' | 'radar'
  const [countdown, setCountdown] = useState(24);

  const activeWorkerId = useAppStore((state) => state.activeWorkerId) || 'w1';
  const workers = useAppStore((state) => state.workers);
  const bookings = useAppStore((state) => state.bookings) || [];
  const workerPayouts = useAppStore((state) => state.workerPayouts) || [];
  const toggleWorkerOnline = useAppStore((state) => state.toggleWorkerOnline);
  const workerAcceptBooking = useAppStore((state) => state.workerAcceptBooking);
  const workerDeclineBooking = useAppStore((state) => state.workerDeclineBooking);
  const workerRespondToCounter = useAppStore((state) => state.workerRespondToCounter);
  const withdrawWorkerBalance = useAppStore((state) => state.withdrawWorkerBalance);

  const worker = workers.find((w) => w.id === activeWorkerId) || workers[0];

  // Incoming & Countered requests for this worker
  const incomingBookings = bookings.filter(
    (b) => b.workerId === worker.id && b.status === 'REQUESTED'
  );
  const counteredBookings = bookings.filter(
    (b) => b.workerId === worker.id && b.status === 'COUNTERED'
  );

  // Active in-progress job for this worker
  const activeJob = bookings.find(
    (b) => b.workerId === worker.id && ['CONFIRMED', 'STARTED', 'EXTRA_PENDING'].includes(b.status)
  );

  // Completed jobs & Earnings computed via calculateReceipt & FEE_RATE
  const completedJobs = bookings.filter(
    (b) => b.workerId === worker.id && (b.status === 'COMPLETED' || b.status === 'RATED')
  );

  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const sevenDaysMs = 7 * oneDayMs;

  const getJobReceipt = (b) =>
    calculateReceipt({
      estimate: b.estimate,
      finalLabourPrice: b.finalPrice,
      partsAmount: b.estimate?.parts || 0,
      extras: b.extras,
    });

  const totalGross = completedJobs.reduce(
    (sum, b) => sum + getJobReceipt(b).totalPayable,
    0
  );
  const totalFee = completedJobs.reduce(
    (sum, b) => sum + getJobReceipt(b).platformFee,
    0
  );
  const totalNet = completedJobs.reduce(
    (sum, b) => sum + getJobReceipt(b).workerPayout,
    0
  );

  const todayJobs = completedJobs.filter(
    (b) => now - (b.completedAt || b.createdAt || 0) < oneDayMs
  );
  const todayEarnings = todayJobs.reduce(
    (sum, b) => sum + getJobReceipt(b).workerPayout,
    0
  );

  const weekJobs = completedJobs.filter(
    (b) => now - (b.completedAt || b.createdAt || 0) < sevenDaysMs
  );
  const weekEarnings = weekJobs.reduce(
    (sum, b) => sum + getJobReceipt(b).workerPayout,
    0
  );

  const workerTransfers = (workerPayouts || []).filter((p) => p.workerId === worker.id);
  const totalWithdrawn = workerTransfers.reduce((sum, p) => sum + p.amount, 0);

  const availableBalance = Math.max(0, totalNet - totalWithdrawn);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 30));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleWithdraw = () => {
    toast.info('Coming soon in the full version');
  };

  return (
    <Screen
      rightAction={<LanguageSwitch compact />}
      hasNav
      className="bg-surface"
    >
      <PageTransition className="space-y-0 max-w-sm mx-auto w-full pb-4">
        {/* Navy Atmospheric Hero Canopy (Exact Stitch Theme) */}
        <div className="relative bg-gradient-to-b from-[#061120] via-[#0B1F3A] to-[#0F294D] px-4 pt-3 pb-8 text-white rounded-3xl overflow-hidden shadow-xl">
          {/* Ambient Glows */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
          <div className="absolute top-28 -left-12 w-40 h-40 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

          {/* Top Bar: Worker Profile & Metrics */}
          <div className="relative z-10 flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={worker.avatar}
                  alt={worker.name}
                  className="w-12 h-12 rounded-full object-cover p-0.5 bg-white/20 shadow-md ring-2 ring-white/10"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-[#0B1F3A] ${
                    worker.online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'
                  }`}
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base font-extrabold text-white truncate tracking-tight">
                    Namaste, {worker.name}
                  </h1>
                  <span className="text-sm">👋</span>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                  <span>{worker.services?.[0] || 'Professional'}</span>
                  <span className="opacity-50">•</span>
                  <span className="text-amber-300 font-medium">{worker.area}</span>
                </p>
              </div>
            </div>

            {/* Quick Metrics Pill */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span className="text-[11px] font-semibold text-white">6h 20m</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-slate-300">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>Tier 1 Pro</span>
              </div>
            </div>
          </div>

          {/* Master Interactive Online / Offline Slider Switch Card */}
          <div className="relative z-10 rounded-2xl p-4 bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`relative w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    worker.online ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-400'
                  }`}
                >
                  {worker.online && (
                    <span className="absolute inset-0 rounded-xl bg-emerald-500/25 animate-ping opacity-75" />
                  )}
                  {worker.online ? (
                    <Radar className="w-6 h-6 animate-spin duration-3000" />
                  ) : (
                    <Power className="w-5 h-5" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        worker.online ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
                      }`}
                    />
                    <p className="text-sm font-bold text-white tracking-tight">
                      {worker.online ? "You're Online" : "You're Offline"}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-300 truncate mt-0.5">
                    {worker.online
                      ? `Customers in ${worker.area} can see you`
                      : 'Tap lever to start receiving jobs'}
                  </p>
                </div>
              </div>

              {/* Physical Animated Switch Toggle */}
              <button
                type="button"
                onClick={() => {
                  toggleWorkerOnline(worker.id);
                  toast.info(
                    worker.online
                      ? 'You are now Offline. No new tickets will arrive.'
                      : 'You are now Online and receiving job tickets!'
                  );
                }}
                className={`relative w-16 h-9 rounded-full p-1 transition-colors duration-300 shrink-0 shadow-inner ${
                  worker.online ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`block w-7 h-7 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                    worker.online ? 'translate-x-7 text-emerald-600' : 'translate-x-0 text-slate-400'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                </span>
              </button>
            </div>

            {/* Quick Safety & Zone Sub-bar */}
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Coverage: 3.5 km radius</span>
              </div>
              <div className="flex items-center gap-1 text-amber-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Safety Protocol Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rising Sheet Container (Tactile Light Surface Base from Stitch) */}
        <div className="relative -mt-4 rounded-t-[32px] bg-surface px-4 pt-4 pb-6 flex flex-col gap-4 shadow-[0_-8px_24px_rgba(7,28,54,0.06)]">
          {/* Active Job in Progress (Sticky Priority Banner) */}
          {activeJob && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-accent shadow-md space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Ticket In-Progress
                </span>
                <Badge variant="accent" size="xs">
                  {activeJob.status}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-bold text-heading">
                  {activeJob.description}
                </p>
                {activeJob.landmark && (
                  <p className="text-xs text-amber-900 mt-1 flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <strong>Landmark:</strong> {activeJob.landmark}
                  </p>
                )}
              </div>

              <Button
                size="sm"
                variant="accent"
                fullWidth
                onClick={() => router.push(`/worker/job/${activeJob.id}`)}
                icon={ArrowRight}
              >
                Open Job Terminal (OTPs & Proof)
              </Button>
            </div>
          )}

          {/* Incentive Streak Floating Banner (from Stitch) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-[#0F2A4A] to-[#1B5BB5] p-3.5 text-white shadow-card">
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full">
                      Rush Bonus
                    </span>
                    <span className="text-[10px] text-slate-300">Ends in 2h 40m</span>
                  </div>
                  <p className="text-xs font-bold text-white mt-0.5">
                    Complete 2 more jobs for ₹300 cash
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center text-xs font-extrabold shadow-sm">
                2/4
              </div>
            </div>
            <div className="relative z-10 w-full bg-black/30 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full w-1/2" />
            </div>
          </div>

          {/* Worker Daily Performance Bento Grid (Stitch 3-Column Asymmetric Grid) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-heading">
                  Performance & Wallet
                </h2>
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              </div>

              <button
                type="button"
                onClick={() => setShowWalletModal(true)}
                className="text-[11px] font-semibold text-secondary hover:text-primary flex items-center gap-0.5"
              >
                <span>Detailed Passbook</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* 3 Bento Tiles */}
            <div className="grid grid-cols-3 gap-2">
              {/* Tile 1: Today */}
              <div className="rounded-2xl bg-white p-3 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-muted">Today</span>
                    <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-base font-black text-heading mt-1">
                    ₹{todayEarnings}
                  </p>
                </div>
                <div className="flex items-center gap-0.5 mt-1 text-emerald-600 font-bold text-[10px]">
                  <TrendingUp className="w-3 h-3" />
                  <span>+24%</span>
                </div>
              </div>

              {/* Tile 2: Withdrawable Wallet */}
              <div
                onClick={() => setShowWalletModal(true)}
                className="rounded-2xl bg-white p-3 border-2 border-amber-200/60 shadow-sm flex flex-col justify-between cursor-pointer hover:border-accent transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-muted">Wallet</span>
                  <Wallet className="w-3.5 h-3.5 text-accent" />
                </div>
                <div>
                  <p className="text-base font-black text-amber-900 mt-1">
                    ₹{availableBalance}
                  </p>
                  <p className="text-[9px] text-emerald-700 font-semibold truncate">
                    Instant Payout →
                  </p>
                </div>
              </div>

              {/* Tile 3: Jobs & Rating */}
              <div
                onClick={() => router.push('/worker/passport')}
                className="rounded-2xl bg-white p-3 border border-slate-100 shadow-sm flex flex-col justify-between cursor-pointer hover:border-primary transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-muted">Jobs</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <p className="text-base font-black text-heading mt-1">
                    {worker.jobsDone + completedJobs.length}
                  </p>
                </div>
                <div className="flex items-center gap-0.5 mt-1 text-emerald-700 text-[10px] font-bold">
                  <span className="bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    98% positive
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Dispatch Stream with Segment Filter Switcher (from Stitch) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
                <h2 className="text-sm font-bold text-heading">
                  Dispatch Stream
                </h2>
              </div>

              {/* Tabs */}
              <div className="inline-flex p-0.5 rounded-full bg-slate-100 shadow-inner">
                <button
                  type="button"
                  onClick={() => setActiveStreamTab('incoming')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                    activeStreamTab === 'incoming'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Incoming ({incomingBookings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStreamTab('countered')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                    activeStreamTab === 'countered'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Countered ({counteredBookings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStreamTab('radar')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                    activeStreamTab === 'radar'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Radar
                </button>
              </div>
            </div>

            {/* TAB 1: INCOMING REQUESTS */}
            {activeStreamTab === 'incoming' && (
              <div className="space-y-3">
                {incomingBookings.length > 0 ? (
                  incomingBookings.map((b) => (
                    <div
                      key={b.id}
                      className="relative rounded-2xl bg-white p-4 border border-slate-200 shadow-card flex flex-col gap-3"
                    >
                      {/* Header & Circular Countdown Timer */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                            <Wrench className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-sm font-bold text-heading truncate">
                                {b.description}
                              </span>
                              <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[9px] font-bold uppercase">
                                Urgent
                              </span>
                            </div>
                            <p className="text-[11px] text-muted mt-0.5">
                              Nearby Household • 1.2 km away
                            </p>
                          </div>
                        </div>

                        {/* Circular Countdown Timer */}
                        <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-slate-100"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            />
                            <path
                              className="text-accent transition-all duration-1000 ease-linear"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeDasharray="100, 100"
                              strokeDashoffset={100 - (countdown / 30) * 100}
                              strokeLinecap="round"
                              strokeWidth="3.2"
                            />
                          </svg>
                          <span className="absolute text-[11px] font-bold text-primary font-mono">
                            {countdown}s
                          </span>
                        </div>
                      </div>

                      {/* Highlight Landmark Note Pill (Exact Stitch Style) */}
                      {b.landmark && (
                        <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 px-3 py-2 flex items-start gap-2 text-xs text-amber-950 font-medium">
                          <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <span>
                            <strong>Landmark:</strong> {b.landmark}
                          </span>
                        </div>
                      )}

                      {/* Price & Split Details */}
                      <div className="rounded-xl bg-slate-50 p-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted font-medium">Offered Payout:</span>
                          <span className="text-base font-black text-heading">
                            ₹{b.estimate?.labour}
                          </span>
                        </div>
                        <span className="text-[11px] text-muted">
                          Labour ₹{b.estimate?.labour} + Parts ₹{b.estimate?.parts}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            workerDeclineBooking(b.id);
                            toast.info('Ticket passed.');
                          }}
                          className="h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 transition-transform"
                        >
                          <X className="w-4 h-4 text-slate-500" />
                          <span>Pass</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            workerAcceptBooking(b.id);
                            toast.success(`Accepted job! Price locked at ₹${b.estimate?.labour}`);
                            router.push(`/worker/job/${b.id}`);
                          }}
                          className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept (₹{b.estimate?.labour})</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center bg-white rounded-2xl border border-slate-100 shadow-sm space-y-1">
                    <p className="text-xs text-muted">No pending job requests right now.</p>
                    <p className="text-[11px] text-slate-400">
                      Stay <strong className="text-emerald-600">Online</strong> to receive nearby requests.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: COUNTERED REQUESTS */}
            {activeStreamTab === 'countered' && (
              <div className="space-y-3">
                {counteredBookings.length > 0 ? (
                  counteredBookings.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-2xl bg-white p-4 border border-blue-200 shadow-card space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          Price Negotiation Counter
                        </span>
                        <span className="text-[11px] text-accent font-bold">
                          Customer Counter
                        </span>
                      </div>

                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-heading">
                            {b.description}
                          </h4>
                          <p className="text-[11px] text-muted mt-0.5">
                            Customer Landmark: {b.landmark || 'Nearby'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] line-through text-slate-400 block">
                            ₹{b.estimate?.labour}
                          </span>
                          <span className="text-lg font-black text-emerald-600">
                            ₹{b.counter?.offered}
                          </span>
                        </div>
                      </div>

                      {b.counter?.response === 'DECLINED' ? (
                        <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 flex items-center justify-between border border-slate-200">
                          <span className="font-semibold">Rate held at ₹{b.estimate?.labour}</span>
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                            Waiting for customer decision
                          </span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              workerRespondToCounter(b.id, false);
                              toast.info(`Held original base fare ₹${b.estimate?.labour}`);
                            }}
                          >
                            Hold ₹{b.estimate?.labour}
                          </Button>
                          <Button
                            size="sm"
                            variant="accent"
                            onClick={() => {
                              workerRespondToCounter(b.id, true);
                              toast.success(`Accepted counter of ₹${b.counter?.offered}!`);
                              router.push(`/worker/job/${b.id}`);
                            }}
                            icon={Check}
                          >
                            Accept ₹{b.counter?.offered}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center bg-white rounded-2xl border border-slate-100 shadow-sm space-y-1">
                    <p className="text-xs text-muted">No active counter-offers at the moment.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: RADAR SCANNER VIEW (Concentric Pulsing circles from Stitch) */}
            {activeStreamTab === 'radar' && (
              <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm flex flex-col items-center text-center">
                <div className="relative w-32 h-32 flex items-center justify-center my-2">
                  <div className="absolute inset-0 rounded-full bg-blue-100/60 animate-ping opacity-60" />
                  <div className="absolute w-24 h-24 rounded-full bg-blue-100 animate-pulse" />
                  <div className="absolute w-16 h-16 rounded-full bg-blue-200/50" />
                  <div className="relative z-10 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                    <Radar className="w-6 h-6 animate-spin duration-3000" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-heading mt-2">
                  Scanning {worker.area} & Nearby Hubs
                </h3>
                <p className="text-xs text-muted mt-1 max-w-[240px]">
                  Searching within 3.5 km. You have top algorithmic priority for incoming tickets.
                </p>

                <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200/80 px-3 py-2 flex items-center gap-2 text-left">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <p className="text-[11px] text-amber-950 font-medium">
                    <strong>Hotspot Tip:</strong> Work orders increase 2x between 5 PM – 8 PM.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Partner Shortcuts Bento Bar (from Stitch) */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="rounded-2xl bg-white p-3 border border-slate-100 flex items-center gap-2.5 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-heading truncate">Partner Helpline</p>
                <p className="text-[10px] text-muted">Instant 24x7 call</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-3 border border-slate-100 flex items-center gap-2.5 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-heading truncate">Tool Box & Parts</p>
                <p className="text-[10px] text-muted">Stock ledger</p>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>

      {/* Worker Wallet & Payout Sheet Modal */}
      <Sheet
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        title={t('wallet.title')}
        description="Instant payout — roadmap preview • Daily job earnings computed from completed jobs."
      >
        <div className="space-y-4">
          {/* Large Balance Card */}
          <div className="p-5 rounded-3xl bg-primary text-white text-center space-y-3 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Wallet className="w-24 h-24" />
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full">
                Instant payout — roadmap preview
              </span>
            </div>

            <div className="text-4xl font-black text-amber-400 font-mono tracking-tight">
              ₹{availableBalance}
            </div>

            <p className="text-xs text-slate-300 font-mono">
              Linked UPI: {worker.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@okhdfcbank
            </p>

            <button
              type="button"
              onClick={handleWithdraw}
              disabled={availableBalance <= 0}
              className={`w-full py-3 px-4 rounded-full font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 ${
                availableBalance > 0
                  ? 'bg-accent text-primary-dark hover:bg-accent-hover'
                  : 'bg-white/20 text-white/50 cursor-not-allowed'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>{t('wallet.withdrawBtn')}</span>
            </button>
          </div>

          {/* Breakdown Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>{t('wallet.totalGross')}</span>
              <span className="font-semibold text-heading">₹{totalGross}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>{t('wallet.platformFee')}</span>
              <span className="font-semibold">- ₹{totalFee}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-emerald-800 text-sm">
              <span>{t('wallet.netEarnings')}</span>
              <span>₹{totalNet}</span>
            </div>
          </div>

          {/* Recent Payout Transfers */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {t('wallet.payoutHistory')}
            </span>

            {workerTransfers.length > 0 ? (
              <div className="space-y-2">
                {workerTransfers.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-white rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-heading flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Transferred to UPI</span>
                      </div>
                      <span className="text-[11px] text-muted font-mono">{p.upiId}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-emerald-700 block">₹{p.amount}</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-white rounded-2xl border border-slate-100 text-center text-xs text-muted">
                No past withdrawals recorded yet.
              </div>
            )}
          </div>
        </div>
      </Sheet>
    </Screen>
  );
}
