import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  UserPlus, 
  Trash2, 
  Clock, 
  Lock, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  Mail, 
  UserCheck,
  RefreshCw,
  Search,
  BadgeAlert
} from 'lucide-react';
import { 
  getAuthorizedRecruitersList, 
  addAuthorizedRecruiter, 
  removeAuthorizedRecruiter, 
  getRecentAuditLogs,
  PRIMARY_ADMIN_EMAIL,
  logSecurityEvent
} from '../services/authService';
import { RecruiterUser, SecurityAuditLog, RecruiterRole } from '../types';

interface SecurityTeamManagementProps {
  currentUser?: RecruiterUser | null;
}

export const SecurityTeamManagement: React.FC<SecurityTeamManagementProps> = ({ currentUser }) => {
  const [recruiters, setRecruiters] = useState<{ email: string; name: string; role: RecruiterRole; title: string; addedAt?: number }[]>([]);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'team' | 'logs'>('team');

  // New Recruiter Form State
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('Technical Recruiter');
  const [newRole, setNewRole] = useState<RecruiterRole>('recruiter');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadSecurityData = async () => {
    setIsLoading(true);
    const [recList, logs] = await Promise.all([
      getAuthorizedRecruitersList(),
      getRecentAuditLogs(30)
    ]);
    setRecruiters(recList);
    setAuditLogs(logs);
    setIsLoading(false);
  };

  useEffect(() => {
    loadSecurityData();
  }, []);

  const handleAddRecruiterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newName.trim()) {
      setStatusFeedback({ type: 'error', message: 'Email and Name are required.' });
      return;
    }

    setIsSubmitting(true);
    setStatusFeedback(null);

    try {
      await addAuthorizedRecruiter(newEmail.trim(), newName.trim(), newRole, newTitle.trim());
      
      await logSecurityEvent({
        action: 'STATUS_CHANGE',
        userEmail: currentUser?.email || 'admin',
        userName: currentUser?.displayName || 'Admin',
        targetType: 'system',
        details: `Authorized new recruiter: ${newEmail.trim()} with role ${newRole}`
      });

      setStatusFeedback({
        type: 'success',
        message: `Successfully authorized "${newEmail.trim()}" for Recruiter Portal access.`
      });

      setNewEmail('');
      setNewName('');
      setNewTitle('Technical Recruiter');
      await loadSecurityData();
    } catch (err: any) {
      setStatusFeedback({
        type: 'error',
        message: err.message || 'Failed to authorize recruiter.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveRecruiter = async (email: string) => {
    if (email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
      alert('The primary Super Admin email cannot be removed.');
      return;
    }

    if (window.confirm(`Revoke recruiter access for ${email}?`)) {
      try {
        await removeAuthorizedRecruiter(email);
        await logSecurityEvent({
          action: 'STATUS_CHANGE',
          userEmail: currentUser?.email || 'admin',
          userName: currentUser?.displayName || 'Admin',
          targetType: 'system',
          details: `Revoked recruiter access for: ${email}`
        });
        await loadSecurityData();
      } catch (err: any) {
        alert(err.message || 'Failed to remove recruiter.');
      }
    }
  };

  return (
    <div className="space-y-6" id="security-team-management">
      {/* Overview Banner */}
      <div className="bg-[#050B1D]/90 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Recruiter Portal Access Control Active
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
              Access Governance & Audit Center
            </h2>
            <p className="text-xs text-slate-300 font-['Plus_Jakarta_Sans']">
              Only accounts explicitly cleared in this directory or with valid Google Workspace credentials can access candidate pipelines and executive hiring records.
            </p>
          </div>

          <button
            type="button"
            onClick={loadSecurityData}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Records
          </button>
        </div>

        {/* Security Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/10">
          <div className="p-3 rounded-xl bg-[#070C1E] border border-white/5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FF6B35]/15 border border-[#FF6B35]/30 flex items-center justify-center text-[#FF7F4E]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Authorized Team</div>
              <div className="text-base font-bold text-white font-['Outfit']">{recruiters.length} Cleared Accounts</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#070C1E] border border-white/5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#004E89]/25 border border-[#004E89]/40 flex items-center justify-center text-[#7DD3FC]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Access Logging</div>
              <div className="text-base font-bold text-[#7DD3FC] font-['Outfit']">Zero-Trust Active</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#070C1E] border border-white/5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Current Session</div>
              <div className="text-base font-bold text-emerald-300 font-['Outfit'] truncate max-w-[170px]">
                {currentUser?.email || PRIMARY_ADMIN_EMAIL}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('team')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'team'
              ? 'bg-[#FF6B35]/20 text-[#FF7F4E] border border-[#FF6B35]/40'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" /> Authorized Recruiters ({recruiters.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'logs'
              ? 'bg-[#004E89]/30 text-[#7DD3FC] border border-[#004E89]/50'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> Security Audit Trail ({auditLogs.length})
        </button>
      </div>

      {/* SUB-TAB 1: TEAM DIRECTORY & INVITE FORM */}
      {activeSubTab === 'team' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: List of Authorized Recruiters (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FF7F4E]" />
              Active Recruiter Directory
            </h3>

            <div className="space-y-2.5">
              {recruiters.map((rec, index) => {
                const isPrimary = rec.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase();

                return (
                  <div
                    key={`${rec.email}-${index}`}
                    className="p-4 rounded-2xl bg-[#050B1D]/80 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between flex-wrap gap-3"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35]/20 to-[#004E89]/40 border border-white/15 flex items-center justify-center text-sm font-bold text-white font-mono">
                        {rec.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white font-['Outfit']">{rec.name}</span>
                          {isPrimary && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#FF6B35]/20 text-[#FF7F4E] border border-[#FF6B35]/40">
                              Primary Super Admin
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#F7C59F] font-mono mt-0.5">{rec.email}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{rec.title}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-white/5 border border-white/10 text-slate-300 capitalize">
                        {rec.role.replace('_', ' ')}
                      </span>

                      {!isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRecruiter(rec.email)}
                          title="Revoke access"
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Add / Authorize New Recruiter Form */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#7DD3FC]" />
              Authorize New Recruiter
            </h3>

            <form
              onSubmit={handleAddRecruiterSubmit}
              className="bg-[#050B1D]/90 border border-white/10 rounded-2xl p-5 space-y-4"
            >
              {statusFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                    statusFeedback.type === 'success'
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                  }`}
                >
                  {statusFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="leading-relaxed">{statusFeedback.message}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-slate-300">Recruiter Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. talent.partner@company.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-[#070C1E] border border-white/10 focus:border-[#FF6B35] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-slate-300">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Hayes"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#070C1E] border border-white/10 focus:border-[#FF6B35] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-slate-300">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Talent Acquisition Specialist"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#070C1E] border border-white/10 focus:border-[#FF6B35] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-slate-300">Permission Level</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as RecruiterRole)}
                  className="w-full bg-[#070C1E] border border-white/10 focus:border-[#FF6B35] rounded-xl px-3 py-2 text-xs text-slate-200 outline-none cursor-pointer font-mono"
                >
                  <option value="recruiter">Recruiter (Review & Evaluate)</option>
                  <option value="lead_recruiter">Lead Recruiter (Full Candidate & Job Control)</option>
                  <option value="hiring_manager">Hiring Manager (Review & Interview Feedback)</option>
                  <option value="super_admin">Super Admin (Full Platform Control)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#E85924] hover:from-[#FF7F4E] hover:to-[#FF6B35] text-white font-bold text-xs shadow-md shadow-[#FF6B35]/25 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-3.5 h-3.5" />
                {isSubmitting ? 'Granting Clearance...' : 'Grant Security Clearance'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SECURITY AUDIT TRAIL */}
      {activeSubTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#7DD3FC]" />
              Immutable Access & Modification Logs
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Recorded in Firestore</span>
          </div>

          <div className="bg-[#050B1D]/80 border border-white/10 rounded-2xl overflow-hidden">
            {auditLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-mono">
                No recent security events recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {auditLogs.map((log) => {
                  const isDenied = log.action === 'ACCESS_DENIED';
                  const isLogin = log.action === 'LOGIN';

                  return (
                    <div key={log.id} className="p-4 flex items-center justify-between flex-wrap gap-3 hover:bg-white/[0.02]">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isDenied
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : isLogin
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-[#FF6B35]/15 text-[#FF7F4E] border border-[#FF6B35]/30'
                          }`}
                        >
                          {isDenied ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                isDenied
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : isLogin
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-white/10 text-slate-200'
                              }`}
                            >
                              {log.action}
                            </span>
                            <span className="text-xs font-semibold text-white">{log.userName}</span>
                            <span className="text-[11px] text-slate-400 font-mono">({log.userEmail})</span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1">{log.details}</p>
                        </div>
                      </div>

                      <div className="text-[10px] font-mono text-slate-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
