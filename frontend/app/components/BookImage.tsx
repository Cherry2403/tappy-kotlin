import Image from "next/image";

/**
 * A photo that fills its (already-positioned) parent, cropping to cover.
 * Parent must be `position: relative` with a real size, exactly like the
 * ImagePlaceholder slots this replaces.
 */
export default function BookImage({
  src,
  alt,
  className = "",
  rounded = true,
}: {
  src: string;
  alt: string;
  className?: string;
  rounded?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 50vw, 340px"
      quality={75}
      className={`object-cover ${rounded ? "rounded-[14px]" : "rounded-none"} ${className}`}
    />
  );
}
