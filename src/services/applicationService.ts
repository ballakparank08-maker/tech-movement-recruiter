import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import { Application, ApplicationStatus, RecruiterNote } from '../types';

const APPLICATIONS_COLLECTION = 'applications';
const LOCAL_STORAGE_KEY = 'tm_cached_applications_v1';

function getLocalCachedApplications(): Application[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Local storage error:', e);
  }
  return [];
}

function saveLocalCachedApplications(apps: Application[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(apps));
  } catch (e) {
    console.warn('Local storage error:', e);
  }
}

// Sample candidate applications for instant rich dashboard demo
export const SEED_APPLICATIONS: Omit<Application, 'id'>[] = [
  {
    jobId: 'local-seed-1',
    jobTitle: 'Senior Full-Stack AI Engineer',
    jobDepartment: 'AI & Machine Learning',
    candidateName: 'Elena Rostova',
    candidateEmail: 'elena.rostova@techdev.io',
    candidatePhone: '+1 (415) 890-2341',
    candidateLocation: 'San Francisco, CA',
    currentCompany: 'OmniAI Labs',
    currentRole: 'Lead AI Engineer',
    experienceYears: 6,
    linkedinUrl: 'https://linkedin.com/in/elena-rostova-dev',
    githubUrl: 'https://github.com/elena-rostova',
    portfolioUrl: 'https://elena.codes',
    coverNote: 'Excited about Tech Movement’s vision for enterprise AI transformation. I’ve built multi-agent orchestration engines in React/FastAPI that handled 2M+ queries/month.',
    resumeFileName: 'Elena_Rostova_Resume_2026.pdf',
    resumeFileType: 'application/pdf',
    resumeFileSize: 148200,
    videoType: 'url',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-41857-large.mp4',
    status: 'Interviewing',
    rating: 5,
    notes: [
      {
        id: 'n-1',
        author: 'Alex Vance (Lead Recruiter)',
        text: 'Strong background in Gemini & LangChain agents. Completed 1st technical screen with flying colors.',
        createdAt: Date.now() - 86400000 * 1
      }
    ],
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 1
  },
  {
    jobId: 'local-seed-2',
    jobTitle: 'Lead Cloud Infrastructure & DevOps Architect',
    jobDepartment: 'Cloud & DevOps',
    candidateName: 'Marcus Sterling',
    candidateEmail: 'marcus.sterling@cloudops.net',
    candidatePhone: '+1 (512) 674-9912',
    candidateLocation: 'Austin, TX',
    currentCompany: 'Apex Scale Systems',
    currentRole: 'Principal SRE',
    experienceYears: 8,
    linkedinUrl: 'https://linkedin.com/in/marcus-sterling-cloud',
    githubUrl: 'https://github.com/marcus-k8s',
    coverNote: 'Managed multi-cloud EKS/GKE clusters across 4 continents. Implemented zero-downtime GitOps pipelines and automated failovers.',
    resumeFileName: 'Marcus_Sterling_Cloud_Architect.pdf',
    resumeFileType: 'application/pdf',
    resumeFileSize: 210400,
    status: 'Offer',
    rating: 5,
    notes: [
      {
        id: 'n-2',
        author: 'Sarah Chen (VP Engineering)',
        text: 'Offer letter dispatched. Top candidate for infrastructure lead.',
        createdAt: Date.now() - 43200000
      }
    ],
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 43200000
  },
  {
    jobId: 'local-seed-4',
    jobTitle: 'Senior Product Designer (UI/UX & Systems)',
    jobDepartment: 'Product & Design',
    candidateName: 'Aria Thorne',
    candidateEmail: 'aria.thorne@studioflux.design',
    candidatePhone: '+1 (206) 431-7788',
    candidateLocation: 'Seattle, WA',
    currentCompany: 'Hyperion UI Lab',
    currentRole: 'Senior Design Systems Lead',
    experienceYears: 5,
    portfolioUrl: 'https://ariathorne.design',
    linkedinUrl: 'https://linkedin.com/in/aria-thorne-ui',
    coverNote: 'Obsessed with high-contrast glowing dark mode interfaces, design tokens, and fluid Motion micro-interactions. Loving the Tech Movement branding!',
    resumeFileName: 'Aria_Thorne_Design_Portfolio.pdf',
    resumeFileType: 'application/pdf',
    resumeFileSize: 320000,
    videoType: 'url',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-designer-working-on-a-creative-project-41856-large.mp4',
    status: 'Reviewing',
    rating: 4,
    notes: [
      {
        id: 'n-3',
        author: 'Alex Vance (Lead Recruiter)',
        text: 'Portfolio is phenomenal. Sent over to Design Lead for portfolio review.',
        createdAt: Date.now() - 86400000
      }
    ],
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 86400000 * 1
  },
  {
    jobId: 'local-seed-3',
    jobTitle: 'Senior Cyber Defense & AppSec Specialist',
    jobDepartment: 'Cybersecurity',
    candidateName: 'David K. O’Connor',
    candidateEmail: 'doconnor@secops.io',
    candidatePhone: '+1 (212) 555-0193',
    candidateLocation: 'New York, NY',
    currentCompany: 'Sentinel Shield Cyber',
    currentRole: 'Senior Security Analyst',
    experienceYears: 6,
    linkedinUrl: 'https://linkedin.com/in/david-oconnor-sec',
    coverNote: 'OSCP & CISSP certified. Extensive red team and SAST/DAST automation background.',
    resumeFileName: 'David_OConnor_Cybersec.pdf',
    resumeFileType: 'application/pdf',
    resumeFileSize: 195000,
    status: 'New',
    rating: 4,
    notes: [],
    createdAt: Date.now() - 3600000 * 5,
    updatedAt: Date.now() - 3600000 * 5
  },
  {
    jobId: 'local-seed-6',
    jobTitle: 'Frontend Experience Engineer (React & WebGL)',
    jobDepartment: 'Engineering',
    candidateName: 'Kaito Tanaka',
    candidateEmail: 'kaito.tanaka@tokyocode.dev',
    candidatePhone: '+1 (415) 321-8840',
    candidateLocation: 'San Francisco, CA',
    currentCompany: 'Vortex Visuals',
    currentRole: 'Frontend Developer',
    experienceYears: 4,
    githubUrl: 'https://github.com/kaito-dev',
    portfolioUrl: 'https://kaito-tanaka.me',
    coverNote: 'Specialized in WebGL shaders, Three.js, and high-performance React architectures.',
    resumeFileName: 'Kaito_Tanaka_Frontend.pdf',
    resumeFileType: 'application/pdf',
    resumeFileSize: 110000,
    status: 'New',
    notes: [],
    createdAt: Date.now() - 3600000 * 2,
    updatedAt: Date.now() - 3600000 * 2
  }
];

// Submit new candidate application
export async function submitApplication(appData: Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> {
  const timestamp = Date.now();
  const payload: Omit<Application, 'id'> = {
    ...appData,
    status: 'New',
    notes: [],
    rating: 0,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  try {
    const appsRef = collection(db, APPLICATIONS_COLLECTION);
    const docRef = await addDoc(appsRef, payload);
    const id = docRef.id;

    // Cache locally as well
    const current = getLocalCachedApplications();
    saveLocalCachedApplications([{ ...payload, id }, ...current]);
    return id;
  } catch (e) {
    console.warn('Error saving application to Firestore, storing locally:', e);
    const localId = `app-${timestamp}-${Math.random().toString(36).substring(2, 7)}`;
    const localApp: Application = { ...payload, id: localId };
    const current = getLocalCachedApplications();
    saveLocalCachedApplications([localApp, ...current]);
    return localId;
  }
}

// Fetch all applications
export async function getApplications(): Promise<Application[]> {
  try {
    const appsRef = collection(db, APPLICATIONS_COLLECTION);
    const q = query(appsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log('No applications in Firestore, seeding sample applications...');
      return await seedInitialApplications();
    }

    const apps: Application[] = [];
    snapshot.forEach((docSnap) => {
      apps.push({ id: docSnap.id, ...(docSnap.data() as Omit<Application, 'id'>) });
    });

    saveLocalCachedApplications(apps);
    return apps;
  } catch (e) {
    console.warn('Error fetching applications from Firestore:', e);
    const local = getLocalCachedApplications();
    if (local.length > 0) return local;

    return SEED_APPLICATIONS.map((s, i) => ({
      ...s,
      id: `seed-app-${i + 1}`
    }));
  }
}

// Subscribe to real-time applications
export function subscribeToApplications(callback: (apps: Application[]) => void): () => void {
  try {
    const appsRef = collection(db, APPLICATIONS_COLLECTION);
    const q = query(appsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        seedInitialApplications().then(callback);
        return;
      }
      const apps: Application[] = [];
      snapshot.forEach((docSnap) => {
        apps.push({ id: docSnap.id, ...(docSnap.data() as Omit<Application, 'id'>) });
      });
      saveLocalCachedApplications(apps);
      callback(apps);
    }, (err) => {
      console.warn('Applications snapshot listener notice:', err);
      getApplications().then(callback);
    });
  } catch (e) {
    console.warn('Subscription error:', e);
    getApplications().then(callback);
    return () => {};
  }
}

// Update application status
export async function updateApplicationStatus(id: string, newStatus: ApplicationStatus): Promise<void> {
  try {
    const docRef = doc(db, APPLICATIONS_COLLECTION, id);
    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: Date.now()
    });
  } catch (e) {
    console.warn('Firestore update application status error:', e);
  }

  // Update local cache
  const current = getLocalCachedApplications();
  const updated = current.map((a) => (a.id === id ? { ...a, status: newStatus, updatedAt: Date.now() } : a));
  saveLocalCachedApplications(updated);
}

// Update application rating & notes
export async function addRecruiterNote(id: string, noteText: string, author: string = 'Recruiter'): Promise<void> {
  const newNote: RecruiterNote = {
    id: `note-${Date.now()}`,
    author,
    text: noteText,
    createdAt: Date.now()
  };

  const current = getLocalCachedApplications();
  const target = current.find((a) => a.id === id);
  const updatedNotes = [...(target?.notes || []), newNote];

  try {
    const docRef = doc(db, APPLICATIONS_COLLECTION, id);
    await updateDoc(docRef, {
      notes: updatedNotes,
      updatedAt: Date.now()
    });
  } catch (e) {
    console.warn('Firestore add note error:', e);
  }

  saveLocalCachedApplications(
    current.map((a) => (a.id === id ? { ...a, notes: updatedNotes, updatedAt: Date.now() } : a))
  );
}

// Update rating
export async function updateApplicationRating(id: string, rating: number): Promise<void> {
  try {
    const docRef = doc(db, APPLICATIONS_COLLECTION, id);
    await updateDoc(docRef, {
      rating,
      updatedAt: Date.now()
    });
  } catch (e) {
    console.warn('Firestore update rating error:', e);
  }

  const current = getLocalCachedApplications();
  saveLocalCachedApplications(
    current.map((a) => (a.id === id ? { ...a, rating, updatedAt: Date.now() } : a))
  );
}

// Delete application
export async function deleteApplication(id: string): Promise<void> {
  try {
    const docRef = doc(db, APPLICATIONS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('Firestore delete error:', e);
  }

  const current = getLocalCachedApplications();
  saveLocalCachedApplications(current.filter((a) => a.id !== id));
}

// Seed initial applications
export async function seedInitialApplications(): Promise<Application[]> {
  const seeded: Application[] = [];
  try {
    for (const app of SEED_APPLICATIONS) {
      const appsRef = collection(db, APPLICATIONS_COLLECTION);
      const docRef = await addDoc(appsRef, app);
      seeded.push({ id: docRef.id, ...app });
    }
  } catch (e) {
    console.warn('Error seeding applications to Firestore:', e);
    return SEED_APPLICATIONS.map((s, i) => ({ ...s, id: `seed-app-${i + 1}` }));
  }
  saveLocalCachedApplications(seeded);
  return seeded;
}
