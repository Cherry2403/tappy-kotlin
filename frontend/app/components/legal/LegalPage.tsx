import Link from "next/link";
import Footer from "../Footer";

export default function LegalPage({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate: string;
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className="mx-auto max-w-360">
        <nav className="flex items-center justify-between px-6 py-5 md:px-14 md:py-6">
          <Link
            href="/"
            className="text-stroke-thin font-italiana text-[22px] tracking-[0.08em] text-olive no-underline"
          >
            Vuur Kat
          </Link>
          <Link
            href="/#reserve"
            className="font-marcellus text-[15px] italic text-wine no-underline"
          >
            Contact Us
          </Link>
        </nav>

        <article className="mx-auto max-w-175 px-6 pt-10 pb-20 md:pt-16">
          <h1 className="mb-2 font-marcellus text-[32px] tracking-[-0.01em] text-ink md:text-[40px]">
            {title}
          </h1>
          <p className="mb-12 font-marcellus text-[14px] italic text-ink/55">
            Effective date: {effectiveDate}
          </p>
          <div className="flex flex-col gap-10">{children}</div>
        </article>
      </div>

      <Footer />
    </main>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 font-marcellus text-[20px] text-olive md:text-[22px]">
        {heading}
      </h2>
      <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-ink/80">
        {children}
      </div>
    </section>
  );
}
