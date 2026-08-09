"use client";

import { useState, useEffect } from "react";
import ChatBox, { Message } from "@/components/ChatBox";
import FeedbackDashboard from "@/components/FeedbackDashboard";

export default function CapstoneInterviewPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "agent",
      content: "Initializing AURA Environment..."
    }
  ]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(88); // Mock score for UI

  const [sessionId] = useState(() => "sess-" + Math.random().toString(36).substring(7));
  const candidateId = "CAND-001";

  // Initial load
  useEffect(() => {
    const startInterview = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, candidateId })
        });
        if (res.ok) {
          const data = await res.json();
          setMessages([{
            id: Date.now().toString(),
            role: "agent",
            content: data.reply
          }]);
        }
      } catch (err) {
        console.error("Failed to start", err);
      }
    };
    startInterview();
  }, [sessionId]);

  const handleSendMessage = async (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsWaiting(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: newMessage.content })
      });
      
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "agent",
          content: data.reply
        }]);
        if (data.done) {
          setIsComplete(true);
        }
        if (data.rolling_avg !== undefined) {
          setScore(Math.round(data.rolling_avg * 10));
        }
      } else {
        throw new Error("Failed to fetch");
      }
      
      setQuestionCount(prev => prev + 1);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: "Error: Could not connect to the AURA Engine. Please check if the backend is running."
      }]);
    } finally {
      setIsWaiting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-paper px-4 md:px-8 pt-40 max-w-[1400px] mx-auto w-full" style={{ minHeight: 'calc(100vh - 120px)' }}>
      
      {/* Header for Mobile */}
      <header className="md:hidden flex justify-between items-center mb-6 py-4">
        <div className="text-[32px] font-serif font-bold text-espresso tracking-tight leading-none">Aura.</div>
        <button className="text-espresso">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 h-full min-h-0 pt-8 pb-12">
        
        {/* Left Sidebar (Candidate Profile & Radar) */}
        {!isComplete && (
        <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6 overflow-y-auto hidden lg:flex h-full pr-4">
          
          <div className="mb-4">
             <h2 className="text-[28px] font-serif font-bold text-espresso tracking-tight">Profile.</h2>
             <p className="text-gray-500 font-medium text-sm font-sans">Your engineering footprint.</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-[1.5rem] p-8 flex flex-col items-center text-center shadow-sm border border-gray-200/50">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-paper">
              <img className="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPkGVU-dxX9UjKDtOEquHcwmc8U2zHLKzG5GBXXGa8LR0_T1q0BnRcsDCu3E_TIwKx58018K6TOmcAqG-gogvXqzyTQ_O__OWvH0QxQENjLT2IXAPywzSSAhnbSkpeHVE7L2pxwzPhx_Mkcjcbp_DKcG_puOUF-QIF2rOcik7agoqpuS13qgH-WWBP3-Yoo874fd4IN9CRC9WBNN2NRyumtm0sBMubY8tVX7sZtdNNGr3QnzYdQCridg" alt="Alex Rivers" />
            </div>
            <h2 className="font-serif text-espresso font-bold text-2xl tracking-tight mb-1">Alex Rivers</h2>
            <p className="font-sans text-gray-500 font-medium text-sm mb-6">Senior AI Engineer</p>
            <div className="flex gap-2 w-full font-sans">
              <button className="flex-1 bg-espresso py-2.5 rounded-full font-medium text-sm text-white hover:bg-black transition-colors">
                Resume
              </button>
            </div>
          </div>

          {/* Skill Radar Card */}
          <div className="bg-white rounded-[1.5rem] p-8 flex-1 flex flex-col shadow-sm border border-gray-200/50 font-sans">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-espresso font-bold text-xl tracking-tight">Competencies</h3>
              <span className="material-symbols-outlined text-terracotta text-[20px]">radar</span>
            </div>
            <div className="flex-1 flex flex-col gap-5 justify-center">
              <div>
                <div className="flex justify-between text-[13px] font-medium text-espresso mb-2">
                  <span>Model Context Protocol</span>
                  <span className="text-gray-500">95%</span>
                </div>
                <div className="w-full h-1.5 bg-paper-variant rounded-full overflow-hidden">
                  <div className="h-full bg-sage rounded-full w-[95%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[13px] font-medium text-espresso mb-2">
                  <span>RAG Architecture</span>
                  <span className="text-gray-500">90%</span>
                </div>
                <div className="w-full h-1.5 bg-paper-variant rounded-full overflow-hidden">
                  <div className="h-full bg-sage rounded-full w-[90%] opacity-90"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[13px] font-medium text-espresso mb-2">
                  <span>Vector Databases</span>
                  <span className="text-gray-500">85%</span>
                </div>
                <div className="w-full h-1.5 bg-paper-variant rounded-full overflow-hidden">
                  <div className="h-full bg-sage rounded-full w-[85%] opacity-80"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[13px] font-medium text-espresso mb-2">
                  <span>Fine-Tuning</span>
                  <span className="text-gray-500">75%</span>
                </div>
                <div className="w-full h-1.5 bg-paper-variant rounded-full overflow-hidden">
                  <div className="h-full bg-sage rounded-full w-[75%] opacity-70"></div>
                </div>
              </div>
            </div>
          </div>
        </aside>
        )}

        {/* Right Main Pane (Interactive Chat Stream) */}
        {!isComplete ? (
          <section className="flex-1 flex flex-col overflow-hidden h-full bg-white rounded-[2rem] border border-gray-200/50 shadow-sm relative">
            {/* Chat Header */}
            <div className="px-8 py-5 flex justify-between items-center bg-white border-b border-gray-100/50 shrink-0 z-10">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-espresso flex items-center justify-center text-white">
                   <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                 </div>
                 <div>
                   <h2 className="font-serif text-espresso font-bold text-xl tracking-tight">Phase 3 Exercise</h2>
                   <p className="font-sans text-terracotta font-medium text-[13px] mt-0.5">Aura Critic Engine</p>
                 </div>
              </div>
              <div className="flex gap-4">
                <button className="text-gray-400 hover:text-espresso transition-colors">
                  <span className="material-symbols-outlined">more_horiz</span>
                </button>
              </div>
            </div>

            <ChatBox 
              messages={messages} 
              isWaiting={isWaiting} 
              onSendMessage={handleSendMessage} 
              score={score}
            />
          </section>
        ) : (
          <div className="flex-1 bg-white overflow-hidden h-full rounded-[2rem] shadow-sm border border-gray-200/50">
             <FeedbackDashboard />
          </div>
        )}
      </div>
    </div>
  );
}
