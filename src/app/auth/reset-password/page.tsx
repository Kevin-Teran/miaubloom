/**
 * @file page.tsx
 * @route src/app/auth/reset-password/page.tsx
 * @description Página para ingresar y confirmar la nueva contraseña.
 * @author Kevin Mariano
 * @version 1.0.2
 * @since 1.0.0
 * @copyright MiauBloom
 */

"use client";

export const dynamic = 'force-dynamic';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, Suspense } from 'react';
import Input from '@/components/ui/Input';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import { EllipseCorner } from '@/components/EllipseCorner';
import IconButton from '@/components/ui/IconButton'; 

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token'); 

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setError('Token inválido o faltante. Solicita un nuevo enlace.');
            setTimeout(() => router.push('/auth/forgot-password'), 5000);
        }
    }, [token, router]);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setError('');
        setSuccessMessage('');
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        setError('');
        setSuccessMessage('');
    };

    const validateForm = (): boolean => {
        if (!password || !confirmPassword) {
            setError('Debes ingresar y confirmar la nueva contraseña.');
            return false;
        }
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!token) {
            setError('Token inválido o faltante.');
            return;
        }

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: token, 
                    newPassword: password, 
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Error al restablecer la contraseña.');
            }

            console.log('Password reset successful:', data.message);
            setSuccessMessage('¡Tu contraseña ha sido actualizada con éxito!');
            setPassword(''); 
            setConfirmPassword('');

            setTimeout(() => {
                router.push('/identificacion'); 
            }, 3000);

        } catch (err) {
            console.error('Error restableciendo contraseña:', err);
            setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
        } finally {
            setIsLoading(false);
        }
    };

    const themeColor = 'var(--color-theme-primary)';

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 p-6 relative select-none">
            {/* FRANJA ROSA DECORATIVA */}
            <EllipseCorner />

            {/* --- BOTÓN VOLVER ESTANDARIZADO --- */}
            <IconButton
                icon="back"
                onClick={() => router.back()}
                bgColor={themeColor}
                className="absolute top-8 left-6 z-10"
                aria-label="Volver"
            />
            {/* --- FIN BOTÓN VOLVER --- */}

            <main className="flex-grow flex flex-col items-center justify-center pt-12">
                <div className="w-full max-w-sm">
                    {/* Título y Descripción */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ color: themeColor }}>
                            Restablecer Contraseña
                        </h1>
                        <p className="text-gray-600 px-4">
                            Ingresa tu nueva contraseña a continuación.
                        </p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Mensaje de Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
                                <span>{error}</span>
                            </div>
                        )}
                        {/* Mensaje de Éxito */}
                        {successMessage && !error && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm text-center">
                                <span>{successMessage}</span>
                            </div>
                        )}

                        {/* Input Nueva Contraseña (solo si hay token y no hay mensaje de éxito) */}
                        {token && !successMessage && (
                            <>
                                <Input
                                    label="Nueva Contraseña"
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                    showPasswordToggle={true}
                                    className={`bg-white border-gray-300 rounded-full text-gray-900 placeholder-gray-400 focus:border-[${themeColor}] focus:ring-1 focus:ring-[${themeColor}] px-5 py-3`}
                                    labelClassName="text-gray-900 font-semibold mb-1 ml-3"
                                />

                                {/* Input Confirmar Contraseña */}
                                <Input
                                    label="Confirmar Nueva Contraseña"
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                    showPasswordToggle={true}
                                    className={`bg-white border-gray-300 rounded-full text-gray-900 placeholder-gray-400 focus:border-[${themeColor}] focus:ring-1 focus:ring-[${themeColor}] px-5 py-3`}
                                    labelClassName="text-gray-900 font-semibold mb-1 ml-3"
                                />

                                {/* Botón Actualizar */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    style={{ backgroundColor: isLoading ? '#cccccc' : themeColor }}
                                    className={`w-full text-white py-2 rounded-full font-bold text-lg shadow-md hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 select-none ${!isLoading ? 'cursor-pointer' : ''}`}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Actualizando...
                                        </>
                                    ) : (
                                        'Actualizar Contraseña'
                                    )}
                                </button>
                            </>
                        )}
                    </form>
                </div>
            </main>
            <footer className="h-8"></footer>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <LoadingIndicator text="Cargando tu experiencia..." />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}