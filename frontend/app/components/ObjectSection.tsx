import SectionHeader from "./SectionHeader";
import ProductFamilyCard from "./object/ProductFamilyCard";

export default function ObjectSection() {
  return (
    <section id="object" className="bg-cream-soft px-6 py-16 md:px-14 md:py-30">
      <div className="mx-auto max-w-360">
        <SectionHeader
          eyebrow="The souvenirs"
          title="Available now"
          intro="These are the shapes ready to ship today. The range keeps growing as we cover new places."
        />

        <div className="grid grid-cols-1 gap-12 sm:gap-14 md:grid-cols-2 md:gap-10 lg:gap-14">
          <ProductFamilyCard
            title="Magnets"
            count={6}
            placeholderLabel="Drop a photo of all magnet shapes"
          />
          <ProductFamilyCard
            title="Keychains"
            count={4}
            placeholderLabel="Drop a photo of all keychain shapes"
          />
        </div>
      </div>
    </section>
  );
}
