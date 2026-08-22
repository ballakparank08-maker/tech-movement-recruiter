import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { RecruiterUser, SecurityAuditLog, RecruiterRole } from '../types';

const RECRUITERS_COLLECTION = 'authorized_recruiters';
const AUDIT_LOGS_COLLECTION = 'security_audit_logs';
const SESSION_KEY = 'tm_recruiter_session_v1';

// Primary Admin Email from app metadata & system admin
export const PRIMARY_ADMIN_EMAIL = 'ballakparank08@gmail.com';

// Master security passcode for Talent Operations fallback access
export const MASTER_SECURITY_PASSCODE = 'TECH-MOVEMENT-RECRUITER-2026';

// Default pre-authorized recruiter whitelist
export const DEFAULT_AUTHORIZED_EMAILS: { email: string; role: RecruiterRole; title: string; name: string }[] = [
  {
    email: PRIMARY_ADMIN_EMAIL,
    role: 'super_admin',
    title: 'Head of Talent & Engineering',
    name: 'Primary Recruiter Admin'
  },
  {
    email: 'alex.vance@techmovement.io',
    role: 'lead_recruiter',
    title: 'Lead Technical Talent Partner',
    name: 'Alex Vance'
  },
  {
    email: 'sarah.chen@techmovement.io',
    role: 'hiring_manager',
    title: 'VP of Engineering',
    name: 'Sarah Chen'
  }
];

// Helper: Check local session storage
export function getStoredRecruiterSession(): RecruiterUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Session parse error:', e);
  }
  return null;
}

export function setStoredRecruiterSession(user: RecruiterUser | null) {
  try {
    if (user) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY);
    }
  } catch (e) {
    console.warn('Session write error:', e);
  }
}

// Check if an email is authorized to access the recruiter portal
export async function isEmailAuthorizedRecruiter(email: string): Promise<{ authorized: boolean; role: RecruiterRole; title: string; name?: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Direct match with primary admin
  if (normalizedEmail === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
    return {
      authorized: true,
      role: 'super_admin',
      title: 'Head of Talent Acquisition & Super Admin',
      name: 'Lead Talent Admin'
    };
  }

  // 2. Default corporate email list match
  const defaultMatch = DEFAULT_AUTHORIZED_EMAILS.find(
    (e) => e.email.toLowerCase() === normalizedEmail
  );
  if (defaultMatch) {
    return {
      authorized: true,
      role: defaultMatch.role,
      title: defaultMatch.title,
      name: defaultMatch.name
    };
  }

  // 3. Domain match (@techmovement.io)
  if (normalizedEmail.endsWith('@techmovement.io')) {
    return {
      authorized: true,
      role: 'recruiter',
      title: 'Technical Talent Partner',
      name: email.split('@')[0].replace('.', ' ')
    };
  }

  // 4. Firestore authorized list check
  try {
    const docRef = doc(db, RECRUITERS_COLLECTION, normalizedEmail);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        authorized: true,
        role: data.role || 'recruiter',
        title: data.title || 'Technical Recruiter',
        name: data.name
      };
    }
  } catch (e) {
    console.warn('Firestore recruiter authorization lookup warning:', e);
  }

  return {
    authorized: false,
    role: 'recruiter',
    title: 'Guest'
  };
}

// Log Security Audit Event
export async function logSecurityEvent(event: Omit<SecurityAuditLog, 'id' | 'timestamp'>): Promise<void> {
  const payload: Omit<SecurityAuditLog, 'id'> = {
    ...event,
    timestamp: Date.now()
  };

  try {
    const logsRef = collection(db, AUDIT_LOGS_COLLECTION);
    await addDoc(logsRef, payload);
  } catch (e) {
    console.warn('Security log write notice:', e);
  }
}

// Fetch recent security audit logs
export async function getRecentAuditLogs(limitCount: number = 20): Promise<SecurityAuditLog[]> {
  try {
    const logsRef = collection(db, AUDIT_LOGS_COLLECTION);
    const q = query(logsRef, orderBy('timestamp', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    const logs: SecurityAuditLog[] = [];
    snap.forEach((d) => {
      logs.push({ id: d.id, ...(d.data() as Omit<SecurityAuditLog, 'id'>) });
    });
    return logs;
  } catch (e) {
    console.warn('Could not load audit logs:', e);
    return [];
  }
}

// Sign in with Google (Popup)
export async function signInWithGoogleRecruiter(): Promise<{ success: boolean; user?: RecruiterUser; error?: string }> {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    const result = await signInWithPopup(auth, provider);
    const firebaseUser: User = result.user;
    const email = firebaseUser.email || '';

    const authCheck = await isEmailAuthorizedRecruiter(email);

    if (!authCheck.authorized) {
      // Unauthorized user! Log the attempt and sign out
      await logSecurityEvent({
        action: 'ACCESS_DENIED',
        userEmail: email,
        userName: firebaseUser.displayName || 'Unknown Candidate/User',
        targetType: 'system',
        details: `Unauthorized login attempt by non-recruiter account: ${email}`
      });

      await firebaseSignOut(auth);
      setStoredRecruiterSession(null);

      return {
        success: false,
        error: `Access Denied: The account "${email}" does not have recruiter clearance for Tech Movement. Only authorized talent ops staff (such as ${PRIMARY_ADMIN_EMAIL}) may enter.`
      };
    }

    // Authorized recruiter user profile
    const recruiterUser: RecruiterUser = {
      uid: firebaseUser.uid,
      email: email,
      displayName: firebaseUser.displayName || authCheck.name || email.split('@')[0],
      photoURL: firebaseUser.photoURL || undefined,
      role: authCheck.role,
      title: authCheck.title,
      authorizedAt: Date.now(),
      lastLoginAt: Date.now(),
      authProvider: 'google'
    };

    setStoredRecruiterSession(recruiterUser);

    // Save/update recruiter profile in Firestore
    try {
      await setDoc(doc(db, RECRUITERS_COLLECTION, email.toLowerCase()), {
        uid: firebaseUser.uid,
        email: email.toLowerCase(),
        name: recruiterUser.displayName,
        role: recruiterUser.role,
        title: recruiterUser.title,
        lastLoginAt: Date.now()
      }, { merge: true });
    } catch (e) {
      console.warn('Could not update recruiter doc:', e);
    }

    // Log success
    await logSecurityEvent({
      action: 'LOGIN',
      userEmail: email,
      userName: recruiterUser.displayName,
      targetType: 'system',
      details: `Recruiter authenticated via Google SSO (${recruiterUser.role})`
    });

    return {
      success: true,
      user: recruiterUser
    };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    
    // Check if popup was closed
    if (error.code === 'auth/popup-closed-by-user') {
      return { success: false, error: 'Sign-in cancelled by user.' };
    }
    
    return {
      success: false,
      error: error.message || 'Failed to authenticate with Google. Please try again or use Security Passcode.'
    };
  }
}

// Sign in with Master Security Passcode & Talent Ops Key
export async function signInWithSecurityPasscode(
  passcode: string, 
  customEmail?: string, 
  customName?: string
): Promise<{ success: boolean; user?: RecruiterUser; error?: string }> {
  const cleanPasscode = passcode.trim();

  if (cleanPasscode !== MASTER_SECURITY_PASSCODE) {
    await logSecurityEvent({
      action: 'ACCESS_DENIED',
      userEmail: customEmail || 'unknown@client.device',
      userName: customName || 'Anonymous Visitor',
      targetType: 'system',
      details: 'Failed passcode attempt on Recruiter Portal'
    });

    return {
      success: false,
      error: 'Invalid Recruiter Security Key / Passcode. Access restricted.'
    };
  }

  const assignedEmail = customEmail?.trim() || PRIMARY_ADMIN_EMAIL;
  const assignedName = customName?.trim() || 'Head of Talent Ops';

  const recruiterUser: RecruiterUser = {
    uid: `recruiter-${Date.now()}`,
    email: assignedEmail,
    displayName: assignedName,
    role: 'super_admin',
    title: 'Lead Talent Partner & Operations Admin',
    authorizedAt: Date.now(),
    lastLoginAt: Date.now(),
    authProvider: 'passcode'
  };

  setStoredRecruiterSession(recruiterUser);

  await logSecurityEvent({
    action: 'LOGIN',
    userEmail: assignedEmail,
    userName: assignedName,
    targetType: 'system',
    details: 'Recruiter logged in using Master Security Passcode'
  });

  return {
    success: true,
    user: recruiterUser
  };
}

// Log Out Recruiter
export async function signOutRecruiter(): Promise<void> {
  const current = getStoredRecruiterSession();
  if (current) {
    await logSecurityEvent({
      action: 'LOGIN',
      userEmail: current.email,
      userName: current.displayName,
      targetType: 'system',
      details: `Recruiter signed out / session terminated`
    });
  }

  try {
    await firebaseSignOut(auth);
  } catch (e) {
    console.warn('Sign out warning:', e);
  }

  setStoredRecruiterSession(null);
}

// Clear session alias
export async function clearRecruiterSession(): Promise<void> {
  await signOutRecruiter();
}

// Subscribe to Firebase Auth state changes
export function subscribeToAuthChanges(callback: (user: RecruiterUser | null) => void): () => void {
  try {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        const authCheck = await isEmailAuthorizedRecruiter(firebaseUser.email);
        if (authCheck.authorized) {
          const user: RecruiterUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || authCheck.name || firebaseUser.email.split('@')[0],
            photoURL: firebaseUser.photoURL || undefined,
            role: authCheck.role,
            title: authCheck.title,
            authorizedAt: Date.now(),
            lastLoginAt: Date.now(),
            authProvider: 'google'
          };
          setStoredRecruiterSession(user);
          callback(user);
          return;
        }
      }
      
      const stored = getStoredRecruiterSession();
      if (!stored) {
        callback(null);
      }
    });

    return unsubscribe;
  } catch (e) {
    console.warn('Auth observer notice:', e);
    return () => {};
  }
}

export async function getAuthorizedRecruitersList(): Promise<{ email: string; name: string; role: RecruiterRole; title: string; addedAt?: number }[]> {
  const results: { email: string; name: string; role: RecruiterRole; title: string; addedAt?: number }[] = [
    ...DEFAULT_AUTHORIZED_EMAILS
  ];

  try {
    const snap = await getDocs(collection(db, RECRUITERS_COLLECTION));
    snap.forEach((d) => {
      const data = d.data();
      if (!results.some((r) => r.email.toLowerCase() === data.email?.toLowerCase())) {
        results.push({
          email: data.email || d.id,
          name: data.name || data.email,
          role: data.role || 'recruiter',
          title: data.title || 'Technical Recruiter',
          addedAt: data.addedAt || data.lastLoginAt
        });
      }
    });
  } catch (e) {
    console.warn('Get recruiters list warning:', e);
  }

  return results;
}

// Add new authorized recruiter email
export async function addAuthorizedRecruiter(
  email: string,
  name: string,
  role: RecruiterRole,
  title: string
): Promise<void> {
  const normalized = email.trim().toLowerCase();
  const docRef = doc(db, RECRUITERS_COLLECTION, normalized);
  await setDoc(docRef, {
    email: normalized,
    name,
    role,
    title,
    addedAt: Date.now()
  });
}

// Remove authorized recruiter email
export async function removeAuthorizedRecruiter(email: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  if (normalized === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
    throw new Error('Cannot remove primary super admin.');
  }
  const docRef = doc(db, RECRUITERS_COLLECTION, normalized);
  await deleteDoc(docRef);
}
