
import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import { AppLog } from '../types';
import { useAppContext } from '../contexts/AppContext';

interface LayoutProps {
  children: ReactNode;
}

const LogEntry: React.FC<{ log: AppLog }> = ({ log }) => {
  const bgColor = log.type === 'error' ? 'bg-red-100' : log.type === 'api' ? 'bg-blue-100' : 'bg-green-100';
  const textColor = log.type === 'error' ? 'text-red-700' : log.type === 'api' ? 'text-blue-700' : 'text-green-700';
  return (
    <div className={`p-2 text-xs ${bgColor} ${textColor} rounded mb-1`}>
      <strong>[{log.timestamp.toLocaleTimeString()}] [{log.type.toUpperCase()}]:</strong> {log.message}
    </div>
  );
};


const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { logs } = useAppContext();

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
        <div className="h-48 bg-gray-800 text-white p-4 overflow-y-auto border-t-2 border-gray-700" aria-live="polite">
          <h3 className="text-sm font-semibold mb-2 text-gray-400">Activity Log / Monitoring</h3>
          {logs.length === 0 && <p className="text-xs text-gray-500">No activity yet.</p>}
          {logs.map(log => <LogEntry key={log.id} log={log} />).reverse()}
        </div>
      </main>
    </div>
  );
};

export default Layout;