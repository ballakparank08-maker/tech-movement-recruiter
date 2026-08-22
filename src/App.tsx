/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Globe2, 
  Users, 
  Cpu, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';
import { Job, Application, RecruiterUser } from './types';
import { subscribeToJobs, getJobs } from './services/jobService';
import { subscribeToApplications, getApplications } from './services/applicationService';
import { getStoredRecruiterSession, clearRecruiterSession, subscribeToAuthChanges } from './services/authService';
import { Navbar } from './components/Navbar';
import { JobListings } from './components/JobListings';
import { JobDetailModal } from './components/JobDetailModal';
import { ApplicationModal } from './components/ApplicationModal';
import { ApplicationTrackerModal } from './components/ApplicationTrackerModal';
import { AdminDashboard } from './components/AdminDashboard';
import { RecruiterAuthGate } from './components/RecruiterAuthGate';
import { Footer } from './components/Footer';
import { DeviceFrameWrapper } from './components/DeviceFrameWrapper';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [currentView, setCurrentView] = useState<'careers' | 'admin'>('careers');
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<Job | null>(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recruiterUser, setRecruiterUser] = useState<RecruiterUser | null>(() => getStoredRecruiterSession());

  // Check and subscribe to auth state & live Firestore updates
  useEffect(() => {
    // 1. Initial auth restoration
    const session = getStoredRecruiterSession();
    if (session) {
      setRecruiterUser(session);
    }

    const unsubscribeAuth = subscribeToAuthChanges((user) => {
      setRecruiterUser(user);
    });

    // 2. Initial immediate fetch
    getJobs().then((initialJobs) => {
      setJobs(initialJobs);
      setIsLoading(false);
    });

    getApplications().then((initialApps) => {
      setApplications(initialApps);
    });

    // 3. Real-time Firebase listeners
    const unsubscribeJobs = subscribeToJobs((updatedJobs) => {
      setJobs(updatedJobs);
      setIsLoading(false);
    });

    const unsubscribeApps = subscribeToApplications((updatedApps) => {
      setApplications(updatedApps);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeJobs();
      unsubscribeApps();
    };
  }, []);

  const handleRecruiterSignOut = async () => {
    await clearRecruiterSession();
    setRecruiterUser(null);
    setCurrentView('careers');
  };

  const openRolesCount = jobs.filter((j) => j.isOpen).length;

  return (
    <>
      <DeviceFrameWrapper>
        <div className="min-h-screen bg-[#070C1E] text-slate-100 flex flex-col selection:bg-[#FF6B35]/30 selection:text-[#F7C59F] bg-tech-grid">
        {/* Top Main Navbar */}
        <Navbar
          currentView={currentView}
          onViewChange={setCurrentView}
          onOpenTracker={() => setIsTrackerOpen(true)}
          openRolesCount={openRolesCount}
          recruiterUser={recruiterUser}
          onSignOutRecruiter={handleRecruiterSignOut}
        />

        {/* Main View Router */}
        <main className="flex-1">
          {currentView === 'careers' ? (
            <div className="space-y-12 pb-16">
              {/* 1. Job Listings Section */}
              <JobListings
                jobs={jobs}
                onSelectJob={(job) => setSelectedJobForDetail(job)}
                onApplyJob={(job) => setSelectedJobForApply(job)}
              />

              {/* 2. Company Innovation Pillars & Culture Section */}
              <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="culture-section">
                <div className="frosted-luxe rounded-3xl p-8 sm:p-12 relative overflow-hidden tm-glow-dual">
                  {/* Glow ambient lights */}
                  <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#004E89]/20 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10 space-y-8">
                    <div className="max-w-2xl space-y-3">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF6B35]/15 border border-[#FF6B35]/30 text-[#FF7F4E] text-xs font-mono">
                        <Zap className="w-3.5 h-3.5 text-[#FF6B35]" />
                        <span>{t.culture.badge}</span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-['Outfit']">
                        {t.culture.title}
                      </h2>

                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-['Plus_Jakarta_Sans']">
                        {t.culture.subtitle}
                      </p>
                    </div>

                    {/* 3 Pillars Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                      {/* Pillar 1 */}
                      <div className="bg-[#050B1D]/80 border border-[#004E89]/40 hover:border-[#004E89] rounded-2xl p-6 space-y-3 relative group transition-all">
                        <div className="w-12 h-12 rounded-xl bg-[#004E89]/25 border border-[#004E89]/40 text-[#7DD3FC] flex items-center justify-center">
                          <Cpu className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white font-['Outfit']">{t.culture.pillar1Title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-['Plus_Jakarta_Sans']">
                          {t.culture.pillar1Desc}
                        </p>
                      </div>

                      {/* Pillar 2 */}
                      <div className="bg-[#050B1D]/80 border border-white/10 hover:border-white/20 rounded-2xl p-6 space-y-3 relative group transition-all">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-[#F7C59F] flex items-center justify-center">
                          <Globe2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white font-['Outfit']">{t.culture.pillar2Title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-['Plus_Jakarta_Sans']">
                          {t.culture.pillar2Desc}
                        </p>
                      </div>

                      {/* Pillar 3 */}
                      <div className="bg-[#050B1D]/80 border border-[#FF6B35]/30 hover:border-[#FF6B35]/60 rounded-2xl p-6 space-y-3 relative group transition-all">
                        <div className="w-12 h-12 rounded-xl bg-[#FF6B35]/15 border border-[#FF6B35]/30 text-[#FF7F4E] flex items-center justify-center">
                          <TrendingUp className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white font-['Outfit']">{t.culture.pillar3Title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-['Plus_Jakarta_Sans']">
                          {t.culture.pillar3Desc}
                        </p>
                      </div>
                    </div>

                    {/* Fast CTA */}
                    <div className="pt-6 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-full bg-[#FF6B35]/30 border border-[#FF6B35]/50 flex items-center justify-center text-[10px] font-bold text-[#F7C59F]">TM</div>
                          <div className="w-8 h-8 rounded-full bg-[#004E89]/40 border border-[#004E89]/60 flex items-center justify-center text-[10px] font-bold text-[#7DD3FC]">AI</div>
                          <div className="w-8 h-8 rounded-full bg-emerald-500/30 border border-emerald-400/50 flex items-center justify-center text-[10px] font-bold text-emerald-200">OPS</div>
                        </div>
                        <span className="text-xs text-slate-300 font-mono">
                          {t.culture.evaluatedStat}
                        </span>
                      </div>

                      <a
                        href="#job-listings-section"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#E85924] hover:from-[#FF7F4E] hover:to-[#FF6B35] text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-[#FF6B35]/25 transition-all"
                      >
                        {t.culture.browseRoles} <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          ) : !recruiterUser ? (
            /* Recruiter Security Access Gate - Client or unauthorized users are blocked */
            <RecruiterAuthGate
              onAuthenticated={(user) => setRecruiterUser(user)}
              onCancel={() => setCurrentView('careers')}
            />
          ) : (
            /* Protected Recruiter Admin Dashboard View */
            <AdminDashboard
              applications={applications}
              jobs={jobs}
              currentUser={recruiterUser}
              onSignOut={handleRecruiterSignOut}
            />
          )}
        </main>

        {/* Footer */}
        <Footer
          onOpenRecruiter={() => setCurrentView('admin')}
          onOpenTracker={() => setIsTrackerOpen(true)}
        />
      </div>
    </DeviceFrameWrapper>

    {/* Root Level Floating Pop-up Modals (unconstrained by device frame scale/overflow) */}
    {selectedJobForDetail && (
      <JobDetailModal
        job={selectedJobForDetail}
        isOpen={Boolean(selectedJobForDetail)}
        onClose={() => setSelectedJobForDetail(null)}
        onApply={(job) => {
          setSelectedJobForDetail(null);
          setSelectedJobForApply(job);
        }}
      />
    )}

    {selectedJobForApply && (
      <ApplicationModal
        job={selectedJobForApply}
        isOpen={Boolean(selectedJobForApply)}
        onClose={() => setSelectedJobForApply(null)}
      />
    )}

    <ApplicationTrackerModal
      isOpen={isTrackerOpen}
      onClose={() => setIsTrackerOpen(false)}
      applications={applications}
    />
  </>
  );
}

