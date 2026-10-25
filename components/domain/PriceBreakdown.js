'use client';

import { useT } from '@/hooks/useT';
import { calculateReceipt } from '@/lib/pricing';
import clsx from 'clsx';
import { ShieldCheck } from 'lucide-react';

export function PriceBreakdown({
  estimate,
  finalLabourPrice,
  partsAmount,
  extras = [],
  highlightTotal = false,
  className = '',
}) {
  const t = useT();

  const receipt = calculateReceipt({
    estimate,
    finalLabourPrice,
    partsAmount,
    extras,
  });

  return (
    <div className={clsx('bg-white rounded-3xl p-5 border border-slate-100 shadow-card space-y-3', className)}>
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100">
        <span>Item Breakdown</span>
        <span>Amount (₹)</span>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-700">
        <span>{t('quote.labour')}</span>
        <span className="font-semibold text-heading">₹{receipt.labour}</span>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-700">
        <span>{t('quote.parts')}</span>
        <span className="font-semibold text-heading">₹{receipt.parts}</span>
      </div>

      {receipt.approvedExtras > 0 && (
        <div className="flex items-center justify-between text-sm text-emerald-700 bg-emerald-50/60 px-2 py-1.5 rounded-xl border border-emerald-100">
          <span>{t('receipt.approvedExtras')}</span>
          <span className="font-bold">+ ₹{receipt.approvedExtras}</span>
        </div>
      )}

      <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
        <div>
          <span className="text-sm font-bold text-heading block">
            {t('quote.total')}
          </span>
          <span className="text-[11px] text-muted">Cash on completion</span>
        </div>
        <span
          className={clsx(
            'text-2xl font-black',
            highlightTotal ? 'text-amber-600' : 'text-primary'
          )}
        >
          ₹{receipt.totalPayable}
        </span>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          Platform fee ({receipt.feeRatePercentage}% sample):
        </span>
        <span className="font-medium text-slate-600">₹{receipt.platformFee}</span>
      </div>
    </div>
  );
}
