import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let storage: FirebaseStorage | undefined;

export const initializeFirebase = () => {
  if (getApps().length > 0) {
    app = getApps()[0];
    db = getFirestore(app);

    // Try to get auth if it was initialized
    try {
      auth = getAuth(app);
    } catch {
      // Auth not available, that's okay
    }

    // Try to get storage if it was initialized
    try {
      storage = getStorage(app);
    } catch {
      // Storage not available, that's okay
    }

    return { app, db, auth, storage };
  }
  const firebaseConfig: FirebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  };

  // Only initialize if we have the required config
  if (!firebaseConfig.apiKey) {
    console.warn('Firebase configuration missing. Some features may not work.');
    return { app: undefined, db: undefined, auth: undefined, storage: undefined };
  }

  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);

    // Try to initialize auth, but don't fail if it's not enabled
    try {
      auth = getAuth(app);
    } catch (authError) {
      console.warn('Firebase Authentication not enabled or configured:', authError);
      // Auth is optional - app can work without it
    }

    // Try to initialize storage, but don't fail if it's not enabled
    try {
      storage = getStorage(app);
    } catch (storageError) {
      console.warn('Firebase Storage not enabled or configured:', storageError);
      // Storage is optional
    }

    return { app, db, auth, storage };
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    // Return undefined values so app can still work in privacy mode
    return { app: undefined, db: undefined, auth: undefined, storage: undefined };
  }
};

export const getFirebaseApp = () => {
  if (!app) {
    return initializeFirebase();
  }
  return { app, db: db!, auth: auth!, storage: storage! };
};

export { db, auth, storage };
