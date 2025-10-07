
/**
 * @file recuperar.tsx
 * @route src/pages/recuperar.tsx
 * @description Interfaz de usuario para la solicitud de recuperación de contraseña (Pág. 7 del PDF).
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */
import React, { useState, FormEvent } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const PRIMARY_COLOR = '#F2C2C1';
const TEXT_DARK = '#070806';

const RecuperarContrasena: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    /**
     * @function handleSubmit
     * @description Envía el correo a la API para generar el token.
     * @param {FormEvent<HTMLFormElement>} e - Evento de envío.
     */
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await fetch('/api/auth/request-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok && response.status !== 200) {
                 // Manejo de errores que no son 200/OK
                 setError(data.message || 'Error al procesar la solicitud.');
            } else {
                 // La API siempre devuelve 200 si el usuario existe o no, por seguridad
                 setMessage(data.message);
            }
        } catch (err) {
            setError('Error de conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4" style={{ fontFamily: 'Roboto' }}>
            <Head><title>Recuperación | MiauBloom</title></Head>
            <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold mb-4" style={{ color: PRIMARY_COLOR }}>Recuperación de contraseña</h2>
                <p className="mb-6 text-gray-600">
                    Ingrese su dirección de correo electrónico para recibir un código de verificación.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border rounded-xl" 
                        required
                    />
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full p-3 font-bold rounded-full text-white transition-colors" 
                        style={{ backgroundColor: PRIMARY_COLOR }}
                    >
                        {loading ? 'Enviando...' : 'Continuar'}
                    </button>
                </form>
                
                {message && <p className="text-green-500 text-center mt-4 text-sm">{message}</p>}
                {error && <p className="text-red-500 text-center mt-4 text-sm">{error}</p>}

                <button onClick={() => router.push('/login')} className="w-full text-center mt-4 text-sm font-medium" style={{ color: TEXT_DARK }}>
                    Volver al Inicio de Sesión
                </button>
            </div>
        </div>
    );
};

export default RecuperarContrasena;