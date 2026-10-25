'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useT } from '@/hooks/useT';
import { SERVICES } from '@/data/services';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageTransition } from '@/components/layout/PageTransition';
import { Mic, MicOff, MapPin, Users, Wrench, Calendar, Clock, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function BookServicePage() {
  const router = useRouter();
  const params = useParams();
  const t = useT();

  const serviceId = params?.serviceId || 'plumber';
  const service = SERVICES.find((s) => s.id === serviceId) || SERVICES[0];

  const [description, setDescription] = useState('');
  const [landmark, setLandmark] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Scheduling state
  const [scheduleType, setScheduleType] = useState('NOW'); // 'NOW' | 'SCHEDULED'
  const [scheduleDate, setScheduleDate] = useState('Today');
  const [scheduleSlot, setScheduleSlot] = useState('Morning');

  // Voice recognition support
  const handleVoiceInput = () => {
    const SpeechRecognition =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      toast.error('Voice input not supported on this browser. Please type below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        toast.info(t('book.voiceListening'));
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
        toast.success('Voice captured! Confirm your description.');
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      toast.error('Could not activate microphone.');
    }
  };

  const handleFindWorkers = (e) => {
    e?.preventDefault();
    const query = new URLSearchParams({
      serviceId: service.id,
      description: description || `Need ${t(service.labelKey)} assistance`,
      landmark: landmark || '',
      scheduleType,
      scheduleDate: scheduleType === 'SCHEDULED' ? scheduleDate : '',
      scheduleSlot: scheduleType === 'SCHEDULED' ? scheduleSlot : '',
    }).toString();

    router.push(`/customer/workers?${query}`);
  };

  return (
    <Screen
      title={`${t('book.title')} ${t(service.labelKey)}`}
      subtitle={`Typical: ₹${service.baseRange[0]} - ₹${service.baseRange[1]}`}
      back
      className="bg-surface"
    >
      <PageTransition className="justify-between max-w-sm mx-auto w-full py-2">
        <form onSubmit={handleFindWorkers} className="space-y-5">
          {/* Service Banner */}
          <div className="p-4 rounded-3xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-sm">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-heading">
                  {t(service.labelKey)}
                </h3>
                <p className="text-xs text-muted">
                  Labour base range: ₹{service.baseRange[0]} - ₹{service.baseRange[1]}
                </p>
              </div>
            </div>
            <Badge variant="sample" size="xs">
              {t('app.sampleData')}
            </Badge>
          </div>

          {/* Timing & Schedule Picker */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-accent" />
              <span>{t('book.scheduleTiming')}</span>
            </label>

            {/* Toggle Mode: Instant vs Scheduled */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setScheduleType('NOW')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  scheduleType === 'NOW'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-accent" />
                <span>{t('book.scheduleNow')}</span>
              </button>

              <button
                type="button"
                onClick={() => setScheduleType('SCHEDULED')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  scheduleType === 'SCHEDULED'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>{t('book.scheduleLater')}</span>
              </button>
            </div>

            {/* If Scheduled: Show Date & Slot Pickers */}
            {scheduleType === 'SCHEDULED' && (
              <div className="p-3.5 bg-white rounded-2xl border-2 border-slate-200/80 space-y-3 animate-in fade-in duration-200">
                {/* Date options */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    {t('book.selectDate')}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {['Today', 'Tomorrow', 'Day After'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setScheduleDate(d)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                          scheduleDate === d
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {d === 'Today' ? t('book.today') : d === 'Tomorrow' ? t('book.tomorrow') : t('book.dayAfter')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time slot options */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    {t('book.selectSlot')}
                  </span>
                  <div className="space-y-1.5">
                    {[
                      { id: 'Morning', labelKey: 'book.slotMorning' },
                      { id: 'Afternoon', labelKey: 'book.slotAfternoon' },
                      { id: 'Evening', labelKey: 'book.slotEvening' },
                    ].map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setScheduleSlot(slot.id)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-semibold text-left border flex items-center justify-between transition-all ${
                          scheduleSlot === slot.id
                            ? 'bg-amber-50 text-amber-950 border-amber-300 ring-1 ring-amber-300'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{t(slot.labelKey)}</span>
                        {scheduleSlot === slot.id && (
                          <span className="w-2 h-2 rounded-full bg-accent" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description with Voice Button */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {t('book.describe')}
              </label>
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>{t('book.voiceListening')}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-primary" />
                    <span>{t('book.voice')}</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('book.describePlaceholder')}
              className="w-full p-4 rounded-2xl bg-white border-2 border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm font-medium text-heading outline-none resize-none shadow-sm transition-all"
            />
          </div>

          {/* Landmark Note */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-accent" />
              <span>{t('book.landmark')}</span>
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder={t('book.landmarkPlaceholder')}
              className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm font-medium text-heading outline-none shadow-sm transition-all"
            />
            <p className="text-[11px] text-muted leading-tight">
              Helps nearby workers locate your doorstep without calling multiple times.
            </p>
          </div>

          {/* Action CTA */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              icon={Users}
            >
              {t('book.findWorkers')}
            </Button>
          </div>
        </form>
      </PageTransition>
    </Screen>
  );
}
