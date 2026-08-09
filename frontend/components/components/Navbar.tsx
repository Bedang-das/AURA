"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDashboard = pathname === "/dashboard";
  const isExam = pathname?.startsWith("/day/");
  const isCapstone = pathname?.startsWith("/interview/capstone");

  return (
    <header className={`w-full fixed top-0 left-0 z-50 transition-all duration-500 ease-in-out ${isScrolled ? "bg-[#FDFCF8]/80 backdrop-blur-xl border-b border-black/5 py-4" : "bg-transparent py-8 border-transparent"}`}>
      
      {/* Tier 2: The Store Header */}
      <div className="w-full flex justify-center items-center text-center opacity-0 animate-slide-up">
        <h1 className="text-4xl font-serif font-bold text-espresso tracking-tight leading-none mx-auto">
          Aura.
        </h1>
      </div>

      {/* Tier 3: Product Icon Sub-nav */}
      <div className={`w-full max-w-[1400px] px-8 flex justify-center space-x-12 overflow-x-auto hide-scrollbar mx-auto opacity-0 animate-slide-up delay-100 transition-all duration-500 ease-in-out ${isScrolled ? "opacity-0 h-0 overflow-hidden pointer-events-none transform -translate-y-4" : "opacity-100 h-auto transform translate-y-0 mt-4"}`}>
        
        <Link href="/dashboard" className="flex flex-col items-center group min-w-[72px]">
          <div className="w-10 h-10 mb-1 flex items-center justify-center">
             <span className={`material-symbols-outlined text-[28px] font-light transition-colors ${isDashboard ? 'text-terracotta' : 'text-gray-700 group-hover:text-terracotta'}`}>map</span>
          </div>
          <span className={`text-[11px] font-medium transition-colors font-sans ${isDashboard ? 'text-terracotta' : 'text-gray-700 group-hover:text-terracotta'}`}>Roadmap</span>
        </Link>
        
        <Link href="/day/14" className="flex flex-col items-center group min-w-[72px]">
          <div className="w-10 h-10 mb-1 flex items-center justify-center">
             <span className={`material-symbols-outlined text-[28px] font-light transition-colors ${isExam ? 'text-terracotta' : 'text-gray-700 group-hover:text-terracotta'}`}>quiz</span>
          </div>
          <span className={`text-[11px] font-medium transition-colors font-sans ${isExam ? 'text-terracotta' : 'text-gray-700 group-hover:text-terracotta'}`}>Daily Exam</span>
        </Link>
        
        <Link href="/interview/capstone" className="flex flex-col items-center group min-w-[72px]">
          <div className="w-10 h-10 mb-1 flex items-center justify-center">
             <span className={`material-symbols-outlined text-[28px] font-light transition-colors ${isCapstone ? 'text-terracotta' : 'text-gray-700 group-hover:text-terracotta'}`}>terminal</span>
          </div>
          <span className={`text-[11px] font-medium transition-colors font-sans ${isCapstone ? 'text-terracotta' : 'text-gray-700 group-hover:text-terracotta'}`}>Capstone</span>
        </Link>

      </div>
    </header>
  );
}
