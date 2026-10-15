import { isPendingLink } from "@/lib/projects-data";
import type { ProjectLink as ProjectLinkType } from "@/lib/types";

/**
 * Renders a project link, or a clearly-marked placeholder when the real URL
 * has not been filled in yet.
 *
 * A dead link is worse than an honest "coming soon" for a recruiter clicking
 * through every project on the page.
 */
export function ProjectLink({ link }: { link: ProjectLinkType }) {
  if (isPendingLink(link.href)) {
    return (
      <span
        className="inline-flex items-center rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-muted"
        title="This link will be added when the project is live."
      >
        {link.label} <span className="ml-1.5 text-xs uppercase tracking-wide">(soon)</span>
      </span>
    );
  }

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
    >
      {link.label}
      <span aria-hidden="true" className="ml-1.5">
        ↗
      </span>
    </a>
  );
}