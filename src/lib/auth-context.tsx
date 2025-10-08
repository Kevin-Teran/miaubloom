/**
 * @file auth-context.tsx
 * @route lib/auth-context.tsx
 * @description Contexto de autenticación migrado a Prisma/API (Iron Session).
 * Proporciona user, rol y métodos de autenticación (signIn/signOut) a través de rutas API.
 * El registro (signUp) se elimina ya que los usuarios son creados por Admin/Psicólogo.
 * @author Kevin Mariano
 * @version 1.0.1
 * @since 1.0.0
 * @copyright MiauBloom
 */

'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Role = 'patient' | 'psychologist' | 'admin';

interface SimpleUser {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  onboarding_completed: boolean; 
}

type Perfil = SimpleUser | null;

interface AuthErrorResponse {
  error: string | null;
  redirectUrl?: string; 
}

interface AuthContextType {
  user: SimpleUser | null;
  perfil: Perfil;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthErrorResponse>;
  signOut: () => Promise<void>;
  refreshPerfil: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [perfil, setPerfil] = useState<Perfil>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = async (): Promise<SimpleUser | null> => {
    try {
      const res = await fetch('/api/auth/user', { cache: 'no-store' }); 
      if (res.ok) {
        const data = await res.json();
        return data.user || null;
      }
      return null;
    } catch (e) {
      console.error('Error al obtener la sesión:', e);
      return null;
    }
  };

  const refreshPerfil = async () => {
    const updatedUser = await fetchSession();
    setUser(updatedUser);
    setPerfil(updatedUser);
  };

  useEffect(() => {
    const initAuth = async () => {
      const currentUser = await fetchSession();
      setUser(currentUser);
      setPerfil(currentUser);
      setLoading(false);
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthErrorResponse> => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setUser(data.user);
        setPerfil(data.user);
        return { error: null, redirectUrl: data.redirectUrl };
      } else {
        return { error: data.error || 'Fallo de autenticación', redirectUrl: undefined };
      }

    } catch (e) {
      setLoading(false);
      return { error: 'Error de conexión', redirectUrl: undefined };
    }
  };

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setPerfil(null);
  };

  return (
    <AuthContext.Provider value={{ user, perfil, loading, signIn, signOut, refreshPerfil }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}