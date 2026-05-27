import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { wonderlicQuestions } from './questions';
import { WonderlicResult } from './scoring';
import { ChevronLeft, ChevronRight, Clock, Brain } from 'lucide-react';

interface WonderlicProps {
  onComplete: (result: WonderlicResult, raw: Record<number, number>) => void;
}

const TIME_LIMIT = location.search.includes('demo') ? 60 : 12 * 60;

export default function WonderlicTest({ onComplete }: WonderlicProps) {
  const [step, setStep] = useState<'instructions' | 'test' | 'result' | 'timeout'>('instructions');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (step !== 'test') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current!); setStep('timeout'); return 0; } return t - 1; });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step]);

  const q = wonderlicQuestions[index];
  const progress = ((index + 1) / wonderlicQuestions.length) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerWarning = timeLeft < 120;
  const timerCritical = timeLeft < 30;

  const handleAnswer = (optIndex: number) => {
    setAnswers(a => ({ ...a, [q.id]: optIndex }));
  };

  const handleNext = () => {
    if (answers[q.id] === undefined) return;
    if (index < wonderlicQuestions.length - 1) {
      setIndex(i => i + 1);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setStep('result');
    }
  };

  const handlePrev = () => {
    if (index > 0) setIndex(i => i - 1);
  };

  if (step === 'instructions') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto space-y-5 font-sans">
        <div className="text-center pt-4 space-y-2">
          <span className="inline-flex p-2.5 bg-amber-100 dark:bg-amber-950/50 rounded-xl">
            <Brain className="w-6 h-6 text-amber-600" />
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Test Wonderlic</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            Evalúa razonamiento lógico, rapidez mental y capacidad cognitiva para entornos mineros exigentes.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-amber-600">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold">12 minutos — 30 preguntas</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Responda lo más rápido y preciso posible. Cada pregunta tiene una sola respuesta correcta.
          </p>
        </div>
        <button onClick={() => { setStep('test'); setTimeLeft(TIME_LIMIT); }} className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-sm transition-all">
          Comenzar Test
        </button>
      </motion.div>
    );
  }

  if (step === 'timeout') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto space-y-5 font-sans pt-10">
        <div className="text-center space-y-3">
          <span className="inline-flex p-4 bg-red-100 dark:bg-red-950/40 rounded-full">
            <Clock className="w-8 h-8 text-red-600" />
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">¡Tiempo agotado!</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            El límite de 12 minutos ha finalizado. Las respuestas registradas hasta ahora serán evaluadas automáticamente.
          </p>
        </div>
        <button onClick={() => setStep('result')} className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-sm transition-all">
          Ver resultados
        </button>
      </motion.div>
    );
  }

  if (step === 'result') {
    if (timerRef.current) clearInterval(timerRef.current);
    const correct = wonderlicQuestions.reduce((acc, q) => acc + (answers[q.id] === q.correct ? 1 : 0), 0);
    const total = wonderlicQuestions.length;
    const percentage = Math.round((correct / total) * 100);
    let level: WonderlicResult['level'];
    let percentile: number;
    if (correct >= 27) { level = 'Excelente'; percentile = 95; }
    else if (correct >= 22) { level = 'Bueno'; percentile = 75; }
    else if (correct >= 15) { level = 'Promedio'; percentile = 50; }
    else { level = 'Bajo'; percentile = 20; }
    const result: WonderlicResult = { correct, total, percentage, level, percentile };
    const levelColors: Record<string, string> = { Excelente: 'bg-emerald-600', Bueno: 'bg-blue-600', Promedio: 'bg-amber-600', Bajo: 'bg-slate-600' };

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto space-y-5 font-sans">
        <div className="text-center pt-2 space-y-1">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Resultados Wonderlic</h2>
          <p className="text-xs text-slate-400">Razonamiento cognitivo</p>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-6 text-center space-y-3 border border-slate-800">
          <span className={`inline-block px-4 py-1 rounded-full text-[10px] font-black tracking-wider ${levelColors[level]}`}>{level}</span>
          <div className="text-5xl font-black font-mono">{correct}<span className="text-2xl text-slate-400">/{total}</span></div>
          <p className="text-xs text-slate-400">Percentil <strong className="text-white">{percentile}</strong> — {percentage}% de aciertos</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Interpretación</p>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {level === 'Excelente' ? 'Capacidad cognitiva superior. Aptitud comprobada para roles de liderazgo técnico y resolución de problemas complejos.' : ''}
            {level === 'Bueno' ? 'Buena capacidad de razonamiento. Aptitud para supervisión y puestos que requieren análisis técnico.' : ''}
            {level === 'Promedio' ? 'Capacidad cognitiva dentro del promedio minero. Aptitud para roles operativos con supervisión.' : ''}
            {level === 'Bajo' ? 'Se recomienda reforzar habilidades de razonamiento. Roles operativos con supervisión directa.' : ''}
          </p>
        </div>

        <button onClick={() => onComplete(result, answers)} className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
          Continuar
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4 font-sans">
      {/* Timer */}
      <div className={`flex items-center justify-between px-1 ${timerWarning ? 'text-red-500' : 'text-slate-500'}`}>
        <span className="text-[10px] font-bold tracking-wider uppercase">Wonderlic</span>
        <div className={`flex items-center gap-1.5 ${timerCritical ? 'bg-red-100 dark:bg-red-950/40 px-2 py-1 rounded-lg' : ''}`}>
          <Clock className={`w-3.5 h-3.5 ${timerCritical ? 'animate-ping' : ''}`} />
          <span className={`font-mono font-bold text-sm ${timerCritical ? 'text-red-600 text-base' : ''} ${timerWarning ? 'animate-pulse' : ''}`}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
          {timerCritical && <span className="text-[9px] font-bold text-red-600 uppercase">Últimos segundos</span>}
        </div>
      </div>

      {/* Progress */}
      <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full bg-amber-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full uppercase tracking-wider">{q.type === 'math' ? 'Matemático' : q.type === 'logic' ? 'Lógico' : q.type === 'verbal' ? 'Verbal' : 'Espacial'}</span>
              <span className="text-[10px] text-slate-400 font-mono">Pregunta {index + 1}/{wonderlicQuestions.length}</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const selected = answers[q.id] === oi;
                return (
                  <button key={oi} onClick={() => handleAnswer(oi)}
                    className={`w-full text-left p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      selected ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-3">
        {index > 0 && (
          <button onClick={handlePrev} className="px-4 py-3 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        <button onClick={handleNext} disabled={answers[q.id] === undefined} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
          answers[q.id] !== undefined ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
        }`}>
          {index < wonderlicQuestions.length - 1 ? 'Siguiente' : 'Finalizar'}
        </button>
      </div>
    </div>
  );
}
