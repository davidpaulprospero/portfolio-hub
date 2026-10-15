"use client";

import { useState, type FormEvent } from "react";
import { submitContactMessage } from "@/lib/projects";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { ContactMessage } from "@/lib/types";

type Status = "idle" | "sending" | "success" | "error";

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm " +
  "placeholder:text-muted/60 focus:border-accent focus:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ContactMessage>({ name: "", email: "", message: "" });

  function update(field: keyof ContactMessage) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const result = await submitContactMessage(form);

    if (result.ok) {
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } else {
      setStatus("error");
      setError(result.error);
    }
  }

  // Until Firebase is wired up, a dead form is a worse signal than no form.
  if (!isFirebaseConfigured) {
    return (
      <p className="rounded-md border border-border bg-surface p-4 text-sm text-muted">
        The contact form is being connected. Email me directly in the meantime.
      </p>
    );
  }

  if (status === "success") {
    return (
      <p
        role="status"
        className="rounded-md border border-accent bg-surface p-4 text-sm"
      >
        Thanks - that came through. I&apos;ll reply to the address you gave me.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={update("name")}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={update("email")}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={update("message")}
          className={inputClass}
        />
      </div>

      {status === "error" && error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}