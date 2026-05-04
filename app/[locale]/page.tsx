import Navbar from "@/components/Navbar";
import Hero from "@/components/features/Hero";
import AboutSection from "@/components/features/AboutSection";
import FeaturesSection from "@/components/features/FeaturesSection";
import BotCTASection from "@/components/features/BotCTASection";
import Footer from "@/components/Footer";
import { PageShell } from "@/components/ui/tabayun";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <PageShell className="flex flex-col">
      <Navbar />
      <Hero />
      <AboutSection />
      <FeaturesSection />
      <BotCTASection />
      <Footer />
    </PageShell>
  );
}
