import Navbar from "@/components/Navbar";
import Hero from "@/components/features/Hero";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#1a1510]"> {/* لون خلفية احتياطي غامق */}
      <Navbar />
      <Hero />
    </main>
  );
}