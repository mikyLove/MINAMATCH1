import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { integrityQuestions } from './questions';
import { IntegrityScore } from './scoring';
import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

interface IntegridadProps {
  onComplete: (score: IntegrityScore, raw: Record<number, number>) => void;
}

export default function IntegridadTest({ onComplete }: IntegridadProps) {
  const [step, setStep] = useState<'instructions' | 'test' | 'result'>('instructions');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const q = integrityQuestions[index];
  const progress = (Object.keys(answers).length / integrityQuestions.length) * 100;

  const handleAnswer = (val: number) => {
    setAnswers(a => {
      const next = { ...a, [q.id]: val };
      if (Object.keys(next).length === integrityQuestions.length) {
        setTimeout(() => setStep('result'), 200);
      }
      return next;
    });
    if (index < integrityQuestions.length - 1) {
      setTimeout(() => setIndex(i => i + 1), 200);
    }
  };

  const handlePrev = () => { if (index > 0) setIndex(i => i - 1); };

  if (step === 'instructions') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto space-y-5 font-sans">
        <div className="text-center pt-4 space-y-2">
          <span className="inline-flex p-2.5 bg-blue-100 dark:bg-blue-950/50 rounded-xl">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Evaluación de Integridad</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            Evalúa honestidad, ética profesional y cumplimiento de normas.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Responda con total honestidad. Las respuestas son confidenciales y se usan para generar un perfil ético integral.
          </p>
        </div>
        <button onClick={() => setStep('test')} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm transition-all">
          Comenzar Evaluación
        </button>
      </motion.div>
    );
  }

  if (step === 'result') {
    const catQuestions: Record<number, string> = {
      1: 'honesty', 2: 'honesty', 3: 'ethics', 4: 'risk', 5: 'ethics', 6: 'risk', 7: 'honesty',
      8: 'compliance', 9: 'risk', 10: 'honesty', 11: 'ethics', 12: 'compliance', 13: 'risk',
      14: 'ethics', 15: 'honesty', 16: 'compliance', 17: 'ethics', 18: 'ethics', 19: 'risk', 20: 'compliance',
    };
    const positiveMap: Record<number, boolean> = {
      1: true, 2: false, 3: true, 4: false, 5: true, 6: false, 7: false,
      8: true, 9: false, 10: false, 11: false, 12: true, 13: false,
      14: false, 15: false, 16: true, 17: false, 18: true, 19: false, 20: true,
    };
    const catScores: Record<string, number[]> = { honesty: [], ethics: [], risk: [], compliance: [] };
    const alerts: string[] = [];
    Object.entries(answers).forEach(([qId, val]: [string, number]) => {
      const id = parseInt(qId);
      const cat = catQuestions[id];
      const isPositive = positiveMap[id];
      const score = isPositive ? val : (val === 0 ? 4 : val === 1 ? 2 : 0);
      if (cat) catScores[cat].push(score);
    });
    const calc = (vals: number[]) => vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / (vals.length * 4)) * 100) : 0;
    const honesty = calc(catScores.honesty);
    const ethics = calc(catScores.ethics);
    const riskPrevention = calc(catScores.risk);
    const compliance = calc(catScores.compliance);
    const overall = Math.round((honesty + ethics + riskPrevention + compliance) / 4);
    const level: IntegrityScore['level'] = overall >= 80 ? 'Alto' : overall >= 55 ? 'Moderado' : 'Bajo';
    if (riskPrevention < 50) alerts.push('Alta tolerancia a riesgos operacionales');
    if (honesty < 50) alerts.push('Posibles riesgos de integridad y honestidad');
    if (ethics < 50) alerts.push('Debilidad en principios éticos profesionales');
    if (compliance < 50) alerts.push('Baja adherencia a normas y procedimientos');

    const result: IntegrityScore = { honesty, ethics, riskPrevention, compliance, overall, level, alerts };
    const levelColors: Record<string, string> = { Alto: 'bg-emerald-600', Moderado: 'bg-amber-600', Bajo: 'bg-red-600' };
    const cats = [
      { key: 'honesty', label: 'Honestidad', val: honesty },
      { key: 'ethics', label: 'Ética', val: ethics },
      { key: 'riskPrevention', label: 'Prevención de Riesgos', val: riskPrevention },
      { key: 'compliance', label: 'Cumplimiento', val: compliance },
    ];

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto space-y-5 font-sans">
        <div className="text-center pt-2 space-y-1">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Resultados de Integridad</h2>
          <p className="text-xs text-slate-400">Perfil ético profesional</p>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-5 text-center space-y-2 border border-slate-800">
          <span className={`inline-block px-4 py-1 rounded-full text-[10px] font-black tracking-wider ${levelColors[level]}`}>{level}</span>
          <div className="text-4xl font-black font-mono">{overall}<span className="text-base text-slate-400">/100</span></div>
          <p className="text-xs text-slate-400">Score Ético Global</p>
        </div>

        {alerts.length > 0 && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-xl p-3 space-y-1.5">
            <p className="text-[9px] font-bold text-red-600 uppercase tracking-wider">Alertas</p>
            {alerts.map((a, i) => (
              <p key={i} className="text-[10px] text-red-700 dark:text-red-400 flex items-start gap-1.5">
                <span className="w-1 h-1 rounded-full bg-red-500 mt-1 shrink-0" />
                {a}
              </p>
            ))}
          </div>
        )}

        <div className="space-y-2">
          {cats.map(c => (
            <div key={c.key} className="flex items-center gap-3">
              <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 w-28">{c.label}</span>
              <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${c.val}%` }} transition={{ duration: 0.5 }}
                  className={`h-full rounded-full ${c.val >= 70 ? 'bg-emerald-500' : c.val >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 w-8 text-right">{c.val}%</span>
            </div>
          ))}
        </div>

        <button onClick={() => onComplete(result, answers)} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
          Continuar
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase">Integridad</span>
        <span className="text-xs font-mono font-bold text-slate-500">{Math.round(progress)}%</span>
      </div>
      <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                q.category === 'honesty' ? 'bg-purple-100 dark:bg-purple-950/30 text-purple-600' :
                q.category === 'ethics' ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-600' :
                q.category === 'risk' ? 'bg-red-100 dark:bg-red-950/30 text-red-600' :
                'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600'
              }`}>
                {q.category === 'honesty' ? 'Honestidad' : q.category === 'ethics' ? 'Ética' : q.category === 'risk' ? 'Riesgo' : 'Cumplimiento'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{index + 1}/{integrityQuestions.length}</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{q.text}</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 4, label: 'Sí', color: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/30' },
                { val: 2, label: 'A veces', color: 'border-amber-500 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/30' },
                { val: 0, label: 'No', color: 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/30' },
              ].map(opt => {
                const selected = answers[q.id] === opt.val;
                return (
                  <button key={opt.val} onClick={() => handleAnswer(opt.val)}
                    className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                      selected ? opt.color : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {(index > 0) && (
        <button onClick={handlePrev} className="w-full py-2.5 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
          Anterior
        </button>
      )}
    </div>
  );
}
