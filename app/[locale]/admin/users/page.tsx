"use client";
import React, { use, useState, useEffect } from "react";
import {
  Users,
  ArrowLeft,
  ArrowRight,
  Search,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  Mail,
  AlertTriangle,
  X,
  CheckCircle2,
  Loader2,
  Globe,
  MoreVertical,
  UserCog
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { adminService } from "@/services/adminService";
import { UserAdmin } from "@/types/admin";
import { useDebounce } from "@/hooks/useDebounce";

export default function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [skip, setSkip] = useState(0);
  const limit = 10;
  const [totalCount, setTotalCount] = useState(0);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAdmin | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [usersData, statsData] = await Promise.all([
        adminService.getUsers(skip, limit, debouncedSearchTerm),
        adminService.getStats()
      ]);
      setUsers(usersData);
      setTotalCount(statsData.total_users);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSkip(0);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [skip, debouncedSearchTerm]);

  const totalPages = Math.ceil(totalCount / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  const goToPage = (page: number) => {
    setSkip((page - 1) * limit);
  };

  const handleRoleChange = async () => {
    if (!selectedUser) return;
    try {
      setIsProcessing(true);
      const newRole = selectedUser.role === 'admin' ? 'user' : 'admin';
      await adminService.updateUserRole(selectedUser.id, newRole);
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, role: newRole } : u));
      setShowRoleModal(false);
    } catch (err) {
      console.error("Failed to update role", err);
      alert(isAr ? "فشل تحديث الصلاحية" : "Failed to update role");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      setIsProcessing(true);
      await adminService.deleteUser(selectedUser.id);
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setSelectedUserIds(prev => prev.filter(id => id !== selectedUser.id));
      setShowDeleteModal(false);
    } catch (err) {
      alert("Failed to delete user");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUserIds.length === 0) return;
    try {
      setIsProcessing(true);
      await adminService.bulkDeleteUsers(selectedUserIds);
      setUsers(users.filter(u => !selectedUserIds.includes(u.id)));
      setSelectedUserIds([]);
      setShowBulkDeleteModal(false);
    } catch (err) {
      console.error("Failed to delete users", err);
      alert(isAr ? "فشل حذف المستخدمين" : "Failed to delete users");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map(u => u.id));
    }
  };

  const toggleSelectUser = (id: number) => {
    setSelectedUserIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <main className="min-h-screen bg-[#f5f1eb] flex flex-col" dir={dir}>
      <Navbar />

      <div className="flex-1 pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href={`/${locale}/admin`} className="inline-flex items-center gap-2 text-[#2C160F]/50 hover:text-[#2C160F] mb-2 font-bold text-sm">
              {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {isAr ? "العودة للوحة التحكم" : "Back to Dashboard"}
            </Link>
            <h1 className="text-3xl font-black text-[#2C160F] flex items-center gap-3">
              <Users className="w-8 h-8 text-[#2C160F]/40" />
              {isAr ? "إدارة المستخدمين" : "User Management"}
            </h1>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-3xl border border-[#2C160F]/5 shadow-xl mb-6">
            <div className="relative">
              <Search className={`w-5 h-5 text-[#2C160F]/40 absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-4' : 'left-4'}`} />
              <input 
                type="text" 
                placeholder={isAr ? "ابحث عن مستخدم بالاسم أو الإيميل..." : "Search by name or email..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#f5f1eb]/50 border-transparent focus:border-[#2C160F]/20 rounded-2xl py-3 px-12 text-[#2C160F] outline-none font-medium"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-3xl border border-[#2C160F]/5 shadow-xl overflow-hidden relative">
            {selectedUserIds.length > 0 && (
              <div className="absolute top-0 inset-x-0 bg-[#2C160F] text-white p-4 flex items-center justify-between z-20 animate-in slide-in-from-top duration-300">
                <p className="text-sm font-bold">
                  {isAr ? `تم تحديد ${selectedUserIds.length} مستخدم` : `${selectedUserIds.length} users selected`}
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
                    onClick={() => setSelectedUserIds([])}
                    className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-black transition-colors"
                  >
                    {isAr ? "إلغاء" : "Cancel"}
                  </button>
                </div>
              </div>
            )}
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="bg-[#f5f1eb]/50 border-b border-[#2C160F]/5 text-[#2C160F]/60 text-xs uppercase tracking-widest font-black">
                  <th className="p-6 text-start w-12">
                    <input 
                      type="checkbox" 
                      checked={users.length > 0 && selectedUserIds.length === users.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-[#2C160F]/20 accent-[#2C160F]"
                    />
                  </th>
                  <th className="p-6 text-start">ID</th>
                  <th className="p-6 text-start">{isAr ? "المستخدم" : "User"}</th>
                  <th className="p-6 text-start">{isAr ? "الدولة" : "Country"}</th>
                  <th className="p-6 text-start">{isAr ? "الصلاحية" : "Role"}</th>
                  <th className="p-6 text-start">{isAr ? "الحالة" : "Status"}</th>
                  <th className="p-6 text-end">{isAr ? "الإجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2C160F]/5">
                {loading ? (
                  <tr><td colSpan={7} className="p-12 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-[#2C160F]/20" /></td></tr>
                ) : users.map(user => (
                  <tr key={user.id} className={`hover:bg-[#f5f1eb]/10 transition-colors ${selectedUserIds.includes(user.id) ? 'bg-[#f5f1eb]/40' : ''}`}>
                    <td className="p-6">
                      <input 
                        type="checkbox" 
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => toggleSelectUser(user.id)}
                        className="w-4 h-4 rounded border-[#2C160F]/20 accent-[#2C160F]"
                      />
                    </td>
                    <td className="p-6">
                      <span className="font-mono font-bold text-[#2C160F]/60">{user.id}</span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#2C160F] text-white flex items-center justify-center font-bold">
                          {(user.full_name || user.name || user.username || "?")[0]}
                        </div>
                        <div>
                          <p className="font-bold text-[#2C160F]">{user.full_name || user.name || user.username}</p>
                          <p className="text-xs text-[#2C160F]/40">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="flex items-center gap-2 text-sm font-bold text-[#2C160F]/60">
                        <Globe className="w-4 h-4" /> {user.country}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${user.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${user.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-green-600' : 'bg-red-600'}`}></span>
                        {user.is_active ? (isAr ? 'نشط' : 'Active') : (isAr ? 'معطل' : 'Inactive')}
                      </span>
                    </td>
                    <td className="p-6 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setSelectedUser(user); setShowRoleModal(true); }}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
                        >
                          <UserCog className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="p-6 bg-[#f5f1eb]/30 border-t border-[#2C160F]/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs font-bold text-[#2C160F]/40 uppercase tracking-widest">
                {isAr ? `عرض ${users.length} من أصل ${totalCount} مستخدم` : `Showing ${users.length} of ${totalCount} users`}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="p-2 rounded-xl bg-white border border-[#2C160F]/10 text-[#2C160F] hover:bg-[#2C160F] hover:text-white transition-all disabled:opacity-30"
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
                         className={`min-w-[36px] h-9 rounded-lg font-black text-xs transition-all border ${
                           currentPage === pageNum
                             ? "bg-[#2C160F] text-white border-[#2C160F] shadow-md scale-110 z-10"
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
                  className="p-2 rounded-xl bg-white border border-[#2C160F]/10 text-[#2C160F] hover:bg-[#2C160F] hover:text-white transition-all disabled:opacity-30"
                >
                  {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C160F]/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 text-center">
            <ShieldAlert className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-[#2C160F] mb-2">{isAr ? 'تغيير الصلاحية' : 'Change Role'}</h2>
            <p className="text-[#2C160F]/60 mb-8">
              {isAr 
                ? `هل أنت متأكد من تغيير صلاحية ${selectedUser.full_name || selectedUser.name || selectedUser.username}؟` 
                : `Are you sure you want to change the role for ${selectedUser.full_name || selectedUser.name || selectedUser.username}?`}
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowRoleModal(false)} className="flex-1 py-3 rounded-xl font-bold bg-[#f5f1eb]">{isAr ? 'إلغاء' : 'Cancel'}</button>
              <button onClick={handleRoleChange} disabled={isProcessing} className="flex-1 py-3 rounded-xl font-bold bg-[#2C160F] text-white disabled:opacity-50">
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (isAr ? 'تأكيد التغيير' : 'Confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C160F]/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-[#2C160F] mb-2">{isAr ? 'حذف المستخدم' : 'Delete User'}</h2>
            <p className="text-[#2C160F]/60 mb-8">
              {isAr 
                ? `لا يمكن التراجع عن حذف ${selectedUser.full_name || selectedUser.name || selectedUser.username}.` 
                : `Deleting ${selectedUser.full_name || selectedUser.name || selectedUser.username} cannot be undone.`}
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 rounded-xl font-bold bg-[#f5f1eb]">{isAr ? 'إلغاء' : 'Cancel'}</button>
              <button onClick={handleDeleteUser} disabled={isProcessing} className="flex-1 py-3 rounded-xl font-bold bg-red-600 text-white disabled:opacity-50">
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (isAr ? 'حذف نهائي' : 'Delete Now')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#2C160F]/40 backdrop-blur-sm" onClick={() => !isProcessing && setShowBulkDeleteModal(false)}></div>
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full relative z-10 shadow-2xl border border-[#2C160F]/5">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-black text-[#2C160F] mb-2">
              {isAr ? "حذف جماعي؟" : "Bulk Delete?"}
            </h3>
            <p className="text-[#2C160F]/60 font-medium mb-8">
              {isAr 
                ? `هل أنت متأكد من حذف ${selectedUserIds.length} مستخدم؟ هذا الإجراء لا يمكن التراجع عنه وسيتم مسح كافة بياناتهم.` 
                : `Are you sure you want to delete ${selectedUserIds.length} users? This action cannot be undone.`}
            </p>
            <div className="flex gap-3">
              <button
                disabled={isProcessing}
                onClick={handleBulkDelete}
                className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {isAr ? "تأكيد الحذف الجماعي" : "Confirm Bulk Delete"}
              </button>
              <button
                disabled={isProcessing}
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
