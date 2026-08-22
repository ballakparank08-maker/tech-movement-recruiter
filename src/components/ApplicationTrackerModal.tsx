import React, { useState } from 'react';
import { X, Search, Clock, AlertCircle } from 'lucide-react';
import { Application } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ApplicationTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: Application[];
}

export const ApplicationTrackerModal: React.FC<ApplicationTrackerModalProps> = ({
  isOpen,
  onClose,
  applications
}) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [matchedApp, setMatchedApp] = useState<Application | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const clean = query.trim().toLowerCase();
    const found = applications.find(
      (a) => a.id.toLowerCase() === clean || a.candidateEmail.toLowerCase() === clean
    );
    setMatchedApp(found || null);
    setHasSearched(true);
  };

  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'New':
        return {
          title: 'Application Received',
          desc: 'Your application has been received and is queued for recruiter screening.',
          color: 'text-[#FF7F4E]',
          bg: 'bg-[#FF6B35]/15',
          border: 'border-[#FF6B35]/30'
        };
      case 'Reviewing':
        return {
          title: 'Hiring Team Review',
          desc: 'The technical leads are evaluating your resume and video introduction.',
          color: 'text-[#F7C59F]',
          bg: 'bg-[#F7C59F]/15',
          border: 'border-[#F7C59F]/30'
        };
      case 'Interviewing':
        return {
          title: 'Interview Stage',
          desc: 'You have been selected for interviews! Check your email for scheduling details.',
          color: 'text-[#7DD3FC]',
          bg: 'bg-[#004E89]/25',
          border: 'border-[#004E89]/40'
        };
      case 'Offer':
        return {
          title: 'Offer Stage',
          desc: 'Congratulations! An offer package is being prepared for you.',
          color: 'text-amber-400',
          bg: 'bg-amber-500/15',
          border: 'border-amber-500/30'
        };
      case 'Hired':
        return {
          title: 'Welcome to Tech Movement!',
          desc: 'You are officially part of the movement.',
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/15',
          border: 'border-emerald-500/30'
        };
      case 'Rejected':
        return {
          title: 'Application Archived',
          desc: 'While this specific role wasn’t a match, your profile is retained for future openings.',
          color: 'text-rose-400',
          bg: 'bg-rose-500/15',
          border: 'border-rose-500/30'
        };
      default:
        return {
          title: 'In Progress',
          desc: 'Your application is currently active.',
          color: 'text-slate-300',
          bg: 'bg-white/5',
          border: 'border-white/10'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto" id="application-tracker-modal">
      <div className="relative w-full max-w-lg bg-[#070C1E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto tm-glow-dual">
        <div className="h-1 w-full bg-gradient-to-r from-[#FF6B35] via-[#F7C59F] to-[#004E89]" />
        
        {/* Header */}
        <div className="p-6 bg-[#050B1D] border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">{t.tracker.title}</h3>
            <p className="text-xs text-slate-400 font-['Plus_Jakarta_Sans']">{t.tracker.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={t.tracker.inputPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-[#050B1D] border border-white/10 focus:border-[#FF6B35] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#E85924] hover:from-[#FF7F4E] hover:to-[#FF6B35] text-white text-xs font-semibold transition-all shadow-md shadow-[#FF6B35]/20 cursor-pointer"
            >
              {t.tracker.searchBtn}
            </button>
          </form>

          {matchedApp ? (
            <div className="bg-[#050B1D] border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">{t.tracker.appliedFor}:</span>
                  <h4 className="text-base font-bold text-white font-['Outfit']">{matchedApp.jobTitle}</h4>
                  <p className="text-xs text-[#FF7F4E] font-mono">{matchedApp.candidateName}</p>
                </div>

                <span className="text-[10px] font-mono text-slate-500">
                  {t.tracker.submittedOn} {new Date(matchedApp.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Status Box */}
              {(() => {
                const details = getStatusDetails(matchedApp.status);
                return (
                  <div className={`p-4 rounded-xl ${details.bg} border ${details.border} space-y-1`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${details.color} bg-current`} />
                      <h5 className={`text-xs font-bold font-['Outfit'] ${details.color}`}>
                        {details.title}
                      </h5>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-4.5 font-['Plus_Jakarta_Sans']">
                      {details.desc}
                    </p>
                  </div>
                );
              })()}

              <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-[#F7C59F]" />
                Updated: {new Date(matchedApp.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ) : hasSearched ? (
            <div className="text-center py-6 text-xs text-slate-400 space-y-1">
              <AlertCircle className="w-6 h-6 text-[#FF6B35] mx-auto mb-2" />
              <p className="font-semibold text-slate-200">{t.tracker.noAppsFound}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
