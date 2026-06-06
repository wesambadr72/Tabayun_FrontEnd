// --- استيراد المكونات الأساسية ---
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageShell } from "@/components/ui/tabayun";

// --- استيراد أقسام الصفحة الرئيسية (Features) ---
import Hero from "@/components/features/Hero";
import AboutSection from "@/components/features/AboutSection";
import FeaturesSection from "@/components/features/FeaturesSection";
import BotCTASection from "@/components/features/BotCTASection";

/**
 * مكون الصفحة الرئيسية (Home Page):
 * الصفحة التعريفية للمنصة، تعرض رؤية المشروع، المميزات، ورابط الانتقال للدردشة مع الذكاء الاصطناعي.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // جلب اللغة الحالية من الرابط (ar/en)
  const { locale } = await params;

  return (
    <PageShell className="flex flex-col">
      {/* شريط التنقل العلوي */}
      <Navbar />

      {/* قسم الترحيب الرئيسي */}
      <Hero />

      {/* قسم "عن تبين" */}
      <AboutSection />

      {/* قسم مميزات المنصة */}
      <FeaturesSection />

      {/* قسم دعوة لتجربة المساعد الذكي */}
      <BotCTASection />

      {/* تذييل الصفحة */}
      <Footer />
    </PageShell>
  );
}
