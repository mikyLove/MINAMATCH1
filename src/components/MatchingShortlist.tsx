import React, { useState, useMemo } from 'react';
import { mockCandidates } from '../data';
import { Candidate } from '../types';
import { Search, Sliders, Play, Phone, Sparkles, Check, ChevronRight, MessageSquareCode, ShieldCheck, TriangleAlert, Video, Eye, X, Award, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function MatchingShortlist() {
  const [searchQuery, setSearchQuery] = useState('');
  const [altitudeThreshold, setAltitudeThreshold] = useState<number>(4500);
  const [showAltitudeFilter, setShowAltitudeFilter] = useState(false);
  const [selectedInterviewee, setSelectedInterviewee] = useState<Candidate | null>(null);
  
  // Interactive simulated interview transcript step state variables
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  // Filter candidates specifically matched to altitude and search
  const filteredCandidates = useMemo(() => {
    return mockCandidates.filter(cand => {
      // name or skills match
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        cand.name.toLowerCase().includes(query) ||
        cand.skills.some(sk => sk.toLowerCase().includes(query)) ||
        cand.title.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // altitude check (Mateo Quispe with altitude 0 represents No Evaluado - falls into warning category!)
      // If candidate has evaluated altitude, it must be greater than or equal to current slider setting to be apt!
      // If candidate has no altitude (0), we can still list them but show their warnings
      if (cand.altitudeFit > 0 && cand.altitudeFit < altitudeThreshold) {
        return false;
      }

      return true;
    });
  }, [searchQuery, altitudeThreshold]);

  return (
    <div className="max-w-md mx-auto space-y-4 font-sans relative">
      {/* Hero title */}
      <section className="px-1 select-none">
        <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
          Ingeniero de Minas
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {filteredCandidates.length} Candidatos calificados para Puno Sur
        </p>
      </section>

      {/* Dynamic Search & Filtro de Altura slide controller */}
      <section className="space-y-2.5">
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-slate-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 hover:border-slate-300 focus:border-slate-800 rounded-xl text-xs outline-none transition-colors shadow-2xs font-sans placeholder-slate-400"
            placeholder="Buscar candidatos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Highlighted click CTA button of altitude slider */}
        <button
          onClick={() => setShowAltitudeFilter(!showAltitudeFilter)}
          className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer font-sans select-none border border-amber-600/10 ${
            showAltitudeFilter 
              ? 'bg-amber-950 text-amber-500 shadow-2xs' 
              : 'bg-slate-900 text-white hover:bg-slate-850 shadow-sm'
          }`}
        >
          <Sliders className="w-4 h-4 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider">
            {showAltitudeFilter ? 'Cerrar Filtro Ocupacional' : 'Filtro de Altura'}
          </span>
        </button>

        {/* Interactive slide drawer panel for height threshold */}
        <AnimatePresence>
          {showAltitudeFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-inner space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Altitud de Destino</span>
                <span className="text-xs font-mono font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
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
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between text-[9px] font-mono font-bold text-slate-405/80 uppercase tracking-widest select-none">
                <span>PUNO CENTRAL (3800m)</span>
                <span>CRUCERO (4800m)</span>
                <span>ANANEA (4950m)</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                Ajustando el regulador se filtran de forma dinámica los operarios cuyos test biométricos en cámara de hipoxia barométrica certifican adaptación plena para trabajar sin fatiga de soroche a dicha altura.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Candidate List matches */}
      <section className="space-y-4.5 pb-8">
        {filteredCandidates.map((cand) => {
          const isApt = cand.altitudeFit >= altitudeThreshold;
          const isNotEvaluated = cand.altitudeFit === 0;

          return (
            <article
              key={cand.id}
              className={`bg-white border text-slate-900 rounded-xl p-4 shadow-xs relative overflow-hidden group border-slate-200 transition-all ${
                isNotEvaluated ? 'opacity-85' : ''
              }`}
            >
              {/* Profile Card Certificate label */}
              <div className="absolute top-0 right-0 pt-2 pr-3 select-none">
                {isNotEvaluated ? (
                  <span className="bg-red-50 text-red-700 text-[9px] font-bold uppercase px-2 py-0.5 rounded-sm border border-red-100">
                    Alerta
                  </span>
                ) : (
                  <span className="bg-emerald-50 text-emerald-800 text-[9px] font-bold uppercase px-2 py-0.5 rounded-sm border border-emerald-100/60">
                    Certificado
                  </span>
                )}
              </div>

              <div className="flex gap-4 mb-3.5 items-start">
                {/* Photo profile */}
                <div className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-2xs relative ${
                  isNotEvaluated ? 'grayscale filter' : ''
                }`}>
                  <img 
                    alt={cand.name} 
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                    src={cand.img} 
                  />
                  {isNotEvaluated && (
                    <div className="absolute inset-0 bg-red-950/20 mix-blend-color" />
                  )}
                </div>

                {/* Candidate title info */}
                <div className="flex-1 min-w-0 pr-12">
                  <h3 className="text-sm font-extrabold text-slate-900 leading-tight truncate">
                    {cand.name}
                  </h3>
                  <div className={`flex items-center gap-1 mt-1 leading-none ${isNotEvaluated ? 'text-red-700' : 'text-slate-500'}`}>
                    {isNotEvaluated ? (
                      <>
                        <TriangleAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span className="text-[10px] font-bold font-sans">Altitud: No Evaluado</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="text-[10px] font-mono font-bold">Apta ({cand.altitudeFit} msnm)</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Circular Score ring matches screen 4 */}
                <div className="relative w-12 h-12 shrink-0 flex items-center justify-center select-none">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="24" cy="24" fill="transparent" r="20" stroke="#f1f5f9" strokeWidth="2.5"></circle>
                    <circle 
                      cx="24" 
                      cy="24" 
                      fill="transparent" 
                      r="20" 
                      stroke={isNotEvaluated ? '#94a3b8' : '#059669'} 
                      strokeWidth="2.5" 
                      strokeDasharray="125" 
                      strokeDashoffset={Math.round((1 - cand.matchRating / 100) * 125)}
                      className="transition-all duration-300"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-black font-mono text-slate-950">{cand.matchRating}</span>
                </div>
              </div>

              {/* Tag listings */}
              <div className="flex flex-wrap gap-1.5 mb-3.5 select-none">
                {cand.skills.map((sk, idx) => (
                  <span 
                    key={idx} 
                    className="bg-slate-50 text-slate-500 border border-slate-150 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full"
                  >
                    {sk}
                  </span>
                ))}
              </div>

              {/* Action play interview CTA button matches Screen 4 precisely */}
              <button
                onClick={() => {
                  setSelectedInterviewee(cand);
                  setActiveQuestionIdx(0);
                }}
                className="w-full py-2.5 bg-white hover:bg-slate-50 border-2 border-slate-900 text-slate-900 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 tracking-wider transition-colors active:scale-[0.98] select-none cursor-pointer uppercase"
                title="Ver transcripción de la entrevista generada por la inteligencia artificial"
              >
                <Video className="w-4 h-4 shrink-0 text-slate-900" />
                <span>Ver Entrevista IA</span>
              </button>
            </article>
          );
        })}

        {filteredCandidates.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 px-4">
            <p className="text-slate-400 text-sm font-medium">
              Ningún geólogo o ingeniero cumple con la altitud mínima requerida de {altitudeThreshold} msnm.
            </p>
            <p className="text-xs text-slate-400 mt-1">Pruebe reduciendo el regulador en el panel Filtro de Altura.</p>
          </div>
        )}
      </section>

      {/* Cinematic AI Video interview modal simulation */}
      <AnimatePresence>
        {selectedInterviewee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 font-sans">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInterviewee(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-950 text-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative z-10 border border-slate-800 flex flex-col max-h-[82vh]"
            >
              {/* Video console visual header banner mockup */}
              <div className="p-4.5 bg-slate-900 border-b border-slate-800 flex justify-between items-center select-none">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shrink-0" />
                  <span className="text-[10px] font-mono tracking-widest text-slate-300 font-bold">ENTREVISTA IA TRANSCRIPTION</span>
                </div>
                <button
                  onClick={() => setSelectedInterviewee(null)}
                  className="p-1 px-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded text-xs font-mono font-bold transition-colors"
                >
                  SALIR
                </button>
              </div>

              {/* Video mock display frame */}
              <div className="aspect-video bg-slate-900 relative flex items-center justify-center border-b border-slate-800 overflow-hidden shrink-0 group select-none">
                <img 
                  alt="Candidate avatar portrait" 
                  className="w-full h-full object-cover opacity-60 filter blur-2xs transition-all scale-102 group-hover:scale-100" 
                  referrerPolicy="no-referrer"
                  src={selectedInterviewee.img} 
                />
                
                {/* Visual scanlines effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.85) 100%)'
                }} />

                {/* Watermark identifier stamp */}
                <div className="absolute top-3 left-3 bg-black/60 px-2 py-0.5 rounded border border-white/5 font-mono text-[8px] uppercase tracking-widest text-[#fff]">
                  CAM_01_PUNO
                </div>

                <div className="absolute bottom-3 right-3 bg-red-600 px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest text-white font-bold animate-pulse">
                  REC
                </div>

                {/* Speaker indicator overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 z-10">
                  <p className="text-xs font-black drop-shadow-sm truncate">{selectedInterviewee.name}</p>
                  <p className="text-[9px] font-mono text-slate-400 drop-shadow-sm leading-none mt-0.5 uppercase tracking-wide">
                    {selectedInterviewee.title}
                  </p>
                </div>
              </div>

              {/* Active simulated Q&A flow dialogue panel */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
                {selectedInterviewee.aiInterviewTranscript && selectedInterviewee.aiInterviewTranscript.length > 0 ? (
                  <div className="space-y-4">
                    {selectedInterviewee.aiInterviewTranscript.map((transcript, idx) => {
                      const isCurrent = idx === activeQuestionIdx;
                      return (
                        <div 
                          key={idx} 
                          onClick={() => setActiveQuestionIdx(idx)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${
                            isCurrent 
                              ? 'bg-slate-900 text-white border-amber-600/60 shadow-inner' 
                              : 'bg-slate-900/40 text-slate-400 border-white/5 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <p className="font-extrabold text-[10px] text-amber-500 uppercase tracking-widest mb-1.5 font-mono">
                            Pregunta {idx + 1} de {selectedInterviewee.aiInterviewTranscript!.length}
                          </p>
                          <p className="font-bold text-white mb-2 leading-snug">
                            {transcript.question}
                          </p>
                          <p className="text-slate-300 leading-relaxed font-sans font-medium italic border-l border-amber-500 pl-3">
                            "{transcript.answer}"
                          </p>
                        </div>
                      );
                    })}

                    {/* Step guidance dots select-none */}
                    <div className="flex justify-center gap-1.5 py-1 select-none">
                      {selectedInterviewee.aiInterviewTranscript.map((_, idx) => (
                        <button
                          key={idx}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === activeQuestionIdx ? 'bg-amber-500 w-4' : 'bg-slate-700'
                          }`}
                          onClick={() => setActiveQuestionIdx(idx)}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-2 select-none">
                    <TriangleAlert className="w-8 h-8 text-amber-500 mx-auto" />
                    <p className="text-slate-400 font-bold">Evaluación Incompleta</p>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Aún no se ha registrado test audiovisual automatizado de asimilación para este legajo.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Call candidate trigger */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2 shrink-0">
                <button
                  onClick={() => {
                    alert(`Vinculando llamada directa a Puno con ${selectedInterviewee.name}`);
                    setSelectedInterviewee(null);
                  }}
                  className="w-full bg-amber-650 hover:bg-amber-705 text-white font-bold py-2.5 text-xs rounded-xl uppercase shadow-sm tracking-wider"
                >
                  Agendar Evaluación Evaluador
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
