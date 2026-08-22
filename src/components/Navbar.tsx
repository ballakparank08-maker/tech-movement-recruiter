import React, { useState } from 'react';
import { 
  Briefcase, 
  ShieldCheck, 
  Menu, 
  X, 
  Search, 
  Sparkles, 
  LayoutDashboard, 
  UserCheck, 
  HelpCircle,
  FileSearch,
  Lock,
  LogOut
} from 'lucide-react';
import { TechMovementLogo } from './TechMovementLogo';
import { RecruiterUser } from '../types';

interface NavbarProps {
  currentView: 'careers' | 'admin';
  onViewChange: (view: 'careers' | 'admin') => void;
  onOpenTracker: () => void;
  openRolesCount: number;
  recruiterUser?: RecruiterUser | null;
  onSignOutRecruiter?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenTracker,
  openRolesCount,
  recruiterUser,
  onSignOutRecruiter
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070C1E]/85 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_25px_rgba(0,12,30,0.5)]" id="main-header-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <TechMovementLogo
              size="md"
              onClick={() => {
                onViewChange('careers');
                setMobileMenuOpen(false);
              }}
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              type="button"
              onClick={() => onViewChange('careers')}
              className={`text-xs font-semibold uppercase tracking-wider font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'careers'
                  ? 'text-[#FF6B35] border-b-2 border-[#FF6B35] py-1 shadow-[0_4px_12px_rgba(255,107,53,0.3)]'
                  : 'text-slate-300 hover:text-[#F7C59F]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" /> Open Roles ({openRolesCount})
            </button>

            <button
              type="button"
              onClick={onOpenTracker}
              className="text-xs font-semibold uppercase tracking-wider font-mono text-slate-300 hover:text-[#F7C59F] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileSearch className="w-3.5 h-3.5 text-[#38BDF8]" /> Track Application
            </button>

            {/* Recruiter Dashboard Toggle Button with Security State */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onViewChange(currentView === 'admin' ? 'careers' : 'admin')}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wide uppercase transition-all flex items-center gap-2 cursor-pointer ${
                  currentView === 'admin'
                    ? 'bg-gradient-to-r from-[#FF6B35] via-[#FF7F4E] to-[#E85924] text-white shadow-[0_0_22px_rgba(255,107,53,0.45)] border border-[#FF6B35]/60'
                    : recruiterUser
                    ? 'bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/40'
                    : 'bg-[#0A1128]/80 hover:bg-[#0F1B3E] text-slate-200 border border-white/10 hover:border-[#FF6B35]/50'
                }`}
                id="toggle-recruiter-portal-btn"
              >
                {currentView === 'admin' ? (
                  <>
                    <Briefcase className="w-3.5 h-3.5" /> Back to Careers
                  </>
                ) : (
                  <>
                    {recruiterUser ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Recruiter
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-[#FF6B35]" /> Recruiter
                      </>
                    )}
                  </>
                )}
              </button>

              {recruiterUser && onSignOutRecruiter && (
                <button
                  type="button"
                  onClick={onSignOutRecruiter}
                  title="Lock Recruiter Session"
                  className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#0A1128] text-slate-300 hover:text-white border border-white/10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070C1E]/95 backdrop-blur-2xl border-b border-white/10 px-4 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                onViewChange('careers');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
                currentView === 'careers' ? 'bg-[#FF6B35]/15 text-[#FF7F4E] border border-[#FF6B35]/30' : 'text-slate-300 hover:bg-[#0A1128]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#38BDF8]" /> Open Positions
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-[#FF6B35]/20 text-[#F7C59F]">
                {openRolesCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenTracker();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-[#0A1128] flex items-center gap-2"
            >
              <FileSearch className="w-4 h-4 text-[#38BDF8]" /> Track Application Status
            </button>

            <button
              type="button"
              onClick={() => {
                onViewChange(currentView === 'admin' ? 'careers' : 'admin');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 ${
                currentView === 'admin'
                  ? 'bg-[#FF6B35]/20 text-[#F7C59F] border border-[#FF6B35]/40'
                  : 'bg-gradient-to-r from-[#004E89]/40 to-[#FF6B35]/40 text-white border border-white/10'
              }`}
            >
              {recruiterUser ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  {currentView === 'admin' ? 'Exit Recruiter Portal' : 'Recruiter'}
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#FF6B35]" />
                  {currentView === 'admin' ? 'Exit Recruiter Portal' : 'Recruiter'}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
