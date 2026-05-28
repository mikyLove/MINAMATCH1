import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v2Login, v2VerifyToken } from './lib/api/auth';
import { V2ApiError } from './lib/api/client';
import type { V2UserProfile } from './lib/api/types';

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

function toUser(p: V2UserProfile): User {
  return { id: p.id, name: p.name, email: p.email, role: p.role, avatar: p.avatar };
}

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
          avatar: null,
        });
        setLoading(false);
        return;
      }
      v2VerifyToken()
        .then((profile) => {
          setUser(toUser(profile));
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
    const data = await v2Login({ email, password });
    localStorage.setItem('minamatch_token', data.token);
    setToken(data.token);
    setUser(toUser(data.user));
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'guest-user',
      name: 'Invitado MinaMatch',
      email: 'invitado@minamatch.pe',
      role: 'guest',
      avatar: null,
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
