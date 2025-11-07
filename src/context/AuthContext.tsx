/**
 * @file AuthContext.tsx
 * @route src/context/AuthContext.tsx
 * @description Contexto global de autenticación. AHORA USA COOKIES (SIN LOCALSTORAGE).
 * @author Kevin Mariano
 * @version 2.0.0 (CORREGIDO)
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
  refetchUser: () => Promise<void>;
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
    
    // Rutas donde el tema dinámico se aplica
    const dynamicThemeRoutes = ['/perfil', '/inicio/paciente', '/inicio/psicologo', '/ajustes', '/acciones'];
    
    if (dynamicThemeRoutes.some(route => pathname?.startsWith(route))) {
      if (userToTheme.perfil?.genero === 'Masculino') {
        setTheme('blue');
        document.body.classList.add('theme-blue');
      } else {
        setTheme('pink');
        document.body.classList.remove('theme-blue');
      }
    } else {
      // Rutas públicas o de autenticación siempre usan el tema rosa por defecto
      setTheme('pink');
      document.body.classList.remove('theme-blue');
    }
  }, [pathname]);

  // --- CORRECCIÓN CRÍTICA: checkUserSession ---
  // Esta función ahora depende de la cookie httpOnly, no de localStorage.
  const checkUserSession = useCallback(async () => {
    // No necesitamos leer localStorage. El navegador enviará la cookie.
    
    console.log('[AuthContext] Verificando sesión con API (cookie)...');

    try {
      // El fetch AHORA NO LLEVA HEADERS. La cookie se envía automáticamente.
      const response = await fetch('/api/auth/user', { 
        method: 'GET',
        credentials: 'include', // Asegura que las cookies se envíen
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
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
          console.log('[AuthContext] Sesión verificada, usuario seteado.');
        } else {
          // La API devolvió success: false (ej. token inválido)
          setUser(null);
          applyTheme(null);
          console.log('[AuthContext] Sesión no válida (API).');
        }
      } else {
        // El fetch falló (ej. 401, 500)
        setUser(null);
        applyTheme(null);
        console.log('[AuthContext] Sesión no válida (Fetch).');
      }
    } catch (error) {
      console.error("[Auth] Error al verificar sesión:", error);
      setUser(null);
      applyTheme(null);
    } finally {
      setIsLoading(false);
    }
  }, [applyTheme]);
  // --- FIN DE CORRECCIÓN ---

  // Ejecutar verificación al montar (SOLO UNA VEZ)
  useEffect(() => {
    const timer = setTimeout(() => {
      checkUserSession();
    }, 100);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-aplicar tema cuando cambia pathname o user
  useEffect(() => {
    applyTheme(user);
  }, [pathname, user, applyTheme]);

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
