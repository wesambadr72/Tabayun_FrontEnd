"use client";
import React, { useState, use } from "react";
import {
  Gavel,
  ArrowRight,
  ArrowLeft,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Globe,
  Tag,
  BookOpen,
  LayoutGrid,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function AddLawPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  // Form State
  const [formData, setFormData] = useState({
    saudiLaw: "",
    otherLaw: "",
    comparativeAnalysis: "",
    category: "",
    keywords: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { id: "traffic", name: isAr ? "المرور" : "Traffic" },
    { id: "labor", name: isAr ? "العمل" : "Labor" },
    { id: "public_decency", name: isAr ? "الذوق العام" : "Public Decency" },
    { id: "visa_residency", name: isAr ? "التأشيرات والإقامة" : "Visa & Residency" },
    { id: "food", name: isAr ? "الأغذية" : "Food" },
  ];

  const router = useRouter();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.saudiLaw) newErrors.saudiLaw = isAr ? "هذا الحقل مطلوب" : "Required field";
    if (!formData.otherLaw) newErrors.otherLaw = isAr ? "هذا الحقل مطلوب" : "Required field";
    if (!formData.comparativeAnalysis) newErrors.comparativeAnalysis = isAr ? "هذا الحقل مطلوب" : "Required field";
    if (!formData.category) newErrors.category = isAr ? "يرجى اختيار تصنيف" : "Please select a category";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveLaw = (status: 'active' | 'draft') => {
    if (!validate()) return;
    setLoading(true);

    setTimeout(() => {
      // Create a law object matching the structure in laws/page.tsx
      const cat = categories.find(c => c.id === formData.category);
      const newLaw = {
        id: Date.now(),
        // Just use a snippet of the text as title for the mock
        titleAr: formData.saudiLaw.substring(0, 30) + (formData.saudiLaw.length > 30 ? '...' : ''),
        titleEn: formData.saudiLaw.substring(0, 30) + (formData.saudiLaw.length > 30 ? '...' : ''),
        categoryAr: cat ? (isAr ? cat.name : "Category") : "",
        categoryEn: cat ? (!isAr ? cat.name : formData.category) : "",
        date: new Date().toISOString().split('T')[0],
        status: status
      };

      const saved = localStorage.getItem('tabayun_laws');
      const existingLaws = saved ? JSON.parse(saved) : [];

      localStorage.setItem('tabayun_laws', JSON.stringify([newLaw, ...existingLaws]));

      setLoading(false);
      setSuccess(true);

      // Redirect after showing success modal
      setTimeout(() => {
        router.push(`/${locale}/admin/laws`);
      }, 1500);
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    saveLaw('active');
  };

  const handleDraft = () => {
    saveLaw('draft');
  };

  return (
    <main className="min-h-screen bg-[#f5f1eb] flex flex-col" dir={dir}>
      <Navbar />

      <div className="flex-1 pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link
                href={`/${locale}/admin/laws`}
                className="flex items-center gap-2 text-[#2C160F]/50 hover:text-[#2C160F] transition-colors mb-4 font-bold text-sm"
              >
                {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {isAr ? "العودة لإدارة القوانين" : "Back to Laws Management"}
              </Link>
              <h1 className="text-3xl font-black text-[#2C160F]">
                {isAr ? "إضافة محتوى قانوني جديد" : "Add New Legal Content"}
              </h1>
            </div>
            <div className="bg-[#2C160F] p-4 rounded-2xl text-white shadow-lg">
              <Gavel className="w-6 h-6" />
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-[#2C160F]/5 border border-[#2C160F]/5 p-8 md:p-12 relative overflow-hidden">

            {success && (
              <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-black text-[#2C160F] mb-2">
                  {isAr ? "تم الحفظ بنجاح!" : "Saved Successfully!"}
                </h2>
                <p className="text-[#2C160F]/60 font-bold mb-8 text-center">
                  {isAr ? "تمت إضافة القانون الجديد إلى قاعدة البيانات" : "The new law has been added to the database"}
                </p>
                <button
                  onClick={() => router.push(`/${locale}/admin/laws`)}
                  className="bg-[#2C160F] text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
                >
                  {isAr ? "العودة للقائمة" : "Back to List"}
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Category Selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[#2C160F] font-black text-sm mb-2">
                    <LayoutGrid className="w-4 h-4 opacity-40" />
                    {isAr ? "تصنيف القانون" : "Law Category"}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full bg-[#f5f1eb]/50 border-2 ${errors.category ? 'border-red-300' : 'border-transparent'} focus:border-[#2C160F]/20 rounded-2xl p-4 text-[#2C160F] font-bold outline-none transition-all appearance-none cursor-pointer`}
                  >
                    <option value="">{isAr ? "اختر التصنيف..." : "Select Category..."}</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.category}</p>}
                </div>

                {/* Keywords */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[#2C160F] font-black text-sm mb-2">
                    <Tag className="w-4 h-4 opacity-40" />
                    {isAr ? "الكلمات المفتاحية" : "Keywords"}
                  </label>
                  <input
                    type="text"
                    placeholder={isAr ? "مثال: سرعة، مخالفة، سياحة..." : "e.g. Speed, Violation, Tourism..."}
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    className="w-full bg-[#f5f1eb]/50 border-2 border-transparent focus:border-[#2C160F]/20 rounded-2xl p-4 text-[#2C160F] font-bold outline-none transition-all"
                  />
                </div>
              </div>

              {/* Saudi Law Text */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[#2C160F] font-black text-sm mb-2">
                  <BookOpen className="w-4 h-4 opacity-40" />
                  {isAr ? "نص القانون السعودي" : "Saudi Law Text"}
                </label>
                <textarea
                  rows={4}
                  value={formData.saudiLaw}
                  onChange={(e) => setFormData({ ...formData, saudiLaw: e.target.value })}
                  className={`w-full bg-[#f5f1eb]/50 border-2 ${errors.saudiLaw ? 'border-red-300' : 'border-transparent'} focus:border-[#2C160F]/20 rounded-2xl p-4 text-[#2C160F] font-bold outline-none transition-all resize-none`}
                  placeholder={isAr ? "اكتب نص القانون هنا..." : "Write the law text here..."}
                />
                {errors.saudiLaw && <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.saudiLaw}</p>}
              </div>

              {/* Other Country Law Text */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[#2C160F] font-black text-sm mb-2">
                  <Globe className="w-4 h-4 opacity-40" />
                  {isAr ? "نص قانون الدولة الأخرى (اختياري)" : "Other Country Law Text (Optional)"}
                </label>
                <textarea
                  rows={4}
                  value={formData.otherLaw}
                  onChange={(e) => setFormData({ ...formData, otherLaw: e.target.value })}
                  className={`w-full bg-[#f5f1eb]/50 border-2 ${errors.otherLaw ? 'border-red-300' : 'border-transparent'} focus:border-[#2C160F]/20 rounded-2xl p-4 text-[#2C160F] font-bold outline-none transition-all resize-none`}
                  placeholder={isAr ? "اكتب نص القانون المقارن هنا..." : "Write the comparative law text here..."}
                />
                {errors.otherLaw && <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.otherLaw}</p>}
              </div>

              {/* Comparative Analysis */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[#2C160F] font-black text-sm mb-2">
                  <CheckCircle2 className="w-4 h-4 opacity-40" />
                  {isAr ? "التحليل المقارن" : "Comparative Analysis"}
                </label>
                <textarea
                  rows={6}
                  value={formData.comparativeAnalysis}
                  onChange={(e) => setFormData({ ...formData, comparativeAnalysis: e.target.value })}
                  className={`w-full bg-[#f5f1eb]/50 border-2 ${errors.comparativeAnalysis ? 'border-red-300' : 'border-transparent'} focus:border-[#2C160F]/20 rounded-2xl p-4 text-[#2C160F] font-bold outline-none transition-all resize-none`}
                  placeholder={isAr ? "اشرح الفروقات والتحليلات القانونية هنا..." : "Explain differences and legal analysis here..."}
                />
                {errors.comparativeAnalysis && <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.comparativeAnalysis}</p>}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#2C160F] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#2C160F]/90 transition-all shadow-xl shadow-[#2C160F]/10 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {isAr ? "حفظ المحتوى" : "Save Content"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDraft}
                  disabled={loading}
                  className="px-8 py-4 rounded-2xl font-black text-[#2C160F]/60 border-2 border-[#2C160F]/10 hover:text-[#2C160F] hover:border-[#2C160F]/30 hover:bg-[#f5f1eb] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-5 h-5 opacity-60" />
                  {isAr ? "حفظ كمسودة" : "Save as Draft"}
                </button>
              </div>

            </form>
          </div>

          {/* Tips Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#2C160F]/5 p-6 rounded-3xl">
              <h4 className="text-[#2C160F] font-black text-sm mb-2">{isAr ? "نصيحة الحفظ" : "Saving Tip"}</h4>
              <p className="text-[#2C160F]/60 text-xs font-bold leading-relaxed">
                {isAr ? "تأكد من مراجعة نصوص القوانين بدقة قبل الحفظ لضمان صحة المعلومات القانونية." : "Double-check law texts carefully before saving to ensure legal accuracy."}
              </p>
            </div>
            <div className="bg-[#2C160F]/5 p-6 rounded-3xl">
              <h4 className="text-[#2C160F] font-black text-sm mb-2">{isAr ? "التصنيفات" : "Categories"}</h4>
              <p className="text-[#2C160F]/60 text-xs font-bold leading-relaxed">
                {isAr ? "اختيار التصنيف الصحيح يساعد المساعد الذكي على تقديم إجابات أكثر دقة للمستخدمين." : "Choosing the correct category helps the AI assistant provide more accurate answers to users."}
              </p>
            </div>
            <div className="bg-[#2C160F]/5 p-6 rounded-3xl">
              <h4 className="text-[#2C160F] font-black text-sm mb-2">{isAr ? "الكلمات المفتاحية" : "Keywords"}</h4>
              <p className="text-[#2C160F]/60 text-xs font-bold leading-relaxed">
                {isAr ? "استخدم كلمات مفتاحية بسيطة ودارجة لتسهيل عملية البحث على السياح." : "Use simple and common keywords to make searching easier for tourists."}
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
