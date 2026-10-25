'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/hooks/useT';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageTransition } from '@/components/layout/PageTransition';
import { Star, ShieldAlert, Ban, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';

export default function RatePage() {
  const router = useRouter();
  const params = useParams();
  const t = useT();

  const bookingId = params?.bookingId;
  const bookings = useAppStore((state) => state.bookings);
  const workers = useAppStore((state) => state.workers);
  const submitFeedback = useAppStore((state) => state.submitFeedback);

  const booking = bookings.find((b) => b.id === bookingId);
  const worker = workers.find((w) => w.id === booking?.workerId);

  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState(['Punctual & Fast', 'Fair & Honest']);
  const [comment, setComment] = useState('');
  const [blockWorker, setBlockWorker] = useState(false);
  const [reportIssue, setReportIssue] = useState(false);

  if (!booking || !worker) {
    return (
      <Screen title="Rate Experience" back>
        <div className="p-8 text-center text-sm text-muted">Booking not found.</div>
      </Screen>
    );
  }

  const tags = [
    t('rate.tagPunctual'),
    t('rate.tagClean'),
    t('rate.tagFair'),
    t('rate.tagSkilled'),
  ];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    submitFeedback(booking.id, {
      rating,
      tags: selectedTags,
      comment,
      blocked: blockWorker,
      reported: reportIssue,
    });
    toast.success('Thank you! Feedback recorded.');
    router.push('/customer/home');
  };

  return (
    <Screen title={t('rate.title')} back className="bg-surface">
      <PageTransition className="space-y-5 max-w-sm mx-auto w-full py-2">
        {/* Worker Header */}
        <div className="text-center space-y-2">
          <img
            src={worker.avatar}
            alt={worker.name}
            className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-accent shadow-md"
          />
          <h3 className="text-lg font-bold text-heading">
            {t('rate.question')} {worker.name}?
          </h3>
          <p className="text-xs text-muted">
            Honest feedback helps keep our community safe and high-quality.
          </p>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center justify-center gap-2 py-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1.5 focus:outline-none transition-transform hover:scale-110 active:scale-95"
            >
              <Star
                className={clsx(
                  'w-8 h-8 transition-colors',
                  star <= rating
                    ? 'fill-amber-400 text-amber-500'
                    : 'text-slate-300'
                )}
              />
            </button>
          ))}
        </div>

        {/* Highlight Tags */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {t('rate.tagsPrompt')}
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={clsx(
                    'px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                    active
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  )}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comment Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {t('rate.comment')}
          </label>
          <textarea
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add any helpful notes for other households..."
            className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 text-sm outline-none focus:border-primary shadow-sm"
          />
        </div>

        {/* Safety & Moderation Controls */}
        <div className="pt-2 space-y-2.5 border-t border-slate-200">
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={blockWorker}
              onChange={(e) => setBlockWorker(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500"
            />
            <Ban className="w-3.5 h-3.5 text-red-500" />
            <span>{t('rate.blockWorker')}</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-red-600 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={reportIssue}
              onChange={(e) => setReportIssue(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500"
            />
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
            <span>{t('rate.reportWorker')}</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={handleSubmit}
            icon={CheckCircle2}
          >
            {t('rate.submit')}
          </Button>
        </div>
      </PageTransition>
    </Screen>
  );
}
