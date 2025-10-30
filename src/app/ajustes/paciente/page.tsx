// src/app/ajustes/paciente/page.tsx
"use client";

/**
 * @file page.tsx
 * @route src/app/ajustes/paciente/page.tsx
 * @description Página de Ajustes y Configuraciones para el Paciente. Funcionalidad básica conectada.
 * @author Kevin Mariano
 * @version 1.1.2 // Versión actualizada
 * @since 1.0.0
 * @copyright MiauBloom
 */

import React, { useEffect, useState } from 'react';
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

    // Protección de ruta
    useEffect(() => {
        if (!isLoading && (!user || user.rol !== 'Paciente')) { //
             console.log("Ajustes Paciente: Acceso no autorizado o usuario no cargado, redirigiendo...");
             router.replace('/identificacion'); //
        }
    }, [user, isLoading, router]);

    // Función para cerrar sesión
    const handleSignOut = async () => {
        console.log("Cerrando sesión...");
        try {
            const response = await fetch('/api/auth/logout', { method: 'POST' }); //
            if (!response.ok) {
                console.error("Error al cerrar sesión desde la API:", await response.text());
            } else {
                 console.log("Logout API call successful");
            }
        } catch (error) {
            console.error("Error de red al cerrar sesión:", error);
        } finally {
            router.push('/identificacion'); //
        }
    };

    // Muestra indicador mientras carga
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
                        <Image src={user.avatarUrl || "/assets/avatar-paciente.png"} alt="Avatar" fill className="object-cover"/> {/* */}
                    </div>
                    <div>
                        <p className="text-sm text-white/80">Hola</p>
                        <h1 className="text-xl font-semibold text-white">{user.nombreCompleto}</h1>
                    </div>
                </div>

                {/* Lista de Opciones */}
                <nav className="space-y-1 text-sm">
                    <SettingsItemLink href="/perfil/paciente">Mi perfil</SettingsItemLink>
                    <SettingsItemLink href="/inicio/paciente/tareas">Mis tareas</SettingsItemLink>
                    <SettingsItemLink href="/inicio/paciente/jardin">Mi jardín</SettingsItemLink>
                    <SettingsItemLink href="/inicio/paciente/citas">Citas pendientes</SettingsItemLink>
                    <SettingsItemLink href="/notificaciones/paciente">Notificaciones</SettingsItemLink>
                    <hr className="border-white/20 my-3"/>
                    {/* Botón para cambiar a vista de Ajustes App */}
                    <button onClick={() => setShowAppSettings(true)} className="flex items-center justify-between py-5 px-4 rounded-lg hover:bg-white/10 transition-colors w-full text-left group md:mb-2 font-roboto md:font-bold">
                        <span className="text-white text-sm md:text-base md:font-bold">Configuraciones</span>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/50 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                             <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                         </svg>
                    </button>
                    <SettingsItemLink href="/ayuda">Help Center</SettingsItemLink>
                    <SettingsItemLink href="/privacidad">Privacy & Policy</SettingsItemLink>
                     <hr className="border-white/20 my-3"/>
                    {/* Botón Sign Out llama a handleSignOut */}
                    <button onClick={handleSignOut} className="w-full flex items-center justify-between py-5 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors font-medium font-roboto md:font-bold md:text-base md:mb-2">
                        <span>Sign Out</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </nav>
            </div>

            {/* ----- VISTA SECUNDARIA (BLANCA - Ajustes App) ----- */}
            <div className={`min-h-screen bg-white p-6 ${showAppSettings ? 'block' : 'hidden'} select-none md:ml-72 md:block md:min-h-screen`}>
                {/* Encabezado */}
                <div className="flex items-center mb-6 relative h-10">
                     <button onClick={() => {
                         setShowAppSettings(false);
                     }} className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-gray-900 hover:opacity-75 transition-opacity md:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                     </button>
                    <h1 className="text-lg font-semibold text-gray-800 text-center flex-grow">Account & Settings</h1>
                </div>
                {/* Sección Ajustes */}
                <section className="mb-8">
                     <h2 className="text-xs uppercase text-gray-500 font-semibold px-4 mb-2 tracking-wide">Ajustes</h2>
                    <div className="bg-gray-50/70 rounded-lg divide-y divide-gray-200 border border-gray-200">
                        <AccountSettingsItemLink href="/ajustes/paciente/notificaciones">Notificaciones</AccountSettingsItemLink>
                        <AccountSettingsItemLink href="#">Configuración de horario</AccountSettingsItemLink>
                        <AccountSettingsItemLink href="#">Informe clínico</AccountSettingsItemLink>
                        <button className="w-full text-left py-3 px-4 text-red-600 hover:bg-gray-100 transition-colors rounded-b-lg text-sm font-medium">
                            Eliminar cuenta
                        </button>
                    </div>
                </section>
                {/* Sección Configuración de la aplicación */}
                 <section>
                     <h2 className="text-xs uppercase text-gray-500 font-semibold px-4 mb-2 tracking-wide">Configuración de la aplicación</h2>
                    <div className="bg-gray-50/70 rounded-lg divide-y divide-gray-200 border border-gray-200">
                        <ToggleItem label="Activar notificaciones" initialValue={true}/>
                        <ToggleItem label="Servicio de ubicación" />
                        <ToggleItem label="Dark Mode" />
                    </div>
                </section>
            </div>
        </div>
    );
}