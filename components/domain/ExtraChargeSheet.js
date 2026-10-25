'use client';

import { Sheet } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { useT } from '@/hooks/useT';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export function ExtraChargeSheet({
  isOpen,
  extra,
  onApprove,
  onDecline,
}) {
  const t = useT();

  if (!extra) return null;

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onDecline}
      title={t('extra.title')}
      description={t('extra.workerRequested')}
    >
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-950">
              No-Surprise Billing Rule
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed">
              Workers cannot add extra charges to your bill without your explicit in-app confirmation.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs text-muted font-medium">{t('extra.reason')}</div>
          <div className="text-sm font-bold text-heading">
            {extra.reason || 'Additional parts / unforeseen labour'}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-muted font-medium">{t('extra.amount')}</span>
            <span className="text-xl font-black text-amber-600">
              + ₹{extra.amount}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onDecline}
            icon={XCircle}
            className="border-red-200 text-red-700 hover:bg-red-50"
          >
            {t('extra.decline')}
          </Button>
          <Button
            variant="accent"
            onClick={onApprove}
            icon={CheckCircle}
          >
            {t('extra.approve')}
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
