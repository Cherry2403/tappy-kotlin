import ImagePlaceholder from "../ImagePlaceholder";

export default function ProductFamilyCard({
  title,
  count,
  placeholderLabel,
}: {
  title: string;
  count: number;
  placeholderLabel: string;
}) {
  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between gap-5">
        <div className="text-stroke-thin font-italiana text-[28px] tracking-[0.01em] text-ink sm:text-[34px]">
          {title}
        </div>
        <div className="font-marcellus text-[12px] tracking-[0.1em] text-ink/50 sm:text-[13px]">
          {count} shapes
        </div>
      </div>
      <ImagePlaceholder
        label={placeholderLabel}
        tone="cream"
        className="aspect-4/3 w-full overflow-hidden bg-cream"
      />
    </div>
  );
}
