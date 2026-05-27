import React, { useEffect, useMemo, useState } from 'react';
import { Candidate } from '../types';
import { fetchCandidates, BASE_URL } from '../api';
import { mockCandidates } from '../data';
import { useToast } from './Toast';
import { ArrowRight, CheckCircle2, MapPin, Search, ShieldCheck, Sliders, Sparkles, Target, TriangleAlert, Video, Users2, AlertOctagon, PartyPopper, Wifi, WifiOff } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const FALLBACK_AVATAR = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23e2e8f0%22 width=%22100%22 height=%22100%22/%3E%3Ccircle cx=%2250%22 cy=%2238%22 r=%2216%22 fill=%22%2394a3b8%22/%3E%3Crect x=%2220%22 y=%2265%22 width=%2260%22 height=%2228%22 rx=%2214%22 fill=%22%2394a3b8%22/%3E%3C/svg%3E';

const PMV_STEPS = [
  { id: 'brief', label: '1. Brief PMV', description: 'Define el perfil, el destino y el criterio de aptitud.' },
  { id: 'filters', label: '2. Filtro', description: 'Busca el talento y ajusta la altitud mínima.' },
  { id: 'shortlist', label: '3. Shortlist', description: 'Revisa candidatos confirmados y marca el ranking.' },
  { id: 'interview', label: '4. Entrevista IA', description: 'Valida el fit cultural y operativo antes del cierre.' }
];

function imgOnError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.src = FALLBACK_AVATAR;
}

export default function MatchingShortlist() {
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [altitudeThreshold, setAltitudeThreshold] = useState(4500);
  const [showAltitudeFilter, setShowAltitudeFilter] = useState(false);
  const [selectedInterviewee, setSelectedInterviewee] = useState<Candidate | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadCandidates = async () => {
      setLoadingCandidates(true);
      setLoadError(null);

      try {
        const data = await fetchCandidates();
        if (isCancelled) return;
        setCandidates(data);
        setConnected(true);
      } catch (error) {
        if (isCancelled) return;
        setCandidates(mockCandidates);
        setConnected(false);
        toast('Usando datos locales — servidor no disponible', 'info');
      } finally {
        if (!isCancelled) {
          setLoadingCandidates(false);
        }
      }
    };

    loadCandidates();
    return () => {
      isCancelled = true;
    };
  }, [toast]);

  useEffect(() => {
    if (!selectedInterviewee) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedInterviewee(null);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedInterviewee]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((cand) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        cand.name.toLowerCase().includes(query) ||
        cand.title.toLowerCase().includes(query) ||
        cand.skills.some((skill) => skill.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      if (cand.altitudeFit > 0 && cand.altitudeFit < altitudeThreshold) {
        return false;
      }

      return true;
    });
  }, [candidates, searchQuery, altitudeThreshold]);

  const qualifiedCandidates = filteredCandidates.filter((cand) => cand.altitudeFit >= altitudeThreshold && cand.altitudeFit !== 0);
  const alertCandidates = filteredCandidates.filter((cand) => cand.altitudeFit === 0);

  const goNext = () => setActiveStep((current) => Math.min(current + 1, PMV_STEPS.length - 1));
  const goPrev = () => setActiveStep((current) => Math.max(current - 1, 0));

  if (loadingCandidates) {
    return (
      <div className="max-w-md mx-auto space-y-4 font-sans relative pb-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Cargando candidatos del PMV</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sincronizando con el servidor MinaMatch...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si hay loadError local, lo ignoramos o mostramos algo leve
  if (loadError) {
    return (
      <div className="max-w-md mx-auto space-y-4 font-sans relative pb-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 dark:border-red-900/60 dark:bg-red-950/20 p-4">
          <p className="text-sm font-bold text-red-700 dark:text-red-200">{loadError}</p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto space-y-6 font-sans text-center py-10"
      >
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <PartyPopper className="w-10 h-10 text-emerald-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">¡Proceso Completado!</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 px-6">
            Has finalizado el flujo de validación para Puno Sur. El reporte de aptitud ha sido generado y enviado a Gerencia de Reclutamiento.
          </p>
        </div>
        <button
          onClick={() => {
            setActiveStep(0);
            setIsFinished(false);
            setSelectedCandidateId(null);
          }}
          className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:shadow-slate-900/20 transition-all active:scale-95"
        >
          Volver al Inicio
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4 font-sans relative pb-6">
      {connected !== null && (
        <div className={`flex items-center justify-end gap-1.5 px-1 ${connected ? 'text-emerald-600' : 'text-amber-600'}`}>
          {connected ? (
            <><Wifi className="w-3 h-3" /><span className="text-[8px] font-bold tracking-wider uppercase">API Conectada</span></>
          ) : (
            <><WifiOff className="w-3 h-3" /><span className="text-[8px] font-bold tracking-wider uppercase">Modo Offline (Mocks)</span></>
          )}
        </div>
      )}

      <section className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-600">PMV Operacional</p>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight mt-1">
              Flujo de selección para Puno Sur
            </h2>
          </div>
          <span className="rounded-full bg-slate-900 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
            Paso {activeStep + 1} / {PMV_STEPS.length}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {PMV_STEPS.map((step, index) => {
            const isActive = index === activeStep;
            const isDone = index < activeStep;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`rounded-xl border px-2 py-3 text-left transition-all ${
                  isActive
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200'
                    : isDone
                      ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-200'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400'
                }`}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.15em]">{step.label}</p>
              </button>
            );
          })}
        </div>
      </section>

      <AnimatePresence mode="wait">
        {activeStep === 0 && (
          <motion.section
            key="brief"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4">
              <div className="flex items-center gap-2 text-amber-600">
                <Target className="w-4 h-4" />
                <p className="text-[11px] font-bold uppercase tracking-[0.2em]">Brief del puesto</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Ingeniero de Minas</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Este PMV guía la selección de personal apto para operar en alta montaña, validando adaptación física, compatibilidad con el rol y capacidad de decisión ante escenarios críticos.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Destino</p>
                  <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">Puno Sur • +4500 msnm</p>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Perfil clave</p>
                  <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">Geología, seguridad y operación</p>
                </div>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/30 p-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-200">Criterios críticos</p>
                <ul className="mt-2 space-y-1 text-sm text-emerald-900 dark:text-emerald-100">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Adaptación a altura y fatiga controlada</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Validación de experiencia técnica</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Fit cultural y seguridad operativa</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2.5 text-sm font-bold"
              >
                Continuar a filtros
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.section>
        )}

        {activeStep === 1 && (
          <motion.section
            key="filters"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Búsqueda y filtros</p>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">Encuentra candidatos aptos</h3>
                </div>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-200">
                  {filteredCandidates.length} resultados
                </span>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, rol o skill"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 pl-10 pr-4 text-sm outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowAltitudeFilter((current) => !current)}
                className={`w-full rounded-xl px-4 py-3 text-sm font-bold flex items-center justify-center gap-2 ${
                  showAltitudeFilter
                    ? 'bg-amber-950 text-amber-200'
                    : 'bg-slate-900 text-white'
                }`}
              >
                <Sliders className="w-4 h-4" />
                {showAltitudeFilter ? 'Cerrar filtro de altitud' : 'Abrir filtro de altitud'}
              </button>

              <AnimatePresence>
                {showAltitudeFilter && (
                  <motion.div
                    key="altitude-panel"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-xl bg-slate-50 dark:bg-slate-800/70 p-4 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Altitud objetivo</span>
                      <span className="rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-mono font-bold text-amber-700">
                        {altitudeThreshold} msnm
                      </span>
                    </div>
                    <input
                      type="range"
                      min="3500"
                      max="5000"
                      step="50"
                      value={altitudeThreshold}
                      onChange={(e) => setAltitudeThreshold(Number(e.target.value))}
                      className="w-full accent-amber-600"
                    />
                    <div className="flex justify-between text-[10px] font-mono uppercase text-slate-400">
                      <span>Puno</span>
                      <span>Crucero</span>
                      <span>Ananea</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      El umbral ajusta automáticamente la lista de candidatos que cumplen con la condición de ajuste a altura.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Aptos</p>
                  <p className="mt-2 text-lg font-black text-slate-900 dark:text-white">{qualifiedCandidates.length}</p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Pendientes</p>
                  <p className="mt-2 text-lg font-black text-slate-900 dark:text-white">{alertCandidates.length}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button type="button" onClick={goPrev} className="text-sm font-bold text-slate-500">
                Volver
              </button>
              <button type="button" onClick={goNext} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2.5 text-sm font-bold">
                Revisar shortlist
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.section>
        )}

        {activeStep === 2 && (
          <motion.section
            key="shortlist"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Shortlist final</p>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">Candidatos priorizados</h3>
                </div>
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
                  {qualifiedCandidates.length} aptos
                </span>
              </div>

              {/* Panel de Alertas de Licencia Social */}
              {filteredCandidates.some(c => (c.socialFit || 0) < 60) && (
                <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20 p-3 flex items-start gap-3">
                  <AlertOctagon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-red-800 dark:text-red-300 uppercase tracking-wider">Riesgo de Licencia Social</p>
                    <p className="text-[10px] text-red-700 dark:text-red-400 mt-0.5">
                      Detectamos candidatos con bajo puntaje en "Fit Social". Esto indica posible dificultad para trabajar con comunidades locales en Puno.
                    </p>
                  </div>
                </div>
              )}

              {filteredCandidates.length === 0 ? (
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 p-4 text-center">
                  <TriangleAlert className="w-8 h-8 text-amber-500 mx-auto" />
                  <p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-200">No hay candidatos con ese umbral</p>
                  <p className="text-xs text-slate-500 mt-1">Reduce la altitud mínima para ampliar la lista.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredCandidates.map((candidate) => {
                    const isAlert = candidate.altitudeFit === 0;
                    const isSocialRisk = (candidate.socialFit || 0) < 60;
                    const isQualified = candidate.altitudeFit >= altitudeThreshold;
                    return (
                      <article
                        key={candidate.id}
                        className={`rounded-xl border p-3 ${
                          isAlert
                            ? 'border-red-200 bg-red-50 dark:border-red-900/60 dark:bg-red-950/20'
                            : isQualified
                              ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                        }`}
                      >
                        <div className="flex gap-3 items-start">
                          <img
                            src={candidate.img}
                            alt={candidate.name}
                            onError={imgOnError}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-black text-slate-900 dark:text-white">{candidate.name}</p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-300">{candidate.title}</p>
                              </div>
                              <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase bg-slate-900 text-white">
                                {candidate.matchRating}%
                              </span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                              <span className="inline-flex items-center gap-1 rounded-full bg-white dark:bg-slate-800 px-2 py-1 text-slate-600 dark:text-slate-200">
                                <MapPin className="w-3 h-3" />
                                {isAlert ? 'No evaluado' : `${candidate.altitudeFit} msnm`}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-white dark:bg-slate-800 px-2 py-1 text-slate-600 dark:text-slate-200">
                                <ShieldCheck className="w-3 h-3" />
                                {candidate.hasOsha ? 'OSHA' : 'Sin OSHA'}
                              </span>
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${
                                isSocialRisk ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                              }`}>
                                <Users2 className="w-3 h-3" />
                                Fit Social: {candidate.socialFit}%
                              </span>
                            </div>
                            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-300 line-clamp-2">
                              {candidate.bio}
                            </p>
                          </div>
                        </div>
                        {isQualified && (
                          <button
                            onClick={() => {
                              setSelectedCandidateId(candidate.id);
                              goNext();
                            }}
                            className="w-full mt-3 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                          >
                            <Video className="w-3.5 h-3.5" />
                            Seleccionar para entrevista
                          </button>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button type="button" onClick={goPrev} className="text-sm font-bold text-slate-500">
                Volver
              </button>
              <button type="button" onClick={goNext} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2.5 text-sm font-bold">
                Ver entrevista IA
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.section>
        )}

        {activeStep === 3 && (
          <motion.section
            key="interview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {(() => {
              const interviewCandidate = candidates.find(c => c.id === selectedCandidateId) || qualifiedCandidates[0] || filteredCandidates[0] || null;
              
              return (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4">
              <div className="flex items-center gap-2 text-amber-600">
                <Sparkles className="w-4 h-4" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Entrevista IA</p>
              </div>

              {interviewCandidate ? (
                <>
                  <div className="flex items-center gap-3">
                    <img
                      src={interviewCandidate.img}
                      alt={interviewCandidate.name}
                      onError={imgOnError}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <p className="text-lg font-black text-slate-900 dark:text-white">{interviewCandidate.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{interviewCandidate.title}</p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 p-3 space-y-2">
                    {interviewCandidate.aiInterviewTranscript?.map((entry, index) => {
                      const isCurrent = index === activeQuestionIdx;
                      return (
                        <button
                          key={`${interviewCandidate.id}-${index}`}
                          type="button"
                          onClick={() => setActiveQuestionIdx(index)}
                          className={`w-full text-left rounded-xl border p-3 transition-all ${
                            isCurrent
                              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20'
                              : 'border-transparent bg-white dark:bg-slate-900'
                          }`}
                        >
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">Pregunta {index + 1}</p>
                          <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">{entry.question}</p>
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">“{entry.answer}”</p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedInterviewee(interviewCandidate)}
                      className="inline-flex items-center gap-2 rounded-xl bg-amber-600 text-white px-4 py-2.5 text-sm font-bold"
                    >
                      <Video className="w-4 h-4" />
                      Ver Sesión Completa
                    </button>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Match AI: {interviewCandidate.matchRating}%</span>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button type="button" onClick={goPrev} className="text-sm font-bold text-slate-500">
                      Volver
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        toast('Perfil validado exitosamente', 'success');
                        setIsFinished(true);
                      }} 
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-6 py-2.5 text-sm font-bold shadow-lg shadow-emerald-600/20"
                    >
                      Finalizar Selección
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 p-4 text-center">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No hay un candidato principal para revisar todavía.</p>
                    <p className="text-xs text-slate-500 mt-1">Vuelve al filtro y amplía el rango para cargar el shortlist.</p>
                  </div>
                  <div className="flex justify-start mt-6">
                    <button type="button" onClick={goPrev} className="text-sm font-bold text-slate-500">
                      Volver
                    </button>
                  </div>
                </>
              )}
            </div>
              );
            })()}
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedInterviewee && (
          <motion.div
            key="interview-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="absolute inset-0 bg-slate-950/65" onClick={() => setSelectedInterviewee(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 20 }}
              className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white"
            >
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">Entrevista IA</p>
                  <p className="text-sm font-bold">{selectedInterviewee.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInterviewee(null)}
                  className="rounded-lg bg-slate-800 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
                >
                  Salir
                </button>
              </div>

              <div className="p-4 space-y-4">
                {selectedInterviewee.aiInterviewTranscript?.map((item, index) => {
                  const isCurrent = index === activeQuestionIdx;
                  return (
                    <button
                      key={`${selectedInterviewee.id}-${index}`}
                      type="button"
                      onClick={() => setActiveQuestionIdx(index)}
                      className={`w-full text-left rounded-xl border p-3 ${
                        isCurrent ? 'border-amber-500 bg-slate-900' : 'border-slate-800 bg-slate-900/70'
                      }`}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">Pregunta {index + 1}</p>
                      <p className="mt-2 text-sm font-bold">{item.question}</p>
                      <p className="mt-2 text-sm text-slate-200">“{item.answer}”</p>
                    </button>
                  );
                }) || (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-center">
                    <p className="text-sm font-bold">Transcripción no disponible</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
