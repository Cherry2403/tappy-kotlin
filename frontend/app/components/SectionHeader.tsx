import type { ReactNode } from "react";

export default function SectionHeader({
  eyebrow,
  title,
  ruleWidth = "w-24",
  intro,
  titleClassName = "text-[40px] sm:text-[48px] md:text-[72px]",
}: {
  eyebrow: string;
  title: ReactNode;
  ruleWidth?: string;
  intro?: string;
  titleClassName?: string;
}) {
  return (
    <div className="mb-16 max-w-225 md:mb-24">
      <div className="mb-6 font-marcellus text-xs tracking-[0.3em] text-olive uppercase">
        {eyebrow}
      </div>
      <h2
        className={`text-stroke-thick mb-7 font-italiana leading-[1.04] tracking-[0.005em] text-ink ${titleClassName}`}
      >
        {title}
      </h2>
      <div className={`h-px ${ruleWidth} bg-olive/55`} />
      {intro && (
        <p className="mt-7.5 max-w-115 font-marcellus text-[15px] leading-[1.7] text-ink/68">
          {intro}
        </p>
      )}
    </div>
  );
}
