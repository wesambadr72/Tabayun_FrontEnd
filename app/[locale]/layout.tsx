import localFont from "next/font/local";
import "../globals.css";
import { getDirection } from "@/lib/dictionary";

// تعريف الخطوط المخصصة - تم تصحيح المسار هنا
const handicraftsBold = localFont({
  src: "../../public/fonts/Handicrafts-Bold.otf",
  variable: "--font-handicrafts-bold",
});

const handicraftsRegular = localFont({
  src: "../../public/fonts/Handicrafts-Regular.otf",
  variable: "--font-handicrafts-regular",
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dir = getDirection(locale);

  return (
    <html lang={locale} dir={dir} className={`${handicraftsBold.variable} ${handicraftsRegular.variable}`}>
      <body className="font-regular antialiased text-[#2C160F]" suppressHydrationWarning>{children}</body>
    </html>
  );
}
