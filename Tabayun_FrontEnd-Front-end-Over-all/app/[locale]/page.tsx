import Navbar from "@/components/Navbar";
import Hero from "@/components/features/Hero";
import AboutSection from "@/components/features/AboutSection";
import FeaturesSection from "@/components/features/FeaturesSection";
import ContactSection from "@/components/features/ContactSection";
import Footer from "@/components/Footer";

export default function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#f5f1eb]">
      <div className="fixed top-0 w-full z-50 flex justify-center py-4 bg-transparent pointer-events-none">
        <div className="pointer-events-auto w-full max-w-6xl px-4">
          <Navbar locale={locale} />
        </div>
      </div>
      <Hero />
      <AboutSection />
      <FeaturesSection />
      <ContactSection />
      <Footer />
    </main>
  );
}