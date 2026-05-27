import React from 'react';
import { motion } from 'motion/react';
import { Clock, ShieldCheck, Brain, Users, Award, FileText, ArrowRight, Pickaxe, CheckCircle } from 'lucide-react';

interface LandingProps {
  name: string;
  onNameChange: (name: string) => void;
  onStart: () => void;
}

export default function MinaTalentLanding({ name, onNameChange, onStart }: LandingProps) {
  return (
    <div className="max-w-md mx-auto font-sans">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
        <div className="text-center pt-4 pb-2 space-y-3">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}>
            <span className="inline-flex p-3 bg-amber-100 dark:bg-amber-950/50 rounded-2xl">
              <Pickaxe className="w-8 h-8 text-amber-600" />
            </span>
          </motion.div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Evaluación Modular MinaTalent 2.0</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            Selección optimizada para minería altoandina: Habilidades, Altura y Entorno Social.
          </p>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-500 tracking-widest uppercase">Evaluaciones Incluidas</span>
            <span className="text-[10px] font-mono text-slate-400">6 módulos</span>
          </div>
          <div className="space-y-2.5">
            {[
              { icon: Brain, label: 'DISC', desc: 'Perfil conductual y estilo de trabajo', time: '5 min' },
              { icon: Award, label: 'Wonderlic', desc: 'Razonamiento lógico y cognitivo', time: '12 min' },
              { icon: Users, label: 'Big Five', desc: 'Personalidad laboral y ajuste al cargo', time: '6 min' },
              { icon: ShieldCheck, label: 'Integridad', desc: 'Ética, honestidad y cumplimiento', time: '4 min' },
              { icon: FileText, label: 'Hogan', desc: 'Liderazgo, resiliencia y potencial', time: '5 min' },
              { icon: CheckCircle, label: 'Fit Social', desc: 'Licencia social y comunidad', time: '3 min' },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                <div className="p-1.5 rounded-lg bg-amber-500/10">
                  <m.icon className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white">{m.label}</p>
                  <p className="text-[9px] text-slate-400">{m.desc}</p>
                </div>
                <span className="text-[9px] font-mono text-slate-500 shrink-0">{m.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">Tiempo Estimado</span>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            La evaluación completa toma aproximadamente <strong>32 minutos</strong>. 
            Recomendamos realizarla en un ambiente tranquilo, sin interrupciones.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="space-y-2">
          {[
            'Responda con honestidad — no hay respuestas incorrectas',
            'Complete cada módulo antes de avanzar al siguiente',
            'Los resultados son confidenciales y uso exclusivo de RRHH',
            'Asegure una conexión estable a internet',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">{tip}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Nombre del evaluado</label>
          <input
            value={name}
            onChange={e => onNameChange(e.target.value)}
            placeholder="Ingrese nombre completo"
            className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-all"
          />
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          {...(name.trim() ? { whileHover: { scale: 1.01 }, whileTap: { scale: 0.98 } } : {})}
          onClick={onStart}
          disabled={!name.trim()}
          className={`w-full py-3.5 rounded-2xl font-extrabold text-sm tracking-wider uppercase shadow-lg transition-all flex items-center justify-center gap-2 ${
            name.trim() ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
          }`}
        >
          Iniciar Evaluación Integral
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        <p className="text-[9px] text-center text-slate-400 dark:text-slate-600 pb-4">
          Plataforma de evaluación psicométrica minera v3.0 — MinaMatch Puno
        </p>
      </motion.div>
    </div>
  );
}
