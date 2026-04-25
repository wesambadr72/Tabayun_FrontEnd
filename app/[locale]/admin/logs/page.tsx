"use client";
import React, { use, useState } from "react";
import {
  History,
  ArrowLeft,
  ArrowRight,
  Search,
  Filter,
  Download,
  Calendar,
  UserCog,
  Gavel,
  Bell,
  Trash2,
  ShieldCheck,
  Edit3,
  PlusCircle,
  Clock,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

// Mock Detailed Logs
const MOCK_LOGS = [
  { id: 101, actionAr: "تعديل قانون المرور", actionEn: "Edit Traffic Law", category: "laws", admin: "Faisal", email: "faisal@tabayun.sa", time: "2024-04-25 10:15 AM", icon: Edit3, color: "text-blue-500", bg: "bg-blue-50" },
  { id: 102, actionAr: "إضافة قانون جديد (نظام العمل)", actionEn: "Add New Law (Labor Law)", category: "laws", admin: "Ahmed", email: "ahmed@tabayun.sa", time: "2024-04-25 09:30 AM", icon: PlusCircle, color: "text-green-500", bg: "bg-green-50" },
  { id: 103, actionAr: "حذف مستخدم (Mohammed Ali)", actionEn: "Delete User (Mohammed Ali)", category: "users", admin: "Sara", email: "sara@tabayun.sa", time: "2024-04-24 04:45 PM", icon: Trash2, color: "text-red-500", bg: "bg-red-50" },
  { id: 104, actionAr: "إرسال إشعار (تحديث الصيانة)", actionEn: "Send Notification (Maintenance Update)", category: "notifications", admin: "System", email: "system@tabayun.sa", time: "2024-04-24 02:00 PM", icon: Bell, color: "text-purple-500", bg: "bg-purple-50" },
  { id: 105, actionAr: "تحديث صلاحيات (John Smith) إلى مشرف", actionEn: "Update Permissions (John Smith) to Admin", category: "users", admin: "Faisal", email: "faisal@tabayun.sa", time: "2024-04-24 11:20 AM", icon: ShieldCheck, color: "text-orange-500", bg: "bg-orange-50" },
  { id: 106, actionAr: "تسجيل دخول للنظام", actionEn: "System Login", category: "system", admin: "Ahmed", email: "ahmed@tabayun.sa", time: "2024-04-24 08:00 AM", icon: UserCog, color: "text-gray-500", bg: "bg-gray-100" },
  { id: 107, actionAr: "تعديل سياسة الخصوصية", actionEn: "Edit Privacy Policy", category: "laws", admin: "Sara", email: "sara@tabayun.sa", time: "2024-04-23 03:10 PM", icon: Edit3, color: "text-blue-500", bg: "bg-blue-50" },
  { id: 108, actionAr: "تصدير قاعدة بيانات المستخدمين", actionEn: "Export Users Database", category: "system", admin: "Faisal", email: "faisal@tabayun.sa", time: "2024-04-23 01:45 PM", icon: Download, color: "text-gray-500", bg: "bg-gray-100" },
];

export default function SystemLogsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredLogs = MOCK_LOGS.filter(log => {
    const matchesSearch = log.actionAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actionEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.admin.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "all" || log.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[#f5f1eb] flex flex-col" dir={dir}>
      <Navbar />

      <div className="flex-1 pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Link
                href={`/${locale}/admin`}
                className="inline-flex items-center gap-2 text-[#3d2e20]/50 hover:text-[#3d2e20] transition-colors mb-4 font-bold text-sm"
              >
                {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {isAr ? "العودة للوحة التحكم" : "Back to Dashboard"}
              </Link>
              <h1 className="text-3xl font-black text-[#3d2e20] flex items-center gap-3 mb-2">
                <History className="w-8 h-8 text-[#3d2e20]/40" />
                {isAr ? "سجل نشاطات النظام" : "System Activity Log"}
              </h1>
              <p className="text-[#3d2e20]/60 font-medium">
                {isAr ? "سجل شامل ومفصل لجميع العمليات والتعديلات التي تمت في المنصة." : "A comprehensive and detailed log of all operations and modifications in the platform."}
              </p>
            </div>

            <button className="bg-white border border-[#3d2e20]/10 text-[#3d2e20] px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#f5f1eb] transition-all shadow-sm">
              <Download className="w-4 h-4" />
              {isAr ? "تصدير السجل (CSV)" : "Export Log (CSV)"}
            </button>
          </div>

          <div className="bg-white rounded-[2rem] border border-[#3d2e20]/5 shadow-xl shadow-[#3d2e20]/5 overflow-hidden">

            {/* Toolbar */}
            <div className="p-6 border-b border-[#3d2e20]/5 bg-[#f5f1eb]/20">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">

                {/* Search */}
                <div className="relative w-full sm:w-96">
                  <Search className={`w-4 h-4 text-[#3d2e20]/40 absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-4' : 'left-4'}`} />
                  <input
                    type="text"
                    placeholder={isAr ? "ابحث في السجل (العملية، المسؤول)..." : "Search logs (Action, Admin)..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full bg-white border border-[#3d2e20]/10 focus:border-[#3d2e20]/30 rounded-xl py-3 px-11 text-sm text-[#3d2e20] outline-none transition-all font-bold shadow-sm`}
                  />
                </div>

                {/* Filters Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all border-2 ${showFilters || selectedCategory !== 'all' ? 'bg-[#3d2e20] text-white border-[#3d2e20]' : 'bg-white text-[#3d2e20] border-[#3d2e20]/10 hover:border-[#3d2e20]/30 shadow-sm'}`}
                >
                  <Filter className="w-4 h-4" />
                  {isAr ? "تصفية السجل" : "Filter Logs"}
                  {showFilters ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                </button>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="mt-4 p-5 bg-white rounded-2xl border border-[#3d2e20]/5 shadow-sm animate-in slide-in-from-top-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${selectedCategory === 'all' ? 'bg-[#3d2e20] text-white border-[#3d2e20]' : 'bg-[#f5f1eb] text-[#3d2e20]/60 border-transparent hover:bg-[#3d2e20]/10'}`}
                  >
                    {isAr ? "الكل" : "All"}
                  </button>
                  <button
                    onClick={() => setSelectedCategory('laws')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border flex items-center gap-2 ${selectedCategory === 'laws' ? 'bg-blue-500 text-white border-blue-500' : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100'}`}
                  >
                    <Gavel className="w-3.5 h-3.5" />
                    {isAr ? "إدارة القوانين" : "Law Management"}
                  </button>
                  <button
                    onClick={() => setSelectedCategory('users')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border flex items-center gap-2 ${selectedCategory === 'users' ? 'bg-orange-500 text-white border-orange-500' : 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100'}`}
                  >
                    <UserCog className="w-3.5 h-3.5" />
                    {isAr ? "إدارة المستخدمين" : "User Management"}
                  </button>
                  <button
                    onClick={() => setSelectedCategory('notifications')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border flex items-center gap-2 ${selectedCategory === 'notifications' ? 'bg-purple-500 text-white border-purple-500' : 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100'}`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    {isAr ? "الإشعارات" : "Notifications"}
                  </button>
                  <button
                    onClick={() => setSelectedCategory('system')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border flex items-center gap-2 ${selectedCategory === 'system' ? 'bg-gray-600 text-white border-gray-600' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'}`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {isAr ? "النظام العام" : "General System"}
                  </button>
                </div>
              )}
            </div>

            {/* Logs List */}
            <div className="divide-y divide-[#3d2e20]/5">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <div key={log.id} className="p-4 sm:p-6 hover:bg-[#f5f1eb]/30 transition-colors flex flex-col md:flex-row md:items-center gap-4 sm:gap-6 group">

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-2xl ${log.bg} ${log.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                      <log.icon className="w-5 h-5" />
                    </div>

                    {/* Action Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-black text-[#3d2e20] mb-1 truncate">
                        {isAr ? log.actionAr : log.actionEn}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#3d2e20] text-white flex items-center justify-center text-[10px] font-bold">
                            {log.admin.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-[#3d2e20]/80">@{log.admin}</span>
                            <span className="text-[#3d2e20]/40 text-xs ml-2 hidden sm:inline-block">({log.email})</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[#3d2e20]/50 font-bold text-xs bg-[#f5f1eb] px-3 py-1 rounded-lg">
                          <Clock className="w-3.5 h-3.5" />
                          {log.time}
                        </div>
                      </div>
                    </div>

                    {/* Status / Category */}
                    <div className="shrink-0 flex items-center justify-between md:justify-end gap-4 w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#3d2e20]/5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${log.bg} ${log.color}`}>
                        {log.category}
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-black">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        {isAr ? "مكتمل" : "Success"}
                      </span>
                    </div>

                  </div>
                ))
              ) : (
                <div className="py-16 text-center text-[#3d2e20]/40">
                  <History className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-xl font-black mb-2">{isAr ? "لا توجد سجلات مطابقة" : "No logs found"}</p>
                  <p className="text-sm font-medium">{isAr ? "حاول تغيير كلمات البحث أو الفلاتر المحددة." : "Try changing search terms or selected filters."}</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
