// src/app/ajustes/psicologo/page.tsx
"use client";

export const dynamic = 'force-dynamic';

/**
 * @file page.tsx
 * @route src/app/ajustes/psicologo/page.tsx
 * @description Página de Ajustes y Configuraciones para el Psicólogo. Funcionalidad básica conectada.
 * @author Kevin Mariano
 * @version 1.1.2 // Versión actualizada
 * @since 1.0.0
 * @copyright MiauBloom
 */

import React from 'react';
import { useRouter } from 'next/navigation';
// import Link from 'next/link'; // <<<--- ELIMINADO (No se usa Link directamente)
import Image from 'next/image';
import LoadingIndicator from '@/components/ui/LoadingIndicator'; //
// <<<--- CORRECCIÓN DE RUTA DE IMPORTACIÓN --->>>
import { SettingsItemLink, AccountSettingsItemLink, ToggleItem } from '../SettingsComponents'; //
import { useAuth } from '@/context/AuthContext';


export default function AjustesPsicologoPage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

     // Función para cerrar sesión (sin cambios)
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

    // Muestra indicador de carga o sin acceso
    if (isLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                 <LoadingIndicator text="Cargando ajustes..." className="[&>p]:text-gray-600 [&>div]:opacity-50 [&>div]:bg-[#F5A0A1] [&>div>div]:bg-[#EE7E7F]" /> {/* */}
            </div>
        );
    }

    // --- JSX REESTRUCTURADO ---
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* COLUMNA IZQUIERDA (Menú Rosa - Sidebar en Desktop) */}
            <aside className="w-full md:w-72 lg:w-80 flex-shrink-0 bg-[var(--color-primary)] p-6 md:fixed md:h-screen md:block">
                {/* Botón Volver */}
                <button onClick={() => router.back()} className="mb-4 text-white hover:opacity-75 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="font-medium text-sm">Volver</span>
                </button>
                {/* Perfil */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white pointer-events-none">
                        <Image src={user!.avatarUrl || "/assets/avatar-psicologo.png"} alt="Avatar" fill className="object-cover"/>
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-white">{user!.nombreCompleto}</h1>
                    </div>
                </div>
                {/* Lista de Opciones */}
                <nav className="space-y-1 text-sm">
                    <SettingsItemLink href="/perfil/psicologo">Mi perfil</SettingsItemLink>
                    <SettingsItemLink href="/inicio/psicologo/pacientes">Mis Pacientes</SettingsItemLink>
                    <SettingsItemLink href="/inicio/psicologo/citas">Citas pendientes</SettingsItemLink>
                    <SettingsItemLink href="/notificaciones/psicologo">Notificaciones</SettingsItemLink>
                    <hr className="border-white/20 my-3"/>
                    <SettingsItemLink href="#">Ajustes</SettingsItemLink>
                    <SettingsItemLink href="/ayuda">Help Center</SettingsItemLink>
                    <SettingsItemLink href="/privacidad">Privacy & Policy</SettingsItemLink>
                     <hr className="border-white/20 my-3"/>
                    <button onClick={handleSignOut} className="w-full text-left py-3 px-4 rounded-lg text-red-100 hover:bg-white/10 transition-colors font-medium">
                        Sign Out
                    </button>
                </nav>
            </aside>

            {/* COLUMNA DERECHA (Contenido Blanco) */}
            <main className="w-full bg-white p-6 md:ml-72 lg:ml-80">
                {/* Encabezado */}
                <div className="flex items-center mb-6 relative h-10">
                    <h1 className="text-lg font-semibold text-gray-800 text-center flex-grow">Account & Settings</h1>
                </div>
                {/* Sección Ajustes */}
                <section className="mb-8 max-w-2xl mx-auto">
                    <h2 className="text-xs uppercase text-gray-500 font-semibold px-4 mb-2 tracking-wide">Ajustes</h2>
                    <div className="bg-gray-50/70 rounded-lg divide-y divide-gray-200 border border-gray-200">
                        <AccountSettingsItemLink href="/ajustes/psicologo/notificaciones">Notificaciones</AccountSettingsItemLink>
                        <AccountSettingsItemLink href="#">Configuración de horario</AccountSettingsItemLink>
                        <AccountSettingsItemLink href="#">Informe clínico</AccountSettingsItemLink>
                        <button className="w-full text-left py-3 px-4 text-red-600 hover:bg-gray-100 transition-colors rounded-b-lg text-sm font-medium">
                            Eliminar cuenta
                        </button>
                    </div>
                </section>
                {/* Sección App Settings */}
                 <section className="max-w-2xl mx-auto">
                     <h2 className="text-xs uppercase text-gray-500 font-semibold px-4 mb-2 tracking-wide">Configuración de la aplicación</h2>
                    <div className="bg-gray-50/70 rounded-lg divide-y divide-gray-200 border border-gray-200">
                        <ToggleItem label="Activar notificaciones" initialValue={true}/>
                        <ToggleItem label="Servicio de ubicación" />
                        <ToggleItem label="Dark Mode" />
                    </div>
                </section>
            </main>
        </div>
    );
}