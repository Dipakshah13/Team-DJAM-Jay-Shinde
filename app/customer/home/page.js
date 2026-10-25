'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/hooks/useT';
import { SERVICES } from '@/data/services';
import { Screen } from '@/components/ui/Screen';
import { LanguageSwitch } from '@/components/layout/LanguageSwitch';
import { PageTransition } from '@/components/layout/PageTransition';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Mic,
  SlidersHorizontal,
  MapPin,
  ChevronDown,
  ShieldCheck,
  Zap,
  Wrench,
  Sparkles,
  ChevronRight,
  Star,
  CheckCircle2,
  PhoneCall,
  Users,
  Award,
  AlertTriangle,
  Clock,
  ArrowRight
} from 'lucide-react';

const TOP_RATED_PARTNERS = [
  {
    id: 'w1',
    name: 'Rajesh Shinde',
    role: 'Master Plumber',
    exp: '9 Yrs Exp',
    rating: 4.93,
    jobs: 342,
    serviceId: 'plumber',
    fee: 249,
    feeType: 'Visit fee',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=160&auto=format&fit=crop&q=80',
    tags: ['Verified', '82 Bandra Neighbors'],
    perk: 'Carries sanitized kit & shoe covers'
  },
  {
    id: 'w3',
    name: 'Sunita Mane',
    role: 'Deep Clean Specialist',
    exp: '6 Yrs Exp',
    rating: 4.97,
    jobs: 518,
    serviceId: 'cleaner',
    fee: 499,
    feeType: 'Fixed rate',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    tags: ['Verified', 'Top Pro 2024'],
    perk: '100% German eco-friendly detergents'
  },
  {
    id: 'w2',
    name: 'Amit Vernekar',
    role: 'Certified Wireman',
    exp: '8 Yrs Exp',
    rating: 4.88,
    jobs: 190,
    serviceId: 'electrician',
    fee: 199,
    feeType: 'Inspection',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    tags: ['Verified', 'Vouched'],
    perk: 'Specialist in inverter & modular switches'
  }
];

const BILINGUAL_SUBTITLES = {
  plumber: 'नल काम • प्लंबर',
  electrician: 'विद्युत • इलेक्ट्रीशियन',
  cleaner: 'घर स्वच्छता • क्लीनिंग',
  cook: 'घरगुती जेवण • रसोइया',
  maid: 'घरकाम मदत • बाई',
  painter: 'रंगकाम • पुताई'
};

const ARRIVAL_BADGES = {
  plumber: '20m arrive',
  electrician: 'Fast ⚡',
  cleaner: 'Popular 🔥',
  cook: 'Monthly 🍲',
  maid: 'Trusted 🛡️',
  painter: 'Inspect 🎨'
};

export default function CustomerHomePage() {
  const router = useRouter();
  const t = useT();
  const [search, setSearch] = useState('');
  const [isListening, setIsListening] = useState(false);

  const bookings = useAppStore((state) => state.bookings) || [];
  const activeBooking = bookings.find(
    (b) => !['COMPLETED', 'RATED', 'DECLINED', 'CANCELLED'].includes(b.status)
  );

  const filteredServices = SERVICES.filter((s) => {
    if (!search.trim()) return true;
    const label = t(s.labelKey).toLowerCase();
    const query = search.toLowerCase();
    return label.includes(query) || s.id.includes(query);
  });

  const handleVoiceSearch = () => {
    setIsListening(true);
    setTimeout(() => {
      setSearch('plumber');
      setIsListening(false);
    }, 1200);
  };

  return (
    <Screen hasNav className="bg-[#071c36] text-slate-900 pb-24">
      {/* Stitch Master Canopy Header */}
      <div className="relative -mx-4 -mt-4 bg-gradient-to-br from-[#071c36] via-[#1c5cb6] to-[#071c36] px-5 pt-4 pb-8 text-white shadow-xl overflow-hidden">
        {/* Glow ambient sphere */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6f00]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        {/* Top brand & language strip */}
        <div className="flex items-center justify-between relative z-10 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ff6f00] to-amber-400 flex items-center justify-center font-black text-white text-base shadow-md">
              B
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight">BookMyService</span>
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold text-amber-300">
                PRO
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitch compact />
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white">
              <span className="text-xs font-bold">👤</span>
            </div>
          </div>
        </div>

        {/* Hyperlocal location picker pill */}
        <div className="flex items-center justify-between relative z-10">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-xl text-white text-xs font-semibold shadow-sm active:scale-95 transition-transform"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span className="truncate max-w-[170px]">Bandra West, Mumbai</span>
            <ChevronDown className="w-3.5 h-3.5 text-white/70" />
          </button>
          <div className="text-right">
            <span className="text-white/60 text-[10px] uppercase tracking-wider font-semibold">Page</span>
            <span className="text-white font-bold text-xs ml-1">Explore</span>
          </div>
        </div>
      </div>

      {/* Main Curved Rising Body */}
      <div className="relative -mt-4 bg-[#f9f9ff] rounded-t-[32px] px-4 pt-5 pb-8 shadow-2xl space-y-5">
        <PageTransition className="space-y-5">

          {/* Search Bar with Micro Glassmorphism */}
          <div className="relative flex items-center w-full bg-white rounded-full shadow-[0_10px_30px_-5px_rgba(7,28,54,0.08)] px-3.5 py-1.5 min-h-[50px] border border-slate-100">
            <Search className="w-5 h-5 text-[#ff6f00] mr-2.5 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 'kitchen leak', 'cook for 4', 'deep clean'..."
              className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none truncate"
            />
            <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleVoiceSearch}
                aria-label="Voice search"
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-transform active:scale-95 ${
                  isListening ? 'bg-[#ff6f00] text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Filters"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-transform active:scale-95"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Saffron Hyperlocal Dispatch Badge */}
          <div className="flex items-center justify-between px-3.5 py-2 rounded-full bg-orange-50 border border-orange-100/80">
            <div className="flex items-center gap-2 truncate text-xs">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#ff6f00] text-white text-[10px] shadow-[0_0_8px_#ff6f00]">
                ⚡
              </span>
              <span className="text-slate-800 truncate">
                <strong className="font-bold text-[#9e4200]">In 15 Mins:</strong> Pali Hill & Bandra West
              </span>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800 whitespace-nowrap pl-2">
              <span className="w-2 h-2 rounded-full bg-[#ff6f00] animate-ping" />
              18 active pros
            </span>
          </div>

          {/* Active Booking Floating Card (if any ongoing) */}
          {activeBooking && (
            <div className="p-4 rounded-3xl bg-amber-50 border-2 border-amber-300 shadow-md space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff6f00] animate-ping" />
                  {t('home.activeBooking')}
                </span>
                <Badge variant="accent" size="xs">
                  {activeBooking.status}
                </Badge>
              </div>
              <p className="text-sm font-semibold text-slate-900 truncate">
                {activeBooking.description || 'Service job in progress'}
              </p>
              <Button
                size="sm"
                variant="accent"
                fullWidth
                onClick={() => {
                  if (['REQUESTED', 'COUNTERED'].includes(activeBooking.status)) {
                    router.push(`/customer/quote/${activeBooking.id}`);
                  } else {
                    router.push(`/customer/job/${activeBooking.id}`);
                  }
                }}
                icon={ChevronRight}
              >
                {t('home.viewJob')}
              </Button>
            </div>
          )}

          {/* Priority Care Emergency Repair Bento Card */}
          <section className="relative overflow-hidden w-full rounded-[28px] bg-gradient-to-br from-[#071c36] via-[#1c5cb6] to-[#071c36] text-white p-5 shadow-[0_14px_34px_-6px_rgba(7,28,54,0.28)]">
            <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-[#ff6f00]/30 blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  <span>Hyperlocal Response Unit</span>
                </div>
                <span className="text-[10px] text-white/80 uppercase tracking-widest font-black">
                  Priority Care
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white leading-tight mb-1">
                    Emergency Repair?
                  </h2>
                  <p className="text-xs text-white/80 line-clamp-2">
                    Tap for police-verified technician at your doorstep in 20 minutes.
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 text-amber-300">
                  <Zap className="w-6 h-6" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-white/90 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium">Standard ₹199 inspection fee</span>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/customer/book/plumber')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#ff6f00] to-amber-500 text-white font-bold text-xs shadow-[0_8px_20px_rgba(255,111,0,0.38)] active:scale-95 transition-transform"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>

          {/* 6 Core Services Bento Grid */}
          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-base font-bold text-[#071c36]">Book Essential Care</h3>
                <p className="text-xs text-slate-500">Tap to pick skilled & vetted household help</p>
              </div>
              <span className="text-xs font-semibold text-[#ff6f00]">6 Categories</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {filteredServices.map((service) => {
                const sub = BILINGUAL_SUBTITLES[service.id] || '';
                const badge = ARRIVAL_BADGES[service.id] || '~20m arrive';
                return (
                  <div
                    key={service.id}
                    onClick={() => router.push(`/customer/book/${service.id}`)}
                    className="group relative flex flex-col justify-between p-4 rounded-[26px] bg-white border border-slate-100 shadow-[0_10px_26px_-5px_rgba(7,28,54,0.06)] active:scale-95 transition-all cursor-pointer min-h-[148px]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-orange-50 text-[#ff6f00] flex items-center justify-center text-xl shadow-sm">
                        {service.icon}
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-700 font-bold">
                        {badge}
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="font-bold text-sm text-[#071c36] leading-tight">
                        {t(service.labelKey)}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {sub}
                      </div>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-sm font-extrabold text-[#9e4200]">
                          ₹{service.basePrice}
                        </span>
                        <span className="text-[10px] text-slate-400">start</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Safety & Neighborhood Trust Shield */}
          <section className="p-4 rounded-[28px] bg-gradient-to-br from-blue-50/70 to-indigo-50/50 border border-blue-100/60 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#071c36] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Neighborhood Safety Shield
              </span>
              <Badge variant="sample" size="xs">
                Verified
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white shadow-xs">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 truncate">
                    100% Mumbai Police & Aadhaar Verified
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Identity, local address & court clear record checks
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white shadow-xs">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 truncate">
                    Vouched by 14,200+ Bandra & Khar Homes
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Co-op Housing Societies endorse our partner pool daily
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Top Rated Partners Carousel */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-base font-bold text-[#071c36]">Top Rated in Bandra</h3>
                <p className="text-xs text-slate-500">Experienced pros rated 4.8+ by your neighbors</p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#ff6f00]">
                <span className="w-2 h-2 rounded-full bg-[#ff6f00]" />
                <span>Live near you</span>
              </div>
            </div>

            {/* Horizontal Scroll Deck */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar snap-x snap-mandatory">
              {TOP_RATED_PARTNERS.map((partner) => (
                <div
                  key={partner.id}
                  className="snap-center shrink-0 w-[270px] rounded-[26px] bg-white border border-slate-100 p-4 flex flex-col justify-between shadow-[0_12px_28px_-6px_rgba(7,28,54,0.08)]"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <img
                        src={partner.avatar}
                        alt={partner.name}
                        className="w-12 h-12 rounded-2xl object-cover shrink-0 bg-slate-100 border border-slate-200"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-[#071c36] truncate">
                          {partner.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          {partner.role} • {partner.exp}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="flex items-center text-amber-600 text-xs font-bold">
                            ★ {partner.rating}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({partner.jobs} jobs)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-slate-100">
                      {partner.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold"
                        >
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 truncate">
                      ⚡ {partner.perk}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                        {partner.feeType}
                      </span>
                      <span className="text-sm font-extrabold text-[#071c36]">
                        ₹{partner.fee}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push(`/customer/book/${partner.serviceId}`)}
                      className="px-3.5 py-1.5 rounded-full bg-[#9e4200] text-white font-bold text-xs shadow-sm active:scale-95 transition-transform"
                    >
                      Select Partner
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Zero Hidden Charges Promise Banner */}
          <section className="rounded-[26px] bg-slate-100 p-4 space-y-2 border border-slate-200/60">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-[#071c36]">Zero Hidden Charges Promise</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  What you see is what you pay. Standard rate card approved by Municipal Standards. 100% full refund if not satisfied.
                </p>
                <div className="grid grid-cols-2 gap-1.5 mt-2.5 text-[10px] text-slate-700 font-medium">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Standard rate card</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Digital UPI receipts</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>30-day service redo</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Insured up to ₹10,000</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Helpline desk */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-100 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-[#ff6f00] flex items-center justify-center">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Need help deciding?</p>
                <p className="text-[10px] text-slate-500">Talk with Bandra Service Care Desk</p>
              </div>
            </div>
            <a
              href="tel:18002674357"
              className="px-3 py-1 rounded-full bg-slate-100 text-[#9e4200] font-bold text-xs hover:bg-slate-200 transition-colors"
            >
              1800-BMS-HELP
            </a>
          </div>

        </PageTransition>
      </div>
    </Screen>
  );
}
