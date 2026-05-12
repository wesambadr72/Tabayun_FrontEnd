"use client";
import React, { use, useState, useEffect } from "react";
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
  ChevronUp,
  Loader2
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { adminService } from "@/services/adminService";
import { AdminActivityLog } from "@/types/admin";

export default function SystemLogsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const [logs, setLogs] = useState<AdminActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await adminService.getActivityLogs();
        setLogs(data);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = (log.action || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || log.target_type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getLogMeta = (action: string) => {
    let Icon = History;
    let bg = "bg-gray-50";
    let text = "text-gray-500";

    if (action.includes("law")) Icon = Gavel;
    else if (action.includes("user")) Icon = UserCog;
    else if (action.includes("notification")) Icon = Bell;

    if (action.includes("delete")) {
      bg = "bg-red-50";
      text = "text-red-500";
    } else if (action.includes("add") || action.includes("create")) {
      bg = "bg-green-50";
      text = "text-green-500";
    } else if (action.includes("update") || action.includes("edit")) {
      bg = "bg-blue-50";
      text = "text-blue-500";
    }

    return { Icon, bg, text };
  };

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
                className="inline-flex items-center gap-2 text-[#2C160F]/50 hover:text-[#2C160F] transition-colors mb-4 font-bold text-sm"
              >
                {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {isAr ? "العودة للوحة التحكم" : "Back to Dashboard"}
              </Link>
              <h1 className="text-3xl font-black text-[#2C160F] flex items-center gap-3 mb-2">
                <History className="w-8 h-8 text-[#2C160F]/40" />
                {isAr ? "سجل نشاطات النظام" : "System Activity Log"}
              </h1>
              <p className="text-[#2C160F]/60 font-medium">
                {isAr ? "سجل شامل ومفصل لجميع العمليات والتعديلات التي تمت في المنصة." : "A comprehensive and detailed log of all operations and modifications in the platform."}
              </p>
            </div>

            <button className="bg-white border border-[#2C160F]/10 text-[#2C160F] px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#f5f1eb] transition-all shadow-sm">
              <Download className="w-4 h-4" />
              {isAr ? "تصدير السجل (CSV)" : "Export Log (CSV)"}
            </button>
          </div>

          <div className="bg-white rounded-[2rem] border border-[#2C160F]/5 shadow-xl shadow-[#2C160F]/5 overflow-hidden">

            {/* Toolbar */}
            <div className="p-6 border-b border-[#2C160F]/5 bg-[#f5f1eb]/20">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">

                {/* Search */}
                <div className="relative w-full sm:w-96">
                  <Search className={`w-4 h-4 text-[#2C160F]/40 absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-4' : 'left-4'}`} />
                  <input
                    type="text"
                    placeholder={isAr ? "ابحث في السجل (العملية، المسؤول)..." : "Search logs (Action, Admin)..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full bg-white border border-[#2C160F]/10 focus:border-[#2C160F]/30 rounded-xl py-3 px-11 text-sm text-[#2C160F] outline-none transition-all font-bold shadow-sm`}
                  />
                </div>

                {/* Filters Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all border-2 ${showFilters || selectedCategory !== 'all' ? 'bg-[#2C160F] text-white border-[#2C160F]' : 'bg-white text-[#2C160F] border-[#2C160F]/10 hover:border-[#2C160F]/30 shadow-sm'}`}
                >
                  <Filter className="w-4 h-4" />
                  {isAr ? "تصفية السجل" : "Filter Logs"}
                  {showFilters ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                </button>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="mt-4 p-5 bg-white rounded-2xl border border-[#2C160F]/5 shadow-sm animate-in slide-in-from-top-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${selectedCategory === 'all' ? 'bg-[#2C160F] text-white border-[#2C160F]' : 'bg-[#f5f1eb] text-[#2C160F]/60 border-transparent hover:bg-[#2C160F]/10'}`}
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
            <div className="divide-y divide-[#2C160F]/5">
              {loading ? (
                <div className="py-20 text-center">
                  <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#2C160F]/20" />
                </div>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const { Icon, bg, text } = getLogMeta(log.action);
                  return (
                    <div key={log.id} className="p-4 sm:p-6 hover:bg-[#f5f1eb]/30 transition-colors flex flex-col md:flex-row md:items-center gap-4 sm:gap-6 group">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-2xl ${bg} ${text} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Action Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-black text-[#2C160F] mb-1 truncate">
                          {log.action}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#2C160F] text-white flex items-center justify-center text-[10px] font-bold">
                              A
                            </div>
                            <div>
                              <span className="font-bold text-[#2C160F]/80">Admin #{log.admin_id}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-[#2C160F]/50 font-bold text-xs bg-[#f5f1eb] px-3 py-1 rounded-lg">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(log.created_at).toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')}
                          </div>
                        </div>
                      </div>

                      {/* Status / Category */}
                      <div className="shrink-0 flex items-center justify-between md:justify-end gap-4 w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#2C160F]/5">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${bg} ${text}`}>
                          {log.target_type}
                        </span>
                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-black">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          {isAr ? "مكتمل" : "Success"}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-16 text-center text-[#2C160F]/40">
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
