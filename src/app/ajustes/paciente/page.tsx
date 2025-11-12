// src/app/ajustes/paciente/page.tsx
"use client";

export const dynamic = 'force-dynamic';

/**
 * @file page.tsx
 * @route src/app/ajustes/paciente/page.tsx
 * @description Página de Ajustes y Configuraciones para el Paciente. Funcionalidad básica conectada.
 * @author Kevin Mariano
 * @version 1.1.2 // Versión actualizada
 * @since 1.0.0
 * @copyright MiauBloom
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// import Link from 'next/link'; // <<<--- ELIMINADO (No se usa directamente)
import Image from 'next/image';
import LoadingIndicator from '@/components/ui/LoadingIndicator'; //
// Importar desde el archivo de componentes compartidos
import { SettingsItemLink, AccountSettingsItemLink, ToggleItem } from '../SettingsComponents'; //
import { useAuth } from '@/context/AuthContext';


export default function AjustesPacientePage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [showAppSettings, setShowAppSettings] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Función para cerrar sesión
    const handleSignOut = async () => {
        console.log("Cerrando sesión...");
        try {
            const response = await fetch('/api/auth/logout', { 
                method: 'POST',
                credentials: 'include'
            });
            if (response.ok) {
                // Limpiar localStorage si la aplicación lo usa
                if (typeof window !== 'undefined') {
                    localStorage.clear();
                    sessionStorage.clear();
                }
                // Redirigir y recargar para asegurar que se limpie el contexto
                router.push('/identificacion');
                // Pequeño delay para permitir que la redirección se procese
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            }
        } catch (error) {
            console.error("Error de red al cerrar sesión:", error);
            router.push('/identificacion');
        }
    };

    // Función para eliminar cuenta con confirmación
    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'ELIMINAR') {
            alert('Por favor escribe "ELIMINAR" para confirmar');
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch('/api/usuario/eliminar', {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('Tu cuenta ha sido eliminada exitosamente');
                // Limpiar todo y redirigir
                if (typeof window !== 'undefined') {
                    localStorage.clear();
                    sessionStorage.clear();
                }
                router.push('/identificacion');
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            } else {
                const data = await response.json();
                alert(data.error || 'Error al eliminar la cuenta');
            }
        } catch (error) {
            console.error('Error al eliminar cuenta:', error);
            alert('Error de conexión al eliminar la cuenta');
        } finally {
            setIsDeleting(false);
        }
    };
    // Muestra indicador mientras carga o sin acceso
    if (isLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <LoadingIndicator text="Cargando ajustes..." className="[&>p]:text-gray-600 [&>div]:opacity-50 [&>div]:bg-[var(--color-theme-primary-light)] [&>div>div]:bg-[var(--color-theme-primary)]" /> {/* */}
            </div>
        );
    }

    const themeColor = 'var(--color-theme-primary)'; //

    // --- JSX ---

    return (
        <div className="min-h-screen bg-gray-100">

            {/* ----- VISTA PRINCIPAL (ROSA) ----- */}
            <div className={`md:fixed md:top-0 md:left-0 md:w-72 md:h-screen min-h-screen p-6 ${showAppSettings ? 'hidden md:block' : 'block'} select-none md:shadow-lg md:z-40 transition-all duration-300`} style={{ backgroundColor: themeColor }}>

                {/* Botón de volver - Solo en desktop */}
                <button onClick={() => router.back()} className="hidden md:flex items-center gap-2 mb-6 text-white hover:opacity-75 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm font-medium">Volver</span>
                </button>

                {/* Perfil */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white pointer-events-none">
                        <Image src={user!.avatarUrl || "/assets/avatar-paciente.png"} alt="Avatar" fill className="object-cover"/> {/* */}
                    </div>
                    <div>
                        <p className="text-sm text-white/80">Hola</p>
                        <h1 className="text-xl font-semibold text-white">{user!.nombreCompleto}</h1>
                    </div>
                </div>

                {/* Lista de Opciones */}
                <nav className="space-y-1 text-sm">
                    <SettingsItemLink href="/perfil/paciente">Mi perfil</SettingsItemLink>
                    <SettingsItemLink href="/inicio/paciente/jardin">Mi jardín</SettingsItemLink>
                    <SettingsItemLink href="/notificaciones/paciente">Notificaciones</SettingsItemLink>
                    <hr className="border-white/20 my-3"/>
                    <SettingsItemLink href="/ayuda">Centro de ayuda</SettingsItemLink>
                    <SettingsItemLink href="/privacidad">Privacidad y política</SettingsItemLink>
                     <hr className="border-white/20 my-3"/>
                    {/* Botón Cerrar sesión llama a handleSignOut */}
                    <button onClick={handleSignOut} className="w-full flex items-center justify-between py-5 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors font-medium font-roboto md:font-bold md:text-base md:mb-2">
                        <span>Cerrar sesión</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </nav>
            </div>

            {/* ----- VISTA PRINCIPAL (BLANCA - Ajustes) ----- */}
            <div className="min-h-screen bg-white p-6 select-none md:ml-72 md:min-h-screen">
                {/* Encabezado */}
                <div className="flex items-center mb-6 relative h-10">
                    <h1 className="text-lg font-semibold text-gray-800 text-center flex-grow">Cuenta y ajustes</h1>
                </div>
                {/* Sección Ajustes */}
                <section className="mb-8 max-w-2xl mx-auto">
                     <h2 className="text-xs uppercase text-gray-500 font-semibold px-4 mb-2 tracking-wide">Ajustes</h2>
                    <div className="bg-gray-50/70 rounded-lg divide-y divide-gray-200 border border-gray-200">
                        <AccountSettingsItemLink href="/ajustes/paciente/notificaciones">Notificaciones</AccountSettingsItemLink>
                        <AccountSettingsItemLink href="#">Configuración de horario</AccountSettingsItemLink>
                        <button 
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full text-left py-3 px-4 text-red-600 hover:bg-gray-100 transition-colors rounded-b-lg text-sm font-medium"
                        >
                            Eliminar cuenta
                        </button>
                    </div>
                </section>
                {/* Sección Configuración de la aplicación */}
                 <section className="max-w-2xl mx-auto">
                     <h2 className="text-xs uppercase text-gray-500 font-semibold px-4 mb-2 tracking-wide">Configuración de la aplicación</h2>
                    <div className="bg-gray-50/70 rounded-lg divide-y divide-gray-200 border border-gray-200">
                        <ToggleItem label="Activar notificaciones" initialValue={true}/>
                        <ToggleItem label="Servicio de ubicación" />
                        <ToggleItem label="Modo oscuro" />
                    </div>
                </section>
            </div>

            {/* Modal de confirmación para eliminar cuenta */}
            {showDeleteModal && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99998]"
                        onClick={() => !isDeleting && setShowDeleteModal(false)}
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-[99999] p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                            {/* Icono de advertencia */}
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Título y descripción */}
                            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                                ¿Eliminar cuenta?
                            </h2>
                            <p className="text-gray-600 text-center mb-6">
                                Esta acción es <strong>permanente e irreversible</strong>. Se eliminarán todos tus datos, incluyendo tu jardín emocional, tareas y registros.
                            </p>

                            {/* Campo de confirmación */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Para confirmar, escribe <span className="text-red-600 font-bold">ELIMINAR</span>
                                </label>
                                <input
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    placeholder="Escribe ELIMINAR"
                                    disabled={isDeleting}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors text-center font-semibold disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* Botones */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeleteConfirmText('');
                                    }}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirmText !== 'ELIMINAR' || isDeleting}
                                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Eliminando...
                                        </>
                                    ) : (
                                        'Eliminar cuenta'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}