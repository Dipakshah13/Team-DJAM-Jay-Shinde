'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Sheet } from '@/components/ui/Sheet';
import { useT } from '@/hooks/useT';
import { CheckCircle2, XCircle, Info, ShieldCheck } from 'lucide-react';

export function TrustBadge({ worker, showDetailButton = true }) {
  const [showSheet, setShowSheet] = useState(false);
  const t = useT();

  if (!worker) return null;

  // Derive badge type: Verified -> Vouched -> New
  const isVerified = Boolean(worker.verified);
  const hasVouches = (worker.vouches || 0) > 0;

  const variant = isVerified ? 'verified' : hasVouches ? 'vouched' : 'new';
  const label = isVerified
    ? t('trust.verified')
    : hasVouches
    ? `${t('trust.vouched')} (${worker.vouches})`
    : t('trust.new');

  const checks = worker.checks || { phone: true, id: false, skillEvidence: false };

  return (
    <>
      <div className="inline-flex items-center gap-1.5">
        <Badge
          variant={variant}
          onClick={showDetailButton ? () => setShowSheet(true) : undefined}
          className={showDetailButton ? 'cursor-pointer hover:ring-1 hover:ring-slate-300' : ''}
        >
          {label}
        </Badge>
        {showDetailButton && (
          <button
            type="button"
            onClick={() => setShowSheet(true)}
            aria-label="View verification details"
            className="text-slate-400 hover:text-primary p-0.5 rounded-full"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Verification details bottom sheet */}
      <Sheet
        isOpen={showSheet}
        onClose={() => setShowSheet(false)}
        title={t('trust.whatChecked')}
        description={`Trust & verification breakdown for ${worker.name}`}
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-heading">
                Status: {label}
              </p>
              <p className="text-xs text-muted">
                {isVerified
                  ? 'All platform standards & evidence verified'
                  : hasVouches
                  ? 'Backed by verified community references'
                  : 'New provider on the platform'}
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <span className="text-sm font-medium text-slate-700">
                {t('trust.phoneChecked')}
              </span>
              {checks.phone ? (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" /> Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                  <XCircle className="w-4 h-4" /> Pending
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <span className="text-sm font-medium text-slate-700">
                {t('trust.idChecked')}
              </span>
              {checks.id ? (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" /> Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                  <XCircle className="w-4 h-4" /> Pending
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <span className="text-sm font-medium text-slate-700">
                {t('trust.skillChecked')}
              </span>
              {checks.skillEvidence ? (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" /> Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                  <XCircle className="w-4 h-4" /> Pending
                </span>
              )}
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/60 text-xs text-amber-900 leading-relaxed">
            <span className="font-semibold block mb-0.5">Community Note:</span>
            {t('trust.vouchNote')}
          </div>
        </div>
      </Sheet>
    </>
  );
}
