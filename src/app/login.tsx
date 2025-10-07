/**
 * @file login.tsx
 * @route src/pages/login.tsx
 * @description Página de inicio de sesión genérica. Determina el rol a partir de la URL.
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */
import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Login from '../components/auth/Login';

const PRIMARY_COLOR = '#F2C2C1';

/**
 * @function LoginPage
 * @description Maneja la renderización del formulario de Login.
 * @returns {JSX.Element} El componente de la página de Login.
 */
const LoginPage: React.FC = () => {
    const router = useRouter();
    // En este flujo, asumimos que el rol se selecciona en la página principal (index.tsx)
    // y la URL se navega a /login, pero para el desarrollo la incluimos directamente.
    
    // NOTA: Para este ejemplo, solo usamos el componente Login sin lógica de rol dinámica en la URL.
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4" style={{ backgroundColor: 'white' }}>
            <Head>
                <title>Acceso | MiauBloom</title>
                <meta name="theme-color" content={PRIMARY_COLOR} />
            </Head>
            <div className="w-full max-w-md">
                 {/* El componente Login maneja la presentación de las credenciales */}
                <Login defaultRole="Usuario" /> 
            </div>
        </div>
    );
};

export default LoginPage;