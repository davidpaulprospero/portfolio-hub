import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "./firebase";
import { seedProjects } from "./projects-data";
import type { ContactMessage, Project } from "./types";

export const PROJECTS_COLLECTION = "projects";
export const MESSAGES_COLLECTION = "messages";

/**
 * Normalise a Firestore document into a `Project`.
 *
 * Firestore stores arrays and nested objects fine, but every field is optional
 * as far as the client is concerned - a typo'd seed script should degrade to a
 * missing link rather than a white screen. Fields are validated and filled
 * with empty defaults here.
 */
function toProject(docId: string, data: Record<string, unknown>): Project | null {
  const title = typeof data.title === "string" ? data.title : null;
  if (!title) return null;

  const decision = (data.decision ?? {}) as Record<string, unknown>;

  return {
    slug: typeof data.slug === "string" && data.slug ? data.slug : docId,
    title,
    tagline: typeof data.tagline === "string" ? data.tagline : "",
    problem: typeof data.problem === "string" ? data.problem : "",
    stack: Array.isArray(data.stack) ? data.stack.filter((s): s is string => typeof s === "string") : [],
    decision: {
      what: typeof decision.what === "string" ? decision.what : "",
      why: typeof decision.why === "string" ? decision.why : "",
    },
    blurb: typeof data.blurb === "string" ? data.blurb : "",
    pendingUrl: data.pendingUrl === true,
    links: Array.isArray(data.links)
      ? data.links
          .filter((l): l is Record<string, unknown> => typeof l === "object" && l !== null)
          .filter((l) => typeof l.href === "string" && typeof l.label === "string")
          .map((l) => ({ label: l.label as string, href: l.href as string }))
      : [],
    order: typeof data.order === "number" ? data.order : 999,
  };
}

/**
 * Read all projects from Firestore.
 *
 * This is a CLIENT-side read because the site is a static export - there is no
 * server to query Firestore from at request time. Falls back to the bundled
 * seed data if Firebase is not configured or the read fails, so the site
 * always renders.
 */
export async function fetchProjects(): Promise<{
  projects: Project[];
  source: "firestore" | "seed";
}> {
  const db = getDb();

  if (!db || !isFirebaseConfigured) {
    return { projects: seedProjects, source: "seed" };
  }

  try {
    const snapshot = await getDocs(
      query(collection(db as Firestore, PROJECTS_COLLECTION), orderBy("order", "asc")),
    );

    const projects = snapshot.docs
      .map((d) => toProject(d.id, d.data() as Record<string, unknown>))
      .filter((p): p is Project => p !== null);

    // An empty collection means the seed script hasn't been run yet.
    // Rendering an empty portfolio is worse than rendering the bundled copy.
    if (projects.length === 0) {
      return { projects: seedProjects, source: "seed" };
    }

    return { projects, source: "firestore" };
  } catch (error) {
    // A Firestore read failure (offline, rules misconfigured, blocked region)
    // must not take down the whole site.
    console.warn("[projects] Firestore read failed, using bundled seed data:", error);
    return { projects: seedProjects, source: "seed" };
  }
}

/**
 * Write a contact message.
 *
 * Write-only from the client: the Firestore rules allow `create` here and
 * nothing else - no reads, no updates, no deletes. Only the account that owns
 * the project can read what comes in.
 */
export async function submitContactMessage(
  message: ContactMessage,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const db = getDb();

  if (!db) {
    return {
      ok: false,
      error: "Contact form is not configured yet. Please email me directly instead.",
    };
  }

  try {
    await addDoc(collection(db, MESSAGES_COLLECTION), {
      name: message.name,
      email: message.email,
      message: message.message,
      // Server timestamp, not a client clock - a visitor's device clock can
      // be wrong or deliberately set.
      createdAt: serverTimestamp(),
    });
    return { ok: true };
  } catch (error) {
    console.error("[contact] write failed:", error);
    return {
      ok: false,
      error: "Something went wrong sending that. Please email me directly instead.",
    };
  }
}