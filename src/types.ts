export type JobDepartment = 
  | 'Engineering'
  | 'AI & Machine Learning'
  | 'Cloud & DevOps'
  | 'Cybersecurity'
  | 'Product & Design'
  | 'Data & Analytics'
  | 'Executive & Leadership';

export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
export type WorkLocation = 'Remote' | 'Hybrid' | 'On-site';
export type ExperienceLevel = 'Entry-level' | 'Mid-Level' | 'Senior' | 'Lead / Principal' | 'Executive';

export interface Job {
  id: string;
  title: string;
  department: JobDepartment;
  type: JobType;
  location: string;
  workLocation: WorkLocation;
  experienceLevel: ExperienceLevel;
  salaryRange: string;
  featured?: boolean;
  isOpen: boolean;
  createdAt: number;
  updatedAt?: number;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
  techStack?: string[];
  benefits: string[];
  applicantCount?: number;
}

export type ApplicationStatus = 
  | 'New'
  | 'Reviewing'
  | 'Interviewing'
  | 'Offer'
  | 'Hired'
  | 'Rejected';

export interface RecruiterNote {
  id: string;
  author: string;
  text: string;
  createdAt: number;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  jobDepartment: JobDepartment;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateLocation: string;
  currentCompany?: string;
  currentRole?: string;
  experienceYears?: number;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  coverNote?: string;
  resumeFileName?: string;
  resumeFileType?: string;
  resumeFileSize?: number;
  resumeDataUrl?: string; // base64 or blob url
  videoType?: 'recorded' | 'file' | 'url';
  videoDataUrl?: string;
  videoUrl?: string;
  status: ApplicationStatus;
  rating?: number; // 1 to 5
  notes?: RecruiterNote[];
  createdAt: number;
  updatedAt: number;
}

export interface FilterState {
  searchQuery: string;
  department: string;
  workLocation: string;
  jobType: string;
  experienceLevel: string;
  sortBy: 'newest' | 'salary' | 'title';
}

export type RecruiterRole = 'super_admin' | 'lead_recruiter' | 'hiring_manager' | 'recruiter';

export interface RecruiterUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: RecruiterRole;
  title: string;
  authorizedAt: number;
  lastLoginAt: number;
  authProvider: 'google' | 'passcode' | 'sso';
}

export interface SecurityAuditLog {
  id: string;
  action: 'LOGIN' | 'STATUS_CHANGE' | 'NOTE_ADDED' | 'JOB_CREATED' | 'JOB_DELETED' | 'APPLICATION_DELETED' | 'ACCESS_DENIED';
  userEmail: string;
  userName: string;
  targetId?: string;
  targetType?: 'application' | 'job' | 'system';
  details: string;
  timestamp: number;
}
