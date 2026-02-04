import { Inter } from "next/font/google";
import "../globals.css";
import { getDirection } from "@/lib/dictionary";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang={locale} dir={dir}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
