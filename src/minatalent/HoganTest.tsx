import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { hoganQuestions } from './questions';
import { HoganScores } from './scoring';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';

interface HoganProps {
  onComplete: (scores: HoganScores, raw: Record<number, number>) => void;
}

export default function HoganTest({ onComplete }: HoganProps) {
  const [step, setStep] = useState<'instructions' | 'test' | 'result'>('instructions');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const q = hoganQuestions[index];
  const progress = (Object.keys(answers).length / hoganQuestions.length) * 100;

  const dimNames: Record<string, string> = {
    leadership: 'Liderazgo',
    prudence: 'Prudencia',
    resilience: 'Resiliencia',
    sociability: 'Sociabilidad',
    learning: 'Aprendizaje',
  };

  const handleAnswer = (val: number) => {
    setAnswers(a => ({ ...a, [q.id]: val }));
    if (index < hoganQuestions.length - 1) {
      setTimeout(() => setIndex(i => i + 1), 200);
    }
  };

  const handlePrev = () => { if (index > 0) setIndex(i => i - 1); };

  if (step === 'instructions') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto space-y-5 font-sans">
        <div className="text-center pt-4 space-y-2">
          <span className="inline-flex p-2.5 bg-violet-100 dark:bg-violet-950/50 rounded-xl">
            <FileText className="w-6 h-6 text-violet-600" />
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Hogan Assessment</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            Evalúa liderazgo, prudencia, resiliencia y potencial de desarrollo en el entorno minero.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Indique su nivel de acuerdo con cada afirmación. Esta evaluación mide su potencial de liderazgo 
            y capacidad de adaptación en operaciones mineras de alta exigencia.
          </p>
        </div>
        <button onClick={() => setStep('test')} className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold text-sm transition-all">
          Comenzar Evaluación
        </button>
      </motion.div>
    );
  }

  if (step === 'result') {
    const dimMap: Record<number, string> = {
      1: 'leadership', 2: 'prudence', 3: 'resilience', 4: 'sociability', 5: 'learning',
      6: 'leadership', 7: 'prudence', 8: 'resilience', 9: 'sociability', 10: 'learning',
      11: 'leadership', 12: 'prudence', 13: 'resilience', 14: 'sociability', 15: 'learning',
      16: 'leadership', 17: 'prudence', 18: 'resilience', 19: 'sociability', 20: 'learning',
    };
    const raw: Record<string, number[]> = { leadership: [], prudence: [], resilience: [], sociability: [], learning: [] };
    Object.entries(answers).forEach(([qId, val]: [string, number]) => {
      const dim = dimMap[parseInt(qId)];
      if (dim) raw[dim].push((val / 4) * 100);
    });
    const scores: Record<string, number> = {};
    Object.entries(raw).forEach(([dim, vals]) => {
      scores[dim] = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 50;
    });
    const dims: (keyof HoganScores)[] = ['leadership', 'prudence', 'resilience', 'sociability', 'learning'];
    const dimColors: Record<string, string> = {
      leadership: '#8b5cf6', prudence: '#3b82f6', resilience: '#10b981',
      sociability: '#f59e0b', learning: '#ec4899',
    };
    const strengths = dims.filter(d => scores[d] >= 65);
    const risks = dims.filter(d => scores[d] < 45);

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto space-y-5 font-sans">
        <div className="text-center pt-2 space-y-1">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Resultados Hogan</h2>
          <p className="text-xs text-slate-400">Potencial de liderazgo y adaptación</p>
        </div>

        <div className="space-y-2">
          {dims.map(d => {
            const pct = scores[d];
            return (
              <div key={d} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{dimNames[d]}</span>
                  <span className="text-xs font-mono font-bold" style={{ color: dimColors[d] }}>{pct}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }}
                    className="h-full rounded-full" style={{ backgroundColor: dimColors[d] }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {strengths.length > 0 && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-3">
              <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-wider mb-1.5">Fortalezas</p>
              {strengths.map(s => <p key={s} className="text-[10px] text-emerald-700 dark:text-emerald-300">▸ {dimNames[s]}</p>)}
            </div>
          )}
          {risks.length > 0 && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-xl p-3">
              <p className="text-[8px] font-bold text-red-600 uppercase tracking-wider mb-1.5">Riesgos</p>
              {risks.map(s => <p key={s} className="text-[10px] text-red-700 dark:text-red-400">▸ Bajo {dimNames[s]}</p>)}
            </div>
          )}
        </div>

        <button onClick={() => onComplete(scores as unknown as HoganScores, answers)} className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
          Continuar
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 tracking-widest uppercase">Hogan</span>
        <span className="text-xs font-mono font-bold text-slate-500">{Math.round(progress)}%</span>
      </div>
      <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full bg-violet-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full uppercase tracking-wider">{dimNames[q.dimension]}</span>
              <span className="text-[10px] text-slate-400 font-mono">{index + 1}/{hoganQuestions.length}</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{q.text}</p>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { val: 1, label: 'TD' },
                { val: 2, label: 'D' },
                { val: 3, label: 'N' },
                { val: 4, label: 'A' },
                { val: 5, label: 'TA' },
              ].map(opt => {
                const selected = answers[q.id] === opt.val;
                return (
                  <button key={opt.val} onClick={() => handleAnswer(opt.val)}
                    className={`py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                      selected ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-300' : 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between text-[8px] text-slate-400 px-0.5">
              <span>Totalmente en desacuerdo</span>
              <span>Totalmente de acuerdo</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-center gap-1.5">
        {hoganQuestions.map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${answers[i + 1] ? 'bg-violet-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
        ))}
      </div>

      {(index > 0) && (
        <button onClick={handlePrev} className="w-full py-2.5 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
          Anterior
        </button>
      )}
      {index === hoganQuestions.length - 1 && Object.keys(answers).length === hoganQuestions.length && (
        <button onClick={() => setStep('result')} className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold text-sm transition-all">
          Ver Resultados
        </button>
      )}
    </div>
  );
}
