'use client';

import { useEffect, useState } from 'react';
import { PhoneFrame } from './PhoneFrame';
import { OriginalDeckViewer } from './OriginalDeckViewer';

interface ResponsiveDeckViewerProps {
  donorName?: string;
  orgName?: string;
  logoUrl?: string;
}

export function ResponsiveDeckViewer({
  donorName = 'John',
  orgName = 'US Naval Sea Cadet Corps',
  logoUrl = '/images/sea-cadets/logo.png',
}: ResponsiveDeckViewerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#15193b] flex items-center justify-center">
        <div className="text-white/50 text-sm">Loading...</div>
      </div>
    );
  }

  // Mobile: Show direct viewer
  if (isMobile) {
    return (
      <OriginalDeckViewer
        donorName={donorName}
        orgName={orgName}
        logoUrl={logoUrl}
        isInsidePhone={false}
      />
    );
  }

  // Desktop: Show phone frame with viewer inside
  return (
    <PhoneFrame>
      <OriginalDeckViewer
        donorName={donorName}
        orgName={orgName}
        logoUrl={logoUrl}
        isInsidePhone={true}
      />
    </PhoneFrame>
  );
}
