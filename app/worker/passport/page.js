'use client';

import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/hooks/useT';
import { Screen } from '@/components/ui/Screen';
import { PassportCard } from '@/components/domain/PassportCard';
import { PageTransition } from '@/components/layout/PageTransition';

export default function WorkerPassportPage() {
  const t = useT();
  const activeWorkerId = useAppStore((state) => state.activeWorkerId) || 'w1';
  const workers = useAppStore((state) => state.workers);
  const bookings = useAppStore((state) => state.bookings) || [];

  const worker = workers.find((w) => w.id === activeWorkerId) || workers[0];

  return (
    <Screen
      title={t('passport.title')}
      subtitle={t('passport.subtitle')}
      back
      hasNav
      className="bg-surface"
    >
      <PageTransition className="max-w-sm mx-auto w-full py-2">
        <PassportCard worker={worker} bookings={bookings} />
      </PageTransition>
    </Screen>
  );
}
