"use client";

import { useState } from "react";
import Link from "next/link";

export default function DPPPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <main className="relative w-full mx-auto px-4 sm:px-8 pt-48 pb-32 max-w-[1000px]">
      
      {/* Top Header */}
      <header className="fixed top-8 left-0 right-0 w-full max-w-[1400px] mx-auto px-8 z-[60]">
        <div className="flex justify-between items-center w-full">
          <Link href="/dashboard" className="text-terracotta hover:underline text-sm font-medium flex items-center gap-1 font-sans">
             <span className="material-symbols-outlined text-[16px]">chevron_left</span> Back to Roadmap
          </Link>
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium font-sans">
            <span className="material-symbols-outlined text-[18px]">timer</span>
            <span>12:45</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <section className="flex flex-col gap-16">
        
        {/* Question Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6 mt-16">
          <span className="text-sm font-bold uppercase tracking-widest text-terracotta font-sans">Question 4 of 12</span>
          <h1 className="font-serif text-espresso font-bold tracking-tight" style={{ fontSize: '48px', lineHeight: '1.2' }}>
            Which search strategy uses a controller RNN to sample child architectures?
          </h1>
        </div>

        {/* Options Stack */}
        <div className="max-w-2xl mx-auto w-full space-y-4 font-sans">
          
          <button 
            onClick={() => setSelectedOption("A")}
            className={`w-full rounded-[1.5rem] p-6 flex items-center justify-between transition-all border ${
              selectedOption === "A" ? 'bg-white border-sage text-espresso shadow-sm' : 'bg-white border-gray-200/50 text-espresso hover:border-gray-300'
            }`}
          >
            <span className="text-[17px] font-medium">Evolutionary Algorithms</span>
            <span className={`w-6 h-6 rounded-full border flex items-center justify-center ${selectedOption === "A" ? 'border-sage bg-sage text-white' : 'border-gray-300'}`}>
               {selectedOption === "A" && <span className="material-symbols-outlined text-[16px] font-bold">check</span>}
            </span>
          </button>

          <button 
            onClick={() => setSelectedOption("B")}
            className={`w-full rounded-[1.5rem] p-6 flex items-center justify-between transition-all border ${
              selectedOption === "B" ? 'bg-white border-sage text-espresso shadow-sm' : 'bg-white border-gray-200/50 text-espresso hover:border-gray-300'
            }`}
          >
            <span className="text-[17px] font-medium">Reinforcement Learning</span>
            <span className={`w-6 h-6 rounded-full border flex items-center justify-center ${selectedOption === "B" ? 'border-sage bg-sage text-white' : 'border-gray-300'}`}>
               {selectedOption === "B" && <span className="material-symbols-outlined text-[16px] font-bold">check</span>}
            </span>
          </button>

          <button 
            onClick={() => setSelectedOption("C")}
            className={`w-full rounded-[1.5rem] p-6 flex items-center justify-between transition-all border ${
              selectedOption === "C" ? 'bg-white border-sage text-espresso shadow-sm' : 'bg-white border-gray-200/50 text-espresso hover:border-gray-300'
            }`}
          >
            <span className="text-[17px] font-medium">Gradient-based Search (DARTS)</span>
            <span className={`w-6 h-6 rounded-full border flex items-center justify-center ${selectedOption === "C" ? 'border-sage bg-sage text-white' : 'border-gray-300'}`}>
               {selectedOption === "C" && <span className="material-symbols-outlined text-[16px] font-bold">check</span>}
            </span>
          </button>

          <button 
            onClick={() => setSelectedOption("D")}
            className={`w-full rounded-[1.5rem] p-6 flex items-center justify-between transition-all border ${
              selectedOption === "D" ? 'bg-white border-sage text-espresso shadow-sm' : 'bg-white border-gray-200/50 text-espresso hover:border-gray-300'
            }`}
          >
            <span className="text-[17px] font-medium">Random Search</span>
            <span className={`w-6 h-6 rounded-full border flex items-center justify-center ${selectedOption === "D" ? 'border-sage bg-sage text-white' : 'border-gray-300'}`}>
               {selectedOption === "D" && <span className="material-symbols-outlined text-[16px] font-bold">check</span>}
            </span>
          </button>
          
        </div>

        {/* Right Column: Explanations Drawer (Centered below options) */}
        {selectedOption === "B" && (
          <div className="max-w-2xl mx-auto w-full animate-slide-up font-sans">
            <div className="bg-white border border-gray-200/50 rounded-[2rem] p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-terracotta">info</span>
                <h2 className="text-lg text-espresso font-semibold">Explanation</h2>
              </div>
              
              <div className="text-gray-600 text-[15px] space-y-4 leading-relaxed font-medium">
                <p>You selected <strong>Reinforcement Learning</strong>.</p>
                <p>While RL approaches (like ENAS) do use a controller RNN to sample child architectures, the correct terminology for the specific continuous relaxation method is different.</p>
                <p className="p-5 bg-paper-variant rounded-2xl border border-gray-200/50 text-espresso shadow-sm">
                  Actually, ENAS (Efficient Neural Architecture Search) specifically employs an RNN controller to generate architectural hyper-parameters.
                </p>
              </div>
              
              <div className="pt-8 w-full flex justify-end">
                <Link href="/interview/capstone" className="px-8 py-3 bg-espresso text-white rounded-full font-medium text-sm flex items-center gap-2 hover:bg-black transition-colors">
                  Continue
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
