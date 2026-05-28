import React, { useState, useEffect, useMemo, useRef } from 'react';
import { mockStudents } from '../data';
import { Student } from '@minamatch/shared';
import { fetchStudents } from '../api';
import { useToast } from './Toast';
import { GraduationCap, Users, Award, TrendingUp, CheckCircle, BookOpen, DollarSign, Target, ChevronRight, Clock, Wifi, WifiOff, BarChart3, PieChart } from 'lucide-react';
import { motion } from 'motion/react';

interface SemillerosDashboardProps {
  onNavigate?: (tab: string) => void;
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse ${className || ''}`} />;
}

function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  React.useEffect(() => {
    let start = 0;
    const duration = 600;
    const step = Math.max(1, Math.floor(value / 15));
    const interval = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(interval);
      } else {
        setDisplay(start);
      }
    }, duration / 15);
    return () => clearInterval(interval);
  }, [value]);
  return <>{display}{suffix}</>;
}

export default function SemillerosDashboard({ onNavigate }: SemillerosDashboardProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState<boolean | null>(null);
  const { toast } = useToast();
  const fetchRef = useRef(false);

  useEffect(() => {
    if (fetchRef.current) return;
    fetchRef.current = true;
    fetchStudents()
      .then(data => {
        setStudents(data);
        setConnected(true);
        setLoading(false);
      })
      .catch(() => {
        setStudents(mockStudents);
        setConnected(false);
        setLoading(false);
        toast('Usando datos locales — servidor no disponible', 'error');
      });
  }, []);

  const metrics = useMemo(() => {
    const total = students.length;
    const finalized = students.filter(s => s.status === 'FINALIZADO').length;
    const enCurso = total - finalized;
    const completionRate = total ? Math.round((finalized / total) * 100) : 0;
    const avgScore = total ? Math.round(students.reduce((s, st) => s + st.matchingScore, 0) / total) : 0;
    const totalContracts = finalized;
    const avgBonus = total ? Math.round(students.reduce((s, st) => s + st.signingBonus, 0) / total) : 0;
    const avgRetention = total ? Math.round(students.reduce((s, st) => s + st.retentionMonths, 0) / total) : 0;
    const retentionRate = total ? Math.round((finalized / total) * 100) : 0;
    return { total, finalized, enCurso, completionRate, avgScore, totalContracts, avgBonus, avgRetention, retentionRate };
  }, [students]);

  const distByProgram = useMemo(() => {
    const map = new Map<string, number>();
    students.forEach(s => map.set(s.program, (map.get(s.program) || 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [students]);

  const distByBadge = useMemo(() => {
    const map = new Map<string, number>();
    students.forEach(s => map.set(s.badge, (map.get(s.badge) || 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [students]);

  const topPerformer = useMemo(() => {
    if (students.length === 0) return null;
    return students.reduce((best, s) => s.matchingScore > best.matchingScore ? s : best);
  }, [students]);

  return (
    <div className="max-w-md mx-auto space-y-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-lg font-black text-slate-900 dark:text-white">Panel Semilleros</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Métricas globales del programa</p>
        </div>
        <div className="bg-amber-100 dark:bg-amber-950/50 p-2 rounded-xl">
          <GraduationCap className="w-5 h-5 text-amber-600" />
        </div>
      </motion.div>

      {connected !== null && (
        <div className={`flex items-center justify-end gap-1.5 px-1 ${connected ? 'text-emerald-600' : 'text-amber-600'}`}>
          {connected ? (
            <><Wifi className="w-3 h-3" /><span className="text-[8px] font-bold tracking-wider uppercase">API Conectada</span></>
          ) : (
            <><WifiOff className="w-3 h-3" /><span className="text-[8px] font-bold tracking-wider uppercase">Datos locales (sin API)</span></>
          )}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl">
                <Skeleton className="w-4 h-4 rounded-full mb-2" />
                <Skeleton className="h-5 w-12 mb-1" />
                <Skeleton className="h-2 w-20" />
              </div>
            ))}
          </div>
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <>
          <motion.div
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-2"
          >
            {[
              { label: 'Becas Otorgadas', value: metrics.total, icon: Users, color: 'bg-slate-900 dark:bg-slate-950 text-white', suffix: '' },
              { label: 'Tasa Finalización', value: metrics.completionRate, icon: Award, color: 'bg-emerald-600 text-white', suffix: '%' },
              { label: 'Retención', value: metrics.retentionRate, icon: TrendingUp, color: 'bg-amber-600 text-white', suffix: '%' },
              { label: 'Match Promedio', value: metrics.avgScore, icon: Target, color: 'bg-blue-600 text-white', suffix: '%' },
              { label: 'Contratos Totales', value: metrics.totalContracts, icon: CheckCircle, color: 'bg-violet-600 text-white', suffix: '' },
              { label: 'Bono Promedio', value: metrics.avgBonus, icon: DollarSign, color: 'bg-emerald-600 text-white', suffix: ' S/' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: idx * 0.06, type: 'spring', stiffness: 200, damping: 18 }}
                  whileHover={{ y: -2, transition: { type: 'spring', stiffness: 300 } }}
                  className={`${item.color} p-3 rounded-xl shadow-xs flex flex-col gap-1`}
                >
                  <Icon className="w-4 h-4 opacity-80 shrink-0" />
                  <span className="text-lg font-black font-mono leading-none">
                    <CountUp value={item.value} suffix={item.suffix} />
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-wider opacity-70">{item.label}</span>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                Distribución por Programa
              </span>
              <span className="text-[8px] text-slate-400 font-mono">{metrics.total} estudiantes</span>
            </div>
            <div className="space-y-2">
              {distByProgram.map(([program, count]) => (
                <div key={program} className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{program}</span>
                    <span className="font-mono font-bold text-slate-400 dark:text-slate-500">{count}</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / metrics.total) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="h-full rounded-full bg-amber-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            {distByBadge.length > 1 && (
              <>
                <div className="border-t border-slate-100 dark:border-slate-700 pt-3" />
                <div>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                    <PieChart className="w-3 h-3" />
                    Distribución por Tipo de Beca
                  </span>
                  <div className="space-y-2">
                    {distByBadge.map(([badge, count]) => {
                      const badgeColor = badge.includes('Minsur') ? 'bg-blue-500' : badge.includes('Anglo') ? 'bg-purple-500' : 'bg-amber-500';
                      return (
                        <div key={badge} className="flex items-center gap-2">
                          <span className="text-[8px] font-bold text-slate-500 dark:text-slate-400 w-20 truncate shrink-0">{badge.replace('Beca ', '')}</span>
                          <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(count / metrics.total) * 100}%` }}
                              transition={{ duration: 0.5, delay: 0.5 }}
                              className={`h-full rounded-full ${badgeColor}`}
                            />
                          </div>
                          <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 w-4 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-2"
          >
            {[
              { label: 'En Curso', value: metrics.enCurso, icon: BookOpen, color: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800' },
              { label: 'Finalizados', value: metrics.finalized, icon: CheckCircle, color: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' },
              { label: 'Retención Prom.', value: metrics.avgRetention, icon: Clock, color: 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800', suffix: ' meses' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  className={`${item.color} p-2.5 rounded-xl flex flex-col items-center text-center gap-1`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-70" />
                  <span className="text-sm font-black font-mono">
                    <CountUp value={item.value} suffix={item.suffix || ''} />
                  </span>
                  <span className="text-[7px] font-bold uppercase tracking-wider opacity-70">{item.label}</span>
                </motion.div>
              );
            })}
          </motion.div>

          {topPerformer && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[8px] font-bold text-white/80 uppercase tracking-wider">Mejor Postulante</span>
                  <p className="text-sm font-black text-white mt-0.5">{topPerformer.name}</p>
                  <p className="text-[9px] text-white/70 font-medium">{topPerformer.program} • {topPerformer.badge}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-white font-mono">{topPerformer.matchingScore}%</div>
                  <span className="text-[8px] text-white/70 font-bold uppercase tracking-wider">Match</span>
                </div>
              </div>
            </motion.div>
          )}

          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate?.('semilleros-list')}
            className="w-full flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-xl shadow-xs transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-100 dark:bg-amber-950/50 rounded-lg">
                <GraduationCap className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">Ver Detalle de Estudiantes</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Accede al syllabus y progreso individual</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </motion.button>
        </>
      )}
    </div>
  );
}
