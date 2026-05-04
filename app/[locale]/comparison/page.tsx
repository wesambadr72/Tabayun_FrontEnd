import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageShell, PrimaryButton, SectionHeader, SurfaceCard } from "@/components/ui/tabayun";
import { GitCompare, Search, ShieldCheck } from "lucide-react";

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  return (
    <PageShell dir={dir}>
      <Navbar />

      <section className="tabayun-page-offset pb-16">
        <div className="tabayun-container">
          <SectionHeader
            eyebrow={isAr ? "مركز المقارنات" : "Comparison center"}
            icon={<GitCompare className="h-4 w-4" />}
            title={isAr ? "ابدأ المقارنة من الفئة المناسبة" : "Start from the right category"}
            description={isAr ? "اختر المجال القانوني ثم افتح المقارنة التي تناسب بلدك وسياق رحلتك." : "Choose a legal domain, then open the comparison that matches your country and trip context."}
            className="mb-10"
          />

          <div className="grid gap-5 md:grid-cols-2">
            <SurfaceCard className="p-6">
              <Search className="mb-5 h-8 w-8 text-tabayun-coffee" />
              <h2 className="text-2xl font-black text-tabayun-coffee">{isAr ? "ابحث عن موقف" : "Search a situation"}</h2>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-tabayun-coffee/58">
                {isAr ? "استخدم البحث إذا كنت تعرف السؤال أو السلوك الذي تريد فهمه." : "Use search if you already know the question or behavior you want to understand."}
              </p>
              <PrimaryButton href={`/${locale}/search`} locale={locale} className="mt-6">
                {isAr ? "فتح البحث" : "Open search"}
              </PrimaryButton>
            </SurfaceCard>

            <SurfaceCard dark className="p-6">
              <ShieldCheck className="mb-5 h-8 w-8 text-tabayun-gold" />
              <h2 className="text-2xl font-black">{isAr ? "تصفح الفئات" : "Browse categories"}</h2>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-tabayun-paper/58">
                {isAr ? "الطريقة الأفضل للوصول للمقارنات المنظمة والتنبيهات المرتبطة بها." : "The best way to reach organized comparisons and their related warnings."}
              </p>
              <PrimaryButton href={`/${locale}/categories`} locale={locale} className="mt-6 bg-tabayun-paper text-tabayun-coffee hover:bg-white">
                {isAr ? "تصفح الفئات" : "Browse categories"}
              </PrimaryButton>
            </SurfaceCard>
          </div>
        </div>
      </section>

      <Footer />
    </PageShell>
  );
}
