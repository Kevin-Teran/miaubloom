"use client";

/**
 * @file page.tsx
 * @route src/app/inicio/paciente/page.tsx
 * @description Página principal (Home) para el rol Paciente después de iniciar sesión. Placeholder basado en diseño.
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
                            avatarUrl: "/assets/avatar-paciente.png" // Placeholder
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
    const textColor = isActive ? 'text-[#F4A9A0]' : 'text-gray-400 hover:text-[#F4A9A0]'; // Color activo o gris
    return (
        <Link href={href} className={`flex flex-col items-center ${textColor} transition-colors`}>
            {icon}
            <span className="text-xs mt-0.5">{label}</span>
        </Link>
    );
};


export default function InicioPacientePage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    // Protección de ruta
    useEffect(() => {
        if (!isLoading && (!user || user.rol !== 'Paciente')) { // Verifica rol [cite: kevin-teran/miaubloom/miaubloom-81ded442fcd7e2774778116ee32c033c02a55cc2/prisma/schema.prisma]
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
                    className="[&>p]:text-gray-600 [&>div]:opacity-50 [&>div]:bg-[#F5A0A1] [&>div>div]:bg-[#EE7E7F]" // Estilos para fondo claro
                />
            </div>
        );
    }

    // --- Variables Placeholder para UI ---
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('es-ES', { day: '2-digit' });
    const formattedMonth = currentDate.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '').toUpperCase(); // NOV

    const themeColor = '#F4A9A0'; // [cite: kevin-teran/miaubloom/miaubloom-81ded442fcd7e2774778116ee32c033c02a55cc2/src/app/globals.css]

    return (
        // Contenedor principal con fondo degradado y padding para nav bar
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-pink-50 via-white to-white px-4 pt-8 pb-20 md:pb-8 select-none"> {/* Padding inferior */}

            {/* Encabezado */}
            <header className="flex justify-between items-center mb-4 px-2">
                {/* Enlace a Ajustes */}
                <Link href="/ajustes/paciente" className="text-gray-500 hover:text-pink-500 p-2 -m-2"> {/* [cite: /src/app/ajustes/paciente/page.tsx] */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </Link>
                {/* Enlace a Chat */}
                <Link href="/chat/paciente" className="text-gray-500 hover:text-pink-500 p-2 -m-2"> {/* Ruta Placeholder */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </Link>
            </header>

            {/* Saludo y Avatar */}
            <section className="text-center mb-6">
                 <div className="relative w-36 h-36 mx-auto mb-2 pointer-events-none"> {/* Ligeramente más grande */}
                    <Image
                        src={user.avatarUrl || "/assets/avatar-paciente.png"} // [cite: kevin-teran/miaubloom/miaubloom-81ded442fcd7e2774778116ee32c033c02a55cc2/public/assets/avatar-paciente.png]
                        alt="Avatar Paciente"
                        fill
                        className="object-contain drop-shadow-md"
                        priority
                        unoptimized
                     />
                 </div>
                <h2 className="text-xl font-semibold text-gray-700">Hola, {user.nombreCompleto}!</h2>
                <p className="text-gray-500 text-sm">¿Cómo te sientes hoy?</p>
            </section>

             {/* Fecha */}
             <div className="flex justify-center items-center gap-2 mb-8"> {/* Más margen inferior */}
                 <div className="bg-white shadow-md rounded-lg p-2 px-3 text-center">
                    <span className="block text-2xl font-bold" style={{ color: themeColor }}>{formattedDate}</span>
                    <span className="block text-xs uppercase text-gray-500 tracking-wider">{formattedMonth}</span>
                 </div>
             </div>

            {/* Contenido Principal */}
            <main className="flex-grow space-y-6 px-2">
                {/* Sección Mis Tareas */}
                <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Mis tareas</h3>
                    {/* Placeholder si no hay tareas */}
                    <div className="bg-white p-4 rounded-xl shadow text-center text-gray-500 text-sm">
                        Aún no tienes tareas asignadas.
                    </div>
                    {/* Ejemplo de Tareas (cuando haya datos)
                    <div className="space-y-2">
                        <div className="bg-white p-3 rounded-xl shadow flex items-center justify-between">...</div>
                        <div className="bg-white p-3 rounded-xl shadow flex items-center justify-between">...</div>
                    </div>
                    */}
                </section>

                {/* Sección Mi Actividad */}
                <section>
                     <h3 className="text-lg font-semibold text-gray-800 mb-3">Mi actividad</h3>
                     {/* Placeholder Gráfico Emociones */}
                     <div className="bg-white p-4 rounded-xl shadow min-h-[150px] flex items-center justify-center text-gray-400 text-sm">
                         Gráfico de emociones aquí...
                     </div>
                </section>
            </main>

            {/* Barra de Navegación Inferior Fija */}
            <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center px-4 shadow-[0_-2px_5px_rgba(0,0,0,0.05)] md:hidden">
                <NavButton
                    href="/inicio/paciente"
                    label="Inicio"
                    isActive={true} // Marcar como activo
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>}
                />
                 {/* Botón Jardín (Placeholder) */}
                 <NavButton
                    href="/inicio/paciente/jardin" // Ruta Placeholder
                    label="Jardín"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} // Icono Placeholder
                 />

                 {/* Botón Central Grande (+) */}
                 <Link href="/registrar-emocion" // Ruta Placeholder para añadir emoción
                    className="w-14 h-14 bg-[#F4A9A0] rounded-full flex items-center justify-center text-white shadow-lg -mt-8 border-4 border-white"> {/* Ajuste para que 'flote' */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                 </Link>

                <NavButton
                    href="/inicio/paciente/tareas" // Ruta Placeholder
                    label="Tareas"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                />
                <NavButton
                    href="/perfil/paciente" // Ruta Placeholder
                    label="Perfil"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                />
            </nav>
        </div>
    );
}
