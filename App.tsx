
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import BotConfigPage from './pages/BotConfigPage';
import WelcomeMessagePage from './pages/WelcomeMessagePage';
import AutoReplyPage from './pages/AutoReplyPage';
import BroadcastPage from './pages/BroadcastPage';
import CustomerServicePage from './pages/CustomerServicePage';
import { AppContextProvider } from './contexts/AppContext';

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/config" element={<BotConfigPage />} />
            <Route path="/welcome" element={<WelcomeMessagePage />} />
            <Route path="/auto-reply" element={<AutoReplyPage />} />
            <Route path="/broadcast" element={<BroadcastPage />} />
            <Route path="/customer-service" element={<CustomerServicePage />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppContextProvider>
  );
};

export default App;
