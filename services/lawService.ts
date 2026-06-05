import { api } from './api';
import { 
  Law, 
  Category, 
  Comparison, 
  ComparisonDetail, 
  Bookmark, 
  SearchResult
} from '@/types/law';

/**
 * خدمة القوانين (Law Service)
 * مسؤولة عن جميع العمليات المتعلقة بالأنظمة والقوانين والمقارنات
 * تتعامل مباشرة مع الـ API لجلب وإرسال البيانات
 */
export const lawService = {
  /**
   * جلب جميع الأقسام (الفئات) المتاحة في النظام
   * @returns قائمة بجميع الفئات (Category[])
   */
  getCategories: () => api.get<Category[]>('/laws/categories'),

  /**
   * البحث في الأنظمة والقوانين بناءً على نص البحث
   * @param query النص المراد البحث عنه
   * @param lang اللغة (ar/en) اختيارية
   * @returns نتائج البحث (SearchResult[])
   */
  search: (query: string, lang?: string) => 
    api.get<SearchResult[]>(`/search/query?q=${encodeURIComponent(query)}${lang ? `&lang=${lang}` : ''}`),

  /**
   * جلب قائمة المقارنات القانونية بناءً على قسم معين
   * @param categoryId معرف القسم
   * @param lang اللغة اختيارية
   * @returns قائمة بالمقارنات (Comparison[])
   */
  getLawsByCategory: (categoryId: number, lang?: string) => 
    api.get<Comparison[]>(`/laws/by-category/${categoryId}${lang ? `?lang=${lang}` : ''}`),

  /**
   * جلب تفاصيل مقارنة قانونية معينة باستخدام معرفها
   * @param comparisonId معرف المقارنة
   * @param lang اللغة اختيارية
   * @returns تفاصيل المقارنة (ComparisonDetail)
   */
  getComparisonById: (comparisonId: number, lang?: string) => 
    api.get<ComparisonDetail>(`/comparison/${comparisonId}${lang ? `?lang=${lang}` : ''}`),

  /**
   * الاشتراك في قسم معين لتلقي التنبيهات (ميزة مستقبلية)
   * @param categoryId معرف القسم
   */
  subscribeToCategory: (categoryId: number) => 
    api.post<{ message: string }>(`/laws/subscribe/${categoryId}`),

  /**
   * جلب المقارنات ذات الأولوية (التي تظهر في الصفحة الرئيسية)
   * @returns قائمة بالمقارنات الهامة
   */
  getPriorityComparisons: () => 
    api.get<Comparison[]>('/comparison/priority'),

  /**
   * إضافة مقارنة إلى المفضلة
   * @param comparisonId معرف المقارنة
   */
  addBookmark: (comparisonId: number) => 
    api.post<Bookmark>('/comparison/bookmark', { comparison_id: comparisonId }),

  /**
   * جلب قائمة بجميع المقارنات التي أضافها المستخدم للمفضلة
   * @returns قائمة بالمفضلات
   */
  getMyBookmarks: () => 
    api.get<Bookmark[]>('/comparison/bookmarks'),

  /**
   * جلب قائمة بجميع الدول المتاحة في قاعدة البيانات للمقارنة
   * @returns قائمة بأسماء الدول
   */
  getAvailableCountries: () => 
    api.get<string[]>('/laws/countries'),

  /**
   * جلب إشعارات المستخدم الحالي
   * @returns قائمة بالإشعارات
   */
  getMyNotifications: () => 
    api.get<any[]>('/laws/my-notifications'),
};
