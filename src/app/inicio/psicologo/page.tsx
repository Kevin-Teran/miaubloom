"use client";

/**
 * @file page.tsx
 * @route src/app/inicio/psicologo/page.tsx
 * @description Página principal (Home) para el rol Psicólogo. Placeholder basado en diseño.
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LoadingIndicator from '@/components/ui/LoadingIndicator'; // [cite: kevin-teran/miaubloom/miaubloom-81ded442fcd7e2774778116ee32c033c02a55cc2/src/components/ui/LoadingIndicator.tsx]
import Link from 'next/link'; // Import Link

// --- PLACEHOLDER HOOK DE AUTENTICACIÓN ---
// DEBES Reemplazar esto con tu hook/contexto real
const useAuth = () => {
    const [user, setUser] = useState<{ nombreCompleto: string; rol: string; avatarUrl?: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/auth/login'); // [cite: kevin-teran/miaubloom/miaubloom-81ded442fcd7e2774778116ee32c033c02a55cc2/src/app/api/auth/login/route.ts]
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.authenticated) { // [cite: kevin-teran/miaublom/miaubloom-81ded442fcd7e2774778116ee32c033c02a55cc2/src/app/api/auth/login/route.ts]
                        setUser({
                            nombreCompleto: data.user.nombreCompleto,
                            rol: data.user.rol,
                            avatarUrl: "/assets/avatar-psicologo.png" // Placeholder
                        });
                    } else { setUser(null); }
                } else { setUser(null); }
            } catch (error) { console.error("Error fetching auth status:", error); setUser(null); }
            finally { setIsLoading(false); }
        };
        fetchUser();
    }, []);

    return { user, isLoading };
};
// --- FIN PLACEHOLDER HOOK ---

// --- Componente Botón de Navegación Inferior ---
const NavButton = ({ href, icon, label, isActive = false }: { href: string; icon: React.ReactNode; label: string; isActive?: boolean; }) => {
    const textColor = isActive ? 'text-[#F4A9A0]' : 'text-gray-400 hover:text-[#F4A9A0]';
    return (
        <Link href={href} className={`flex flex-col items-center ${textColor} transition-colors`}>
            {icon}
            <span className="text-xs mt-0.5">{label}</span>
        </Link>
    );
};

export default function InicioPsicologoPage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    // Protección de ruta
    useEffect(() => {
        const isAllowedRole = user?.rol === 'Psicólogo' || user?.rol === 'Psicologo'; // Aceptar ambas formas [cite: kevin-teran/miaubloom/miaubloom-81ded442fcd7e2774778116ee32c033c02a55cc2/prisma/schema.prisma]
        if (!isLoading && (!user || !isAllowedRole)) {
            console.log("Acceso no autorizado o usuario no cargado, redirigiendo...");
            router.replace('/identificacion'); // [cite: kevin-teran/miaubloom/miaubloom-81ded442fcd7e2774778116ee32c033c02a55cc2/src/app/identificacion/page.tsx]
        }
    }, [user, isLoading, router]);

    // Estado de carga
    if (isLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 via-white to-white">
                <LoadingIndicator
                    text="Cargando tu espacio..."
                    className="[&>p]:text-gray-600 [&>div]:opacity-50 [&>div]:bg-[#F5A0A1] [&>div>div]:bg-[#EE7E7F]"
                />
            </div>
        );
    }

    // --- Variables Placeholder ---
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('es-ES', { day: '2-digit' });
    const formattedMonth = currentDate.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '').toUpperCase(); // NOV
    const themeColor = '#F4A9A0'; // [cite: kevin-teran/miaubloom/miaubloom-81ded442fcd7e2774778116ee32c033c02a55cc2/src/app/globals.css]

    // Placeholder lista de pacientes
    const pacientes = [
        { id: 1, nombre: "Lucas Luna", avatar: "/assets/avatar-paciente.png", status: "Estable" }, // [cite: kevin-teran/miaubloom/miaubloom-81ded442fcd7e2774778116ee32c033c02a55cc2/public/assets/avatar-paciente.png]
        { id: 2, nombre: "Mia Paz", avatar: "/assets/avatar-paciente.png", status: "Ansiedad" }, // [cite: kevin-teran/miaubloom/miaubloom-81ded442fcd7e2774778116ee32c033c02a55cc2/public/assets/avatar-paciente.png]
        { id: 3, nombre: "Ana Sofía", avatar: "/assets/avatar-paciente.png", status: "Estable" }, // [cite: kevin-teran/miaubloom/miaubloom-81ded442fcd7e2774778116ee32c033c02a55cc2/public/assets/avatar-paciente.png]
        // ... más pacientes
    ];


    return (
        // Contenedor principal con fondo degradado y padding para nav bar
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-pink-50 via-white to-white px-4 pt-8 pb-20 md:pb-8 select-none"> {/* Padding inferior */}

            {/* Encabezado */}
            <header className="flex justify-between items-center mb-4 px-2">
                {/* Enlace a Ajustes */}
                <Link href="/ajustes/psicologo" className="text-gray-500 hover:text-pink-500 p-2 -m-2"> {/* [cite: /src/app/ajustes/psicologo/page.tsx] */}
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </Link>
                 {/* Enlace a Notificaciones/Chat */}
                <Link href="/notificaciones/psicologo" className="relative text-gray-500 hover:text-pink-500 p-2 -m-2"> {/* Ruta Placeholder */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {/* <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-1 ring-pink-50"></span> */}
                </Link>
            </header>

            {/* Saludo y Avatar */}
            <section className="flex items-center justify-between mb-6 px-2">
                <div>
                     <h2 className="text-xl font-semibold text-gray-700">Hola, {user.nombreCompleto}!</h2>
                     <p className="text-gray-500 text-sm">Empecemos</p>
                </div>
                 <div className="relative w-16 h-16 pointer-events-none">
                     <Image
                        src={user.avatarUrl || "/assets/avatar-psicologo.png"} // [cite: kevin-teran/miaubloom/miaubloom-81ded442fcd7e2774778116ee32c033c02a55cc2/public/assets/avatar-psicologo.png]
                        alt="Avatar Psicólogo"
                        fill
                        className="object-contain" // Cambia a object-cover si subes fotos reales
                        priority
                        unoptimized
                     />
                 </div>
            </section>

             {/* Fecha */}
            <div className="flex justify-start items-center gap-2 mb-8 px-2"> {/* Más margen inferior */}
                 <div className="bg-white shadow-md rounded-lg p-2 px-3 text-center">
                    <span className="block text-2xl font-bold" style={{ color: themeColor }}>{formattedDate}</span>
                    <span className="block text-xs uppercase text-gray-500 tracking-wider">{formattedMonth}</span>
                 </div>
             </div>

            {/* Contenido Principal */}
            <main className="flex-grow space-y-6 px-2">
                {/* Sección Mis Pacientes */}
                <section>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">Mis pacientes</h3>
                        <Link href="/inicio/psicologo/pacientes" className="text-sm text-pink-500 hover:underline">Ver todos ({pacientes.length})</Link> {/* Ruta Placeholder */}
                    </div>
                    {/* Lista Horizontal Scrollable */}
                    <div className="flex space-x-4 overflow-x-auto pb-2 -mx-2 px-2"> {/* Padding negativo y positivo para scroll */}
                        {pacientes.map(paciente => (
                            <Link href={`/inicio/psicologo/paciente/${paciente.id}`} key={paciente.id} className="flex-shrink-0 w-20 text-center group block"> {/* Enlace a detalle */}
                                <div className="relative w-16 h-16 mx-auto mb-1 rounded-full overflow-hidden border-2 border-pink-100 group-hover:border-pink-300 transition-colors">
                                    <Image src={paciente.avatar} alt={paciente.nombre} fill className="object-cover pointer-events-none" />
                                </div>
                                <span className="block text-xs font-medium text-gray-700 truncate">{paciente.nombre}</span>
                                <span className={`block text-[10px] ${paciente.status === 'Estable' ? 'text-green-500' : 'text-orange-500'}`}>{paciente.status}</span>
                            </Link>
                        ))}
                         {/* Botón Añadir Paciente */}
                        <div className="flex-shrink-0 w-20 text-center flex flex-col items-center justify-center pt-1">
                            <button className="w-14 h-14 mx-auto mb-1 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-pink-400 hover:text-pink-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                            <span className="block text-xs font-medium text-gray-700 mt-1">Añadir</span>
                        </div>
                    </div>
                </section>

                {/* Sección Citas Pendientes */}
                <section>
                    <div className="flex justify-between items-center mb-3">
                         <h3 className="text-lg font-semibold text-gray-800">Citas pendientes</h3>
                          <Link href="/inicio/psicologo/citas" className="text-sm text-pink-500 hover:underline">Ver agenda</Link> {/* Ruta Placeholder */}
                    </div>
                     {/* Placeholder si no hay citas */}
                     <div className="bg-white p-4 rounded-xl shadow text-center text-gray-500 text-sm">
                        No tienes citas programadas para hoy.
                    </div>
                    {/* Ejemplo de Citas (cuando haya datos)
                    <div className="space-y-3">
                         <div className="bg-white p-4 rounded-xl shadow">...</div>
                         <div className="bg-white p-4 rounded-xl shadow">...</div>
                    </div>
                    */}
                </section>
            </main>

            {/* Barra de Navegación Inferior Fija */}
            <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center px-4 shadow-[0_-2px_5px_rgba(0,0,0,0.05)] md:hidden">
                <NavButton
                    href="/inicio/psicologo"
                    label="Inicio"
                    isActive={true}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>}
                />
                 <NavButton
                    href="/inicio/psicologo/pacientes" // Ruta Placeholder
                    label="Pacientes"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                 />
                 {/* Botón Central Grande (+) */}
                 <Link href="/acciones/psicologo" // Ruta Placeholder para acciones rápidas
                    className="w-14 h-14 bg-[#F4A9A0] rounded-full flex items-center justify-center text-white shadow-lg -mt-8 border-4 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                 </Link>
                 <NavButton
                    href="/inicio/psicologo/citas" // Ruta Placeholder
                    label="Agenda"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                />
                 <NavButton
                    href="/perfil/psicologo" // Ruta Placeholder
                    label="Perfil"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                />
            </nav>
        </div>
    );
}
