import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default async function LearnPage({ params }: { params: { id: string } }) {
  const dayId = parseInt(params.id, 10);
  
  // Read curriculum.json
  const dataPath = path.join(process.cwd(), 'data', 'curriculum.json');
  let dayData = null;
  
  try {
    const curriculumRaw = fs.readFileSync(dataPath, 'utf-8');
    const curriculum = JSON.parse(curriculumRaw);
    dayData = curriculum.days.find((d: any) => d.day === dayId);
  } catch (error) {
    console.error("Error loading curriculum:", error);
  }

  if (!dayData) {
    return (
      <main className="w-full mx-auto px-6 pt-48 pb-32 max-w-3xl text-center">
        <h1 className="text-2xl font-serif text-espresso">Learning material not found for Day {params.id}</h1>
        <Link href="/dashboard" className="text-terracotta hover:underline mt-4 inline-block">Back to Roadmap</Link>
      </main>
    );
  }

  return (
    <main className="w-full mx-auto px-6 pt-48 pb-32 font-sans bg-[#FDFCF8] min-h-screen">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Header Section */}
        <header>
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-[#CC6644] hover:underline text-sm font-medium mb-8">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Roadmap
          </Link>
          
          <div className="space-y-2">
            <span className="text-xs font-semibold tracking-widest text-[#CC6644] uppercase">
              Day {dayData.day} · {dayData.type}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-[#1C1917] font-bold tracking-tight mt-2 mb-6 leading-tight">
              {dayData.title}
            </h1>
          </div>
        </header>

        {/* Tools & Technologies Section */}
        <section>
          <h2 className="text-xl font-serif font-bold text-[#1C1917] mb-4">Tools & Technologies</h2>
          <div className="flex flex-wrap gap-2 mb-8">
            {dayData.tools.map((tool: string, i: number) => (
              <span key={i} className="bg-[#F5F4F0] text-[#1C1917] text-xs font-medium px-4 py-2 rounded-full border border-black/5">
                {tool}
              </span>
            ))}
          </div>
        </section>

        {/* Learning Objectives Section */}
        <section>
          <div className="bg-white/70 backdrop-blur-lg rounded-[2rem] p-8 border border-black/5 shadow-sm">
            <h2 className="text-xl font-serif font-bold text-[#1C1917] mb-6">Day Objectives</h2>
            <ul className="space-y-4">
              {dayData.objectives.map((obj: string, i: number) => (
                <li key={i} className="flex gap-4 items-start text-[#1C1917] leading-relaxed text-[15px] font-medium">
                  <span className="material-symbols-outlined text-[#849D8C] shrink-0 mt-0.5">check_circle</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* The Exam Handoff Action (Bottom) */}
        <div className="mt-16 text-center pt-8 border-t border-black/5">
          <p className="text-gray-500 text-sm mb-6 font-medium">Ready to test your knowledge on {dayData.title}?</p>
          <Link 
            href={`/interview/exercise`}
            className="inline-flex items-center gap-2 bg-[#CC6644] hover:bg-[#b55539] text-[#FDFCF8] font-medium px-8 py-4 rounded-full transition-all shadow-sm"
          >
            Start Exercise <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
        
      </div>
    </main>
  );
}
