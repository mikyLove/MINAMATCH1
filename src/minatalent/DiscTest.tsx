import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { discWordGroups } from './questions';
import { DiscScores } from './scoring';
import { ChevronLeft, ChevronRight, Brain } from 'lucide-react';

interface DiscProps {
  onComplete: (scores: DiscScores, raw: Record<string, { most: number; least: number }>) => void;
}

export default function DiscTest({ onComplete }: DiscProps) {
  const [step, setStep] = useState<'instructions' | 'test' | 'result'>('instructions');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { most: number; least: number }>>({});
  const [selectedMost, setSelectedMost] = useState<number | null>(null);
  const [selectedLeast, setSelectedLeast] = useState<number | null>(null);
  const [validated, setValidated] = useState(false);

  const group = discWordGroups[index];
  const current = answers[group.id] || { most: -1, least: -1 };
  const isComplete = Object.keys(answers).length === discWordGroups.length;

  const handleSelect = (type: 'most' | 'least', wordIndex: number) => {
    if (type === 'most') {
      if (selectedLeast === wordIndex) setSelectedLeast(null);
      setSelectedMost(wordIndex === selectedMost ? null : wordIndex);
    } else {
      if (selectedMost === wordIndex) setSelectedMost(null);
      setSelectedLeast(wordIndex === selectedLeast ? null : wordIndex);
    }
    setValidated(false);
  };

  const handleNext = () => {
    if (selectedMost === null || selectedLeast === null) {
      setValidated(true);
      return;
    }
    if (selectedMost === selectedLeast) {
      setValidated(true);
      return;
    }
    const newAnswers = { ...answers, [group.id]: { most: selectedMost, least: selectedLeast } };
    setAnswers(newAnswers);
    setSelectedMost(null);
    setSelectedLeast(null);
    setValidated(false);
    if (index < discWordGroups.length - 1) {
      setIndex(i => i + 1);
    } else {
      setStep('result');
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(i => i - 1);
      const prev = answers[discWordGroups[index - 1].id];
      setSelectedMost(prev?.most ?? null);
      setSelectedLeast(prev?.least ?? null);
    }
  };

  if (step === 'instructions') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto space-y-5 font-sans">
        <div className="text-center pt-4 space-y-2">
          <span className="inline-flex p-2.5 bg-indigo-100 dark:bg-indigo-950/50 rounded-xl">
            <Brain className="w-6 h-6 text-indigo-600" />
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Evaluación DISC</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            Evalúa tu perfil conductual en cuatro dimensiones: Dominancia, Influencia, Estabilidad y Cumplimiento.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Para cada grupo de palabras, seleccione la que <strong className="text-slate-900 dark:text-white">MÁS</strong> lo describe 
            y la que <strong className="text-slate-900 dark:text-white">MENOS</strong> lo describe. 
            No hay respuestas correctas o incorrectas.
          </p>
          <div className="flex items-center gap-3 text-[10px] font-bold">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Más = +1 punto</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Menos = -1 punto</span>
          </div>
        </div>
        <button onClick={() => setStep('test')} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-all">
          Comenzar Evaluación
        </button>
      </motion.div>
    );
  }

  if (step === 'result') {
    const dims: (keyof DiscScores)[] = ['D', 'I', 'S', 'C'];
    const calculateDiscFn = () => {
      const scores: DiscScores = { D: 0, I: 0, S: 0, C: 0 };
      Object.values(answers).forEach((a: { most: number; least: number }) => {
        if (a.most !== -1) scores[dims[a.most]]++;
        if (a.least !== -1) scores[dims[a.least]]--;
      });
      const max = Math.max(...Object.values(scores), 1);
      return Object.fromEntries(Object.entries(scores).map(([k, v]) => [k, Math.round(((v + 12) / 24) * 100)])) as unknown as DiscScores;
    };
    const scores = calculateDiscFn();
    const labels: Record<keyof DiscScores, string> = { D: 'Dominancia', I: 'Influencia', S: 'Estabilidad', C: 'Cumplimiento' };
    const colors: Record<keyof DiscScores, string> = { D: '#ef4444', I: '#f59e0b', S: '#10b981', C: '#3b82f6' };

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto space-y-5 font-sans">
        <div className="text-center pt-2 space-y-1">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Resultados DISC</h2>
          <p className="text-xs text-slate-400">Perfil conductual completado</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <svg viewBox="0 0 220 220" className="w-full max-w-[220px] mx-auto">
            <polygon points="110,10 210,110 110,210 10,110" fill="none" stroke="#e2e8f0" strokeWidth="1" />
            <polygon points="110,40 180,110 110,180 40,110" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
            <polygon points="110,70 150,110 110,150 70,110" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
            {dims.map((d, i) => {
              const angle = (i * 90 - 90) * (Math.PI / 180);
              const r = (scores[d] / 100) * 100;
              const x = 110 + r * Math.cos(angle);
              const y = 110 + r * Math.sin(angle);
              return { x, y };
            }).map((p, i, arr) => {
              const next = arr[(i + 1) % arr.length];
              return <line key={i} x1={p.x} y1={p.y} x2={next.x} y2={next.y} stroke="#6366f1" strokeWidth="2" opacity="0.6" />;
            })}
            {dims.map((d, i) => {
              const angle = (i * 90 - 90) * (Math.PI / 180);
              const r = (scores[d] / 100) * 100;
              const x = 110 + r * Math.cos(angle);
              const y = 110 + r * Math.sin(angle);
              return <circle key={d} cx={x} cy={y} r="4" fill={colors[d]} />;
            })}
            <text x="110" y="14" textAnchor="middle" fontSize="12" fontWeight="bold" fill={colors.D}>D</text>
            <text x="212" y="114" textAnchor="start" fontSize="12" fontWeight="bold" fill={colors.I}>I</text>
            <text x="110" y="220" textAnchor="middle" fontSize="12" fontWeight="bold" fill={colors.S}>S</text>
            <text x="4" y="114" textAnchor="end" fontSize="12" fontWeight="bold" fill={colors.C}>C</text>
          </svg>
        </div>

        <div className="space-y-2">
          {dims.map(d => {
            const pct = scores[d];
            const dominant = pct >= 70;
            return (
              <div key={d} className="flex items-center gap-3">
                <span className="w-6 text-center text-xs font-black" style={{ color: colors[d] }}>{d}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">{labels[d]}</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} className="h-full rounded-full" style={{ backgroundColor: colors[d] }} />
                  </div>
                </div>
                {dominant && <span className="text-[8px] font-bold text-emerald-600 uppercase shrink-0">Alto</span>}
              </div>
            );
          })}
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
          <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
            {scores.D >= 60 ? 'Perfil con alta Dominancia. Orientado a resultados, toma decisiones rápidas.' : ''}
            {scores.I >= 60 ? ' Alta Influencia. Comunicativo, persuasivo, trabaja bien con personas.' : ''}
            {scores.S >= 60 ? ' Alta Estabilidad. Confiable, paciente, buen trabajo en equipo.' : ''}
            {scores.C >= 60 ? ' Alto Cumplimiento. Preciso, meticuloso, sigue procedimientos.' : ''}
            {[scores.D, scores.I, scores.S, scores.C].every(s => s < 60) ? 'Perfil equilibrado sin una dimensión dominante. Versátil y adaptable.' : ''}
          </p>
        </div>

        <button onClick={() => onComplete(scores, answers)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
          Continuar
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  const progress = (index / discWordGroups.length) * 100;

  return (
    <div className="max-w-md mx-auto space-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase">DISC</span>
          <p className="text-[9px] text-slate-400">Palabra {index + 1} de {discWordGroups.length}</p>
        </div>
        <span className="text-xs font-mono font-bold text-slate-500">{Math.round(progress)}%</span>
      </div>

      {/* Progress */}
      <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={group.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-center tracking-wide">
              Seleccione la palabra que <span className="text-emerald-600">MÁS</span> y la que <span className="text-red-500">MENOS</span> lo describe
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {group.words.map((word, wi) => {
                const isMost = selectedMost === wi;
                const isLeast = selectedLeast === wi;
                const isDisabled = (selectedMost !== null && selectedLeast !== null) && !isMost && !isLeast;
                return (
                  <div key={wi} className="space-y-1.5">
                    <button
                      onClick={() => { if (!isDisabled || isMost || isLeast) { handleSelect('most', wi); } }}
                      className={`w-full py-2.5 px-3 rounded-xl border-2 text-sm font-bold transition-all text-center ${
                        isMost ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300' :
                        isLeast ? 'border-red-300 bg-red-50 dark:bg-red-950/20 text-slate-400 dark:text-slate-500 line-through' :
                        isDisabled ? 'border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed' :
                        'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      {word}
                    </button>
                    <div className="flex gap-1.5 justify-center">
                      <button
                        onClick={() => handleSelect('most', wi)}
                        className={`w-6 h-5 rounded text-[8px] font-extrabold transition-all ${
                          isMost ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/30'
                        }`}
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleSelect('least', wi)}
                        className={`w-6 h-5 rounded text-[8px] font-extrabold transition-all ${
                          isLeast ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-red-100 dark:hover:bg-red-950/30'
                        }`}
                      >
                        −
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {validated && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-red-500 font-semibold text-center">
                Debe seleccionar una palabra MÁS y una MENOS diferentes
              </motion.p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        {index > 0 && (
          <button onClick={handlePrev} className="px-4 py-3 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        <button onClick={handleNext} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
          selectedMost !== null && selectedLeast !== null && selectedMost !== selectedLeast
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
        }`}>
          {index < discWordGroups.length - 1 ? 'Siguiente' : 'Ver Resultados'}
        </button>
      </div>
    </div>
  );
}
