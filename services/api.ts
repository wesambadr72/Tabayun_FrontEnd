/**
 * إعدادات الـ API الأساسية
 * يتم جلب الرابط الأساسي من ملفات البيئة (.env)
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * دالة الجلب الأساسية (fetcher):
 * وظيفتها التعامل مع جميع طلبات HTTP (GET, POST, etc.)
 * وتجهيز الترويسات (Headers) مثل التوكين (Token) ونوع المحتوى.
 */
async function fetcher<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // جلب التوكين من التخزين المحلي إذا كنا في المتصفح
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // إعداد الترويسات الافتراضية
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // تنفيذ الطلب
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // التعامل مع الأخطاء إذا لم يكن الرد ناجحاً
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || 'An error occurred');
  }

  // إرجاع البيانات بصيغة JSON
  return response.json();
}

/**
 * كائن API:
 * يوفر دوال جاهزة للاستخدام للتعامل مع أنواع الطلبات المختلفة
 */
export const api = {
  // طلب جلب بيانات (GET)
  get: <T>(endpoint: string, options?: RequestInit) =>
    fetcher<T>(endpoint, { ...options, method: 'GET' }),
  
  // طلب إرسال بيانات جديدة (POST)
  post: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    fetcher<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers: body instanceof FormData 
        ? { ...options?.headers } // المتصفح يحدد نوع المحتوى تلقائياً في حالة FormData
        : { 'Content-Type': 'application/json', ...options?.headers },
    }),

  // طلب تحديث بيانات بالكامل (PUT)
  put: <T>(endpoint: string, body: any, options?: RequestInit) =>
    fetcher<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  // طلب تحديث جزئي للبيانات (PATCH)
  patch: <T>(endpoint: string, body: any, options?: RequestInit) =>
    fetcher<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  // طلب حذف بيانات (DELETE)
  delete: <T>(endpoint: string, options?: RequestInit) =>
    fetcher<T>(endpoint, { ...options, method: 'DELETE' }),
};
