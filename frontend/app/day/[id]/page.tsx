"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, ExternalLink, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function DPPExamPage({ params }: { params: { id: string } }) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const question = {
    title: "Question 1 of 15",
    difficulty: "Hard",
    topic: "Neural Architecture Search",
    text: "In the context of differentiable Neural Architecture Search (e.g., DARTS), how does the continuous relaxation of the architecture representation resolve the non-differentiability of the discrete search space?",
    options: [
      "(A) By applying REINFORCE to estimate the gradients of the discrete decisions without needing backpropagation.",
      "(B) By replacing discrete categorical choices with a softmax over all possible operations, allowing standard gradient descent via backpropagation.",
      "(C) By utilizing evolutionary algorithms to mutate architecture weights continuously across generations.",
      "(D) By quantizing the model weights so that step functions can be used for activation routing.",
    ],
    correctOption: 1, // B
    explanation: `**Correct Concept: Continuous Relaxation via Softmax**\n\nDARTS (Differentiable Architecture Search) transforms the discrete search space of candidate operations (e.g., convolutions, pooling) into a continuous space. It does this by placing a **softmax distribution** over all possible operations between two nodes.\n\nInstead of selecting a single discrete operation, the output of a node is computed as a weighted sum of all operations, where the weights are the softmax probabilities (architecture parameters $\\alpha$). Because this process is continuous, we can use standard gradient descent to optimize both the network weights and the architecture parameters simultaneously.\n\n### Key Takeaways:\n- Avoids the high sample complexity of RL (REINFORCE) and Evolutionary methods.\n- Enables joint optimization of weights and architecture.`,
    references: [
      { name: "DARTS: Differentiable Architecture Search (Liu et al., 2018)", url: "#" },
      { name: "AURA Docs: Continuous Relaxation", url: "#" }
    ]
  };

  const handleSelect = (index: number) => {
    if (!isSubmitted) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = () => {
    if (selectedOption !== null) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-100">
              Day {params.id} Practice
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{question.topic}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-sm font-medium">
          <span className="text-slate-500">{question.title}</span>
          <span className="px-2 py-1 bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wide rounded-md border border-rose-100 shadow-sm">
            {question.difficulty}
          </span>
        </div>
      </div>

      {/* Main Content & Drawer Split */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Question Engine */}
        <div className={`flex-1 overflow-y-auto p-8 lg:p-12 transition-all duration-300 ${isSubmitted ? 'lg:w-1/2' : 'w-full max-w-4xl mx-auto'}`}>
          <h2 className="text-2xl text-slate-900 font-medium leading-relaxed tracking-tight mb-10">
            {question.text}
          </h2>

          <div className="flex flex-col gap-4">
            {question.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === question.correctOption;
              
              let styleClass = "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 text-slate-700 cursor-pointer";
              
              if (isSelected && !isSubmitted) {
                styleClass = "border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm ring-1 ring-blue-600";
              } else if (isSubmitted) {
                if (isCorrect) {
                  styleClass = "border-emerald-500 bg-emerald-50/50 text-emerald-900 shadow-sm ring-1 ring-emerald-500";
                } else if (isSelected && !isCorrect) {
                  styleClass = "border-rose-500 bg-rose-50/50 text-rose-900 opacity-80";
                } else {
                  styleClass = "border-slate-200 bg-white opacity-50 cursor-not-allowed";
                }
              }

              return (
                <div 
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`p-6 rounded-xl border transition-all duration-200 ${styleClass}`}
                >
                  <p className="font-medium leading-relaxed">{option}</p>
                </div>
              );
            })}
          </div>

          {!isSubmitted && (
            <div className="mt-10 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-sm
                  ${selectedOption !== null 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
              >
                Submit Answer
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Feedback Drawer (Evaluated State) */}
        {isSubmitted && (
          <div className="hidden lg:flex w-1/2 bg-slate-50 border-l border-slate-200 flex-col overflow-y-auto animate-in slide-in-from-right-8 duration-300">
            <div className="p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-6">
                {selectedOption === question.correctOption ? (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                    <span className="text-2xl font-bold tracking-tight">Correct</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-600">
                    <XCircle className="w-8 h-8" />
                    <span className="text-2xl font-bold tracking-tight">Incorrect</span>
                  </div>
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mb-8">
                <div className="flex items-center gap-2 text-blue-600 font-bold tracking-wide uppercase text-sm mb-4">
                  <Lightbulb className="w-5 h-5" />
                  Explanation
                </div>
                <div className="prose prose-slate prose-blue max-w-none">
                  <ReactMarkdown>{question.explanation}</ReactMarkdown>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 tracking-tight">External References</h3>
                <div className="flex flex-col gap-3">
                  {question.references.map((ref, idx) => (
                    <a key={idx} href={ref.url} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors group">
                      <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{ref.name}</span>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                 <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-sm">
                    Next Question
                    <ChevronRight className="w-5 h-5" />
                 </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
