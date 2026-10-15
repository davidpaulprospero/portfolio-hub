import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { ProjectsGrid } from "@/components/projects-grid";
import { ContactForm } from "@/components/contact-form";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 sm:py-24">
      {/* HERO */}
      <section className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {siteConfig.name}
        </h1>
        <p className="mt-4 text-lg text-muted sm:text-xl">{siteConfig.positioning}</p>
        <p className="mt-6 leading-relaxed text-foreground/90">{siteConfig.about}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`mailto:${siteConfig.email}`}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90"
          >
            Email me
          </a>
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            GitHub
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            LinkedIn
          </a>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="mt-24">
        <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Three things I built to solve problems I ran into myself. No client
          work yet - these are mine, end to end.
        </p>
        <div className="mt-8">
          <ProjectsGrid />
        </div>
      </section>

      {/* CONTACT */}
      <section className="mt-24" id="contact">
        <h2 className="text-2xl font-semibold tracking-tight">Get in touch</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Open to junior frontend and full-stack roles. Messages land in my
          inbox - I don&apos;t keep a mailing list.
        </p>
        <div className="mt-8 max-w-2xl">
          <ContactForm />
        </div>
      </section>

      <footer className="mt-24 border-t border-border pt-8 text-sm text-muted">
        <p>
          Built with Next.js, TypeScript, Tailwind and Firebase.{" "}
          <Link href="https://github.com" className="underline hover:text-accent">
            Source on GitHub
          </Link>
        </p>
      </footer>
    </main>
  );
}