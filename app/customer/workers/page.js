'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/hooks/useT';
import { SERVICES } from '@/data/services';
import { rankWorkers } from '@/lib/matching';
import { Screen } from '@/components/ui/Screen';
import { WorkerCard } from '@/components/domain/WorkerCard';
import { Badge } from '@/components/ui/Badge';
import { PageTransition } from '@/components/layout/PageTransition';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { toast } from 'sonner';
import {
  Zap,
  ShieldCheck,
  Award,
  Clock,
  Sparkles,
  MapPin,
  Star,
  CheckCircle2,
  X,
  Phone,
  ArrowRight,
  Filter
} from 'lucide-react';

function WorkersListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useT();

  const serviceId = searchParams.get('serviceId') || 'plumber';
  const description = searchParams.get('description') || 'Plumbing repair needed';
  const landmark = searchParams.get('landmark') || '';
  const scheduleType = searchParams.get('scheduleType') || 'NOW';
  const scheduleDate = searchParams.get('scheduleDate') || 'Today';
  const scheduleSlot = searchParams.get('scheduleSlot') || '';

  const [activeFilter, setActiveFilter] = useState('nearest');
  const [selectedWorkerForSheet, setSelectedWorkerForSheet] = useState(null);

  const schedule =
    scheduleType === 'SCHEDULED'
      ? {
          type: 'SCHEDULED',
          date: scheduleDate,
          slot: scheduleSlot,
          label: `${scheduleDate} · ${scheduleSlot || 'Flexible'}`,
        }
      : { type: 'NOW', label: 'Instant Help (~20 min)' };

  const workers = useAppStore((state) => state.workers);
  const createBooking = useAppStore((state) => state.createBooking);

  const service = SERVICES.find((s) => s.id === serviceId) || SERVICES[0];
  let ranked = rankWorkers(workers, serviceId);

  // Apply quick filter
  if (activeFilter === 'nearest') {
    ranked = [...ranked].sort((a, b) => (a.distanceKm || 1) - (b.distanceKm || 1));
  } else if (activeFilter === 'verified') {
    ranked = [...ranked].filter((w) => w.trustBadge?.type === 'VERIFIED' || w.societyVouches > 0);
  } else if (activeFilter === 'price') {
    ranked = [...ranked].sort((a, b) => (a.baseFare || 200) - (b.baseFare || 200));
  } else if (activeFilter === 'experience') {
    ranked = [...ranked].sort((a, b) => (b.experienceYears || 0) - (a.experienceYears || 0));
  }

  const handleSelectWorker = (worker) => {
    const bookingId = createBooking({
      serviceId,
      description,
      landmark,
      workerId: worker.id,
      schedule,
    });
    toast.success(`Booking created with ${worker.name}`);
    router.push(`/customer/quote/${bookingId}`);
  };

  return (
    <div className="space-y-4 max-w-sm mx-auto w-full pb-8">
      {/* Context Indicator Bar (Stitch S6) */}
      <div className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff6f00] animate-ping" />
            <span className="font-bold text-xs text-[#071c36]">
              {ranked.length} verified pros available
            </span>
            <span className="text-[11px] text-slate-400">· Step 2 of 3</span>
          </div>
          <Badge variant={schedule.type === 'SCHEDULED' ? 'accent' : 'default'} size="xs">
            {schedule.label}
          </Badge>
        </div>

        {/* Live Matching Tag */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-orange-50/80 border border-orange-100">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-5 h-5 rounded-full bg-[#ff6f00] text-white flex items-center justify-center text-xs flex-shrink-0">
              ⚡
            </span>
            <p className="text-[11px] font-semibold text-[#071c36] truncate">
              Instant dispatch ready <span className="text-slate-500 font-normal">for {service.labelKey ? t(service.labelKey) : 'Service'}</span>
            </p>
          </div>
          <span className="text-[10px] font-bold text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded-full flex-shrink-0">
            Khar-Bandra
          </span>
        </div>

        {/* Filter Chips Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <button
            type="button"
            onClick={() => setActiveFilter('nearest')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'nearest'
                ? 'bg-[#ff6f00] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>Nearest ({ranked[0]?.distanceKm || 1.2} km)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('verified')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'verified'
                ? 'bg-[#ff6f00] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Police Verified</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('price')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'price'
                ? 'bg-[#ff6f00] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>Lowest (₹{service.basePrice})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('experience')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'experience'
                ? 'bg-[#ff6f00] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>8+ Yrs Exp</span>
          </button>
        </div>
      </div>

      {/* Workers Cards */}
      {ranked.length > 0 ? (
        <div className="space-y-3">
          {ranked.map((worker, index) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              isTopMatch={index === 0}
              onSelect={() => handleSelectWorker(worker)}
              onOpenProfile={(w) => setSelectedWorkerForSheet(w)}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-card space-y-3">
          <p className="text-sm text-slate-600">
            {t('workers.noWorkers')}
          </p>
          <p className="text-xs text-slate-400">
            Tip: You can reset filters or toggle worker status in Demo Controls.
          </p>
        </div>
      )}

      {/* Guarantee Footer */}
      <footer className="pt-2 pb-4 flex flex-col items-center gap-1 text-center">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>100% money-back guarantee & 30-day service protection</span>
        </div>
        <span className="text-[10px] text-slate-400">
          Khar West · Bandra · Santa Cruz · Andheri
        </span>
      </footer>

      {/* Worker Detail Bottom Sheet Modal (Stitch S6) */}
      {selectedWorkerForSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-t-[32px] p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-slide-up">
            {/* Grabber */}
            <div className="w-12 h-1.5 rounded-full bg-slate-200 mx-auto" />

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedWorkerForSheet.avatar}
                  alt={selectedWorkerForSheet.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="font-bold text-base text-[#071c36]">
                    {selectedWorkerForSheet.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-blue-700 font-semibold mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Police & Aadhaar Verified</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Reaches in ~{selectedWorkerForSheet.etaMinutes || 20} min · {selectedWorkerForSheet.area}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWorkerForSheet(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Micro bio & credentials */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {(selectedWorkerForSheet.jobsDone || 0) > 5 ? '96% positive feedback' : 'New on platform'}
                </span>
                <span className="text-slate-600 font-bold">
                  {selectedWorkerForSheet.jobsDone || 0} jobs done
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Specialist in home repairs with {selectedWorkerForSheet.experienceYears || 2} years of field experience in {selectedWorkerForSheet.area || 'Mumbai'}. Verified on platform.
              </p>
            </div>

            {/* Verified Skills */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-[#071c36]">Verified Proficiencies</h4>
              <div className="flex flex-wrap gap-1.5">
                {(selectedWorkerForSheet.skills || ['Leakage', 'Piping', 'Fixtures', 'Emergency Clean']).map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-semibold"
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-[#071c36]">Recent Society Feedback</h4>
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 text-xs text-amber-900 italic">
                &ldquo;{selectedWorkerForSheet.reviewQuote || 'Punctual, carried genuine brass replacement washers and cleaned up completely.'}&rdquo;
                <span className="block not-italic font-bold text-[10px] text-amber-700 mt-1">
                  — Sea Breeze Co-op Society Member
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  const worker = selectedWorkerForSheet;
                  setSelectedWorkerForSheet(null);
                  handleSelectWorker(worker);
                }}
                className="w-full h-12 rounded-full bg-gradient-to-r from-[#ff6f00] to-amber-500 text-white font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <span>Confirm & Hire {selectedWorkerForSheet.name.split(' ')[0]} (₹{selectedWorkerForSheet.baseFare})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WorkersPage() {
  const t = useT();

  return (
    <Screen
      title="Nearby Verified Pros"
      subtitle="Ranked by skill, speed & vouches"
      back
      className="bg-[#f9f9ff]"
    >
      <PageTransition>
        <Suspense fallback={<CardSkeleton />}>
          <WorkersListContent />
        </Suspense>
      </PageTransition>
    </Screen>
  );
}
