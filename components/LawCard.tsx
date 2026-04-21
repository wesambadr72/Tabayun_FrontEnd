import React from 'react';
import { Comparison } from '@/types/law';
import Link from 'next/link';

interface LawCardProps {
  comparison: Comparison;
  locale: string;
}

export const LawCard = ({ comparison, locale }: LawCardProps) => {
  const isAr = locale === 'ar';
  
  return (
    <Link 
      href={`/${locale}/laws/${comparison.id}`}
      className="block w-full bg-[#a37c5a] hover:bg-[#8b6a4d] text-white rounded-[2rem] p-8 md:p-10 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] shadow-lg hover:shadow-2xl relative overflow-hidden group"
    >
      {/* Decorative background circle */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
      
      <div className="relative z-10 space-y-4">
        <h3 className="text-3xl md:text-4xl font-black leading-tight">
          {comparison.title}
        </h3>
        
        <p className="text-white/80 text-lg md:text-xl font-medium leading-relaxed max-w-3xl">
          {comparison.simplified_description}
        </p>
      </div>
      
      {/* Optional: Add a small icon or arrow indicating it's clickable */}
      <div className={`absolute bottom-8 ${isAr ? 'left-8' : 'right-8'} opacity-0 group-hover:opacity-100 transition-opacity`}>
        <svg 
          className={`w-8 h-8 ${isAr ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
};
