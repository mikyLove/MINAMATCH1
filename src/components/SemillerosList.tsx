import React, { useState } from 'react';
import { mockStudents } from '../data';
import { Student } from '../types';
import { ShieldCheck, Award, Clock, FileText, CheckCircle, Database, ChevronRight, User, CircleAlert, Sparkles, Download, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SemillerosList() {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('student-1');
  const [studentsState, setStudentsState] = useState<Student[]>(mockStudents);
  const [dlModalOpen, setDlModalOpen] = useState(false);

  const activeStudent = studentsState.find(s => s.id === selectedStudentId) || studentsState[0];

  // Handlers to toggle syllabus courses completion
  const handleToggleCourse = (courseId: string) => {
    setStudentsState(prevState => 
      prevState.map(st => {
        if (st.id === activeStudent.id) {
          const updatedSyllabus = st.syllabus.map(course => {
            if (course.id === courseId) {
              return { ...course, completed: !course.completed };
            }
            return course;
          });
          
          // recalculate matching score based on courses completed
          const completedCount = updatedSyllabus.filter(c => c.completed).length;
          const score = Number(((completedCount / updatedSyllabus.length) * 100).toFixed(1));

          return {
            ...st,
            syllabus: updatedSyllabus,
            matchingScore: score,
            status: completedCount === updatedSyllabus.length ? 'FINALIZADO' : 'EN_CURSO'
          };
        }
        return st;
      })
    );
  };

  const completedCount = activeStudent.syllabus.filter(c => c.completed).length;
  const totalCourses = activeStudent.syllabus.length;
  const isFullyEligible = completedCount === totalCourses;

  // Render digital contract generation simulated modal
  const handleDownloadContract = () => {
    setDlModalOpen(true);
  };

  return (
    <div className="max-w-md mx-auto space-y-5 font-sans relative">
      {/* Student selector tabs */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 select-none">
        {studentsState.map(st => (
          <button
            key={st.id}
            onClick={() => setSelectedStudentId(st.id)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              selectedStudentId === st.id 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {st.name}
          </button>
        ))}
      </div>

      {/* Floating Status Notification banner */}
      <div 
        className={`p-3.5 border-l-4 flex items-center justify-between rounded-r-xl shadow-xs transition-all ${
          isFullyEligible 
            ? 'bg-emerald-50 border-emerald-600 text-emerald-800' 
            : 'bg-amber-50 border-amber-600 text-amber-800'
        }`}
      >
        <div className="flex items-center gap-2">
          {isFullyEligible ? (
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <CircleAlert className="w-5 h-5 text-amber-600 shrink-0" />
          )}
          <span className="font-bold text-[11px] tracking-wider uppercase">
            {isFullyEligible ? 'Listo para Contratación' : 'Acreditación Pendiente'}
          </span>
        </div>
        <span className="text-xs font-mono font-bold">
          {isFullyEligible ? '100% OK' : `${Math.round((completedCount / totalCourses) * 100)}%`}
        </span>
      </div>

      {/* Student profile profile summary card */}
      <section className="relative overflow-hidden bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
        {/* Subtle decorative industrial background pattern */}
        <div className="absolute top-0 right-0 w-16 h-16 opacity-5 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #091426 1px, transparent 1px)',
          backgroundSize: '12px 12px'
        }}></div>

        <div className="flex items-center gap-4.5 mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-slate-100 shadow-xs">
            <img 
              alt={activeStudent.name} 
              className="w-full h-full object-cover select-none"
              referrerPolicy="no-referrer"
              src={activeStudent.avatarUrl} 
            />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 leading-tight">
              {activeStudent.name}
            </h1>
            <div className="flex items-center gap-1 mt-0.5 text-slate-500 select-none">
              <span className="text-amber-600">★</span>
              <span className="text-xs font-bold font-sans">{activeStudent.badge}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          <div>
            <span className="text-[9px] font-bold text-slate-400 block tracking-wider uppercase mb-0.5">
              PROGRAMA
            </span>
            <span className="text-xs font-semibold text-slate-800 leading-none">
              {activeStudent.program}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-bold text-slate-400 block tracking-wider uppercase mb-0.5">
              PROGRESO
            </span>
            <span className={`text-[11px] font-mono font-extrabold ${
              isFullyEligible ? 'text-amber-600' : 'text-slate-500 animate-pulse'
            }`}>
              {activeStudent.status}
            </span>
          </div>
        </div>
      </section>

      {/* Syllabus checklist modular section */}
      <section className="space-y-3">
        <div className="flex justify-between items-end px-1 select-none">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Syllabus de Especialización
          </h2>
          <span className="text-[10px] font-bold text-slate-500">
            {completedCount}/{totalCourses} COMPLETADO
          </span>
        </div>

        <div className="space-y-2.5">
          {activeStudent.syllabus.map((item) => (
            <button
              key={item.id}
              onClick={() => handleToggleCourse(item.id)}
              className="w-full text-left bg-white border border-slate-200 hover:border-slate-300 p-3.5 rounded-xl flex items-center gap-3.5 shadow-2xs transition-all active:scale-[0.99] group outline-none"
            >
              {/* Specialized styled checkbox */}
              <div className={`w-6 h-6 border-2 flex items-center justify-center rounded-md shrink-0 transition-colors ${
                item.completed 
                  ? 'border-amber-650 bg-amber-600' 
                  : 'border-slate-300 group-hover:border-amber-650'
              }`}>
                {item.completed && <Check className="w-4 h-4 text-white stroke-[3px]" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 group-hover:text-amber-900 transition-colors truncate">
                  {item.course}
                </p>
                <div className="w-full bg-slate-100 h-1 mt-1.5 rounded-full overflow-hidden select-none">
                  <div 
                    className="bg-amber-600 h-full transition-all duration-300" 
                    style={{ width: item.completed ? '100%' : '0%' }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Smart Contract State overview */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-divider px-1">
          Estado de Smart Contract
        </h2>
        <div className="bg-slate-900 text-white p-4.5 rounded-2xl space-y-4 shadow-sm border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 select-none"></span>
              <span className="text-[9px] font-mono text-slate-400 font-bold tracking-widest leading-none">
                REGISTRADO EN BLOCKCHAIN
              </span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wide ${
              isFullyEligible ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {isFullyEligible ? 'ACTIVE' : 'PENDING'}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-[9px] font-bold text-slate-500 tracking-wider mb-1">
                VERIFICATION HASH
              </p>
              <div className="font-mono text-[10px] break-all bg-slate-950 p-2.5 rounded-lg border border-white/5 text-amber-300">
                {activeStudent.verificationHash}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3">
              <div>
                <p className="text-[8px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                  RETENCIÓN
                </p>
                <p className="text-xs font-bold text-slate-200">
                  {activeStudent.retentionMonths} Meses
                </p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                  BONO FIRMA
                </p>
                <p className="text-xs font-bold text-amber-500">
                  S/ {activeStudent.signingBonus.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadContract}
              disabled={!isFullyEligible}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-1.5 text-xs transition-all active:scale-[0.98] cursor-pointer select-none ${
                isFullyEligible 
                  ? 'bg-amber-650 hover:bg-amber-700 text-white shadow-xs' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
              }`}
              title={isFullyEligible ? 'Descargar contrato digital' : 'Completar syllabus para habilitar contrato'}
            >
              <Download className="w-4 h-4" />
              <span className="font-bold uppercase tracking-wider">DESCARGAR CONTRATO DIGITAL</span>
            </button>
          </div>
        </div>
      </section>

      {/* Validation logs panel */}
      <div className="border border-slate-200 p-3 rounded-xl bg-slate-50 select-none">
        <div className="flex items-center gap-1.5 mb-1 text-slate-400">
          <Database className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-[9px] font-bold tracking-wider uppercase">
            LOGS DE VALIDACIÓN
          </span>
        </div>
        <div className="font-mono text-[9px] text-slate-400 leading-normal uppercase">
          Timestamp: {activeStudent.timestamp}<br />
          Validator_Node: {activeStudent.validatorNode}<br />
          Score_Match: {activeStudent.matchingScore}%
        </div>
      </div>

      {/* Contract Slip visual receipt slide dialog modal */}
      {dlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div 
            onClick={() => setDlModalOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative z-10 border border-slate-200 font-sans">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <span className="text-xs font-black tracking-widest font-mono text-amber-500">DIGITAL DEED</span>
              <button 
                onClick={() => setDlModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors text-sm font-bold px-2 py-1 rounded"
              >
                CERRAR
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="text-center space-y-1.5">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-slate-900 text-base">Contrato de Iniciación Minera</h4>
                <p className="text-[11px] text-slate-500">Semilleros Puno en blockchain</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 space-y-2 text-xs text-slate-700 leading-tight">
                <p><strong>Firmante:</strong> {activeStudent.name}</p>
                <p><strong>Nombramiento:</strong> Beca Minsur de Ingeniería</p>
                <p><strong>Cláusula de Retención:</strong> {activeStudent.retentionMonths} meses obligados</p>
                <p><strong>Retribución Firma:</strong> S/ {activeStudent.signingBonus.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                <p className="border-t border-slate-200 pt-1.5 font-mono text-[9px] text-slate-400 text-center uppercase">
                  SHA-256 ACREDITADO EN PUNO
                </p>
              </div>

              <button
                onClick={() => {
                  alert('Contrato PDF guardado en simulación local.');
                  setDlModalOpen(false);
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-bold text-xs uppercase"
              >
                AUTORIZAR DESCARGA COMERCIAL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
