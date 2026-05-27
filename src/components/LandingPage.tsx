import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Pickaxe, Menu, X, ChevronRight, ArrowRight, Sparkles,
  Brain, Map, GraduationCap, BarChart3, Quote,
  Linkedin, Mail, Phone, MapPin, Globe, Shield,
  TrendingUp, Users, Target, Cpu, ChevronDown,
  Eye, Play, Star, CheckCircle, ExternalLink,
  Zap, Hexagon, Activity, Layers, LineChart,
  Satellite, Fingerprint, Blocks
} from 'lucide-react';

const navItems = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'soluciones', label: 'Soluciones' },
  { id: 'plataforma', label: 'Plataforma' },
  { id: 'testimonios', label: 'Testimonios' },
  { id: 'contacto', label: 'Contacto' },
];

const benefits = [
  {
    icon: Cpu,
    title: 'Matching IA',
    desc: 'Evaluamos compatibilidad técnica, cultural y de adaptación a altura mediante inteligencia artificial.',
    color: '#f97316',
    gradient: 'from-amber-500/20 to-amber-600/5',
    borderGlow: 'group-hover:shadow-amber-500/20',
    metric: '95%',
    metricLabel: 'precisión',
  },
  {
    icon: Brain,
    title: 'MinaTalent Test',
    desc: 'Identificamos perfiles mineros con pruebas vocacionales basadas en escenarios reales de operación.',
    color: '#3b82f6',
    gradient: 'from-blue-500/20 to-blue-600/5',
    borderGlow: 'group-hover:shadow-blue-500/20',
    metric: '8',
    metricLabel: 'perfiles',
  },
  {
    icon: Activity,
    title: 'Radar Regional',
    desc: 'Visualizamos en tiempo real la oferta y demanda de talento minero en la región Puno.',
    color: '#059669',
    gradient: 'from-emerald-500/20 to-emerald-600/5',
    borderGlow: 'group-hover:shadow-emerald-500/20',
    metric: '+4500',
    metricLabel: 'msnm',
  },
  {
    icon: Hexagon,
    title: 'Semilleros',
    desc: 'Conectamos universidades y empresas mediante formación dual con seguimiento en blockchain.',
    color: '#7c3aed',
    gradient: 'from-violet-500/20 to-violet-600/5',
    borderGlow: 'group-hover:shadow-violet-500/20',
    metric: '+200',
    metricLabel: 'estudiantes',
  },
];

const testimonials = [
  {
    name: 'Carlos Mendoza',
    role: 'Gerente de RRHH, Nexa Resources',
    text: 'MinaMatch redujo en 60% nuestro tiempo de selección para operaciones en Cerro Lindo. El matching por altitud es único.',
    rating: 5,
    initials: 'CM',
  },
  {
    name: 'Rosa Quispe',
    role: 'Directora de Ingeniería, UNA Puno',
    text: 'La plataforma nos permite conectar a nuestros mejores egresados con empresas que realmente valoran la adaptación a la altura.',
    rating: 5,
    initials: 'RQ',
  },
  {
    name: 'Jorge Linares',
    role: 'Supervisor HSE, Minera San Rafael',
    text: 'El test vocacional MinaTalent es increíblemente preciso para predecir el desempeño en condiciones extremas.',
    rating: 5,
    initials: 'JL',
  },
];

const partners = [
  'UNA Puno', 'UNI', 'Nexa Resources', 'Minsur',
  'Buenaventura', 'Hudbay Minerals',
];

const articles = [
  {
    title: 'IA en selección de talento minero: el futuro del reclutamiento en alta montaña',
    category: 'Innovación',
    date: '15 May 2026',
    reads: '1,240',
    color: 'from-amber-800 to-amber-900',
    icon: Zap,
  },
  {
    title: '¿Por qué el 70% de los candidatos mineros fracasa en altura?',
    category: 'Investigación',
    date: '8 May 2026',
    reads: '3,450',
    color: 'from-blue-800 to-blue-900',
    icon: BarChart3,
  },
  {
    title: 'Semilleros Puno: el programa que está transformando la educación minera',
    category: 'Educación',
    date: '2 May 2026',
    reads: '2,180',
    color: 'from-violet-800 to-violet-900',
    icon: GraduationCap,
  },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage({ onNavigate }: { onNavigate?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    if (menuOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
      {/* NAVBAR */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-slate-200/50 dark:border-slate-700/50'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <button onClick={() => scrollTo('inicio')} className="flex items-center gap-2.5 shrink-0 group">
              <span className="bg-slate-900 text-amber-500 p-1.5 rounded-xl group-hover:rounded-2xl transition-all duration-300 shadow-sm">
                <Pickaxe className="w-5 h-5" />
              </span>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-slate-900 dark:text-white">MinaMatch</span>
                <span className="text-amber-600"> Puno</span>
              </span>
            </button>

            <nav className="hidden lg:flex items-center gap-10">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`relative text-sm font-medium transition-colors duration-300 ${
                    activeSection === item.id
                      ? 'text-amber-600'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-600 rounded-full"
                    />
                  )}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate?.('app')}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md hover:shadow-slate-900/20 hover:-translate-y-0.5 active:translate-y-0"
              >
                Ver Plataforma
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                aria-label="Abrir menú"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl"
            >
              <div className="px-4 py-5 space-y-1 max-w-7xl mx-auto">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className="block w-full text-left px-3 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => onNavigate?.('app')}
                  className="w-full mt-4 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  Ver Plataforma
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO */}
      <section id="inicio" className="relative min-h-screen flex items-center pt-20 lg:pt-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-1/3 right-0 w-[32rem] h-[32rem] bg-amber-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[28rem] h-[28rem] bg-blue-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-amber-400 text-xs font-semibold mb-8 tracking-wide"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Talento Minero con IA
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60 animate-pulse" />
              </motion.div>

              <h1 className="text-[clamp(2.25rem,5vw,4.5rem)] font-extrabold text-white leading-[1.05] tracking-tight">
                No contratamos{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
                  currículums
                </span>
                <br className="hidden sm:block" />
                Evaluamos{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">
                  compatibilidad real
                </span>.
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="mt-6 text-base sm:text-lg text-slate-400/90 leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                MinaMatch Puno utiliza inteligencia artificial, evaluación vocacional y análisis de adaptación a altura para conectar talento minero con operaciones de alta montaña.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-3 mt-10 justify-center lg:justify-start"
              >
                <button
                  onClick={() => onNavigate?.()}
                  className="group relative px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-amber-600/20 hover:shadow-amber-600/30 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative">Explorar Plataforma</span>
                  <ArrowRight className="w-4 h-4 relative group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => scrollTo('testimonios')}
                  className="px-8 py-3.5 border border-slate-700/60 text-slate-300 hover:bg-white/5 hover:text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <Play className="w-4 h-4" />
                  Ver Demo
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="flex flex-wrap items-center gap-8 mt-12 justify-center lg:justify-start"
              >
                {[
                  { icon: Users, label: '+500', sub: 'perfiles evaluados' },
                  { icon: Brain, label: '8', sub: 'perfiles mineros' },
                  { icon: TrendingUp, label: '95%', sub: 'matching IA' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/5 backdrop-blur-sm rounded-xl border border-white/5">
                      <stat.icon className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg leading-tight">{stat.label}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">{stat.sub}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-amber-500/10 via-transparent to-blue-500/10 rounded-3xl blur-2xl" />
                <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-slate-950/50">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono ml-2">MinaMatch Dashboard</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-600/40" />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 bg-white/[0.04] rounded-xl border border-white/5 hover:bg-white/[0.07] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-amber-600/20">
                          MQ
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">Marco Quispe</p>
                          <p className="text-xs text-slate-400">Geólogo Senior · 92% Match</p>
                        </div>
                      </div>
                      <div className="w-11 h-11 flex items-center justify-center">
                        <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" fill="none" r="15" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                          <circle cx="18" cy="18" fill="none" r="15" stroke="#f97316" strokeWidth="3" strokeDasharray={`${92 * 0.942} 100`} strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-white/[0.04] rounded-xl border border-white/5 hover:bg-white/[0.07] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-600/20">
                          EM
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">Elena Mamani</p>
                          <p className="text-xs text-slate-400">Ing. Minas · 78% Match</p>
                        </div>
                      </div>
                      <div className="w-11 h-11 flex items-center justify-center">
                        <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" fill="none" r="15" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                          <circle cx="18" cy="18" fill="none" r="15" stroke="#3b82f6" strokeWidth="3" strokeDasharray={`${78 * 0.942} 100`} strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-white/[0.04] rounded-xl border border-white/5 hover:bg-white/[0.07] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-emerald-600/20">
                          PC
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">Pedro Ccuno</p>
                          <p className="text-xs text-slate-400">HSE Supervisor · 88% Match</p>
                        </div>
                      </div>
                      <div className="w-11 h-11 flex items-center justify-center">
                        <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" fill="none" r="15" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                          <circle cx="18" cy="18" fill="none" r="15" stroke="#10b981" strokeWidth="3" strokeDasharray={`${88 * 0.942} 100`} strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div className="p-3 bg-white/[0.04] rounded-xl border border-white/5 text-center hover:bg-white/[0.07] transition-colors">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Radar</p>
                        <p className="text-sm font-bold text-amber-400">+4500msnm</p>
                      </div>
                      <div className="p-3 bg-white/[0.04] rounded-xl border border-white/5 text-center hover:bg-white/[0.07] transition-colors">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Perfiles</p>
                        <p className="text-sm font-bold text-white">8</p>
                      </div>
                      <div className="p-3 bg-white/[0.04] rounded-xl border border-white/5 text-center hover:bg-white/[0.07] transition-colors">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Match IA</p>
                        <p className="text-sm font-bold text-emerald-400">95%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1 text-slate-600 dark:text-slate-400"
        >
          <span className="text-[10px] uppercase tracking-widest font-medium">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </motion.div>
      </section>

      {/* SOLUCIONES */}
      <section id="soluciones" className="relative py-20 lg:py-28 bg-slate-50 dark:bg-slate-800/50 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 lg:mb-20"
          >
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5" />
              Soluciones
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mt-3 leading-tight">
              Tecnología para la{' '}
              <span className="text-amber-600">minería del futuro</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Cuatro pilares que transforman la forma en que las minas encuentran y retienen talento preparado para alta montaña.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={benefit.title}
                variants={staggerItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: idx * 0.08 }}
                className={`group relative bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-7 border border-slate-200 dark:border-slate-700 hover:border-transparent transition-all duration-400 hover:-translate-y-1 hover:shadow-xl ${benefit.borderGlow} overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-400`} />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg" style={{ backgroundColor: `${benefit.color}15` }}>
                    <benefit.icon className="w-6 h-6 transition-transform duration-300" style={{ color: benefit.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{benefit.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{benefit.desc}</p>
                  <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: benefit.color }}>
                    <span className="text-lg font-bold">{benefit.metric}</span>
                    <span className="opacity-70">{benefit.metricLabel}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATAFORMA */}
      <section id="plataforma" className="relative py-20 lg:py-28 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 uppercase tracking-widest">
                <Layers className="w-3.5 h-3.5" />
                Plataforma
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mt-3 leading-tight">
                Una plataforma,{' '}
                <span className="text-amber-600">todo el ciclo de selección</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-4 text-base sm:text-lg leading-relaxed">
                Desde la evaluación vocacional hasta el matching por altitud y el seguimiento de semilleros,
                MinaMatch integra cada etapa del reclutamiento minero en una experiencia unificada.
              </p>

              <div className="space-y-5 mt-10">
                {[
                  { icon: Cpu, title: 'Evaluación con IA', desc: 'Análisis multidimensional de cada candidato con modelos entrenados para minería altoandina.', color: '#f97316' },
                  { icon: Fingerprint, title: 'Blockchain educativo', desc: 'Certificaciones y sílabos registrados en cadena para total transparencia.', color: '#7c3aed' },
                  { icon: Satellite, title: 'Enfoque regional', desc: 'Diseñado específicamente para el ecosistema minero de Puno y el sur del Perú.', color: '#059669' },
                ].map((item, idx) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    className="group flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 -mx-4 px-4"
                  >
                    <div className="p-2.5 rounded-xl shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: `${item.color}12` }}>
                      <item.icon className="w-5 h-5 transition-colors duration-300" style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white group-hover:text-slate-900 transition-colors">{item.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-slate-900/10 via-transparent to-amber-500/10 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-6 lg:p-7 border border-slate-800/80 shadow-2xl">
                <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-800/50">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 tracking-wide">Sistema de Matching Activo</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                      <span>Compatibilidad promedio</span>
                      <span className="text-amber-400 font-semibold">87%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '87%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 bg-white/[0.04] rounded-xl border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Altitud</p>
                      <p className="text-xl font-bold text-white">4,500</p>
                      <p className="text-[10px] text-slate-500">msnm promedio</p>
                    </div>
                    <div className="p-3.5 bg-white/[0.04] rounded-xl border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Cobertura</p>
                      <p className="text-xl font-bold text-white">6</p>
                      <p className="text-[10px] text-slate-500">regiones mineras</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Geología', 'Seguridad', 'Operaciones', 'Procesos', 'Mantenimiento'].map((tag) => (
                      <span key={tag} className="px-3 py-1.5 bg-white/[0.04] border border-white/5 rounded-lg text-[11px] text-slate-300 font-medium hover:bg-white/[0.08] transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section id="testimonios" className="relative py-20 lg:py-28 bg-slate-50 dark:bg-slate-800/50 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-amber-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 lg:mb-20"
          >
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 uppercase tracking-widest">
              <Star className="w-3.5 h-3.5" />
              Confianza
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mt-3 leading-tight">
              Lo que dicen{' '}
              <span className="text-amber-600">nuestros aliados</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((t, idx) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-7 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="relative">
                  <Quote className="w-6 h-6 text-slate-200 dark:text-slate-700 mb-2 group-hover:text-slate-300 dark:group-hover:text-slate-600 transition-colors" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5 italic">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700 group-hover:border-slate-200 dark:group-hover:border-slate-600 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-20"
          >
            <p className="text-center text-sm text-slate-400 dark:text-slate-500 mb-8 uppercase tracking-widest font-semibold">
              Empresas y universidades que confían en nosotros
            </p>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-5">
              {partners.map((name) => (
                <span key={name} className="text-base font-bold text-slate-300 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors duration-300 tracking-tight">
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" className="relative py-20 lg:py-28 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 uppercase tracking-widest">
                <Users className="w-3.5 h-3.5" />
                Nosotros
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mt-3 leading-tight">
                Transformamos el reclutamiento minero{' '}
                <span className="text-amber-600">desde Puno para el mundo</span>
              </h2>
              <div className="mt-6 space-y-4">
                <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
                  Somos una plataforma tecnológica creada para transformar el reclutamiento minero en regiones
                  altoandinas mediante inteligencia artificial, análisis cultural y evaluación vocacional especializada.
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
                  Nacimos en Puno, donde la altitud no es un número sino una realidad diaria.
                  Entendemos que un ingeniero preparado para Lima no necesariamente lo está para San Rafael o Cerro Lindo.
                </p>
              </div>

              <div className="flex items-center gap-4 mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex -space-x-2">
                  {[
                    { initials: 'MQ', gradient: 'from-amber-500 to-amber-700' },
                    { initials: 'EM', gradient: 'from-blue-500 to-blue-700' },
                    { initials: 'JF', gradient: 'from-emerald-500 to-emerald-700' },
                    { initials: 'CM', gradient: 'from-violet-500 to-violet-700' },
                  ].map((person) => (
                    <div
                      key={person.initials}
                      className={`w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br ${person.gradient} flex items-center justify-center text-white text-xs font-bold shadow-sm`}
                    >
                      {person.initials}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Equipo MinaMatch</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">+4 profesionales en minería e IA</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Cpu, value: '+500', label: 'candidatos evaluados con IA', gradient: 'from-slate-900 to-slate-950', iconColor: 'text-amber-500', labelColor: 'text-slate-400' },
                { icon: Target, value: '95%', label: 'precisión de matching', gradient: 'from-amber-600 to-amber-700', iconColor: 'text-white', labelColor: 'text-amber-100' },
                { icon: GraduationCap, value: '+8', label: 'perfiles ocupacionales', gradient: 'from-blue-600 to-blue-700', iconColor: 'text-white', labelColor: 'text-blue-100' },
                { icon: Map, value: '+4500', label: 'msnm de operación', gradient: 'from-slate-800 to-slate-900', iconColor: 'text-amber-500', labelColor: 'text-slate-400', border: 'border border-slate-700' },
              ].map((stat) => (
                <div key={stat.value} className={`bg-gradient-to-br ${stat.gradient} ${stat.border || ''} rounded-2xl p-5 lg:p-6 text-white space-y-2 hover:-translate-y-0.5 transition-transform duration-300`}>
                  <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
                  <p className="text-2xl lg:text-3xl font-black tracking-tight">{stat.value}</p>
                  <p className={`text-sm ${stat.labelColor} leading-snug`}>{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTENIDO DESTACADO */}
      <section id="contenido" className="relative py-20 lg:py-28 bg-slate-50 dark:bg-slate-800/50 overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 lg:mb-20"
          >
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 uppercase tracking-widest">
              <Eye className="w-3.5 h-3.5" />
              Insights
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mt-3 leading-tight">
              Tendencias en{' '}
              <span className="text-amber-600">talento minero</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {articles.map((article, idx) => (
              <motion.article
                key={article.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-transparent hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
              >
                <div className={`h-44 bg-gradient-to-br ${article.color} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                  <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <article.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="p-5 lg:p-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-2.5">
                    <span className="font-semibold text-amber-600">{article.category}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <span>{article.date}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {article.reads}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 transition-colors duration-300">
                    {article.title}
                  </h3>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 opacity-[0.04] opacity-5" style={{ backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-amber-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-blue-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-amber-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-amber-400 text-xs font-semibold mb-8 tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              Comienza hoy
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white leading-[1.05] tracking-tight">
              La minería del futuro necesita{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
                talento realmente preparado
              </span>.
            </h2>
            <p className="text-slate-400/90 mt-6 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Únete a las empresas mineras que ya están transformando su selección de talento con inteligencia artificial.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
              <button
                onClick={() => onNavigate?.('app')}
                className="group relative px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-amber-600/20 hover:shadow-amber-600/30 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative">Solicitar Demo</span>
                <ArrowRight className="w-4 h-4 relative group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => scrollTo('contacto')}
                className="px-8 py-3.5 border border-slate-700/60 text-slate-300 hover:bg-white/5 hover:text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-sm"
              >
                Contactar Ventas
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contacto" className="bg-slate-950 border-t border-slate-800/50 py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="bg-amber-500/10 text-amber-500 p-1.5 rounded-xl">
                  <Pickaxe className="w-4 h-4" />
                </span>
                <span className="text-lg font-bold text-white tracking-tight">MinaMatch Puno</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Selección inteligente de talento minero para operaciones de alta montaña. Hecho en Puno, para el mundo.
              </p>
              <div className="flex gap-2.5">
                {[
                  { icon: Linkedin, label: 'LinkedIn' },
                  { icon: Mail, label: 'Email' },
                  { icon: Globe, label: 'Web' },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="w-9 h-9 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5 border border-slate-700/30"
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {[
              {
                title: 'Plataforma',
                links: ['Matching IA', 'MinaTalent Test', 'Radar Regional', 'Semilleros', 'Dashboard'],
              },
              {
                title: 'Empresa',
                links: ['Sobre Nosotros', 'Equipo', 'Blog', 'Prensa', 'Carreras'],
              },
            ].map((group) => (
              <div key={group.title}>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">{group.title}</h4>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link}>
                      <button className="text-sm text-slate-500 hover:text-white transition-colors duration-300 hover:translate-x-0.5 inline-block">
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Contacto</h4>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-400">contacto@minamatch.pe</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-400">+51 987 654 321</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-400">Puno, Perú</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">
              © 2026 MinaMatch Puno. Todos los derechos reservados.
            </p>
            <div className="flex gap-5 text-xs text-slate-500">
              {['Términos', 'Privacidad', 'Cookies'].map((item) => (
                <button key={item} className="hover:text-white transition-colors duration-300">{item}</button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
