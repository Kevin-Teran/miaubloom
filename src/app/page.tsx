/**
 * @file page.tsx
 * @route app/page.tsx
 * @description Página principal de selección de rol
 * @author Kevin Mariano
 * @version 3.1.3
 * @since 1.0.0
 * @copyright MiauBloom
 */

'use client';

import { useEffect, useState } from 'react'; 
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import RoleSelection from '@/components/onboarding/role-selection';
import { Role } from '@prisma/client';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'patient' | 'psychologist' | 'admin' | 'none'>('none');
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Mostrar splash por 3 segundos
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    if (loading || showSplash) return;

    if (user) {
      const userRole = user.role.toLowerCase();
      const redirectPath = user.onboarding_completed 
        ? `/dashboard/${userRole}` 
        : `/onboarding/complete`; 

      router.replace(redirectPath);
      return;
    }

    const savedRole = localStorage.getItem('miaubloom_role_selection') as Role | null;
    if (savedRole && (savedRole === 'patient' || savedRole === 'psychologist' || savedRole === 'admin')) {
      setSelectedRole(savedRole);
    }
  }, [user, loading, router, showSplash]);

  const handleRoleSelect = (role: Role) => {
    localStorage.setItem('miaubloom_role_selection', role);
    router.push('/auth/login');
  };

  if (loading || user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-xl font-bold text-primary">
          Cargando MiauBloom...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-background p-4">
      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-md">
        <h1 className="text-4xl font-extrabold mb-4 text-primary">MiauBloom</h1>
        <p className="text-xl text-foreground mb-12">Crece y siente. ¿Cuál eres tú?</p>
        
        <RoleSelection 
          onSelect={handleRoleSelect} 
          initialSelection={selectedRole as 'patient' | 'psychologist'} 
        />
      </div>
      
      <footer className="w-full text-center py-4 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} SENA - Todos los derechos reservados</p>
        <p>Desarrollado por Kevin Mariano</p>
      </footer>
    </div>
  );
}