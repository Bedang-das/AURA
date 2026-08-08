"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, TerminalSquare } from "lucide-react";
import ChatBox, { Message } from "@/components/ChatBox";
import FeedbackDashboard from "@/components/FeedbackDashboard";

export default function CapstoneInterviewPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "agent",
      content: "Welcome to your APEX AURA Capstone Interview. I am the Orchestrator. We will be discussing Advanced Architectures today. To begin, why do we scale by the square root of the key dimension in the attention formula?"
    }
  ]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  const handleSendMessage = async (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsWaiting(true);
    
    try {
      const res = await fetch("http://localhost:8000/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage.content, topic: "day14" })
      });
      
      const nextCount = questionCount + 1;
      
      if (nextCount > 8) {
        setIsWaiting(false);
        setIsComplete(true);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "agent",
          content: data.agent_response
        }]);
      } else {
        throw new Error("Failed to fetch");
      }
      
      setQuestionCount(nextCount);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: "Error: Could not connect to the AURA Critic Engine. Please check if the backend is running."
      }]);
    } finally {
      if (questionCount < 8) {
        setIsWaiting(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/30 relative">
      <div className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center">
              <TerminalSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">Capstone Terminal</h1>
              <span className="text-xs font-medium text-emerald-500 uppercase tracking-widest">
                {isComplete ? "Evaluation Complete" : `Question ${questionCount} of 8`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {!isComplete ? (
        <ChatBox 
          messages={messages} 
          isWaiting={isWaiting} 
          onSendMessage={handleSendMessage} 
        />
      ) : (
        <FeedbackDashboard />
      )}
    </div>
  );
}
