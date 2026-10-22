import SectionHeader from "./SectionHeader";
import StoryOfTheLand from "./stories/StoryOfTheLand";
import StoryOfYou from "./stories/StoryOfYou";

export default function Stories() {
  return (
    <section id="stories" className="px-6 py-16 md:px-14 md:py-32">
      <SectionHeader
        eyebrow="The stories inside"
        title="TAPPY holds best stories."
        titleClassName="text-[44px] md:text-[78px]"
      />

      <StoryOfTheLand />
      <StoryOfYou />
    </section>
  );
}
