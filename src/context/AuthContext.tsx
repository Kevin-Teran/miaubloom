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
import { useRouter, usePathname } from 'next/navigation';

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
  const [theme, setTheme] = useState<'pink' | 'blue'>('pink'); // Rosa por defecto
  const router = useRouter();
  const pathname = usePathname();
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;

    const checkUserSession = async () => {
      try {
        const response = await fetch('/api/auth/login'); // Este GET verifica la cookie
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.authenticated) {
            const fetchedUser: User = {
              ...data.user,
              avatarUrl: data.user.rol === 'Paciente' 
                ? "/assets/avatar-paciente.png" 
                : "/assets/avatar-psicologo.png",
              nickname: data.user.perfil?.nicknameAvatar || data.user.nombreCompleto.split(' ')[0],
            };
            setUser(fetchedUser);

            // --- LÓGICA DEL TEMA ---
            if (fetchedUser.rol === 'Paciente' && fetchedUser.perfil?.genero === 'Masculino') {
              setTheme('blue');
              document.body.classList.add('theme-blue');
            } else {
              // Para Femenino, Otro, o si no hay género, usamos el tema rosa por defecto
              setTheme('pink');
              document.body.classList.remove('theme-blue');
            }

            // Redirección basada en rol si está en página de identificación
            if (pathname === '/identificacion') {
              const redirectPath = fetchedUser.rol === 'Paciente' ? '/inicio/paciente' : '/inicio/psicologo';
              router.replace(redirectPath);
            }
          } else {
            setUser(null);
            // Redirigir a identificación si no está autenticado y está en inicio
            if (pathname?.startsWith('/inicio')) {
              router.replace('/identificacion');
            }
          }
        } else {
          setUser(null);
          // Redirigir a identificación si no está autenticado y está en inicio
          if (pathname?.startsWith('/inicio')) {
            router.replace('/identificacion');
          }
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
        setUser(null);
        if (pathname?.startsWith('/inicio')) {
          router.replace('/identificacion');
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
