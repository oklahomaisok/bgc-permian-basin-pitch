'use client';

import { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="hidden md:flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      {/* Phone Device */}
      <div className="relative">
        {/* Phone Frame */}
        <div
          className="relative bg-black rounded-[3rem] p-3 shadow-2xl"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Side Buttons */}
          <div className="absolute -left-1 top-24 w-1 h-8 bg-slate-700 rounded-l" />
          <div className="absolute -left-1 top-36 w-1 h-12 bg-slate-700 rounded-l" />
          <div className="absolute -left-1 top-52 w-1 h-12 bg-slate-700 rounded-l" />
          <div className="absolute -right-1 top-32 w-1 h-16 bg-slate-700 rounded-r" />

          {/* Screen Bezel */}
          <div className="relative bg-[#15193b] rounded-[2.5rem] overflow-hidden"
            style={{
              width: '375px',
              height: '812px',
            }}
          >
            {/* Dynamic Island / Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50">
              <div className="bg-black w-28 h-7 rounded-full flex items-center justify-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700" />
              </div>
            </div>

            {/* Screen Content */}
            <div className="w-full h-full overflow-hidden">
              {children}
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50">
              <div className="w-32 h-1 bg-white/30 rounded-full" />
            </div>
          </div>
        </div>

        {/* Reflection */}
        <div
          className="absolute inset-0 rounded-[3rem] pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-white/40 text-sm font-medium">
          Use arrow keys or scroll to navigate
        </p>
      </div>
    </div>
  );
}
