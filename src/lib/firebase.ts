import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * Firebase client setup.
 *
 * SECURITY: every value read here is a `NEXT_PUBLIC_*` variable, which means
 * it is inlined into the client bundle and visible to anyone who views the
 * page. That is correct and intended for a Firebase web config - the API key
 * is an identifier, not a secret, and access is controlled by Firestore
 * Security Rules (see `firestore.rules`), not by hiding the key.
 *
 * Nothing server-side belongs in this file. There are no server secrets in
 * this project.
 */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * True when a real project has been wired up. Until `.env.local` is filled
 * in the app falls back to bundled seed data, so the site is never broken.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

/**
 * Lazily initialise so importing this module during a server render or a
 * static build does not throw when the env vars are absent.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null;
  if (app) return app;
  app = getApps()[0] ?? initializeApp(firebaseConfig as Required<typeof firebaseConfig>);
  return app;
}

export function getDb(): Firestore | null {
  if (!isFirebaseConfigured) return null;
  if (db) return db;
  db = getFirestore(getFirebaseApp()!);
  return db;
}