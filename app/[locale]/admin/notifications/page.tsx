"use client";
import React, { use, useState, useEffect } from "react";
import {
  Bell,
  ArrowLeft,
  ArrowRight,
  Send,
  Users,
  History,
  CheckCircle2,
  AlertCircle,
  X,
  Mail,
  Clock,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { adminService } from "@/services/adminService";

export default function NotificationsAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    target: "all",
    target_user_id: ""
  });

  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  // UI States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // We can fetch recent admin logs or notifications here if backend supports it
    setLoadingLogs(false);
  }, []);

  const isFormValid = formData.title.trim() !== "" && formData.message.trim() !== "";

  const handleSendClick = () => {
    if (isFormValid) {
      setShowConfirmModal(true);
    }
  };

  const confirmSend = async () => {
    try {
      setIsSubmitting(true);

      const payload = {
        title: formData.title,
        content: formData.message,
        target_user_id: formData.target === "all" ? null : Number(formData.target_user_id)
      };

      await adminService.sendNotification(payload);

      setIsSubmitting(false);
      setShowConfirmModal(false);
      setShowSuccessToast(true);

      // Reset form
      setFormData({ title: "", message: "", target: "all", target_user_id: "" });

      // Hide toast after 3s
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (err) {
      console.error("Failed to send notification", err);
      alert(isAr ? "فشل إرسال الإشعار" : "Failed to send notification");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f1eb] flex flex-col" dir={dir}>
      <Navbar />

      <div className="flex-1 pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <Link
              href={`/${locale}/admin`}
              className="inline-flex items-center gap-2 text-[#2C160F]/50 hover:text-[#2C160F] transition-colors mb-4 font-bold text-sm"
            >
              {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {isAr ? "العودة للوحة التحكم" : "Back to Dashboard"}
            </Link>
            <h1 className="text-3xl font-black text-[#2C160F] flex items-center gap-3 mb-2">
              <Bell className="w-8 h-8 text-[#2C160F]/40" />
              {isAr ? "إدارة الإشعارات" : "Notifications Management"}
            </h1>
            <p className="text-[#2C160F]/60 font-medium">
              {isAr ? "إرسال إشعارات جماعية للمستخدمين ومتابعة السجل الخاص بها." : "Send mass notifications to users and track their history."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Form Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[2rem] border border-[#2C160F]/5 shadow-xl shadow-[#2C160F]/5 p-6 sticky top-32">
                <h2 className="text-xl font-black text-[#2C160F] flex items-center gap-2 mb-6 pb-4 border-b border-[#2C160F]/5">
                  <Send className="w-5 h-5 text-purple-500" />
                  {isAr ? "إرسال إشعار جديد" : "Send New Notification"}
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-[#2C160F] mb-2">
                      {isAr ? "عنوان الإشعار" : "Notification Title"}
                    </label>
                    <input
                      type="text"
                      placeholder={isAr ? "مثال: تحديث جديد للنظام..." : "e.g. New system update..."}
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-[#f5f1eb]/50 border border-transparent focus:border-[#2C160F]/20 rounded-xl py-3 px-4 text-sm text-[#2C160F] outline-none transition-all font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#2C160F] mb-2">
                      {isAr ? "الجمهور المستهدف" : "Target Audience"}
                    </label>
                    <div className="relative mb-4">
                      <Users className={`w-4 h-4 text-[#2C160F]/40 absolute top-1/2 -translate-y-1/2 pointer-events-none ${isAr ? 'right-4' : 'left-4'}`} />
                      <select
                        value={formData.target}
                        onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                        className={`w-full bg-[#f5f1eb]/50 border border-transparent focus:border-[#2C160F]/20 rounded-xl py-3 ${isAr ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm text-[#2C160F] outline-none appearance-none cursor-pointer font-bold`}
                      >
                        <option value="all">{isAr ? "جميع المستخدمين" : "All Users"}</option>
                        <option value="specific">{isAr ? "مستخدم محدد (User ID)" : "Specific User (ID)"}</option>
                      </select>
                    </div>

                    {formData.target === "specific" && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <input
                          type="number"
                          placeholder={isAr ? "أدخل ID المستخدم..." : "Enter User ID..."}
                          value={formData.target_user_id}
                          onChange={(e) => setFormData({ ...formData, target_user_id: e.target.value })}
                          className="w-full bg-[#f5f1eb]/50 border border-transparent focus:border-[#2C160F]/20 rounded-xl py-3 px-4 text-sm text-[#2C160F] outline-none transition-all font-bold"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#2C160F] mb-2">
                      {isAr ? "نص الإشعار" : "Notification Message"}
                    </label>
                    <textarea
                      rows={5}
                      placeholder={isAr ? "اكتب تفاصيل الإشعار هنا..." : "Write notification details here..."}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#f5f1eb]/50 border border-transparent focus:border-[#2C160F]/20 rounded-xl py-3 px-4 text-sm text-[#2C160F] outline-none transition-all font-medium resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSendClick}
                    disabled={!isFormValid}
                    className="w-full bg-[#2C160F] text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-[#2C160F]/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    <Send className="w-5 h-5" />
                    {isAr ? "إرسال الإشعار الآن" : "Send Notification Now"}
                  </button>
                </div>
              </div>
            </div>

            {/* Logs Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[2rem] border border-[#2C160F]/5 shadow-xl shadow-[#2C160F]/5 overflow-hidden">
                <div className="p-6 border-b border-[#2C160F]/5 bg-[#f5f1eb]/30">
                  <h2 className="text-xl font-black text-[#2C160F] flex items-center gap-2">
                    <History className="w-5 h-5 text-[#2C160F]/40" />
                    {isAr ? "سجل الإشعارات المرسلة" : "Sent Notifications Log"}
                  </h2>
                </div>

                <div className="p-6">
                  {logs.length > 0 ? (
                    <div className="space-y-4">
                      {logs.map((log) => (
                        <div key={log.id} className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border border-[#2C160F]/5 hover:bg-[#f5f1eb]/20 transition-all group">
                          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 shrink-0 group-hover:scale-110 transition-transform">
                            <Bell className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-black text-[#2C160F] text-lg mb-1">{isAr ? log.titleAr : log.titleEn}</h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-[#2C160F]/50">
                              <span className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5" />
                                {log.target === 'all' && (isAr ? "الجميع" : "All")}
                                {log.target === 'users' && (isAr ? "المستخدمين" : "Users")}
                                {log.target === 'admins' && (isAr ? "المشرفين" : "Admins")}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {log.date}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5" />
                                {isAr ? "بواسطة:" : "By:"} {log.sentBy}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-start sm:justify-end shrink-0">
                            <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                              <CheckCircle2 className="w-3 h-3" />
                              {isAr ? "تم الإرسال" : "Sent"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-[#2C160F]/40">
                      <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p className="text-lg font-bold">{isAr ? "لا يوجد سجل للإشعارات بعد" : "No notifications log yet"}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C160F]/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative">
            <button
              onClick={() => !isSubmitting && setShowConfirmModal(false)}
              className="absolute top-6 right-6 p-2 text-[#2C160F]/40 hover:text-[#2C160F] transition-colors rounded-full hover:bg-[#f5f1eb]"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-6 text-orange-500 mx-auto">
              <AlertCircle className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black text-[#2C160F] mb-2 text-center">
              {isAr ? "تأكيد إرسال الإشعار" : "Confirm Sending"}
            </h3>

            <p className="text-[#2C160F]/60 font-bold mb-8 text-center leading-relaxed">
              {isAr
                ? `هل أنت متأكد أنك تريد إرسال هذا الإشعار إلى ${formData.target === 'all' ? 'جميع المستخدمين' : formData.target === 'admins' ? 'المشرفين فقط' : 'المستخدمين العاديين'}؟`
                : `Are you sure you want to send this notification to ${formData.target === 'all' ? 'all users' : formData.target === 'admins' ? 'admins only' : 'regular users'}?`
              }
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={confirmSend}
                disabled={isSubmitting}
                className="flex-1 bg-[#2C160F] text-white py-4 rounded-xl font-black hover:bg-[#2C160F]/90 transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {isAr ? "نعم، أرسل الآن" : "Yes, Send Now"}
                  </>
                )}
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="flex-1 bg-[#f5f1eb] text-[#2C160F] py-4 rounded-xl font-black hover:bg-[#f5f1eb]/80 transition-colors"
              >
                {isAr ? "تراجع" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 font-bold">
            <CheckCircle2 className="w-6 h-6" />
            {isAr ? "تم إرسال الإشعار بنجاح!" : "Notification sent successfully!"}
          </div>
        </div>
      )}

    </main>
  );
}
