'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { STORAGE_KEY } from '@/lib/constants';

export function StoreHydrator({ children }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // 1. Initial hydration from localStorage
    useAppStore.persist.rehydrate();
    setHydrated(true);

    // 2. Multi-tab synchronization
    const tabId = Math.random().toString(36).slice(2);
    let isRehydrating = false;

    // A. Storage event listener (fires when other tab writes to localStorage)
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY && !isRehydrating) {
        isRehydrating = true;
        useAppStore.persist.rehydrate();
        setTimeout(() => {
          isRehydrating = false;
        }, 80);
      }
    };
    window.addEventListener('storage', handleStorage);

    // B. BroadcastChannel fallback for ultra-low latency (<100ms) sync
    let bc = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('bms-sync');
        bc.onmessage = (event) => {
          if (event.data?.tabId !== tabId && !isRehydrating) {
            isRehydrating = true;
            useAppStore.persist.rehydrate();
            setTimeout(() => {
              isRehydrating = false;
            }, 80);
          }
        };
      }
    } catch {}

    // Subscribe to store mutations to broadcast to other tabs
    const unsubscribe = useAppStore.subscribe(() => {
      if (!isRehydrating && bc) {
        try {
          bc.postMessage({ type: 'SYNC', tabId });
        } catch {}
      }
    });

    return () => {
      window.removeEventListener('storage', handleStorage);
      unsubscribe();
      try {
        bc?.close();
      } catch {}
    };
  }, []);

  if (!hydrated) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center p-8 bg-[#061120] text-white">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FFB020] to-[#FF6F00] flex items-center justify-center shadow-lg animate-pulse mb-3">
          <span className="text-xl font-bold">🛠️</span>
        </div>
        <p className="text-xs font-semibold text-amber-300 tracking-wider uppercase">
          Loading Book My Service...
        </p>
      </div>
    );
  }

  return children;
}
