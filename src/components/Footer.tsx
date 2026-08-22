import React from 'react';
import { Shield, Sparkles, Heart, Globe, Cpu, ArrowUpRight } from 'lucide-react';
import { TechMovementLogo } from './TechMovementLogo';

interface FooterProps {
  onOpenRecruiter: () => void;
  onOpenTracker: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenRecruiter,
  onOpenTracker
}) => {
  return (
    <footer className="w-full bg-[#050B1D] border-t border-white/10 text-slate-400 text-xs py-12 relative overflow-hidden" id="main-footer">
      {/* Australian Outback Coral & Oceanic Reef ambient glow */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-[#FF6B35] via-[#F7C59F] to-[#004E89]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Brand Column */}
          <div className="space-y-3 max-w-sm">
            <TechMovementLogo size="md" />
            <p className="text-slate-400 text-xs leading-relaxed pt-1 font-['Plus_Jakarta_Sans']">
              Tech Movement is an innovation and digital transformation firm engineering high-scale AI systems, resilient cloud infrastructure, and mission-critical enterprise platforms.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#FF7F4E]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>We are actively hiring top 1% global engineering talent</span>
            </div>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            <div>
              <h4 className="font-bold text-white font-mono uppercase tracking-wider mb-3 text-[11px]">
                Careers
              </h4>
              <ul className="space-y-2">
                <li><a href="#job-listings-section" className="hover:text-[#FF7F4E] transition-colors">Open Engineering Roles</a></li>
                <li><a href="#job-listings-section" className="hover:text-[#FF7F4E] transition-colors">AI & ML Research</a></li>
                <li><a href="#job-listings-section" className="hover:text-[#FF7F4E] transition-colors">Product Design</a></li>
                <li>
                  <button type="button" onClick={onOpenTracker} className="hover:text-[#FF7F4E] transition-colors text-left cursor-pointer">
                    Track Application
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white font-mono uppercase tracking-wider mb-3 text-[11px]">
                Culture & Perks
              </h4>
              <ul className="space-y-2">
                <li><span className="text-slate-300">100% Remote / Hybrid Flexibility</span></li>
                <li><span className="text-slate-300">Continuous Learning Stipend</span></li>
                <li><span className="text-slate-300">Annual Global Summits</span></li>
                <li><span className="text-slate-300">Comprehensive Health & 401(k)</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white font-mono uppercase tracking-wider mb-3 text-[11px]">
                Recruiter Portal
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    type="button"
                    onClick={onOpenRecruiter}
                    className="text-[#FF7F4E] hover:text-[#FF6B35] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    Recruiter Dashboard <ArrowUpRight className="w-3 h-3" />
                  </button>
                </li>
                <li><span className="text-slate-500 font-mono">Firebase Database</span></li>
                <li><span className="text-slate-500 font-mono">Real-time Pipeline</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} Tech Movement Inc. All rights reserved. Innovation & Digital Transformation.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#F7C59F]">Powered by Firebase Firestore & Vite</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
