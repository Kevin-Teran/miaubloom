import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/**
 * Hook para proteger rutas basadas en rol
 * Redirige automáticamente si el usuario no tiene permiso
 */
export function useRouteProtection(allowedRoles: string[]) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // Mientras está cargando, no hacer nada
    if (isLoading) return;

    // Agregar un pequeño delay para asegurar que el estado de usuario esté realmente actualizado
    const timeout = setTimeout(() => {
      setHasCheckedAuth(true);

      // Si no hay usuario después de terminar de cargar, redirigir a identificación
      if (!user) {
        router.replace('/identificacion');
        return;
      }

      // Si el rol no es permitido, redirigir a su página correspondiente
      if (!allowedRoles.includes(user.rol)) {
        const redirectPath = user.rol === 'Paciente' ? '/inicio/paciente' : '/inicio/psicologo';
        router.replace(redirectPath);
        return;
      }
    }, 150);

    return () => clearTimeout(timeout);
  }, [user, isLoading, allowedRoles, router]);

  const hasAccess = hasCheckedAuth && !!user && allowedRoles.includes(user.rol);

  return { 
    user: hasAccess ? (user!) : user, 
    isLoading: isLoading || !hasCheckedAuth, 
    hasAccess 
  };
}

