import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { bigFiveQuestions } from './questions';
import { BigFiveScores } from './scoring';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';

interface BigFiveProps {
  onComplete: (scores: BigFiveScores, raw: Record<number, number>) => void;
}

const likertLabels = ['Totalmente en desacuerdo', 'En desacuerdo', 'Neutral', 'De acuerdo', 'Totalmente de acuerdo'];

export default function BigFiveTest({ onComplete }: BigFiveProps) {
  const [step, setStep] = useState<'instructions' | 'test' | 'result'>('instructions');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const q = bigFiveQuestions[index];
  const progress = ((index + 1) / bigFiveQuestions.length) * 100;

  const dimNames: Record<string, string> = {
    openness: 'Apertura a la Experiencia',
    conscientiousness: 'Responsabilidad',
    extraversion: 'Extraversión',
    agreeableness: 'Amabilidad',
    neuroticism: 'Estabilidad Emocional',
  };

  const handleAnswer = (val: number) => {
    setAnswers(a => ({ ...a, [q.id]: val }));
    if (index < bigFiveQuestions.length - 1) {
      setTimeout(() => setIndex(i => i + 1), 200);
    }
  };

  const handlePrev = () => { if (index > 0) setIndex(i => i - 1); };

  if (step === 'instructions') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto space-y-5 font-sans">
        <div className="text-center pt-4 space-y-2">
          <span className="inline-flex p-2.5 bg-emerald-100 dark:bg-emerald-950/50 rounded-xl">
            <Users className="w-6 h-6 text-emerald-600" />
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Inventario Big Five</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            Evalúa cinco dimensiones fundamentales de tu personalidad laboral.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Indique su nivel de acuerdo con cada afirmación usando una escala del 1 al 5.
            Responda con honestidad — no hay respuestas correctas.
          </p>
        </div>
        <button onClick={() => setStep('test')} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm transition-all">
          Comenzar Evaluación
        </button>
      </motion.div>
    );
  }

  if (step === 'result') {
    const dimQuestions: { id: number; dim: string; dir: string }[] = [
      { id: 1, dim: 'conscientiousness', dir: 'pos' }, { id: 2, dim: 'neuroticism', dir: 'neg' },
      { id: 3, dim: 'extraversion', dir: 'pos' }, { id: 4, dim: 'openness', dir: 'pos' },
      { id: 5, dim: 'agreeableness', dir: 'pos' }, { id: 6, dim: 'conscientiousness', dir: 'pos' },
      { id: 7, dim: 'neuroticism', dir: 'pos' }, { id: 8, dim: 'extraversion', dir: 'neg' },
      { id: 9, dim: 'openness', dir: 'pos' }, { id: 10, dim: 'agreeableness', dir: 'pos' },
      { id: 11, dim: 'conscientiousness', dir: 'pos' }, { id: 12, dim: 'neuroticism', dir: 'pos' },
      { id: 13, dim: 'extraversion', dir: 'pos' }, { id: 14, dim: 'openness', dir: 'neg' },
      { id: 15, dim: 'agreeableness', dir: 'pos' }, { id: 16, dim: 'conscientiousness', dir: 'pos' },
      { id: 17, dim: 'neuroticism', dir: 'pos' }, { id: 18, dim: 'extraversion', dir: 'pos' },
      { id: 19, dim: 'openness', dir: 'pos' }, { id: 20, dim: 'agreeableness', dir: 'pos' },
      { id: 21, dim: 'conscientiousness', dir: 'pos' }, { id: 22, dim: 'neuroticism', dir: 'neg' },
      { id: 23, dim: 'extraversion', dir: 'neg' }, { id: 24, dim: 'openness', dir: 'pos' },
      { id: 25, dim: 'agreeableness', dir: 'pos' },
    ];
    const dims = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    const raw: Record<string, number[]> = {};
    dims.forEach(d => raw[d] = []);
    dimQuestions.forEach(qi => {
      const val = answers[qi.id];
      if (val === undefined) return;
      raw[qi.dim].push(qi.dir === 'neg' ? 6 - val : val);
    });
    const scores: Record<string, number> = {};
    dims.forEach(d => {
      const vals = raw[d];
      scores[d] = vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 20) : 50;
    });

    const dimColors: Record<string, string> = {
      openness: '#8b5cf6', conscientiousness: '#10b981', extraversion: '#f59e0b',
      agreeableness: '#3b82f6', neuroticism: '#ef4444',
    };
    const dimInterpretations: Record<string, { high: string; low: string }> = {
      openness: { high: 'Alta apertura: creativo, curioso, adaptable a cambios tecnológicos', low: 'Baja apertura: prefiere rutinas establecidas, métodos tradicionales' },
      conscientiousness: { high: 'Alta responsabilidad: organizado, confiable, excelente para seguridad', low: 'Baja responsabilidad: flexible pero requiere supervisión en detalles' },
      extraversion: { high: 'Alta extraversión: sociable, comunicativo, buen trabajo en equipo', low: 'Baja extraversión: autónomo, concentrado, buen desempeño individual' },
      agreeableness: { high: 'Alta amabilidad: cooperativo, empático, excelente para RRCC', low: 'Baja amabilidad: directo, crítico, buen supervisor de producción' },
      neuroticism: { high: 'Alta estabilidad: maneja presión, ideal para operaciones críticas', low: 'Requiere apoyo emocional: sensible al estrés laboral' },
    };
    // Invert neuroticism display (higher = better for mining)
    scores.neuroticism = 100 - scores.neuroticism;

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto space-y-5 font-sans">
        <div className="text-center pt-2 space-y-1">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Resultados Big Five</h2>
          <p className="text-xs text-slate-400">Perfil de personalidad laboral</p>
        </div>

        <div className="space-y-2.5">
          {dims.map(d => {
            const pct = scores[d];
            const isHigh = pct >= 60;
            return (
              <div key={d} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{dimNames[d]}</span>
                  <span className="text-xs font-mono font-bold flex items-center gap-1">
                    <span style={{ color: dimColors[d] }}>{pct}%</span>
                    {isHigh && <span className="text-[8px] text-emerald-600 uppercase">Fortaleza</span>}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }}
                    className="h-full rounded-full" style={{ backgroundColor: dimColors[d] }} />
                </div>
                <p className="text-[9px] text-slate-400 mt-1.5 leading-tight">
                  {d === 'neuroticism' ? (pct >= 60 ? dimInterpretations[d].high : dimInterpretations[d].low) : (isHigh ? dimInterpretations[d].high : dimInterpretations[d].low)}
                </p>
              </div>
            );
          })}
        </div>

        <button onClick={() => onComplete(scores as unknown as BigFiveScores, answers)} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
          Continuar
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase">Big Five</span>
        <span className="text-xs font-mono font-bold text-slate-500">{Math.round(progress)}%</span>
      </div>
      <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full uppercase tracking-wider">{dimNames[q.dimension]}</span>
              <span className="text-[10px] text-slate-400 font-mono">{index + 1}/{bigFiveQuestions.length}</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{q.text}</p>
            <div className="space-y-1.5">
              {likertLabels.map((label, li) => {
                const val = li + 1;
                const selected = answers[q.id] === val;
                return (
                  <button key={li} onClick={() => handleAnswer(val)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                      selected ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      selected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {selected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <span className={`text-xs font-medium ${selected ? 'text-emerald-800 dark:text-emerald-200 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-center gap-1.5">
        {bigFiveQuestions.map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${answers[i + 1] ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
        ))}
      </div>

      {index > 0 && (
        <button onClick={handlePrev} className="w-full py-2.5 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
          Anterior
        </button>
      )}
      {index === bigFiveQuestions.length - 1 && Object.keys(answers).length === bigFiveQuestions.length && (
        <button onClick={() => setStep('result')} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm transition-all">
          Ver Resultados
        </button>
      )}
    </div>
  );
}
