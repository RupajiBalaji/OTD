/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

export type ToastFn = {
  (title: string, description?: string, type?: ToastType): void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
};

interface ToastContextType {
  toast: ToastFn;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const rawToast = useCallback(
    (title: string, description?: string, type: ToastType = 'info') => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newToast: ToastMessage = { id, type, title, description };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const success = useCallback((title: string, description?: string) => rawToast(title, description, 'success'), [rawToast]);
  const error = useCallback((title: string, description?: string) => rawToast(title, description, 'error'), [rawToast]);
  const info = useCallback((title: string, description?: string) => rawToast(title, description, 'info'), [rawToast]);

  const toast: ToastFn = Object.assign(
    (title: string, description?: string, type?: ToastType) => rawToast(title, description, type),
    { success, error, info }
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      {/* Toast Render Viewport */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => {
          const typeIcons = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
            error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
            info: <Info className="w-5 h-5 text-[var(--gold-primary)] shrink-0" />,
          };

          const typeBorders = {
            success: 'border-emerald-500/30',
            error: 'border-rose-500/30',
            info: 'border-[var(--gold-primary)]/40',
          };

          return (
            <div
              key={t.id}
              className={`pointer-events-auto p-4 rounded-2xl bg-[var(--bg-card)] border ${typeBorders[t.type]} shadow-xl flex items-start gap-3 animate-in slide-in-from-bottom-3 duration-200 transition-all backdrop-blur-md`}
            >
              {typeIcons[t.type]}
              <div className="flex-1 min-w-0 pr-1">
                <h5 className="font-semibold text-xs sm:text-sm text-[var(--text-heading)]">
                  {t.title}
                </h5>
                {t.description && (
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug">
                    {t.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-[var(--text-muted)] hover:text-[var(--text-heading)] p-1 transition-colors cursor-pointer"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
