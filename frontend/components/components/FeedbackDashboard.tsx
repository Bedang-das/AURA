import { CheckCircle2, ChevronRight } from "lucide-react";
import SkillRadar from "./SkillRadar";
import Link from "next/link";

export default function FeedbackDashboard() {
  return (
    <div className="flex-1 flex flex-col p-8 md:p-12 overflow-y-auto w-full max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Final Assessment Score</h1>
        <div className="mt-4 flex items-center justify-center gap-4">
          <span className="text-6xl font-black text-blue-600 tracking-tighter">82<span className="text-4xl text-slate-300">/100</span></span>
        </div>
        <p className="mt-4 text-slate-500 font-medium uppercase tracking-widest text-sm">Competency: Advanced</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center">
          <h2 className="text-lg font-bold text-slate-900 mb-6 w-full text-left">Competency Overview</h2>
          <SkillRadar />
        </div>

        <div className="flex flex-col gap-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Strengths</h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-slate-700 font-medium">Agentic AI Architecture</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-slate-700 font-medium">Prompt Engineering</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-slate-700 font-medium">LLM Fundamentals</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Knowledge Gaps</h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></div>
                <span className="text-slate-600">Vector Databases Indexing Strategies</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></div>
                <span className="text-slate-600">Agent Evaluation Metrics</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-3xl p-8 shadow-sm">
             <h2 className="text-lg font-bold text-blue-900 mb-2">Recommended Next Steps</h2>
             <p className="text-blue-800/80 leading-relaxed text-sm">
               Review vector indexing and retrieval strategies (specifically HNSW). Practice agent evaluation techniques to improve reliability in autonomous loops.
             </p>
             <Link href="/dashboard" className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm text-sm">
                Return to Roadmap
                <ChevronRight className="w-4 h-4" />
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
