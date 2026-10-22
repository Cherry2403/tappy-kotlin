import ReserveForm from "./reserve/ReserveForm";

export default function Reserve() {
  return (
    <section id="reserve" className="bg-wine px-6 py-16 text-cream md:px-14 md:py-35">
      <div className="mx-auto grid max-w-360 grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
        <div>
          <h2 className="text-stroke-thick mb-8 font-italiana text-[40px] leading-[1.02] text-cream sm:text-[56px] lg:mb-8 lg:text-[92px]">
            Say hello.<br /> We&apos;ll listen.
          </h2>
          <div className="h-px w-24 bg-cream/50" />
        </div>

        <ReserveForm />
      </div>
    </section>
  );
}
