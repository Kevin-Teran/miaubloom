/**
 * @file Login.tsx
 * @route src/components/auth/Login.tsx
 * @description Componente de formulario para el inicio de sesión (Pág. 7 del PDF),
 * refactorizado para usar componentes modulares y clases de Tailwind.
 * @author Kevin Mariano | Refactor: Gemini
 * @version 1.0.3
 * @since 1.0.0
 * @copyright MiauBloom
 */

"use client"; 

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; 
import Input from '../../components/ui/Input'; 
import Button from '../../components/ui/Button'; 
import Link from 'next/link';


/**
 * @function Login
 * @description Renderiza el formulario de inicio de sesión.
 * @returns {JSX.Element} El componente de login.
 */
const Login: React.FC<{ defaultRole: string }> = ({ defaultRole }) => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            
            const sessionData = {
                rol: defaultRole.toLowerCase(),
                isProfileComplete: false, 
                userId: 'user-123',
                nombreCompleto: 'Alisson Becker'
            };

            if (email.includes('test')) {
                 router.push(`/perfil-inicial/${sessionData.rol}?userId=${sessionData.userId}&name=${sessionData.nombreCompleto}`);
            } else {
                setError('Error de credenciales (prueba con un email que contenga "test").');
            }

        } catch (err) {
            setError('Error de conexión. Verifica el backend.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl text-text-dark">
            
            <h2 className="text-4xl font-extrabold mb-2 text-primary">Hola de nuevo</h2>
            
            <p className="mb-8 text-body-1 text-text-dark">
                Bienvenido de nuevo, te hemos extrañado como <span className="font-semibold">{defaultRole}</span>.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input 
                    type="email" 
                    placeholder="Correo electrónico" 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                
                <Input 
                    type="password" 
                    placeholder="Contraseña" 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                
                <Button 
                    type="submit" 
                    disabled={loading}
                >
                    {loading ? 'Cargando...' : 'Sign In'}
                </Button>
            </form>

            {error && <p className="text-red-500 text-center mt-4 text-body-2">{error}</p>}
            
            <div className="text-center mt-4 text-body-2">
                <Link href="/recover-password" className="font-medium hover:underline text-text-dark">
                    Recuperación de contraseña
                </Link>
            </div>
            
            <div className="flex items-center justify-center pt-6">
                <div className="h-px w-full bg-text-light"></div>
                <span className="text-xs px-3 text-text-light">O</span>
                <div className="h-px w-full bg-text-light"></div>
            </div>

            <Button 
                variant="secondary"
                type="button"
                className="mt-4 flex items-center justify-center space-x-2 border" 
                onClick={() => alert('Integración con Google (Simulación)')}
            >
                <span className="text-xl">G</span> <span>Inicia con Google (Simulación)</span>
            </Button>
        </div>
    );
};

export default Login;