import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Key, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  UserCheck,
  Building,
  Info
} from 'lucide-react';
import { 
  signInWithGoogleRecruiter, 
  signInWithSecurityPasscode, 
  PRIMARY_ADMIN_EMAIL,
  MASTER_SECURITY_PASSCODE
} from '../services/authService';
import { RecruiterUser } from '../types';
import { TechMovementLogo } from './TechMovementLogo';

interface RecruiterAuthGateProps {
  onAuthenticated: (user: RecruiterUser) => void;
  onReturnToCareers: () => void;
}

export const RecruiterAuthGate: React.FC<RecruiterAuthGateProps> = ({
  onAuthenticated,
  onReturnToCareers
}) => {
  const [authMethod, setAuthMethod] = useState<'google' | 'passcode'>('google');
  const [passcode, setPasscode] = useState('');
  const [customEmail, setCustomEmail] = useState(PRIMARY_ADMIN_EMAIL);
  const [customName, setCustomName] = useState('Talent Acquisition Lead');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const res = await signInWithGoogleRecruiter();
    setIsLoading(false);

    if (res.success && res.user) {
      onAuthenticated(res.user);
    } else if (res.error) {
      setErrorMessage(res.error);
    }
  };

  // Handle Passcode Sign-In
  const handlePasscodeSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setErrorMessage('Please enter the Recruiter Security Key / Passcode.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const res = await signInWithSecurityPasscode(passcode, customEmail, customName);
    setIsLoading(false);

    if (res.success && res.user) {
      onAuthenticated(res.user);
    } else if (res.error) {
      setErrorMessage(res.error);
    }
  };

  const handleFillDemoCredentials = () => {
    setPasscode(MASTER_SECURITY_PASSCODE);
    setCustomEmail(PRIMARY_ADMIN_EMAIL);
    setCustomName('Talent Partner (Super Admin)');
    setErrorMessage(null);
  };

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8" id="recruiter-auth-gate">
      <div className="relative w-full max-w-xl frosted-luxe rounded-3xl p-6 sm:p-10 tm-glow-dual overflow-hidden border border-white/15 shadow-2xl">
        {/* Accent top color strip */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#FF6B35] via-[#F7C59F] to-[#004E89]" />

        {/* Ambient background glow elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FF6B35]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#004E89]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header & Logo */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF6B35]/15 border border-[#FF6B35]/30 text-[#FF7F4E] text-xs font-mono font-semibold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>Restricted Recruiter Access</span>
            </div>

            <div className="flex justify-center py-2">
              <TechMovementLogo size="md" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
              Talent Operations & Executive Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-['Plus_Jakarta_Sans']">
              This environment contains confidential candidate evaluation pipelines, salary benchmarks, and live video submissions. Unauthorized access is strictly prohibited.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-rose-200">Security Authorization Failed</p>
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Auth Method Selector Tabs */}
          <div className="flex rounded-2xl bg-[#050B1D] p-1 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('google');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer ${
                authMethod === 'google'
                  ? 'bg-gradient-to-r from-[#FF6B35] to-[#E85924] text-white shadow-md shadow-[#FF6B35]/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" /> Google Single Sign-On
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('passcode');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer ${
                authMethod === 'passcode'
                  ? 'bg-gradient-to-r from-[#FF6B35] to-[#E85924] text-white shadow-md shadow-[#FF6B35]/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Key className="w-3.5 h-3.5" /> Security Passcode / Key
            </button>
          </div>

          {/* Form 1: Google SSO (Primary) */}
          {authMethod === 'google' && (
            <div className="space-y-5 bg-[#050B1D]/80 p-6 rounded-2xl border border-white/10">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                  <span>Pre-Configured Super Admin:</span>
                  <span className="text-[#F7C59F] font-bold">{PRIMARY_ADMIN_EMAIL}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-400 space-y-1">
                  <p className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Authorized Team Domains:
                  </p>
                  <p className="font-mono text-[10px] text-[#7DD3FC]">
                    • {PRIMARY_ADMIN_EMAIL} (Primary Super Admin)<br />
                    • *@techmovement.io (Corporate Recruiter Staff)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-3 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                id="google-recruiter-signin-btn"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                )}
                <span>Sign in with Google Workspace</span>
              </button>
            </div>
          )}

          {/* Form 2: Security Passcode (Fallback / Talent Ops Key) */}
          {authMethod === 'passcode' && (
            <form onSubmit={handlePasscodeSignIn} className="space-y-4 bg-[#050B1D]/80 p-6 rounded-2xl border border-white/10">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 font-mono">
                  Master Security Key / Access Passcode
                </label>
                <div className="relative">
                  <input
                    type={showPasscode ? 'text' : 'password'}
                    placeholder="Enter Talent Security Passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full bg-[#070C1E] border border-white/10 focus:border-[#FF6B35] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none pr-10 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] text-slate-400 font-mono">Recruiter Identifier (Email)</label>
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full bg-[#070C1E] border border-white/10 focus:border-[#FF6B35] rounded-xl px-3 py-2 text-xs text-slate-200 outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] text-slate-400 font-mono">Operator Display Name</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full bg-[#070C1E] border border-white/10 focus:border-[#FF6B35] rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleFillDemoCredentials}
                  className="text-[11px] text-[#F7C59F] hover:underline flex items-center gap-1 font-mono cursor-pointer"
                >
                  <Key className="w-3 h-3 text-[#FF6B35]" /> Use Master Passcode
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#E85924] hover:from-[#FF7F4E] hover:to-[#FF6B35] text-white font-bold text-xs shadow-md shadow-[#FF6B35]/25 transition-all cursor-pointer disabled:opacity-50"
                  id="recruiter-passcode-submit-btn"
                >
                  {isLoading ? 'Verifying...' : 'Authorize Access'}
                </button>
              </div>
            </form>
          )}

          {/* Security Policy Footer & Safe Return */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <button
              type="button"
              onClick={onReturnToCareers}
              className="text-slate-400 hover:text-white flex items-center gap-1.5 font-mono cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Careers
            </button>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF7F4E]" />
              <span>TLS 256-Bit & Firestore Security Guard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
