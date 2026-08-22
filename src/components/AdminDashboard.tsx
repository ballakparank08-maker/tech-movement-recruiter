import React, { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  FileText, 
  Video, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Star, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Mail, 
  Phone, 
  Globe, 
  Linkedin, 
  Github, 
  ChevronRight, 
  MessageSquare, 
  Send, 
  Sparkles, 
  RefreshCw, 
  Download, 
  Eye, 
  UserCheck, 
  Layers, 
  Columns, 
  Table, 
  MoreVertical,
  X,
  ShieldCheck,
  LogOut,
  Lock,
  User
} from 'lucide-react';
import { Application, ApplicationStatus, Job, JobDepartment, RecruiterNote, RecruiterUser } from '../types';
import { 
  updateApplicationStatus, 
  addRecruiterNote, 
  updateApplicationRating, 
  deleteApplication, 
  seedInitialApplications 
} from '../services/applicationService';
import { createJob, updateJob, deleteJob, seedInitialJobs } from '../services/jobService';
import { SecurityTeamManagement } from './SecurityTeamManagement';
import { logSecurityEvent } from '../services/authService';

interface AdminDashboardProps {
  applications: Application[];
  jobs: Job[];
  currentUser?: RecruiterUser | null;
  onSignOut?: () => void;
  onRefreshData?: () => void;
}

const STATUSES: { key: ApplicationStatus; label: string; color: string; bg: string; border: string }[] = [
  { key: 'New', label: 'New Applicants', color: 'text-[#7DD3FC]', bg: 'bg-[#004E89]/25', border: 'border-[#004E89]/40' },
  { key: 'Reviewing', label: 'Under Review', color: 'text-[#F7C59F]', bg: 'bg-[#F7C59F]/15', border: 'border-[#F7C59F]/30' },
  { key: 'Interviewing', label: 'Interviewing', color: 'text-[#FF7F4E]', bg: 'bg-[#FF6B35]/15', border: 'border-[#FF6B35]/30' },
  { key: 'Offer', label: 'Offer Extended', color: 'text-amber-300', bg: 'bg-amber-500/15', border: 'border-amber-500/30' },
  { key: 'Hired', label: 'Hired', color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
  { key: 'Rejected', label: 'Archived / Rejected', color: 'text-rose-400', bg: 'bg-rose-500/15', border: 'border-rose-500/30' }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  applications,
  jobs,
  currentUser,
  onSignOut,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'jobs' | 'security'>('pipeline');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  
  // Selected Application for Detail Drawer
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [recruiterAuthor, setRecruiterAuthor] = useState(
    currentUser?.displayName ? `${currentUser.displayName} (${currentUser.title || 'Recruiter'})` : 'Recruiter Team'
  );

  // Job Creation Modal state
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDept, setNewJobDept] = useState<JobDepartment>('Engineering');
  const [newJobType, setNewJobType] = useState('Full-time');
  const [newJobLoc, setNewJobLoc] = useState('San Francisco, CA / Remote');
  const [newJobWorkLoc, setNewJobWorkLoc] = useState<'Remote' | 'Hybrid' | 'On-site'>('Remote');
  const [newJobLevel, setNewJobLevel] = useState<'Entry-level' | 'Mid-Level' | 'Senior' | 'Lead / Principal'>('Senior');
  const [newJobSalary, setNewJobSalary] = useState('$150,000 - $200,000');
  const [newJobDesc, setNewJobDesc] = useState('');
  const [newJobTechStack, setNewJobTechStack] = useState('React, TypeScript, Node.js');
  const [newJobResponsibilities, setNewJobResponsibilities] = useState('Lead feature development\nCollaborate with architects\nWrite high-test code');
  const [newJobRequirements, setNewJobRequirements] = useState('4+ years production experience\nStrong TypeScript knowledge\nCloud deployment experience');
  const [newJobBenefits, setNewJobBenefits] = useState('Remote flexibility\nComprehensive medical coverage\n$2,500 equipment stipend\n401(k) match');

  // Filtered Applications
  const filteredApps = applications.filter((app) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = app.candidateName.toLowerCase().includes(q);
      const matchEmail = app.candidateEmail.toLowerCase().includes(q);
      const matchRole = app.jobTitle.toLowerCase().includes(q);
      const matchCompany = app.currentCompany?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchRole && !matchCompany) return false;
    }

    if (selectedJobFilter !== 'all' && app.jobId !== selectedJobFilter) {
      return false;
    }

    if (selectedStatusFilter !== 'all' && app.status !== selectedStatusFilter) {
      return false;
    }

    return true;
  });

  // Metrics
  const totalApps = applications.length;
  const interviewingCount = applications.filter((a) => a.status === 'Interviewing' || a.status === 'Reviewing').length;
  const offerOrHiredCount = applications.filter((a) => a.status === 'Offer' || a.status === 'Hired').length;
  const activeJobsCount = jobs.filter((j) => j.isOpen).length;

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    await updateApplicationStatus(appId, newStatus);
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }
  };

  const handleRatingChange = async (appId: string, rating: number) => {
    await updateApplicationRating(appId, rating);
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp({ ...selectedApp, rating });
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !newNoteText.trim()) return;

    await addRecruiterNote(selectedApp.id, newNoteText.trim(), recruiterAuthor);
    const newNoteObj: RecruiterNote = {
      id: `note-${Date.now()}`,
      author: recruiterAuthor,
      text: newNoteText.trim(),
      createdAt: Date.now()
    };
    setSelectedApp({
      ...selectedApp,
      notes: [...(selectedApp.notes || []), newNoteObj]
    });
    setNewNoteText('');
  };

  const handleDeleteApp = async (appId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this application record?')) {
      await deleteApplication(appId);
      if (selectedApp?.id === appId) setSelectedApp(null);
    }
  };

  const handleCreateJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim() || !newJobDesc.trim()) return;

    await createJob({
      title: newJobTitle.trim(),
      department: newJobDept,
      type: newJobType as any,
      location: newJobLoc.trim(),
      workLocation: newJobWorkLoc,
      experienceLevel: newJobLevel,
      salaryRange: newJobSalary.trim(),
      description: newJobDesc.trim(),
      techStack: newJobTechStack.split(',').map((s) => s.trim()).filter(Boolean),
      responsibilities: newJobResponsibilities.split('\n').map((s) => s.trim()).filter(Boolean),
      requirements: newJobRequirements.split('\n').map((s) => s.trim()).filter(Boolean),
      benefits: newJobBenefits.split('\n').map((s) => s.trim()).filter(Boolean),
      isOpen: true,
      createdAt: Date.now()
    });

    setShowCreateJobModal(false);
    // Reset inputs
    setNewJobTitle('');
    setNewJobDesc('');
  };

  const handleToggleJobStatus = async (job: Job) => {
    await updateJob(job.id, { isOpen: !job.isOpen });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="admin-dashboard-root">
      {/* Recruiter Header Bar */}
      <div className="frosted-luxe rounded-3xl p-6 sm:p-8 relative overflow-hidden tm-glow-dual">
        <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#FF6B35]/15 text-[#FF7F4E] border border-[#FF6B35]/30 uppercase">
                Admin & Recruiter Portal
              </span>
              <span className="text-xs text-slate-400 font-mono">• Live Firebase Firestore Sync</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Tech Movement Candidate Pipeline
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage incoming talent applications, evaluate video pitches & resumes, and publish new job openings.
            </p>
          </div>

          {/* Action buttons & Recruiter Profile */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Logged in Recruiter Profile Badge */}
            {currentUser && (
              <div className="flex items-center gap-2.5 bg-[#070C1E]/90 border border-white/15 px-3.5 py-1.5 rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#004E89] flex items-center justify-center text-xs font-bold text-white font-mono shadow-sm">
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'R'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white font-['Outfit'] leading-tight">
                      {currentUser.displayName}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-[10px] text-[#F7C59F] font-mono leading-tight">
                    {currentUser.role === 'super_admin' ? 'Super Admin' : 'Recruiter Clearance'}
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowCreateJobModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#E85924] hover:from-[#FF7F4E] hover:to-[#FF6B35] text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-[#FF6B35]/25 transition-all cursor-pointer"
              id="admin-create-job-btn"
            >
              <Plus className="w-4 h-4" /> Post New Job
            </button>

            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                title="Lock Portal and Sign Out"
                className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                id="recruiter-signout-btn"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span className="hidden sm:inline">Lock Portal</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="bg-[#070C1E]/70 border border-white/10 rounded-2xl p-4">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Total Applications</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-['Outfit']">{totalApps}</div>
            <div className="text-[10px] text-[#F7C59F] mt-1 flex items-center gap-1 font-mono">
              <Users className="w-3 h-3 text-[#F7C59F]" /> Across all roles
            </div>
          </div>

          <div className="bg-[#070C1E]/70 border border-white/10 rounded-2xl p-4">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Active Pipeline</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#7DD3FC] mt-1 font-['Outfit']">{interviewingCount}</div>
            <div className="text-[10px] text-[#7DD3FC]/80 mt-1 flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-[#7DD3FC]" /> Reviewing & Interviewing
            </div>
          </div>

          <div className="bg-[#070C1E]/70 border border-white/10 rounded-2xl p-4">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Offers & Hired</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1 font-['Outfit']">{offerOrHiredCount}</div>
            <div className="text-[10px] text-emerald-300 mt-1 flex items-center gap-1 font-mono">
              <UserCheck className="w-3 h-3 text-emerald-400" /> High conversion
            </div>
          </div>

          <div className="bg-[#070C1E]/70 border border-white/10 rounded-2xl p-4">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Open Job Positions</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#FF7F4E] mt-1 font-['Outfit']">{activeJobsCount}</div>
            <div className="text-[10px] text-[#FF7F4E]/80 mt-1 flex items-center gap-1 font-mono">
              <Briefcase className="w-3 h-3 text-[#FF7F4E]" /> Published openings
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation (Candidate Pipeline vs. Manage Job Postings vs. Security Access) */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-[#FF6B35]/20 text-[#FF7F4E] border border-[#FF6B35]/50 shadow-[0_0_15px_rgba(255,107,53,0.2)]'
                : 'text-slate-400 hover:text-white bg-white/5 border border-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5 inline mr-1.5" />
            Candidate Applications ({applications.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'jobs'
                ? 'bg-[#004E89]/30 text-[#7DD3FC] border border-[#004E89]/50 shadow-[0_0_15px_rgba(0,78,137,0.3)]'
                : 'text-slate-400 hover:text-white bg-white/5 border border-white/10'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 inline mr-1.5" />
            Manage Job Openings ({jobs.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'text-slate-400 hover:text-white bg-white/5 border border-white/10'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 inline mr-1.5 text-emerald-400" />
            Security & Team Clearance
          </button>
        </div>

        {/* View Mode (Kanban vs Table) when on pipeline tab */}
        {activeTab === 'pipeline' && (
          <div className="flex items-center gap-2">
            <div className="bg-[#050B1D] p-1 rounded-xl border border-white/10 flex items-center text-xs">
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all cursor-pointer ${
                  viewMode === 'kanban' ? 'bg-[#FF6B35]/20 text-[#FF7F4E] border border-[#FF6B35]/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Columns className="w-3.5 h-3.5" /> Kanban Board
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-[#FF6B35]/20 text-[#FF7F4E] border border-[#FF6B35]/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Table className="w-3.5 h-3.5" /> Table View
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: CANDIDATE PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {/* Search & Filter bar for candidates */}
          <div className="flex items-center justify-between flex-wrap gap-3 bg-[#070C1E]/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 flex-1 min-w-[260px]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search applicants by name, email, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#050B1D] border border-white/10 focus:border-[#FF6B35] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>

              {/* Filter by Job */}
              <select
                value={selectedJobFilter}
                onChange={(e) => setSelectedJobFilter(e.target.value)}
                className="bg-[#050B1D] border border-white/10 text-xs text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#FF6B35] cursor-pointer"
              >
                <option value="all">All Jobs</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick status count badges */}
            <div className="text-xs text-slate-400 font-mono">
              Filtered: <strong className="text-[#FF7F4E]">{filteredApps.length}</strong> candidates
            </div>
          </div>

          {/* VIEW A: KANBAN BOARD */}
          {viewMode === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
              {STATUSES.map((col) => {
                const columnApps = filteredApps.filter((a) => a.status === col.key);
                return (
                  <div
                    key={col.key}
                    className="bg-[#070C1E]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 flex flex-col min-h-[480px]"
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${col.bg} ${col.border} border`} />
                        <h3 className="text-xs font-bold text-slate-200 font-['Outfit']">{col.label}</h3>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${col.bg} ${col.color} border ${col.border}`}>
                        {columnApps.length}
                      </span>
                    </div>

                    {/* Application Cards in Column */}
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                      {columnApps.map((app) => (
                        <div
                          key={app.id}
                          onClick={() => setSelectedApp(app)}
                          className="bg-[#091126] hover:bg-[#0E1A38] border border-white/10 hover:border-[#FF6B35]/40 rounded-xl p-3.5 space-y-2 cursor-pointer transition-all shadow-md group relative"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs font-bold text-white group-hover:text-[#F7C59F] transition-colors">
                              {app.candidateName}
                            </h4>
                            {app.videoType && (
                              <span className="p-1 rounded bg-[#FF6B35]/15 text-[#FF7F4E] border border-[#FF6B35]/30 text-[10px]" title="Has Video Introduction">
                                <Video className="w-3 h-3" />
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-[#7DD3FC] font-medium truncate">
                            {app.jobTitle}
                          </div>

                          <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-white/10 font-mono">
                            <span>{app.experienceYears ? `${app.experienceYears}y exp` : 'Candidate'}</span>
                            <span>{new Date(app.createdAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}</span>
                          </div>

                          {/* Quick Rating Stars */}
                          {app.rating ? (
                            <div className="flex items-center gap-0.5 text-amber-400">
                              {Array.from({ length: app.rating }).map((_, i) => (
                                <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))}

                      {columnApps.length === 0 && (
                        <div className="h-28 flex items-center justify-center text-[11px] text-slate-500 border border-dashed border-white/10 rounded-xl font-mono">
                          Empty stage
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW B: TABLE VIEW */}
          {viewMode === 'table' && (
            <div className="bg-[#070C1E]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#050B1D] text-slate-400 uppercase font-mono text-[10px] border-b border-white/10">
                    <tr>
                      <th className="p-4">Candidate</th>
                      <th className="p-4">Target Role</th>
                      <th className="p-4">Location & Exp</th>
                      <th className="p-4">Resume / Video</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {filteredApps.map((app) => (
                      <tr key={app.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-medium text-white">
                          <div>
                            <div className="font-bold">{app.candidateName}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{app.candidateEmail}</div>
                          </div>
                        </td>
                        <td className="p-4 text-[#7DD3FC] font-medium">
                          {app.jobTitle}
                        </td>
                        <td className="p-4 text-slate-400 text-[11px]">
                          <div>{app.candidateLocation}</div>
                          <div className="text-[10px] text-slate-500">{app.experienceYears ? `${app.experienceYears} Years Exp` : '—'}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {app.resumeDataUrl || app.resumeFileName ? (
                              <span className="px-2 py-1 rounded bg-[#004E89]/25 text-[#7DD3FC] text-[10px] font-mono flex items-center gap-1 border border-[#004E89]/40">
                                <FileText className="w-3 h-3" /> CV
                              </span>
                            ) : null}
                            {app.videoType ? (
                              <span className="px-2 py-1 rounded bg-[#FF6B35]/20 text-[#FF7F4E] text-[10px] font-mono flex items-center gap-1 border border-[#FF6B35]/30">
                                <Video className="w-3 h-3" /> Video
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="p-4">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                            className="bg-[#050B1D] border border-white/10 text-xs text-white rounded-lg px-2.5 py-1 outline-none focus:border-[#FF6B35] cursor-pointer"
                          >
                            {STATUSES.map((s) => (
                              <option key={s.key} value={s.key}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => handleRatingChange(app.id, star)}
                                className="hover:scale-125 transition-transform cursor-pointer"
                              >
                                <Star
                                  className={`w-3.5 h-3.5 ${
                                    (app.rating || 0) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedApp(app)}
                            className="px-3 py-1.5 rounded-lg bg-[#FF6B35]/15 hover:bg-[#FF6B35]/25 text-[#FF7F4E] border border-[#FF6B35]/30 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Review Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MANAGE JOB OPENINGS */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[#070C1E]/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">Active & Archived Job Openings</h3>
              <p className="text-xs text-slate-400">Control role visibility on the public careers board</p>
            </div>

            <button
              type="button"
              onClick={() => setShowCreateJobModal(true)}
              className="px-4 py-2 rounded-xl bg-[#FF6B35]/20 hover:bg-[#FF6B35]/30 border border-[#FF6B35]/40 text-[#FF7F4E] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Opening
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-[#070C1E]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5 space-y-4 relative"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#004E89]/25 text-[#7DD3FC] border border-[#004E89]/40">
                        {job.department}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        job.isOpen ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}>
                        {job.isOpen ? 'Active / Open' : 'Closed / Paused'}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white font-['Outfit']">{job.title}</h4>
                    <p className="text-xs text-slate-400">{job.location} • {job.salaryRange}</p>
                  </div>

                  {/* Toggle Open / Closed */}
                  <button
                    type="button"
                    onClick={() => handleToggleJobStatus(job)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      job.isOpen ? 'bg-white/10 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-white/10' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {job.isOpen ? 'Close Role' : 'Re-open Role'}
                  </button>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">{job.description}</p>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Applicants:{' '}
                    <strong className="text-[#FF7F4E]">
                      {applications.filter((a) => a.jobId === job.id).length}
                    </strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => deleteJob(job.id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SECURITY & TEAM CLEARANCE */}
      {activeTab === 'security' && (
        <SecurityTeamManagement currentUser={currentUser} />
      )}

      {/* CANDIDATE DETAIL DRAWER / MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto" id="candidate-detail-modal">
          <div className="relative w-full max-w-4xl bg-[#070C1E] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-auto tm-glow-dual">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#FF6B35] via-[#F7C59F] to-[#004E89]" />

            {/* Header */}
            <div className="p-6 bg-[#050B1D] border-b border-white/10 flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF6B35]/15 text-[#FF7F4E] border border-[#FF6B35]/30 uppercase">
                    {selectedApp.jobDepartment}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">ID: {selectedApp.id}</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white font-['Outfit']">
                  {selectedApp.candidateName}
                </h2>
                <p className="text-xs text-[#7DD3FC] font-medium mt-0.5">
                  Applied for: {selectedApp.jobTitle}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Status Dropdown */}
                <div className="flex items-center gap-2 bg-[#070C1E] p-1.5 rounded-xl border border-white/10">
                  <span className="text-xs text-slate-400 font-mono pl-2">Status:</span>
                  <select
                    value={selectedApp.status}
                    onChange={(e) => handleStatusChange(selectedApp.id, e.target.value as ApplicationStatus)}
                    className="bg-[#050B1D] text-xs text-[#FF7F4E] font-semibold rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-[#FF6B35] cursor-pointer"
                  >
                    {STATUSES.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Contact & Profiles ribbon */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#050B1D] p-4 rounded-2xl border border-white/10 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#FF7F4E] flex-shrink-0" />
                  <a href={`mailto:${selectedApp.candidateEmail}`} className="text-[#F7C59F] hover:underline truncate">
                    {selectedApp.candidateEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{selectedApp.candidatePhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#7DD3FC] flex-shrink-0" />
                  <span>{selectedApp.candidateLocation}</span>
                </div>
              </div>

              {/* Social and Portfolio links */}
              {(selectedApp.linkedinUrl || selectedApp.githubUrl || selectedApp.portfolioUrl) && (
                <div className="flex items-center gap-3 flex-wrap text-xs">
                  {selectedApp.linkedinUrl && (
                    <a
                      href={selectedApp.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-[#004E89]/25 hover:bg-[#004E89]/40 text-[#7DD3FC] border border-[#004E89]/40 flex items-center gap-1.5 transition-colors"
                    >
                      <Linkedin className="w-3.5 h-3.5" /> LinkedIn Profile <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {selectedApp.githubUrl && (
                    <a
                      href={selectedApp.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 flex items-center gap-1.5 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" /> GitHub Profile <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {selectedApp.portfolioUrl && (
                    <a
                      href={selectedApp.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-[#FF6B35]/15 hover:bg-[#FF6B35]/25 text-[#FF7F4E] border border-[#FF6B35]/30 flex items-center gap-1.5 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" /> Portfolio Site <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {/* Candidate Cover Letter */}
              {selectedApp.coverNote && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#FF7F4E]" /> Candidate Cover Note
                  </h4>
                  <div className="p-4 rounded-xl bg-[#050B1D] border border-white/10 text-xs text-slate-300 leading-relaxed">
                    {selectedApp.coverNote}
                  </div>
                </div>
              )}

              {/* VIDEO INTRODUCTION PLAYER */}
              {selectedApp.videoType && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-[#FF6B35]" /> Candidate Video Pitch
                  </h4>
                  <div className="bg-black rounded-2xl overflow-hidden border border-[#FF6B35]/30 aspect-video max-h-80 flex items-center justify-center">
                    {selectedApp.videoUrl ? (
                      <iframe
                        src={selectedApp.videoUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : selectedApp.videoDataUrl ? (
                      <video src={selectedApp.videoDataUrl} controls className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-xs text-slate-400">Video source unavailable</div>
                    )}
                  </div>
                </div>
              )}

              {/* RESUME / CV VIEWER */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#F7C59F]" /> Attached Resume / CV
                </h4>

                {selectedApp.resumeDataUrl ? (
                  <div className="bg-[#050B1D] border border-white/10 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#004E89]/25 border border-[#004E89]/40 text-[#7DD3FC] flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-mono">
                          {selectedApp.resumeFileName || 'Candidate_Resume.pdf'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {selectedApp.resumeFileSize ? `${(selectedApp.resumeFileSize / 1024).toFixed(1)} KB` : 'Attached File'}
                        </div>
                      </div>
                    </div>

                    <a
                      href={selectedApp.resumeDataUrl}
                      download={selectedApp.resumeFileName || 'Resume.pdf'}
                      className="px-4 py-2 rounded-xl bg-[#FF6B35]/20 hover:bg-[#FF6B35]/30 text-[#FF7F4E] text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#FF6B35]/40 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Resume
                    </a>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#050B1D] border border-white/10 text-xs text-slate-500 font-mono">
                    Candidate did not attach a document file (Video intro provided).
                  </div>
                )}
              </div>

              {/* RECRUITER NOTES SECTION */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <h4 className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#F7C59F]" /> Recruiter Notes & Evaluation History
                </h4>

                {selectedApp.notes && selectedApp.notes.length > 0 ? (
                  <div className="space-y-2">
                    {selectedApp.notes.map((note) => (
                      <div key={note.id} className="p-3.5 rounded-xl bg-[#050B1D] border border-white/10 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className="text-[#FF7F4E] font-semibold">{note.author}</span>
                          <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-slate-200">{note.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No notes logged yet for this candidate.</p>
                )}

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="space-y-2 pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an internal evaluation note..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="flex-1 bg-[#050B1D] border border-white/10 focus:border-[#FF6B35] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#FF6B35]/20 hover:bg-[#FF6B35]/30 text-[#FF7F4E] text-xs font-semibold border border-[#FF6B35]/40 transition-colors cursor-pointer"
                    >
                      Post Note
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 bg-[#050B1D] border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDeleteApp(selectedApp.id)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 p-2 rounded-lg hover:bg-rose-950/30 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Application
              </button>

              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors border border-white/10 cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW JOB MODAL */}
      {showCreateJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#070C1E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto tm-glow-dual">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#FF6B35] to-[#004E89]" />
            <div className="p-6 bg-[#050B1D] border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white font-['Outfit']">Post New Job Opening</h2>
              <button
                type="button"
                onClick={() => setShowCreateJobModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJobSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Principal AI Solutions Architect"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    className="w-full bg-[#050B1D] border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#FF6B35]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                  <select
                    value={newJobDept}
                    onChange={(e) => setNewJobDept(e.target.value as JobDepartment)}
                    className="w-full bg-[#050B1D] border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#FF6B35] cursor-pointer"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Data & Analytics">Data & Analytics</option>
                    <option value="Executive & Leadership">Executive & Leadership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Work Location Model</label>
                  <select
                    value={newJobWorkLoc}
                    onChange={(e) => setNewJobWorkLoc(e.target.value as any)}
                    className="w-full bg-[#050B1D] border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#FF6B35] cursor-pointer"
                  >
                    <option value="Remote">100% Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Salary Range</label>
                  <input
                    type="text"
                    placeholder="$160,000 - $210,000"
                    value={newJobSalary}
                    onChange={(e) => setNewJobSalary(e.target.value)}
                    className="w-full bg-[#050B1D] border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#FF6B35]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Role Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the mission and scope of this role..."
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  className="w-full bg-[#050B1D] border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  placeholder="React, TypeScript, Python, GCP"
                  value={newJobTechStack}
                  onChange={(e) => setNewJobTechStack(e.target.value)}
                  className="w-full bg-[#050B1D] border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Key Responsibilities (one per line)</label>
                <textarea
                  rows={3}
                  value={newJobResponsibilities}
                  onChange={(e) => setNewJobResponsibilities(e.target.value)}
                  className="w-full bg-[#050B1D] border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Core Requirements (one per line)</label>
                <textarea
                  rows={3}
                  value={newJobRequirements}
                  onChange={(e) => setNewJobRequirements(e.target.value)}
                  className="w-full bg-[#050B1D] border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateJobModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 bg-white/5 hover:bg-white/10 border border-white/10 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#E85924] hover:from-[#FF7F4E] hover:to-[#FF6B35] text-white font-semibold text-xs shadow-lg shadow-[#FF6B35]/25 cursor-pointer"
                >
                  Publish Job Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
