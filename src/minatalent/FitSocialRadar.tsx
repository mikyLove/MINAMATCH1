import React from 'react';
import { FitSocialScore } from './scoring';
import { motion } from 'motion/react';

const DIMS = [
  { key: 'comunidad', label: 'Comunidad', color: '#059669' },
  { key: 'cultura', label: 'Cultura', color: '#d97706' },
  { key: 'conflictos', label: 'Gestión Conflictos', color: '#dc2626' },
  { key: 'sostenibilidad', label: 'Sostenibilidad', color: '#2563eb' }
];

export default function FitSocialRadar({ scores }: { scores: FitSocialScore }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Aptitud Social Detallada</h4>
        <span className="text-lg font-black text-amber-600">{scores.overall}%</span>
      </div>
      <div className="space-y-3">
        {DIMS.map(d => {
          const val = scores[d.key as keyof FitSocialScore] as number;
          return (
            <div key={d.key}>
              <div className="flex justify-between text-[10px] font-bold mb-1">
                <span className="text-slate-600 dark:text-slate-400 uppercase">{d.label}</span>
                <span style={{ color: d.color }}>{val}%</span>
              </div>
              <div 
                className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={val}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${val}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full" 
                  style={{ backgroundColor: d.color }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}