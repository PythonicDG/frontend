import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AlertNotification } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

interface AlertContextType {
  alerts: AlertNotification[];
  showAlert: (message: string, type?: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
  removeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const showAlert = useCallback(
    (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 4500) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newAlert: AlertNotification = {
        id,
        type,
        message,
        timestamp: Date.now(),
      };

      setAlerts((prev) => [...prev, newAlert]);

      if (duration > 0) {
        setTimeout(() => {
          removeAlert(id);
        }, duration);
      }
    },
    [removeAlert]
  );

  return (
    <AlertContext.Provider value={{ alerts, showAlert, removeAlert }}>
      {children}
      {/* Alert Chips Floating Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 animate-fade-in ${
              alert.type === 'error'
                ? 'bg-red-950/80 border-red-500/40 text-red-200'
                : alert.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
                : alert.type === 'warning'
                ? 'bg-amber-950/80 border-amber-500/40 text-amber-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {alert.type === 'error' && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
              {alert.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
              {alert.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
              <span className="text-sm font-medium leading-tight">{alert.message}</span>
            </div>
            <button
              onClick={() => removeAlert(alert.id)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors shrink-0 text-current/70 hover:text-current"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
