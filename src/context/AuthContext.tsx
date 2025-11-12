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
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkModeState] = useState(false);
  const [theme, setTheme] = useState<'pink' | 'blue'>('pink');
  const pathname = usePathname();

  // Aplicar tema basado en usuario
  // Función para cambiar el modo oscuro
  const setDarkMode = useCallback((value: boolean) => {
    console.log('[AuthContext] Cambiando dark mode a:', value);
    // Actualizar localStorage primero
    localStorage.setItem('darkMode', JSON.stringify(value));
    // Aplicar clases al DOM
    if (value) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    // Actualizar el estado DESPUÉS (para forzar re-render)
    setDarkModeState(value);
  }, []);

  // Cargar dark mode desde localStorage al inicio
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    console.log('[AuthContext] Dark mode cargado desde localStorage (raw):', savedDarkMode, 'type:', typeof savedDarkMode);
    if (savedDarkMode !== null) {
      try {
        const isDark = JSON.parse(savedDarkMode);
        console.log('[AuthContext] Dark mode parseado:', isDark);
        setDarkModeState(isDark); // Usar setDarkModeState directamente para evitar loop
        // Aplicar las clases también
        if (isDark) {
          document.documentElement.classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.style.colorScheme = 'light';
        }
      } catch (e) {
        console.error('[AuthContext] Error parsing darkMode:', e);
        // Si falla el parse, intentar comparación de string
        const isDark = savedDarkMode === 'true';
        setDarkModeState(isDark);
      }
    }
  }, []);

  const applyTheme = useCallback((userToTheme: User | null) => {
    if (!userToTheme) {
      setTheme('pink');
      document.body.classList.remove('theme-blue');
      return;
    }
    
    // Rutas donde el tema dinámico se aplica
    const dynamicThemeRoutes = ['/perfil', '/inicio/paciente', '/inicio/psicologo', '/ajustes', '/acciones', '/chat'];
    
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
    try {
      console.log('[AuthContext] Iniciando verificación de sesión...');
      
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
      
      console.log('[AuthContext] Respuesta recibida:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('[AuthContext] Datos recibidos:', { success: data.success, authenticated: data.authenticated, hasUser: !!data.user });
        
        if (data.success && data.authenticated) {
          const fetchedUser: User = {
            ...data.user,
            avatarUrl: data.user.perfil?.fotoPerfil 
              || (data.user.rol === 'Paciente' 
                ? "/assets/avatar-paciente.png" 
                : "/assets/avatar-psicologo.png"),
            nickname: data.user.perfil?.nicknameAvatar || data.user.nombreCompleto.split(' ')[0],
          };
          console.log('[AuthContext] Usuario autenticado:', fetchedUser.nombreCompleto);
          setUser(fetchedUser);
          applyTheme(fetchedUser);
        } else {
          // La API devolvió success: false (ej. token inválido)
          console.log('[AuthContext] Sin autenticación válida');
          setUser(null);
          applyTheme(null);
        }
      } else {
        // El fetch falló (ej. 401, 500)
        console.log('[AuthContext] Error en respuesta:', response.status);
        setUser(null);
        applyTheme(null);
      }
    } catch (error) {
      console.error('[AuthContext] Error al verificar sesión:', error);
      setUser(null);
      applyTheme(null);
    } finally {
      console.log('[AuthContext] Finalizando loading...');
      setIsLoading(false);
    }
  }, [applyTheme]);
  // --- FIN DE CORRECCIÓN ---

  // Ejecutar verificación al montar (INMEDIATAMENTE)
  useEffect(() => {
      checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-aplicar tema cuando cambia pathname o user
  useEffect(() => {
    applyTheme(user);
  }, [pathname, user, applyTheme]);

  // Observer para cambios en darkMode y asegurar que se aplique correctamente
  useEffect(() => {
    console.log('[AuthContext] darkMode cambió a:', darkMode);
    // Forzar un pequeño delay para asegurar que Tailwind detecte el cambio
    const timer = setTimeout(() => {
      document.documentElement.setAttribute('data-dark-mode', String(darkMode));
    }, 0);
    return () => clearTimeout(timer);
  }, [darkMode]);

  // Proveer contexto
  const value = { user, isLoading, theme, darkMode, setDarkMode, refetchUser: checkUserSession };

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
