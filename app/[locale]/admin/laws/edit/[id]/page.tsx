"use client";
import React, { useState, use, useEffect } from "react";
import {
  Gavel,
  ArrowRight,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Globe,
  Tag,
  BookOpen,
  LayoutGrid,
  Loader2,
  Edit3,
  FileText,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { adminService } from "@/services/adminService";
import { Law } from "@/types/law";
import { lawService } from "@/services/lawService";

export default function EditLawPage({
  params,
}: {
  params: Promise<{ locale: string, id: string }>;
}) {
  const { locale, id } = use(params);
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";
  const router = useRouter();

  // Form State matching Law interface
  const [formData, setFormData] = useState({
    title: "",
    simplified_text: "",
    simplified_description: "",
    text: "",
    country: "",
    category_id: "",
    source_url: "",
    article_number: "",
    saudi_reference_id: "",
  });

  const [loading, setLoading] = useState(true); // Start loading for fetch
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { id: 1, name: isAr ? "المرور" : "Traffic" },
    { id: 2, name: isAr ? "العمل والعقود" : "Work & Contracts" },
    { id: 3, name: isAr ? "الآداب العامة" : "Public Decency" },
    { id: 4, name: isAr ? "الإقامة والتأشيرات" : "Residency & Visas" },
    { id: 5, name: isAr ? "المأكولات" : "Food" },
  ];

  // Fetch data on load
  useEffect(() => {
    const fetchLaw = async () => {
      try {
        setLoading(true);
        setError(null);
        let law: Law;
        
        try {
          law = await adminService.getLawById(Number(id));
        } catch (getByIdError: any) {
          // Fallback if GET /admin/laws/{id} is 405
          console.warn("Direct GET failed, attempting fallback search...", getByIdError);
          const results = await adminService.getLaws(0, 1, id);
          const found = results.find(l => l.id === Number(id));
          if (found) {
            law = found;
          } else {
            throw getByIdError;
          }
        }

        setFormData({
          title: law.title,
          simplified_text: law.simplified_text || "",
          simplified_description: law.simplified_description || "",
          text: law.text || "",
          country: law.country,
          category_id: law.category_id.toString(),
          source_url: law.source_url || "",
          article_number: law.article_number || "",
          saudi_reference_id: law.saudi_reference_id?.toString() || "",
        });
      } catch (err: any) {
        console.error("Failed to fetch law", err);
        setError(err.message || (isAr ? "فشل تحميل بيانات القانون" : "Failed to load law data"));
      } finally {
        setLoading(false);
      }
    };
    fetchLaw();
  }, [id, locale, isAr]);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const data = await lawService.getAvailableCountries();
        setAvailableCountries(
          data.filter(
          (country: string) =>
            !["saudi arabia", "السعودية", "المملكة العربية السعودية"].includes(country.toLowerCase())
          )
        );
      } catch {
        setAvailableCountries([]);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = isAr ? "العنوان مطلوب" : "Title is required";
    if (!formData.simplified_text) newErrors.simplified_text = isAr ? "النص المبسط مطلوب" : "Simplified text is required";
    if (!formData.category_id) newErrors.category_id = isAr ? "يرجى اختيار تصنيف" : "Please select a category";
    if (!formData.country) newErrors.country = isAr ? "الدولة مطلوبة" : "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      setError(null);
      const payload: Partial<Law> = {
        ...formData,
        category_id: Number(formData.category_id),
        saudi_reference_id: formData.saudi_reference_id ? Number(formData.saudi_reference_id) : undefined,
      };
      await adminService.updateLaw(Number(id), payload);
      setSuccess(true);
      setTimeout(() => router.push(`/${locale}/admin/laws`), 2000);
    } catch (err: any) {
      console.error("Update error:", err);
      setError(err.message || (isAr ? "فشل تحديث القانون" : "Failed to update law"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f1eb] flex flex-col" dir={dir}>
      <Navbar />

      <div className="flex-1 pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link href={`/${locale}/admin/laws`} className="inline-flex items-center gap-2 text-[#2C160F]/50 hover:text-[#2C160F] mb-4 font-bold text-sm transition-colors group">
              {isAr ? <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> : <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
              {isAr ? "العودة للقائمة" : "Back to List"}
            </Link>
            <h1 className="text-4xl font-black text-[#2C160F] flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#2C160F] text-white flex items-center justify-center shadow-lg">
                <Gavel className="w-6 h-6" />
              </div>
              {isAr ? "تعديل بيانات القانون" : "Edit Law Details"}
            </h1>
          </div>

          {loading ? (
            <div className="bg-white rounded-[2.5rem] p-12 border border-[#2C160F]/5 shadow-2xl flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-[#2C160F]/20" />
              <p className="text-[#2C160F]/40 font-bold uppercase tracking-widest text-xs animate-pulse">
                {isAr ? "جاري تحميل بيانات القانون..." : "Loading law data..."}
              </p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-[2.5rem] p-12 border border-red-100 shadow-2xl flex flex-col items-center justify-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-black text-[#2C160F] mb-2">{isAr ? "حدث خطأ أثناء تحميل البيانات" : "Error loading data"}</h2>
                <p className="text-[#2C160F]/60 font-medium max-w-md mx-auto">{error}</p>
              </div>
              <Link href={`/${locale}/admin/laws`} className="bg-[#2C160F] text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
                {isAr ? "العودة للقائمة" : "Back to List"}
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-[#2C160F]/5 border border-[#2C160F]/5 p-8 md:p-12 relative overflow-hidden">
              {success && (
                <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center animate-in fade-in duration-500">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-black text-[#2C160F] mb-2">
                    {isAr ? "تم التحديث بنجاح!" : "Updated Successfully!"}
                  </h2>
                  <p className="text-[#2C160F]/60 font-bold mb-8 text-center">
                    {isAr ? "تم تحديث بيانات القانون في قاعدة البيانات" : "The law has been updated in the database"}
                  </p>
                  <button
                    onClick={() => router.push(`/${locale}/admin/laws`)}
                    className="bg-[#2C160F] text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
                  >
                    {isAr ? "العودة للقائمة" : "Back to List"}
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Category Selection */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[#2C160F] font-black text-sm mb-2">
                      <LayoutGrid className="w-4 h-4 opacity-40" />
                      {isAr ? "تصنيف القانون" : "Law Category"}
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className={`w-full bg-[#f5f1eb]/50 border-2 ${errors.category_id ? 'border-red-300' : 'border-transparent'} focus:border-[#2C160F]/20 rounded-2xl p-4 text-[#2C160F] font-bold outline-none transition-all appearance-none cursor-pointer`}
                    >
                      <option value="">{isAr ? "اختر التصنيف..." : "Select Category..."}</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    {errors.category_id && <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.category_id}</p>}
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[#2C160F] font-black text-sm mb-2">
                      <Globe className="w-4 h-4 opacity-40" />
                      {isAr ? "الدولة" : "Country"}
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className={`w-full bg-[#f5f1eb]/50 border-2 ${errors.country ? 'border-red-300' : 'border-transparent'} focus:border-[#2C160F]/20 rounded-2xl p-4 text-[#2C160F] font-bold outline-none transition-all appearance-none cursor-pointer`}
                    >
                      <option value={"sa"}>{"sa"}</option>
                      {availableCountries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                    {errors.country && <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.country}</p>}
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[#2C160F] font-black text-sm mb-2">
                    <Tag className="w-4 h-4 opacity-40" />
                    {isAr ? "عنوان القانون" : "Law Title"}
                  </label>
                  <input
                    type="text"
                    placeholder={isAr ? "مثال: نظام المرور - المادة العاشرة..." : "e.g. Traffic Law - Article 10..."}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full bg-[#f5f1eb]/50 border-2 ${errors.title ? 'border-red-300' : 'border-transparent'} focus:border-[#2C160F]/20 rounded-2xl p-4 text-[#2C160F] font-bold outline-none transition-all`}
                  />
                  {errors.title && <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.title}</p>}
                </div>

                {/* Simplified Description */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[#2C160F] font-black text-sm mb-2">
                    <FileText className="w-4 h-4 opacity-40" />
                    {isAr ? "وصف مختصر (نبذة)" : "Short Description (Summary)"}
                  </label>
                  <input
                    type="text"
                    value={formData.simplified_description}
                    onChange={(e) => setFormData({ ...formData, simplified_description: e.target.value })}
                    className="w-full bg-[#f5f1eb]/50 border-2 border-transparent focus:border-[#2C160F]/20 rounded-2xl p-4 text-[#2C160F] font-bold outline-none transition-all"
                    placeholder={isAr ? "نبذة قصيرة تظهر في نتائج البحث..." : "A short summary for search results..."}
                  />
                </div>

                {/* Simplified Text */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[#2C160F] font-black text-sm mb-2">
                    <BookOpen className="w-4 h-4 opacity-40" />
                    {isAr ? "النص المبسط (للمستخدم)" : "Simplified Text (for users)"}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.simplified_text}
                    onChange={(e) => setFormData({ ...formData, simplified_text: e.target.value })}
                    className={`w-full bg-[#f5f1eb]/50 border-2 ${errors.simplified_text ? 'border-red-300' : 'border-transparent'} focus:border-[#2C160F]/20 rounded-2xl p-4 text-[#2C160F] font-bold outline-none transition-all resize-none`}
                    placeholder={isAr ? "اكتب شرحاً مبسطاً للقانون هنا..." : "Write a simplified explanation here..."}
                  />
                  {errors.simplified_text && <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.simplified_text}</p>}
                </div>

                {/* Full Original Text */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[#2C160F] font-black text-sm mb-2">
                    <FileText className="w-4 h-4 opacity-40" />
                    {isAr ? "نص القانون الأصلي" : "Original Law Text"}
                  </label>
                  <textarea
                    rows={5}
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    className="w-full bg-[#f5f1eb]/50 border-2 border-transparent focus:border-[#2C160F]/20 rounded-2xl p-4 text-[#2C160F] font-bold outline-none transition-all resize-none"
                    placeholder={isAr ? "نص المادة القانونية كما ورد في المصدر..." : "The original law text as it appears in the source..."}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Article Number */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[#2C160F] font-black text-sm mb-2">
                      <FileText className="w-4 h-4 opacity-40" />
                      {isAr ? "رقم المادة" : "Article Number"}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 12, 45-A..."
                      value={formData.article_number}
                      onChange={(e) => setFormData({ ...formData, article_number: e.target.value })}
                      className="w-full bg-[#f5f1eb]/50 border-2 border-transparent focus:border-[#2C160F]/20 rounded-2xl p-4 text-[#2C160F] font-bold outline-none transition-all"
                    />
                  </div>

                  {/* Source URL */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[#2C160F] font-black text-sm mb-2">
                      <Globe className="w-4 h-4 opacity-40" />
                      {isAr ? "رابط المصدر" : "Source URL"}
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.source_url}
                      onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                      className="w-full bg-[#f5f1eb]/50 border-2 border-transparent focus:border-[#2C160F]/20 rounded-2xl p-4 text-[#2C160F] font-bold outline-none transition-all"
                    />
                  </div>

                  {/* Saudi Reference (For Foreign Laws) */}
                  {formData.country.toLowerCase() !== "saudi arabia" && formData.country !== "السعودية" && (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-[#2C160F] font-black text-sm mb-2">
                        <Gavel className="w-4 h-4 opacity-40" />
                        {isAr ? "معرف المرجع السعودي (ID)" : "Saudi Reference Law (ID)"}
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 123"
                        value={formData.saudi_reference_id}
                        onChange={(e) => setFormData({ ...formData, saudi_reference_id: e.target.value })}
                        className="w-full bg-[#f5f1eb]/50 border-2 border-transparent focus:border-[#2C160F]/20 rounded-2xl p-4 text-[#2C160F] font-bold outline-none transition-all"
                      />
                      <p className="text-[10px] text-[#2C160F]/40 font-medium">
                        {isAr ? "* يستخدم لربط هذا القانون الأجنبي بالقانون السعودي المقابل له." : "* Used to link this foreign law with its corresponding Saudi law."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-[#2C160F] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#2C160F]/90 transition-all shadow-xl shadow-[#2C160F]/10 disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {isAr ? "تحديث القانون" : "Update Law"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tips Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#2C160F]/5 p-6 rounded-3xl">
              <h4 className="text-[#2C160F] font-black text-sm mb-2">{isAr ? "نصيحة التحديث" : "Updating Tip"}</h4>
              <p className="text-[#2C160F]/60 text-xs font-bold leading-relaxed">
                {isAr ? "تأكد من مراجعة نصوص القوانين بدقة قبل التحديث لضمان صحة المعلومات القانونية." : "Double-check law texts carefully before updating to ensure legal accuracy."}
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
