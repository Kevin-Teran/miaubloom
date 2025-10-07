/**
 * @file Login.tsx
 * @route src/components/auth/Login.tsx
 * @description Componente de formulario para el inicio de sesión (Pág. 7 del PDF),
 * maneja la autenticación y la redirección.
 * @author Kevin Mariano
 * @version 1.0.1
 * @since 1.0.0
 * @copyright MiauBloom
 */
import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';

// --- Constantes de Diseño ---
const PRIMARY_COLOR = '#F2C2C1'; 
const TEXT_DARK = '#070806'; 
const TEXT_LIGHT = '#B6BABE'; 

/**
 * @typedef {object} LoginProps
 * @property {() => void} onAuthSuccess - Función a ejecutar tras una autenticación exitosa.
 * @property {string} defaultRole - Rol preseleccionado para la vista.
 */

/**
 * @function Login
 * @description Renderiza el formulario de inicio de sesión.
 * @param {LoginProps} props - Propiedades del componente.
 * @returns {JSX.Element} El componente de login.
 */
const Login: React.FC<{ defaultRole: string }> = ({ defaultRole }) => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    /**
     * @function handleSubmit
     * @description Envía las credenciales a la API de login.
     * @param {FormEvent<HTMLFormElement>} e - Evento de envío del formulario.
     */
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Error de credenciales.');
            } else {
                // Autenticación exitosa
                const { sessionData } = data;
                
                // Redirigir basado en si el perfil ha sido completado
                if (sessionData.isProfileComplete) {
                    // Perfil completo, ir al Dashboard (Pág. 13/15)
                    router.push(`/dashboard/${sessionData.rol}`);
                } else {
                    // Perfil incompleto, ir a la Personalización Inicial (Pág. 8/11)
                    router.push(`/perfil-inicial/${sessionData.rol}?userId=${sessionData.userId}&name=${sessionData.nombreCompleto}`);
                }
            }
        } catch (err) {
            setError('Error de conexión. Verifica el backend.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>Hola de nuevo</h2>
            <p className="mb-8" style={{ color: TEXT_DARK }}>Accede a tu cuenta como <span className="font-semibold">{defaultRole}</span>.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    type="email" 
                    placeholder="Correo electrónico" 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-opacity-75" 
                    style={{ borderColor: TEXT_LIGHT, color: TEXT_DARK, '--tw-ring-color': PRIMARY_COLOR } as React.CSSProperties} 
                    required
                />
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-opacity-75" 
                    style={{ borderColor: TEXT_LIGHT, color: TEXT_DARK, '--tw-ring-color': PRIMARY_COLOR } as React.CSSProperties} 
                    required
                />
                
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full p-3 font-bold rounded-full text-white shadow-lg transition-colors duration-300" 
                    style={{ backgroundColor: PRIMARY_COLOR, opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? 'Cargando...' : 'Sign In'}
                </button>
            </form>

            {error && <p className="text-red-500 text-center mt-4 text-sm">{error}</p>}
            
            <div className="text-center text-sm mt-4">
                <button 
                    type="button" 
                    onClick={() => alert("Función de recuperación de contraseña (próximo paso)")} 
                    className="font-medium" 
                    style={{ color: TEXT_DARK }}
                >
                    Recuperación de contraseña
                </button>
            </div>
            
            <div className="flex items-center justify-center pt-6">
                <div className="h-px w-full" style={{ backgroundColor: TEXT_LIGHT }}></div>
                <span className="text-xs px-3" style={{ color: TEXT_LIGHT }}>O</span>
                <div className="h-px w-full" style={{ backgroundColor: TEXT_LIGHT }}></div>
            </div>

            <button className="w-full p-3 font-bold rounded-full text-white flex items-center justify-center space-x-2 border mt-4" style={{ color: TEXT_DARK, borderColor: TEXT_LIGHT }}>
                <span className="text-xl">G</span> <span>Inicia con Google (Simulación)</span>
            </button>
        </div>
    );
};

export default Login;
