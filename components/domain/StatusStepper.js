'use client';

import { Check, Clock, Play, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export function StatusStepper({ status }) {
  const steps = [
    { key: 'REQUESTED', label: 'Requested', icon: Clock },
    { key: 'CONFIRMED', label: 'Price Locked', icon: Check },
    { key: 'STARTED', label: 'Work Started', icon: Play },
    { key: 'COMPLETED', label: 'Completed', icon: CheckCircle2 },
  ];

  const statusOrder = ['REQUESTED', 'CONFIRMED', 'STARTED', 'COMPLETED', 'RATED'];
  const currentIndex = statusOrder.indexOf(status);

  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />
        <div
          className="absolute top-4 left-6 h-0.5 bg-accent transition-all duration-300 -z-0"
          style={{
            width: `${Math.min(100, Math.max(0, (currentIndex / (steps.length - 1)) * 100))}%`,
          }}
        />

        {steps.map((step, idx) => {
          const isDone = currentIndex > idx || (step.key === 'COMPLETED' && currentIndex >= 3);
          const isCurrent = currentIndex === idx;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center z-10">
              <div
                className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border-2',
                  isDone
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-accent border-primary text-primary-dark font-bold scale-110 shadow-md ring-4 ring-amber-100'
                    : 'bg-white border-slate-300 text-slate-400'
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={clsx(
                  'text-[10px] mt-1.5 font-medium select-none',
                  isCurrent ? 'text-primary font-bold' : isDone ? 'text-slate-700' : 'text-slate-400'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
