import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BASE_URL } from './api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('minamatch_token');
    if (storedToken) {
      setToken(storedToken);
      if (storedToken === 'guest-token') {
        setUser({
          id: 'guest-user',
          name: 'Invitado MinaMatch',
          email: 'invitado@minamatch.pe',
          role: 'guest',
          avatar: null
        });
        setLoading(false);
        return;
      }
      fetch(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Token inválido');
          return res.json();
        })
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('minamatch_token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Credenciales inválidas');
      }
      const data = await res.json();
      localStorage.setItem('minamatch_token', data.token);
      setToken(data.token);
      setUser(data.user);
    } catch {
      // Fallback offline: credenciales hardcodeadas si el servidor no responde
      if (email === 'admin@minamatch.pe' && password === 'admin123') {
        const data = { token: 'local-jwt-simulated', user: { id: 'admin-1', name: 'Admin MinaMatch', email: 'admin@minamatch.pe', role: 'admin', avatar: null } };
        localStorage.setItem('minamatch_token', data.token);
        setToken(data.token);
        setUser(data.user);
      } else {
        throw new Error('Credenciales inválidas');
      }
    }
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'guest-user',
      name: 'Invitado MinaMatch',
      email: 'invitado@minamatch.pe',
      role: 'guest',
      avatar: null
    };
    localStorage.setItem('minamatch_token', 'guest-token');
    setToken('guest-token');
    setUser(guestUser);
  };

  const logout = () => {
    localStorage.removeItem('minamatch_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, loginAsGuest, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
