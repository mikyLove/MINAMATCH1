import React, { useState, useEffect, useRef } from 'react';
import { mockScenarios } from '../data';
import { AlertTriangle, ShieldCheck, Clock, ShieldAlert, Sparkles, ChevronRight, RefreshCw, Trophy, Snowflake } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ScenarioAssessment() {
  const [currentIndex, setCurrentIndex] = useState(2); // Start at stage 3/5 (ventilador crisis) to match screenshot exactly!
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answersHistory, setAnswersHistory] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const scenario = mockScenarios[currentIndex];

  // Particle dust effect simulation on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 350);
    let height = (canvas.height = 200);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
      }
    };
    window.addEventListener('resize', handleResize);

    const particles: { x: number; y: number; s: number; v: number }[] = [];
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        s: Math.random() * 2 + 0.5,
        v: Math.random() * 0.4 + 0.1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(133, 144, 166, 0.18)';
      particles.forEach((p) => {
        p.y += p.v;
        if (p.y > height) {
          p.y = -5;
          p.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [currentIndex, showResults]);

  // Handle choice selection
  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    setAnswersHistory((prev) => ({
      ...prev,
      [currentIndex]: optionId
    }));
  };

  // Get current metrics based on selection or initial default
  const getActiveMetrics = () => {
    // defaults matching screenshot precisely:
    const defaultOption = scenario.options[0];
    const chosenOption = scenario.options.find(o => o.id === (selectedOptionId || defaultOption.id));
    return chosenOption ? chosenOption.impact : defaultOption.impact;
  };

  const metrics = getActiveMetrics();

  // Progress to next scenario
  const handleNextScenario = () => {
    if (currentIndex < mockScenarios.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
    } else {
      setShowResults(true);
    }
  };

  // Calculate final score summary
  const calculateFinalAssessment = () => {
    let totalCalma = 0;
    let totalSeguridad = 0;
    let totalAdaptabilidad = 0;
    let numAnswers = Object.keys(answersHistory).length;

    mockScenarios.forEach((sc, idx) => {
      const chosenId = answersHistory[idx];
      const opt = sc.options.find((o) => o.id === chosenId) || sc.options[0];
      totalCalma += opt.impact.calma;
      totalSeguridad += opt.impact.seguridad;
      totalAdaptabilidad += opt.impact.toleranciaFrio;
    });

    const finalCalma = numAnswers ? Number((totalCalma / mockScenarios.length).toFixed(1)) : 8.8;
    const finalSeguridad = numAnswers ? Number((totalSeguridad / mockScenarios.length).toFixed(1)) : 9.0;
    const finalAdaptabilidad = numAnswers ? Math.min(100, Math.round(totalAdaptabilidad / mockScenarios.length)) : 85;

    let profileName = 'Geólogo de Operaciones Seguras';
    let labelRecommendation = 'Apto para unidades mineras de gran altitud (+4500msnm), mostrando un perfil analítico de alta resiliencia térmica.';

    if (finalSeguridad > 8.5 && finalCalma > 8.0) {
      profileName = 'Supervisor HSE de Alta Montaña';
      labelRecommendation = 'Perfil de liderazgo con enfoque absoluto en el resguardo humano. Recomendado para San Rafael o Ananea.';
    } else if (finalCalma > 8.5) {
      profileName = 'Especialista en Control Geomecánico Crítico';
      labelRecommendation = 'Muestra temple excepcional en situaciones imprevistas de colapso de infraestructura, optando por análisis de bypass lógicos.';
    }

    return {
      calma: finalCalma,
      seguridad: finalSeguridad,
      adaptabilidad: finalAdaptabilidad,
      profileName,
      labelRecommendation
    };
  };

  const finalProfile = calculateFinalAssessment();

  const resetAssessment = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setAnswersHistory({});
    setShowResults(false);
  };

  // Convert radar points depending on actual active metrics
  // Base points for a symmetrical pentagon center (50,50):
  // Points: Seg (Top), Etica (Bottom Left), Innov (Bottom Right)
  const getRadarPolygonPoints = () => {
    const fit = metrics.culturalFit;
    // seg: goes up towards (50, 10). Length = fit.seguridad % (max 100)
    const segLen = (fit.seguridad / 100) * 40;
    const segY = 50 - segLen;
    
    // etica (bottom-left): goes down-left. Base pentagon point at ~ (20, 80)
    // Vector from (50,50) is (-30, 30)
    const eticaFactor = fit.etica / 100;
    const eticaX = 50 - (35 * eticaFactor);
    const eticaY = 50 + (35 * eticaFactor);

    // innovacion (bottom-right): goes down-right. Base pentagon point at ~ (80, 80)
    // Vector from (50,50) is (30, 30)
    const innovFactor = fit.innovacion / 100;
    const innovX = 50 + (35 * innovFactor);
    const innovY = 50 + (35 * innovFactor);

    // Let's output points string
    // Since we output a simple triangle of cultural fit (Seguridad, Ética, Innovación) just like screen 1
    return `50,${segY.toFixed(1)} ${innovX.toFixed(1)},${innovY.toFixed(1)} ${eticaX.toFixed(1)},${eticaY.toFixed(1)}`;
  };

  const radarPoints = getRadarPolygonPoints();

  return (
    <div className="max-w-md mx-auto space-y-5 font-sans relative">
      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Header Stage indicators */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold tracking-wider text-slate-500 block uppercase font-sans">
                  MINATALENT ASSESSMENT
                </span>
                <h1 className="text-xl font-extrabold text-slate-900 mt-1">
                  Prueba Vocacional
                </h1>
              </div>
              <div className="bg-slate-900 text-white px-3 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                <span className="text-xs font-mono font-bold tracking-wider">{scenario.stage}</span>
              </div>
            </div>

            {/* Main Scenario description card */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-amber-950/95 text-amber-500 px-4 py-2 flex items-center gap-2 border-b border-amber-900/40">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-[11px] font-extrabold tracking-wider uppercase font-sans">
                  {scenario.category}
                </span>
              </div>
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">
                    {scenario.title}
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {scenario.description}
                  </p>
                </div>

                {/* Simulated emergency visual with Canvas particles overlay */}
                <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800 shadow-inner group">
                  {/* Base canvas for industrial dusty look */}
                  <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-70 z-10" />
                  
                  <img 
                    alt="Atmospheric underground mining visual" 
                    className="w-full h-full object-cover grayscale opacity-45 select-none transition-transform duration-[4000ms] scale-105 group-hover:scale-100" 
                    referrerPolicy="no-referrer"
                    src={scenario.imageUrl} 
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />

                  {/* Pulsing indicator */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 z-20">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                    </span>
                    <span className="text-[10px] font-mono text-white/90 font-bold uppercase tracking-wider">
                      {scenario.alertText}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions/Options Choices section */}
            <section className="space-y-3">
              <p className="text-[11px] font-extrabold tracking-wider text-slate-500 uppercase px-1">
                ¿CUÁL ES TU SIGUIENTE ACCIÓN?
              </p>
              <div className="space-y-2.5">
                {scenario.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option.id)}
                      className={`w-full text-left bg-white border rounded-2xl p-4 flex items-start gap-3.5 transition-all outline-none focus:ring-2 focus:ring-amber-500/20 active:scale-[0.99] border-1 ${
                        isSelected 
                          ? 'border-amber-600 bg-amber-50/40 shadow-xs' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors ${
                        isSelected ? 'border-amber-600 bg-amber-600' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm font-bold block leading-tight ${isSelected ? 'text-amber-950' : 'text-slate-900'}`}>
                          {option.text}
                        </span>
                        <p className="text-xs text-slate-500 mt-1 leading-snug">
                          {option.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Realtime Analytical assessment charts row */}
            <div className="grid grid-cols-2 gap-3.5">
              {/* Radar diagram */}
              <div className="bg-slate-900 p-4 rounded-2xl flex flex-col justify-between shadow-xs border border-slate-800 text-white min-h-[170px]">
                <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block">
                  CULTURAL FIT
                </span>
                <div className="relative w-full aspect-square max-h-[120px] mx-auto flex items-center justify-center rounded-full border border-slate-800 my-2">
                  <svg className="w-full h-full p-1.5 rotate-180" viewBox="0 0 100 100">
                    {/* Inner background radar grids */}
                    <polygon fill="none" points="50,10 90,40 70,90 30,90 10,40" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2"></polygon>
                    <polygon fill="none" points="50,25 80,48 65,80 35,80 20,48" stroke="#1e293b" strokeWidth="0.5"></polygon>
                    {/* Simulated pentagram line dividers */}
                    <line x1="50" y1="50" x2="50" y2="10" stroke="#1e293b" strokeWidth="0.5" />
                    <line x1="50" y1="50" x2="90" y2="40" stroke="#1e293b" strokeWidth="0.5" />
                    <line x1="50" y1="50" x2="10" y2="40" stroke="#1e293b" strokeWidth="0.5" />
                    
                    {/* Selected fill points (Seguridad, Ética, Innovación) */}
                    <polygon 
                      fill="rgba(245, 158, 11, 0.4)" 
                      points={radarPoints} 
                      stroke="#f59e0b" 
                      strokeWidth="1.5"
                      className="transition-all duration-300"
                    />
                  </svg>
                  {/* Legend Labels */}
                  <div className="absolute top-1 text-[8px] text-slate-400 font-bold tracking-wider uppercase">Seguridad</div>
                  <div className="absolute bottom-1 left-2 text-[8px] text-slate-400 font-bold tracking-wider uppercase">Ética</div>
                  <div className="absolute bottom-1 right-2 text-[8px] text-slate-400 font-bold tracking-wider uppercase">Innovación</div>
                </div>
              </div>

              {/* Adaptability meter card */}
              <div className="bg-slate-100 p-4 rounded-xl flex flex-col justify-between border border-slate-200/80 min-h-[170px]">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-500 tracking-wider uppercase block">
                    ADAPTABILIDAD (RF15)
                  </span>
                  <p className="text-xs font-extrabold text-slate-800">Resiliencia Térmica</p>
                </div>

                <div className="space-y-1.5 py-1">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-mono text-slate-500">Tolerancia Frío</span>
                    <span className="text-xs font-bold text-slate-900">{metrics.toleranciaFrio}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-slate-900 transition-all duration-300" 
                      style={{ width: `${metrics.toleranciaFrio}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-1.5 bg-white/60 p-2 rounded-lg border border-slate-200 shadow-2xs select-none">
                  <Snowflake className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span className="text-[9px] leading-tight text-slate-600 block">
                    Apto para operaciones en alta montaña (+4500msnm).
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics digital display snapshot node */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-around divide-x divide-slate-200">
              <div className="text-center flex-1 px-2 select-none">
                <span className="text-[9px] font-bold text-slate-400 block mb-1 tracking-wider">
                  CALMA
                </span>
                <span className="text-lg font-black text-slate-900 font-mono">
                  {metrics.calma}
                </span>
              </div>
              <div className="text-center flex-1 px-2 select-none">
                <span className="text-[9px] font-bold text-slate-400 block mb-1 tracking-wider">
                  SEGURIDAD
                </span>
                <span className="text-lg font-black text-amber-600 font-mono">
                  {metrics.seguridad}
                </span>
              </div>
              <div className="text-center flex-1 px-2 select-none">
                <span className="text-[9px] font-bold text-slate-400 block mb-1 tracking-wider">
                  TIEMPO
                </span>
                <span className="text-lg font-black text-slate-900 font-mono">
                  {metrics.tiempo}
                </span>
              </div>
            </div>

            {/* Orange proceed action CTA */}
            <button
              onClick={handleNextScenario}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all cursor-pointer select-none"
            >
              <span className="text-sm font-bold uppercase tracking-wider">
                {currentIndex < mockScenarios.length - 1 ? 'SIGUIENTE ESCENARIO' : 'FINALIZAR EVALUACIÓN VOCIONAL'}
              </span>
              <ChevronRight className="w-5 h-5 shrink-0" />
            </button>
          </motion.div>
        ) : (
          /* Assessment Results node */
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-5"
          >
            <div className="text-center space-y-2 py-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto shadow-inner text-amber-600">
                <Trophy className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Evaluación Finalizada</h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Basado en tu desempeño resolviendo emergencias técnicas de nivel crítico en el sur minero.
              </p>
            </div>

            {/* Profile result details card */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4 shadow-md relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full pointer-events-none blur-xl" />
              
              <div className="space-y-1">
                <span className="text-[10px] text-amber-500 font-bold tracking-widest uppercase">PERFIL AJUSTADO AI</span>
                <h3 className="text-lg font-black tracking-tight">{finalProfile.profileName}</h3>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/5 font-sans text-xs leading-relaxed text-slate-200">
                {finalProfile.labelRecommendation}
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 text-center divide-x divide-white/5 border-t border-b border-white/5">
                <div>
                  <span className="block text-[8px] text-slate-400 font-semibold tracking-wider mb-1">PROMEDIO CALMA</span>
                  <p className="text-sm font-bold font-mono text-white">{finalProfile.calma} / 10</p>
                </div>
                <div>
                  <span className="block text-[8px] text-slate-400 font-semibold tracking-wider mb-1">PROMEDIO SEGURIDAD</span>
                  <p className="text-sm font-bold font-mono text-amber-500">{finalProfile.seguridad} / 10</p>
                </div>
                <div>
                  <span className="block text-[8px] text-slate-400 font-semibold tracking-wider mb-1">RESILIENCIA FRÍO</span>
                  <p className="text-sm font-bold font-mono text-white">{finalProfile.adaptabilidad}%</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>blockchain mint ticket</span>
                  <span>ready</span>
                </div>
                <div className="p-2.5 bg-black/60 rounded border border-white/5 font-mono text-[9px] text-amber-400/80 break-all leading-tight">
                  0xMinaMatchVoc-{Math.random().toString(16).substring(2, 10).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Bottom buttons to restart */}
            <div className="space-y-2">
              <button
                onClick={resetAssessment}
                className="w-full bg-slate-900 text-white hover:bg-slate-800 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Reiniciar Simulación</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
