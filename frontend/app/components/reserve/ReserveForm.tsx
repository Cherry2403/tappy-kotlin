"use client";

import { useState } from "react";
import Link from "next/link";
import SuccessModal from "./SuccessModal";

export default function ReserveForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", note: "" });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, consent }),
      });

      if (!res.ok) throw new Error("Request failed");

      setSubmitted(true);
      setForm({ name: "", email: "", note: "" });
      setConsent(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-[14px] border border-cream/30 bg-white p-6 text-ink sm:p-11"
      >
        <label className="mb-1.5 block font-marcellus text-xs tracking-[0.12em] text-ink/50 uppercase">
          Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="Your full name"
          required
          value={form.name}
          onChange={handleChange}
          className="mb-6.5 w-full border-0 border-b border-olive/30 bg-transparent py-3 font-marcellus text-[17px] text-ink outline-none"
        />

        <label className="mb-1.5 block font-marcellus text-xs tracking-[0.12em] text-ink/50 uppercase">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="you@email.com"
          required
          value={form.email}
          onChange={handleChange}
          className="mb-6.5 w-full border-0 border-b border-olive/30 bg-transparent py-3 font-marcellus text-[17px] text-ink outline-none"
        />

        <label className="mb-1.5 block font-marcellus text-xs tracking-[0.12em] text-ink/50 uppercase">
          Message
        </label>
        <textarea
          name="note"
          placeholder="Tell us what you're looking for"
          rows={3}
          required
          value={form.note}
          onChange={handleChange}
          className="mb-9 w-full resize-none border-0 border-b border-olive/30 bg-transparent py-3 font-marcellus text-[17px] text-ink outline-none"
        />

        <label className="mb-7 flex cursor-pointer items-start gap-3 font-marcellus text-[13px] leading-relaxed text-ink/70">
          <input
            type="checkbox"
            name="consent"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-wine"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="text-wine underline">
              Terms &amp; Conditions
            </Link>{" "}
            and have read the{" "}
            <Link href="/privacy" className="text-wine underline">
              Privacy Policy
            </Link>
            . Contact me about my message and product updates.
          </span>
        </label>

        <button
          type="submit"
          disabled={submitting || !consent}
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-[10px] border-none bg-wine px-4.5 py-4.5 font-marcellus text-base text-white disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send message"}
        </button>

        {error && (
          <div className="mt-3 text-center font-marcellus text-[13px] text-wine italic">
            {error}
          </div>
        )}

        <div className="mt-5.5 text-center font-marcellus text-[13px] text-ink/55">
          We usually reply within 24 hours.
        </div>
      </form>

      {submitted && <SuccessModal onClose={() => setSubmitted(false)} />}
    </>
  );
}
