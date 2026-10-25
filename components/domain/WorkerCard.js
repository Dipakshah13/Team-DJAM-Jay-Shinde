'use client';

import { useT } from '@/hooks/useT';
import { TrustBadge } from '@/components/domain/TrustBadge';
import { calculateEta, formatEtaLabel } from '@/lib/matching';
import { ShieldCheck, Clock, MapPin, Briefcase, Award, ArrowRight, User, ThumbsUp } from 'lucide-react';
import clsx from 'clsx';

export function WorkerCard({
  worker,
  onSelect,
  onOpenProfile,
  isTopMatch = false,
}) {
  const t = useT();

  const jobsDone = worker.jobsDone || 0;
  const distance = worker.distanceKm ?? 1.5;
  const eta = worker.etaLabel || formatEtaLabel(calculateEta(distance));
  const expYears = worker.experienceYears || worker.yearsExp || 2;
  const positiveFeedback = jobsDone > 5 ? '96% positive' : 'New on platform';

  return (
    <article
      className={clsx(
        'worker-card relative flex flex-col rounded-3xl bg-white shadow-md p-4 transition-all duration-200 border',
        isTopMatch
          ? 'border-[#ff6f00]/60 ring-2 ring-[#ff6f00]/20 shadow-[0_12px_30px_-6px_rgba(255,111,0,0.15)]'
          : 'border-slate-100 hover:border-slate-200'
      )}
    >
      {/* Top Match / Trust Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isTopMatch && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-[#9e4200] text-xs font-bold shadow-xs">
              <Award className="w-3.5 h-3.5 text-[#ff6f00]" />
              <span>Top Match</span>
            </div>
          )}
          <TrustBadge worker={worker} showDetailButton={false} />
        </div>

        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>{eta}</span>
        </div>
      </div>

      {/* Worker Identity Row */}
      <div className="flex items-start gap-3">
        <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0 shadow-xs border border-slate-200">
          <img
            src={worker.avatar}
            alt={worker.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <h2 className="font-bold text-base text-[#071c36] truncate">
              {worker.name}
            </h2>
            <div className="text-right">
              <span className="font-extrabold text-base text-[#ff6f00]">
                ₹{worker.baseFare}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-blue-700 font-medium mt-0.5 truncate">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
            <span className="text-slate-600 font-medium">{worker.area || 'Mumbai'}</span>
            <span className="text-slate-400 font-normal">· {distance} km</span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {positiveFeedback}
            </span>
            <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
              Sample data
            </span>
          </div>
        </div>
      </div>

      {/* 3-Column Micro Stats Bar */}
      <div className="grid grid-cols-3 gap-1 my-3 py-2 px-2 rounded-xl bg-slate-50 text-center border border-slate-100">
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-slate-800">{jobsDone}</span>
          <span className="text-[10px] text-slate-400">Jobs done</span>
        </div>

        <div className="flex flex-col items-center border-l border-slate-200/60">
          <span className="text-xs font-bold text-slate-800">{expYears} yrs</span>
          <span className="text-[10px] text-slate-400">Experience</span>
        </div>

        <div className="flex flex-col items-center border-l border-slate-200/60">
          <span className="text-xs font-bold text-slate-800">{worker.vouches || 0}</span>
          <span className="text-[10px] text-slate-400">Vouches</span>
        </div>
      </div>

      {/* Service Highlights / Trust Chips */}
      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] text-slate-600 font-medium">
          Transparent billing
        </span>
        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] text-slate-600 font-medium">
          Direct payout
        </span>
        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] text-slate-600 font-medium">
          Zero commission
        </span>
      </div>

      {/* CTA Buttons */}
      <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onOpenProfile && onOpenProfile(worker)}
          className="px-3.5 h-11 rounded-full bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 active:scale-95 transition-all flex items-center gap-1"
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile</span>
        </button>

        <button
          type="button"
          onClick={onSelect}
          className="flex-1 h-11 rounded-full bg-gradient-to-r from-[#ff6f00] to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          <span>Book {worker.name.split(' ')[0]}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
}
