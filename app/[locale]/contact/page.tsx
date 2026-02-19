import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/features/ContactForm";
import { getDictionary } from "@/lib/dictionary";

interface Props {
    params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: Props) {
    const { locale } = await params;
    const dict = await getDictionary(locale);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between bg-[#f5f1eb]">
            <div className="fixed top-0 w-full z-50 flex justify-center py-4 bg-transparent pointer-events-none">
                <div className="pointer-events-auto w-full max-w-6xl px-4">
                    <Navbar locale={locale} />
                </div>
            </div>

            <div className="w-full mt-24 flex-grow flex items-center justify-center">
                <ContactForm dict={dict} locale={locale} />
            </div>

            <Footer />
        </main>
    );
}
