export interface Law {
    id: string;
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
    // Comparison data
    saudi_title_ar: string;
    saudi_title_en: string;
    saudi_desc_ar: string;
    saudi_desc_en: string;
    difference_ar: string;
    difference_en: string;
}

export const MOCK_LAWS_COLLECTION: Law[] = [
    {
        id: "de-tr-1",
        title_ar: "السرعة على الأوتوبان (ألمانيا)",
        title_en: "Speed on Autobahn (Germany)",
        desc_ar: "لا توجد حدود قصوى للسرعة في العديد من أجزاء الطريق السريع، ولكن يوصى بسرعة 130 كم/ساعة.",
        desc_en: "No general speed limit on many parts of the Autobahn, but 130 km/h is recommended.",
        saudi_title_ar: "السرعة على الطرق السريعة (السعودية)",
        saudi_title_en: "Speed on Highways (Saudi Arabia)",
        saudi_desc_ar: "تتراوح الحدود القصوى بين 120 إلى 140 كم/ساعة حسب الطريق واللوحات الإرشادية.",
        saudi_desc_en: "Speed limits range from 120 to 140 km/h depending on the road and signage.",
        difference_ar: "في ألمانيا، السرعة مفتوحة في أجزاء واسعة، بينما في السعودية هناك حد أقصى صارم يصل لـ 140 كم/ساعة وتجاوزه يعرضك للمخالفة الفورية عبر نظام ساهر.",
        difference_en: "In Germany, speed is unlimited in large sections, whereas in Saudi Arabia, there is a strict maximum of 140 km/h, and exceeding it results in immediate fines via the Saher system.",
    },
    {
        id: "de-tr-2",
        title_ar: "إطارات الشتاء (ألمانيا)",
        title_en: "Winter Tires (Germany)",
        desc_ar: "الالتزام القانوني بتركيب إطارات الشتاء في الظروف الجليدية، وعادة ما تكون من أكتوبر إلى عيد الفصح.",
        desc_en: "Legal obligation to fit winter tires in icy conditions, usually from October to Easter.",
        saudi_title_ar: "صيانة الإطارات (السعودية)",
        saudi_title_en: "Tire Maintenance (Saudi Arabia)",
        saudi_desc_ar: "لا توجد متطلبات موسمية، ولكن يجب أن تكون الإطارات بحالة جيدة وتتحمل درجات الحرارة العالية.",
        saudi_desc_en: "No seasonal requirements, but tires must be in good condition and heat-resistant.",
        difference_ar: "في ألمانيا القانون يركز على الثلوج والجليد، بينما في السعودية لا توجد إطارات شتاء ولكن القانون يركز على سلامة الإطار من التآكل بسبب الحرارة الشديدة.",
        difference_en: "In Germany, the law focuses on snow and ice, while in Saudi Arabia, there are no winter tires, but the law emphasizes tire safety against wear due to extreme heat.",
    },
    // Add more laws derived from the previous mock data
    {
        id: "de-res-1",
        title_ar: "تسجيل العنوان (Anmeldung)",
        title_en: "Address Registration (Anmeldung)",
        desc_ar: "يجب على الجميع تسجيل عنوان سكنهم لدى البلدية خلال 14 يوماً من الانتقال.",
        desc_en: "Everyone must register their residential address with the municipality within 14 days of moving.",
        saudi_title_ar: "العنوان الوطني (السعودية)",
        saudi_title_en: "National Address (Saudi Arabia)",
        saudi_desc_ar: "يجب تسجيل العنوان الوطني عبر منصة نفاذ/سبل وهو شرط أساسي لجميع المعاملات الحكومية.",
        saudi_desc_en: "National Address must be registered via Nafath/SPL and is a prerequisite for all government transactions.",
        difference_ar: "كلا الدولتين تتطلبان تسجيل السكن، لكن في ألمانيا يتم عبر مراجعة البلدية فعلياً، بينما في السعودية يتم رقمياً بالكامل ومرتبط بهويتك الوطنية وتطبيق توكلنا.",
        difference_en: "Both countries require residence registration, but in Germany it's done by visiting the municipality, whereas in Saudi Arabia it's fully digital and linked to your National ID and Tawakkalna app.",
    },
    {
        id: "de-lab-1",
        title_ar: "الحد الأدنى للأجور (ألمانيا)",
        title_en: "Minimum Wage (Germany)",
        desc_ar: "يتم تحديد حد أدنى للأجر بالساعة ويحدث دورياً لضمان مستوى معيشي لائق.",
        desc_en: "A minimum hourly wage is set and updated periodically to ensure a decent standard of living.",
        saudi_title_ar: "نظام الأجور (السعودية)",
        saudi_title_en: "Wage System (Saudi Arabia)",
        saudi_desc_ar: "توجد حدود دنيا لأجور السعوديين في القطاع الخاص (برنامج نطاقات)، وتخضع عقود الوافدين للاتفاق في العقد مع الالتزام بتحويلها عبر نظام حماية الأجور.",
        saudi_desc_en: "Minimum wages exist for Saudis in the private sector (Nitaqat), while expats' contracts are subject to agreement with mandatory transfer via the Wage Protection System.",
        difference_ar: "ألمانيا تحدد سعراً للساعة لجميع العمال، بينما السعودية تركز على توطين الأجور للسعوديين وتضمن وصول الرواتب للجميع عبر نظام 'حماية الأجور' الرقمي.",
        difference_en: "Germany sets an hourly rate for all workers, while Saudi Arabia focuses on wage localization for Saudis and ensures salary delivery for all via the digital 'Wage Protection' system.",
    },
];

export const MOCK_LAWS: Record<string, Record<string, Law[]>> = {
    germany: {
        traffic: [MOCK_LAWS_COLLECTION[0], MOCK_LAWS_COLLECTION[1]],
        residency: [MOCK_LAWS_COLLECTION[2]],
        labor: [MOCK_LAWS_COLLECTION[3]],
        food: [],
        publicDecency: [],
    },
};
