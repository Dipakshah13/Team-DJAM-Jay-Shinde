'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useT } from '@/hooks/useT';
import { useMounted } from '@/hooks/useMounted';
import { Home, Award, Settings, ShieldCheck, HelpCircle, Calendar } from 'lucide-react';
import clsx from 'clsx';

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useT();
  const mounted = useMounted();
  const role = useAppStore((state) => state.currentUser?.role) || 'customer';

  // Do not render nav on signin, tutorial, role selection, root, or vouch pages
  if (
    ['/', '/signin', '/tutorial', '/role'].includes(pathname) ||
    pathname.startsWith('/vouch')
  ) {
    return null;
  }

  if (!mounted) {
    return null;
  }

  const customerItems = [
    { label: t('nav.home'), href: '/customer/home', icon: Home },
    { label: t('nav.bookings'), href: '/customer/bookings', icon: Calendar },
    { label: t('nav.help'), href: '/help', icon: HelpCircle },
  ];

  const workerItems = [
    { label: t('nav.home'), href: '/worker/home', icon: Home },
    { label: t('nav.passport'), href: '/worker/passport', icon: Award },
    { label: t('nav.profile'), href: '/worker/setup', icon: Settings },
  ];

  const adminItems = [
    { label: t('nav.admin'), href: '/admin', icon: ShieldCheck },
    { label: t('nav.home'), href: '/customer/home', icon: Home },
  ];

  const items =
    role === 'worker'
      ? workerItems
      : role === 'admin'
      ? adminItems
      : customerItems;

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 py-2 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <button
              key={item.href}
              type="button"
              onClick={() => router.push(item.href)}
              className={clsx(
                'flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-150',
                isActive
                  ? 'text-primary font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <div
                className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                  isActive ? 'bg-amber-100 text-primary-dark' : 'bg-transparent'
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
