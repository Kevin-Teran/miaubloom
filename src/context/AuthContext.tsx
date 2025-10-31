/**
 * @file AuthContext.tsx
 * @route src/context/AuthContext.tsx
 * @description Contexto global de autenticación y gestión de temas dinámicos por género
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// Definimos la estructura del usuario que manejaremos
interface User {
  id: string;
  nombreCompleto: string;
  rol: 'Paciente' | 'Psicólogo';
  perfilCompleto: boolean;
  avatarUrl?: string;
  nickname?: string;
  perfil?: {
    genero?: 'Masculino' | 'Femenino' | 'Otro';
    nicknameAvatar?: string;
    fotoPerfil?: string;
  };
}

// Definimos lo que nuestro contexto proveerá
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  theme: 'pink' | 'blue';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'pink' | 'blue'>('pink');
  const pathname = usePathname();
  const hasCheckedRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  const checkUserSession = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        cache: 'no-store',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.authenticated) {
          const fetchedUser: User = {
            ...data.user,
            avatarUrl: data.user.perfil?.fotoPerfil 
              || (data.user.rol === 'Paciente' 
                ? "/assets/avatar-paciente.png" 
                : "/assets/avatar-psicologo.png"),
            nickname: data.user.perfil?.nicknameAvatar || data.user.nombreCompleto.split(' ')[0],
          };
          
          if (lastUserIdRef.current !== data.user.id) {
            lastUserIdRef.current = data.user.id;
          }
          
          setUser(fetchedUser);
          applyTheme(fetchedUser);
        } else {
          setUser(null);
          lastUserIdRef.current = null;
        }
      } else {
        setUser(null);
        lastUserIdRef.current = null;
      }
    } catch (error) {
      console.error("[Auth] Error al verificar sesión:", error);
      setUser(null);
      lastUserIdRef.current = null;
    } finally {
      setIsLoading(false);
    }
  };

  const applyTheme = (user: User) => {
    if (pathname?.startsWith('/perfil') || pathname === '/inicio/paciente' || pathname === '/inicio/psicologo') {
      // Para pacientes, usar el género si está disponible
      if (user.rol === 'Paciente' && user.perfil?.genero === 'Masculino') {
        setTheme('blue');
        document.body.classList.add('theme-blue');
      }
      // Para psicólogos, detectar género por prefijo de título (Dr. = masculino)
      else if (user.rol === 'Psicólogo' && user.nombreCompleto.toLowerCase().startsWith('dr.')) {
        setTheme('blue');
        document.body.classList.add('theme-blue');
      } 
      else {
        setTheme('pink');
        document.body.classList.remove('theme-blue');
      }
    } else {
      setTheme('pink');
      document.body.classList.remove('theme-blue');
    }
  };

  useEffect(() => {
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;

    checkUserSession();
    
    // Verificar sesión cuando el documento se vuelve visible (usuario vuelve a la pestaña)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkUserSession();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Monitorear cambios de ruta para aplicar/remover tema
  useEffect(() => {
    if (!user) return;
    
    // Aplicar tema dinámico en rutas de perfil e inicio paciente
    if (pathname?.startsWith('/perfil') || pathname === '/inicio/paciente') {
      // Aplicar tema dinámico solo para pacientes hombres
      if (user.rol === 'Paciente' && user.perfil?.genero === 'Masculino') {
        setTheme('blue');
        document.body.classList.add('theme-blue');
      } else {
        setTheme('pink');
        document.body.classList.remove('theme-blue');
      }
    } else {
      // En otras rutas, siempre rosa
      setTheme('pink');
      document.body.classList.remove('theme-blue');
    }
  }, [pathname, user]);

  // El valor que proveemos a los componentes hijos
  const value = { user, isLoading, theme };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para consumir el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
