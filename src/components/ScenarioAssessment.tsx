import React, { useState, useMemo } from 'react';
import { vocQuestions, vocationalProfiles } from '../data';
import { motion, AnimatePresence } from 'motion/react';

const profileIcons: Record<string, string> = {
  geologo: '⛏️',
  hse: '🛡️',
  operaciones: '⚙️',
  metalurgista: '🧪',
  mecanico: '🔧',
  geomecanico: '📐',
  ambiental: '🌿',
  topografo: '📏',
};

export default function ScenarioAssessment() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const question = vocQuestions[currentIndex];

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
  };

  const isLastQuestion = currentIndex === vocQuestions.length - 1;

  const handleNext = () => {
    if (!answers[question.id]) return;
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const results = useMemo(() => {
    const scores: Record<string, number> = {};
    vocationalProfiles.forEach((p) => { scores[p.id] = 0; });

    vocQuestions.forEach((q) => {
      const chosenId = answers[q.id];
      if (!chosenId) return;
      const option = q.options.find((o) => o.id === chosenId);
      if (!option) return;
      Object.entries(option.scores).forEach(([profileId, score]) => {
        scores[profileId] = (scores[profileId] || 0) + score;
      });
    });

    const matched = vocationalProfiles
      .map((p) => ({ ...p, score: scores[p.id] || 0 }))
      .sort((a, b) => b.score - a.score);

    const maxScore = matched[0]?.score || 1;
    const weighted = matched.map((p) => ({
      ...p,
      percentage: Math.round((p.score / maxScore) * 100),
    }));

    return weighted;
  }, [answers]);

  const topProfile = results[0];

  const progress = (Object.keys(answers).length / vocQuestions.length) * 100;

  if (showResults) {
    return (
      <div className="max-w-md mx-auto space-y-5 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          <div className="text-center space-y-2 pt-2">
            <span className="text-5xl block">{profileIcons[topProfile?.id] || '🎯'}</span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Test Finalizado</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Basado en la operación de Cerro Lindo y minas polimetálicas subterráneas</p>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-5 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none blur-3xl opacity-20" style={{ backgroundColor: topProfile?.color }} />

            <div className="text-center space-y-1">
              <span className="text-[10px] text-amber-500 font-bold tracking-widest uppercase">PERFIL RECOMENDADO</span>
              <h3 className="text-xl font-black tracking-tight">{topProfile?.name}</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500">{topProfile?.title}</p>
            </div>

            <div className="p-4 rounded-xl border" style={{ backgroundColor: `${topProfile?.color}15`, borderColor: `${topProfile?.color}30` }}>
              <p className="text-xs leading-relaxed text-slate-200">{topProfile?.description}</p>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase block">COMPETENCIAS CLAVE</span>
              <div className="flex flex-wrap gap-1.5">
                {topProfile?.skills.map((s) => (
                  <span key={s} className="px-2.5 py-1 text-[10px] font-semibold rounded-full" style={{ backgroundColor: `${topProfile?.color}20`, color: topProfile?.color }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase block">TAREAS DIARIAS</span>
              <ul className="space-y-1">
                {topProfile?.dailyTasks.map((t) => (
                  <li key={t} className="text-[11px] text-slate-300 flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">▸</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl border border-white/5 text-center" style={{ backgroundColor: `${topProfile?.color}10` }}>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block mb-1">DEMANDA LABORAL</span>
              <p className="text-xs text-slate-200">{topProfile?.demandLevel}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">TABLA DE PERFILES</span>
            {results.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-base w-6 text-center">{profileIcons[p.id] || '•'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{p.name}</span>
                    <span className="font-mono text-slate-400 dark:text-slate-500">{p.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${p.percentage}%`, backgroundColor: p.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => { setCurrentIndex(0); setAnswers({}); setShowResults(false); }}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Reiniciar Test
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-5 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 block uppercase">MINATALENT ASSESSMENT</span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">Prueba Vocacional</h1>
        </div>
        <div className="bg-slate-900 text-white px-3 py-1 rounded-xl flex items-center gap-1 shadow-sm">
          <span className="text-xs font-mono font-bold tracking-wider">{currentIndex + 1}/{vocQuestions.length}</span>
        </div>
      </div>

      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-amber-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{question.icon}</span>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {question.dimension}
              </span>
            </div>

            <p className="text-base font-bold text-slate-900 dark:text-white leading-snug">
              {question.question}
            </p>

            <div className="space-y-2">
              {question.options.map((option) => {
                const isSelected = answers[question.id] === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full text-left bg-white dark:bg-slate-900 border rounded-xl p-3.5 flex items-start gap-3 transition-all outline-none ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/40 shadow-xs ring-2 ring-amber-500/10'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors ${
                      isSelected ? 'border-amber-600 bg-amber-600' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <span className={`text-sm leading-tight ${isSelected ? 'text-amber-950 font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-3">
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="px-5 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            Anterior
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!answers[question.id]}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
            answers[question.id]
              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }`}
        >
          {isLastQuestion ? 'VER RESULTADOS' : 'SIGUIENTE'}
        </button>
      </div>
    </div>
  );
}
