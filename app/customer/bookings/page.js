'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/hooks/useT';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageTransition } from '@/components/layout/PageTransition';
import { SERVICES } from '@/data/services';
import {
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Play,
  Ban,
  Wrench,
  Zap,
} from 'lucide-react';

export default function CustomerBookingsPage() {
  const router = useRouter();
  const t = useT();

  const bookings = useAppStore((state) => state.bookings) || [];
  const workers = useAppStore((state) => state.workers) || [];

  const activeBookings = bookings.filter(
    (b) => !['COMPLETED', 'RATED', 'DECLINED', 'CANCELLED'].includes(b.status)
  );

  const pastBookings = bookings.filter((b) =>
    ['COMPLETED', 'RATED', 'DECLINED', 'CANCELLED'].includes(b.status)
  );

  const getService = (serviceId) =>
    SERVICES.find((s) => s.id === serviceId) || { labelKey: 'svc.plumber' };

  const getWorker = (workerId) =>
    workers.find((w) => w.id === workerId) || { name: 'Technician', area: 'Mumbai' };

  const handleBookingClick = (b) => {
    if (b.status === 'REQUESTED' || b.status === 'COUNTERED') {
      router.push(`/customer/quote/${b.id}`);
    } else if (b.status === 'COMPLETED' && !b.feedback) {
      router.push(`/customer/rate/${b.id}`);
    } else {
      router.push(`/customer/job/${b.id}`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'REQUESTED':
        return { label: t('status.requested', 'Requested'), variant: 'accent', icon: Clock };
      case 'COUNTERED':
        return { label: t('status.countered', 'Countered'), variant: 'default', icon: AlertCircle };
      case 'CONFIRMED':
        return { label: t('status.confirmed', 'Price Locked'), variant: 'secondary', icon: CheckCircle2 };
      case 'STARTED':
      case 'EXTRA_PENDING':
        return { label: t('status.started', 'In Progress'), variant: 'accent', icon: Play };
      case 'COMPLETED':
      case 'RATED':
        return { label: t('status.completed', 'Completed'), variant: 'verified', icon: CheckCircle2 };
      case 'CANCELLED':
        return { label: t('status.cancelled', 'Cancelled'), variant: 'neutral', icon: Ban };
      case 'DECLINED':
        return { label: t('status.declined', 'Declined'), variant: 'danger', icon: Ban };
      default:
        return { label: status, variant: 'neutral', icon: Clock };
    }
  };

  return (
    <Screen
      title={t('bookings.title')}
      subtitle={t('bookings.subtitle')}
      className="bg-[#f9f9ff] pb-24"
    >
      <PageTransition className="space-y-5 max-w-sm mx-auto w-full py-2">
        {bookings.length === 0 ? (
          /* Empty State */
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4 my-8">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-[#ff6f00] flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[#071c36]">
                {t('bookings.empty')}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Book verified plumbers, electricians, cleaners & maids in your area.
              </p>
            </div>
            <Button
              variant="accent"
              fullWidth
              onClick={() => router.push('/customer/home')}
              icon={Wrench}
            >
              {t('bookings.bookNow')}
            </Button>
          </div>
        ) : (
          <>
            {/* Active Bookings Section */}
            {activeBookings.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-1.5 px-1">
                  <span className="w-2 h-2 rounded-full bg-[#ff6f00] animate-ping" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#071c36]">
                    {t('bookings.active')} ({activeBookings.length})
                  </h2>
                </div>

                <div className="space-y-2.5">
                  {activeBookings.map((b) => {
                    const worker = getWorker(b.workerId);
                    const service = getService(b.serviceId);
                    const statusInfo = getStatusBadge(b.status);
                    const StatusIcon = statusInfo.icon;
                    const price = b.finalPrice || b.estimate?.labour || 350;

                    return (
                      <div
                        key={b.id}
                        onClick={() => handleBookingClick(b)}
                        className="p-4 bg-white rounded-2xl border-2 border-orange-200/80 shadow-md cursor-pointer hover:border-[#ff6f00] transition-all space-y-2.5 active:scale-[0.99]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ff6f00] flex items-center justify-center shrink-0">
                              <Wrench className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-sm text-[#071c36] block truncate">
                                {t(service.labelKey)}
                              </span>
                              <p className="text-xs text-slate-500 truncate">
                                With {worker.name} • {worker.area}
                              </p>
                            </div>
                          </div>

                          <span className="text-base font-extrabold text-[#ff6f00] shrink-0 font-mono">
                            ₹{price}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                          <Badge variant={statusInfo.variant} size="xs">
                            <StatusIcon className="w-3 h-3 mr-1 inline" />
                            {statusInfo.label}
                          </Badge>

                          <span className="text-[11px] font-semibold text-blue-700 flex items-center gap-1">
                            <span>Open Details</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Past Bookings Section */}
            {pastBookings.length > 0 && (
              <section className="space-y-3 pt-2">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {t('bookings.history')} ({pastBookings.length})
                  </h2>
                </div>

                <div className="space-y-2">
                  {pastBookings.map((b) => {
                    const worker = getWorker(b.workerId);
                    const service = getService(b.serviceId);
                    const statusInfo = getStatusBadge(b.status);
                    const price = b.finalPrice || b.estimate?.labour || 350;
                    const dateStr = new Date(b.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    });

                    return (
                      <div
                        key={b.id}
                        onClick={() => handleBookingClick(b)}
                        className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-xs cursor-pointer hover:border-slate-300 transition-all flex items-center justify-between gap-3 active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                            <Wrench className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-xs text-[#071c36] block truncate">
                              {t(service.labelKey)} · {worker.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {dateStr} • {b.description}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0 space-y-1">
                          <span className="text-xs font-bold text-slate-800 block font-mono">
                            ₹{price}
                          </span>
                          <Badge variant={statusInfo.variant} size="xs">
                            {statusInfo.label}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </PageTransition>
    </Screen>
  );
}
