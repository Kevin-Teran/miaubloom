/**
 * @file page.tsx
 * @route src/app/(auth)/login/page.tsx
 * @description 
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import Login from '@/components/auth/Login';

interface LoginPageProps {
    searchParams: {
        role?: 'Paciente' | 'Psicólogo';
    };
}

/**
 * @file page.tsx
 * @route src/app/(auth)/login/page.tsx
 * @description Página de inicio de sesión. Obtiene el rol del usuario de los
 * parámetros de búsqueda (e.g., /login?role=Paciente).
 */
export default function LoginPage({ searchParams }: LoginPageProps) {
    const validRoles: ('Paciente' | 'Psicólogo')[] = ['Paciente', 'Psicólogo'];
    const role = searchParams.role && validRoles.includes(searchParams.role) 
                 ? searchParams.role 
                 : 'Paciente';

    return (
        <Login defaultRole={role} />
    );
}
