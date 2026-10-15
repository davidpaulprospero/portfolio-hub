/**
 * Site-wide personalisation.
 *
 * SECURITY / PRIVACY: everything here is an obvious placeholder. Do not commit
 * a real email address or phone number to a public repository. Replace these
 * at build time via the environment variables listed in `.env.example`, or by
 * editing this file locally without committing.
 */

export interface SiteConfig {
  name: string;
  positioning: string;
  /** Shown under the hero. Keep it honest: what you are looking for next. */
  about: string;
  email: string;
  github: string;
  linkedin: string;
}

/**
 * Reads from NEXT_PUBLIC_* when present so a deploy can override without a
 * code change, and falls back to obvious placeholders that are safe to commit.
 */
export const siteConfig: SiteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Your Name",
  positioning:
    process.env.NEXT_PUBLIC_POSITIONING ??
    "Junior developer building real tools, not tutorials.",
  about:
    process.env.NEXT_PUBLIC_ABOUT ??
    "I build small, complete tools end to end - a Python pipeline, a WordPress site, a typed Next.js frontend - and I care about the one design decision that makes each of them hold up. Everything on this site is a project I started myself to solve a problem I ran into. No client work yet.",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "your-email@example.com",
  github: process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/your-handle",
  linkedin:
    process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "https://linkedin.com/in/your-handle",
};