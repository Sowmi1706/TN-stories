import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, MessageSquare, X, Send, Bot, User as UserIcon, 
  MapPin, ArrowRight, RotateCcw, Compass, ChevronDown, CheckCircle, Tag
} from 'lucide-react';
import { Destination } from '../types';
import { api } from '../services/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  suggestedDestinations?: string[];
  timestamp: string;
}

interface AIChatboxProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  onBookDestination: (dest: Destination) => void;
  isOpen?: boolean;
  onToggleOpen?: (open: boolean) => void;
}

export const AIChatbox: React.FC<AIChatboxProps> = ({
  destinations,
  onSelectDestination,
  onBookDestination,
  isOpen: controlledIsOpen,
  onToggleOpen
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    setInternalIsOpen(open);
    onToggleOpen?.(open);
  };
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Vanakkam! 🙏 I am your **TN Stories AI Travel Concierge**.\n\nI can help you create custom Tamil Nadu itineraries, suggest authentic regional foods (like Madurai Jigarthanda or Chettinad feasts), explain temple timings & dress codes, and guide you on booking verified local caretakers or claiming your **10% first-booking discount**!\n\nWhere would you like to explore today?",
      suggestedDestinations: ['ooty', 'madurai', 'chettinad'],
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (messageToSend?: string) => {
    const text = messageToSend || input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build history for context
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const res = await api.sendChatMessage({ message: text, history });

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        text: res.reply,
        suggestedDestinations: res.suggestedDestinations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: "Vanakkam! I had trouble connecting to the network for a moment. You can browse our verified destinations in the main catalog, or ask me again shortly!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        text: "Vanakkam! 🙏 Chat history cleared. How can I assist with your Tamil Nadu travel plans today?",
        suggestedDestinations: ['ooty', 'kodaikanal', 'kanyakumari'],
        timestamp: 'Just now'
      }
    ]);
  };

  const sampleQuestions = [
    "3-day trip plan for Ooty & Nilgiris",
    "Madurai temple timings & dress code",
    "Chettinad cuisine & mansion tour",
    "How does the Caretaker service work?",
    "How do I claim 10% first booking discount?"
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Travel Concierge"
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 hover:from-amber-700 hover:to-amber-950 text-white font-bold text-xs sm:text-sm shadow-xl shadow-amber-900/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all border border-amber-400/40"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-amber-800 animate-pulse" />
          </div>
          <span className="tracking-wide">Ask AI Travel Guide</span>
          <span className="hidden sm:inline-block text-[10px] bg-amber-500/30 border border-amber-300/30 px-1.5 py-0.5 rounded text-amber-200">
            Gemini
          </span>
        </button>
      )}

      {/* Floating Chat Window Panel */}
      {isOpen && (
        <div 
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[420px] max-h-[85vh] sm:max-h-[640px] bg-white rounded-3xl shadow-2xl border border-amber-200/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-800 via-amber-900 to-slate-900 text-white p-4 flex items-center justify-between border-b border-amber-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-600/60 border border-amber-400/40 flex items-center justify-center text-amber-100 shadow-md">
                <Bot className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold font-serif text-white leading-tight">
                    Vanakkam AI Concierge
                  </h4>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-amber-200/90 font-medium">
                  TN Stories Official Travel Specialist • Gemini 3.8
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                title="Reset conversation"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 hover:text-white flex items-center justify-center transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close Chat"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Strip */}
          <div className="bg-amber-50/70 border-b border-amber-100 p-2.5 overflow-x-auto scrollbar-none flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-amber-900/70 shrink-0 uppercase tracking-wider pl-1">
              Try asking:
            </span>
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-[11px] font-semibold text-amber-900 bg-white hover:bg-amber-100/70 px-2.5 py-1 rounded-full border border-amber-200 whitespace-nowrap transition-colors shrink-0 shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[88%] ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                      isAssistant 
                        ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-2xs' 
                        : 'bg-slate-700 text-white'
                    }`}>
                      {isAssistant ? <Sparkles className="w-3.5 h-3.5 text-amber-200" /> : <UserIcon className="w-3.5 h-3.5" />}
                    </div>

                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isAssistant
                        ? 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-tl-xs'
                        : 'bg-amber-600 text-white shadow-xs rounded-tr-xs font-medium'
                    }`}>
                      {/* Formatted Text rendering */}
                      <div className="whitespace-pre-line space-y-1">
                        {msg.text.split('\n\n').map((para, i) => (
                          <p key={i}>
                            {para.split('**').map((chunk, j) => 
                              j % 2 === 1 ? <strong key={j} className="font-bold">{chunk}</strong> : chunk
                            )}
                          </p>
                        ))}
                      </div>

                      {/* Interactive Suggested Destinations */}
                      {isAssistant && msg.suggestedDestinations && msg.suggestedDestinations.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Explore Mentioned Places:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.suggestedDestinations.map((destId) => {
                              const target = destinations.find(d => d.id === destId);
                              if (!target) return null;
                              return (
                                <div key={target.id} className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 py-1 rounded-lg">
                                  <MapPin className="w-3 h-3 text-amber-700" />
                                  <span className="font-bold text-slate-800 text-[11px]">{target.name.split(' ')[0]}</span>
                                  <button
                                    onClick={() => onSelectDestination(target)}
                                    className="text-[10px] text-amber-700 hover:text-amber-900 font-bold ml-1 underline"
                                  >
                                    View
                                  </button>
                                  <span>•</span>
                                  <button
                                    onClick={() => onBookDestination(target)}
                                    className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold"
                                  >
                                    Book
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 mt-1 px-9">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-white border border-slate-200 px-3 py-2 rounded-2xl flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[11px] text-slate-500 ml-1.5">Thinking with Gemini...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about places, temples, food, itinerary..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send Message"
                className="w-9 h-9 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
