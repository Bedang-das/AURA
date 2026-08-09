"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  return (
    <main className="w-full mx-auto px-4 sm:px-8 pt-4 pb-32 space-y-24 max-w-[1400px]">
      
      {/* 1. The Roadmap Carousel */}
      <section className="w-full space-y-8">
        <h2 className="font-serif text-[40px] tracking-tight text-espresso leading-none">
          <span className="font-bold">The roadmap.</span>{" "}
          <span className="text-gray-500 font-medium">Track your 31-day journey.</span>
        </h2>
        
        <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar">
          
          {/* Completed Day (White with thin border, Sage icon) */}
          <div className="snap-start shrink-0 w-[400px] h-[480px] bg-white border border-gray-200/50 rounded-[2rem] p-10 flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow cursor-pointer">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sage">Day 12</span>
              <h3 className="font-serif text-3xl font-bold text-espresso mt-4 leading-tight tracking-tight">
                Transformers & Attention
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-sage">check_circle</span>
              <span className="text-sm font-medium text-gray-600 font-sans">Score: 92%</span>
            </div>
          </div>

          {/* Completed Day (White with thin border, Sage icon) */}
          <div className="snap-start shrink-0 w-[400px] h-[480px] bg-white border border-gray-200/50 rounded-[2rem] p-10 flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow cursor-pointer">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sage">Day 13</span>
              <h3 className="font-serif text-3xl font-bold text-espresso mt-4 leading-tight tracking-tight">
                Transfer Learning & Fine-Tuning
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-sage">check_circle</span>
              <span className="text-sm font-medium text-gray-600 font-sans">Score: 88%</span>
            </div>
          </div>

          {/* Active Day (Terracotta/Warm Gray) */}
          <Link href="/day/14" className="snap-start shrink-0 w-[400px] h-[480px] bg-espresso rounded-[2rem] p-10 flex flex-col justify-between group hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta/20 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta">Up Next Today</span>
              <h3 className="font-serif text-3xl font-bold text-white mt-4 leading-tight tracking-tight">
                Neural Architecture Search
              </h3>
              <p className="text-gray-300 mt-4 text-[15px] font-sans font-medium leading-relaxed">
                Dive into automated techniques for designing optimal neural network architectures.
              </p>
            </div>
            <div className="relative z-10 flex items-center justify-between mt-auto pt-8">
              <div className="flex items-center space-x-2 text-terracotta">
                <span className="material-symbols-outlined text-[20px]">play_circle</span>
                <span className="text-sm font-bold font-sans">Start Practice</span>
              </div>
            </div>
          </Link>

          {/* Locked Day (Paper Variant) */}
          <div className="snap-start shrink-0 w-[400px] h-[480px] bg-paper-variant rounded-[2rem] p-10 flex flex-col justify-between opacity-80 border border-gray-200/50">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Day 15</span>
              <h3 className="font-serif text-3xl font-bold text-gray-700 mt-4 leading-tight tracking-tight">
                Model Context Protocol (MCP)
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-gray-400">lock</span>
              <span className="text-sm font-medium text-gray-500 font-sans">Unlocks tomorrow</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. The Difference Section (Stats Grid) */}
      <section className="w-full space-y-8 pt-8">
        <h2 className="font-serif text-[40px] tracking-tight text-espresso leading-none">
          <span className="font-bold">The Aura difference.</span>{" "}
          <span className="text-gray-500 font-medium">Your performance metrics.</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat Card 1 */}
          <div className="bg-white border border-gray-200/50 rounded-[1.5rem] p-8 flex flex-col items-start shadow-sm">
            <div className="w-12 h-12 mb-6">
              <span className="material-symbols-outlined text-[40px] text-terracotta font-light">local_fire_department</span>
            </div>
            <h3 className="font-serif text-[28px] font-bold text-espresso tracking-tight mb-2">12 Day Streak</h3>
            <p className="text-[15px] text-gray-500 font-medium leading-relaxed font-sans">You're in the top 5% of engineers this week.</p>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white border border-gray-200/50 rounded-[1.5rem] p-8 flex flex-col items-start shadow-sm">
            <div className="w-12 h-12 mb-6">
              <span className="material-symbols-outlined text-[40px] text-sage font-light">monitoring</span>
            </div>
            <h3 className="font-serif text-[28px] font-bold text-espresso tracking-tight mb-2">94.2% Accuracy</h3>
            <p className="text-[15px] text-gray-500 font-medium leading-relaxed font-sans">Your practice accuracy is trending +2.1% higher.</p>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white border border-gray-200/50 rounded-[1.5rem] p-8 flex flex-col items-start shadow-sm">
            <div className="w-12 h-12 mb-6">
              <span className="material-symbols-outlined text-[40px] text-espresso font-light">school</span>
            </div>
            <h3 className="font-serif text-[28px] font-bold text-espresso tracking-tight mb-2">Expert Level</h3>
            <p className="text-[15px] text-gray-500 font-medium leading-relaxed font-sans">Ready for Capstone Interview Phase 3.</p>
          </div>
        </div>
      </section>

    </main>
  );
}
