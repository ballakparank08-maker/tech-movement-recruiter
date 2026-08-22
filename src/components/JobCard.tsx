import React from 'react';
import { 
  MapPin, 
  DollarSign, 
  Sparkles, 
  ArrowRight, 
} from 'lucide-react';
import { Job } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface JobCardProps {
  job: Job;
  onSelectJob?: (job: Job) => void;
  onApplyJob?: (job: Job) => void;
  onSelect?: (job: Job) => void;
  onApply?: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onSelectJob,
  onApplyJob,
  onSelect,
  onApply
}) => {
  const { t } = useLanguage();

  const handleSelect = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onSelectJob) onSelectJob(job);
    if (onSelect) onSelect(job);
  };

  const handleApply = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onApplyJob) onApplyJob(job);
    if (onApply) onApply(job);
  };

  return (
    <div
      className={`group relative bg-[#0A1128]/70 backdrop-blur-xl border border-white/10 hover:border-[#FF6B35]/50 hover:bg-[#0D1836]/90 rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,10,25,0.4)] hover:shadow-[0_12px_30px_rgba(0,10,25,0.7),0_0_20px_rgba(255,107,53,0.2)] tm-card-hover ${
        job.featured ? 'ring-1 ring-[#F7C59F]/40 shadow-[0_0_25px_rgba(247,197,159,0.12)]' : ''
      }`}
      id={`job-card-${job.id}`}
    >
      {/* Top Edge Gradient Accent for Hover */}
      <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-[#FF6B35]/0 group-hover:via-[#FF6B35] to-transparent transition-all duration-300" />

      {/* Top Meta Tags */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#004E89]/25 text-[#7DD3FC] border border-[#004E89]/40 uppercase font-mono tracking-wider">
              {job.department}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#FF6B35]/15 text-[#FF7F4E] border border-[#FF6B35]/30">
              {job.workLocation}
            </span>
          </div>

          {job.featured && (
            <span className="flex items-center gap-1 text-[11px] font-mono text-[#F7C59F] bg-[#F7C59F]/15 px-2.5 py-0.5 rounded-full border border-[#F7C59F]/30">
              <Sparkles className="w-3 h-3 text-[#F7C59F]" /> Featured
            </span>
          )}
        </div>

        {/* Job Title */}
        <h3
          onClick={handleSelect}
          className="text-lg sm:text-xl font-bold text-white group-hover:text-[#F7C59F] transition-colors font-['Outfit'] cursor-pointer mb-2 line-clamp-2"
        >
          {job.title}
        </h3>

        {/* Short Summary */}
        <p className="text-xs text-slate-300/80 line-clamp-2 leading-relaxed mb-4 font-['Plus_Jakarta_Sans']">
          {job.description}
        </p>

        {/* Tech Stack Chips preview */}
        {job.techStack && job.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.techStack.slice(0, 4).map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#070C1E] text-slate-300 border border-white/10"
              >
                {tech}
              </span>
            ))}
            {job.techStack.length > 4 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400">
                +{job.techStack.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Metadata & Buttons */}
      <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
        {/* Info row */}
        <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-1.5 text-[#F7C59F] font-bold">
            <DollarSign className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span>{job.salaryRange}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="truncate max-w-[130px]">{job.location.split('/')[0]}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleSelect}
            className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold text-center transition-colors border border-white/10 cursor-pointer"
            id={`view-details-${job.id}`}
          >
            {t.modal.jobDetails}
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#E85924] hover:from-[#FF7F4E] hover:to-[#FF6B35] text-white text-xs font-semibold text-center transition-all shadow-md shadow-[#FF6B35]/25 flex items-center justify-center gap-1 cursor-pointer"
            id={`quick-apply-${job.id}`}
          >
            {t.modal.applyNow} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
