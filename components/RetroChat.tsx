import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Terminal, Loader2, Minimize2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { RESUME_DATA, PROJECTS_DATA } from '../constants';
import { Theme } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface RetroChatProps {
    theme: Theme;
}

const RetroChat: React.FC<RetroChatProps> = ({ theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'SYSTEM INITIALIZED. I CAN ANSWER QUESTIONS ABOUT JIA SONG\'S RESUME AND PROJECTS.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const contextData = JSON.stringify({
        resume: RESUME_DATA,
        projects: PROJECTS_DATA
      });

      const systemPrompt = `
        You are an advanced AI Terminal Assistant for Jia Song's interactive portfolio.
        
        YOUR KNOWLEDGE BASE:
        ${contextData}

        INSTRUCTIONS:
        1. Answer questions based STRICTLY on the provided JSON data.
        2. If the user asks about something not in the data, state that "DATA NOT FOUND IN ARCHIVES".
        3. Keep answers concise, professional, but technical.
        4. Adopt a slight "computer terminal" persona (e.g., "Scanning database...", "Retrieving records...").
        5. You are helpful and want to showcase Jia's skills in Computer Science, AI, and Data Science.
        
        Current User Query: ${userMessage}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userMessage,
        config: {
          systemInstruction: systemPrompt,
        },
      });

      const responseText = response.text || "ERROR: NO DATA RECEIVED.";

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "CRITICAL ERROR: CONNECTION TO AI CORE FAILED." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 z-50 bg-black border-2 border-${theme}-500 text-${theme}-500 p-3 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:bg-${theme}-500 hover:text-black transition-all hover:scale-110 group`}
        >
          <MessageSquare size={24} className="group-hover:animate-bounce" />
          <span className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black border border-${theme}-500 text-${theme}-500 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none`}>
            ASK AI ASSISTANT
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 w-[90vw] md:w-96 h-[500px] bg-black border-2 border-${theme}-500 rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col font-mono animate-in slide-in-from-bottom-10 duration-300`}>
            {/* Header */}
            <div className={`flex justify-between items-center p-3 border-b-2 border-${theme}-500/50 bg-${theme}-900/10`}>
                <div className={`flex items-center gap-2 text-${theme}-500`}>
                    <Terminal size={16} />
                    <span className="text-sm font-bold tracking-wider">AI_ASSISTANT_V1</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsOpen(false)} className={`text-${theme}-500 hover:text-white transition-colors`}>
                        <Minimize2 size={16} />
                    </button>
                    <button onClick={() => setIsOpen(false)} className={`text-${theme}-500 hover:text-red-500 transition-colors`}>
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* CRT Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] opacity-20"></div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative z-20">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-2 rounded text-sm border ${
                            msg.role === 'user' 
                            ? `border-${theme}-500/50 bg-${theme}-900/20 text-${theme}-300` 
                            : `border-transparent text-${theme}-500`
                        }`}>
                            <span className="font-bold text-xs opacity-50 block mb-1">
                                {msg.role === 'user' ? '> USER' : '> SYSTEM'}
                            </span>
                            <div className="whitespace-pre-wrap">{msg.text}</div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                         <div className={`text-${theme}-500 flex items-center gap-2 text-xs animate-pulse`}>
                            <Loader2 size={14} className="animate-spin" /> PROCESSING QUERY...
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className={`p-3 border-t-2 border-${theme}-500/50 bg-black z-20 flex gap-2`}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter command..."
                    className={`flex-1 bg-${theme}-900/10 border border-${theme}-500/30 rounded px-3 py-2 text-${theme}-500 text-sm focus:outline-none focus:border-${theme}-500 focus:bg-${theme}-900/20 placeholder-${theme}-500/30`}
                />
                <button 
                    type="submit" 
                    disabled={isLoading || !input.trim()}
                    className={`bg-${theme}-500 text-black p-2 rounded hover:bg-${theme}-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                >
                    <Send size={16} />
                </button>
            </form>
        </div>
      )}
    </>
  );
};

export default RetroChat;