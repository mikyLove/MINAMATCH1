import React, { useState, useMemo } from 'react';
import { mockCandidates } from '../data';
import { Candidate } from '../types';
import { Search, Flame, Languages, Check, ArrowRight, UserCheck, PhoneCall, Sparkles, X, Award, FileText, Users2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import FitSocialRadar from '../minatalent/FitSocialRadar';
import { FitSocialScore } from '../minatalent/scoring';

const FALLBACK_AVATAR = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23e2e8f0%22 width=%22100%22 height=%22100%22/%3E%3Ccircle cx=%2250%22 cy=%2238%22 r=%2216%22 fill=%22%2394a3b8%22/%3E%3Crect x=%2220%22 y=%2265%22 width=%2260%22 height=%2228%22 rx=%2214%22 fill=%22%2394a3b8%22/%3E%3C/svg%3E';

function imgOnError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.src = FALLBACK_AVATAR;
}

export default function BuscadorTalento() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTop5, setFilterTop5] = useState(false);
  const [filterUnaPuno, setFilterUnaPuno] = useState(false);
  const [filterLanguages, setFilterLanguages] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  React.useEffect(() => {
    if (!selectedCandidate) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedCandidate(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedCandidate]);

  // Dynamic regional radar calculations based on real mock data
  const regionalStats = useMemo(() => {
    const filtered = mockCandidates.filter(cand => {
      if (filterUnaPuno && !cand.institution.includes('UNA Puno')) return false;
      if (filterTop5 && !cand.isTop5) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!cand.name.toLowerCase().includes(q) && !cand.skills.some(s => s.toLowerCase().includes(q))) return false;
      }
      return true;
    });

    const topMatchCount = filtered.filter(c => c.matchRating >= 85).length;
    const avgMatch = filtered.length ? Math.round(filtered.reduce((s, c) => s + c.matchRating, 0) / filtered.length) : 0;
    const demandPct = Math.min(100, avgMatch + 10);

    let title = 'Radar de Talentos';
    if (filterTop5) title = 'Élite de Ingeniería';
    else if (filterUnaPuno) title = 'Egresados UNA Puno';
    else if (searchQuery) title = 'Resultados de Búsqueda';

    return {
      title,
      availableCount: filtered.length,
      demandPct,
      demandGrowth: `+${Math.round(demandPct / 5)}%`,
    };
  }, [filterTop5, filterUnaPuno, searchQuery]);

  // Reactive candidate filtration logic
  const filteredCandidates = useMemo(() => {
    return mockCandidates.filter(cand => {
      // search bar match
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        cand.name.toLowerCase().includes(query) ||
        cand.title.toLowerCase().includes(query) ||
        cand.institution.toLowerCase().includes(query) ||
        cand.skills.some(sk => sk.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // top 5% check
      if (filterTop5 && !cand.isTop5) return false;

      // UNA Puno check
      if (filterUnaPuno && !cand.institution.includes('UNA Puno')) return false;

      // Language filter (has English C1 or Quechua tag)
      if (filterLanguages) {
        const hasQuechua = cand.languages.some(lang => lang.toLowerCase().includes('quechua'));
        const hasC1 = cand.languages.some(lang => lang.toLowerCase().includes('c1'));
        if (!hasQuechua && !hasC1) return false;
      }

      return true;
    });
  }, [searchQuery, filterTop5, filterUnaPuno, filterLanguages]);

  return (
    <div className="max-w-md mx-auto space-y-4 font-sans relative">
      
      {/* Search Input and pill filters section */}
      <section className="space-y-3">
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-slate-400 dark:text-slate-500 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-slate-800 rounded-xl text-sm outline-none transition-colors shadow-sm font-sans placeholder-slate-400"
            placeholder="Buscador de Talentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Horizontal scroll pills */}
        <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-hide no-scrollbar select-none">
          <button
            onClick={() => setFilterTop5(!filterTop5)}
            className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl whitespace-nowrap text-[10px] font-extrabold tracking-wider transition-all cursor-pointer ${
              filterTop5 
                ? 'bg-amber-950 text-amber-500 border-amber-900 shadow-sm' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            {filterTop5 && <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
            <span>TOP 5% PROMOCIÓN</span>
          </button>

          <button
            onClick={() => setFilterUnaPuno(!filterUnaPuno)}
            className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl whitespace-nowrap text-[10px] font-extrabold tracking-wider transition-all cursor-pointer ${
              filterUnaPuno 
                ? 'bg-amber-950 text-amber-500 border-amber-900 shadow-sm' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            {filterUnaPuno && <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
            <span>UNA PUNO VERIFICADO</span>
          </button>

          <button
            onClick={() => setFilterLanguages(!filterLanguages)}
            className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl whitespace-nowrap text-[10px] font-extrabold tracking-wider transition-all cursor-pointer ${
              filterLanguages 
                ? 'bg-amber-950 text-amber-500 border-amber-900 shadow-sm' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            {filterLanguages && <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
            <span>IDIOMÁTICO / QUECHUA</span>
          </button>
        </div>
      </section>

      {/* Regional Radar minidashboard component representation */}
      <section className="bg-slate-900 text-white p-4.5 rounded-2xl shadow-sm border border-slate-800 space-y-2 relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 tracking-widest leading-none block uppercase">
              RADAR REGIONAL
            </span>
            <p className="text-base font-black tracking-tight text-white leading-tight">
              {regionalStats.title}
            </p>
          </div>
          <div className="bg-amber-600/90 text-white px-2 py-0.5 rounded text-[9px] font-bold tracking-wider leading-none shrink-0 uppercase select-none">
            LIVE
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 pt-1">
          <span className="text-[28px] font-extrabold text-white font-mono leading-none">
            {regionalStats.availableCount}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-sans font-medium">disponibles actualmente</span>
        </div>

        <div className="mt-2.5 space-y-1">
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden select-none">
            <div 
              className="h-full bg-amber-500 rounded-full transition-all duration-500" 
              style={{ width: `${regionalStats.demandPct}%` }}
            />
          </div>
          <p className="text-[9px] font-mono font-bold text-slate-400/80 uppercase tracking-widest text-right leading-none">
            Demanda: Alta ({regionalStats.demandGrowth})
          </p>
        </div>
      </section>

      {/* Profile Card listings result lists */}
      <section className="space-y-3 pb-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            RESULTADOS RECIENTES ({filteredCandidates.length})
          </h3>
          <span className="text-[10px] font-bold font-sans text-amber-600">
            ORDENAR POR MATCH
          </span>
        </div>

        <div className="space-y-3">
          {filteredCandidates.map((cand) => (
            <div
              key={cand.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-xs relative overflow-hidden flex flex-col gap-4 group"
            >
              {/* Top verification stamp ribbon corner */}
              {cand.certified && (
                <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden select-none pointer-events-none">
                  <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 rotate-45 bg-emerald-600 w-12 h-12 flex items-end justify-center pb-0.5 shadow-xs">
                    <Check className="w-3 h-3 text-white stroke-[3px]" />
                  </div>
                </div>
              )}

              <div className="flex gap-4 items-start">
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800/50 overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 rounded-lg shadow-sm">
                  <img 
                    alt={cand.name} 
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                    src={cand.img} 
                    onError={imgOnError}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight truncate">
                    {cand.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-none font-medium">
                    {cand.title} • {cand.institution}
                  </p>
                  
                  {/* Skill indicators */}
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[9px] font-mono text-slate-500 dark:text-slate-400 font-semibold uppercase rounded-sm border border-slate-200 dark:border-slate-700 select-none">
                      EXP: {cand.expYears} AÑOS
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[9px] font-mono text-slate-500 dark:text-slate-400 font-semibold uppercase rounded-sm border border-slate-200 dark:border-slate-700 select-none">
                      {cand.english}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom indicators matching ring scoring info */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="16" cy="16" fill="none" r="14" stroke="#f1f5f9" strokeWidth="2.5"></circle>
                      <circle 
                        cx="16" 
                        cy="16" 
                        fill="none" 
                        r="14" 
                        stroke="#059669" 
                        strokeWidth="2.5" 
                        strokeDasharray="88" 
                        strokeDashoffset={Math.round((1 - cand.matchRating / 100) * 88)}
                      />
                    </svg>
                    <span className="absolute text-[9px] font-black font-mono leading-none text-slate-900 dark:text-white select-none">{cand.matchRating}%</span>
                  </div>
                  <span className="text-[10px] font-bold tracking-wide text-slate-500 dark:text-slate-400 select-none">MATCH AI</span>
                </div>
                <button
                  onClick={() => setSelectedCandidate(cand)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 text-[10px] font-bold tracking-wider rounded-lg shadow-sm font-sans transition-all active:scale-[0.98] select-none cursor-pointer"
                >
                  VER PERFIL
                </button>
              </div>
            </div>
          ))}

          {filteredCandidates.length === 0 && (
            <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 px-4">
              <p className="text-slate-400 dark:text-slate-500 text-sm">No se encontraron candidatos con los criterios indicados.</p>
              <button 
                onClick={() => { setSearchQuery(''); setFilterTop5(false); setFilterUnaPuno(false); setFilterLanguages(false); }}
                className="text-xs text-amber-600 font-bold mt-2 underline"
              >
                Limpiar Filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Floating profile full details Drawer slider dialog */}
      <AnimatePresence>
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 overflow-hidden font-sans flex justify-center">
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCandidate(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />

              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Perfil del candidato"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="absolute bottom-0 w-full max-w-md bg-white dark:bg-slate-900 rounded-t-2xl shadow-2xl overflow-hidden border-t border-slate-200 dark:border-slate-700 flex flex-col max-h-[85vh] z-10"
              >
              {/* Drawer header banner styling */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-1.5 leading-none select-none">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-mono font-bold tracking-widest text-slate-300">LEGAJO EXPEDIENTE DIGITAL</span>
                </div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="p-1 px-3 text-slate-400 dark:text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg text-xs font-bold transition-all"
                >
                  CERRAR
                </button>
              </div>

              {/* Drawer scroll content body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="flex gap-4 items-start pb-4 border-b border-slate-100">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs">
                    <img 
                      alt={selectedCandidate.name} 
                      className="w-full h-full object-cover select-none"
                      referrerPolicy="no-referrer"
                      src={selectedCandidate.img} 
                      onError={imgOnError}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug truncate">{selectedCandidate.name}</h3>
                    <p className="text-xs font-semibold text-amber-700 mt-0.5">{selectedCandidate.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">{selectedCandidate.institution}</p>
                  </div>
                </div>

                {/* AI Match circle breakdown */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between select-none">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Evaluación Sincronizada</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Analizados con MinaMatch AI Model</p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-800 font-mono font-black py-1 px-3 rounded-lg text-base border border-emerald-100 shadow">
                    {selectedCandidate.matchRating}% Match
                  </div>
                </div>

                {/* Professional description */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">Pericia Profesional</h4>
                  <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 bg-amber-50/20 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    {selectedCandidate.bio}
                  </p>
                </div>

                {/* Certifications and Tags */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">Validaciones Ocupacionales</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.skills.map((sk, idx) => (
                      <span key={idx} className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 font-semibold font-sans">
                        {sk}
                      </span>
                    ))}
                    {selectedCandidate.hasOsha && (
                      <span className="bg-amber-100/70 border border-amber-200 rounded-lg px-2.5 py-1 text-xs text-amber-800 font-bold font-sans">
                        Certificando: OSHA
                      </span>
                    )}
                    <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 font-semibold font-sans">
                      Apto: +{selectedCandidate.altitudeFit || 4000} msnm
                    </span>
                  </div>
                </div>

                {/* AI Video interview pre-analysis */}
                {selectedCandidate.aiInterviewTranscript && (
                  <div className="space-y-3.5 pt-2 border-t border-slate-100">
                    <h4 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Transcripción Filtrada de Entrevista IA</span>
                    </h4>
                    
                    <div className="space-y-3">
                      {selectedCandidate.aiInterviewTranscript.map((t, idx) => (
                        <div key={idx} className="space-y-1.5 text-xs">
                          <p className="font-extrabold text-slate-900 dark:text-white bg-slate-100/90 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                            P: {t.question}
                          </p>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed border-l-2 border-amber-600 pl-3 py-0.5">
                            R: {t.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fit Social Radar */}
                {selectedCandidate.socialFit !== undefined && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <h4 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-1">
                      <Users2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Aptitud Social y Comunitaria</span>
                    </h4>
                    <FitSocialRadar scores={{
                      comunidad: selectedCandidate.socialFit,
                      cultura: selectedCandidate.socialFit,
                      conflictos: selectedCandidate.socialFit,
                      sostenibilidad: selectedCandidate.socialFit,
                      overall: selectedCandidate.socialFit
                    } as FitSocialScore} />
                  </div>
                )}
              </div>

              {/* Action trigger footer CTA */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                <button
                  onClick={() => {
                    alert(`Iniciando llamada de coordinación técnica con ${selectedCandidate.name}.`);
                    setSelectedCandidate(null);
                  }}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 rounded-xl uppercase shadow-xs flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-4 h-4 shrink-0" />
                  <span>Contactar Candidato</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
