"use client";
import React, { use, useState, useEffect, useMemo } from "react";
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
  Search,
  Check,
  Trash2,
  Edit2,
  Loader2,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { adminService } from "@/services/adminService";
import { UserAdmin } from "@/types/admin";
import { Toast, useToast } from "@/components/ui/Toast";

export default function NotificationsAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  // Data States
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    target: "all",
    target_user_ids: [] as number[]
  });

  // UI States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { message, type, isVisible, showToast, hideToast } = useToast();
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLogIds, setSelectedLogIds] = useState<number[]>([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingUsers(true);
        setLoadingLogs(true);
        const [usersData, notificationsData] = await Promise.all([
          adminService.getUsers(0, 1000),
          adminService.getNotifications(0, 50)
        ]);
        setUsers(usersData);
        setLogs(notificationsData);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoadingUsers(false);
        setLoadingLogs(false);
      }
    };
    fetchData();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      (u.full_name || u.name || u.username || "").toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.id.toString().includes(userSearchTerm)
    );
  }, [users, userSearchTerm]);

  const isFormValid = formData.title.trim() !== "" && 
                     formData.message.trim() !== "" && 
                     (formData.target === "all" || formData.target_user_ids.length > 0);

  const toggleUserSelection = (userId: number) => {
    setFormData(prev => ({
      ...prev,
      target_user_ids: prev.target_user_ids.includes(userId)
        ? prev.target_user_ids.filter(id => id !== userId)
        : [...prev.target_user_ids, userId]
    }));
  };

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
        target_user_ids: formData.target === "all" ? null : formData.target_user_ids
      };

      await adminService.sendNotification(payload);

      // Notify other components (like Navbar) to refresh
      window.dispatchEvent(new CustomEvent('notificationsUpdated'));

      // Refresh logs
      const notificationsData = await adminService.getNotifications(0, 50);
      setLogs(notificationsData);

      setIsSubmitting(false);
      setShowConfirmModal(false);
      showToast(isAr ? "تم إرسال الإشعار بنجاح" : "Notification sent successfully", "success");

      // Reset form
      setFormData({ title: "", message: "", target: "all", target_user_ids: [] });
    } catch (err) {
      console.error("Failed to send notification", err);
      showToast(isAr ? "فشل إرسال الإشعار" : "Failed to send notification", "error");
      setIsSubmitting(false);
    }
  };

  const handleDeleteNotification = async () => {
    if (!selectedNotification) return;
    try {
      setIsSubmitting(true);
      await adminService.deleteNotification(selectedNotification.id);
      
      // Notify other components (like Navbar) to refresh
      window.dispatchEvent(new CustomEvent('notificationsUpdated'));

      setLogs(prev => prev.filter(n => n.id !== selectedNotification.id));
      setShowDeleteModal(false);
      setSelectedNotification(null);
      showToast(isAr ? "تم حذف الإشعار بنجاح" : "Notification deleted successfully", "success");
    } catch (err) {
      showToast(isAr ? "فشل حذف الإشعار" : "Failed to delete notification", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSelectLog = (logId: number) => {
    setSelectedLogIds(prev => 
      prev.includes(logId) ? prev.filter(id => id !== logId) : [...prev, logId]
    );
  };

  const toggleSelectAllLogs = () => {
    if (selectedLogIds.length === logs.length) {
      setSelectedLogIds([]);
    } else {
      setSelectedLogIds(logs.map(log => log.id));
    }
  };

  const handleBulkDelete = async () => {
    try {
      setIsSubmitting(true);
      await adminService.bulkDeleteNotifications(selectedLogIds);
      
      // Notify other components
      window.dispatchEvent(new CustomEvent('notificationsUpdated'));

      setLogs(prev => prev.filter(n => !selectedLogIds.includes(n.id)));
      setSelectedLogIds([]);
      setShowBulkDeleteModal(false);
      showToast(isAr ? "تم حذف الإشعارات المحددة" : "Selected notifications deleted", "success");
    } catch (err) {
      showToast(isAr ? "فشل الحذف الجماعي" : "Bulk delete failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f1eb] flex flex-col" dir={dir}>
      <Navbar />

      <Toast message={message} type={type} isVisible={isVisible} onClose={hideToast} />

      <div className="flex-1 pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">

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
                        <option value="specific">{isAr ? "مستخدم محدد (Multi-Select)" : "Specific Users (Multi-Select)"}</option>
                      </select>
                    </div>

                    {formData.target === "specific" && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <button
                          onClick={() => setShowUserSelector(true)}
                          className="w-full bg-[#f5f1eb]/50 border border-[#2C160F]/5 rounded-xl py-3 px-4 text-sm text-[#2C160F] font-bold flex items-center justify-between hover:bg-[#f5f1eb] transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <Users className="w-4 h-4 opacity-40" />
                            {formData.target_user_ids.length > 0 
                              ? (isAr ? `تم اختيار ${formData.target_user_ids.length} مستخدم` : `${formData.target_user_ids.length} users selected`)
                              : (isAr ? "اختر المستخدمين..." : "Select users...")
                            }
                          </span>
                          <ChevronDown className="w-4 h-4 opacity-40" />
                        </button>
                        
                        {formData.target_user_ids.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {formData.target_user_ids.slice(0, 5).map(id => {
                              const user = users.find(u => u.id === id);
                              return (
                                <span key={id} className="text-[10px] bg-[#2C160F] text-white px-2 py-0.5 rounded-full font-bold">
                                  {user?.full_name || user?.name || `#${id}`}
                                </span>
                              );
                            })}
                            {formData.target_user_ids.length > 5 && (
                              <span className="text-[10px] bg-[#2C160F]/10 text-[#2C160F] px-2 py-0.5 rounded-full font-bold">
                                +{formData.target_user_ids.length - 5}
                              </span>
                            )}
                          </div>
                        )}
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
              <div className="bg-white rounded-[2rem] border border-[#2C160F]/5 shadow-xl shadow-[#2C160F]/5 overflow-hidden relative">
                
                {/* Bulk Action Bar */}
                {selectedLogIds.length > 0 && (
                  <div className="absolute top-0 inset-x-0 bg-[#2C160F] text-white p-4 flex items-center justify-between z-20 animate-in slide-in-from-top duration-300">
                    <p className="text-sm font-bold">
                      {isAr ? `تم تحديد ${selectedLogIds.length} إشعار` : `${selectedLogIds.length} notifications selected`}
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
                        onClick={() => setSelectedLogIds([])}
                        className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-black transition-colors"
                      >
                        {isAr ? "إلغاء" : "Cancel"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="p-6 border-b border-[#2C160F]/5 bg-[#f5f1eb]/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {logs.length > 0 && (
                      <input 
                        type="checkbox" 
                        checked={selectedLogIds.length === logs.length && logs.length > 0}
                        onChange={toggleSelectAllLogs}
                        className="w-4 h-4 rounded border-[#2C160F]/20 accent-[#2C160F]"
                      />
                    )}
                    <h2 className="text-xl font-black text-[#2C160F] flex items-center gap-2">
                      <History className="w-5 h-5 text-[#2C160F]/40" />
                      {isAr ? "سجل الإشعارات المرسلة" : "Sent Notifications Log"}
                    </h2>
                  </div>
                  {loadingLogs && <Loader2 className="w-5 h-5 animate-spin text-[#2C160F]/20" />}
                </div>

                <div className="p-6">
                  {logs.length > 0 ? (
                    <div className="space-y-4">
                      {logs.map((log) => (
                        <div key={log.id} className={`flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border transition-all group ${selectedLogIds.includes(log.id) ? 'bg-[#f5f1eb]/40 border-[#2C160F]/20' : 'border-[#2C160F]/5 hover:bg-[#f5f1eb]/20'}`}>
                          <div className="flex items-start gap-4">
                            <input 
                              type="checkbox" 
                              checked={selectedLogIds.includes(log.id)}
                              onChange={() => toggleSelectLog(log.id)}
                              className="w-4 h-4 mt-4 rounded border-[#2C160F]/20 accent-[#2C160F] shrink-0"
                            />
                            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 shrink-0 group-hover:scale-110 transition-transform">
                              <Bell className="w-6 h-6" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h3 className="font-black text-[#2C160F] text-lg truncate">{log.title}</h3>
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => {
                                    setFormData({
                                      title: log.title,
                                      message: log.message,
                                      target: log.is_broadcast ? "all" : "specific",
                                      target_user_ids: log.target_user_id ? [log.target_user_id] : []
                                    });
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title={isAr ? "إعادة استخدام" : "Reuse"}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => {
                                    setSelectedNotification(log);
                                    setShowDeleteModal(true);
                                  }}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title={isAr ? "حذف" : "Delete"}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-[#2C160F]/60 mb-3 line-clamp-2">{log.message}</p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-[#2C160F]/50">
                              <span className="flex items-center gap-1.5 bg-[#f5f1eb] px-2 py-1 rounded-lg">
                                <Users className="w-3.5 h-3.5" />
                                {log.is_broadcast 
                                  ? (isAr ? "الجميع" : "All") 
                                  : `${log.target_user_name || (isAr ? "مستخدم" : "User")} ID: ${log.target_user_id}`
                                }
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(log.created_at).toLocaleString(isAr ? 'ar-SA' : 'en-US')}
                              </span>
                            </div>
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

      {/* User Selection Modal */}
      {showUserSelector && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#2C160F]/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
            <div className="p-8 border-b border-[#2C160F]/5 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-2xl font-black text-[#2C160F]">{isAr ? "اختيار المستخدمين" : "Select Users"}</h3>
                <p className="text-[#2C160F]/50 text-sm font-bold">{isAr ? `تم اختيار ${formData.target_user_ids.length} مستخدم` : `${formData.target_user_ids.length} users selected`}</p>
              </div>
              <button onClick={() => setShowUserSelector(false)} className="p-3 bg-[#f5f1eb] rounded-2xl hover:bg-[#f5f1eb]/80 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 shrink-0">
              <div className="relative">
                <Search className={`w-5 h-5 text-[#2C160F]/30 absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-4' : 'left-4'}`} />
                <input 
                  type="text"
                  placeholder={isAr ? "ابحث بالاسم، الإيميل أو الـ ID..." : "Search by name, email or ID..."}
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className={`w-full bg-[#f5f1eb]/50 border-transparent focus:border-[#2C160F]/20 rounded-2xl py-4 ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-[#2C160F] outline-none font-bold`}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
              {loadingUsers ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-[#2C160F]/20" />
                  <p className="text-[#2C160F]/40 font-bold">{isAr ? "جاري تحميل المستخدمين..." : "Loading users..."}</p>
                </div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => toggleUserSelection(user.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${
                      formData.target_user_ids.includes(user.id)
                        ? "bg-[#2C160F] border-[#2C160F] text-white shadow-lg translate-x-1"
                        : "bg-[#f5f1eb]/30 border-transparent hover:border-[#2C160F]/10 hover:bg-[#f5f1eb]/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 text-start">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${formData.target_user_ids.includes(user.id) ? 'bg-white/20' : 'bg-[#2C160F]/5 text-[#2C160F]'}`}>
                        {user.id}
                      </div>
                      <div>
                        <p className="font-black text-sm">{user.full_name || user.name || user.username}</p>
                        <p className={`text-[10px] font-bold ${formData.target_user_ids.includes(user.id) ? 'text-white/60' : 'text-[#2C160F]/40'}`}>{user.email}</p>
                      </div>
                    </div>
                    {formData.target_user_ids.includes(user.id) && <Check className="w-5 h-5" />}
                  </button>
                ))
              ) : (
                <div className="py-20 text-center text-[#2C160F]/30 font-bold">
                  {isAr ? "لا يوجد مستخدمين بهذا الاسم" : "No users found"}
                </div>
              )}
            </div>

            <div className="p-8 border-t border-[#2C160F]/5 bg-[#f5f1eb]/30 shrink-0">
              <button
                onClick={() => setShowUserSelector(false)}
                className="w-full bg-[#2C160F] text-white py-4 rounded-2xl font-black shadow-xl hover:bg-[#2C160F]/90 transition-all"
              >
                {isAr ? "تم، حفظ الاختيار" : "Done, Save Selection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#2C160F]/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
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
                ? `هل أنت متأكد أنك تريد إرسال هذا الإشعار إلى ${formData.target === 'all' ? 'جميع المستخدمين' : `عدد ${formData.target_user_ids.length} مستخدم`}؟`
                : `Are you sure you want to send this notification to ${formData.target === 'all' ? 'all users' : `${formData.target_user_ids.length} users`}?`
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

      {/* Delete Notification Modal */}
      {showDeleteModal && selectedNotification && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#2C160F]/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6 text-red-500 mx-auto">
              <Trash2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-[#2C160F] mb-2 text-center">
              {isAr ? "حذف الإشعار" : "Delete Notification"}
            </h3>
            <p className="text-[#2C160F]/60 font-bold mb-8 text-center leading-relaxed">
              {isAr ? "هل أنت متأكد من حذف هذا الإشعار من السجل؟ لا يمكن التراجع عن هذا الإجراء." : "Are you sure you want to delete this notification from log? This action cannot be undone."}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDeleteNotification}
                disabled={isSubmitting}
                className="flex-1 bg-red-600 text-white py-4 rounded-xl font-black hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (isAr ? "حذف نهائي" : "Delete Now")}
              </button>
              <button
                onClick={() => { setShowDeleteModal(false); setSelectedNotification(null); }}
                disabled={isSubmitting}
                className="flex-1 bg-[#f5f1eb] text-[#2C160F] py-4 rounded-xl font-black hover:bg-[#f5f1eb]/80 transition-colors"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Notification Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#2C160F]/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6 text-red-500 mx-auto">
              <Trash2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-[#2C160F] mb-2 text-center">
              {isAr ? "حذف جماعي" : "Bulk Delete"}
            </h3>
            <p className="text-[#2C160F]/60 font-bold mb-8 text-center leading-relaxed">
              {isAr 
                ? `هل أنت متأكد من حذف ${selectedLogIds.length} إشعار من السجل؟ لا يمكن التراجع عن هذا الإجراء.` 
                : `Are you sure you want to delete ${selectedLogIds.length} notifications from log? This action cannot be undone.`
              }
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleBulkDelete}
                disabled={isSubmitting}
                className="flex-1 bg-red-600 text-white py-4 rounded-xl font-black hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (isAr ? "حذف المحددين" : "Delete Selected")}
              </button>
              <button
                onClick={() => setShowBulkDeleteModal(false)}
                disabled={isSubmitting}
                className="flex-1 bg-[#f5f1eb] text-[#2C160F] py-4 rounded-xl font-black hover:bg-[#f5f1eb]/80 transition-colors"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 font-bold">
            <CheckCircle2 className="w-6 h-6" />
            {isAr ? "تم تنفيذ العملية بنجاح!" : "Operation successful!"}
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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