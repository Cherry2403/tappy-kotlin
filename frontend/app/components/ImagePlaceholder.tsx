const TONE_CLASSES = {
  cream: "bg-cream text-ink/40",
  olive: "bg-olive/15 text-olive/70",
  wine: "bg-wine/10 text-wine/70",
  ink: "bg-ink text-cream/40",
};

export default function ImagePlaceholder({
  label,
  className = "",
  tone = "cream",
}: {
  label: string;
  className?: string;
  tone?: keyof typeof TONE_CLASSES;
  fit?: "cover" | "contain";
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-[14px] px-6 text-center font-marcellus text-xs tracking-[0.1em] uppercase ${TONE_CLASSES[tone]} ${className}`}
    >
      {label}
    </div>
  );
}
