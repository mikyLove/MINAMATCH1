import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { v2FetchChatHistory, v2SendChatMessage, v2ClearChatHistory } from '../lib/api';

const MIN_LENGTH = 3;
const MAX_LENGTH = 2000;

interface ChatMessage {
  role: string;
  content: string;
}


export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      fetchHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
    }
  }, [input]);

  const fetchHistory = async () => {
    try {
      const data = await v2FetchChatHistory();
      setMessages(data);
    } catch {
      setMessages([{ role: 'assistant', content: '¡Bienvenido a MinaMatch Puno! Soy tu asistente IA. ¿En qué puedo ayudarte?' }]);
    }
  };

  const handleSend = async () => {
    const userMsg = input.trim();
    if (!userMsg || userMsg.length < MIN_LENGTH || userMsg.length > MAX_LENGTH || loading) return;

    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    try {
      // Add an initial empty message for the assistant
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      let fullContent = '';

      await v2SendChatMessage(userMsg, (chunk) => {
        fullContent += chunk;
        setMessages(prev => {
          const next = [...prev];
          if (next.length > 0) {
            next[next.length - 1] = { ...next[next.length - 1], content: fullContent };
          }
          return next;
        });
      });
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err instanceof Error ? err.message : 'No se pudo conectar con el servidor.'}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      await v2ClearChatHistory();
    } catch {}
    setMessages([{ role: 'assistant', content: 'Historial eliminado. ¿En qué puedo ayudarte?' }]);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 w-12 h-12 bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        title="Chat IA MinaMatch"
      >
        <MessageCircle className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-2 sm:px-4 pb-20 sm:pb-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden max-h-[70vh] sm:max-h-[80vh]"
            >
              <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-bold">MinaMatch IA</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Asistente Minero</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleClear}
                    className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-white hover:bg-slate-800 dark:bg-slate-950 rounded-lg transition-colors"
                    title="Limpiar historial"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-white hover:bg-slate-800 dark:bg-slate-950 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50 dark:bg-slate-800/50">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 bg-slate-900 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-3.5 h-3.5 text-amber-500" />
                      </div>
                    )}
                    <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-amber-600 text-white rounded-br-sm'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-bl-sm shadow-xs'
                    }`}>
                      {msg.content.split('\n').map((line, i) => (
                        <p key={i} className={line.startsWith('•') ? 'pl-3' : ''}>{line || '\u00A0'}</p>
                      ))}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-7 h-7 bg-amber-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <User className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-2">
                    <div className="w-7 h-7 bg-slate-900 rounded-full flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl rounded-bl-sm px-3 py-2">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0">
                <div className="space-y-1">
                  {input.length > 0 && (
                    <div className="flex justify-between items-center px-0.5">
                      <AnimatePresence>
                        {input.trim().length > MAX_LENGTH && (
                          <motion.span
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-[9px] text-red-500 font-bold uppercase tracking-wider"
                          >
                            Texto demasiado largo
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <div className={`text-[9px] font-mono ml-auto ${input.trim().length > MAX_LENGTH ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                        {input.trim().length}/{MAX_LENGTH}
                      </div>
                    </div>
                  )}
                  <div className="flex items-end gap-2">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Escribe tu consulta minera..."
                    className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/20 transition-colors resize-none overflow-y-auto max-h-32"
                    disabled={loading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={loading || input.trim().length < MIN_LENGTH || input.trim().length > MAX_LENGTH}
                    className="px-3 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white rounded-xl transition-colors shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
