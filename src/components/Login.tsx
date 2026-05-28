import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Pickaxe, Eye, EyeOff, LogIn, ArrowLeft, UserCircle } from 'lucide-react';

interface LoginProps {
  onBack?: () => void;
}

export default function Login({ onBack }: LoginProps) {
  const { login, loginAsGuest, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
          <div className="text-center mb-8">
            {onBack && (
              <button
                onClick={onBack}
                className="float-left -ml-2 p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Volver"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-4">
              <Pickaxe className="w-8 h-8 text-amber-700" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">MinaMatch</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Selección Minera Inteligente</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nombre completo</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Pérez"
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@minamatch.pe"
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-11 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  {mode === 'login' ? 'Ingresar' : 'Registrarme'}
                </>
              )}
            </button>
          </form>

          <div className="mt-5 space-y-4">
            <div className="flex items-center gap-2 px-1">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">O</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            </div>

            <button
              type="button"
              onClick={loginAsGuest}
              className="w-full py-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm active:scale-[0.98]"
            >
              <UserCircle className="w-4 h-4" />
              Ingresar como Invitado
            </button>
          </div>

          <div className="mt-4 text-center">
            {mode === 'login' ? (
              <p className="text-sm text-slate-500">
                ¿No tienes cuenta?{' '}
                <button onClick={() => setMode('register')} className="text-amber-600 font-semibold">Crear cuenta</button>
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                ¿Ya tienes cuenta?{' '}
                <button onClick={() => setMode('login')} className="text-amber-600 font-semibold">Ingresar</button>
              </p>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Demo: <span className="font-mono text-slate-600 dark:text-slate-400">admin@minamatch.pe</span>
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Pass: <span className="font-mono text-slate-600 dark:text-slate-400">admin123</span>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 dark:text-slate-400 mt-6">
          © 2026 MinaMatch Puno — Selección Minera Inteligente
        </p>
      </div>
    </div>
  );
}
