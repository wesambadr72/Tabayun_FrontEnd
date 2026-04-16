import { Comparison } from '@/types/law';
import { ExternalLink, Info, CheckCircle2 } from 'lucide-react';

interface ComparisonDetailCardProps {
  comparison: Comparison;
  locale: string;
}

export const ComparisonDetailCard = ({ comparison, locale }: ComparisonDetailCardProps) => {
  const isAr = locale === 'ar';
  
  if (!comparison || !comparison.saudi_law || !comparison.foreign_law) {
    return (
      <div className="w-full p-8 bg-red-50 border border-red-100 rounded-[2.5rem] text-red-500 font-bold text-center">
        {isAr ? 'خطأ في عرض بيانات المقارنة' : 'Error displaying comparison data'}
      </div>
    );
  }

  const { saudi_law, foreign_law, comparison_text } = comparison;

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Section: Side-by-Side Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Saudi Law Card (Dark) */}
        <div className="bg-[#3d2e20] text-white rounded-[2.5rem] p-8 md:p-10 shadow-xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-green-500/20 p-2 rounded-full border border-green-500/30">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-right">
              <span className="text-[#d4c5b5]/40 text-xs font-black uppercase tracking-widest block mb-1">
                {saudi_law?.country || (isAr ? 'المملكة العربية السعودية' : 'Saudi Arabia')}
              </span>
              <span className="text-2xl font-black">SA</span>
            </div>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
            {saudi_law?.title}
          </h3>
          
          <p className="text-[#d4c5b5]/60 text-base md:text-lg font-medium leading-relaxed mb-8">
            {saudi_law?.simplified_text}
          </p>

          {saudi_law?.source_url && (
            <a 
              href={saudi_law.source_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-black text-[#d4c5b5]/40 hover:text-white transition-colors border-t border-white/5 pt-4 w-full"
            >
              {isAr ? 'المصدر الأصلي' : 'Original Source'} <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Foreign Law Card (Light) */}
        <div className="bg-white text-[#3d2e20] rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-[#3d2e20]/5 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-[#f5f1eb] p-2 rounded-full border border-[#3d2e20]/5 text-[#3d2e20]/20">
              <Info className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="text-[#3d2e20]/30 text-xs font-black uppercase tracking-widest block mb-1">
                {foreign_law?.country}
              </span>
              <span className="text-2xl font-black">DE</span>
            </div>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
            {foreign_law?.title}
          </h3>
          
          <p className="text-[#3d2e20]/50 text-base md:text-lg font-medium leading-relaxed mb-8">
            {foreign_law?.simplified_text}
          </p>

          {foreign_law?.source_url && (
            <a 
              href={foreign_law.source_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-black text-[#3d2e20]/20 hover:text-[#3d2e20] transition-colors border-t border-[#3d2e20]/5 pt-4 w-full"
            >
              {isAr ? 'المصدر الأصلي' : 'Original Source'} <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Bottom Section: Comparison Text */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#3d2e20]/10 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-4 flex-1">
            <h4 className="text-2xl md:text-3xl font-black text-[#3d2e20]">
              {isAr ? 'ما هو التباين؟' : 'What is the difference?'}
            </h4>
            <p className="text-[#3d2e20]/70 text-lg md:text-xl font-bold leading-relaxed italic">
              {comparison_text}
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-[#3d2e20] rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
              <Info className="w-8 h-8" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Decorative Background Icon */}
        <div className="absolute top-1/2 -translate-y-1/2 end-10 opacity-[0.03] pointer-events-none">
          <ScaleIcon className="w-64 h-64 text-[#3d2e20]" />
        </div>
      </div>
    </div>
  );
};

const ScaleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
);
