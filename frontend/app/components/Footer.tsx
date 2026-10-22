import Link from "next/link";

type FooterColumn = {
  heading: string;
  links: { href: string; label: string }[];
};

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Product",
    links: [
      { href: "/#object", label: "Souvenirs" },
      { href: "/#stories", label: "Stories" },
      { href: "/#partners", label: "For resellers" },
      { href: "/#reserve", label: "Contact Us" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "#", label: "About" },
      { href: "#", label: "Journal" },
      { href: "#", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-10 bg-olive px-6 pt-14 pb-8 text-white md:px-14 md:pt-21 md:pb-10">
      <div className="mx-auto max-w-360">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-b border-white pb-11 sm:grid-cols-[1.6fr_1fr_1fr_1fr] sm:gap-12">
          <div className="col-span-2 sm:col-span-1">
            <div className="text-stroke-thin mb-4.5 font-italiana text-[28px] tracking-[0.08em]">
              VUUR KAT
            </div>
            <div className="max-w-75 font-marcellus text-xl leading-[1.35] font-light opacity-85 italic">
              A thoughtful way to keep a place
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <div className="mb-5 font-marcellus text-sm font-light text-white/70 italic">
                {column.heading}
              </div>
              <div className="flex flex-col gap-3 font-marcellus text-[15px]">
                {column.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-inherit opacity-90 no-underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
