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
  Activity
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const sidebarLinks = [
    { title: isAr ? "حذف مستخدم" : "Delete User", icon: UserMinus, href: `/${locale}/admin/users/delete`, color: "text-red-600" },
    { title: isAr ? "تعديل صلاحية مستخدم" : "Edit User Permission", icon: UserCog, href: `/${locale}/admin/users/permissions`, color: "text-orange-600" },
    { title: isAr ? "إرسال إشعارات" : "Send Notifications", icon: Send, href: `/${locale}/admin/notifications`, color: "text-purple-600" },
  ];

  const recentLogs = [
    { action: isAr ? "تعديل قانون المرور" : "Edit Traffic Law", admin: "Faisal", time: "2m", icon: Edit3 },
    { action: isAr ? "إضافة قانون جديد" : "Add New Law", admin: "Ahmed", time: "15m", icon: PlusCircle },
    { action: isAr ? "حذف مستخدم" : "Delete User", admin: "Sara", time: "1h", icon: UserMinus },
    { action: isAr ? "إرسال إشعار عام" : "Send Broadcast", admin: "System", time: "3h", icon: Send },
    { action: isAr ? "تحديث الصلاحيات" : "Update Permissions", admin: "Faisal", time: "5h", icon: UserCog },
  ];

  const mainTools = [
    {
      title: isAr ? "إدارة القوانين" : "Law Management",
      desc: isAr ? "التحكم في جميع القوانين والتصنيفات" : "Control all laws and categories",
      icon: Gavel,
      color: "bg-[#3d2e20]",
      stats: "452 Laws",
      href: `/${locale}/admin/laws`
    },
    {
      title: isAr ? "إدارة الإشعارات" : "Notifications",
      desc: isAr ? "إرسال الإشعارات وعرض السجل" : "Send notifications and view log",
      icon: Bell,
      color: "bg-orange-500",
      stats: "Send Alerts",
      href: `/${locale}/admin/notifications`
    },
    {
      title: isAr ? "المساعد الذكي" : "AI Assistant",
      desc: isAr ? "تحديث القاعدة المعرفية للذكاء الاصطناعي" : "Update AI knowledge base",
      icon: MessageSquare,
      color: "bg-purple-600",
      stats: "98% Accuracy",
      href: "#"
    },
    {
      title: isAr ? "قاعدة البيانات" : "Database Admin",
      desc: isAr ? "إدارة وتدقيق بيانات المستخدمين" : "Manage and audit user data",
      icon: Database,
      color: "bg-green-600",
      stats: "1.2GB Size",
      href: `/${locale}/admin/database`
    }
  ];

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
                <h1 className="text-3xl font-black text-[#3d2e20] mb-1">
                  {isAr ? "لوحة التحكم" : "Dashboard"}
                </h1>
                <p className="text-[#3d2e20]/50 font-medium text-sm">
                  {isAr ? "إدارة المنصة والتحكم في المحتوى" : "Platform management and content control"}
                </p>
              </div>
              <div className="bg-[#3d2e20] px-5 py-3 rounded-2xl text-white hidden sm:flex items-center gap-3 shadow-xl shadow-[#3d2e20]/20">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">A</div>
                <div className="min-w-0 text-start">
                  <p className="text-[10px] font-bold opacity-60 truncate">admin@tabayun.sa</p>
                  <p className="text-xs font-black truncate">{isAr ? "المسؤول" : "Administrator"}</p>
                </div>
              </div>
            </div>

            {/* 4 Main Squares in Center */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {mainTools.map((tool, i) => (
                <Link
                  key={i}
                  href={tool.href}
                  className="group bg-white p-8 rounded-[2.5rem] border border-[#3d2e20]/5 shadow-xl shadow-[#3d2e20]/5 hover:shadow-2xl hover:shadow-[#3d2e20]/10 transition-all duration-500 flex flex-col items-center text-center cursor-pointer relative overflow-hidden"
                >
                  <tool.icon className="absolute -right-6 -bottom-6 w-32 h-32 text-[#3d2e20]/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />

                  <div className={`w-16 h-16 rounded-[1.5rem] ${tool.color} text-white flex items-center justify-center mb-5 shadow-lg transform group-hover:scale-110 transition-transform duration-500`}>
                    <tool.icon className="w-8 h-8" />
                  </div>

                  <h3 className="text-xl font-black text-[#3d2e20] mb-2">{tool.title}</h3>
                  <p className="text-[#3d2e20]/50 text-sm font-medium mb-4 max-w-[180px] leading-relaxed">{tool.desc}</p>

                  <div className="mt-auto flex items-center gap-2 bg-[#f5f1eb] px-4 py-2 rounded-full">
                    <span className="text-[10px] font-black text-[#3d2e20] uppercase tracking-widest">{tool.stats}</span>
                    <ArrowUpRight className="w-2.5 h-2.5 text-[#3d2e20]/30" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Recent Logs Section (Moved from Sidebar) */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-[#3d2e20]/5 shadow-xl shadow-[#3d2e20]/5">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-black text-[#3d2e20] flex items-center gap-2">
                    <History className="w-5 h-5 text-[#3d2e20]/40" />
                    {isAr ? "سجل النشاطات الأخير" : "Recent Activity Log"}
                  </h2>
                  <p className="text-[#3d2e20]/40 text-xs font-medium mt-1">
                    {isAr ? "متابعة آخر التعديلات والعمليات في النظام" : "Track the latest changes and operations in the system"}
                  </p>
                </div>
                <Link href={`/${locale}/admin/logs`} className="bg-[#f5f1eb] text-[#3d2e20] px-4 py-2 rounded-xl text-xs font-black hover:bg-[#3d2e20] hover:text-white transition-all">
                  {isAr ? "عرض الكل" : "View All"}
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {recentLogs.map((log, i) => (
                  <div key={i} className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-[#f5f1eb]/50 transition-all border border-transparent hover:border-[#3d2e20]/5">
                    <div className="w-12 h-12 rounded-xl bg-[#f5f1eb] text-[#3d2e20]/40 flex items-center justify-center group-hover:bg-[#3d2e20] group-hover:text-white transition-all shadow-sm">
                      <log.icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-bold text-[#3d2e20] truncate">{log.action}</h4>
                        <span className="text-[10px] font-black text-[#3d2e20]/20 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {log.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        <p className="text-[11px] font-medium text-[#3d2e20]/40 italic">
                          {isAr ? "بواسطة" : "By"} <span className="text-[#3d2e20]/60 font-bold not-italic">@{log.admin}</span>
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:block">
                      <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {isAr ? "مكتمل" : "Success"}
                      </div>
                    </div>
                  </div>
                ))}
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
          background: rgba(61, 46, 32, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(61, 46, 32, 0.2);
        }
      `}</style>
    </main>
  );
}
