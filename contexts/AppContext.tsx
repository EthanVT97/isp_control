
import React, { createContext, useState, useCallback, ReactNode, useContext } from 'react';
import { AppLog } from '../types';

interface AppContextType {
  logs: AppLog[];
  addLog: (message: string, type: AppLog['type']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<AppLog[]>([]);

  const addLog = useCallback((message: string, type: AppLog['type']) => {
    setLogs(prevLogs => [
      ...prevLogs,
      { id: Date.now().toString(), timestamp: new Date(), message, type }
    ].slice(-100)); // Keep last 100 logs
  }, []);

  return (
    <AppContext.Provider value={{ logs, addLog }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
