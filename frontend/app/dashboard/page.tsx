"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle } from "lucide-react";
import curriculumData from "@/data/curriculum.json";

export default function DashboardPage() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  return (
    <main className="relative w-full mx-auto px-4 sm:px-8 pt-48 pb-32 space-y-24 max-w-[1400px] overflow-hidden z-0">
      {/* Ambient Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#CC6644] opacity-[0.05] rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-[#CC6644] opacity-[0.04] rounded-full blur-[100px] pointer-events-none -z-10" />
      
      {/* 1. The Roadmap Carousel */}
      <section className="w-full space-y-8 opacity-0 animate-slide-up delay-200 mt-16">
        <h2 className="font-serif text-[40px] tracking-tight text-espresso leading-none">
          <span className="font-bold">The roadmap.</span>{" "}
          <span className="text-gray-500 font-medium">Track your 31-day journey.</span>
        </h2>
        
        <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar">
          
          {curriculumData.days.map((dayData: any) => {
            const isCompleted = dayData.day < 14;
            const isActive = dayData.day === 14;
            const isLocked = dayData.day > 14;
            
            const description = Array.isArray(dayData.objectives) && dayData.objectives.length > 0 
              ? dayData.objectives[0] 
              : "Technical concepts and foundations.";
            
            if (isCompleted) {
              return (
                <div 
                  key={dayData.day}
                  onClick={() => setSelectedCard(dayData.day)}
                  className="snap-start shrink-0 w-[320px] min-h-[400px] bg-white border border-gray-200/50 rounded-[2rem] p-10 flex flex-col hover:-translate-y-2 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 ease-out cursor-pointer"
                >
                  <div className="flex-grow">
                    <span className="text-xs font-bold uppercase tracking-wider text-sage">Day {dayData.day}</span>
                    <h3 className="font-serif text-xl font-bold text-espresso mt-4 leading-tight tracking-tight">
                      {dayData.title}
                    </h3>
                    <p className="text-sm text-[#57534E] mt-3">
                      {description}
                    </p>
                  </div>
                  
                  <AnimatePresence>
                    {selectedCard === dayData.day && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <Link href={`/learn/${dayData.day}`}>
                          <div className="mt-6 pt-4 border-t border-black/5 flex items-center gap-2 text-[#CC6644] font-medium transition-all">
                            <PlayCircle className="w-5 h-5" /> 
                            <span>Get Started</span>
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }
            
            if (isActive) {
              return (
                <div 
                  key={dayData.day}
                  onClick={() => setSelectedCard(dayData.day)}
                  className="snap-start shrink-0 w-[320px] min-h-[400px] bg-espresso rounded-[2rem] p-10 flex flex-col group hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(217,119,87,0.25)] transition-all duration-400 ease-out cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-terracotta/30 group-hover:scale-110 transition-all duration-500"></div>
                  
                  <div className="relative z-10 flex-grow">
                    <span className="text-xs font-bold uppercase tracking-wider text-terracotta">Up Next Today</span>
                    <h3 className="font-serif text-xl font-bold text-white mt-4 leading-tight tracking-tight">
                      {dayData.title}
                    </h3>
                    <p className="text-sm text-gray-300 mt-3 font-sans">
                      {description}
                    </p>
                  </div>
                  
                  <AnimatePresence>
                    {selectedCard === dayData.day && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="relative z-10"
                      >
                        <Link href={`/learn/${dayData.day}`}>
                          <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-[#CC6644] font-medium transition-all">
                            <PlayCircle className="w-5 h-5" /> 
                            <span>Get Started</span>
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }
            
            // isLocked
            return (
              <div 
                key={dayData.day}
                onClick={() => setSelectedCard(dayData.day)}
                className="snap-start shrink-0 w-[320px] min-h-[400px] bg-paper-variant rounded-[2rem] p-10 flex flex-col opacity-80 border border-gray-200/50 cursor-pointer"
              >
                <div className="flex-grow">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Day {dayData.day}</span>
                  <h3 className="font-serif text-xl font-bold text-gray-700 mt-4 leading-tight tracking-tight">
                    {dayData.title}
                  </h3>
                  <p className="text-sm text-[#57534E] mt-3">
                    {description}
                  </p>
                </div>
                
                <AnimatePresence>
                  {selectedCard === dayData.day && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <Link href={`/learn/${dayData.day}`}>
                        <div className="mt-6 pt-4 border-t border-black/5 flex items-center gap-2 text-[#CC6644] font-medium transition-all">
                          <PlayCircle className="w-5 h-5" /> 
                          <span>Get Started</span>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. The Difference Section (Stats Grid) */}
      <section className="w-full space-y-8 pt-8 opacity-0 animate-slide-up delay-300">
        <h2 className="font-serif text-[40px] tracking-tight text-espresso leading-none">
          <span className="font-bold">The Aura difference.</span>{" "}
          <span className="text-gray-500 font-medium">Your performance metrics.</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat Card 1 */}
          <div className="bg-white border border-gray-200/50 rounded-[1.5rem] p-8 flex flex-col items-start shadow-sm hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 ease-out">
            <div className="w-12 h-12 mb-6">
              <span className="material-symbols-outlined text-[40px] text-terracotta font-light">local_fire_department</span>
            </div>
            <h3 className="font-serif text-[28px] font-bold text-espresso tracking-tight mb-2">12 Day Streak</h3>
            <p className="text-[15px] text-gray-500 font-medium leading-relaxed font-sans">You're in the top 5% of engineers this week.</p>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white border border-gray-200/50 rounded-[1.5rem] p-8 flex flex-col items-start shadow-sm hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 ease-out">
            <div className="w-12 h-12 mb-6">
              <span className="material-symbols-outlined text-[40px] text-sage font-light">monitoring</span>
            </div>
            <h3 className="font-serif text-[28px] font-bold text-espresso tracking-tight mb-2">94.2% Accuracy</h3>
            <p className="text-[15px] text-gray-500 font-medium leading-relaxed font-sans">Your practice accuracy is trending +2.1% higher.</p>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white border border-gray-200/50 rounded-[1.5rem] p-8 flex flex-col items-start shadow-sm hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 ease-out">
            <div className="w-12 h-12 mb-6">
              <span className="material-symbols-outlined text-[40px] text-espresso font-light">school</span>
            </div>
            <h3 className="font-serif text-[28px] font-bold text-espresso tracking-tight mb-2">Expert Level</h3>
            <p className="text-[15px] text-gray-500 font-medium leading-relaxed font-sans">Ready for Exercise Phase 3.</p>
          </div>
        </div>
      </section>

    </main>
  );
}
