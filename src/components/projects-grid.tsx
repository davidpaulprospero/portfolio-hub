"use client";

import { useEffect, useState } from "react";
import { fetchProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/project-card";
import { seedProjects } from "@/lib/projects-data";
import type { Project } from "@/lib/types";

/**
 * Reads projects from Firestore in the browser.
 *
 * Renders the bundled seed data first so the static export always ships a
 * complete page, then swaps in Firestore content once the read resolves. A
 * recruiter on a slow connection sees a full grid immediately rather than an
 * empty section that fills in late.
 */
export function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>(seedProjects);

  useEffect(() => {
    let cancelled = false;

    fetchProjects().then(({ projects }) => {
      if (!cancelled) setProjects(projects);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}