'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/hooks/useT';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { PageTransition } from '@/components/layout/PageTransition';
import {
  Handshake,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Share2,
  QrCode,
  Copy,
  Check,
  Star,
  ThumbsUp,
  X,
  ShieldCheck,
  MessageCircle,
  Zap,
  Award,
} from 'lucide-react';
import { toast } from 'sonner';

export default function VouchPage() {
  const router = useRouter();
  const params = useParams();
  const t = useT();

  const workerId = params?.workerId || 'w1';
  const workers = useAppStore((state) => state.workers);
  const vouchForWorker = useAppStore((state) => state.vouchForWorker);

  const worker = workers.find((w) => w.id === workerId) || workers[0];
  const [vouched, setVouched] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState('resident'); // 'resident' | 'share'

  const vouchUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/vouch/${worker.id}`
      : `https://bookmyservice.in/v/${worker.id}`;

  const handleVouch = () => {
    vouchForWorker(worker.id);
    setVouched(true);
    toast.success('धन्यवाद! Your vouch for ' + worker.name + ' was verified.');
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(vouchUrl).catch(() => {});
    }
    setCopied(true);
    toast.success('Link copied to clipboard! (लिंक कॉपी केली)');
    setTimeout(() => setCopied(false), 2200);
  };

  const shareText = `Namaste! ${worker.name} here from Book My Service. Could you kindly take 10 seconds to vouch for my ${worker.serviceId || 'home'} work? ${vouchUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <Screen
      title="Skill Passport Vouch"
      subtitle="Resident Endorsement Hub"
      back
      className="bg-[#061224]"
    >
      <PageTransition className="space-y-4 max-w-sm mx-auto w-full py-2">
        {/* View Mode Switcher Pill */}
        <div className="flex items-center justify-between p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => setMode('resident')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
              mode === 'resident'
                ? 'bg-gradient-to-r from-[#FFB020] to-[#FF6F00] text-white shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Resident View (नागरिक)
          </button>
          <button
            type="button"
            onClick={() => setMode('share')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
              mode === 'share'
                ? 'bg-gradient-to-r from-[#FFB020] to-[#FF6F00] text-white shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Share Link (शेअर करा)
          </button>
        </div>

        {/* Holographic Credential Preview Card (Stitch W8) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#061830] via-[#0E2F5E] to-[#081B38] p-4 text-white shadow-xl border border-white/10">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-300" />
              <span className="text-xs font-bold tracking-tight text-white">
                Skill Passport (कौशल्य पासपोर्ट)
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold tracking-wider">
              VERIFIED TIER-1
            </span>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/10 flex items-center justify-center shadow-inner border border-white/20 shrink-0">
              <img
                src={worker.avatar}
                alt={worker.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="text-base font-bold text-white truncate">
                {worker.name}
              </h2>
              <p className="text-xs text-cyan-200 font-mono">
                BMS-0041-MH • {worker.role || 'Master Technician'}
              </p>
              <div className="flex items-center gap-1 mt-1 text-amber-300 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                <span>
                  {worker.rating || '4.92'} ({worker.jobsDone || 312} Jobs) • {worker.area}
                </span>
              </div>
            </div>
          </div>

          {/* Score Ring Stat Block */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 bg-white/5 rounded-2xl p-2.5 text-center border border-white/5">
            <div>
              <span className="block text-sm font-black text-white">98%</span>
              <span className="block text-[10px] text-slate-300">Reliability</span>
            </div>
            <div>
              <span className="block text-sm font-black text-emerald-400">
                {(worker.vouches || 2) + (vouched ? 1 : 0)}
              </span>
              <span className="block text-[10px] text-slate-300">Vouches</span>
            </div>
            <div>
              <span className="block text-sm font-black text-amber-300">100%</span>
              <span className="block text-[10px] text-slate-300">Safety Clear</span>
            </div>
          </div>
        </div>

        {/* Rising Main Sheet (Stitch W8 Design) */}
        <div className="bg-[#f9f9ff] text-[#071c36] rounded-3xl p-5 shadow-2xl space-y-4">
          {mode === 'resident' ? (
            /* RESIDENT VOUCHING VIEW */
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#ff6f00] text-white flex items-center justify-center font-bold text-xs">
                  {worker.name.charAt(0)}
                </span>
                <div>
                  <h3 className="font-bold text-sm text-[#071c36]">
                    Was {worker.name} reliable for your home service?
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {worker.name} यांच्या कामाबद्दल आपली खात्रीची शिफारस द्या.
                  </p>
                </div>
              </div>

              {!vouched ? (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={handleVouch}
                      className="h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>100% Reliable (विश्वासू)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toast.info('Feedback noted for moderation review.')}
                      className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all"
                    >
                      <span>Needs check</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Takes only 10 seconds • No app download required</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-2 text-center animate-in fade-in zoom-in-95 duration-200">
                  <CheckCircle2 className="w-9 h-9 mx-auto text-emerald-600" />
                  <p className="text-sm font-bold">
                    Vouch Recorded! (शिफारस नोंदवली)
                  </p>
                  <p className="text-xs text-emerald-700 leading-snug">
                    You have successfully vouched for {worker.name}. This is logged on their tamper-proof Skill Passport for Mumbai gated communities.
                  </p>
                </div>
              )}

              {/* Existing Endorsements from Society */}
              <div className="pt-2 border-t border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Recent Society Endorsements
                  </span>
                  <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full">
                    Khar-Bandra
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 bg-white rounded-2xl border border-slate-100 shadow-xs flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      SS
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">Sunita Sharma</p>
                      <p className="text-[10px] text-slate-500 truncate">Sea Breeze CHS, Bandra</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                      &ldquo;100% Reliable&rdquo;
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-2xl border border-slate-100 shadow-xs flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      RK
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">Rajesh K.</p>
                      <p className="text-[10px] text-slate-500 truncate">Silver Beach Apts, Khar</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                      &ldquo;Very Polite&rdquo;
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* TECHNICIAN SHARE VIEW */
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#ff6f00]" />
                  <span className="text-[11px] uppercase font-bold text-[#ff6f00] tracking-wider">
                    Resident Endorsement
                  </span>
                </div>
                <h3 className="font-bold text-base text-[#071c36] mt-0.5">
                  Ask customer to vouch for you
                </h3>
                <p className="text-xs text-slate-500">
                  खात्रीची शिफारस मागा • Builds instant trust in gated societies
                </p>
              </div>

              {/* Milestone Progress Bar */}
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2 font-medium">
                <Award className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  Just <strong>+1 more vouch</strong> needed to unlock the prestigious <strong>Bandra Guild Gold Badge</strong>!
                </span>
              </div>

              {/* Giant WhatsApp Share CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-13 py-3 rounded-2xl bg-[#25D366] text-white flex items-center justify-between px-4 shadow-lg active:scale-95 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-extrabold text-white">Share on WhatsApp</p>
                    <p className="text-[10px] text-white/90">व्हॉट्सॲपवर पाठवा (Ready Marathi/EN msg)</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white" />
              </a>

              {/* Copy Link Row */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                <span className="flex-1 px-3 text-xs font-mono text-slate-600 truncate">
                  {vouchUrl}
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`h-9 px-3 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#ff6f00] text-white shadow-xs'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>

              {/* Quick Secondary Shares (QR & SMS) */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="h-11 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
                >
                  <QrCode className="w-4 h-4 text-blue-600" />
                  <span>Show QR Code (क्युआर कोड)</span>
                </button>

                <a
                  href={`sms:?body=${encodeURIComponent(shareText)}`}
                  className="h-11 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-[#ff6f00]" />
                  <span>Send via SMS (संदेश)</span>
                </a>
              </div>
            </div>
          )}

          {/* Transparency & Legal Note */}
          <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/60 text-[11px] text-slate-600 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-slate-800 block">
                Trust & Transparency Notice (पारदर्शकता नोंद)
              </span>
              A vouch is a personal reference from a resident, not a replacement for legal identity or police clearance. Police verification & criminal checks are maintained independently by Book My Service.
            </div>
          </div>
        </div>

        {/* Bottom Navigation Link */}
        <div className="pt-2 text-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/customer/home')}
            icon={ArrowRight}
            className="text-white/80 hover:text-white"
          >
            Go to Book My Service Home
          </Button>
        </div>
      </PageTransition>

      {/* QR Code Popup Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-[#071c36]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-white rounded-3xl p-6 text-center space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#ff6f00] flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-base text-[#071c36]">
                Ask Customer to Scan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ग्राहकाला फोनच्या कॅमेऱ्याने स्कॅन करायला सांगा
              </p>
            </div>

            {/* QR Mockup */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block">
              <div className="w-40 h-40 bg-white p-2 rounded-xl shadow-inner flex items-center justify-center">
                <QrCode className="w-36 h-36 text-slate-800" />
              </div>
            </div>

            <p className="text-[11px] font-mono text-slate-500">
              bms.in/v/{worker.id}
            </p>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full h-11 rounded-full bg-[#0B1F3A] text-white font-bold text-xs"
            >
              Done (झाले)
            </button>
          </div>
        </div>
      )}
    </Screen>
  );
}
