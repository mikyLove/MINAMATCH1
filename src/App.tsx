import React, { useState } from 'react';
import Header from './components/Header';
import ScenarioAssessment from './components/ScenarioAssessment';
import SemillerosList from './components/SemillerosList';
import BuscadorTalento from './components/BuscadorTalento';
import MatchingShortlist from './components/MatchingShortlist';
import BottomNav from './components/BottomNav';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('minatalent'); // Start matched to the first screen

  const renderActiveView = () => {
    switch (currentTab) {
      case 'matching':
        return <MatchingShortlist />;
      case 'semilleros':
        return <SemillerosList />;
      case 'buscador':
        return <BuscadorTalento />;
      case 'minatalent':
      default:
        return <ScenarioAssessment />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans relative overflow-x-hidden pb-28">
      {/* Decorative ambient slate background grid on large viewports */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] select-none z-0 hidden lg:block" 
        style={{
          backgroundImage: 'radial-gradient(#0f172a 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="w-full max-w-lg mx-auto bg-white min-h-screen shadow-lg relative z-10 border-x border-slate-200 flex flex-col">
        {/* Header bar equipped with side navigation drawer */}
        <Header currentTab={currentTab} onNavigate={(tab) => setCurrentTab(tab)} />

        {/* Dynamic content rendering section */}
        <main className="flex-1 p-4 relative z-10">
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

        {/* Bottom tabbed navigation bar */}
        <BottomNav currentTab={currentTab} onNavigate={(tab) => setCurrentTab(tab)} />
      </div>
    </div>
  );
}
