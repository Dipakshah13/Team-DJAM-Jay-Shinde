'use client';

import { useState } from 'react';
import { useT } from '@/hooks/useT';
import { Camera, CheckSquare, Square, ShieldCheck, Sparkles, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

// Sample realistic demo photos for plumbing / electrical / cleaning jobs
const DEMO_PHOTOS = {
  plumber: {
    before: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&auto=format&fit=crop&q=80',
    after: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80',
  },
  default: {
    before: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
    after: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500&auto=format&fit=crop&q=80',
  },
};

export function JobProofCard({
  booking,
  isWorker = false,
  onUpdatePhoto,
  onToggleTask,
}) {
  const t = useT();

  const jobCard = booking?.jobCard || {
    beforePhoto: null,
    afterPhoto: null,
    checklist: [
      { id: 't1', textKey: 'proof.task1', done: false },
      { id: 't2', textKey: 'proof.task2', done: false },
      { id: 't3', textKey: 'proof.task3', done: false },
    ],
  };

  const serviceKey = booking?.serviceId in DEMO_PHOTOS ? booking.serviceId : 'default';
  const samplePhotos = DEMO_PHOTOS[serviceKey] || DEMO_PHOTOS.default;

  const handleCapturePhoto = (type) => {
    const photoUrl = type === 'beforePhoto' ? samplePhotos.before : samplePhotos.after;
    if (onUpdatePhoto) {
      onUpdatePhoto(booking.id, type, photoUrl);
      toast.success(t('proof.photoUploaded'));
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-card space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-heading">
              {t('proof.title')}
            </h3>
            <p className="text-[11px] text-muted">
              {t('proof.subtitle')}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
          <ShieldCheck className="w-3 h-3" />
          Verified Proof
        </span>
      </div>

      {/* Before & After Photo Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Before Photo */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              {t('proof.beforePhoto')}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold">
              BEFORE
            </span>
          </div>

          <div className="aspect-[4/3] rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden relative group">
            {jobCard.beforePhoto ? (
              <img
                src={jobCard.beforePhoto}
                alt="Before work"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-slate-400">
                <ImageIcon className="w-6 h-6 mb-1 opacity-60" />
                <span className="text-[10px] font-medium leading-tight">No photo yet</span>
              </div>
            )}
          </div>

          {isWorker && (
            <button
              type="button"
              onClick={() => handleCapturePhoto('beforePhoto')}
              className="w-full py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-all flex items-center justify-center gap-1"
            >
              <Camera className="w-3 h-3 text-primary" />
              <span>{jobCard.beforePhoto ? 'Retake Photo' : t('proof.captureBefore')}</span>
            </button>
          )}
        </div>

        {/* After Photo */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              {t('proof.afterPhoto')}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
              AFTER
            </span>
          </div>

          <div className="aspect-[4/3] rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden relative group">
            {jobCard.afterPhoto ? (
              <img
                src={jobCard.afterPhoto}
                alt="After work"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-slate-400">
                <Sparkles className="w-6 h-6 mb-1 text-emerald-500 opacity-60" />
                <span className="text-[10px] font-medium leading-tight">Final result</span>
              </div>
            )}
          </div>

          {isWorker && (
            <button
              type="button"
              onClick={() => handleCapturePhoto('afterPhoto')}
              className="w-full py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-all flex items-center justify-center gap-1"
            >
              <Camera className="w-3 h-3 text-emerald-600" />
              <span>{jobCard.afterPhoto ? 'Retake Photo' : t('proof.captureAfter')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          {t('proof.checklistTitle')}
        </span>

        <div className="space-y-1.5">
          {(jobCard.checklist || []).map((task) => (
            <div
              key={task.id}
              onClick={() => isWorker && onToggleTask && onToggleTask(booking.id, task.id)}
              className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-xs font-medium transition-all ${
                isWorker ? 'cursor-pointer hover:bg-slate-50' : ''
              } ${
                task.done
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 font-semibold'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              {task.done ? (
                <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
              )}
              <span className="leading-tight flex-1">
                {t(task.textKey || 'proof.task1')}
              </span>
              {task.done && (
                <span className="text-[10px] font-bold text-emerald-700">✓ Done</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
