'use client';

import { useState, useRef } from 'react';
import { useT } from '@/hooks/useT';
import { deriveWorkerPassport } from '@/lib/passport';
import { Badge } from '@/components/ui/Badge';
import {
  Award,
  Share2,
  CheckCircle2,
  Lock,
  Sparkles,
  ShieldCheck,
  Check,
  Star,
  History,
  Users,
  QrCode,
  Wrench,
  Flame,
  Droplets,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

export function PassportCard({ worker, bookings = [] }) {
  const t = useT();
  const cardRef = useRef(null);

  const [tilt, setTilt] = useState({ x: 0, y: 0, sheen: -100 });
  const [simulatedBonus, setSimulatedBonus] = useState(false);

  if (!worker) return null;

  const passport = deriveWorkerPassport(worker, bookings);
  const totalCompleted = passport.completedJobs + (simulatedBonus ? 1 : 0);

  // 3D Card Tilt physics
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;
    const tiltX = (yRatio - 0.5) * -16;
    const tiltY = (xRatio - 0.5) * 16;
    setTilt({
      x: tiltX,
      y: tiltY,
      sheen: xRatio * 200 - 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, sheen: -100 });
  };

  const handleShareVouch = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${origin}/vouch/${worker.id}`;
    const text = `Vouch for ${worker.name}'s verified Skill Passport on Book My Service: ${shareUrl}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      toast.success(t('passport.vouchCopied'));
    }

    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank');
    }
  };

  return (
    <div className="space-y-4 select-none pb-4">
      {/* Interactive Simulation Banner (from Stitch) */}
      <div className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative flex-shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-accent block" />
            <span className="w-2.5 h-2.5 rounded-full bg-accent absolute inset-0 animate-ping opacity-75" />
          </div>
          <div className="min-w-0 flex flex-col">
            <span className="text-xs font-bold text-accent truncate">
              Live Verified Passport
            </span>
            <span className="text-[11px] text-muted truncate">
              {simulatedBonus ? `Job #BMS-8421: +₹592 verified for ${worker.name}` : `Passport ID: BMS-0041-MH`}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSimulatedBonus(!simulatedBonus);
            toast.info(simulatedBonus ? 'Passport count reset' : 'Live job verified and logged!');
          }}
          className="px-2.5 py-1.5 rounded-full bg-primary text-white text-[10px] font-bold tracking-wider active:scale-95 transition-transform flex items-center gap-1 shadow-sm shrink-0"
        >
          <Zap className="w-3 h-3 text-accent" />
          <span>{simulatedBonus ? '-1 Reset' : '+1 Job Demo'}</span>
        </button>
      </div>

      {/* Holographic 3D Tilt Credential Card (from Stitch) */}
      <div className="space-y-1">
        <div className="flex justify-between items-center px-1">
          <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
            Official Credential Card
          </span>
          <span className="text-[11px] font-semibold text-secondary flex items-center gap-1">
            Tap or Tilt 3D
          </span>
        </div>

        {/* 3D Perspective Wrapper */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            perspective: '1000px',
            transform: `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg)`,
            background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 25%, #f093fb 50%, #f5576c 75%, #43e97b 100%)',
            backgroundSize: '300% 300%',
          }}
          className="relative w-full rounded-[24px] p-[2.5px] shadow-2xl transition-transform duration-150 ease-out cursor-grab active:cursor-grabbing"
        >
          {/* Card Dark Face */}
          <div className="relative w-full rounded-[22px] bg-gradient-to-br from-[#071324] via-[#0E2038] to-[#162B47] text-white p-4 overflow-hidden">
            {/* Specular Highlight Sheen */}
            <div
              style={{ transform: `translateX(${tilt.sheen}%)` }}
              className="absolute inset-0 pointer-events-none opacity-25 bg-gradient-to-tr from-transparent via-white to-transparent transition-transform duration-75"
            />

            {/* Saffron Glow Watermark */}
            <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full pointer-events-none opacity-15 blur-2xl bg-gradient-to-tr from-amber-500 via-cyan-400 to-amber-300" />

            {/* Passport Header */}
            <div className="flex items-center justify-between relative z-10 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-400 shadow-inner">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-white/90 tracking-widest uppercase font-bold">
                  Technician Passport
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-4 rounded bg-amber-400/90 flex items-center justify-center text-[#071324] font-bold text-[8px] shadow">
                  EMV
                </div>
              </div>
            </div>

            {/* Identity Block */}
            <div className="flex items-start gap-3 relative z-10">
              <div className="relative flex-shrink-0">
                <img
                  src={worker.avatar}
                  alt={worker.name}
                  className="w-14 h-14 rounded-2xl object-cover shadow-lg border-2 border-white/20"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                  <Check className="w-3 h-3" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-base font-bold text-white tracking-tight truncate">
                    {worker.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[9px] font-bold uppercase tracking-wider">
                    Tier 1 Pro
                  </span>
                </div>
                <p className="text-[11px] text-white/70 mt-0.5 truncate">
                  Master Plumbing • {worker.area} Guild
                </p>

                <div className="mt-1.5 flex items-center gap-2">
                  <div className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-bold text-white">
                      {totalCompleted} Completed Jobs
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Passport ID & Vetting Footer inside card */}
            <div className="mt-4 pt-2.5 border-t border-white/10 flex items-end justify-between relative z-10">
              <div className="flex flex-col">
                <span className="text-[9px] text-white/50 uppercase tracking-widest font-mono">
                  Passport Number
                </span>
                <span className="text-xs font-mono tracking-wider text-cyan-300 font-bold">
                  BMS-0041-MH
                </span>
                <span className="text-[9px] text-white/60 mt-0.5">
                  Valid thru 2026 • Verified by Mumbai Police
                </span>
              </div>

              {/* Micro SVG QR Code */}
              <div className="w-9 h-9 p-1 bg-white rounded-lg shadow-sm flex items-center justify-center flex-shrink-0">
                <QrCode className="w-7 h-7 text-slate-900" />
              </div>
            </div>

            {/* Trust Metric Capsule */}
            <div className="mt-2.5 py-1 px-2.5 rounded-full bg-emerald-500/15 flex items-center justify-between text-emerald-300 text-[10px] font-semibold">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> 99.2% Trust Rating
              </span>
              <span className="text-white/60">• 0 Active Disputes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rising Sheet Content (Stitch Bento Sections) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card space-y-5">
        {/* Section 1: Certified Proficiencies Bento Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-heading">
              Certified Proficiencies
            </h2>
            <span className="text-[11px] font-bold text-secondary">Skill Level 3</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Tile 1: Sanitary & Fixtures */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-accent">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="px-1.5 py-0.5 rounded-full bg-accent text-primary-dark font-bold text-[9px]">
                  TOP
                </span>
              </div>
              <div className="mt-2">
                <span className="text-xs font-bold text-heading block truncate">
                  Sanitary & Fixtures
                </span>
                <div className="flex items-center gap-1 text-amber-600 text-[11px] mt-0.5">
                  <Star className="w-3 h-3 fill-amber-500" />
                  <span className="font-bold">4.96</span>
                  <span className="text-slate-400 font-normal">({totalCompleted})</span>
                </div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-[10px] text-muted font-medium">Mastery</span>
                <span className="text-[10px] font-bold text-primary">
                  {totalCompleted} / 50 Jobs
                </span>
              </div>
            </div>

            {/* Tile 2: Pipe Fitting & Welds */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-secondary">
                  <Droplets className="w-4 h-4" />
                </div>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[9px]">
                  VOUCHED
                </span>
              </div>
              <div className="mt-2">
                <span className="text-xs font-bold text-heading block truncate">
                  Pipe Fitting & Welds
                </span>
                <div className="flex items-center gap-1 text-emerald-700 text-[10px] font-semibold mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Guild Certified</span>
                </div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-[10px] text-muted">Aadhaar Linked</span>
                <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
              </div>
            </div>

            {/* Tile 3: Leak Detection */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-800">
                  <Droplets className="w-4 h-4" />
                </div>
                <span className="text-[9px] text-cyan-900 bg-cyan-50 px-1.5 py-0.5 rounded font-bold">
                  98% FIX
                </span>
              </div>
              <div className="mt-2">
                <span className="text-xs font-bold text-heading block truncate">
                  Leak Detection
                </span>
                <span className="text-[10px] text-muted block">Acoustic & Pressure</span>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-[10px] text-muted">Completed</span>
                <span className="text-[10px] font-bold text-heading">38 Jobs</span>
              </div>
            </div>

            {/* Tile 4: Geyser & Heating */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                  <Flame className="w-4 h-4" />
                </div>
                <span className="text-[9px] text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded font-bold">
                  L2 SPEC
                </span>
              </div>
              <div className="mt-2">
                <span className="text-xs font-bold text-heading block truncate">
                  Geyser & Heating
                </span>
                <span className="text-[10px] text-muted block">Storage & Instant</span>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-[10px] text-muted">Completed</span>
                <span className="text-[10px] font-bold text-heading">15 Jobs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Accreditation Badges (Earned vs Locked) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-heading">
              Accreditation Badges
            </h2>
            <span className="text-[10px] font-semibold text-muted">3 Earned • 2 In Progress</span>
          </div>

          <div className="space-y-2">
            {/* Earned 1 */}
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-heading">Jaquar Official Specialist</span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-bold">
                      GOLD
                    </span>
                  </div>
                  <span className="text-[10px] text-muted block">
                    OEM Certified • ID #JAQ-882
                  </span>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>

            {/* Earned 2 */}
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-secondary flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-heading block">
                    Police Clearance & Background
                  </span>
                  <span className="text-[10px] text-muted block">
                    Verified by Mumbai Police #MH-MUM-8921
                  </span>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>

            {/* Locked Milestone */}
            <div className="p-2.5 rounded-2xl bg-slate-50/60 border border-dashed border-slate-200 opacity-75 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-700 block">
                    Commercial Boilers & Solar
                  </span>
                  <span className="text-[10px] text-muted block">
                    Requires 8 more high-pressure jobs to unlock
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-secondary">8 TO GO</span>
            </div>
          </div>
        </div>

        {/* Section 3: Community Vouches & WhatsApp Action */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-heading block">
                  {worker.vouches || 42} Local Vouches
                </span>
                <span className="text-[10px] text-muted block">
                  {worker.area} Community Guild
                </span>
              </div>
            </div>

            <div className="flex -space-x-2">
              <img
                className="w-6 h-6 rounded-full border border-white object-cover"
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
                alt="Voucher 1"
              />
              <img
                className="w-6 h-6 rounded-full border border-white object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Voucher 2"
              />
              <div className="w-6 h-6 rounded-full bg-secondary text-white text-[9px] font-bold flex items-center justify-center border border-white">
                +{worker.vouches || 40}
              </div>
            </div>
          </div>

          {/* WhatsApp Viral Share Button */}
          <button
            type="button"
            onClick={handleShareVouch}
            className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center gap-2 shadow-sm font-bold text-xs active:scale-[0.98] transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Vouch Link on WhatsApp</span>
          </button>
          <p className="text-[10px] text-center text-muted">
            Clients in {worker.area} can endorse your skill and reliability.
          </p>
        </div>
      </div>
    </div>
  );
}
