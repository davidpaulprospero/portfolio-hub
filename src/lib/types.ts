/**
 * Shared domain types for the portfolio.
 *
 * These are the single source of truth for the shape of a project document in
 * the Firestore `projects` collection, and for the bundled seed data that the
 * static export falls back to.
 */

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  /** URL segment, also the Firestore document id. */
  slug: string;
  title: string;
  /** One line, used on the card. */
  tagline: string;
  /** The problem this project solves. Shown on the detail page. */
  problem: string;
  /** Technologies actually used, as short display strings. */
  stack: string[];
  /** ONE design decision and why it was made. The spec asks for exactly one. */
  decision: {
    what: string;
    why: string;
  };
  /** The short 2-3 sentence pitch. Goes on the card. */
  blurb: string;
  /**
   * True while a required URL (e.g. the WordPress site) has not been filled in
   * yet. The UI shows a placeholder instead of a dead link.
   */
  pendingUrl?: boolean;
  links: ProjectLink[];
  /** Sort order on the home page grid. Lower first. */
  order: number;
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}