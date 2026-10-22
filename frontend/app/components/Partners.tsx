import Link from "next/link";
import SectionHeader from "./SectionHeader";

export default function Partners() {
  return (
    <section id="partners" className="bg-white px-6 py-16 md:px-14 md:py-30">
      <div className="mx-auto max-w-360">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-22">
          <SectionHeader
            eyebrow="For resellers"
            title={
              <>
                Sell it at<br className="hidden sm:block" /> your shop
              </>
            }
          />

          <div className="flex flex-col">
            <div className="pb-7.5">
              <div className="text-stroke-thin mb-2.5 font-italiana text-[30px] tracking-[0.01em]">
                Ready to sell
              </div>
              <div className="font-marcellus text-sm leading-[1.65] text-ink/65">
                Story already written and loaded. Nothing to set up.
              </div>
            </div>

            <div className="border-t border-olive/20 py-7.5">
              <div className="text-stroke-thin mb-2.5 font-italiana text-[30px] tracking-[0.01em]">
                Ask for more shapes
              </div>
              <div className="font-marcellus text-sm leading-[1.65] text-ink/65">
                Tell us what your customers would buy. If a place or shape is
                not in the range yet, we can take it to our manufacturer and
                add it.
              </div>
              <div className="mt-3.5 font-marcellus text-sm text-ink/50">
                Amsterdam range available now · other areas on request
              </div>
            </div>

            <div className="flex flex-col items-start gap-4.5 border-t border-olive/20 pt-7.5">
              <Link
                href="#reserve"
                className="inline-flex items-center gap-3 rounded-[10px] bg-olive px-8 py-4.5 font-marcellus text-base text-white no-underline"
              >
                Request wholesale pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
