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
  X,
  Loader2,
  Globe
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { adminService } from "@/services/adminService";
import { Law } from "@/types/law";
import { useDebounce } from "@/hooks/useDebounce";

export default function AdminLawsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const [laws, setLaws] = useState<Law[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [filterCategory, setFilterCategory] = useState("all");
  const [skip, setSkip] = useState(0);
  const limit = 25; // Updated to 25 per page as requested

  const [totalCount, setTotalCount] = useState(0); // For pagination UI

  const categoryNames: Record<number, string> = {
    1: isAr ? "المرور" : "Traffic",
    2: isAr ? "العمل والعقود" : "Work & Contracts",
    3: isAr ? "الآداب العامة" : "Public Decency",
    4: isAr ? "الإقامة والتأشيرات" : "Residency & Visas",
    5: isAr ? "المأكولات" : "Food",
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lawToDelete, setLawToDelete] = useState<Law | null>(null);
  const [selectedLawIds, setSelectedLawIds] = useState<number[]>([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (law: Law) => {
    setLawToDelete(law);
    setShowDeleteModal(true);
  };

  const fetchLaws = async () => {
    try {
      setLoading(true);
      const [lawsData, statsData] = await Promise.all([
        adminService.getLaws(skip, limit, debouncedSearchTerm),
        adminService.getStats()
      ]);
      setLaws(lawsData);
      setTotalCount(statsData.total_laws);
    } catch (err: any) {
      setError(err.message || "Failed to fetch laws");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  const goToPage = (page: number) => {
    setSkip((page - 1) * limit);
  };

  useEffect(() => {
    setSkip(0); // Reset pagination when searching
  }, [debouncedSearchTerm, filterCategory]);

  useEffect(() => {
    fetchLaws();
  }, [skip, debouncedSearchTerm]);

  const confirmDelete = async () => {
    if (!lawToDelete) return;
    try {
      setIsDeleting(true);
      await adminService.deleteLaw(lawToDelete.id);
      setLaws(laws.filter(l => l.id !== lawToDelete.id));
      setSelectedLawIds(prev => prev.filter(id => id !== lawToDelete.id));
      setShowDeleteModal(false);
      setLawToDelete(null);
    } catch (err: any) {
      alert(isAr ? "فشل حذف القانون" : "Failed to delete law");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedLawIds.length === 0) return;
    try {
      setIsDeleting(true);
      await adminService.bulkDeleteLaws(selectedLawIds);
      setLaws(laws.filter(l => !selectedLawIds.includes(l.id)));
      setSelectedLawIds([]);
      setShowBulkDeleteModal(false);
    } catch (err: any) {
      console.error("Failed to delete laws", err);
      alert(isAr ? "فشل حذف القوانين" : "Failed to delete laws");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedLawIds.length === laws.length) {
      setSelectedLawIds([]);
    } else {
      setSelectedLawIds(laws.map(l => l.id));
    }
  };

  const toggleSelectLaw = (id: number) => {
    setSelectedLawIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

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
                <option value="1">{isAr ? "المرور" : "Traffic"}</option>
                <option value="2">{isAr ? "العمل والعقود" : "Work & Contracts"}</option>
                <option value="3">{isAr ? "الآداب العامة" : "Public Decency"}</option>
                <option value="4">{isAr ? "الإقامة والتأشيرات" : "Residency & Visas"}</option>
                <option value="5">{isAr ? "المأكولات" : "Food"}</option>
              </select>
            </div>
          </div>

          {/* Laws Table / List */}
          <div className="bg-white rounded-3xl border border-[#2C160F]/5 shadow-xl shadow-[#2C160F]/5 overflow-hidden relative">
            {selectedLawIds.length > 0 && (
              <div className="absolute top-0 inset-x-0 bg-[#2C160F] text-white p-4 flex items-center justify-between z-20 animate-in slide-in-from-top duration-300">
                <p className="text-sm font-bold">
                  {isAr ? `تم تحديد ${selectedLawIds.length} قانون` : `${selectedLawIds.length} laws selected`}
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowBulkDeleteModal(true)}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-xs font-black transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isAr ? "حذف المحددين" : "Delete Selected"}
                  </button>
                  <button 
                    onClick={() => setSelectedLawIds([])}
                    className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-black transition-colors"
                  >
                    {isAr ? "إلغاء" : "Cancel"}
                  </button>
                </div>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" dir={dir}>
                <thead>
                  <tr className="bg-[#f5f1eb]/50 border-b border-[#2C160F]/5 text-[#2C160F]/60 text-xs uppercase tracking-widest font-black">
                    <th className="p-4 sm:p-6 text-start w-12">
                      <input 
                        type="checkbox" 
                        checked={laws.length > 0 && selectedLawIds.length === laws.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-[#2C160F]/20 accent-[#2C160F]"
                      />
                    </th>
                    <th className="p-4 sm:p-6 text-start">{isAr ? "العنوان" : "Title"}</th>
                    <th className="p-4 sm:p-6 text-start">{isAr ? "التصنيف" : "Category"}</th>
                    <th className="p-4 sm:p-6 text-start">{isAr ? "تاريخ الإضافة" : "Date Added"}</th>
                    <th className="p-4 sm:p-6 text-start">{isAr ? "الحالة" : "Status"}</th>
                    <th className="p-4 sm:p-6 text-end">{isAr ? "الإجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2C160F]/5">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center">
                        <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#2C160F]/20" />
                      </td>
                    </tr>
                  ) : laws.length > 0 ? (
                    laws.map((law) => (
                      <tr key={law.id} className={`hover:bg-[#f5f1eb]/20 transition-colors group ${selectedLawIds.includes(law.id) ? 'bg-[#f5f1eb]/40' : ''}`}>
                        <td className="p-4 sm:p-6">
                          <input 
                            type="checkbox" 
                            checked={selectedLawIds.includes(law.id)}
                            onChange={() => toggleSelectLaw(law.id)}
                            className="w-4 h-4 rounded border-[#2C160F]/20 accent-[#2C160F]"
                          />
                        </td>
                        <td className="p-4 sm:p-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#f5f1eb] flex items-center justify-center text-[#2C160F]/40 group-hover:bg-[#2C160F] group-hover:text-white transition-colors">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-[#2C160F]">{law.title}</p>
                              <p className="text-xs text-[#2C160F]/40 font-medium">ID: {law.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 sm:p-6">
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-2 bg-[#2C160F]/5 text-[#2C160F] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider w-fit">
                              {categoryNames[law.category_id] || (isAr ? "عام" : "General")}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-[#2C160F]/40 text-[10px] font-bold px-1">
                              <Globe className="w-2.5 h-2.5" />
                              {law.country}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 sm:p-6 text-[#2C160F]/60 font-medium text-sm">
                          {law.article_number || "-"}
                        </td>
                        <td className="p-4 sm:p-6">
                          <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-xs font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                            {isAr ? "نشط" : "Active"}
                          </span>
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

            {/* Pagination Controls */}
            <div className="p-4 sm:p-6 bg-[#f5f1eb]/30 border-t border-[#2C160F]/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs font-bold text-[#2C160F]/40 uppercase tracking-widest">
                {isAr 
                  ? `عرض ${laws.length} من أصل ${totalCount} قانون` 
                  : `Showing ${laws.length} of ${totalCount} laws`}
              </p>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="p-2 rounded-xl bg-white border border-[#2C160F]/10 text-[#2C160F] hover:bg-[#2C160F] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#2C160F]"
                >
                  {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                </button>

                <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none px-2 py-1 no-scrollbar">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`min-w-[40px] h-10 rounded-xl font-black text-sm transition-all border ${
                          currentPage === pageNum
                            ? "bg-[#2C160F] text-white border-[#2C160F] shadow-lg scale-110 z-10"
                            : "bg-white text-[#2C160F] border-[#2C160F]/10 hover:border-[#2C160F]/30 hover:scale-105"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className="p-2 rounded-xl bg-white border border-[#2C160F]/10 text-[#2C160F] hover:bg-[#2C160F] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#2C160F]"
                >
                  {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>

              {totalPages > 5 && (
                <div className="hidden lg:block">
                  <p className="text-[10px] font-black text-[#2C160F]/30 uppercase tracking-tighter">
                    {isAr ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
                  </p>
                </div>
              )}
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
                ? `هل أنت متأكد من رغبتك في حذف "${lawToDelete.title}"؟ لا يمكن التراجع عن هذا الإجراء.` 
                : `Are you sure you want to delete "${lawToDelete.title}"? This action cannot be undone.`
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

      {/* Bulk Delete Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#2C160F]/40 backdrop-blur-sm" onClick={() => !isDeleting && setShowBulkDeleteModal(false)}></div>
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full relative z-10 shadow-2xl border border-[#2C160F]/5">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-black text-[#2C160F] mb-2">
              {isAr ? "حذف جماعي؟" : "Bulk Delete?"}
            </h3>
            <p className="text-[#2C160F]/60 font-medium mb-8">
              {isAr 
                ? `هل أنت متأكد من حذف ${selectedLawIds.length} قانون؟ هذا الإجراء لا يمكن التراجع عنه وسيتم مسح كافة البيانات المرتبطة بها.` 
                : `Are you sure you want to delete ${selectedLawIds.length} laws? This action cannot be undone.`}
            </p>
            <div className="flex gap-3">
              <button
                disabled={isDeleting}
                onClick={handleBulkDelete}
                className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {isAr ? "تأكيد الحذف الجماعي" : "Confirm Bulk Delete"}
              </button>
              <button
                disabled={isDeleting}
                onClick={() => setShowBulkDeleteModal(false)}
                className="flex-1 bg-[#f5f1eb] text-[#2C160F] py-4 rounded-2xl font-black text-sm hover:bg-[#e6d7c8] transition-all"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
