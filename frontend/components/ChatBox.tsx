"use client";

import { useState, useRef, useEffect } from "react";
import { Paperclip, Send } from "lucide-react";
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
}

export default function ChatBox({ messages, isWaiting, onSendMessage }: ChatBoxProps) {
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
    <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 relative pb-40 w-full h-full">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {messages.map((msg, index) => {
          const isLastAgent = index === messages.length - 1 && msg.role === "agent";
          const displayContent = isLastAgent && isStreaming ? streamedContent : msg.content;
          
          return (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "agent" && (
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 mr-4 mt-1 border border-slate-700">
                   <span className="text-white text-xs font-bold">A</span>
                </div>
              )}
              
              <div 
                className={`px-6 py-4 rounded-2xl max-w-[85%] text-[15px] leading-relaxed shadow-sm
                  ${msg.role === "user" 
                    ? "bg-blue-600 text-white rounded-br-sm" 
                    : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                  }`}
              >
                <div className={`prose max-w-none ${msg.role === "user" ? "prose-invert prose-p:text-white" : "prose-slate"}`}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkMath]} 
                    rehypePlugins={[rehypeKatex]}
                  >
                    {displayContent}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          );
        })}
        
        {isWaiting && (
          <div className="flex justify-start">
             <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 mr-4 mt-1 border border-slate-700">
               <span className="text-white text-xs font-bold">A</span>
             </div>
             <div className="px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm flex items-center">
               <TypingIndicator />
             </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Dock Input */}
      <div className="fixed bottom-8 left-0 right-0 px-4 flex justify-center z-20 pointer-events-none">
        <div className="w-full max-w-4xl bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 p-2 flex items-center gap-2 pointer-events-auto transition-transform hover:-translate-y-1 duration-300">
          <button className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors shrink-0">
            <Paperclip className="w-5 h-5" />
          </button>
          <textarea 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your response..."
            disabled={isWaiting || isStreaming}
            className="flex-1 max-h-32 min-h-[44px] bg-transparent border-0 focus:ring-0 resize-none py-3 px-2 text-slate-800 placeholder:text-slate-400 disabled:opacity-50"
            rows={1}
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isWaiting || isStreaming}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
