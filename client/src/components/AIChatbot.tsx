import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hello! I am your AI Career & Networking assistant. Ask me about alumni connections, open jobs, or upcoming events!', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { sender: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      let botResponse = "I'm here to help! Try asking about 'jobs', 'events', 'mentors', or 'donations'.";
      const q = text.toLowerCase();

      if (q.includes('job') || q.includes('intern') || q.includes('career')) {
        botResponse = "Based on our job board, there are exciting matching roles:\n1. **Senior Software Engineer** at **Google** (posted by John Doe)\n2. **Finance Associate Intern** at **Goldman Sachs** (posted by Jane Smith).\n\nGo to the Job Board on your dashboard to submit your application!";
      } else if (q.includes('event') || q.includes('reunion') || q.includes('mixer')) {
        botResponse = "We have major upcoming events:\n- **Global Alumni Reunion 2026** (Oct 15)\n- **Enterprise AI Seminar** (July 10)\n\nYou can register for these events directly in the Events tab to receive your entry ticket.";
      } else if (q.includes('mentor') || q.includes('connect') || q.includes('student')) {
        botResponse = "Our mentorship system connects you directly. Approved alumni like **John Doe** (Google) and **Jane Smith** (Goldman Sachs) are active mentors. Go to 'Mentorship Program' to request matching!";
      } else if (q.includes('donate') || q.includes('give') || q.includes('fund')) {
        botResponse = "Your contributions fund student scholarships and campus developments. Head over to our **Donations** section to contribute online, view donation campaigns, and download instant tax receipts.";
      } else if (q.includes('hello') || q.includes('hi')) {
        botResponse = "Hello! How can I help you navigate the Portal today?";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse, timestamp: new Date() }]);
    }, 800);
  };

  const quickQuestions = [
    { label: '💼 Find Jobs', query: 'What jobs are available?' },
    { label: '📅 Show Events', query: 'Tell me about upcoming events' },
    { label: '🤝 Mentorship', query: 'How do I find a mentor?' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 rounded-full bg-primary hover:bg-primary-dark text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 animate-pulse relative"
          title="Open AI Assistant"
        >
          <Bot className="w-6 h-6 text-white" />
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
            AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] glass-card rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300 border border-primary/20 bg-white/95 dark:bg-slate-900/95">
          {/* Chat Header */}
          <div className="bg-primary p-4 flex items-center justify-between text-white shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">Apex Portal Copilot</h3>
                <span className="text-[10px] text-white/70 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-accent" /> AI Recommendation Active
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/15 transition-all text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${msg.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50'
                    }`}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Buttons */}
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex gap-2 flex-wrap bg-white/40 dark:bg-slate-900/40">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.query)}
                className="text-[11px] font-semibold text-primary hover:bg-primary-light/50 bg-primary-light/20 px-2.5 py-1 rounded-lg border border-primary/20 dark:border-primary/10 transition-all"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-slate-200/50 dark:border-slate-800/40 flex items-center gap-2 bg-white dark:bg-slate-900">
            <input
              type="text"
              placeholder="Ask anything..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage(inputValue)}
              className="flex-1 glass-input py-2 px-3 text-xs bg-slate-50 dark:bg-slate-950/50"
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              className="p-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white shadow transition-all hover:scale-105"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
