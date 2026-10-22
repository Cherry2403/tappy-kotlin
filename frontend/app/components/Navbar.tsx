"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#object", label: "Souvenirs" },
  { href: "#stories", label: "Stories" },
  { href: "#partners", label: "For resellers" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative flex items-center justify-between px-6 py-5 md:px-0 md:py-4">
      <Image
        src="/logo/vuurkat-logo2.png"
        alt="VuurKat"
        width={1200}
        height={1200}
        priority
        className="h-10 w-10 object-contain md:h-20 md:w-20"
      />

      <div className="hidden items-center gap-11 font-marcellus text-[15px] text-ink md:flex">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="text-inherit no-underline">
            {link.label}
          </Link>
        ))}
        <Link href="#reserve" className="italic text-wine no-underline">
          Contact Us
        </Link>
      </div>

      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
      >
        <span
          className={`h-px w-6 bg-ink transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
        />
        <span
          className={`h-px w-6 bg-ink transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-40 flex flex-col gap-1 border-t border-olive/15 bg-cream-soft px-6 py-4 font-marcellus text-base text-ink md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-3 text-inherit no-underline"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#reserve"
            onClick={() => setOpen(false)}
            className="rounded-md px-2 py-3 italic text-wine no-underline"
          >
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  );
}
