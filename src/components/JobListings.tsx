import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  X, 
  ArrowUpDown
} from 'lucide-react';
import { Job } from '../types';
import { JobCard } from './JobCard';
import { useLanguage } from '../context/LanguageContext';

interface JobListingsProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  onApplyJob: (job: Job) => void;
}

export const JobListings: React.FC<JobListingsProps> = ({
  jobs,
  onSelectJob,
  onApplyJob
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'salary'>('newest');

  const departments: { label: string; value: string }[] = [
    { label: t.hero.allRoles, value: 'all' },
    { label: t.hero.aiData, value: 'AI & Machine Learning' },
    { label: t.hero.engineering, value: 'Engineering' },
    { label: t.hero.cloudOps, value: 'Cloud & DevOps' },
    { label: t.hero.cybersecurity, value: 'Cybersecurity' },
    { label: t.hero.productDesign, value: 'Product & Design' },
    { label: 'Data & Analytics', value: 'Data & Analytics' }
  ];

  // Filtered & Sorted Jobs
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = job.title.toLowerCase().includes(q);
          const matchDesc = job.description.toLowerCase().includes(q);
          const matchLoc = job.location.toLowerCase().includes(q);
          const matchSkills = job.techStack.some((s) => s.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchLoc && !matchSkills) return false;
        }

        // Department
        if (selectedDept !== 'all' && job.department !== selectedDept) {
          return false;
        }

        // Work Location
        if (selectedLocation !== 'all' && job.workLocation !== selectedLocation) {
          return false;
        }

        // Experience Level
        if (selectedLevel !== 'all' && job.experienceLevel !== selectedLevel) {
          return false;
        }

        // Job Type
        if (selectedType !== 'all' && job.type !== selectedType) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'salary') {
          const getNum = (s: string) => {
            const m = s.match(/\$([0-9,]+)/);
            return m ? parseInt(m[1].replace(/,/g, ''), 10) : 0;
          };
          return getNum(b.salaryRange) - getNum(a.salaryRange);
        }
        return b.createdAt - a.createdAt;
      });
  }, [jobs, searchQuery, selectedDept, selectedLocation, selectedLevel, selectedType, sortBy]);

  const activeFiltersCount = [
    selectedDept !== 'all',
    selectedLocation !== 'all',
    selectedLevel !== 'all',
    selectedType !== 'all',
    searchQuery.trim().length > 0
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDept('all');
    setSelectedLocation('all');
    setSelectedLevel('all');
    setSelectedType('all');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="job-listings-section">
      {/* Hero Header Section */}
      <div className="relative rounded-3xl bg-[#0A1128]/75 backdrop-blur-2xl border border-white/10 p-6 sm:p-10 overflow-hidden tm-glow-dual shadow-[0_10px_35px_rgba(0,12,30,0.6)]">
        {/* Glow corner blobs */}
        <div className="absolute -top-16 -left-16 w-72 h-72 bg-[#004E89]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-[#FF6B35]/25 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B35]/15 border border-[#FF6B35]/30 text-[#FF7F4E] text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#F7C59F]" />
            <span>{t.hero.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-['Outfit'] leading-tight">
            {t.hero.titleMain} <br className="hidden sm:inline" />
            <span 
              className="bg-gradient-to-r from-[#FF6B35] via-[#F7C59F] to-[#38BDF8] bg-clip-text text-transparent"
              style={{ filter: 'drop-shadow(0 0 24px rgba(255, 107, 53, 0.35))' }}
            >
              {t.hero.titleHighlight}
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-['Plus_Jakarta_Sans']">
            {t.hero.subtitle}
          </p>

          {/* Quick Search Input */}
          <div className="pt-2">
            <div className="relative flex items-center max-w-2xl bg-[#050B1D]/90 border border-white/15 rounded-2xl p-1.5 focus-within:border-[#FF6B35] focus-within:ring-1 focus-within:ring-[#FF6B35]/40 transition-all shadow-xl backdrop-blur-md">
              <Search className="w-5 h-5 text-[#F7C59F]/70 ml-3 flex-shrink-0" />
              <input
                type="text"
                placeholder={t.hero.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-400 outline-none font-['Plus_Jakarta_Sans']"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 text-slate-400 hover:text-white mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="space-y-4">
        {/* Department Pills Scrollable Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {departments.map((dept) => {
            const isActive = selectedDept === dept.value;
            return (
              <button
                key={dept.value}
                onClick={() => setSelectedDept(dept.value)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF6B35]/25 to-[#004E89]/25 border border-[#FF6B35] text-white shadow-[0_0_16px_rgba(255,107,53,0.3)] font-bold'
                    : 'bg-[#0A1128]/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:border-[#F7C59F]/40'
                }`}
              >
                {dept.label}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3 bg-[#0A1128]/70 backdrop-blur-xl p-3.5 rounded-2xl border border-white/10">
          {/* Left filters */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="px-3 py-2 rounded-xl text-xs text-[#FF7F4E] hover:text-[#FF6B35] bg-[#FF6B35]/15 border border-[#FF6B35]/30 flex items-center gap-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> {t.hero.clearFilters} ({activeFiltersCount})
              </button>
            )}
          </div>

          {/* Right Sort By & Count */}
          <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
            <span>
              {t.hero.showingRoles} <strong className="text-[#F7C59F] font-semibold">{filteredJobs.length}</strong> {t.hero.of} {jobs.length} {t.hero.roles}
            </span>

            <div className="flex items-center gap-1.5 bg-[#070C1E] px-2.5 py-1.5 rounded-xl border border-white/10">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer"
              >
                <option value="newest" className="bg-[#070C1E]">{t.hero.newestFirst}</option>
                <option value="salary" className="bg-[#070C1E]">{t.hero.highestSalary}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Job Grid Results */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSelect={onSelectJob}
              onApply={onApplyJob}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#0A1128]/50 rounded-3xl border border-white/10 space-y-3">
          <p className="text-slate-400 text-sm">No jobs match your search filters.</p>
          <button
            onClick={resetFilters}
            className="text-xs text-[#FF6B35] font-semibold hover:underline"
          >
            {t.hero.clearFilters}
          </button>
        </div>
      )}
    </div>
  );
};
