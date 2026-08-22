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
import { Job } from '../types';
import { INITIAL_JOBS } from '../data/initialJobs';

const JOBS_COLLECTION = 'jobs';
const LOCAL_STORAGE_KEY = 'tm_cached_jobs_v1';

// In-memory fallback / local storage cache for ultra-fast instant render
function getLocalCachedJobs(): Job[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Local storage read error:', e);
  }
  return [];
}

function saveLocalCachedJobs(jobs: Job[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jobs));
  } catch (e) {
    console.warn('Local storage write error:', e);
  }
}

// Fetch all jobs from Firestore with fallback & real-time subscribe
export async function getJobs(): Promise<Job[]> {
  try {
    const jobsRef = collection(db, JOBS_COLLECTION);
    const q = query(jobsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Seed initial jobs if collection is completely empty
      console.log('Jobs collection empty. Seeding default Tech Movement roles...');
      return await seedInitialJobs();
    }

    const jobs: Job[] = [];
    snapshot.forEach((docSnap) => {
      jobs.push({ id: docSnap.id, ...(docSnap.data() as Omit<Job, 'id'>) });
    });

    saveLocalCachedJobs(jobs);
    return jobs;
  } catch (error) {
    console.error('Error fetching jobs from Firestore, using cached/initial:', error);
    const cached = getLocalCachedJobs();
    if (cached.length > 0) return cached;
    
    // Fallback to initial seed array
    const fallbackJobs = INITIAL_JOBS.map((j, idx) => ({
      ...j,
      id: `local-seed-${idx + 1}`
    }));
    saveLocalCachedJobs(fallbackJobs);
    return fallbackJobs;
  }
}

// Subscribe to real-time updates for jobs
export function subscribeToJobs(callback: (jobs: Job[]) => void): () => void {
  try {
    const jobsRef = collection(db, JOBS_COLLECTION);
    const q = query(jobsRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        // If empty, seed
        seedInitialJobs().then(callback);
        return;
      }
      const jobs: Job[] = [];
      snapshot.forEach((docSnap) => {
        jobs.push({ id: docSnap.id, ...(docSnap.data() as Omit<Job, 'id'>) });
      });
      saveLocalCachedJobs(jobs);
      callback(jobs);
    }, (err) => {
      console.warn('Firestore subscription notice (using cached):', err);
      getJobs().then(callback);
    });
  } catch (e) {
    console.warn('Subscription setup error:', e);
    getJobs().then(callback);
    return () => {};
  }
}

// Get single job by ID
export async function getJobById(id: string): Promise<Job | null> {
  try {
    const docRef = doc(db, JOBS_COLLECTION, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...(snap.data() as Omit<Job, 'id'>) };
    }
  } catch (e) {
    console.warn('Error getting job by id from Firestore:', e);
  }

  // Fallback search local cached jobs
  const local = getLocalCachedJobs();
  return local.find((j) => j.id === id) || null;
}

// Create new job
export async function createJob(jobData: Omit<Job, 'id'>): Promise<string> {
  try {
    const jobsRef = collection(db, JOBS_COLLECTION);
    const docRef = await addDoc(jobsRef, {
      ...jobData,
      createdAt: Date.now(),
      applicantCount: 0
    });
    return docRef.id;
  } catch (e) {
    console.error('Firestore create job error, saving locally:', e);
    const newId = `job-${Date.now()}`;
    const newJob: Job = { ...jobData, id: newId, createdAt: Date.now(), applicantCount: 0 };
    const current = getLocalCachedJobs();
    saveLocalCachedJobs([newJob, ...current]);
    return newId;
  }
}

// Update existing job
export async function updateJob(id: string, updates: Partial<Job>): Promise<void> {
  try {
    const docRef = doc(db, JOBS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Date.now()
    });
  } catch (e) {
    console.warn('Firestore update job error, updating local cache:', e);
    const current = getLocalCachedJobs();
    const updated = current.map((j) => (j.id === id ? { ...j, ...updates, updatedAt: Date.now() } : j));
    saveLocalCachedJobs(updated);
  }
}

// Delete job
export async function deleteJob(id: string): Promise<void> {
  try {
    const docRef = doc(db, JOBS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('Firestore delete job error:', e);
    const current = getLocalCachedJobs();
    saveLocalCachedJobs(current.filter((j) => j.id !== id));
  }
}

// Seed initial Tech Movement jobs into Firestore
export async function seedInitialJobs(): Promise<Job[]> {
  const seededJobs: Job[] = [];
  try {
    for (const job of INITIAL_JOBS) {
      const jobsRef = collection(db, JOBS_COLLECTION);
      const docRef = await addDoc(jobsRef, {
        ...job,
        createdAt: job.createdAt || Date.now(),
        applicantCount: Math.floor(Math.random() * 8) + 2
      });
      seededJobs.push({
        id: docRef.id,
        ...job,
        applicantCount: Math.floor(Math.random() * 8) + 2
      });
    }
  } catch (e) {
    console.warn('Error batch seeding to Firestore, fallback to memory:', e);
    return INITIAL_JOBS.map((j, i) => ({
      ...j,
      id: `seed-${i + 1}`,
      applicantCount: Math.floor(Math.random() * 8) + 2
    }));
  }
  saveLocalCachedJobs(seededJobs);
  return seededJobs;
}
