import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  SlidersHorizontal, 
  X, 
  Building2, 
  ChevronDown, 
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { Job, JobDepartment, WorkLocation, ExperienceLevel } from '../types';
import { JobCard } from './JobCard';

interface JobListingsProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  onApplyJob: (job: Job) => void;
}

const DEPARTMENTS: { label: string; value: string }[] = [
  { label: 'All Roles', value: 'all' },
  { label: 'AI & ML', value: 'AI & Machine Learning' },
  { label: 'Engineering', value: 'Engineering' },
  { label: 'Cloud & DevOps', value: 'Cloud & DevOps' },
  { label: 'Cybersecurity', value: 'Cybersecurity' },
  { label: 'Product & Design', value: 'Product & Design' },
  { label: 'Data & Analytics', value: 'Data & Analytics' }
];

export const JobListings: React.FC<JobListingsProps> = ({
  jobs,
  onSelectJob,
  onApplyJob
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'salary'>('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filtered & Sorted Jobs
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        if (!job.isOpen) return false;

        // Search text matching title, description, skills, location
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = job.title.toLowerCase().includes(q);
          const matchDesc = job.description.toLowerCase().includes(q);
          const matchLoc = job.location.toLowerCase().includes(q);
          const matchSkills = job.techStack?.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchLoc && !matchSkills) return false;
        }

        // Department
        if (selectedDept !== 'all' && job.department !== selectedDept) {
          return false;
        }

        // Work Location (Remote / Hybrid / Onsite)
        if (selectedLocation !== 'all' && job.workLocation !== selectedLocation) {
          return false;
        }

        // Experience Level
        if (selectedLevel !== 'all' && job.experienceLevel !== selectedLevel) {
          return false;
        }

        // Job Type (Full-time / Contract etc)
        if (selectedType !== 'all' && job.type !== selectedType) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'salary') {
          // rough salary sort extract numbers
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
            <span>Open Engineering & Leadership Roles</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-['Outfit'] leading-tight">
            Shape the Future of <br className="hidden sm:inline" />
            <span 
              className="bg-gradient-to-r from-[#FF6B35] via-[#F7C59F] to-[#38BDF8] bg-clip-text text-transparent"
              style={{ filter: 'drop-shadow(0 0 24px rgba(255, 107, 53, 0.35))' }}
            >
              Digital Transformation
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Tech Movement builds high-impact enterprise AI platforms, resilient cloud architectures, and next-generation digital products. Explore our open positions and join world-class talent.
          </p>

          {/* Quick Search Input */}
          <div className="pt-2">
            <div className="relative flex items-center max-w-2xl bg-[#050B1D]/90 border border-white/15 rounded-2xl p-1.5 focus-within:border-[#FF6B35] focus-within:ring-1 focus-within:ring-[#FF6B35]/40 transition-all shadow-xl backdrop-blur-md">
              <Search className="w-5 h-5 text-[#F7C59F]/70 ml-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by job title, skill (e.g. React, Kubernetes, AI), or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-400 outline-none"
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
          {DEPARTMENTS.map((dept) => {
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
          {/* Left filters (Location, Level, Type) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Location dropdown */}
            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-[#070C1E] border border-white/10 text-xs text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#FF6B35] pr-8 cursor-pointer appearance-none"
              >
                <option value="all">All Locations (Remote / Hybrid)</option>
                <option value="Remote">Remote Only</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Experience level */}
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-[#070C1E] border border-white/10 text-xs text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#FF6B35] pr-8 cursor-pointer appearance-none"
              >
                <option value="all">All Experience Levels</option>
                <option value="Senior">Senior Level</option>
                <option value="Lead / Principal">Lead / Principal</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Entry-level">Entry-level</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="px-3 py-2 rounded-xl text-xs text-[#FF7F4E] hover:text-[#FF6B35] bg-[#FF6B35]/15 border border-[#FF6B35]/30 flex items-center gap-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear Filters ({activeFiltersCount})
              </button>
            )}
          </div>

          {/* Right Sort By & Count */}
          <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
            <span>
              Showing <strong className="text-[#F7C59F] font-semibold">{filteredJobs.length}</strong> of {jobs.length} roles
            </span>

            <div className="flex items-center gap-1.5 bg-[#070C1E] px-2.5 py-1.5 rounded-xl border border-white/10">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer"
              >
                <option value="newest" className="bg-[#070C1E]">Newest First</option>
                <option value="salary" className="bg-[#070C1E]">Highest Salary</option>
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
              onSelectJob={onSelectJob}
              onApplyJob={onApplyJob}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-[#090d16] border border-slate-800 rounded-3xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white font-['Outfit']">No matching roles found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn’t find any positions matching your current search parameters. Try clearing filters or broadening your terms.
            </p>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold hover:bg-cyan-500/30 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
