'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { Wrench, Sparkles } from 'lucide-react';

export default function SplashPage() {
  const router = useRouter();
  const currentUser = useAppStore((state) => state.currentUser);
  const tutorialSeen = useAppStore((state) => state.tutorialSeen);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentUser?.phone) {
        if (currentUser.role === 'worker') {
          router.replace('/worker/home');
        } else if (currentUser.role === 'admin') {
          router.replace('/admin');
        } else {
          router.replace('/customer/home');
        }
      } else {
        router.replace('/signin');
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [currentUser, tutorialSeen, router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-primary text-white text-center relative overflow-hidden select-none">
      {/* Decorative ambient elements */}
      <div className="absolute top-1/4 -right-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 shadow-2xl relative">
        <Wrench className="w-10 h-10 text-accent animate-bounce" />
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-primary text-[10px]">
          ✓
        </span>
      </div>

      <h1 className="text-2xl font-black tracking-tight text-white mb-2">
        Book My Service
      </h1>

      <p className="text-sm text-slate-300 max-w-xs leading-relaxed">
        Trusted local help, fairly priced — in minutes, in your language.
      </p>

      <div className="mt-8 flex items-center gap-2 text-xs text-amber-300/80 font-medium">
        <Sparkles className="w-4 h-4" />
        <span>Vecnaverse Hackathon Prototype</span>
      </div>
    </div>
  );
}
