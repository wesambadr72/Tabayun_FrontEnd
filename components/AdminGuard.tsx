'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { authService } from '@/services/authService';
import { Loader2 } from 'lucide-react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'ar';
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. التحقق الأولي من localStorage لتجربة مستخدم سريعة
        const cachedUser = authService.getUser();
        
        if (!cachedUser) {
          router.push(`/${locale}/auth/login`);
          return;
        }

        if (!cachedUser.is_admin) {
          router.push(`/${locale}/dashboard`);
          return;
        }

        // 2. التحقق من الخادم للتأكد من صحة الصلاحيات والتوكن
        try {
          const freshUser = await authService.getMe();
          if (!freshUser.is_admin) {
            router.push(`/${locale}/dashboard`);
            return;
          }
          setAuthorized(true);
        } catch (error) {
          // إذا فشل التحقق من الخادم (مثلاً توكن منتهي)، نخرج المستخدم
          console.error("Admin verification failed:", error);
          authService.logout();
          router.push(`/${locale}/auth/login`);
        }
      } catch (error) {
        router.push(`/${locale}/auth/login`);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [locale, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f1eb]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#3d2e20] animate-spin" />
          <p className="text-[#3d2e20] font-medium">
            {locale === 'ar' ? 'جاري التحقق من الصلاحيات...' : 'Verifying permissions...'}
          </p>
        </div>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
