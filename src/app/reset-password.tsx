/**
 * @file reset-password.tsx
 * @route src/pages/reset-password.tsx
 * @description Interfaz para el restablecimiento final de la contraseña usando el token de verificación.
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */
import React, { useState, FormEvent, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const PRIMARY_COLOR = '#F2C2C1';

const RestablecerContrasena: React.FC = () => {
    const router = useRouter();
    const { token: urlToken } = router.query;
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Al cargar, aseguramos que el token esté presente en la URL
        if (!urlToken) {
            setError('Token de verificación no encontrado en la URL.');
        }
    }, [urlToken]);

    /**
     * @function handleSubmit
     * @description Envía el token y la nueva contraseña a la API.
     * @param {FormEvent<HTMLFormElement>} e - Evento de envío.
     */
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: urlToken, newPassword: password }),
            });

            const data = await response.json();

            if (!response.ok) {
                 setError(data.message || 'Error al restablecer la contraseña. El token pudo haber expirado.');
            } else {
                 setMessage(data.message + " Redirigiendo a Login...");
                 setTimeout(() => router.push('/login'), 3000);
            }
        } catch (err) {
            setError('Error de conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4" style={{ fontFamily: 'Roboto' }}>
            <Head><title>Restablecer | MiauBloom</title></Head>
            <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold mb-4" style={{ color: PRIMARY_COLOR }}>Nueva Contraseña</h2>
                <p className="mb-6 text-gray-600">
                    Ingresa y confirma tu nueva contraseña.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="password" 
                        placeholder="Nueva Contraseña (mín. 8 caracteres)" 
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border rounded-xl" 
                        required
                        minLength={8}
                    />
                    <input 
                        type="password" 
                        placeholder="Confirmar Nueva Contraseña" 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 border rounded-xl" 
                        required
                    />
                    
                    <button 
                        type="submit" 
                        disabled={loading || !urlToken}
                        className="w-full p-3 font-bold rounded-full text-white transition-colors" 
                        style={{ backgroundColor: PRIMARY_COLOR }}
                    >
                        {loading ? 'Actualizando...' : 'Restablecer Contraseña'}
                    </button>
                </form>
                
                {message && <p className="text-green-500 text-center mt-4 text-sm">{message}</p>}
                {error && <p className="text-red-500 text-center mt-4 text-sm">{error}</p>}
                {!urlToken && <p className="text-red-500 text-center mt-4 text-sm">Error: Token no encontrado.</p>}
            </div>
        </div>
    );
};

export default RestablecerContrasena;