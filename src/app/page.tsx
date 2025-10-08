/**
 * @file page.tsx
 * @route app/page.tsx
 * @description Página principal de selección de rol.
 * Si el usuario está logueado, redirige al dashboard/onboarding.
 * Si no está logueado, permite seleccionar el rol y redirige al login.
 * @author Kevin Mariano
 * @version 3.1.2
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
  const { user, perfil, loading } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'patient' | 'psychologist' | 'admin' | 'none'>('none');

  useEffect(() => {
    if (loading) return;

    if (user) {
      // Usuario logueado: Redirigir según el estado de onboarding
      const userRole = user.role.toLowerCase();
      const redirectPath = user.onboarding_completed 
        ? `/dashboard/${userRole}` 
        : `/onboarding/complete`; 

      router.replace(redirectPath);
      return;
    }

    // Usuario NO logueado: Cargar la selección previa de localStorage
    const savedRole = localStorage.getItem('miaubloom_role_selection') as Role | null;
    if (savedRole && (savedRole === 'patient' || savedRole === 'psychologist' || savedRole === 'admin')) {
      setSelectedRole(savedRole);
    }
  }, [user, loading, router]);

  const handleRoleSelect = (role: Role) => {
    // 1. Guardar la preferencia en localStorage
    localStorage.setItem('miaubloom_role_selection', role);
    
    // 2. Redirigir siempre al Login
    router.push('/auth/login');
  };

  if (loading || user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-xl font-bold text-primary">Cargando MiauBloom...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-background p-4">
      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-md">
        <h1 className="text-4xl font-extrabold mb-4 text-primary">MiauBloom</h1>
        <p className="text-xl text-foreground mb-12">Crece y siente. ¿Cuál eres tú?</p>
        
        {/* Componente de selección de rol */}
        <RoleSelection 
          onSelect={handleRoleSelect} 
          initialSelection={selectedRole as 'patient' | 'psychologist'} 
        />
        
      </div>
      
      {/* Footer con información de derechos de autor */}
      <footer className="w-full text-center py-4 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} SENA - Todos los derechos reservados</p>
        <p>Desarrollado por Kevin Mariano</p>
      </footer>
    </div>
  );
}