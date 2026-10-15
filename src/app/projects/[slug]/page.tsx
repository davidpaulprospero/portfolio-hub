import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { seedProjects } from "@/lib/projects-data";
import { ProjectLink } from "@/components/project-link";

/**
 * Static export detail page.
 *
 * `generateStaticParams` MUST be able to enumerate every slug at build time -
 * there is no server to resolve an unknown slug at request time. That is why
 * the slug list comes from the bundled seed data rather than Firestore. The
 * seed script keeps the two in sync.
 */
export function generateStaticParams() {
  return seedProjects.map((project) => ({ slug: project.slug }));
}

function getProject(slug: string) {
  return seedProjects.find((project) => project.slug === slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.tagline,
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);

  // With generateStaticParams enumerated, this only fires if someone removes
  // a slug from the seed data but keeps a stale link around.
  if (!project) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <Link
        href="/"
        className="text-sm text-muted transition-colors hover:text-accent"
      >
        ← All projects
      </Link>

      <article className="mt-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-3 text-lg text-muted">{project.tagline}</p>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            The problem
          </h2>
          <p className="mt-3 leading-relaxed">{project.problem}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Stack
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-border bg-surface px-3 py-1 text-sm"
              >
                {tech}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            One decision, and why
          </h2>
          <div className="mt-3 rounded-xl border-l-2 border-accent bg-surface p-5">
            <p className="leading-relaxed">{project.decision.what}</p>
            <p className="mt-3 leading-relaxed text-muted">{project.decision.why}</p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Links
          </h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {project.links.map((link) => (
              <ProjectLink key={link.href} link={link} />
            ))}
          </div>
        </section>
      </article>

      <footer className="mt-16 border-t border-border pt-8">
        <Link
          href="/#contact"
          className="text-sm font-medium text-accent hover:underline"
        >
          Interested in this? Get in touch →
        </Link>
      </footer>
    </main>
  );
}