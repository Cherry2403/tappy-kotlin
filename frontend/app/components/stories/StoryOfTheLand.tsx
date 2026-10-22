import Image from "next/image";
import { STORY_OF_THE_LAND_BEATS } from "../hero/storyContent";

export default function StoryOfTheLand() {
  return (
    <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-18">
      <div className="relative h-[300px] w-full sm:h-[380px] lg:h-[520px]">
        <Image
          src="/picture/real_house.jpg"
          alt="Amsterdam narrow house"
          fill
          quality={75}
          sizes="(min-width: 1024px) 39vw, 100vw"
          className="object-contain"
        />
      </div>

      <div>
        <div className="mb-5 flex items-baseline gap-3 sm:gap-4">
          <span className="font-marcellus text-[13px] tracking-[0.18em] text-olive">01</span>
          <span className="h-px w-6 bg-olive/45 sm:w-8.5" />
          <h3 className="text-stroke-thin font-italiana text-[34px] leading-[1.05] tracking-[0.01em] text-ink sm:text-[42px] lg:text-[48px]">
            Story of the land
          </h3>
        </div>
        <div className="mb-9 font-marcellus text-[14px] tracking-[0.06em] text-ink/55 sm:mb-11 sm:text-[15px]">
          Amsterdam
        </div>

        <div className="flex flex-col gap-8 sm:gap-9.5">
          {STORY_OF_THE_LAND_BEATS.map((beat) => (
            <div
              key={beat.heading}
              className="grid grid-cols-[28px_1fr] items-start gap-3 sm:grid-cols-[52px_1fr] sm:gap-4.5"
            >
              <div className="mt-2.5 flex items-center sm:mt-3">
                <div className="h-1.75 w-1.75 shrink-0 rounded-full bg-olive" />
                <div className="h-px flex-1 bg-gradient-to-r from-olive to-olive/25" />
              </div>
              <div>
                <div className="text-stroke-thin mb-2 font-italiana text-[23px] tracking-[0.01em] sm:text-[28px]">
                  {beat.heading}
                </div>
                <div className="max-w-108 font-marcellus text-sm leading-relaxed text-ink/68">
                  {beat.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
