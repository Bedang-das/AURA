"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import TypingIndicator from "./TypingIndicator";

export type Message = {
  id: string;
  role: "agent" | "user";
  content: string;
};

interface ChatBoxProps {
  messages: Message[];
  isWaiting: boolean;
  onSendMessage: (text: string) => void;
  score?: number;
}

export default function ChatBox({ messages, isWaiting, onSendMessage, score = 88 }: ChatBoxProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [streamedContent, setStreamedContent] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamedContent, isWaiting]);

  // Handle streaming effect for the latest agent message
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === "agent") {
      setIsStreaming(true);
      setStreamedContent("");
      let currentIndex = 0;
      const fullText = lastMsg.content;

      const interval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setStreamedContent(fullText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsStreaming(false);
        }
      }, 15); // streaming speed

      return () => clearInterval(interval);
    } else {
      setIsStreaming(false);
      setStreamedContent("");
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || isWaiting || isStreaming) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6 pb-32 bg-white relative z-0">
        <div className="text-center font-sans text-[11px] font-semibold text-gray-400 uppercase tracking-widest my-2">
            Today 10:42 AM
        </div>
        
        {messages.map((msg, index) => {
          const isLastAgent = index === messages.length - 1 && msg.role === "agent";
          const displayContent = isLastAgent && isStreaming ? streamedContent : msg.content;
          
          return (
            <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "self-end flex-row-reverse" : ""}`}>
              
              <div className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : ""}`}>
                <div 
                  className={`px-6 py-4 prose max-w-none text-[15px] font-medium leading-relaxed font-sans ${
                    msg.role === "user" 
                      ? "bg-terracotta text-white rounded-[2rem] rounded-br-sm prose-invert prose-p:text-white" 
                      : "bg-paper-variant text-espresso rounded-[2rem] rounded-bl-sm border border-gray-200/50"
                  }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {displayContent}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          );
        })}
        
        {messages.length > 1 && !isWaiting && !isStreaming && (
            <div className="flex justify-center mt-4">
              <div className="bg-white border border-sage/30 shadow-sm rounded-full px-4 py-1.5 flex items-center gap-2 font-sans">
                <span className="material-symbols-outlined text-[14px] text-sage">check_circle</span>
                <span className="text-[12px] font-medium text-sage">Evaluation complete. Score: {score}/100</span>
              </div>
            </div>
        )}

        {isWaiting && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="bg-paper-variant text-espresso border border-gray-200/50 rounded-[2rem] rounded-bl-sm px-6 py-5 flex items-center">
              <TypingIndicator />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Dock (Samsung squircle bottom-heavy interaction) */}
      <div className="absolute bottom-8 left-0 w-full px-8 z-10 flex justify-center pointer-events-none">
        <div className="bg-white border border-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full p-2 flex items-center gap-3 w-full max-w-3xl pointer-events-auto">
          <button className="w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:text-terracotta hover:bg-paper transition-colors shrink-0">
            <span className="material-symbols-outlined text-[24px]">attach_file</span>
          </button>
          <input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isWaiting || isStreaming}
            className="flex-1 bg-transparent border-none focus:ring-0 font-medium font-sans text-espresso placeholder:text-gray-400 px-2 h-12 disabled:opacity-50 text-[15px]" 
            placeholder="Type your response..." 
            type="text" 
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isWaiting || isStreaming}
            className="w-12 h-12 rounded-full bg-terracotta text-white flex items-center justify-center hover:bg-[#c26245] transition-colors shrink-0 disabled:opacity-50 disabled:hover:bg-terracotta shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px] ml-1">send</span>
          </button>
        </div>
      </div>
    </>
  );
}
