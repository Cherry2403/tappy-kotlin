import Flipbook from "./flipbook/Flipbook";

export default function StoryOfYou() {
  return (
    <div className="mt-24 sm:mt-32 lg:mt-37.5">
      <div className="mb-8 flex items-baseline gap-3 sm:mb-10 sm:gap-4">
        <span className="font-marcellus text-[13px] tracking-[0.18em] text-olive">02</span>
        <span className="h-px w-6 bg-olive/45 sm:w-8.5" />
        <h3 className="text-stroke-thin font-italiana text-[34px] leading-[1.05] tracking-[0.01em] text-ink sm:text-[42px] lg:text-[48px]">
          Story of you
        </h3>
      </div>

      <Flipbook />
    </div>
  );
}
