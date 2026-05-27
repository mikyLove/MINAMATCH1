import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, CircleAlert, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const ICONS = {
  success: CheckCircle,
  error: CircleAlert,
  info: Info,
};

const COLORS = {
  success: 'bg-emerald-600 border-emerald-700',
  error: 'bg-red-600 border-red-700',
  info: 'bg-slate-800 border-slate-700 dark:bg-slate-900 dark:border-slate-600',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const toastFn = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const remove = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast: toastFn }}>
      {children}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] w-full max-w-sm px-4 space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => {
            const Icon = ICONS[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: 'spring', damping: 20, stiffness: 250 }}
                className={`${COLORS[t.type]} pointer-events-auto text-white px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold`}
              >
                <Icon className="w-4 h-4 shrink-0 opacity-90" />
                <span className="flex-1">{t.message}</span>
                <button
                  onClick={() => remove(t.id)}
                  className="p-0.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
