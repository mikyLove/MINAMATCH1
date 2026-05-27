import React, { useState } from 'react';
import Header from './components/Header';
import MinaTalentApp from './minatalent/MinaTalentApp';
import SemillerosList from './components/SemillerosList';
import SemillerosDashboard from './components/SemillerosDashboard';
import BuscadorTalento from './components/BuscadorTalento';
import MatchingShortlist from './components/MatchingShortlist';
import BottomNav from './components/BottomNav';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { useAuth } from './AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, LogOut, Pickaxe } from 'lucide-react';

export default function App() {
  const { user, loading, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('minatalent');
  const [showAuth, setShowAuth] = useState(false);
  const [showLanding, setShowLanding] = useState(false);

  const validTabs = new Set(['matching', 'semilleros', 'semilleros-list', 'buscador', 'minatalent']);

  const safeNavigate = (tab: string) => {
    setShowLanding(false);
    setCurrentTab(validTabs.has(tab) ? tab : 'minatalent');
  };

  const renderActiveView = () => {
    switch (currentTab) {
      case 'matching':
        return <MatchingShortlist />;
      case 'semilleros':
        return <SemillerosDashboard onNavigate={safeNavigate} />;
      case 'semilleros-list':
        return <SemillerosList />;
      case 'buscador':
        return <BuscadorTalento />;
      case 'minatalent':
      default:
        return <ErrorBoundary><MinaTalentApp /></ErrorBoundary>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    if (!showAuth) return <LandingPage onNavigate={() => setShowAuth(true)} />;
    return <Login onBack={() => setShowAuth(false)} />;
  }

  if (showLanding) {
    return (
      <div className="relative">
        <LandingPage onNavigate={() => setShowLanding(false)} />
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
          <button
            onClick={() => setShowLanding(false)}
            className="px-5 py-2.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg shadow-slate-900/10 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la Plataforma
          </button>
          <button
            onClick={logout}
            className="p-2.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg shadow-slate-900/10 text-slate-500 hover:text-red-600 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl transition-all"
            title="Cerrar Sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans relative overflow-x-hidden"
      style={{ paddingBottom: '10rem' }}
    >
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] select-none z-0 hidden lg:block" 
        style={{
          backgroundImage: 'radial-gradient(#0f172a 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="w-full sm:max-w-lg mx-auto bg-white dark:bg-slate-950 min-h-screen shadow-lg relative z-10 sm:border-x border-slate-200 dark:border-slate-800 flex flex-col overflow-x-hidden">
        <Header currentTab={currentTab} onNavigate={safeNavigate} onLanding={() => setShowLanding(true)} />

        <main
          className="flex-1 p-3 sm:p-4 relative z-10"
          style={{ paddingBottom: '10rem' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>

        <BottomNav currentTab={currentTab} onNavigate={safeNavigate} />
      </div>
    </div>
    </ToastProvider>
  );
}
