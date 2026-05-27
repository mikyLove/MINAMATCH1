import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { fitSocialQuestions } from './questions';
import { FitSocialScore, calculateFitSocial } from './scoring';
import { ChevronLeft, ChevronRight, Globe } from 'lucide-react';

interface FitSocialProps {
  onComplete: (scores: FitSocialScore, raw: Record<number, number>) => void;
}

const likertLabels = ['Totalmente en desacuerdo', 'En desacuerdo', 'Neutral', 'De acuerdo', 'Totalmente de acuerdo'];

export default function FitSocialTest({ onComplete }: FitSocialProps) {
  const [step, setStep] = useState<'instructions' | 'test'>('instructions');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const q = fitSocialQuestions[index];
  const progress = ((index + 1) / fitSocialQuestions.length) * 100;

  const handleAnswer = (val: number) => {
    const updatedAnswers = { ...answers, [q.id]: val };
    setAnswers(updatedAnswers);
    
    if (index < fitSocialQuestions.length - 1) {
      setTimeout(() => setIndex(i => i + 1), 200);
    } else {
      const finalScore = calculateFitSocial(updatedAnswers);
      onComplete(finalScore, updatedAnswers);
    }
  };

  if (step === 'instructions') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto space-y-5 font-sans">
        <div className="text-center pt-4 space-y-2">
          <span className="inline-flex p-2.5 bg-amber-100 dark:bg-amber-950/50 rounded-xl">
            <Globe className="w-6 h-6 text-amber-600" />
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Aptitud Social</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            Evaluamos tu capacidad de adaptación al entorno social y comunitario de las operaciones en Puno.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Responde según tu criterio profesional sobre la relación entre la mina, el medio ambiente y las comunidades locales.
          </p>
        </div>
        <button onClick={() => setStep('test')} className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-sm transition-all">
          Comenzar Módulo Social
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 tracking-widest uppercase">Fit Social</span>
        <span className="text-xs font-mono font-bold text-slate-500">{Math.round(progress)}%</span>
      </div>
      <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full bg-amber-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full uppercase tracking-wider">{q.dimension}</span>
              <span className="text-[10px] text-slate-400 font-mono">{index + 1}/{fitSocialQuestions.length}</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{q.text}</p>
            <div className="space-y-1.5">
              {likertLabels.map((label, li) => {
                const val = li;
                const selected = answers[q.id] === val;
                return (
                  <button key={li} onClick={() => handleAnswer(val)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                      selected ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      selected ? 'border-amber-600 bg-amber-600' : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {selected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <span className={`text-xs font-medium ${selected ? 'text-amber-800 dark:text-amber-200 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between gap-3">
        <button 
          onClick={() => index > 0 && setIndex(i => i - 1)} 
          disabled={index === 0}
          className="px-4 py-2 text-xs font-bold text-slate-400 disabled:opacity-30"
        >
          Anterior
        </button>
        <div className="flex gap-1">
          {fitSocialQuestions.map((_, i) => (
            <div key={i} className={`w-1 h-1 rounded-full ${i === index ? 'bg-amber-500' : 'bg-slate-300'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}