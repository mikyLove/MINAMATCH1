import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { mockStudents } from '../data';
import { v2FetchStudents, v2ToggleSyllabus } from '../lib/api';
import type { V2Student } from '../lib/api';
import { useToast } from './Toast';
import { ShieldCheck, Award, FileText, CheckCircle, Database, ChevronRight, CircleAlert, Download, Check, Search, GraduationCap, TrendingUp, Users, BookOpen, X, Info, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FALLBACK_AVATAR = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23e2e8f0%22 width=%22100%22 height=%22100%22/%3E%3Ccircle cx=%2250%22 cy=%2238%22 r=%2216%22 fill=%22%2394a3b8%22/%3E%3Crect x=%2220%22 y=%2265%22 width=%2260%22 height=%2228%22 rx=%2214%22 fill=%22%2394a3b8%22/%3E%3C/svg%3E';

function imgOnError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.src = FALLBACK_AVATAR;
}

const TOOLTIPS: Record<string, string> = {
  'Verification Hash': 'Código único generado por SHA-256 que acredita la autenticidad del registro en la blockchain de Puno.',
  'Registrado en Blockchain': 'El contrato académico del becario ha sido registrado en una red blockchain permissioned con nodos en Puno.',
  'Validación': 'Registro de la última validación del nodo blockchain que certifica el avance del semillero.',
};

function Tooltip({ label, term, children }: { label: string; term: string; children?: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  return (
    <span ref={triggerRef} className="relative inline-flex items-center gap-1">
      {children || <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block tracking-wider uppercase mb-0.5">{label}</span>}
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        onClick={(e) => { e.stopPropagation(); setShow(!show); }}
        className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 hover:text-white transition-colors cursor-pointer shrink-0"
        aria-label={`Info sobre ${label}`}
        type="button"
      >
        <Info className="w-2 h-2" />
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2.5 bg-slate-900 text-white text-[9px] leading-relaxed rounded-lg shadow-xl border border-slate-700 z-50"
          >
            <div className="relative">
              {TOOLTIPS[term] || term}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 -mt-1 border-r border-b border-slate-700" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

function Confetti({ active }: { active: boolean }) {
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 300 - 150,
      y: Math.random() * -400 - 50,
      r: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.8,
      color: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#ec4899'][Math.floor(Math.random() * 6)],
      shape: Math.random() > 0.5 ? 'circle' : 'square',
    })), []);
  return (
    <AnimatePresence>
      {active && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50" aria-hidden="true">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute top-1/2 left-1/2"
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 0 }}
              animate={{ x: p.x, y: p.y, rotate: p.r, opacity: 0, scale: p.scale }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: Math.random() * 0.2 }}
            >
              <div
                className={`${p.shape === 'circle' ? 'rounded-full' : 'rounded-sm'} w-2 h-2`}
                style={{ backgroundColor: p.color }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } },
};

function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse ${className || ''}`} />;
}

function SkeletonCard() {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3.5 rounded-xl flex items-center gap-3.5">
      <Skeleton className="w-11 h-11 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-4 w-8 rounded" />
        </div>
        <Skeleton className="h-3 w-44" />
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>
      <Skeleton className="w-4 h-4 rounded-full" />
    </div>
  );
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

export default function SemillerosList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'FINALIZADO' | 'EN_CURSO'>('ALL');
  const [selectedStudent, setSelectedStudent] = useState<V2Student | null>(null);
  const [studentsState, setStudentsState] = useState<V2Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [filterProgram, setFilterProgram] = useState<string | null>(null);
  const [filterBadge, setFilterBadge] = useState<string | null>(null);
  const [compactView, setCompactView] = useState(false);
  const [sortKey, setSortKey] = useState<'name' | 'progress' | 'score' | 'program'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();
  const fetchRef = useRef(false);

  const uniquePrograms = useMemo(() => [...new Set(studentsState.map(s => s.program))].sort(), [studentsState]);
  const uniqueBadges = useMemo(() => [...new Set(studentsState.map(s => s.badge))].sort(), [studentsState]);

  const activeStudent = selectedStudent || studentsState[0] || null;

  useEffect(() => {
    if (fetchRef.current) return;
    fetchRef.current = true;
    v2FetchStudents()
      .then(data => {
        setStudentsState(data as V2Student[]);
        setConnected(true);
        setLoading(false);
        toast(`${data.length} estudiantes sincronizados`, 'success');
      })
      .catch(() => {
        setStudentsState(mockStudents as unknown as V2Student[]);
        setConnected(false);
        setLoading(false);
        toast('Usando datos locales — servidor no disponible', 'error');
      });
  }, []);

  const handleToggleCourse = useCallback(async (courseId: string) => {
    const prev = studentsState.find(s => s.id === activeStudent.id);
    if (!prev) return;

    const toggled = prev.syllabus.find(c => c.id === courseId);
    if (!toggled) return;
    const newCompleted = !toggled.completed;

    // Optimistic update
    setStudentsState(prevState =>
      prevState.map(st => {
        if (st.id === activeStudent.id) {
          const updatedSyllabus = st.syllabus.map(course => {
            if (course.id === courseId) return { ...course, completed: newCompleted };
            return course;
          });
          const completedCount = updatedSyllabus.filter(c => c.completed).length;
          const total = updatedSyllabus.length;
          const score = Number(((completedCount / total) * 100).toFixed(1));
          return {
            ...st,
            syllabus: updatedSyllabus,
            matchingScore: score,
            status: completedCount === total ? 'FINALIZADO' : 'EN_CURSO'
          };
        }
        return st;
      })
    );

    const prevCompletedCount = prev.syllabus.filter(c => c.completed).length;
    const newCompletedCount = prevCompletedCount + (toggled.completed ? -1 : 1);
    const becameComplete = newCompletedCount === prev.syllabus.length && !toggled.completed;

    if (becameComplete) {
      setTimeout(() => setShowConfetti(true), 150);
      setTimeout(() => setShowConfetti(false), 2000);
      setTimeout(() => toast(`${activeStudent.name} completó el programa 🎉`, 'success'), 400);
    }

    // Sync with server
    if (connected) {
      setSyncing(true);
      try {
        await v2ToggleSyllabus(activeStudent.id, courseId, newCompleted);
        toast('Progreso guardado en el servidor', 'success');
      } catch {
        setConnected(false);
        toast('Error al guardar — cambios locales', 'error');
      }
      setSyncing(false);
    }
  }, [activeStudent?.id, connected, studentsState]);

  React.useEffect(() => {
    if (!selectedStudent) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedStudent(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedStudent]);

  const filteredStudents = useMemo(() => {
    const filtered = studentsState.filter(st => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query ||
        st.name.toLowerCase().includes(query) ||
        st.program.toLowerCase().includes(query) ||
        st.badge.toLowerCase().includes(query);
      const matchesStatus = filterStatus === 'ALL' || st.status === filterStatus;
      const matchesProgram = !filterProgram || st.program === filterProgram;
      const matchesBadge = !filterBadge || st.badge === filterBadge;
      return matchesSearch && matchesStatus && matchesProgram && matchesBadge;
    });
    const sorted = [...filtered].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      switch (sortKey) {
        case 'name':
          return a.name.localeCompare(b.name) * dir;
        case 'progress': {
          const aPct = a.syllabus.filter(c => c.completed).length / a.syllabus.length;
          const bPct = b.syllabus.filter(c => c.completed).length / b.syllabus.length;
          return (aPct - bPct) * dir;
        }
        case 'score':
          return (a.matchingScore - b.matchingScore) * dir;
        case 'program':
          return a.program.localeCompare(b.program) * dir;
        default:
          return 0;
      }
    });
    return sorted;
  }, [searchQuery, filterStatus, filterProgram, filterBadge, studentsState, sortKey, sortDir]);

  const stats = useMemo(() => {
    const total = studentsState.length;
    const finalized = studentsState.filter(s => s.status === 'FINALIZADO').length;
    const completionRate = total ? Math.round((finalized / total) * 100) : 0;
    const avgScore = total ? Math.round(studentsState.reduce((s, st) => s + st.matchingScore, 0) / total) : 0;
    const totalContracts = finalized;
    return { total, finalized, completionRate, avgScore, totalContracts };
  }, [studentsState]);

  const distByStatus = useMemo(() => {
    const finalized = studentsState.filter(s => s.status === 'FINALIZADO').length;
    const enCurso = studentsState.filter(s => s.status === 'EN_CURSO').length;
    return { finalized, enCurso, total: studentsState.length };
  }, [studentsState]);

  const distByBadge = useMemo(() => {
    const map = new Map<string, number>();
    studentsState.forEach(s => map.set(s.badge, (map.get(s.badge) || 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [studentsState]);

  const handleDownloadContract = () => {
    if (activeStudent) {
      generateContractPDF(activeStudent);
      toast('PDF del contrato descargado', 'success');
    }
  };

  const generateContractPDF = useCallback((student: V2Student) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentW = pageW - margin * 2;
    let y = margin;

    const pct = Math.round((student.syllabus.filter(c => c.completed).length / student.syllabus.length) * 100);

    // --- Header bar ---
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageW, 28, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(245, 158, 11);
    doc.text('CONTRATO DE INICIACIÓN MINERA', pageW / 2, 17, { align: 'center' });
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('SEMILLEROS PUNO — MINAMATCH', pageW / 2, 24, { align: 'center' });

    y = 40;

    // --- Title ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42);
    doc.text('Contrato Digital de Semillero', pageW / 2, y, { align: 'center' });
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('Programa de formación y retención de talento minero — Puno, Perú', pageW / 2, y, { align: 'center' });
    y += 12;

    // --- Separator ---
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageW - margin, y);
    y += 8;

    // --- Datos del Firmante ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('DATOS DEL FIRMANTE', margin, y);
    y += 8;

    const fields = [
      { label: 'Nombre Completo:', value: student.name },
      { label: 'Nombramiento:', value: student.badge },
      { label: 'Programa:', value: student.program },
      { label: 'Estado:', value: student.status === 'FINALIZADO' ? 'Finalizado' : 'En Curso' },
      { label: 'Progreso Académico:', value: `${pct}% (${student.syllabus.filter(c => c.completed).length}/${student.syllabus.length} cursos)` },
      { label: 'Match Score:', value: `${student.matchingScore}%` },
    ];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    fields.forEach(f => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text(f.label, margin, y);
      const labelW = doc.getTextWidth(f.label);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(f.value, margin + labelW + 3, y);
      y += 6.5;
    });
    y += 4;

    // --- Separator ---
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageW - margin, y);
    y += 8;

    // --- Cláusulas del Contrato ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('CLÁUSULAS DEL CONTRATO', margin, y);
    y += 8;

    const clauses = [
      `PRIMERA: El firmante ${student.name} se compromete a completar el programa "${student.program}" bajo la modalidad de semillero minero, cumpliendo con la totalidad de cursos establecidos en el syllabus académico.`,
      `SEGUNDA: Como contraprestación, el becario recibirá una retribución única de firma ascendente a S/ ${student.signingBonus.toLocaleString('es-PE', { minimumFractionDigits: 2 })} por concepto de incentivo de incorporación al programa.`,
      `TERCERA: El becario se obliga a una retención laboral mínima de ${student.retentionMonths} (${student.retentionMonths}) meses contados desde la fecha de emisión del presente contrato, bajo los términos del reglamento interno de Semilleros Puno.`,
      `CUARTA: El presente contrato es registrado en una red blockchain permissioned con nodos validadores en la región de Puno, garantizando la inmutabilidad y trazabilidad de la acreditación académica y contractual del becario.`,
    ];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    clauses.forEach(clause => {
      const lines = doc.splitTextToSize(clause, contentW - 4);
      doc.setTextColor(51, 65, 85);
      doc.text(lines, margin + 2, y);
      y += lines.length * 5 + 4;
    });

    // Check if we need a new page
    if (y > pageH - 60) {
      doc.addPage();
      y = margin + 4;
    }

    y = Math.max(y, 44);

    // --- Separator ---
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageW - margin, y);
    y += 8;

    // --- Verificación Blockchain ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('VERIFICACIÓN BLOCKCHAIN', margin, y);
    y += 8;

    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y - 4, contentW, 32, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('HASH DE VERIFICACIÓN (SHA-256):', margin + 3, y + 2);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(217, 119, 6);
    doc.text(student.verificationHash, margin + 3, y + 9);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('VALIDADOR:', margin + 3, y + 18);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(student.validatorNode, margin + 3, y + 25);
    y += 36;

    // --- Fechas ---
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Fecha de emisión: ${new Date(student.timestamp).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, y);
    y += 5;
    doc.text(`Documento generado el: ${new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, margin, y);
    y += 12;

    // --- Firma ---
    doc.setDrawColor(148, 163, 184);
    doc.line(margin, y, margin + 60, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Firma del Becario', margin, y + 4);

    doc.line(pageW - margin - 60, y, pageW - margin, y);
    doc.text('Firma MinaMatch', pageW - margin - 38, y + 4, { align: 'center' });
    y += 14;

    // --- Footer ---
    doc.setFillColor(15, 23, 42);
    doc.rect(0, pageH - 15, pageW, 15, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(148, 163, 184);
    doc.text('MinaMatch Puno — Plataforma de Selección Minera Inteligente — Documento válido con verificación blockchain', pageW / 2, pageH - 6, { align: 'center' });
    doc.text(`ID: ${student.verificationHash.slice(0, 16)}...`, pageW / 2, pageH - 2, { align: 'center' });

    // --- Save ---
    const fileName = `contrato-${student.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
  }, []);

  const handleExportCSV = useCallback(() => {
    const rows = filteredStudents.map(st => {
      const pct = Math.round((st.syllabus.filter(c => c.completed).length / st.syllabus.length) * 100);
      return { name: st.name, badge: st.badge, program: st.program, progress: `${pct}%`, match: `${st.matchingScore}%` };
    });
    if (rows.length === 0) { toast('No hay datos para exportar', 'error'); return; }
    const header = 'Nombre,Beca,Programa,Progreso,Match Score\n';
    const csv = header + rows.map(r =>
      `"${r.name}","${r.badge}","${r.program}",${r.progress},${r.match}`
    ).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `semilleros-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast(`${rows.length} registros exportados`, 'success');
  }, [filteredStudents, toast]);

  const completedCount = activeStudent?.syllabus.filter(c => c.completed).length ?? 0;
  const totalCourses = activeStudent?.syllabus.length ?? 0;
  const isFullyEligible = completedCount === totalCourses && totalCourses > 0;

  return (
    <div className="max-w-md mx-auto space-y-4 font-sans relative">
      {/* Dashboard Stats */}
      {loading ? (
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl flex flex-col items-center justify-center gap-1.5">
              <Skeleton className="w-3.5 h-3.5 rounded-full" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-2 w-12" />
            </div>
          ))}
        </div>
      ) : (
        <motion.section
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-4 gap-2"
        >
          {[
            { label: 'Total', value: stats.total, icon: Users, color: 'bg-slate-900 dark:bg-slate-950 text-white dark:text-slate-200', suffix: '' },
            { label: 'Finalizados', value: stats.finalized, icon: CheckCircle, color: 'bg-emerald-600 text-white', suffix: '' },
            { label: 'Progreso', value: stats.completionRate, icon: TrendingUp, color: 'bg-amber-600 text-white', suffix: '%' },
            { label: 'Match Prom.', value: stats.avgScore, icon: Award, color: 'bg-blue-600 text-white', suffix: '%' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 12, scale: 0.9 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 18 } },
                }}
                whileHover={{ y: -2, transition: { type: 'spring', stiffness: 300 } }}
                className={`${item.color} p-2.5 rounded-xl shadow-xs flex flex-col items-center justify-center gap-0.5`}
              >
                <Icon className="w-3.5 h-3.5 opacity-80 shrink-0" />
                <span className="text-xs font-black font-mono leading-none">
                  <CountUp value={item.value} suffix={item.suffix} />
                </span>
                <span className="text-[7px] font-bold uppercase tracking-wider opacity-70 leading-tight text-center">{item.label}</span>
              </motion.div>
            );
          })}
        </motion.section>
      )}

      {/* Connection status */}
      {connected !== null && (
        <div className={`flex items-center justify-end gap-1.5 px-1 ${connected ? 'text-emerald-600' : 'text-amber-600'}`}>
          {connected ? (
            <><Wifi className="w-3 h-3" /><span className="text-[8px] font-bold tracking-wider uppercase">API Conectada</span></>
          ) : (
            <><WifiOff className="w-3 h-3" /><span className="text-[8px] font-bold tracking-wider uppercase">Datos locales (sin API)</span></>
          )}
        </div>
      )}

      {/* Search and filters */}
      <section className="space-y-2.5">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 text-slate-400 dark:text-slate-500 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-slate-800 dark:focus:border-slate-600 rounded-xl text-sm outline-none transition-colors shadow-sm font-sans placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="Buscar estudiante..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar select-none">
          {(['ALL', 'FINALIZADO', 'EN_CURSO'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 border rounded-lg whitespace-nowrap text-[10px] font-extrabold tracking-wider transition-all cursor-pointer ${
                filterStatus === status
                  ? status === 'ALL'
                    ? 'bg-slate-900 dark:bg-slate-950 text-white border-slate-900 dark:border-slate-700'
                    : status === 'FINALIZADO'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {status === 'ALL' ? 'TODOS' : status === 'FINALIZADO' ? 'FINALIZADOS' : 'EN CURSO'}
            </button>
          ))}
        </div>
        {/* Program filter chips */}
        {uniquePrograms.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar select-none">
            <button
              onClick={() => setFilterProgram(null)}
              className={`px-2 py-1 rounded-lg text-[8px] font-bold tracking-wider border transition-all cursor-pointer shrink-0 ${
                !filterProgram ? 'bg-slate-900 dark:bg-slate-950 text-white border-slate-900 dark:border-slate-700' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              TODOS
            </button>
            {uniquePrograms.map(p => (
              <button
                key={p}
                onClick={() => setFilterProgram(p === filterProgram ? null : p)}
                className={`px-2 py-1 rounded-lg text-[8px] font-bold tracking-wider border transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                  filterProgram === p
                    ? 'bg-slate-900 dark:bg-slate-950 text-white border-slate-900 dark:border-slate-700'
                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
        {/* Badge filter chips */}
        {uniqueBadges.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar select-none">
            <button
              onClick={() => setFilterBadge(null)}
              className={`px-2 py-1 rounded-lg text-[8px] font-bold tracking-wider border transition-all cursor-pointer shrink-0 ${
                !filterBadge ? 'bg-slate-900 dark:bg-slate-950 text-white border-slate-900 dark:border-slate-700' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              TODAS
            </button>
            {uniqueBadges.map(b => (
              <button
                key={b}
                onClick={() => setFilterBadge(b === filterBadge ? null : b)}
                className={`px-2 py-1 rounded-lg text-[8px] font-bold tracking-wider border transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                  filterBadge === b
                    ? 'bg-slate-900 dark:bg-slate-950 text-white border-slate-900 dark:border-slate-700'
                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Sort + compact toggle */}
      <section className="flex items-center gap-1.5 overflow-x-auto no-scrollbar select-none pb-1">
        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-0.5 shrink-0">Ordenar</span>
        {([
          { key: 'name', label: 'Nombre' },
          { key: 'progress', label: 'Progreso' },
          { key: 'score', label: 'Match' },
          { key: 'program', label: 'Programa' },
        ] as const).map(opt => (
          <button
            key={opt.key}
            onClick={() => {
              if (sortKey === opt.key) {
                setSortDir(d => d === 'asc' ? 'desc' : 'asc');
              } else {
                setSortKey(opt.key);
                setSortDir('asc');
              }
            }}
            className={`px-2 py-1 rounded-lg text-[9px] font-bold tracking-wider border transition-all cursor-pointer flex items-center gap-1 ${
              sortKey === opt.key
                ? 'bg-slate-900 dark:bg-slate-950 text-white border-slate-900 dark:border-slate-700'
                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            {opt.label}
            {sortKey === opt.key && (
              <span className="text-[8px]">{sortDir === 'asc' ? '▲' : '▼'}</span>
            )}
          </button>
        ))}
        <button
          onClick={handleExportCSV}
          disabled={loading || filteredStudents.length === 0}
          className="px-2 py-1 rounded-lg text-[9px] font-bold tracking-wider border transition-all cursor-pointer flex items-center gap-1 shrink-0 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Exportar CSV"
        >
          <Download className="w-3 h-3" />
        </button>
        <button
          onClick={() => setCompactView(v => !v)}
          className={`px-2 py-1 rounded-lg text-[9px] font-bold tracking-wider border transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
            compactView
              ? 'bg-slate-900 dark:bg-slate-950 text-white border-slate-900 dark:border-slate-700'
              : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
          title={compactView ? 'Vista detallada' : 'Vista compacta'}
        >
          {compactView ? '📋' : '📄'}
        </button>
      </section>

      {/* Distribution chart */}
      {studentsState.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Distribución</span>
            <div className="flex gap-3 text-[8px] font-bold">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Finalizados</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> En curso</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Donut */}
            <svg width="64" height="64" viewBox="0 0 36 36" className="shrink-0">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              {distByStatus.total > 0 && (
                <>
                  <circle
                    cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3"
                    strokeDasharray={`${(distByStatus.finalized / distByStatus.total) * 100} ${100 - (distByStatus.finalized / distByStatus.total) * 100}`}
                    strokeDashoffset="0"
                    transform="rotate(-90 18 18)"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none" stroke="#f59e0b" strokeWidth="3"
                    strokeDasharray={`${(distByStatus.enCurso / distByStatus.total) * 100} ${100 - (distByStatus.enCurso / distByStatus.total) * 100}`}
                    strokeDashoffset={-((distByStatus.finalized / distByStatus.total) * 100)}
                    transform="rotate(-90 18 18)"
                    strokeLinecap="round"
                  />
                </>
              )}
              <text x="18" y="20" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#0f172a">
                {distByStatus.total}
              </text>
              <text x="18" y="25" textAnchor="middle" fontSize="2.5" fontWeight="bold" fill="#94a3b8">
                total
              </text>
            </svg>
            {/* Badge bars */}
            <div className="flex-1 space-y-1">
              {distByBadge.map(([badge, count]) => (
                <div key={badge} className="flex items-center gap-1.5">
                  <span className="text-[7px] font-bold text-slate-500 dark:text-slate-400 w-16 truncate shrink-0">{badge.replace('Beca ', '')}</span>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / studentsState.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full ${badge.includes('Minsur') ? 'bg-blue-500' : badge.includes('Anglo') ? 'bg-purple-500' : 'bg-amber-500'}`}
                    />
                  </div>
                  <span className="text-[8px] font-mono font-bold text-slate-400 dark:text-slate-500 w-4 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Student list */}
      {loading ? (
        <div className={`pb-6 ${compactView ? 'grid grid-cols-2 gap-2' : 'space-y-2.5'}`}>
          {[...Array(compactView ? 6 : 5)].map((_, i) => (
            compactView ? (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex flex-col items-center text-center gap-2">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-1.5 w-full rounded-full" />
                <Skeleton className="h-3 w-8 rounded" />
              </div>
            ) : (
              <SkeletonCard key={i} />
            )
          ))}
        </div>
      ) : (
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`pb-6 ${compactView ? 'grid grid-cols-2 gap-2' : 'space-y-2.5'}`}
      >
        {filteredStudents.map(st => {
          const stCompleted = st.syllabus.filter(c => c.completed).length;
          const stTotal = st.syllabus.length;
          const stPct = Math.round((stCompleted / stTotal) * 100);
          const isSelected = selectedStudent?.id === st.id;

          return compactView ? (
            <motion.button
              key={st.id}
              variants={itemVariants}
              layout
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedStudent(st)}
              className={`w-full text-left bg-white dark:bg-slate-900 border rounded-xl shadow-xs overflow-hidden outline-none transition-shadow ${
                isSelected ? 'border-amber-600 ring-1 ring-amber-600' : 'border-slate-200 dark:border-slate-700 hover:shadow-md'
              }`}
            >
              <div className="p-2.5 flex flex-col items-center text-center gap-1.5">
                <motion.div
                  className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-800"
                  whileHover={{ scale: 1.1 }}
                >
                  <img alt={st.name} className="w-full h-full object-cover select-none" referrerPolicy="no-referrer" src={st.avatarUrl} onError={imgOnError} />
                </motion.div>
                <div className="min-w-0 w-full">
                  <h4 className="text-[10px] font-extrabold text-slate-900 dark:text-white truncate leading-tight">{st.name}</h4>
                  <p className="text-[7px] text-slate-400 dark:text-slate-500 font-semibold truncate mt-0.5">{st.badge.replace('Beca ', '')}</p>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${stPct === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${stPct}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
                <motion.span
                  key={st.status + stPct}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`px-1.5 py-0.5 rounded text-[7px] font-black tracking-wider ${
                    st.status === 'FINALIZADO' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                  }`}
                >
                  {st.status === 'FINALIZADO' ? 'OK' : stPct + '%'}
                </motion.span>
              </div>
            </motion.button>
          ) : (
            <motion.button
              key={st.id}
              variants={itemVariants}
              layout
              whileHover={{ scale: 1.01, borderColor: '#cbd5e1' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedStudent(st)}
              className={`w-full text-left bg-white dark:bg-slate-900 border p-3.5 rounded-xl shadow-xs flex items-center gap-3.5 outline-none transition-shadow ${
                isSelected ? 'border-amber-600 ring-1 ring-amber-600 shadow-amber-600/10' : 'border-slate-200 dark:border-slate-700 hover:shadow-md'
              }`}
            >
              <motion.div
                className="w-11 h-11 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 shadow-xs"
                whileHover={{ scale: 1.1 }}
              >
                <img
                  alt={st.name}
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                  src={st.avatarUrl}
                  onError={imgOnError}
                />
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{st.name}</h4>
                  <motion.span
                    key={st.status + stPct}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`shrink-0 px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider ${
                      st.status === 'FINALIZADO' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {st.status === 'FINALIZADO' ? 'OK' : stPct + '%'}
                  </motion.span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 truncate">{st.badge} • {st.program}</p>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden select-none">
                  <motion.div
                    className={`h-full rounded-full ${
                      stPct === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${stPct}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                  />
                </div>
              </div>
              <motion.div
                animate={{ x: isSelected ? 3 : 0, color: isSelected ? '#d97706' : '#cbd5e1' }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <ChevronRight className="w-4 h-4 shrink-0" />
              </motion.div>
            </motion.button>
          );
        })}

        {filteredStudents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 px-4"
          >
            <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">No se encontraron estudiantes</p>
            <button
              onClick={() => { setSearchQuery(''); setFilterStatus('ALL'); setFilterProgram(null); setFilterBadge(null); }}
              className="text-xs text-amber-600 font-bold mt-2 underline hover:text-amber-700 transition-colors"
            >
              Limpiar filtros
            </button>
          </motion.div>
        )}
      </motion.section>
      )}

      {/* Student Detail Drawer */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 overflow-hidden font-sans flex justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Perfil del estudiante"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute bottom-0 w-full max-w-md bg-white dark:bg-slate-900 rounded-t-2xl shadow-2xl overflow-hidden border-t border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] z-10"
            >
              <div className="relative">
                <Confetti active={showConfetti} />
              </div>
              <div className="p-4 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-500" />
                  <span className="text-[11px] font-black tracking-widest font-mono text-amber-500">SEMILLEROS</span>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-white hover:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Status Banner */}
                <motion.div
                  layout
                  className={`p-3 border-l-4 flex items-center justify-between rounded-r-xl shadow-xs ${
                    isFullyEligible
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-600'
                      : 'bg-amber-50 dark:bg-amber-950/50 border-amber-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      key={isFullyEligible ? 'shield' : 'alert'}
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {isFullyEligible ? (
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <CircleAlert className="w-5 h-5 text-amber-600 shrink-0" />
                      )}
                    </motion.div>
                    <motion.span
                      key={isFullyEligible ? 'listo' : 'pendiente'}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-bold text-[11px] tracking-wider uppercase"
                    >
                      {isFullyEligible ? 'Listo para Contratación' : 'Acreditación Pendiente'}
                    </motion.span>
                  </div>
                  <motion.span
                    key={isFullyEligible ? '100' : 'pct'}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-xs font-mono font-bold"
                  >
                    {isFullyEligible ? '100% OK' : `${Math.round((completedCount / totalCourses) * 100)}%`}
                  </motion.span>
                </motion.div>

                {/* Profile Card */}
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-xs"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 shadow-xs"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        alt={activeStudent.name}
                        className="w-full h-full object-cover select-none"
                        referrerPolicy="no-referrer"
                        src={activeStudent.avatarUrl}
                        onError={imgOnError}
                      />
                    </motion.div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{activeStudent.name}</h2>
                      <div className="flex items-center gap-1 mt-0.5 text-slate-500 dark:text-slate-400 select-none">
                        <motion.span
                          animate={{ rotate: [0, 10, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                          className="text-amber-600"
                        >
                          ★
                        </motion.span>
                        <span className="text-xs font-bold">{activeStudent.badge}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block tracking-wider uppercase mb-0.5">PROGRAMA</span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{activeStudent.program}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block tracking-wider uppercase mb-0.5">MATCH</span>
                      <motion.span
                        key={activeStudent.matchingScore}
                        initial={{ scale: 1.3, color: '#d97706' }}
                        animate={{ scale: 1, color: '#d97706' }}
                        className="text-[11px] font-mono font-extrabold text-amber-600"
                      >
                        {activeStudent.matchingScore}%
                      </motion.span>
                    </div>
                  </div>
                </motion.section>

                {/* Syllabus */}
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="space-y-3"
                >
                  <div className="flex justify-between items-end px-1 select-none">
                    <h2 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      Syllabus de Especialización
                    </h2>
                    <div className="flex items-center gap-2">
                      {syncing && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-2.5 h-2.5 rounded-full border-2 border-amber-500 border-t-transparent"
                        />
                      )}
                      <motion.span
                        key={completedCount}
                        initial={{ scale: 1.3 }}
                        animate={{ scale: 1 }}
                        className="text-[10px] font-bold text-slate-500 dark:text-slate-400"
                      >
                        {completedCount}/{totalCourses}
                      </motion.span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {activeStudent.syllabus.map((item, i) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.04 }}
                        whileHover={{ scale: 1.01, borderColor: '#cbd5e1' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleToggleCourse(item.id)}
                        className="w-full text-left bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 p-3 rounded-xl flex items-center gap-3 shadow-sm transition-shadow hover:shadow-md group outline-none"
                      >
                        <motion.div
                          animate={item.completed ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.3 }}
                          className={`w-5 h-5 border-2 flex items-center justify-center rounded-md shrink-0 transition-colors ${
                            item.completed
                              ? 'border-emerald-600 bg-emerald-600'
                              : 'border-slate-300 dark:border-slate-600 group-hover:border-amber-600'
                          }`}
                        >
                          {item.completed && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 400 }}
                            >
                              <Check className="w-3 h-3 text-white stroke-[3px]" />
                            </motion.div>
                          )}
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-900 dark:group-hover:text-amber-300 transition-colors truncate">{item.course}</p>
                          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1 mt-1.5 rounded-full overflow-hidden select-none">
                            <motion.div
                              className={`h-full ${item.completed ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-600'}`}
                              initial={{ width: item.completed ? '0%' : '0%' }}
                              animate={{ width: item.completed ? '100%' : '0%' }}
                              transition={{ duration: 0.4, ease: 'easeOut' }}
                            />
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.section>

                {/* Smart Contract */}
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="space-y-2.5"
                >
                  <h2 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Estado de Smart Contract
                  </h2>
                  <div className="bg-slate-900 dark:bg-slate-950 text-white dark:text-slate-200 p-4 rounded-2xl space-y-3.5 shadow-sm border border-slate-800 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <Tooltip label="Registrado en Blockchain" term="Registrado en Blockchain">
                        <div className="flex items-center gap-1.5 cursor-help">
                          <motion.span
                            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-amber-500 select-none"
                          />
                          <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 font-bold tracking-widest leading-none uppercase">REGISTRADO EN BLOCKCHAIN</span>
                        </div>
                      </Tooltip>
                      <motion.span
                        animate={isFullyEligible ? { opacity: [1, 0.6, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wide ${
                          isFullyEligible ? 'bg-amber-600 text-white' : 'bg-slate-800 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {isFullyEligible ? 'ACTIVE' : 'PENDING'}
                      </motion.span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Tooltip label="Verification Hash" term="Verification Hash">
                          <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-wider mb-1 uppercase">Verification Hash</p>
                        </Tooltip>
                        <div className="font-mono text-[10px] break-all bg-slate-950 dark:bg-black p-2.5 rounded-lg border border-white/5 text-amber-300 select-all">
                          {activeStudent.verificationHash}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3">
                        <div>
                          <p className="text-[8px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">Retención</p>
                          <p className="text-xs font-bold text-slate-200 dark:text-slate-300">{activeStudent.retentionMonths} Meses</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">Bono Firma</p>
                          <p className="text-xs font-bold text-amber-500">S/ {activeStudent.signingBonus.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                      <motion.button
                        onClick={handleDownloadContract}
                        disabled={!isFullyEligible}
                        whileHover={isFullyEligible ? { scale: 1.01 } : {}}
                        whileTap={isFullyEligible ? { scale: 0.97 } : {}}
                        className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 text-xs transition-all select-none ${
                          isFullyEligible
                            ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs cursor-pointer'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                        }`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="font-bold uppercase tracking-wider">Descargar Contrato Digital</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.section>

                {/* Validation Logs */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="border border-slate-200 dark:border-slate-700 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 select-none"
                >
                  <div className="flex items-center gap-1.5 mb-1.5 text-slate-400 dark:text-slate-500">
                    <Database className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                    <Tooltip label="Validación" term="Validación">
                      <span className="text-[9px] font-bold tracking-wider uppercase">Logs de Validación</span>
                    </Tooltip>
                  </div>
                  <div className="font-mono text-[9px] text-slate-400 dark:text-slate-500 leading-normal uppercase space-y-0.5">
                    <p>Timestamp: {activeStudent.timestamp}</p>
                    <p>Validator_Node: {activeStudent.validatorNode}</p>
                    <motion.p
                      key={activeStudent.matchingScore}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Score_Match: {activeStudent.matchingScore}%
                    </motion.p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


    </div>
  );
}
