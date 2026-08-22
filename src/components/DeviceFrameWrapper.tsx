import React, { useState, useEffect, useRef } from 'react';
import { Tablet, Monitor, Smartphone, Sparkles, Check, ChevronDown, RotateCcw } from 'lucide-react';

interface DeviceFrameWrapperProps {
  children: React.ReactNode;
}

export type ViewportMode = 'fluid' | 'tablet-scaled' | 'device-frame';

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({ children }) => {
  const [mode, setMode] = useState<ViewportMode>('fluid');
  const [scaleFactor, setScaleFactor] = useState<number>(1);
  const [screenWidth, setScreenWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor screen width & auto-compute tablet scale factor for phone viewports
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setScreenWidth(w);

      if (containerRef.current) {
        const containerW = containerRef.current.clientWidth;
        const targetTabletWidth = 920; // Structured tablet viewport baseline width

        if (containerW < targetTabletWidth) {
          setScaleFactor(containerW / targetTabletWidth);
        } else {
          setScaleFactor(1);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mode]);

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-[#070C1E]" ref={containerRef}>
      {/* Top Viewport Mode Control Bar */}
      <header className="sticky top-0 z-50 w-full bg-[#050B1D]/95 backdrop-blur-2xl border-b border-white/10 px-4 py-2 flex items-center justify-between gap-3 text-xs font-mono shadow-md">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF6B35]/15 border border-[#FF6B35]/30 text-[#FF7F4E] text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
            <span>Viewport Mode</span>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center rounded-xl bg-[#070C1E] p-1 border border-white/10">
            <button
              type="button"
              onClick={() => setMode('fluid')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'fluid'
                  ? 'bg-[#FF6B35] text-white font-bold shadow-md shadow-[#FF6B35]/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Standard Fluid Responsive Layout"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fluid Responsive</span>
              <span className="sm:hidden">Fluid</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('tablet-scaled')}
              className={`px-3.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'tablet-scaled'
                  ? 'bg-gradient-to-r from-[#FF6B35] to-[#E85924] text-white font-bold shadow-md shadow-[#FF6B35]/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet Scaled View (Scaled Desktop/Tablet Layout on Mobile)"
            >
              <Tablet className="w-3.5 h-3.5 text-[#F7C59F]" />
              <span className="hidden sm:inline">Tablet Scaled</span>
              <span className="sm:hidden">Tablet</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('device-frame')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'device-frame'
                  ? 'bg-[#004E89] text-white font-bold shadow-md shadow-[#004E89]/40 border border-[#38BDF8]/40'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Interactive iPad/Tablet Device Mockup Frame"
            >
              <Monitor className="w-3.5 h-3.5 text-[#7DD3FC]" />
              <span className="hidden sm:inline">Device Frame</span>
              <span className="sm:hidden">Frame</span>
            </button>
          </div>
        </div>

        {/* Viewport Info & Scale Indicator */}
        <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-[#7DD3FC]">
            <Sparkles className="w-3 h-3 text-[#FF6B35]" />
            Screen: <strong className="text-white font-mono">{screenWidth}px</strong>
          </span>

          {mode === 'tablet-scaled' && (
            <span className="px-2 py-0.5 rounded-full bg-[#FF6B35]/15 border border-[#FF6B35]/30 text-[#F7C59F] text-[10px]">
              Scale: {Math.round(scaleFactor * 100)}% (920px Baseline)
            </span>
          )}

          {mode === 'device-frame' && (
            <span className="px-2 py-0.5 rounded-full bg-[#004E89]/30 border border-[#004E89]/50 text-[#7DD3FC] text-[10px]">
              iPad Pro 11&quot; Shell Preview
            </span>
          )}
        </div>
      </header>

      {/* Mode 1: Standard Fluid Responsive Layout */}
      {mode === 'fluid' && (
        <div className="flex-1 w-full">
          {children}
        </div>
      )}

      {/* Mode 2: Tablet Scaled View (Scaled Desktop/Tablet on Phone Viewports) */}
      {mode === 'tablet-scaled' && (
        <div className="flex-1 w-full overflow-x-auto py-4 bg-[#050B1D]/60 flex justify-center">
          <div 
            className="w-full transition-transform duration-300 origin-top"
            style={{
              minWidth: '920px',
              maxWidth: '1280px',
              transform: screenWidth < 920 ? `scale(${screenWidth / 920})` : 'none',
              transformOrigin: 'top center',
              marginBottom: screenWidth < 920 ? `-${(1 - screenWidth / 920) * 100}%` : '0'
            }}
          >
            {children}
          </div>
        </div>
      )}

      {/* Mode 3: Realistic iPad/Tablet Device Mockup Frame Shell */}
      {mode === 'device-frame' && (
        <div className="flex-1 w-full py-6 px-3 sm:px-8 bg-[#040817] flex items-center justify-center overflow-x-auto">
          {/* Tablet Device Frame Shell */}
          <div className="relative w-full max-w-[960px] bg-slate-900 rounded-[38px] p-3 sm:p-5 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(255,107,53,0.25)] border-4 border-slate-800/90 my-auto">
            {/* Top Device Hardware Notch & Camera */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 pointer-events-none">
              <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-700/80 shadow-inner" />
            </div>

            {/* Inner Screen Container */}
            <div className="relative w-full rounded-[24px] overflow-hidden bg-[#070C1E] border border-white/15 shadow-2xl min-h-[640px] max-h-[820px] flex flex-col">
              {/* Simulated iPad Pro System Status Bar */}
              <div className="w-full bg-[#050B1D] px-6 py-2 flex items-center justify-between text-[11px] font-mono text-slate-300 border-b border-white/10 select-none z-20">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white">9:41 AM</span>
                  <span className="text-[10px] text-[#F7C59F]">Tech Movement Recruiter (Tablet View)</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span>5G Ultra Wideband</span>
                  <div className="w-5 h-2.5 rounded-sm border border-emerald-400 p-0.5 flex items-center">
                    <div className="w-full h-full bg-emerald-400 rounded-xs" />
                  </div>
                </div>
              </div>

              {/* Scrollable Screen Content Canvas */}
              <div className="flex-1 overflow-y-auto overflow-x-auto">
                <div className="min-w-[840px] sm:min-w-full">
                  {children}
                </div>
              </div>
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="w-36 h-1.5 bg-slate-700/80 rounded-full mx-auto mt-3" />
          </div>
        </div>
      )}
    </div>
  );
};
