"use client";
import React, { use, useState, useEffect } from "react";
import {
  Users,
  Database,
  ArrowLeft,
  ArrowRight,
  Search,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Globe2,
  Mail,
  AlertTriangle,
  X,
  CheckCircle2,
  Filter,
  Calendar,
  ChevronDown,
  ChevronUp,
  Check
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

// Mock Data
const STATS_DATA = {
  "6months": [
    { label: "Jan", arLabel: "يناير", users: 120 },
    { label: "Feb", arLabel: "فبراير", users: 250 },
    { label: "Mar", arLabel: "مارس", users: 400 },
    { label: "Apr", arLabel: "أبريل", users: 380 },
    { label: "May", arLabel: "مايو", users: 500 },
    { label: "Jun", arLabel: "يونيو", users: 700 },
  ],
  "1year": [
    { label: "Jul", arLabel: "يوليو", users: 80 },
    { label: "Aug", arLabel: "أغسطس", users: 150 },
    { label: "Sep", arLabel: "سبتمبر", users: 200 },
    { label: "Oct", arLabel: "أكتوبر", users: 250 },
    { label: "Nov", arLabel: "نوفمبر", users: 300 },
    { label: "Dec", arLabel: "ديسمبر", users: 350 },
    { label: "Jan", arLabel: "يناير", users: 420 },
    { label: "Feb", arLabel: "فبراير", users: 480 },
    { label: "Mar", arLabel: "مارس", users: 550 },
    { label: "Apr", arLabel: "أبريل", users: 600 },
    { label: "May", arLabel: "مايو", users: 750 },
    { label: "Jun", arLabel: "يونيو", users: 900 },
  ],
  "allTime": [
    { label: "2024", arLabel: "2024", users: 1200 },
    { label: "2025", arLabel: "2025", users: 3500 },
    { label: "2026", arLabel: "2026", users: 8400 },
    { label: "2027", arLabel: "2027", users: 15200 },
  ]
};

const MOCK_USERS = [
  { id: 1, name: "أحمد عبدالله", email: "ahmed@example.com", nationalityAr: "سعودي", nationalityEn: "Saudi", role: "user", joinDate: "2026-01-10", active: true },
  { id: 2, name: "John Smith", email: "john@example.com", nationalityAr: "أمريكي", nationalityEn: "American", role: "user", joinDate: "2026-02-15", active: true },
  { id: 3, name: "سارة محمد", email: "sara@example.com", nationalityAr: "مصري", nationalityEn: "Egyptian", role: "admin", joinDate: "2027-11-05", active: true },
  { id: 4, name: "Arjun Kumar", email: "arjun@example.com", nationalityAr: "هندي", nationalityEn: "Indian", role: "user", joinDate: "2028-03-20", active: false },
  { id: 5, name: "Oliver Brown", email: "oliver@example.com", nationalityAr: "بريطاني", nationalityEn: "British", role: "user", joinDate: "2026-04-02", active: true },
  { id: 6, name: "Pierre Dubois", email: "pierre@example.com", nationalityAr: "فرنسي", nationalityEn: "French", role: "admin", joinDate: "2029-05-12", active: true },
];

// Reusable Checkbox Component
const Checkbox = ({ label, checked, onChange, isAr }: { label: string, checked: boolean, onChange: () => void, isAr: boolean }) => (
  <label className="flex items-center gap-2 cursor-pointer group">
    <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${checked ? 'bg-[#3d2e20] border-[#3d2e20]' : 'border-[#3d2e20]/20 group-hover:border-[#3d2e20]/50'}`}>
      {checked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
    </div>
    <span className="text-sm font-bold text-[#3d2e20]/80 group-hover:text-[#3d2e20] transition-colors">{label}</span>
  </label>
);

export default function DatabasePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const isAr = locale === "ar";
  const dir = isAr ? "rtl" : "ltr";

  // Data States
  const [users, setUsers] = useState(MOCK_USERS);
  const [statsPeriod, setStatsPeriod] = useState<"6months" | "1year" | "allTime">("6months");

  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Draft Filter States (Before clicking Apply)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedNationalities, setSelectedNationalities] = useState<string[]>([]);
  const [minYear, setMinYear] = useState<number>(2026);
  const [maxYear, setMaxYear] = useState<number>(2100);

  // Applied Filter States (After clicking Apply)
  const [appliedRoles, setAppliedRoles] = useState<string[]>([]);
  const [appliedStatuses, setAppliedStatuses] = useState<string[]>([]);
  const [appliedNationalities, setAppliedNationalities] = useState<string[]>([]);
  const [appliedMinYear, setAppliedMinYear] = useState<number>(2026);
  const [appliedMaxYear, setAppliedMaxYear] = useState<number>(2100);

  // Unique lists for dynamic filters
  const uniqueNationalities = Array.from(new Set(MOCK_USERS.map(u => isAr ? u.nationalityAr : u.nationalityEn)));

  // Modal states
  const [actionUser, setActionUser] = useState<typeof MOCK_USERS[0] | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Stats calculation based on selected period
  const currentStats = STATS_DATA[statsPeriod];
  const maxUsers = Math.max(...currentStats.map(s => s.users));

  const toggleSelection = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  const applyFilters = () => {
    setAppliedRoles(selectedRoles);
    setAppliedStatuses(selectedStatuses);
    setAppliedNationalities(selectedNationalities);
    setAppliedMinYear(minYear);
    setAppliedMaxYear(maxYear);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSelectedRoles([]);
    setSelectedStatuses([]);
    setSelectedNationalities([]);
    setMinYear(2026);
    setMaxYear(2100);
    // Also clear applied immediately
    setAppliedRoles([]);
    setAppliedStatuses([]);
    setAppliedNationalities([]);
    setAppliedMinYear(2026);
    setAppliedMaxYear(2100);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.nationalityAr.includes(searchTerm) ||
      u.nationalityEn.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = appliedRoles.length === 0 || appliedRoles.includes(u.role);
    const matchesStatus = appliedStatuses.length === 0 || appliedStatuses.includes(u.active ? 'active' : 'inactive');

    const uNationality = isAr ? u.nationalityAr : u.nationalityEn;
    const matchesNationality = appliedNationalities.length === 0 || appliedNationalities.includes(uNationality);

    const uYear = Number(u.joinDate.split("-")[0]);
    const matchesYear = uYear >= appliedMinYear && uYear <= appliedMaxYear;

    return matchesSearch && matchesRole && matchesStatus && matchesNationality && matchesYear;
  });

  const activeFiltersCount = appliedRoles.length + appliedStatuses.length + appliedNationalities.length + (appliedMinYear > 2026 || appliedMaxYear < 2100 ? 1 : 0);

  const handleDeleteConfirm = () => {
    if (actionUser) {
      setUsers(users.filter(u => u.id !== actionUser.id));
      setShowDeleteModal(false);
      setActionUser(null);
    }
  };

  const handleRoleConfirm = () => {
    if (actionUser) {
      setUsers(users.map(u =>
        u.id === actionUser.id
          ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' }
          : u
      ));
      setShowRoleModal(false);
      setActionUser(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f1eb] flex flex-col" dir={dir}>
      <Navbar />

      <div className="flex-1 pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <Link
              href={`/${locale}/admin`}
              className="inline-flex items-center gap-2 text-[#3d2e20]/50 hover:text-[#3d2e20] transition-colors mb-4 font-bold text-sm"
            >
              {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {isAr ? "العودة للوحة التحكم" : "Back to Dashboard"}
            </Link>
            <h1 className="text-3xl font-black text-[#3d2e20] flex items-center gap-3 mb-2">
              <Database className="w-8 h-8 text-[#3d2e20]/40" />
              {isAr ? "قاعدة بيانات المستخدمين" : "Users Database"}
            </h1>
            <p className="text-[#3d2e20]/60 font-medium">
              {isAr ? "إدارة وتدقيق بيانات المستخدمين، الصلاحيات، وتحليل التفاعل." : "Manage user data, permissions, and analyze engagement."}
            </p>
          </div>

          {/* Top Stats Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            {/* KPI Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-[#3d2e20]/5 shadow-xl shadow-[#3d2e20]/5 flex items-center justify-between">
                <div>
                  <p className="text-[#3d2e20]/50 text-sm font-bold mb-1">{isAr ? "إجمالي المستخدمين" : "Total Users"}</p>
                  <h3 className="text-3xl font-black text-[#3d2e20]">{users.length.toLocaleString()}</h3>
                </div>
                <div className="w-12 h-12 bg-[#f5f1eb] rounded-2xl flex items-center justify-center text-[#3d2e20]">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#3d2e20] p-6 rounded-3xl border border-[#3d2e20]/5 shadow-xl shadow-[#3d2e20]/10 flex items-center justify-between text-white relative overflow-hidden">
                <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5" />
                <div className="relative z-10">
                  <p className="text-white/60 text-sm font-bold mb-1">{isAr ? "المسؤولين (Admins)" : "Administrators"}</p>
                  <h3 className="text-3xl font-black">{users.filter(u => u.role === 'admin').length}</h3>
                </div>
                <div className="relative z-10 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Monthly Engagement Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#3d2e20]/5 shadow-xl shadow-[#3d2e20]/5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h3 className="font-black text-[#3d2e20] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  {isAr ? "تفاعل المستخدمين" : "User Engagement"}
                </h3>

                {/* Stats Period Filter */}
                <div className="relative flex items-center bg-[#f5f1eb] rounded-xl p-1">
                  <Calendar className={`w-4 h-4 text-[#3d2e20]/40 absolute pointer-events-none ${isAr ? 'right-3' : 'left-3'}`} />
                  <select
                    value={statsPeriod}
                    onChange={(e) => setStatsPeriod(e.target.value as any)}
                    className={`bg-transparent border-none py-1.5 ${isAr ? 'pr-9 pl-4' : 'pl-9 pr-4'} text-xs font-bold text-[#3d2e20] outline-none appearance-none cursor-pointer w-full min-w-[120px]`}
                  >
                    <option value="6months">{isAr ? "آخر 6 أشهر" : "Last 6 Months"}</option>
                    <option value="1year">{isAr ? "آخر سنة" : "Last Year"}</option>
                    <option value="allTime">{isAr ? "كل الأوقات" : "All Time"}</option>
                  </select>
                </div>
              </div>

              {/* CSS Bar Chart */}
              <div className="h-48 flex items-end gap-1 sm:gap-2 mt-8 overflow-x-auto custom-scrollbar pb-2">
                {currentStats.map((stat, i) => {
                  const heightPercentage = (stat.users / maxUsers) * 100;
                  return (
                    <div key={i} className="flex-1 min-w-[24px] flex flex-col items-center gap-2 group">
                      <div className="w-full relative flex justify-center items-end h-full">
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-[#3d2e20] text-white text-[10px] sm:text-xs font-bold py-1 px-2 rounded-lg transition-opacity whitespace-nowrap z-10">
                          {stat.users.toLocaleString()} {isAr ? "مستخدم" : "users"}
                        </div>
                        {/* Bar */}
                        <div
                          className="w-full max-w-[40px] bg-[#f5f1eb] group-hover:bg-[#3d2e20]/20 rounded-t-lg sm:rounded-t-xl transition-all duration-500 ease-out relative overflow-hidden"
                          style={{ height: `${heightPercentage}%` }}
                        >
                          <div className="absolute bottom-0 left-0 right-0 bg-[#3d2e20] transition-all duration-700 ease-out" style={{ height: '0%' }} />
                        </div>
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold text-[#3d2e20]/50 truncate w-full text-center">
                        {isAr ? stat.arLabel : stat.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Users List Section */}
          <div className="bg-white rounded-3xl border border-[#3d2e20]/5 shadow-xl shadow-[#3d2e20]/5 overflow-hidden">
            {/* Toolbar & Filters */}
            <div className="p-6 border-b border-[#3d2e20]/5 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-black text-[#3d2e20]">
                  {isAr ? "قائمة المستخدمين" : "Users List"}
                  <span className="text-sm font-medium text-[#3d2e20]/50 mx-2">({filteredUsers.length})</span>
                </h2>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  {/* Search */}
                  <div className="relative w-full sm:w-64">
                    <Search className={`w-4 h-4 text-[#3d2e20]/40 absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-4' : 'left-4'}`} />
                    <input
                      type="text"
                      placeholder={isAr ? "ابحث عن مستخدم (يُطبق تلقائياً)..." : "Search users (Live)..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full bg-[#f5f1eb]/50 border border-transparent focus:border-[#3d2e20]/20 rounded-xl py-2.5 px-10 text-sm text-[#3d2e20] outline-none transition-all font-medium`}
                    />
                  </div>

                  {/* Toggle Filters Button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border-2 ${showFilters || activeFiltersCount > 0 ? 'bg-[#3d2e20] text-white border-[#3d2e20]' : 'bg-transparent text-[#3d2e20] border-[#3d2e20]/10 hover:border-[#3d2e20]/30'}`}
                  >
                    <Filter className="w-4 h-4" />
                    {isAr ? "الفلاتر المتقدمة" : "Advanced Filters"}
                    {activeFiltersCount > 0 && (
                      <span className="bg-white text-[#3d2e20] w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                        {activeFiltersCount}
                      </span>
                    )}
                    {showFilters ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Filters Pane */}
              {showFilters && (
                <div className="mt-4 p-5 bg-[#f5f1eb]/30 rounded-2xl border border-[#3d2e20]/5 animate-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#3d2e20]/5">
                    <h3 className="font-black text-[#3d2e20] text-sm">
                      {isAr ? "خيارات التصفية المتقدمة" : "Advanced Filtering Options"}
                    </h3>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={clearFilters}
                        className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg"
                      >
                        {isAr ? "مسح جميع الفلاتر" : "Clear All Filters"}
                      </button>
                      <button
                        onClick={applyFilters}
                        className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#3d2e20] px-4 py-1.5 rounded-lg hover:bg-[#3d2e20]/90 transition-colors shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        {isAr ? "تطبيق الفلاتر" : "Apply Filters"}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Role Filter */}
                    <div>
                      <h4 className="text-xs font-black text-[#3d2e20]/50 mb-3 uppercase tracking-wider">{isAr ? "الصلاحية" : "Role"}</h4>
                      <div className="space-y-3">
                        <Checkbox label={isAr ? "المشرفين (Admins)" : "Admins"} checked={selectedRoles.includes("admin")} onChange={() => toggleSelection(setSelectedRoles, "admin")} isAr={isAr} />
                        <Checkbox label={isAr ? "المستخدمين" : "Users"} checked={selectedRoles.includes("user")} onChange={() => toggleSelection(setSelectedRoles, "user")} isAr={isAr} />
                      </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <h4 className="text-xs font-black text-[#3d2e20]/50 mb-3 uppercase tracking-wider">{isAr ? "الحالة" : "Status"}</h4>
                      <div className="space-y-3">
                        <Checkbox label={isAr ? "نشط" : "Active"} checked={selectedStatuses.includes("active")} onChange={() => toggleSelection(setSelectedStatuses, "active")} isAr={isAr} />
                        <Checkbox label={isAr ? "غير نشط" : "Inactive"} checked={selectedStatuses.includes("inactive")} onChange={() => toggleSelection(setSelectedStatuses, "inactive")} isAr={isAr} />
                      </div>
                    </div>

                    {/* Nationality Filter */}
                    <div>
                      <h4 className="text-xs font-black text-[#3d2e20]/50 mb-3 uppercase tracking-wider">{isAr ? "الجنسية" : "Nationality"}</h4>
                      <div className="space-y-3 max-h-[140px] overflow-y-auto custom-scrollbar pr-2">
                        {uniqueNationalities.map(nat => (
                          <Checkbox key={nat} label={nat} checked={selectedNationalities.includes(nat)} onChange={() => toggleSelection(setSelectedNationalities, nat)} isAr={isAr} />
                        ))}
                      </div>
                    </div>

                    {/* Dual Range Slider for Years */}
                    <div>
                      <h4 className="text-xs font-black text-[#3d2e20]/50 mb-3 uppercase tracking-wider">{isAr ? "سنة الانضمام (من - إلى)" : "Join Year (From - To)"}</h4>

                      <div className="mt-8 mb-4">
                        <div className="relative h-2 w-full">
                          {/* Track */}
                          <div className="absolute top-0 w-full h-2 bg-[#d1c8bd] rounded-lg z-0"></div>
                          {/* Selected Range */}
                          <div
                            className="absolute top-0 h-2 bg-[#3d2e20] rounded-lg z-10"
                            style={{
                              left: `${dir === 'ltr' ? ((minYear - 2026) / (2100 - 2026)) * 100 : 100 - ((maxYear - 2026) / (2100 - 2026)) * 100}%`,
                              right: `${dir === 'ltr' ? 100 - ((maxYear - 2026) / (2100 - 2026)) * 100 : ((minYear - 2026) / (2100 - 2026)) * 100}%`
                            }}
                          ></div>

                          {/* Min Thumb */}
                          <input
                            type="range"
                            min="2026"
                            max="2100"
                            value={minYear}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (val <= maxYear) setMinYear(val);
                            }}
                            className="absolute w-full top-0 appearance-none bg-transparent z-20 pointer-events-none dual-slider"
                          />

                          {/* Max Thumb */}
                          <input
                            type="range"
                            min="2026"
                            max="2100"
                            value={maxYear}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (val >= minYear) setMaxYear(val);
                            }}
                            className="absolute w-full top-0 appearance-none bg-transparent z-30 pointer-events-none dual-slider"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs font-black text-[#3d2e20]">
                        <div className="bg-white px-2 py-1 rounded-md border border-[#3d2e20]/10 shadow-sm">{minYear}</div>
                        <div className="bg-white px-2 py-1 rounded-md border border-[#3d2e20]/10 shadow-sm">{maxYear}</div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" dir={dir}>
                <thead>
                  <tr className="bg-[#f5f1eb]/30 text-[#3d2e20]/60 text-xs uppercase tracking-widest font-black">
                    <th className="p-4 sm:p-6 text-start">{isAr ? "المستخدم" : "User"}</th>
                    <th className="p-4 sm:p-6 text-start">{isAr ? "الجنسية" : "Nationality"}</th>
                    <th className="p-4 sm:p-6 text-start">{isAr ? "الصلاحية" : "Role"}</th>
                    <th className="p-4 sm:p-6 text-start">{isAr ? "تاريخ الانضمام" : "Join Date"}</th>
                    <th className="p-4 sm:p-6 text-end">{isAr ? "الإجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3d2e20]/5">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-[#f5f1eb]/20 transition-colors group">
                        <td className="p-4 sm:p-6">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-[#f5f1eb] border-2 border-white shadow-sm flex items-center justify-center text-[#3d2e20] font-black text-sm">
                                {user.name.charAt(0)}
                              </div>
                              <span className={`absolute bottom-0 ${isAr ? 'left-0' : 'right-0'} w-3 h-3 rounded-full border-2 border-white ${user.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            </div>
                            <div>
                              <p className="font-bold text-[#3d2e20]">{user.name}</p>
                              <p className="text-xs text-[#3d2e20]/50 font-medium flex items-center gap-1">
                                <Mail className="w-3 h-3" /> {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 sm:p-6">
                          <div className="flex items-center gap-2">
                            <Globe2 className="w-4 h-4 text-[#3d2e20]/40" />
                            <span className="text-[#3d2e20] font-bold text-sm">
                              {isAr ? user.nationalityAr : user.nationalityEn}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 sm:p-6">
                          {user.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1 bg-[#3d2e20] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              {isAr ? "مشرف" : "Admin"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-[#f5f1eb] text-[#3d2e20]/70 px-3 py-1 rounded-full text-xs font-bold border border-[#3d2e20]/5">
                              <Users className="w-3.5 h-3.5" />
                              {isAr ? "مستخدم" : "User"}
                            </span>
                          )}
                        </td>
                        <td className="p-4 sm:p-6 text-[#3d2e20]/60 font-medium text-sm">
                          {user.joinDate}
                        </td>
                        <td className="p-4 sm:p-6">
                          <div className={`flex items-center gap-2 ${isAr ? 'justify-end' : 'justify-end'}`}>

                            <button
                              onClick={() => { setActionUser(user); setShowRoleModal(true); }}
                              className={`p-2 rounded-xl transition-colors tooltip-trigger ${user.role === 'admin' ? 'text-orange-600 hover:bg-orange-50' : 'text-blue-600 hover:bg-blue-50'}`}
                              title={isAr ? "تعديل الصلاحيات" : "Edit Role"}
                            >
                              <ShieldAlert className="w-5 h-5" />
                            </button>

                            <button
                              onClick={() => { setActionUser(user); setShowDeleteModal(true); }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors tooltip-trigger"
                              title={isAr ? "حذف المستخدم" : "Delete User"}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-[#3d2e20]/40">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-bold">{isAr ? "لا يوجد مستخدمين مطابقين للبحث" : "No users found matching your filters"}</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Role Change Modal */}
      {showRoleModal && actionUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3d2e20]/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button onClick={() => setShowRoleModal(false)} className="absolute top-4 right-4 p-2 text-[#3d2e20]/40 hover:text-[#3d2e20] transition-colors rounded-full hover:bg-[#f5f1eb]">
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 text-blue-600">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-[#3d2e20] mb-2">
              {isAr ? "تأكيد تعديل الصلاحية" : "Confirm Role Change"}
            </h3>

            <p className="text-[#3d2e20]/60 font-medium mb-6 leading-relaxed">
              {isAr
                ? `هل أنت متأكد من تحويل ${actionUser.name} إلى ${actionUser.role === 'admin' ? 'مستخدم عادي' : 'مشرف (Admin)'}؟`
                : `Are you sure you want to change ${actionUser.name}'s role to ${actionUser.role === 'admin' ? 'User' : 'Admin'}?`
              }
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRoleConfirm}
                className="flex-1 bg-[#3d2e20] text-white py-3 rounded-xl font-bold hover:bg-[#3d2e20]/90 transition-colors"
              >
                {isAr ? "تأكيد" : "Confirm"}
              </button>
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex-1 bg-[#f5f1eb] text-[#3d2e20] py-3 rounded-xl font-bold hover:bg-[#f5f1eb]/80 transition-colors"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && actionUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3d2e20]/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button onClick={() => setShowDeleteModal(false)} className="absolute top-4 right-4 p-2 text-[#3d2e20]/40 hover:text-[#3d2e20] transition-colors rounded-full hover:bg-[#f5f1eb]">
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4 text-red-600">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-red-600 mb-2">
              {isAr ? "حذف المستخدم" : "Delete User"}
            </h3>

            <p className="text-[#3d2e20]/60 font-medium mb-6 leading-relaxed">
              {isAr
                ? `هل أنت متأكد من رغبتك في حذف المستخدم "${actionUser.name}"؟ لا يمكن التراجع عن هذا الإجراء وسيتم حذف جميع بياناته.`
                : `Are you sure you want to delete user "${actionUser.name}"? This action cannot be undone and all data will be lost.`
              }
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
              >
                {isAr ? "حذف نهائي" : "Delete Permanently"}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-[#f5f1eb] text-[#3d2e20] py-3 rounded-xl font-bold hover:bg-[#f5f1eb]/80 transition-colors"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
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
        
        .dual-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #3d2e20;
          cursor: pointer;
          margin-top: -5px; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          pointer-events: auto;
        }
        .dual-slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #3d2e20;
          cursor: pointer;
          pointer-events: auto;
        }
      `}</style>
    </main>
  );
}
