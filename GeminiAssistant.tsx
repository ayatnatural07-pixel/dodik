import React, { useState, useRef, useEffect } from 'react';
import { streamGeminiResponse } from '../../services/geminiService';
import { IconSend, IconSparkles } from '../Icons';
import { GenerateContentResponse } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am Nebula AI. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Prepare history for the API (excluding the very last user message which is sent as prompt)
      // The API expects 'user' or 'model' roles.
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const streamResult = await streamGeminiResponse(userMsg, history);
      
      if (!streamResult) {
        setMessages(prev => [...prev, { role: 'model', text: "Error: API Key not configured." }]);
        setIsLoading(false);
        return;
      }

      let fullResponseText = '';
      
      // Add a placeholder for the model response
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of streamResult) {
        const c = chunk as GenerateContentResponse;
        const chunkText = c.text || '';
        fullResponseText += chunkText;
        
        setMessages(prev => {
          const newHistory = [...prev];
          const lastMsg = newHistory[newHistory.length - 1];
          if (lastMsg.role === 'model') {
            lastMsg.text = fullResponseText;
          }
          return newHistory;
        });
      }

    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error connecting to the neural network." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-700 text-slate-200 rounded-bl-none'
              }`}
            >
              {msg.role === 'model' && idx === 0 ? (
                 <div className="flex items-center gap-2 mb-1 text-blue-300 font-semibold text-xs uppercase tracking-wider">
                   <IconSparkles className="w-3 h-3" /> Nebula AI
                 </div>
              ) : null}
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-slate-700 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="relative flex items-center">
          <input
            type="text"
            className="w-full bg-slate-900 border border-slate-600 text-white rounded-full pl-4 pr-12 py-3 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <IconSend className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center mt-2 text-[10px] text-slate-500">
          Nebula AI may display inaccurate info.
        </div>
      </div>
    </div>
  );
};

export default GeminiAssistant;
