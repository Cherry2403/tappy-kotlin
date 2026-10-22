import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stories from "./components/Stories";
import ObjectSection from "./components/ObjectSection";
import Partners from "./components/Partners";
import Reserve from "./components/Reserve";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <div className="mx-auto max-w-360">
        <Navbar />
      </div>

      <Hero />

      <div className="mx-auto max-w-360">
        <Stories />
      </div>

      <ObjectSection />

      <Partners />
      <Reserve />
      <Footer />
    </main>
  );
}
