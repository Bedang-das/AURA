import Link from "next/link";
import { CheckCircle2, ChevronRight, Target, Flame, BrainCircuit } from "lucide-react";

function RadialProgress({ progress }: { progress: number }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-slate-100"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-blue-600 transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-bold text-slate-900 tracking-tighter">13<span className="text-2xl text-slate-400">/31</span></span>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Days Completed</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const roadmap = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    title: i === 13 ? "Neural Architecture Search" : `Day ${i + 1} Module`,
    status: i < 13 ? "completed" : i === 13 ? "active" : "locked",
  }));

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-16 px-4 border-b border-slate-200 bg-white">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Your Progress</h1>
        <p className="text-slate-500 mb-8">You are in the top 5% of candidates for the APEX AI role.</p>
        
        <div className="flex items-center gap-12">
          <div className="flex flex-col gap-4 text-right">
            <div className="flex items-center justify-end gap-2 text-slate-700">
              <span className="font-semibold">92%</span>
              <BrainCircuit className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Avg Accuracy</div>
          </div>
          
          <RadialProgress progress={(13 / 31) * 100} />
          
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-center gap-2 text-slate-700">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-semibold">13 Days</span>
            </div>
            <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Current Streak</div>
          </div>
        </div>
      </div>

      {/* 31-Day Roadmap Bento Grid */}
      <div className="flex-1 p-8 overflow-hidden flex flex-col max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Curriculum Roadmap</h2>
          <div className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
            Phase 2: Advanced Architectures
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto pb-20 pr-2">
          {roadmap.map((item) => (
            <div
              key={item.day}
              className={`relative p-5 rounded-2xl border transition-all duration-200 ${
                item.status === "completed"
                  ? "bg-white border-slate-200 hover:border-slate-300"
                  : item.status === "active"
                  ? "bg-blue-50/50 border-blue-600 shadow-md transform -translate-y-1"
                  : "bg-slate-50 border-slate-100 opacity-60"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide ${
                  item.status === "active" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  Day {item.day}
                </span>
                {item.status === "completed" && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                {item.status === "active" && <Target className="w-5 h-5 text-blue-600" />}
              </div>
              
              <h3 className={`font-semibold mb-2 ${item.status === "active" ? "text-slate-900" : "text-slate-700"}`}>
                {item.title}
              </h3>
              
              {item.status === "completed" && (
                <p className="text-sm text-slate-500">Score: 9/10</p>
              )}
              
              {item.status === "active" && (
                <Link href={`/day/${item.day}`} className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors shadow-sm">
                  Start DPP
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
