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

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
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
    // Campos adicionales para Paciente
    horarioUso?: string;
    duracionUso?: string;
    // Campos adicionales para Psicólogo
    especialidad?: string;
    tituloUniversitario?: string;
    numeroRegistro?: string;
  };
}

// Definimos lo que nuestro contexto proveerá
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  theme: 'pink' | 'blue';
  refetchUser: () => Promise<void>; // <-- AÑADIDO
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'pink' | 'blue'>('pink');
  const pathname = usePathname();
  const hasCheckedRef = useRef(false);
  const isCheckingRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  // 1. Mover applyTheme aquí arriba y hacer que maneje 'null'
  const applyTheme = useCallback((user: User | null) => {
    if (!user) {
      setTheme('pink');
      document.body.classList.remove('theme-blue');
      return;
    }
    const dynamicThemeRoutes = ['/perfil', '/inicio/paciente', '/inicio/psicologo'];
    if (dynamicThemeRoutes.some(route => pathname?.startsWith(route))) {
      if (user.perfil?.genero === 'Masculino') {
        setTheme('blue');
        document.body.classList.add('theme-blue');
      } else {
        setTheme('pink');
        document.body.classList.remove('theme-blue');
      }
    } else {
      setTheme('pink');
      document.body.classList.remove('theme-blue');
    }
  }, [pathname]);

  // 2. Envolver checkUserSession en useCallback - MEJORADO PARA EVITAR DOBLE LLAMADA
  const checkUserSession = useCallback(async (force: boolean = false) => {
    // Evitar llamadas concurrentes
    if (isCheckingRef.current && !force) return;
    if (hasCheckedRef.current && !force) return;
    
    isCheckingRef.current = true;
    hasCheckedRef.current = true;
    
    try {
      // Pequeño delay para asegurar que la cookie está establecida
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const response = await fetch('/api/auth/login', { cache: 'no-store' });
      
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
          applyTheme(null);
          lastUserIdRef.current = null;
        }
      } else {
        setUser(null);
        applyTheme(null);
        lastUserIdRef.current = null;
      }
    } catch (error) {
      console.error("[Auth] Error al verificar sesión:", error);
      setUser(null);
      applyTheme(null);
      lastUserIdRef.current = null;
    } finally {
      setIsLoading(false);
      isCheckingRef.current = false;
    }
  }, [applyTheme]);

  useEffect(() => {
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;
    checkUserSession();
    
    // Timeout de seguridad: si checkUserSession no completa en 5 segundos, establecer isLoading a false
    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Permitir re-check cuando vuelve a focus
        hasCheckedRef.current = false;
        isCheckingRef.current = false;
        checkUserSession(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearTimeout(safetyTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkUserSession]);

  useEffect(() => {
    applyTheme(user);
  }, [pathname, user, applyTheme]);

  // 3. Proveer la función 'refetchUser'
  const value = { user, isLoading, theme, refetchUser: checkUserSession };

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
