"use client";
import React, { use } from "react";
import {
  Users,
  FileText,
  Settings,
  BarChart3,
  Database,
  Bell,
  ShieldCheck,
  PlusCircle,
  Clock,
  Edit3,
  Trash2,
  UserMinus,
  UserCog,
  History,
  Send,
  PieChart,
  Search,
  MessageSquare,
  ArrowUpRight,
  Gavel,
  CheckCircle2,
  Activity,
  Loader2,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { adminService } from "@/services/adminService";
import { AdminStats, AdminActivityLog } from "@/types/admin";

export default function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const [stats, setStats] = React.useState<AdminStats | null>(null);
  const [logs, setLogs] = React.useState<AdminActivityLog[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statsData, logsData] = await Promise.all([
          adminService.getStats(),
          adminService.getActivityLogs(0, 5)
        ]);
        setStats(statsData);
        setLogs(logsData);
      } catch (err: any) {
        console.error("Failed to fetch admin dashboard data", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const mainTools = [
    {
      title: isAr ? "إدارة القوانين" : "Law Management",
      desc: isAr ? "التحكم في جميع القوانين والتصنيفات" : "Control all laws and categories",
      icon: Gavel,
      color: "bg-[#2C160F]",
      stats: stats ? `${stats.total_laws} Laws` : "...",
      href: `/${locale}/admin/laws`
    },
    {
      title: isAr ? "إدارة المستخدمين" : "User Management",
      desc: isAr ? "إدارة وتدقيق بيانات المستخدمين" : "Manage and audit user data",
      icon: Database,
      color: "bg-green-600",
      stats: stats ? `${stats.total_users} Users` : "...",
      href: `/${locale}/admin/users`
    },
    {
      title: isAr ? "المساعد الذكي" : "AI Assistant",
      desc: isAr ? "تحديث القاعدة المعرفية للذكاء الاصطناعي" : "Update AI knowledge base",
      icon: MessageSquare,
      color: "bg-purple-600",
      stats: stats ? `${stats.total_categories} Categories` : "...",
      href: `/${locale}/admin/ai-settings`
    },
    {
      title: isAr ? "إدارة الإشعارات" : "Notifications",
      desc: isAr ? "إرسال الإشعارات وعرض السجل" : "Send notifications and view log",
      icon: Bell,
      color: "bg-orange-500",
      stats: isAr ? "إرسال تنبيهات" : "Send Alerts",
      href: `/${locale}/admin/notifications`
    }
  ];

  const getLogIcon = (action: string) => {
    if (action.includes("law")) return Edit3;
    if (action.includes("user")) return UserCog;
    if (action.includes("notification")) return Send;
    return Activity;
  };

  return (
    <main className="min-h-screen bg-[#f5f1eb] flex flex-col" dir={dir}>
      <Navbar />

      <div className="flex flex-1 pt-24">
        {/* Sidebar Removed entirely */}

        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-[#2C160F] mb-1">
                  {isAr ? "لوحة التحكم" : "Dashboard"}
                </h1>
                <p className="text-[#2C160F]/50 font-medium text-sm">
                  {isAr ? "إدارة المنصة والتحكم في المحتوى" : "Platform management and content control"}
                </p>
              </div>
            </div>

            {/* 4 Main Squares in Center */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {mainTools.map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="group bg-white p-8 rounded-[2.5rem] border border-[#2C160F]/5 shadow-xl shadow-[#2C160F]/5 hover:shadow-2xl hover:shadow-[#2C160F]/10 transition-all duration-500 flex flex-col items-center text-center cursor-pointer relative overflow-hidden"
                >
                  <tool.icon className="absolute -right-6 -bottom-6 w-32 h-32 text-[#2C160F]/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />

                  <div className={`w-16 h-16 rounded-[1.5rem] ${tool.color} text-white flex items-center justify-center mb-5 shadow-lg transform group-hover:scale-110 transition-transform duration-500`}>
                    <tool.icon className="w-8 h-8" />
                  </div>

                  <h3 className="text-xl font-black text-[#2C160F] mb-2">{tool.title}</h3>
                  <p className="text-[#2C160F]/50 text-sm font-medium mb-4 max-w-[180px] leading-relaxed">{tool.desc}</p>

                  <div className="mt-auto flex items-center gap-2 bg-[#f5f1eb] px-4 py-2 rounded-full">
                    <span className="text-[10px] font-black text-[#2C160F] uppercase tracking-widest">{tool.stats}</span>
                    <ArrowUpRight className="w-2.5 h-2.5 text-[#2C160F]/30" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Recent Logs Section (Moved from Sidebar) */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-[#2C160F]/5 shadow-xl shadow-[#2C160F]/5">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-black text-[#2C160F] flex items-center gap-2">
                    <History className="w-5 h-5 text-[#2C160F]/40" />
                    {isAr ? "سجل النشاطات الأخير" : "Recent Activity Log"}
                  </h2>
                  <p className="text-[#2C160F]/40 text-xs font-medium mt-1">
                    {isAr ? "متابعة آخر التعديلات والعمليات في النظام" : "Track the latest changes and operations in the system"}
                  </p>
                </div>
                <Link href={`/${locale}/admin/logs`} className="bg-[#f5f1eb] text-[#2C160F] px-4 py-2 rounded-xl text-xs font-black hover:bg-[#2C160F] hover:text-white transition-all">
                  {isAr ? "عرض الكل" : "View All"}
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4">
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-[#2C160F]/20" />
                </div>
              ) : error ? (
                <div className="py-10 text-center text-red-500 font-bold bg-red-50 rounded-2xl border border-red-100 p-4">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  {isAr ? "عذراً، فشل تحميل البيانات. تأكد من اتصالك بالخادم." : "Sorry, failed to load data. Please check your connection."}
                  <p className="text-[10px] mt-1 opacity-60 font-mono">{error}</p>
                </div>
              ) : logs.length > 0 ? (
                logs.map((log, i) => {
                    const Icon = getLogIcon(log.action);
                    return (
                      <div key={i} className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-[#f5f1eb]/50 transition-all border border-transparent hover:border-[#2C160F]/5">
                        <div className="w-12 h-12 rounded-xl bg-[#f5f1eb] text-[#2C160F]/40 flex items-center justify-center group-hover:bg-[#2C160F] group-hover:text-white transition-all shadow-sm">
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-bold text-[#2C160F] truncate">{log.action}</h4>
                            <span className="text-[10px] font-black text-[#2C160F]/20 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(log.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            <p className="text-[11px] font-medium text-[#2C160F]/40 italic">
                              {isAr ? "بواسطة" : "By"} <span className="text-[#2C160F]/60 font-bold not-italic">Admin #{log.admin_id}</span>
                            </p>
                          </div>
                        </div>

                        <div className="hidden sm:block">
                          <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {log.action}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-10 text-center text-[#2C160F]/20 font-bold uppercase tracking-widest text-xs">
                    {isAr ? "لا يوجد سجلات حالياً" : "No logs available"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(44, 22, 15, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(44, 22, 15, 0.2);
        }
      `}</style>
    </main>
  );
}
