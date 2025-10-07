/**
 * @file page.tsx
 * @route src/app/(auth)/login/page.tsx
 * @description Página que renderiza el componente Login, extrayendo el rol de los parámetros de búsqueda.
 * @author Gemini
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

"use client";

import { useSearchParams } from 'next/navigation';
import Login from '@/components/auth/Login';

const LoginPage: React.FC = () => {
    const searchParams = useSearchParams();
    const role = searchParams.get('role');

    const defaultRole = role === 'Paciente' || role === 'Psicólogo' ? role : 'Paciente';

    return (
        <div className="flex items-center justify-center w-full min-h-screen p-4">
            <Login defaultRole={defaultRole} />
        </div>
    );
};

export default LoginPage;