
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, LoadingState, Language } from '../types';
import { streamChatResponse } from '../services/geminiService';
import { Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { translations } from '../translations';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  lang: Language;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, setMessages, lang }) => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || status !== LoadingState.IDLE) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    const modelMsgId = (Date.now() + 1).toString();
    const modelMsgPlaceholder: ChatMessage = {
      id: modelMsgId,
      role: 'model',
      text: '',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg, modelMsgPlaceholder]);
    setInput('');
    setStatus(LoadingState.STREAMING);

    try {
      let accumulatedText = '';
      await streamChatResponse(
        messages, 
        userMsg.text,
        (chunk) => {
          accumulatedText += chunk;
          setMessages(prev => prev.map(msg => 
            msg.id === modelMsgId ? { ...msg, text: accumulatedText } : msg
          ));
        },
        lang
      );
      setStatus(LoadingState.IDLE);
    } catch (error) {
      setStatus(LoadingState.ERROR);
      setMessages(prev => prev.map(msg => 
        msg.id === modelMsgId ? { ...msg, text: t.chat.error, isError: true } : msg
      ));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto space-y-6 p-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
             <div className="w-20 h-20 mb-6 rounded-full bg-teal-500/10 flex items-center justify-center blur-sm animate-pulse">
                <div className="w-10 h-10 bg-teal-400/30 rounded-full"></div>
             </div>
            <p className="font-serif text-2xl text-slate-200 mb-2">Nafs</p>
            <p className="text-slate-400 font-light">{t.chat.listening}</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] px-6 py-4 rounded-3xl backdrop-blur-md border border-white/5 shadow-lg ${
                msg.role === 'user'
                  ? 'bg-teal-600/20 text-white rounded-br-none rtl:rounded-bl-none rtl:rounded-br-3xl border-teal-500/20'
                  : 'bg-slate-800/40 text-slate-200 rounded-bl-none rtl:rounded-br-none rtl:rounded-bl-3xl border-white/10'
              }`}
            >
              {msg.role === 'model' && msg.text === '' ? (
                 <div className="flex gap-1 h-6 items-center">
                   <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                   <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                   <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                 </div>
              ) : (
                <div className={`prose prose-invert prose-sm max-w-none leading-relaxed ${lang === 'ar' ? 'text-right' : ''}`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 mt-4">
        <div className="relative flex items-center glass-panel rounded-full p-1 shadow-2xl shadow-black/20">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.chat.placeholder}
            className="w-full bg-transparent text-white pl-6 pr-12 py-3.5 focus:outline-none placeholder:text-slate-500 font-light rtl:pr-6 rtl:pl-12"
            disabled={status === LoadingState.STREAMING}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || status === LoadingState.STREAMING}
            className="absolute right-2 rtl:right-auto rtl:left-2 p-2 bg-teal-600 text-white rounded-full hover:bg-teal-500 disabled:opacity-50 disabled:bg-slate-700 transition-all shadow-lg shadow-teal-900/20"
          >
            {status === LoadingState.STREAMING ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5 rtl:rotate-180" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
