import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { DiscScores, WonderlicResult, BigFiveScores, IntegrityScore, HoganScores, FitSocialScore, GlobalScore, MiningProfileMatch, calculateGlobal, calculateProfileMatches } from './scoring';
import { Download, RefreshCw, Award, TrendingUp, ShieldCheck, Brain, Users, FileText, Globe } from 'lucide-react';
import { generatePdfReport } from './PdfReport';

interface ResultProps {
  candidateName: string;
  discRaw: Record<string, { most: number; least: number }>;
  discScores: DiscScores;
  wonderlicResult: WonderlicResult;
  wonderlicRaw: Record<number, number>;
  bigFiveScores: BigFiveScores;
  bigFiveRaw: Record<number, number>;
  integrityScore: IntegrityScore;
  integrityRaw: Record<number, number>;
  hoganScores: HoganScores;
  hoganRaw: Record<number, number>;
  fitSocialScores: FitSocialScore;
  fitSocialRaw: Record<number, number>;
  onRestart: () => void;
}

export default function ResultDashboard({
  candidateName, discScores, wonderlicResult, bigFiveScores, integrityScore, hoganScores, fitSocialScores,
  discRaw, wonderlicRaw, bigFiveRaw, integrityRaw, hoganRaw, fitSocialRaw, onRestart,
}: ResultProps) {
  const globalScore = useMemo(() => calculateGlobal(discScores, wonderlicResult, bigFiveScores, integrityScore, hoganScores, fitSocialScores), [discScores, wonderlicResult, bigFiveScores, integrityScore, hoganScores, fitSocialScores]);
  const profileMatches = useMemo(() => calculateProfileMatches(discScores, bigFiveScores, hoganScores, integrityScore, wonderlicResult.percentage), [discScores, bigFiveScores, hoganScores, integrityScore, wonderlicResult.percentage]);
  const topProfile = profileMatches[0] ?? { profileId: '', name: 'Ninguno', score: 0, compatibility: 0 };

  const recommendation = useMemo(() => {
    if (globalScore.overall >= 75 && integrityScore.overall >= 70 && (topProfile?.compatibility ?? 0) >= 70) return 'Recomendado';
    if (globalScore.overall >= 50 && integrityScore.overall >= 50) return 'Recomendado con observaciones';
    return 'No recomendado';
  }, [globalScore, integrityScore, topProfile]);

  const recommendationColors: Record<string, string> = {
    'Recomendado': 'bg-emerald-600',
    'Recomendado con observaciones': 'bg-amber-600',
    'No recomendado': 'bg-red-600',
  };

  const globalDims = [
    { label: 'Psicológico', value: globalScore.psicologico, icon: Users, color: '#8b5cf6' },
    { label: 'Cognitivo', value: globalScore.cognitivo, icon: Brain, color: '#f59e0b' },
    { label: 'Conductual', value: globalScore.conductual, icon: TrendingUp, color: '#10b981' },
    { label: 'Seguridad', value: globalScore.seguridad, icon: ShieldCheck, color: '#3b82f6' },
    { label: 'Adaptación Minera', value: globalScore.adaptacionMinera, icon: Award, color: '#ec4899' },
    { label: 'Aptitud Social', value: globalScore.social, icon: Globe, color: '#059669' },
  ];

  const handleExportPdf = () => {
    generatePdfReport({
      name: candidateName || 'Candidato Minero',
      date: new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' }),
      discScores,
      wonderlicResult,
      bigFiveScores,
      integrityScore,
      hoganScores,
      globalScore,
      profileMatches,
      topProfile,
      recommendation,
    });
  };

  const severityColor = (v: number) => v >= 70 ? 'text-emerald-600' : v >= 50 ? 'text-amber-600' : 'text-red-600';
  const severityBg = (v: number) => v >= 70 ? 'bg-emerald-500' : v >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="max-w-md mx-auto space-y-5 font-sans pb-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-2 space-y-2">
        <h1 className="text-xl font-black text-slate-900 dark:text-white">Resultados de Evaluación</h1>
        <p className="text-xs text-slate-400">Informe integral de evaluación psicométrica minera</p>
      </motion.div>

      {/* Global Score Card */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
        className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-4 relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="text-center">
          <span className={`inline-block px-4 py-1 rounded-full text-[10px] font-black tracking-wider ${recommendationColors[recommendation]}`}>
            {recommendation}
          </span>
        </div>
        <div className="text-center">
          <div className="text-6xl font-black font-mono text-amber-500">{globalScore.overall}</div>
          <p className="text-xs text-slate-400 mt-1">Score Global / 100</p>
        </div>

        {/* Radar SVG */}
        <svg viewBox="0 0 220 220" className="w-full max-w-[200px] mx-auto">
          <polygon points="110,10 210,110 110,210 10,110" fill="none" stroke="#334155" strokeWidth="1" />
          <polygon points="110,60 160,110 110,160 60,110" fill="none" stroke="#334155" strokeWidth="0.5" />
          <polygon points="110,10 210,110 110,210 10,110" fill="none" stroke="#334155" strokeWidth="1" />
          {(() => {
            const values = [globalScore.psicologico, globalScore.cognitivo, globalScore.conductual, globalScore.seguridad, globalScore.adaptacionMinera, globalScore.social];
            const dimColors = ['#8b5cf6', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#059669'];
            const points = values.map((v, i) => {
              const angle = (i * 60 - 90) * (Math.PI / 180);
              const r = (v / 100) * 90;
              return { x: 110 + r * Math.cos(angle), y: 110 + r * Math.sin(angle), color: dimColors[i] };
            });
            const polyPoints = points.map(p => `${p.x},${p.y}`).join(' ');
            return <>
              <polygon points={polyPoints} fill="rgba(245,158,11,0.15)" />
              {points.map((p, i, arr) => {
                const next = arr[(i + 1) % arr.length];
                return <line key={i} x1={p.x} y1={p.y} x2={next.x} y2={next.y} stroke="#f59e0b" strokeWidth="2" opacity="0.5" />;
              })}
              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill={p.color} stroke="#1e293b" strokeWidth="1.5" />
              ))}
            </>;
          })()}
          {['P', 'C', 'Cd', 'S', 'A', 'As'].map((label, i) => {
            const angle = (i * 60 - 90) * (Math.PI / 180);
            const x = 110 + 105 * Math.cos(angle);
            const y = 110 + 105 * Math.sin(angle);
            return <text key={i} x={x} y={y} textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="bold">{label}</text>;
          })}
        </svg>

        {/* Score bars */}
        <div className="space-y-2">
          {globalDims.map(d => (
            <div key={d.label} className="flex items-center gap-2.5">
              <d.icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[9px] text-slate-400 w-24 shrink-0">{d.label}</span>
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${d.value}%` }} transition={{ duration: 0.5 }}
                  className="h-full rounded-full" style={{ backgroundColor: d.color }} />
              </div>
              <span className={`text-[10px] font-mono font-bold ${severityColor(d.value)} w-8 text-right`}>{d.value}%</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Profile Match */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3"
      >
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Compatibilidad Minera</span>
          <span className="text-[10px] text-amber-600 font-bold">{topProfile.name} — {topProfile.compatibility}%</span>
        </div>
        <div className="space-y-2">
          {profileMatches.slice(0, 5).map((p, i) => (
            <div key={p.profileId} className="flex items-center gap-2">
              <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 w-2 shrink-0">{i + 1}</span>
              <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 w-28 truncate">{p.name}</span>
              <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${p.compatibility}%` }} transition={{ duration: 0.5, delay: i * 0.05 }}
                  className={`h-full rounded-full ${p.compatibility >= 70 ? 'bg-emerald-500' : p.compatibility >= 50 ? 'bg-amber-500' : 'bg-slate-400'}`} />
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 w-8 text-right">{p.compatibility}%</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Integrity alerts */}
      {integrityScore.alerts.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-xl p-3 space-y-1.5"
        >
          <p className="text-[9px] font-bold text-red-600 uppercase tracking-wider">Alertas de Integridad</p>
          {integrityScore.alerts.map((a, i) => (
            <p key={i} className="text-[10px] text-red-700 dark:text-red-400 flex items-start gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-0.5 shrink-0" />
              {a}
            </p>
          ))}
        </motion.div>
      )}

      {/* Risk flags */}
      {globalScore.seguridad < 50 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-3"
        >
          <p className="text-[9px] font-bold text-amber-600 uppercase tracking-wider">Riesgo Operacional</p>
          <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-1">
            El puntaje de seguridad es bajo. Se recomienda evaluación complementaria para roles críticos.
          </p>
        </motion.div>
      )}

      {/* Module summaries */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="space-y-2"
      >
        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">Resumen por Módulo</p>

        {/* DISC */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 bg-indigo-100 dark:bg-indigo-950/30 rounded-lg"><FileText className="w-3 h-3 text-indigo-600" /></div>
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">DISC</span>
          </div>
          <div className="flex gap-2">
            {([['D', '#ef4444'], ['I', '#f59e0b'], ['S', '#10b981'], ['C', '#3b82f6']] as const).map(([d, color]) => (
              <div key={d} className="flex-1 text-center">
                <div className="text-xs font-black" style={{ color }}>{discScores[d]}%</div>
                <div className="text-[8px] text-slate-400 font-bold">{d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wonderlic */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 bg-amber-100 dark:bg-amber-950/30 rounded-lg"><Brain className="w-3 h-3 text-amber-600" /></div>
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Wonderlic</span>
            <span className="ml-auto text-[9px] font-bold text-amber-600">{wonderlicResult.level}</span>
          </div>
          <p className="text-[9px] text-slate-400">{wonderlicResult.correct}/{wonderlicResult.total} aciertos · Percentil {wonderlicResult.percentile}</p>
        </div>

        {/* Big Five */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 bg-emerald-100 dark:bg-emerald-950/30 rounded-lg"><Users className="w-3 h-3 text-emerald-600" /></div>
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Big Five</span>
          </div>
          <div className="flex gap-2">
            {['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'].map(d => (
              <div key={d} className="flex-1 text-center">
                <div className={`text-[9px] font-bold ${bigFiveScores[d] >= 60 ? 'text-emerald-600' : 'text-slate-400'}`}>{bigFiveScores[d]}%</div>
                <div className="text-[6px] text-slate-400 uppercase">{d[0]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Integrity */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 bg-blue-100 dark:bg-blue-950/30 rounded-lg"><ShieldCheck className="w-3 h-3 text-blue-600" /></div>
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Integridad</span>
            <span className={`ml-auto text-[9px] font-bold ${integrityScore.level === 'Alto' ? 'text-emerald-600' : integrityScore.level === 'Moderado' ? 'text-amber-600' : 'text-red-600'}`}>
              {integrityScore.level}
            </span>
          </div>
          <p className="text-[9px] text-slate-400">Score ético: {integrityScore.overall}%</p>
        </div>

        {/* Hogan */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 bg-violet-100 dark:bg-violet-950/30 rounded-lg"><Award className="w-3 h-3 text-violet-600" /></div>
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Hogan</span>
          </div>
          <div className="flex gap-2">
            {(['leadership', 'prudence', 'resilience', 'sociability', 'learning'] as const).map(d => (
              <div key={d} className="flex-1 text-center">
                <div className="text-[9px] font-bold text-violet-600">{hoganScores[d]}%</div>
                <div className="text-[6px] text-slate-400 uppercase">{d[0]}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="space-y-2 pt-2">
        <button onClick={handleExportPdf}
          className="w-full py-3 bg-slate-900 dark:bg-slate-950 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
        >
          <Download className="w-4 h-4" />
          Descargar Informe PDF
        </button>
        <button onClick={onRestart}
          className="w-full py-3 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-2xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Nueva Evaluación
        </button>
      </div>

      <p className="text-center text-[8px] text-slate-400 dark:text-slate-600">
        MinaMatch Puno — Informe generado el {new Date().toLocaleDateString('es-PE')}
      </p>
    </div>
  );
}
