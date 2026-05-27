import React from 'react';
import { TrendingUp, GraduationCap, Search, Pickaxe } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export default function BottomNav({ currentTab, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'matching', label: 'Matching', icon: TrendingUp },
    { id: 'semilleros', label: 'Semilleros', icon: GraduationCap },
    { id: 'buscador', label: 'Buscador', icon: Search },
    { id: 'minatalent', label: 'MinaTalent', icon: Pickaxe }
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 w-full bg-slate-900 dark:bg-slate-950 border-t border-slate-800 dark:border-slate-700 flex justify-around items-center px-4 pb-4 pt-2.5 h-20 z-40 select-none"
      style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
      aria-label="Navegación principal"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id || (item.id === 'semilleros' && currentTab === 'semilleros-list');

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center justify-center font-sans tracking-wide transition-all outline-none border-none select-none shrink-0 ${
              isActive
                ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-white rounded-2xl px-4 py-2 shadow-lg shadow-amber-600/30 ring-1 ring-amber-300/50'
                : 'text-slate-400 dark:text-slate-500 opacity-80 hover:opacity-100 hover:text-slate-100 dark:hover:text-white px-3'
            }`}
            title={`Navegar a ${item.label}`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase mt-1 leading-none tracking-wider">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
