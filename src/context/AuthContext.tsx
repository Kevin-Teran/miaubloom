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

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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

  // Aplicar tema basado en usuario
  const applyTheme = useCallback((userToTheme: User | null) => {
    if (!userToTheme) {
      setTheme('pink');
      document.body.classList.remove('theme-blue');
      return;
    }
    const dynamicThemeRoutes = ['/perfil', '/inicio/paciente', '/inicio/psicologo'];
    if (dynamicThemeRoutes.some(route => pathname?.startsWith(route))) {
      if (userToTheme.perfil?.genero === 'Masculino') {
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

  // Verificar sesión
  const checkUserSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/user', { 
        cache: 'no-store',
        credentials: 'include'
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
          setUser(fetchedUser);
          applyTheme(fetchedUser);
        } else {
          setUser(null);
          applyTheme(null);
        }
      } else {
        setUser(null);
        applyTheme(null);
      }
    } catch (error) {
      console.error("[Auth] Error al verificar sesión:", error);
      setUser(null);
      applyTheme(null);
    } finally {
      setIsLoading(false);
    }
  }, [applyTheme]);

  // Ejecutar verificación al montar
  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  // Re-aplicar tema cuando cambia pathname o user
  useEffect(() => {
    applyTheme(user);
  }, [pathname, user, applyTheme]);

  // Cuando el usuario es null, intentar re-verificar (para el caso de logout)
  useEffect(() => {
    // Si user es null y no es la primera carga, vuelve a intentar verificar
    if (user === null && isLoading === false) {
      // Reset para permitir re-verificación
      checkUserSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]);

  // Proveer contexto
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
