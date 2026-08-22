import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Briefcase, 
  Sparkles, 
  Send, 
  Globe, 
  Linkedin, 
  Github, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Copy, 
  ArrowRight
} from 'lucide-react';
import { Job, Application } from '../types';
import { submitApplication } from '../services/applicationService';
import { VideoIntroductionRecorder } from './VideoIntroductionRecorder';

interface ApplicationModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onApplicationSubmitted?: (appId: string) => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  job,
  isOpen,
  onClose,
  onApplicationSubmitted
}) => {
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [candidateLocation, setCandidateLocation] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [experienceYears, setExperienceYears] = useState<number | undefined>(undefined);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [coverNote, setCoverNote] = useState('');

  // Resume state
  const [resumeFile, setResumeFile] = useState<{
    name: string;
    type: string;
    size: number;
    dataUrl?: string;
  } | null>(null);

  // Video state
  const [videoData, setVideoData] = useState<{
    type: 'recorded' | 'file' | 'url';
    dataUrl?: string;
    url?: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccessId, setSubmissionSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen) return null;

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setError('Resume file size exceeds 8MB. Please select a smaller PDF or Word document.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setResumeFile({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: reader.result as string
      });
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!candidateName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!candidateEmail.trim() || !candidateEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!candidatePhone.trim()) {
      setError('Please provide a contact phone number.');
      return;
    }
    if (!resumeFile && !videoData) {
      setError('Please upload either your resume / CV or provide a video introduction.');
      return;
    }

    setIsSubmitting(true);

    try {
      const appId = await submitApplication({
        jobId: job.id,
        jobTitle: job.title,
        jobDepartment: job.department,
        candidateName: candidateName.trim(),
        candidateEmail: candidateEmail.trim().toLowerCase(),
        candidatePhone: candidatePhone.trim(),
        candidateLocation: candidateLocation.trim() || 'Not specified',
        currentCompany: currentCompany.trim() || undefined,
        currentRole: currentRole.trim() || undefined,
        experienceYears: experienceYears ? Number(experienceYears) : undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        portfolioUrl: portfolioUrl.trim() || undefined,
        githubUrl: githubUrl.trim() || undefined,
        coverNote: coverNote.trim() || undefined,
        resumeFileName: resumeFile?.name,
        resumeFileType: resumeFile?.type,
        resumeFileSize: resumeFile?.size,
        resumeDataUrl: resumeFile?.dataUrl,
        videoType: videoData?.type,
        videoDataUrl: videoData?.dataUrl,
        videoUrl: videoData?.url
      });

      // Trigger celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B35', '#F7C59F', '#004E89', '#38BDF8', '#10B981', '#ffffff']
      });

      setSubmissionSuccessId(appId);
      if (onApplicationSubmitted) onApplicationSubmitted(appId);
    } catch (err: any) {
      console.error('Submission error:', err);
      setError('An error occurred while submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (submissionSuccessId) {
      navigator.clipboard.writeText(submissionSuccessId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto" id="application-modal-overlay">
      <div 
        className="relative w-full max-w-3xl bg-[#0A1128]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_0_50px_rgba(0,12,30,0.8),0_0_30px_rgba(0,78,137,0.3)] overflow-hidden my-auto tm-glow-dual"
        id="application-modal-content"
      >
        {/* Top Glowing Header Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#004E89] via-[#F7C59F] to-[#FF6B35]" />

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-start justify-between bg-[#070C1E]/90">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#004E89]/25 text-[#7DD3FC] border border-[#004E89]/40 uppercase font-mono">
                {job.department}
              </span>
              <span className="text-xs text-slate-400">• {job.workLocation}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
              Apply for <span className="bg-gradient-to-r from-white via-[#F7C59F] to-[#FF6B35] bg-clip-text text-transparent">{job.title}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Tech Movement — Innovation & Digital Transformation</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
            id="close-app-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation View */}
        {submissionSuccessId ? (
          <div className="p-8 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white font-['Outfit']">Application Submitted Successfully!</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Thank you, <strong className="text-[#F7C59F]">{candidateName}</strong>. Our recruiting team has received your submission for <strong className="text-white">{job.title}</strong> and will review your profile shortly.
              </p>
            </div>

            {/* Application Reference Card */}
            <div className="bg-[#070C1E] border border-white/10 rounded-xl p-4 max-w-md mx-auto text-left space-y-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Your Tracking Reference ID:</div>
              <div className="flex items-center justify-between bg-[#050B1D] p-2.5 rounded-lg border border-white/10">
                <code className="text-xs text-[#F7C59F] font-mono select-all break-all">{submissionSuccessId}</code>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="ml-2 px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-slate-300 text-xs flex items-center gap-1 transition-colors flex-shrink-0"
                >
                  <Copy className="w-3 h-3" />
                  {copiedId ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                A confirmation has been logged. You can check your application status anytime using this reference code in the tracker.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#E85924] hover:from-[#FF7F4E] hover:to-[#FF6B35] text-white font-semibold text-sm shadow-lg shadow-[#FF6B35]/25 transition-all cursor-pointer"
              >
                Back to Jobs
              </button>
            </div>
          </div>
        ) : (
          /* Application Input Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto" id="candidate-app-form">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Section 1: Personal Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#FF7F4E] uppercase tracking-wider font-mono">
                <User className="w-3.5 h-3.5" /> 1. Contact Information
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Full Name <span className="text-[#FF6B35]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      className="w-full bg-[#050B1D]/90 border border-white/10 focus:border-[#FF6B35] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email Address <span className="text-[#FF6B35]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="alex.morgan@domain.com"
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      className="w-full bg-[#050B1D]/90 border border-white/10 focus:border-[#FF6B35] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Phone Number <span className="text-[#FF6B35]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    className="w-full bg-[#050B1D]/90 border border-white/10 focus:border-[#FF6B35] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Location / City & Country
                  </label>
                  <input
                    type="text"
                    placeholder="San Francisco, CA / Remote"
                    value={candidateLocation}
                    onChange={(e) => setCandidateLocation(e.target.value)}
                    className="w-full bg-[#050B1D]/90 border border-white/10 focus:border-[#FF6B35] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Professional Background & Links */}
            <div className="space-y-4 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F7C59F] uppercase tracking-wider font-mono">
                <Briefcase className="w-3.5 h-3.5" /> 2. Experience & Profiles
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Current Company</label>
                  <input
                    type="text"
                    placeholder="Current employer or Freelance"
                    value={currentCompany}
                    onChange={(e) => setCurrentCompany(e.target.value)}
                    className="w-full bg-[#050B1D]/90 border border-white/10 focus:border-[#FF6B35] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Current Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Software Engineer"
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                    className="w-full bg-[#050B1D]/90 border border-white/10 focus:border-[#FF6B35] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    placeholder="e.g. 5"
                    value={experienceYears ?? ''}
                    onChange={(e) => setExperienceYears(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full bg-[#050B1D]/90 border border-white/10 focus:border-[#FF6B35] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                    <Linkedin className="w-3.5 h-3.5 text-[#38BDF8]" /> LinkedIn URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full bg-[#050B1D]/90 border border-white/10 focus:border-[#38BDF8] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5 text-[#F7C59F]" /> GitHub URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full bg-[#050B1D]/90 border border-white/10 focus:border-[#F7C59F] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" /> Portfolio / Website
                  </label>
                  <input
                    type="url"
                    placeholder="https://myportfolio.io"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="w-full bg-[#050B1D]/90 border border-white/10 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Resume / CV Upload */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#38BDF8] uppercase tracking-wider font-mono">
                  <FileText className="w-3.5 h-3.5" /> 3. Resume / CV
                </div>
                <span className="text-[11px] text-slate-400">PDF, Word, or TXT (Max 8MB)</span>
              </div>

              {resumeFile ? (
                <div className="bg-[#070C1E] border border-[#004E89]/50 rounded-xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#004E89]/25 border border-[#004E89]/40 text-[#7DD3FC] flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white font-mono">{resumeFile.name}</p>
                      <p className="text-[10px] text-slate-400">{(resumeFile.size / 1024).toFixed(1)} KB • Ready</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResumeFile(null)}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-xs text-[#FF7F4E] transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-white/15 hover:border-[#FF6B35]/50 rounded-xl p-5 text-center bg-[#070C1E]/60 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    id="resume-file-input"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleResumeUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-1 pointer-events-none">
                    <div className="w-9 h-9 rounded-full bg-[#004E89]/25 text-[#38BDF8] flex items-center justify-center mx-auto mb-1">
                      <Upload className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-medium text-slate-200">
                      Drag and drop your Resume here, or <span className="text-[#FF7F4E] underline">browse files</span>
                    </p>
                    <p className="text-[10px] text-slate-500">Supports PDF, DOCX, DOC</p>
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Video Introduction Component */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FF7F4E] uppercase tracking-wider font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-[#F7C59F]" /> 4. Candidate Video Introduction
                </div>
                <span className="text-[11px] text-slate-400">Stand out to hiring managers</span>
              </div>

              <VideoIntroductionRecorder
                onVideoSelected={(data) => setVideoData(data)}
                existingVideo={videoData || undefined}
              />
            </div>

            {/* Section 5: Cover Note / Message */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="block text-xs font-medium text-slate-300">
                Cover Note / Why Tech Movement? <span className="text-slate-500">(Optional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Briefly highlight your key technical achievements or what attracts you to our digital transformation mission..."
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                className="w-full bg-[#050B1D]/90 border border-white/10 focus:border-[#FF6B35] rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none transition-colors resize-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B35] via-[#FF7F4E] to-[#E85924] hover:from-[#FF7F4E] hover:to-[#FF6B35] text-white font-semibold text-xs shadow-lg shadow-[#FF6B35]/25 flex items-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                id="submit-candidate-application-btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting Application...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
