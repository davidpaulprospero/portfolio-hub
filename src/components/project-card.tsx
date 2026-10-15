import Link from "next/link";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent">
      <h3 className="text-lg font-semibold">
        {/* Stretched link: the whole card is clickable, but the heading keeps
            a single accessible link for screen readers. */}
        <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
          {project.title}
        </Link>
      </h3>

      <p className="mt-1 text-sm text-muted">{project.tagline}</p>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
        {project.blurb}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted"
          >
            {tech}
          </li>
        ))}
      </ul>
    </article>
  );
}