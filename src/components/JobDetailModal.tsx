import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Clock, 
  Share2, 
  Check, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  HeartHandshake,
  Cpu
} from 'lucide-react';
import { Job } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (job: Job) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  isOpen,
  onClose,
  onApply
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !job) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(job.createdAt).toLocaleDateString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto" id="job-detail-modal-overlay">
      <div 
        className="relative w-full max-w-3xl bg-[#0A1128]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_0_50px_rgba(0,12,30,0.8),0_0_30px_rgba(0,78,137,0.3)] overflow-hidden my-auto tm-glow-dual"
        id="job-detail-modal-content"
      >
        {/* Top Edge Glow line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#004E89] via-[#F7C59F] to-[#FF6B35]" />

        {/* Modal Top Bar */}
        <div className="p-6 sm:p-8 bg-[#070C1E]/90 border-b border-white/10 relative">
          {/* Action buttons (Share & Close) */}
          <div className="absolute top-6 right-6 flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 flex items-center gap-1.5 transition-colors border border-white/10"
              title="Share job opening"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-[#38BDF8]" />}
              <span>{copied ? 'Link Copied' : 'Share'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Department badge & tags */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#004E89]/25 text-[#7DD3FC] border border-[#004E89]/40 uppercase font-mono tracking-wider">
              {job.department}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#FF6B35]/15 text-[#FF7F4E] border border-[#FF6B35]/30">
              {job.workLocation}
            </span>
            {job.featured && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#F7C59F]/15 text-[#F7C59F] border border-[#F7C59F]/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#F7C59F]" /> Featured Role
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight mb-4 pr-16">
            {job.title}
          </h1>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300 pt-2 border-t border-white/10 font-mono">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#FF6B35] flex-shrink-0" />
              <span className="truncate text-[#F7C59F] font-semibold">{job.salaryRange}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#FF7F4E] flex-shrink-0" />
              <span className="truncate">{job.experienceLevel}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="truncate">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-7 max-h-[60vh] overflow-y-auto text-slate-300 text-sm leading-relaxed">
          {/* Summary */}
          <div>
            <h3 className="text-base font-bold text-white font-['Outfit'] mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8]" /> {t.modal.jobDetails}
            </h3>
            <p className="text-slate-300 leading-relaxed bg-[#070C1E]/80 p-4 rounded-xl border border-white/10 font-['Plus_Jakarta_Sans']">
              {job.description}
            </p>
          </div>

          {/* Tech Stack Pills (if present) */}
          {job.techStack && job.techStack.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit'] mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#38BDF8]" /> {t.modal.techStack}
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-[#050B1D] border border-[#004E89]/40 text-[#7DD3FC] shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit'] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6B35]" /> {t.modal.responsibilities}
              </h3>
              <ul className="space-y-2.5">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] mt-2 flex-shrink-0" />
                    <span className="text-slate-300 font-['Plus_Jakarta_Sans']">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit'] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {t.modal.requirements}
              </h3>
              <ul className="space-y-2.5">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400/80 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300 font-['Plus_Jakarta_Sans']">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="bg-gradient-to-br from-[#0A1128] to-[#120F24] p-5 rounded-xl border border-white/10 space-y-3">
              <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[#FF6B35]" /> {t.modal.benefits}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {job.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 font-['Plus_Jakarta_Sans']">
                    <div className="w-4 h-4 rounded bg-[#004E89]/30 text-[#38BDF8] flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5 font-bold">
                      ✓
                    </div>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer CTA */}
        <div className="p-5 sm:p-6 bg-[#070C1E] border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="text-[11px] text-slate-400 block font-mono">Tech Movement Innovation</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10 cursor-pointer"
            >
              {t.modal.close}
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onApply(job);
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] via-[#FF7F4E] to-[#E85924] hover:from-[#FF7F4E] hover:to-[#FF6B35] text-white font-semibold text-xs shadow-lg shadow-[#FF6B35]/30 flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer"
              id="job-modal-apply-btn"
            >
              {t.modal.applyNow} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
