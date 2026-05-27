import React, { useState } from 'react';
import { Menu, X, Landmark, Compass, Award, Pickaxe, LogOut, Search, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';

const FALLBACK_AVATAR = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23e2e8f0%22 width=%22100%22 height=%22100%22/%3E%3Ccircle cx=%2250%22 cy=%2238%22 r=%2216%22 fill=%22%2394a3b8%22/%3E%3Crect x=%2220%22 y=%2265%22 width=%2260%22 height=%2228%22 rx=%2214%22 fill=%22%2394a3b8%22/%3E%3C/svg%3E';

function imgOnError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.src = FALLBACK_AVATAR;
}

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onLanding?: () => void;
}

export default function Header({ currentTab, onNavigate, onLanding }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const normalizedTab = currentTab === 'semilleros-list' ? 'semilleros' : currentTab;

  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  const getProfileImage = () => {
    switch (normalizedTab) {
      case 'minatalent':
        return 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIOnJtJOzV7rFWCA6AT6b08gA43tVHPa90i6PyoOLPyNY2oMfIao-duTl4azCA5Pz0VIiwkp6OslQhLXafWzftYpu9WHf9NbbCyCMi1sz19Fgob0u7CYOgmPCRkI1ImjBHFncAQcwAw0pAsQyEIWL9GwC5QLKXGnn0Zb8nzZH2_kGs8AzK6SYuxd0k0XSrRI3Yyo23-YIX8bBYmoO8hHuZ-yCfg-W-PHLQao2yGr9Qaa9muQgf3xTxtmlHVNczMHzuGzUAumdWz08';
      case 'semilleros':
        return 'https://lh3.googleusercontent.com/aida-public/AB6AXuChTWi8ViaB82sqJauvh_WkV4g21m_kjV0GIqpGC10wGM6XsQ6O5vatCtaP_iaQrtdstWs7yn5zTRpBKRSY9HTy2jIwf2CT_GUWdk2E6OGxz1NLbg-XUBV6mf63U_mjAZn5_8Wq3OSOECyOABQfhZChIPycPeUhX_zketNm52XLHb-xJ1gocF9vuYFyd0nOzP2aFL2x_-V_-3au6IKXiEZ3h7rzif1AH3CgJTtM0ped7hn7R8RH0VZ02TSmYSZxbFna8RiMs2cNO8I';
      case 'buscador':
        return 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgi98cHYQO445UNvE-YiYQssWJOsWeVd3nc3D7TkM6cq-HO92OvEOM_SKVvijc_30rmh8HkqT4zuaHI9tNtReiG8bu0K0hl4hA6kqdd9oMwQFABQpxoPr9-uce6t-j2k1cFuB0BKX2Mqnrmc31sKqf2smQ6wyBH2GuwR38mrcoK9PVuB3Aekkvk7rUtJZEq3pFsZpEiT6ub-5OJyd0TUz5Y3I7JJAbs1C0kP4vIS5Gd2jSEPFan0BqDYY4tEqy7hKYIiwzTOquExw';
      case 'matching':
      default:
        return 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMVFJEWp_QtI8pW0IfsecQc9nhqzn8w5yGxOqhX141olFoSJ8e_PwcE_8_u1N3VJOxYz0azf2caZxHPuE5IyE7W82LRyN_NmK2tN4JpmMrjiDb-qYpqS-Kh4__2fOH__S1c59W3VMHHQRXRn5n4BJ-k30WExdzfqakdnCHoVTDj0_bCMuEcdvWS_9WBeW2dVRca3VpCjen6m13kNXI3dwKHxmcEJFw3JpqXselKWWzeFVdvptLOwcNU9N_NNGI45u2jv-hggv_tjQ';
    }
  };

  const getPersonaLabel = () => {
    switch (normalizedTab) {
      case 'minatalent':
        return 'Postulante Ocupacional';
      case 'semilleros':
        return 'Estudiante Becario';
      case 'buscador':
        return 'Supervisor de Adquisiciones';
      case 'matching':
      default:
        return 'Gerencia de Reclutamiento HSE';
    }
  };

  const getCurrentTabLabel = () => {
    switch (normalizedTab) {
      case 'matching':
        return 'Matching IA';
      case 'semilleros':
        return 'Semilleros';
      case 'buscador':
        return 'Buscador de Talentos';
      case 'minatalent':
        return 'MinaTalent';
      default:
        return 'Plataforma';
    }
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 dark:bg-slate-900/80 dark:border-slate-800/50 top-0 left-0 flex justify-between items-center w-full px-4 h-16 z-50 sticky transition-all">
        <div className="flex items-center gap-3">
          <button 
            id="nav-menu-btn"
            onClick={() => setIsOpen(true)}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 transition-colors focus:outline-none"
            title="Abrir menú"
          >
            <Menu className="w-5 h-5 outline-none" />
          </button>
          <button
            onClick={onLanding}
            className="flex items-center gap-1.5 group"
            title="Ir a la portada"
          >
            <span className="bg-slate-900 text-amber-500 p-1 rounded-lg group-hover:rounded-xl transition-all duration-300 shadow-sm">
              <Pickaxe className="w-4 h-4" />
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-sans">
              MinaMatch
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/70 px-3 py-1.5 shadow-sm">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]" />
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-semibold text-slate-400 font-sans tracking-widest uppercase">Vista activa</span>
              <span className="text-xs text-slate-800 dark:text-slate-200 font-mono font-bold">{getCurrentTabLabel()}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">{getPersonaLabel()}</span>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
            <img 
              alt={user?.name || 'Perfil'} 
              className="w-full h-full object-cover select-none"
              referrerPolicy="no-referrer"
              src={getProfileImage()} 
              onError={imgOnError}
            />
          </div>
        </div>
      </header>

      {/* Slide-out navigation drawer */}
      {isOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden font-sans" role="dialog" aria-modal="true" aria-label="Menú de navegación">
            {/* Overlay background */}
            <div 
              id="sidebar-overlay"
               className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsOpen(false)}
            />

          <div className="absolute inset-y-0 left-0 max-w-full flex">
            <div className="w-80 max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full transform transition-transform border-r border-slate-200 dark:border-slate-800">
              {/* Drawer header */}
              <div className="p-4 border-b border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-900 text-amber-500 p-1.5 rounded-lg">
                    <Pickaxe className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">MinaMatch</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Selección Minera Inteligente</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Cerrar panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer content */}
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase mb-3 px-2">PANEL DE CONTROL</h4>
                  <ul className="space-y-1">
                    {[
                      { id: 'minatalent', label: 'Prueba Vocacional (MinaTalent)', desc: 'Evaluador de escenarios críticos', icon: Compass },
                      { id: 'semilleros', label: 'Seguimiento de Semilleros', desc: 'Syllabus becas y smart-contracts', icon: Award },
                      { id: 'buscador', label: 'Buscador de Talentos', desc: 'Selección regional y AI matches', icon: Search },
                      { id: 'matching', label: 'Matching y Entrevistas IA', desc: 'Shortlists de aptitud y entrevistas', icon: Landmark }
                    ].map((item) => {
                      const Icon = item.icon;
                      const isActive = currentTab === item.id;
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() => {
                              onNavigate(item.id);
                              setIsOpen(false);
                            }}
                            className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-all ${
                              isActive
                                ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900 dark:from-amber-950/80 dark:to-orange-950/60 dark:text-amber-200 border border-amber-200/70 dark:border-amber-800/80 shadow-sm'
                                : 'hover:bg-slate-50 text-slate-700 dark:hover:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            <span className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                              <Icon className="w-5 h-5" />
                            </span>
                            <div>
                              <p className={`text-sm font-bold leading-tight ${isActive ? 'text-amber-900 dark:text-amber-200' : 'text-slate-900 dark:text-white'}`}>
                                {item.label}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                                {item.desc}
                              </p>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Estado Tecnológico
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    La plataforma MinaMatch provee validación descentralizada de acreditaciones geomecánicas y de seguridad subterránea para operaciones mineras en Puno a más de +4500 msnm.
                  </p>
                  <div className="font-mono text-[10px] text-slate-400 space-y-1">
                    <p>VALIDADOR: PUNO-MAIN-04</p>
                    <p>GAS PRIORITY: HIGH</p>
                    <p>ESTADO DE NODO: SINCRONIZADO</p>
                  </div>
                </div>
              </div>

              {/* Drawer footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 text-center space-y-2">
                {onLanding && (
                  <button
                    onClick={() => { setIsOpen(false); onLanding(); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Ir a la Portada
                  </button>
                )}
                <button
                  onClick={() => { logout(); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 block">
                  {user?.name} • v3.12.0 • MinaMatch Puno
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
