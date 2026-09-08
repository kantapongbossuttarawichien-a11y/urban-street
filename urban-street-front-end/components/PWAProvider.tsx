'use client';

import { useEffect, useState } from 'react';

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export function PWAProvider() {
  const [install, setInstall] = useState<InstallEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [offline, setOffline] = useState(false);
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    let disposed = false;
    const syncConnection = () => setOffline(!navigator.onLine);
    const onInstall = (event: Event) => { event.preventDefault(); setInstall(event as InstallEvent); };
    const installed = () => { setInstall(null); setIos(false); };
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone;
    const preventGesture = (event: Event) => event.preventDefault();
    const preventPinch = (event: TouchEvent) => {
      if (event.touches.length > 1) event.preventDefault();
    };
    if (standalone) {
      document.documentElement.classList.add('pwa-standalone');
      document.addEventListener('gesturestart', preventGesture, { passive: false });
      document.addEventListener('gesturechange', preventGesture, { passive: false });
      document.addEventListener('gestureend', preventGesture, { passive: false });
      document.addEventListener('touchmove', preventPinch, { passive: false });
    }
    setIos(!standalone && (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)));
    try { setDismissed(sessionStorage.getItem('urban-install-dismissed') === '1'); } catch { setDismissed(false); }
    syncConnection();
    window.addEventListener('online', syncConnection);
    window.addEventListener('offline', syncConnection);
    window.addEventListener('beforeinstallprompt', onInstall);
    window.addEventListener('appinstalled', installed);
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).then(reg => {
        if (disposed) return;
        if (reg.waiting) setWaiting(reg.waiting);
        reg.addEventListener('updatefound', () => {
          const worker = reg.installing;
          worker?.addEventListener('statechange', () => {
            if (!disposed && worker.state === 'installed' && navigator.serviceWorker.controller) setWaiting(reg.waiting);
          });
        });
      }).catch(error => console.error('PWA registration failed', error));
    }
    return () => {
      disposed = true;
      window.removeEventListener('online', syncConnection);
      window.removeEventListener('offline', syncConnection);
      window.removeEventListener('beforeinstallprompt', onInstall);
      window.removeEventListener('appinstalled', installed);
      if (standalone) {
        document.documentElement.classList.remove('pwa-standalone');
        document.removeEventListener('gesturestart', preventGesture);
        document.removeEventListener('gesturechange', preventGesture);
        document.removeEventListener('gestureend', preventGesture);
        document.removeEventListener('touchmove', preventPinch);
      }
    };
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try { sessionStorage.setItem('urban-install-dismissed', '1'); } catch { /* Storage may be disabled. */ }
  };

  return (
    <>
      {offline && <div className="pwa-status" role="status">ออฟไลน์ — รายการขายที่บันทึกในเครื่องยังอยู่ กรุณาเปิดหน้าขายอีกครั้งเมื่อเน็ตกลับมา</div>}
      {waiting && <div className="pwa-status" role="status">
        มีเวอร์ชันใหม่ กรุณาบันทึกรายการก่อนอัปเดต
        <button onClick={() => {
          navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload(), { once: true });
          waiting.postMessage({ type: 'SKIP_WAITING' });
        }}>อัปเดตแอป</button>
      </div>}
      {!dismissed && (install || ios) && <aside className="pwa-install" aria-label="ติดตั้งแอป">
        <img src="/icons/icon-192.png" alt="" width="40" height="40" />
        <div><strong>Urban Street</strong><p>{ios ? 'ติดตั้ง: กดแชร์ แล้วเลือกเพิ่มไปยังหน้าจอโฮม' : 'เพิ่มแอปไว้บนหน้าจอหลัก'}</p></div>
        {install && <button onClick={async () => {
          try { await install.prompt(); await install.userChoice; setInstall(null); } catch { setInstall(null); }
        }}>ติดตั้ง</button>}
        <button onClick={dismiss} aria-label="ปิดคำแนะนำติดตั้ง">×</button>
      </aside>}
    </>
  );
}
