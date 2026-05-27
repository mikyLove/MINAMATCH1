import React, { useState, useEffect, useCallback } from 'react';
import MinaTalentLanding from './MinaTalentLanding';
import DiscTest from './DiscTest';
import WonderlicTest from './WonderlicTest';
import BigFiveTest from './BigFiveTest';
import IntegridadTest from './IntegridadTest';
import HoganTest from './HoganTest';
import FitSocialTest from './FitSocialTest';
import ResultDashboard from './ResultDashboard';
import { DiscScores, WonderlicResult, BigFiveScores, IntegrityScore, HoganScores, FitSocialScore } from './scoring';
import { moduleNames } from './questions';
import { ChevronLeft, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type TestModule = 'landing' | 'disc' | 'wonderlic' | 'bigfive' | 'integridad' | 'hogan' | 'fitsocial' | 'results';

export default function MinaTalentApp() {
  const [activeModule, setActiveModule] = useState<TestModule>('landing');
  const [completedModules, setCompletedModules] = useState<TestModule[]>([]);
  const [transitioning, setTransitioning] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [discScores, setDiscScores] = useState<DiscScores | null>(null);
  const [discRaw, setDiscRaw] = useState<Record<string, { most: number; least: number }>>({});
  const [wonderlicResult, setWonderlicResult] = useState<WonderlicResult | null>(null);
  const [wonderlicRaw, setWonderlicRaw] = useState<Record<number, number>>({});
  const [bigFiveScores, setBigFiveScores] = useState<BigFiveScores | null>(null);
  const [bigFiveRaw, setBigFiveRaw] = useState<Record<number, number>>({});
  const [integrityScore, setIntegrityScore] = useState<IntegrityScore | null>(null);
  const [integrityRaw, setIntegrityRaw] = useState<Record<number, number>>({});
  const [hoganScores, setHoganScores] = useState<HoganScores | null>(null);
  const [hoganRaw, setHoganRaw] = useState<Record<number, number>>({});
  const [fitSocialScores, setFitSocialScores] = useState<FitSocialScore | null>(null);
  const [fitSocialRaw, setFitSocialRaw] = useState<Record<number, number>>({});

  const STORAGE_KEY = 'minatalent_state';

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const data = JSON.parse(saved);
      if (data.candidateName) setCandidateName(data.candidateName);
      if (data.completedModules) setCompletedModules(data.completedModules);
      if (data.discScores) setDiscScores(data.discScores);
      if (data.discRaw) setDiscRaw(data.discRaw);
      if (data.wonderlicResult) setWonderlicResult(data.wonderlicResult);
      if (data.wonderlicRaw) setWonderlicRaw(data.wonderlicRaw);
      if (data.bigFiveScores) setBigFiveScores(data.bigFiveScores);
      if (data.bigFiveRaw) setBigFiveRaw(data.bigFiveRaw);
      if (data.integrityScore) setIntegrityScore(data.integrityScore);
      if (data.integrityRaw) setIntegrityRaw(data.integrityRaw);
      if (data.hoganScores) setHoganScores(data.hoganScores);
      if (data.hoganRaw) setHoganRaw(data.hoganRaw);
      if (data.fitSocialScores) setFitSocialScores(data.fitSocialScores);
      if (data.fitSocialRaw) setFitSocialRaw(data.fitSocialRaw);

      const completed: TestModule[] = data.completedModules || [];
      const allDone = testModules.every(m => completed.includes(m));
      if (allDone) {
        setActiveModule('results');
      } else if (completed.length > 0) {
        const next = testModules.find(m => !completed.includes(m));
        if (next) setActiveModule(next);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const state = {
      candidateName,
      completedModules,
      discScores, discRaw,
      wonderlicResult, wonderlicRaw,
      bigFiveScores, bigFiveRaw,
      integrityScore, integrityRaw,
      hoganScores, hoganRaw,
      fitSocialScores, fitSocialRaw,
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [candidateName, completedModules, discScores, discRaw, wonderlicResult, wonderlicRaw, bigFiveScores, bigFiveRaw, integrityScore, integrityRaw, hoganScores, hoganRaw, fitSocialScores, fitSocialRaw]);

  const clearSavedState = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  const testModules: TestModule[] = ['disc', 'wonderlic', 'bigfive', 'integridad', 'hogan', 'fitsocial'];
  const moduleOrder: TestModule[] = ['landing', ...testModules, 'results'];

  const handleModuleComplete = (module: TestModule) => {
    setCompletedModules(prev => {
      if (prev.includes(module)) return prev;
      return [...prev, module];
    });
  };

  const goBack = () => {
    if (activeModule === 'landing') return;
    const idx = moduleOrder.indexOf(activeModule);
    if (idx > 0) setActiveModule(moduleOrder[idx - 1]);
  };

  const progress = (testModules.filter(m => completedModules.includes(m)).length / testModules.length) * 100;

  const transitionTo = (next: TestModule) => {
    setTransitioning(true);
    setTimeout(() => { setActiveModule(next); setTransitioning(false); }, 500);
  };

  if (transitioning) {
    return (
      <div className="max-w-md mx-auto flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Preparando siguiente evaluación...</p>
      </div>
    );
  }

  const renderModule = () => {
    switch (activeModule) {
      case 'landing':
        return <MinaTalentLanding name={candidateName} onNameChange={setCandidateName} onStart={() => setActiveModule('disc')} />;
      case 'disc':
        return <DiscTest onComplete={(scores, raw) => { setDiscScores(scores); setDiscRaw(raw); handleModuleComplete('disc'); transitionTo('wonderlic'); }} />;
      case 'wonderlic':
        return <WonderlicTest onComplete={(result, raw) => { setWonderlicResult(result); setWonderlicRaw(raw); handleModuleComplete('wonderlic'); transitionTo('bigfive'); }} />;
      case 'bigfive':
        return <BigFiveTest onComplete={(scores, raw) => { setBigFiveScores(scores); setBigFiveRaw(raw); handleModuleComplete('bigfive'); transitionTo('integridad'); }} />;
      case 'integridad':
        return <IntegridadTest onComplete={(score, raw) => { setIntegrityScore(score); setIntegrityRaw(raw); handleModuleComplete('integridad'); transitionTo('hogan'); }} />;
      case 'hogan':
        return <HoganTest onComplete={(scores, raw) => { setHoganScores(scores); setHoganRaw(raw); handleModuleComplete('hogan'); transitionTo('fitsocial'); }} />;
      case 'fitsocial':
        return <FitSocialTest onComplete={(scores, raw) => { setFitSocialScores(scores); setFitSocialRaw(raw); handleModuleComplete('fitsocial'); transitionTo('results'); }} />;
      case 'results':
        if (!discScores || !wonderlicResult || !bigFiveScores || !integrityScore || !hoganScores || !fitSocialScores) return null;
        return (
          <ResultDashboard
            candidateName={candidateName}
            discScores={discScores} discRaw={discRaw}
            wonderlicResult={wonderlicResult} wonderlicRaw={wonderlicRaw}
            bigFiveScores={bigFiveScores} bigFiveRaw={bigFiveRaw}
            integrityScore={integrityScore} integrityRaw={integrityRaw}
            hoganScores={hoganScores} hoganRaw={hoganRaw}
            fitSocialScores={fitSocialScores} fitSocialRaw={fitSocialRaw}
            onRestart={() => {
              clearSavedState();
              setActiveModule('landing');
              setCompletedModules([]);
              setCandidateName('');
              setDiscScores(null); setDiscRaw({});
              setWonderlicResult(null); setWonderlicRaw({});
              setBigFiveScores(null); setBigFiveRaw({});
              setIntegrityScore(null); setIntegrityRaw({});
              setHoganScores(null); setHoganRaw({});
              setFitSocialScores(null); setFitSocialRaw({});
            }}
          />
        );

      default:
        return null;
    }
  };

  const showHeader = activeModule !== 'landing' && activeModule !== 'results';

  return (
    <div className="font-sans">
      {/* Module tabs */}
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between px-1 mb-2">
          <button onClick={goBack} className="flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-[10px] font-bold">Volver</span>
          </button>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span className="text-[9px] text-slate-400 font-mono">{completedModules.length}/6</span>
          </div>
        </div>

        {/* Progress bar */}
        {showHeader && (
          <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-amber-600 rounded-full" />
          </div>
        )}

        {/* Module indicator chips */}
        {showHeader && (
          <div className="flex gap-1.5 mb-3 overflow-x-auto no-scrollbar">
            {testModules.map((m, i) => {
              const isActive = m === activeModule;
              const isDone = completedModules.includes(m);
              const isDisabled = !isActive && !isDone;
              return (
                <div key={m}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[8px] font-bold tracking-wider whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white'
                      : isDone
                        ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50'
                        : 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 border border-dashed border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {isDone && <CheckCircle className="w-2.5 h-2.5" />}
                  {i + 1}. {moduleNames[m]}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeModule}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {renderModule()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
