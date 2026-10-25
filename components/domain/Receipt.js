'use client';

import { useState } from 'react';
import { useT } from '@/hooks/useT';
import { calculateReceipt } from '@/lib/pricing';
import { CheckCircle2, Banknote, ShieldCheck, QrCode, Smartphone, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';

export function Receipt({
  estimate,
  finalLabourPrice,
  partsAmount,
  extras = [],
  workerName,
  bookingId,
  initialPayment,
  onPaymentSuccess,
}) {
  const t = useT();

  const receipt = calculateReceipt({
    estimate,
    finalLabourPrice,
    partsAmount,
    extras,
  });

  const [paymentMode, setPaymentMode] = useState(initialPayment?.mode || 'CASH'); // 'CASH' | 'UPI'
  const [isUpiPaid, setIsUpiPaid] = useState(initialPayment?.status === 'PAID');
  const [selectedApp, setSelectedApp] = useState('gpay');

  const workerVpa = `${(workerName || 'worker').toLowerCase().replace(/[^a-z0-9]/g, '')}@okhdfcbank`;

  const handleSimulateUpi = () => {
    setIsUpiPaid(true);
    toast.success(t('payment.simulatedSuccess', { amount: receipt.totalPayable }) || `Paid ₹${receipt.totalPayable} via UPI!`);
    if (onPaymentSuccess) {
      onPaymentSuccess({ mode: 'UPI', status: 'PAID' });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-card space-y-4">
      {/* Header */}
      <div className="flex flex-col items-center text-center pb-3 border-b border-dashed border-slate-200">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-heading">
          {t('receipt.title')}
        </h3>
        <p className="text-xs text-muted mt-0.5">
          {paymentMode === 'CASH' ? t('receipt.payMode') : 'Payment Mode: Instant UPI'}
        </p>
      </div>

      {/* Payment Mode Selector */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          {t('payment.method')}
        </span>
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setPaymentMode('CASH')}
            className={clsx(
              'py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all',
              paymentMode === 'CASH'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <Banknote className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('payment.cash')}</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMode('UPI')}
            className={clsx(
              'py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all',
              paymentMode === 'UPI'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <QrCode className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('payment.upi')}</span>
          </button>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2 text-sm text-slate-700">
        <div className="flex justify-between">
          <span>{t('receipt.labour')}</span>
          <span className="font-semibold text-heading">₹{receipt.labour}</span>
        </div>

        <div className="flex justify-between">
          <span>{t('receipt.parts')}</span>
          <span className="font-semibold text-heading">₹{receipt.parts}</span>
        </div>

        {receipt.approvedExtras > 0 && (
          <div className="flex justify-between text-emerald-700">
            <span>{t('receipt.approvedExtras')}</span>
            <span className="font-semibold">+ ₹{receipt.approvedExtras}</span>
          </div>
        )}
      </div>

      {/* Total Amount to Pay */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Banknote className="w-5 h-5 text-amber-600" />
          <span className="text-sm font-bold text-amber-950">
            {t('receipt.totalPaid')}
          </span>
        </div>
        <span className="text-2xl font-black text-amber-900">
          ₹{receipt.totalPayable}
        </span>
      </div>

      {/* UPI / QR Code Box when UPI is selected */}
      {paymentMode === 'UPI' && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-200 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-blue-600" />
              Dynamic UPI QR
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
              NPCI Zero-Fee
            </span>
          </div>

          {!isUpiPaid ? (
            <div className="space-y-3">
              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-blue-100 shadow-sm">
                <div className="w-36 h-36 bg-slate-900 p-2.5 rounded-xl flex items-center justify-center relative">
                  {/* Procedural clean QR code visual */}
                  <div className="w-full h-full bg-white p-1 rounded grid grid-cols-6 grid-rows-6 gap-1">
                    <div className="col-span-2 row-span-2 bg-slate-950 rounded-sm" />
                    <div className="col-span-2 bg-slate-950" />
                    <div className="col-span-2 row-span-2 bg-slate-950 rounded-sm" />
                    <div className="row-span-2 bg-slate-950" />
                    <div className="col-span-2 row-span-2 bg-blue-600 rounded-sm flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <div className="row-span-2 bg-slate-950" />
                    <div className="col-span-2 row-span-2 bg-slate-950 rounded-sm" />
                    <div className="col-span-2 bg-slate-950" />
                    <div className="col-span-2 row-span-2 bg-slate-950 rounded-sm" />
                  </div>
                </div>
                <p className="text-[11px] font-bold text-slate-700 mt-2 font-mono">
                  {workerVpa}
                </p>
                <p className="text-[10px] text-muted">
                  {t('payment.scanQr')}
                </p>
              </div>

              {/* Quick UPI App Launchers */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">
                  Or Open UPI App
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'gpay', label: 'GPay', color: 'hover:border-blue-500' },
                    { id: 'phonepe', label: 'PhonePe', color: 'hover:border-purple-500' },
                    { id: 'paytm', label: 'Paytm', color: 'hover:border-cyan-500' },
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedApp(app.id)}
                      className={clsx(
                        'py-1.5 px-2 rounded-xl text-xs font-bold border transition-all text-center',
                        selectedApp === app.id
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      )}
                    >
                      {app.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulate Instant Payment Button */}
              <button
                type="button"
                onClick={handleSimulateUpi}
                className="w-full py-2.5 px-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Smartphone className="w-4 h-4" />
                <span>Simulate UPI Payment (₹{receipt.totalPayable})</span>
              </button>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <Check className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-emerald-900">
                {t('payment.paidBadge')}
              </p>
              <p className="text-[11px] text-emerald-700 font-mono">
                Txn: UPI-{Date.now().toString().slice(-8)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Transparency Note */}
      <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            {t('receipt.platformFeeNote')}{receipt.platformFee}
          </span>
          <span className="text-slate-400">({receipt.feeRatePercentage}%)</span>
        </div>
        <div className="flex justify-between text-slate-600 font-medium">
          <span>{t('receipt.workerEarnings')}{receipt.workerPayout}</span>
          <span className="text-slate-400">({workerName || 'Worker'})</span>
        </div>
      </div>
    </div>
  );
}

