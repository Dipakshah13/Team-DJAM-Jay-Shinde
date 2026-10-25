'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/hooks/useT';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TrustBadge } from '@/components/domain/TrustBadge';
import { PageTransition } from '@/components/layout/PageTransition';
import { LanguageSwitch } from '@/components/layout/LanguageSwitch';
import { Users, Calendar, AlertOctagon, Check, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';

export default function AdminPage() {
  const t = useT();
  const [activeTab, setActiveTab] = useState('workers'); // 'workers' | 'bookings' | 'complaints'

  const workers = useAppStore((state) => state.workers);
  const bookings = useAppStore((state) => state.bookings) || [];
  const complaints = useAppStore((state) => state.complaints) || [];
  const approveWorker = useAppStore((state) => state.approveWorker);
  const toggleWorkerVerified = useAppStore((state) => state.toggleWorkerVerified);
  const resolveComplaint = useAppStore((state) => state.resolveComplaint);

  return (
    <Screen
      title={t('admin.title')}
      subtitle="Overview & Verification Desk"
      rightAction={<LanguageSwitch compact />}
      hasNav
      className="bg-surface"
    >
      <PageTransition className="space-y-4 max-w-sm mx-auto w-full py-2">
        {/* Navigation Tabs */}
        <div className="flex bg-slate-200/80 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('workers')}
            className={clsx(
              'flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5',
              activeTab === 'workers'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <Users className="w-3.5 h-3.5" />
            {t('admin.workersTab')} ({workers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={clsx(
              'flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5',
              activeTab === 'bookings'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <Calendar className="w-3.5 h-3.5" />
            {t('admin.bookingsTab')} ({bookings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('complaints')}
            className={clsx(
              'flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5',
              activeTab === 'complaints'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            {t('admin.complaintsTab')} ({complaints.length})
          </button>
        </div>

        {/* Tab 1: Workers Management */}
        {activeTab === 'workers' && (
          <div className="space-y-3">
            {workers.map((worker) => (
              <div
                key={worker.id}
                className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={worker.avatar}
                      alt={worker.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-heading">
                        {worker.name}
                      </h4>
                      <p className="text-xs text-muted">
                        {worker.area} · Base ₹{worker.baseFare}
                      </p>
                      <div className="mt-1">
                        <TrustBadge worker={worker} showDetailButton={false} />
                      </div>
                    </div>
                  </div>

                  {!worker.approved && (
                    <Badge variant="danger" size="xs">
                      Pending Approval
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  {!worker.approved ? (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        approveWorker(worker.id);
                        toast.success(`${worker.name} approved!`);
                      }}
                      icon={Check}
                      className="flex-1"
                    >
                      {t('admin.approve')}
                    </Button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Approved
                    </span>
                  )}

                  <Button
                    size="sm"
                    variant={worker.verified ? 'outline' : 'accent'}
                    onClick={() => {
                      toggleWorkerVerified(worker.id);
                      toast.info(`Updated verification for ${worker.name}`);
                    }}
                    icon={ShieldCheck}
                  >
                    {worker.verified ? 'Revoke Verified' : 'Grant Verified'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Bookings */}
        {activeTab === 'bookings' && (
          <div className="space-y-3">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary uppercase">
                      {booking.serviceId}
                    </span>
                    <Badge variant="accent" size="xs">
                      {booking.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold text-heading">
                    {booking.description}
                  </p>
                  <div className="text-xs text-muted flex justify-between pt-1 border-t border-slate-100">
                    <span>Booking #{booking.id.slice(-6)}</span>
                    <span className="font-bold text-heading">
                      Total: ₹{booking.finalPrice || booking.estimate?.labour}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-muted bg-white rounded-3xl">
                No bookings found.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Complaints */}
        {activeTab === 'complaints' && (
          <div className="space-y-3">
            {complaints.length > 0 ? (
              complaints.map((c) => (
                <div
                  key={c.id}
                  className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase">
                      Complaint #{c.id.slice(-6)}
                    </span>
                    <Badge variant={c.status === 'RESOLVED' ? 'success' : 'danger'} size="xs">
                      {c.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-heading">
                    {c.reason}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-xs text-muted">
                    <span>Reported on booking #{c.bookingId?.slice(-6)}</span>
                    {c.status !== 'RESOLVED' && (
                      <Button
                        size="sm"
                        variant="accent"
                        onClick={() => {
                          resolveComplaint(c.id);
                          toast.success(`Complaint #${c.id.slice(-6)} resolved!`);
                        }}
                        icon={Check}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-muted bg-white rounded-3xl">
                No active complaints. Platform running smoothly!
              </div>
            )}
          </div>
        )}
      </PageTransition>
    </Screen>
  );
}
