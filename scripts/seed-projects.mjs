/**
 * Seeds the Firestore `projects` collection from the bundled seed data in
 * `src/lib/projects-data.ts`.
 *
 * WHY THIS EXISTS: the site is a static export, so the slug list has to be
 * known at build time - which is why the content lives in a .ts file that the
 * build imports. This script mirrors that content into Firestore so the live
 * site reads its project data from the database as well as shipping with it.
 *
 * WHY ADMIN CREDENTIALS: seeding from a browser would mean letting anyone
 * write to the `projects` collection, which would let anyone rewrite the
 * portfolio. Instead this uses the Firebase Admin SDK, which bypasses
 * Security Rules. The service account key NEVER touches the site bundle - it
 * stays on this machine and is never committed.
 *
 * USAGE:
 *   1. Firebase console > Project settings > Service accounts > Generate new
 *      private key. It downloads a JSON file.
 *   2. Put it OUTSIDE the repo, then point the script at it:
 *         set GOOGLE_APPLICATION_CREDENTIALS=C:\secure\path\service-account.json
 *         npm run seed
 *   3. If your `.env.local` has the web config, this reads it too.
 *
 * Admin writes bypass the rules, so this works even though `projects` is
 * owner-only for client writes.
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// --- Load .env.local if present (simple parser, no dependency) -------------
function loadEnvLocal() {
  const path = resolve(root, ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}
loadEnvLocal();

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!projectId) {
  console.error(
    "\nMissing NEXT_PUBLIC_FIREBASE_PROJECT_ID.\n" +
      "Create .env.local from .env.example and fill in the Firebase web config.\n",
  );
  process.exit(1);
}

if (!credentialsPath || !existsSync(credentialsPath)) {
  console.error(
    "\nMissing service account credentials.\n\n" +
      "1. Firebase console > Project settings > Service accounts\n" +
      "2. Generate new private key (downloads a JSON file)\n" +
      "3. Store it OUTSIDE this repo, then:\n" +
      "       set GOOGLE_APPLICATION_CREDENTIALS=C:\\path\\to\\service-account.json\n\n" +
      "Do NOT move it into the repo - that key grants full admin access.\n",
  );
  process.exit(1);
}

// --- Read the seed data -----------------------------------------------------
// Imported as source and parsed rather than compiled, to avoid needing a
// TypeScript loader in this script.
const seedSource = readFileSync(resolve(root, "src/lib/projects-data.ts"), "utf8");
const match = seedSource.match(/export const seedProjects: Project\[\] = (\[[\s\S]*?\n\]);/);

if (!match) {
  console.error("Could not find seedProjects in src/lib/projects-data.ts");
  process.exit(1);
}

// The array literal is valid JS once the trailing semicolon is dropped.
const seedProjects = new Function(`return ${match[1]}`)();

const { initializeApp, cert } = await import("firebase-admin/app");
const { getFirestore } = await import("firebase-admin/firestore");

const app = initializeApp({
  credential: cert(credentialsPath),
  projectId,
});
const db = getFirestore(app);

console.log(`\nSeeding ${seedProjects.length} projects into "${projectId}"\n`);

for (const project of seedProjects) {
  const { slug, ...rest } = project;
  // set() with merge would leave deleted fields behind, so this replaces the
  // document wholesale, which keeps Firestore in step with the .ts file.
  await db.collection("projects").doc(slug).set(rest, { merge: false });
  console.log(`  ✓ ${slug}`);
}

console.log("\nDone. The live site will pick these up on the next request.\n");
process.exit(0);