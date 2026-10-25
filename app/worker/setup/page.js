'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/hooks/useT';
import { SERVICES } from '@/data/services';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { PageTransition } from '@/components/layout/PageTransition';
import { Check, Settings, Save } from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';

export default function WorkerSetupPage() {
  const router = useRouter();
  const t = useT();

  const activeWorkerId = useAppStore((state) => state.activeWorkerId) || 'w1';
  const workers = useAppStore((state) => state.workers);
  const updateWorkerSetup = useAppStore((state) => state.updateWorkerSetup);

  const worker = workers.find((w) => w.id === activeWorkerId) || workers[0];

  const [selectedServices, setSelectedServices] = useState(worker?.services || ['plumber']);
  const [baseFare, setBaseFare] = useState(worker?.baseFare || 350);

  const toggleService = (svcId) => {
    if (selectedServices.includes(svcId)) {
      if (selectedServices.length === 1) {
        toast.error('Select at least one service');
        return;
      }
      setSelectedServices(selectedServices.filter((s) => s !== svcId));
    } else {
      setSelectedServices([...selectedServices, svcId]);
    }
  };

  const handleSave = (e) => {
    e?.preventDefault();
    updateWorkerSetup(worker.id, {
      services: selectedServices,
      baseFare: Number(baseFare),
    });
    toast.success('Worker settings updated successfully!');
    router.push('/worker/home');
  };

  return (
    <Screen title={t('worker.setupTitle')} back className="bg-surface">
      <PageTransition className="space-y-6 max-w-sm mx-auto w-full py-2">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Services Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              {t('worker.selectServices')}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {SERVICES.map((s) => {
                const isSelected = selectedServices.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleService(s.id)}
                    className={clsx(
                      'p-3 rounded-2xl border text-left flex items-center justify-between transition-all select-none',
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-sm font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    )}
                  >
                    <span className="text-sm">{t(s.labelKey)}</span>
                    {isSelected && <Check className="w-4 h-4 text-accent" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Base Fare Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              {t('worker.setFare')}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-500">
                ₹
              </span>
              <input
                type="number"
                min={100}
                max={2500}
                value={baseFare}
                onChange={(e) => setBaseFare(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-2xl bg-white border-2 border-slate-200 text-lg font-black text-heading focus:outline-none focus:border-primary shadow-sm"
              />
            </div>
            <p className="text-[11px] text-muted">
              This is your initial estimate rate shown to customers before any negotiation.
            </p>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              icon={Save}
            >
              {t('worker.saveProfile')}
            </Button>
          </div>
        </form>
      </PageTransition>
    </Screen>
  );
}
