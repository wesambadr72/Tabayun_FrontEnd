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
        <main className="flex min-h-screen flex-col items-center bg-[#f5f1eb]">
            <Navbar />

            <div className="w-full pt-32 md:pt-44 flex-grow flex items-center justify-center">
                <ContactForm dict={dict} locale={locale} />
            </div>

            <Footer />
        </main>
    );
}
