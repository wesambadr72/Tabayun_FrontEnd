"use client";
import React, { use, useState, useEffect } from "react";
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  ArrowLeft,
  ArrowRight,
  FileText,
  AlertTriangle,
  X
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

// Initial Mock data
const MOCK_LAWS = [
  { id: 1, titleAr: "قانون العمل", titleEn: "Labor Law", categoryAr: "عمالي", categoryEn: "Labor", date: "2024-01-15", status: "active" },
  { id: 2, titleAr: "نظام المرور", titleEn: "Traffic Law", categoryAr: "مروري", categoryEn: "Traffic", date: "2023-11-20", status: "active" },
  { id: 3, titleAr: "نظام الشركات", titleEn: "Companies Law", categoryAr: "تجاري", categoryEn: "Commercial", date: "2024-02-05", status: "draft" },
  { id: 4, titleAr: "نظام المعاملات المدنية", titleEn: "Civil Transactions Law", categoryAr: "مدني", categoryEn: "Civil", date: "2023-06-18", status: "active" },
  { id: 5, titleAr: "نظام حماية البيانات الشخصية", titleEn: "Personal Data Protection Law", categoryAr: "تقني", categoryEn: "Technology", date: "2024-03-10", status: "active" },
];

export default function AdminLawsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const [laws, setLaws] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lawToDelete, setLawToDelete] = useState<any>(null);

  // Load laws from localStorage
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('tabayun_laws');
    if (saved) {
      let parsedLaws = JSON.parse(saved);
      // Migrate any existing 'review' statuses to 'active'
      let migrated = false;
      parsedLaws = parsedLaws.map((l: any) => {
        if (l.status === 'review') {
          migrated = true;
          return { ...l, status: 'active' };
        }
        return l;
      });
      if (migrated) {
        localStorage.setItem('tabayun_laws', JSON.stringify(parsedLaws));
      }
      setLaws(parsedLaws);
    } else {
      setLaws(MOCK_LAWS);
      localStorage.setItem('tabayun_laws', JSON.stringify(MOCK_LAWS));
    }
  }, []);

  // Filter logic
  const filteredLaws = laws.filter(law => {
    const matchesSearch = isAr 
      ? law.titleAr.includes(searchTerm) || law.categoryAr.includes(searchTerm)
      : law.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) || law.categoryEn.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || law.categoryEn.toLowerCase() === filterCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const handleDeleteClick = (law: any) => {
    setLawToDelete(law);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (lawToDelete) {
      const updatedLaws = laws.filter(l => l.id !== lawToDelete.id);
      setLaws(updatedLaws);
      localStorage.setItem('tabayun_laws', JSON.stringify(updatedLaws));
      setShowDeleteModal(false);
      setLawToDelete(null);
    }
  };

  if (!isClient) return null; // Prevent hydration mismatch

  return (
    <main className="min-h-screen bg-[#f5f1eb] flex flex-col" dir={dir}>
      <Navbar />
      
      <div className="flex-1 pt-32 px-4 pb-4 md:pt-36 md:px-6 lg:pt-40 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header & Breadcrumb */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Link href={`/${locale}/admin`} className="inline-flex items-center gap-2 text-[#2C160F]/50 hover:text-[#2C160F] mb-2 transition-colors text-sm font-bold">
                {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {isAr ? "العودة للوحة التحكم" : "Back to Dashboard"}
              </Link>
              <h1 className="text-3xl font-black text-[#2C160F] flex items-center gap-3">
                <FileText className="w-8 h-8 text-[#2C160F]/40" />
                {isAr ? "إدارة القوانين" : "Laws Management"}
              </h1>
              <p className="text-[#2C160F]/50 font-medium text-sm mt-1">
                {isAr ? "استعراض، إضافة، تعديل، وحذف القوانين في النظام" : "Browse, add, edit, and delete laws in the system"}
              </p>
            </div>
            
            <Link 
              href={`/${locale}/admin/laws/add`}
              className="inline-flex items-center justify-center gap-2 bg-[#2C160F] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#2C160F]/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <PlusCircle className="w-5 h-5" />
              {isAr ? "إضافة قانون جديد" : "Add New Law"}
            </Link>
          </div>

          {/* Filters & Search */}
          <div className="bg-white p-4 rounded-3xl border border-[#2C160F]/5 shadow-xl shadow-[#2C160F]/5 mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`w-5 h-5 text-[#2C160F]/40 absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-4' : 'left-4'}`} />
              <input 
                type="text" 
                placeholder={isAr ? "ابحث عن قانون..." : "Search for a law..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full bg-[#f5f1eb]/50 border border-transparent focus:border-[#2C160F]/20 rounded-2xl py-3 px-12 text-[#2C160F] outline-none transition-all font-medium`}
              />
            </div>
            <div className="relative min-w-[200px]">
              <Filter className={`w-5 h-5 text-[#2C160F]/40 absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-4' : 'left-4'}`} />
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`w-full bg-[#f5f1eb]/50 border border-transparent focus:border-[#2C160F]/20 rounded-2xl py-3 px-12 text-[#2C160F] outline-none transition-all font-bold appearance-none cursor-pointer`}
              >
                <option value="all">{isAr ? "جميع التصنيفات" : "All Categories"}</option>
                <option value="labor">{isAr ? "عمالي" : "Labor"}</option>
                <option value="traffic">{isAr ? "مروري" : "Traffic"}</option>
                <option value="commercial">{isAr ? "تجاري" : "Commercial"}</option>
                <option value="civil">{isAr ? "مدني" : "Civil"}</option>
                <option value="technology">{isAr ? "تقني" : "Technology"}</option>
              </select>
            </div>
          </div>

          {/* Laws Table / List */}
          <div className="bg-white rounded-3xl border border-[#2C160F]/5 shadow-xl shadow-[#2C160F]/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" dir={dir}>
                <thead>
                  <tr className="bg-[#f5f1eb]/50 border-b border-[#2C160F]/5 text-[#2C160F]/60 text-xs uppercase tracking-widest font-black">
                    <th className="p-4 sm:p-6 text-start">{isAr ? "العنوان" : "Title"}</th>
                    <th className="p-4 sm:p-6 text-start">{isAr ? "التصنيف" : "Category"}</th>
                    <th className="p-4 sm:p-6 text-start">{isAr ? "تاريخ الإضافة" : "Date Added"}</th>
                    <th className="p-4 sm:p-6 text-start">{isAr ? "الحالة" : "Status"}</th>
                    <th className="p-4 sm:p-6 text-end">{isAr ? "الإجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2C160F]/5">
                  {filteredLaws.length > 0 ? (
                    filteredLaws.map((law) => (
                      <tr key={law.id} className="hover:bg-[#f5f1eb]/20 transition-colors group">
                        <td className="p-4 sm:p-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#f5f1eb] flex items-center justify-center text-[#2C160F]/40 group-hover:bg-[#2C160F] group-hover:text-white transition-colors">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-[#2C160F]">{isAr ? law.titleAr : law.titleEn}</p>
                              <p className="text-xs text-[#2C160F]/40 font-medium">ID: #{law.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 sm:p-6">
                          <span className="inline-flex items-center bg-[#f5f1eb] text-[#2C160F]/60 px-3 py-1 rounded-full text-xs font-bold">
                            {isAr ? law.categoryAr : law.categoryEn}
                          </span>
                        </td>
                        <td className="p-4 sm:p-6 text-[#2C160F]/60 font-medium text-sm">
                          {law.date}
                        </td>
                        <td className="p-4 sm:p-6">
                          {law.status === 'active' && (
                            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-xs font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                              {isAr ? "نشط" : "Active"}
                            </span>
                          )}
                          {law.status === 'draft' && (
                            <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-xs font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
                              {isAr ? "مسودة" : "Draft"}
                            </span>
                          )}
                        </td>
                        <td className="p-4 sm:p-6">
                          <div className={`flex items-center gap-2 ${isAr ? 'justify-end' : 'justify-end'}`}>
                            <Link 
                              href={`/${locale}/admin/laws/edit/${law.id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors tooltip-trigger"
                              title={isAr ? "تعديل" : "Edit"}
                            >
                              <Edit3 className="w-5 h-5" />
                            </Link>
                            <button 
                              onClick={() => handleDeleteClick(law)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors tooltip-trigger"
                              title={isAr ? "حذف" : "Delete"}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-[#2C160F]/40">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-bold">{isAr ? "لا توجد قوانين مطابقة للبحث" : "No laws found matching your search"}</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && lawToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C160F]/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button onClick={() => setShowDeleteModal(false)} className="absolute top-4 right-4 p-2 text-[#2C160F]/40 hover:text-[#2C160F] transition-colors rounded-full hover:bg-[#f5f1eb]">
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4 text-red-600">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-black text-red-600 mb-2">
              {isAr ? "حذف القانون" : "Delete Law"}
            </h3>
            
            <p className="text-[#2C160F]/60 font-medium mb-6 leading-relaxed">
              {isAr 
                ? `هل أنت متأكد من رغبتك في حذف "${lawToDelete.titleAr}"؟ لا يمكن التراجع عن هذا الإجراء.` 
                : `Are you sure you want to delete "${lawToDelete.titleEn}"? This action cannot be undone.`
              }
            </p>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
              >
                {isAr ? "حذف نهائي" : "Delete Permanently"}
              </button>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-[#f5f1eb] text-[#2C160F] py-3 rounded-xl font-bold hover:bg-[#f5f1eb]/80 transition-colors"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
