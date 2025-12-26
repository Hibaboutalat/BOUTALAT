"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Paperclip, Sparkles, FileText, ChevronRight } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Bonjour ! Je suis votre assistant IA. Posez-moi vos questions et je vous répondrai en m'appuyant sur les documents fournis.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.answer,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Erreur:", error);
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: "Désolé, une erreur est survenue lors de la connexion au serveur. Veuillez réessayer." 
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-30"></div>
                <div className="relative p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                  <Bot className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    RAG Assistant
                  </h1>
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                </div>
                <p className="text-sm text-slate-600 flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  Questionnez vos documents avec intelligence
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700">{messages.length}</span>
                <span className="text-sm text-slate-500">messages</span>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                <span className="text-sm font-medium text-indigo-700">En ligne</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat container */}
      <main className="flex-1 overflow-hidden max-w-5xl mx-auto w-full px-6 py-8">
        <div className="h-full flex flex-col">
          {/* Welcome card */}
          {messages.length === 1 && (
            <div className="mb-8 animate-fade-in">
              <div className="bg-gradient-to-r from-white to-indigo-50/50 rounded-2xl border border-indigo-100 p-8 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <Sparkles className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Comment utiliser l'assistant</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="p-4 bg-white/80 rounded-xl border border-slate-200">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                          <span className="text-indigo-600 font-bold">1</span>
                        </div>
                        <h3 className="font-semibold text-slate-800 mb-2">Posez votre question</h3>
                        <p className="text-sm text-slate-600">Formulez clairement votre question en langage naturel</p>
                      </div>
                      <div className="p-4 bg-white/80 rounded-xl border border-slate-200">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                          <span className="text-purple-600 font-bold">2</span>
                        </div>
                        <h3 className="font-semibold text-slate-800 mb-2">Analyse des documents</h3>
                        <p className="text-sm text-slate-600">L'IA recherche dans vos documents les informations pertinentes</p>
                      </div>
                      <div className="p-4 bg-white/80 rounded-xl border border-slate-200">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
                          <span className="text-emerald-600 font-bold">3</span>
                        </div>
                        <h3 className="font-semibold text-slate-800 mb-2">Réponse précise</h3>
                        <p className="text-sm text-slate-600">Recevez une réponse contextualisée avec les sources utilisées</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto space-y-8 pb-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`flex max-w-[85%] lg:max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} items-start gap-4`}
                >
                  {/* Avatar */}
                  <div className={`relative flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                    msg.role === "user" 
                      ? "bg-gradient-to-br from-indigo-500 to-blue-600" 
                      : "bg-gradient-to-br from-slate-800 to-slate-900"
                  }`}>
                    {msg.role === "user" ? (
                      <User className="h-5 w-5 text-white" />
                    ) : (
                      <Bot className="h-5 w-5 text-white" />
                    )}
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      msg.role === "user" ? "bg-emerald-500" : "bg-indigo-500"
                    }`}></div>
                  </div>

                  {/* Message bubble */}
                  <div className={`relative rounded-3xl px-6 py-5 shadow-lg ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-br-none"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none backdrop-blur-sm"
                  }`}>
                    {/* Message indicator */}
                    <div className={`absolute top-0 ${
                      msg.role === "user" ? "-right-2" : "-left-2"
                    }`}>
                      <div className={`w-4 h-4 transform ${
                        msg.role === "user" ? "rotate-45" : "-rotate-45"
                      } ${
                        msg.role === "user" 
                          ? "bg-gradient-to-r from-indigo-500 to-blue-600" 
                          : "bg-white border-l border-t border-slate-200"
                      }`}></div>
                    </div>

                    <div className="relative">
                      <div className="prose prose-slate max-w-none">
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      </div>
                      
                      {/* Sources */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className={`mt-5 pt-5 border-t ${
                          msg.role === "user" ? "border-blue-400/40" : "border-slate-200"
                        }`}>
                          <div className="flex items-center gap-2 text-sm font-medium mb-3">
                            <Paperclip className="h-4 w-4" />
                            <span className={msg.role === "user" ? "text-blue-100" : "text-slate-600"}>
                              Sources utilisées
                            </span>
                            <ChevronRight className="h-3 w-3" />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {msg.sources.map((source, idx) => (
                              <div
                                key={idx}
                                className={`px-3 py-2 rounded-xl text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                                  msg.role === "user"
                                    ? "bg-blue-500/30 text-blue-100 hover:bg-blue-500/40"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="h-3.5 w-3.5" />
                                  {source}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex items-start gap-4 max-w-[85%] lg:max-w-[80%]">
                  <div className="relative flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-slate-800 to-slate-900">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="relative bg-white border border-slate-200/80 rounded-3xl rounded-bl-none px-6 py-5 shadow-lg backdrop-blur-sm">
                    <div className="absolute -left-2 top-0 w-4 h-4 transform -rotate-45 bg-white border-l border-t border-slate-200"></div>
                    <div className="flex items-center gap-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                      <span className="text-sm font-medium text-slate-700">Recherche dans les documents...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-8 pb-6 mt-6">
            <div className="relative">
              <div className="flex items-center bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-300/50 hover:border-indigo-300/50 transition-all duration-300 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100/50">
                <div className="pl-6">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">?</span>
                  </div>
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Posez votre question ici... (ex: 'Quelles sont les principales conclusions du dernier rapport ?')"
                  className="flex-1 px-5 py-5 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-lg"
                  disabled={isLoading}
                  maxLength={2000}
                />
                <div className="pr-4">
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className={`group relative p-4 rounded-xl shadow-lg transition-all duration-300 ${
                      isLoading || !input.trim()
                        ? "bg-slate-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:shadow-2xl active:scale-95"
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    ) : (
                      <>
                        <Send className="h-6 w-6 text-white transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/5 rounded-xl"></div>
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center px-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Assistant RAG actif</span>
                  </div>
                  <span className="text-xs text-slate-400 hidden md:inline">•</span>
                  <div className="text-xs text-slate-500 hidden md:block">
                    Appuyez sur <kbd className="px-2 py-1 bg-slate-100 rounded border border-slate-300">Entrée</kbd> pour envoyer
                  </div>
                </div>
                <div className={`text-sm font-medium transition-colors ${
                  input.length > 1800 ? "text-rose-500" : "text-slate-500"
                }`}>
                  {input.length}/2000
                </div>
              </div>
            </div>
            
            {/* Features footer */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <span>RAG intelligent</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span>Recherche contextuelle</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span>Sources vérifiées</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span>Réponses précises</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Custom styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-bounce {
          animation: bounce 0.6s infinite;
        }
        
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #c7d2fe, #a5b4fc);
          border-radius: 5px;
          border: 2px solid #f8fafc;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #a5b4fc, #818cf8);
        }
        
        /* Smooth selection */
        ::selection {
          background-color: rgba(99, 102, 241, 0.2);
          color: #1e293b;
        }
        
        /* Message smooth transitions */
        .message-enter {
          opacity: 0;
          transform: translateY(10px);
        }
        
        .message-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 300ms, transform 300ms;
        }
      `}</style>
    </div>
  );
}