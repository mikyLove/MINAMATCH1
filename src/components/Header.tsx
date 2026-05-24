import React, { useState } from 'react';
import { Menu, X, Landmark, Compass, Award, Pickaxe } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export default function Header({ currentTab, onNavigate }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getProfileImage = () => {
    switch (currentTab) {
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
    switch (currentTab) {
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

  return (
    <>
      <header className="bg-white/95 backdrop-blur border-b border-gray-200 top-0 left-0 flex justify-between items-center w-full px-4 h-16 z-50 sticky transition-all">
        <div className="flex items-center gap-3">
          <button 
            id="nav-menu-btn"
            onClick={() => setIsOpen(true)}
            className="p-1 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors focus:outline-none"
            title="Abrir menú"
          >
            <Menu className="w-6 h-6 outline-none" />
          </button>
          <span className="text-xl font-bold tracking-tight text-gray-900 font-sans flex items-center gap-1.5">
            <span className="bg-amber-600 w-2.5 h-6 rounded-sm inline-block"></span>
            MinaMatch
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-gray-500 font-sans tracking-wide uppercase">MODO VISTA</span>
            <span className="text-xs text-gray-900 font-mono font-bold">{getPersonaLabel()}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm">
            <img 
              alt="User profile" 
              className="w-full h-full object-cover select-none"
              referrerPolicy="no-referrer"
              src={getProfileImage()} 
            />
          </div>
        </div>
      </header>

      {/* Slide-out navigation drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Overlay background */}
          <div 
            id="sidebar-overlay"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute inset-y-0 left-0 max-w-full flex">
            <div className="w-80 max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-transform border-r border-slate-200">
              {/* Drawer header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-900 text-amber-500 p-1.5 rounded-lg">
                    <Pickaxe className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight">MinaMatch</h3>
                    <p className="text-xs text-slate-500">Selección Minera Inteligente</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-500 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Cerrar panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer content */}
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-3 px-2">PANEL DE CONTROL</h4>
                  <ul className="space-y-1">
                    {[
                      { id: 'minatalent', label: 'Prueba Vocacional (MinaTalent)', desc: 'Evaluador de escenarios críticos', icon: Compass },
                      { id: 'semilleros', label: 'Seguimiento de Semilleros', desc: 'Syllabus becas y smart-contracts', icon: Award },
                      { id: 'buscador', label: 'Buscador de Talentos', desc: 'Selección regional y AI matches', icon: Compass },
                      { id: 'matching', label: 'Matching e Entrevistas IA', desc: 'Shortlists de aptitud y entrevistas', icon: Landmark }
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
                            className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-colors ${
                              isActive 
                                ? 'bg-amber-50 text-amber-900 border-l-4 border-amber-600' 
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'}`}>
                              <Icon className="w-5 h-5" />
                            </span>
                            <div>
                              <p className={`text-sm font-bold leading-tight ${isActive ? 'text-amber-900' : 'text-slate-900'}`}>
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

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-150">
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
              <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                <span className="text-[11px] font-mono text-slate-400 block">
                  v3.12.0 • MinaMatch Puno
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
