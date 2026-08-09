import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-paper z-50 sticky top-0 flex flex-col items-center">
      
      {/* Tier 2: The Store Header */}
      <div className="w-full max-w-[1400px] px-8 pt-10 pb-6 flex justify-between items-end">
        <h1 className="text-[40px] font-serif font-bold text-espresso tracking-tight leading-none">
          Aura.
        </h1>
        <div className="flex flex-col items-end text-sm">
          <span className="text-gray-500 font-medium font-sans">The best way to prepare for AI engineering.</span>
          <Link href="#" className="text-terracotta hover:underline font-sans">Need help? Ask a Specialist</Link>
        </div>
      </div>

      {/* Tier 3: Product Icon Sub-nav */}
      <div className="w-full max-w-[1400px] px-8 pb-10 flex space-x-12 overflow-x-auto hide-scrollbar">
        
        <Link href="/dashboard" className="flex flex-col items-center group min-w-[72px]">
          <div className="w-16 h-16 mb-2 flex items-center justify-center">
             <span className="material-symbols-outlined text-[36px] text-gray-700 font-light group-hover:text-terracotta transition-colors">map</span>
          </div>
          <span className="text-[13px] font-medium text-gray-700 group-hover:text-terracotta transition-colors font-sans">Roadmap</span>
        </Link>
        
        <Link href="#" className="flex flex-col items-center group min-w-[72px]">
          <div className="w-16 h-16 mb-2 flex items-center justify-center">
             <span className="material-symbols-outlined text-[36px] text-gray-700 font-light group-hover:text-terracotta transition-colors">auto_stories</span>
          </div>
          <span className="text-[13px] font-medium text-gray-700 group-hover:text-terracotta transition-colors font-sans">Learn</span>
        </Link>
        
        <Link href="/day/14" className="flex flex-col items-center group min-w-[72px]">
          <div className="w-16 h-16 mb-2 flex items-center justify-center">
             <span className="material-symbols-outlined text-[36px] text-gray-700 font-light group-hover:text-terracotta transition-colors">quiz</span>
          </div>
          <span className="text-[13px] font-medium text-gray-700 group-hover:text-terracotta transition-colors font-sans">Exam</span>
        </Link>
        
        <Link href="/interview/capstone" className="flex flex-col items-center group min-w-[72px]">
          <div className="w-16 h-16 mb-2 flex items-center justify-center">
             <span className="material-symbols-outlined text-[36px] text-gray-700 font-light group-hover:text-terracotta transition-colors">terminal</span>
          </div>
          <span className="text-[13px] font-medium text-gray-700 group-hover:text-terracotta transition-colors font-sans">Terminal</span>
        </Link>
        
        <Link href="#" className="flex flex-col items-center group min-w-[72px]">
          <div className="w-16 h-16 mb-2 flex items-center justify-center">
             <span className="material-symbols-outlined text-[36px] text-gray-700 font-light group-hover:text-terracotta transition-colors">account_circle</span>
          </div>
          <span className="text-[13px] font-medium text-gray-700 group-hover:text-terracotta transition-colors font-sans">Profile</span>
        </Link>

      </div>
    </nav>
  );
}
