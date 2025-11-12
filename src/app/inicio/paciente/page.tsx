"use client";

export const dynamic = 'force-dynamic';

/**
 * @file page.tsx
 * @route src/app/inicio/paciente/page.tsx
 * @description Página principal (Home) para Paciente - Diseño Replicado del Mockup
 * @author Kevin Mariano
 * @version 2.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ChatNotificationBadge } from '@/components/chat/ChatNotificationBadge';
import { CalendarWithCitas } from '@/components/paciente/CalendarWithCitas';
import { pageTransition, staggerFadeIn } from '@/lib/animations';

// Tipos para tareas
interface Tarea {
    id: number;
    titulo: string;
    descripcion: string;
    etiqueta: string;
}

// Tipos para estadísticas de emociones
interface Estadistica {
    nombre: string;
    porcentaje: number;
    color: string;
}

// Componente de Tarea
const TaskCard = ({ 
    title, 
    description, 
    tag, 
    isCompleted = false,
    onToggle 
}: { 
    title: string; 
    description: string; 
    tag: string; 
    isCompleted?: boolean;
    onToggle?: () => void;
}) => {
    return (
        <div className="bg-white/80 dark:bg-slate-700/60 backdrop-blur-sm rounded-2xl p-4 shadow-md dark:shadow-lg dark:shadow-black/30 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                    onClick={onToggle}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isCompleted 
                            ? 'bg-[var(--color-theme-primary)] border-[var(--color-theme-primary)]' 
                            : 'border-gray-300 dark:border-slate-500 hover:border-[var(--color-theme-primary)] dark:hover:border-[var(--color-theme-primary)]'
                    }`}
                >
                    {isCompleted && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </button>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold text-gray-800 dark:text-slate-100 mb-1 ${isCompleted ? 'line-through opacity-60' : ''}`}>
                        {title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mb-2 line-clamp-2">
                        {description}
                    </p>
                    {/* Tag */}
                    <span className="inline-block px-3 py-1 bg-[var(--color-theme-primary-light)] dark:bg-slate-600 text-[var(--color-theme-primary)] dark:text-slate-200 text-xs font-medium rounded-full">
                        {tag}
                    </span>
                </div>
            </div>
        </div>
    );
};

// Componente de Gráfico Circular de Emoción
const EmotionChart = ({ 
    name, 
    percentage, 
    color,
    dots = 10 
}: { 
    name: string; 
    percentage: number; 
    color: string;
    dots?: number;
}) => {
    const circumference = 2 * Math.PI * 45; // Radio de 45
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const filledDots = Math.round((percentage / 100) * dots);

    return (
        <div className="flex flex-col items-center">
            {/* Círculo de progreso */}
            <div className="relative w-24 h-24 mb-3">
                <svg className="w-24 h-24 transform -rotate-90">
                    {/* Círculo de fondo */}
                    <circle
                        cx="48"
                        cy="48"
                        r="45"
                        stroke="currentColor"
                        className="stroke-gray-300 dark:stroke-slate-600"
                        strokeWidth="8"
                        fill="none"
                    />
                    {/* Círculo de progreso */}
                    <circle
                        cx="48"
                        cy="48"
                        r="45"
                        stroke={color}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                {/* Porcentaje en el centro */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-800 dark:text-white">
                        {percentage}%
                    </span>
                </div>
            </div>

            {/* Dots de progreso */}
            <div className="flex gap-1 mb-2">
                {Array.from({ length: dots }).map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-300`}
                        style={{ 
                            backgroundColor: i < filledDots ? color : 'var(--color-gray-light)',
                            transform: i < filledDots ? 'scale(1)' : 'scale(0.8)'
                        }}
                    />
                ))}
            </div>

            {/* Nombre de la emoción */}
            <span className="text-sm font-medium text-gray-600 dark:text-slate-300">{name}</span>
        </div>
    );
};

// Botón de navegación
const NavButton = ({ 
    href, 
    icon, 
    label, 
    isActive = false 
}: { 
    href: string; 
    icon: React.ReactNode; 
    label: string; 
    isActive?: boolean; 
}) => {
    const colorClass = isActive ? 'text-[var(--color-theme-primary)]' : 'text-gray-400 dark:text-slate-500 dark:hover:text-slate-300';
    
    return (
        <Link href={href} className={`flex flex-col items-center ${colorClass} transition-colors duration-200 hover:text-[var(--color-theme-primary)]`}>
            {icon}
            <span className="text-xs mt-1 font-medium">{label}</span>
        </Link>
    );
};

export default function InicioPacientePage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    
    // Estados para datos reales
    const [tasks, setTasks] = useState<Array<{
        id: number;
        title: string;
        description: string;
        tag: string;
        isCompleted: boolean;
    }>>([]);
    
    const [emotionStats, setEmotionStats] = useState<Array<{
        name: string;
        percentage: number;
        color: string;
    }>>([]);
    
    const [loadingStats, setLoadingStats] = useState(true);
    const [dataError, setDataError] = useState<string | null>(null);
    const [isRetrying, setIsRetrying] = useState(false);

    // Referencias para animaciones
    const pageRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    // Animación de entrada de la página
    useEffect(() => {
      if (!isLoading && !loadingStats && pageRef.current) {
        pageTransition(pageRef.current, 0.1);
        
        // Animar cards con stagger
        setTimeout(() => {
          if (cardsRef.current) {
            const cards = cardsRef.current.querySelectorAll('.animate-card');
            if (cards.length > 0) {
              staggerFadeIn(Array.from(cards) as HTMLElement[], 0.08);
            }
          }
        }, 200);
      }
    }, [isLoading, loadingStats]);

    // Cargar tareas al montar el componente
    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/tareas/list', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                
                // Mapear tareas a formato del componente
                const formattedTasks = data.tareas.map((tarea: Tarea) => ({
                    id: tarea.id,
                    title: tarea.titulo,
                    description: tarea.descripcion,
                    tag: tarea.etiqueta,
                    isCompleted: tarea.etiqueta === 'Completada'
                }));
                
                setTasks(formattedTasks);
            } else if (response.status !== 401) {
                setDataError('Error al cargar tareas');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setDataError('Error de conexión al cargar tareas');
        }
    };

    useEffect(() => {
        if (user) {
            fetchTasks();
        }
    }, [user]);

    // Cargar estadísticas de emociones
    const fetchStats = async () => {
        try {
            const response = await fetch('/api/actividades/estadisticas', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                
                // Mapear estadísticas a formato del componente
                const formattedStats = data.estadisticas.map((stat: Estadistica) => ({
                    name: stat.nombre,
                    percentage: stat.porcentaje,
                    color: stat.color
                }));
                
                setEmotionStats(formattedStats);
            } else if (response.status !== 401) {
                setDataError('Error al cargar estadísticas');
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
            setDataError('Error de conexión al cargar estadísticas');
        } finally {
            setLoadingStats(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchStats();
        }
    }, [user]);

    const handleRetry = async () => {
        setIsRetrying(true);
        setDataError(null);
        setLoadingStats(true);
        await Promise.all([fetchTasks(), fetchStats()]);
        setIsRetrying(false);
    };

    const toggleTask = (id: number) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
        ));
    };

    // Función para cerrar sesión
    const handleSignOut = async () => {
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
                // Delay para permitir que la redirección y logout se procesen
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            router.push('/identificacion');
        }
    };

    // Estado de carga o sin acceso
    if (isLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 via-pink-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <LoadingIndicator
                    text="Cargando tu jardín emocional..."
                    className="[&>p]:text-gray-600 dark:[&>p]:text-slate-300"
                />
            </div>
        );
    }

    // Mostrar error si existe
    if (dataError) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 via-pink-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-black/50 p-8 text-center max-w-md">
                    <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100 mb-2">Error al cargar</h2>
                    <p className="text-gray-600 dark:text-slate-400 mb-6">{dataError}</p>
                    <button
                        onClick={handleRetry}
                        disabled={isRetrying}
                        className="px-6 py-2 bg-[var(--color-theme-primary)] text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                        {isRetrying ? 'Reintentando...' : 'Reintentar'}
                    </button>
                </div>
            </div>
        );
    }

    // Fecha actual
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('es-ES', { day: '2-digit' });
    const formattedMonth = currentDate.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '').toUpperCase();

    return (
        <>
            {/* ============================================
                VERSIÓN MÓVIL
            ============================================ */}
            <div ref={pageRef} className="lg:hidden min-h-screen bg-white dark:bg-slate-900 pb-20 relative">
                {/* FONDO ROSADO CON CONTENIDO */}
                <div className="bg-gradient-to-b from-[var(--color-theme-primary)] to-[var(--color-theme-primary-dark)] min-h-[60vh] relative z-0">
                    {/* Header con fondo rosado */}
                    <header className="bg-transparent pt-safe px-4 py-4 sticky top-0 z-10">
                        <div className="flex justify-between items-center max-w-lg mx-auto">
                            {/* Botón Atrás - Rosa con ícono blanco */}
                            <button 
                                onClick={() => router.back()}
                                className="w-10 h-10 rounded-full bg-[var(--color-theme-primary)] flex items-center justify-center text-white hover:opacity-90 transition-all active:scale-95 shadow-md"
                                aria-label="Volver atrás"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* Botón Chat con notificación */}
                            <div className="relative">
                                <button 
                                    onClick={() => router.push('/chat/paciente')}
                                    className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all active:scale-95"
                                    aria-label="Chat"
                                >
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </button>
                                {/* Punto de notificación */}
                                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                            </div>
                        </div>
                    </header>

                    {/* Contenido del área rosada */}
                    <div className="px-4 max-w-lg mx-auto text-center py-4">
                        {/* Avatar del Gato */}
                        <div className="relative w-40 h-40 mx-auto mb-4 drop-shadow-2xl">
                            <Image
                                src="/assets/gato-inicio-1.png"
                                alt="Miau - Tu compañero jardinero"
                                fill
                                className="object-contain"
                                priority
                                unoptimized
                            />
                        </div>

                        {/* Saludo */}
                        <h2 className="text-xl font-bold text-white drop-shadow-md mb-1 dark:drop-shadow-lg">
                            Hola, {user!.nickname}!
                        </h2>
                        <p className="text-white/90 text-sm font-medium drop-shadow mb-4 dark:drop-shadow-lg">
                            ¿Cómo te sientes hoy?
                        </p>

                        {/* Calendario con Citas */}
                        <div className="flex justify-center">
                            <CalendarWithCitas
                                themeColorLight="var(--color-theme-primary-light)"
                                themeColorDark="var(--color-theme-primary)"
                            />
                        </div>
                    </div>
                </div>

                {/* SEPARACIÓN REDONDEADA BLANCA */}
                <div className="relative z-10">
                    <div className="h-8 bg-white mx-auto w-4/5 rounded-b-3xl shadow-md"></div>
                </div>

                {/* TARJETA BLANCA INFERIOR CON CONTENIDO */}
                <div className="relative z-20 bg-white dark:bg-slate-800 rounded-t-[48px] shadow-2xl dark:shadow-2xl dark:shadow-black/50 px-4 py-6 -mt-8">
                    <div className="max-w-lg mx-auto">
                        {/* Sección Mis Tareas */}
                        <section className="mb-8">
                            <h3 className="text-lg font-bold text-[var(--color-theme-primary)] dark:text-slate-200 mb-4 px-2">
                                Mis tareas
                            </h3>
                            <div className="space-y-3">
                                {tasks.map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        title={task.title}
                                        description={task.description}
                                        tag={task.tag}
                                        isCompleted={task.isCompleted}
                                        onToggle={() => toggleTask(task.id)}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Sección Mi Actividad */}
                        <section className="pb-8">
                            <h3 className="text-lg font-bold text-[var(--color-theme-primary)] dark:text-slate-200 mb-4 px-2">
                                Mi actividad
                            </h3>
                            <div className="bg-gray-100 dark:bg-slate-700 rounded-2xl p-6 shadow-md dark:shadow-lg dark:shadow-black/30">
                                <div className="flex justify-around items-start">
                                    {loadingStats ? (
                                        <div className="flex justify-around w-full">
                                            <div className="text-gray-500 dark:text-slate-400">Cargando...</div>
                                        </div>
                                    ) : emotionStats.length > 0 ? (
                                        emotionStats.map((stat) => (
                                            <EmotionChart
                                                key={stat.name}
                                                name={stat.name}
                                                percentage={stat.percentage}
                                                color={stat.color}
                                                dots={10}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-gray-500 dark:text-slate-400 w-full text-center">
                                            Sin datos de actividad aún
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Barra de navegación inferior */}
                <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 px-6 py-3 shadow-[0_-4px_6px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_6px_rgba(0,0,0,0.3)] z-50">
                    <div className="max-w-lg mx-auto flex justify-between items-center">
                        <NavButton
                            href="/inicio/paciente/jardin"
                            label="Jardín"
                            icon={
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />

                        <NavButton
                            href="/inicio/paciente"
                            label="Inicio"
                            isActive={true}
                            icon={
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                </svg>
                            }
                        />

                        {/* Botón Central Grande (+) */}
                        <Link
                            href="/registrar-emocion"
                            className="w-14 h-14 bg-gradient-to-br from-[var(--color-theme-primary)] to-[var(--color-theme-primary-dark)] rounded-full flex items-center justify-center text-white shadow-xl hover:shadow-2xl active:scale-95 transition-all -mt-8 border-4 border-white relative z-10"
                        >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </Link>

                        <NavButton
                            href="/chat"
                            label="Chat"
                            icon={
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            }
                        />

                        <NavButton
                            href="/inicio/paciente/tareas"
                            label="Tareas"
                            icon={
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            }
                        />

                        <NavButton
                            href="/perfil/paciente"
                            label="Perfil"
                            icon={
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            }
                        />
                    </div>
                </nav>
            </div>

            {/* ============================================
                VERSIÓN DESKTOP
            ============================================ */}
            <div ref={pageRef} className="hidden lg:block min-h-screen bg-white dark:bg-slate-900">
                {/* Header Desktop */}
                <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm dark:shadow-md dark:shadow-black/20">
                    <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 relative">
                                <Image
                                    src="/assets/logo.svg"
                                    alt="MiauBloom"
                                    fill
                                    className="object-contain"
                                    style={{ filter: 'var(--logo-filter, brightness(1))' }}
                                    unoptimized
                                />
                            </div>
                            <Image
                                src="/assets/MiauBloom-b.svg"
                                alt="MiauBloom"
                                width={200}
                                height={55}
                                className="object-contain"
                                style={{ filter: 'var(--logo-text-filter, brightness(0))' }}
                                unoptimized
                            />
                        </div>

                        {/* Usuario y acciones */}
                        <div className="flex items-center gap-4">
                            {/* Calendario con Citas */}
                            <CalendarWithCitas
                                themeColorLight="var(--color-theme-primary-light)"
                                themeColorDark="var(--color-theme-primary)"
                            />

                            {/* Chat */}
                            <ChatNotificationBadge />

                            {/* Perfil */}
                            <Link href="/perfil/paciente" className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-full pl-3 pr-4 py-2 transition-colors">
                                <div className="w-10 h-10 relative">
                                    <Image
                                        src={user!.avatarUrl || "/assets/avatar-paciente.png"}
                                        alt="Avatar"
                                        fill
                                        className="object-contain rounded-full"
                                        unoptimized
                                    />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{user!.nickname}</p>
                                    <p className="text-xs text-gray-500 dark:text-slate-500">Paciente</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Contenido Principal Desktop */}
                <div className="max-w-7xl mx-auto px-8 py-8">
                    <div className="grid grid-cols-12 gap-8">
                        {/* Columna Izquierda - Avatar y Navegación */}
                        <aside className="col-span-3 space-y-6">
                            {/* Card de Saludo */}
                            <div 
                                className="bg-gradient-to-br from-[var(--color-theme-primary-light)] to-[var(--color-theme-primary-light)]/60 dark:from-slate-700 dark:to-slate-700/80 rounded-3xl p-6 text-center shadow-lg dark:shadow-xl dark:shadow-black/30"
                                style={{
                                    backgroundColor: document.documentElement.classList.contains('dark') ? undefined : 'var(--color-theme-primary-light)'
                                }}
                            >
                                <div className="w-40 h-40 relative mx-auto mb-4 drop-shadow-2xl">
                                    <Image
                                        src="/assets/gato-inicio-1.png"
                                        alt="Miau"
                                        fill
                                        className="object-contain"
                                        priority
                                        unoptimized
                                    />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-2">
                                    ¡Hola, {user!.nickname}!
                                </h2>
                                <p className="text-gray-600 dark:text-slate-400">
                                    ¿Cómo te sientes hoy?
                                </p>
                            </div>

                            {/* Navegación */}
                            <nav className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-lg dark:shadow-xl dark:shadow-black/30 space-y-2">
                                <Link href="/inicio/paciente" className="flex items-center gap-3 px-4 py-3 bg-[var(--color-theme-primary-light)] dark:bg-slate-700 text-[var(--color-theme-primary)] dark:text-slate-100 rounded-xl font-semibold transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                    Inicio
                                </Link>
                                <Link href="/inicio/paciente/jardin" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Mi Jardín
                                </Link>
                                <Link href="/inicio/paciente/tareas" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                    Tareas
                                </Link>
                                <Link href="/ajustes/paciente" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Ajustes
                                </Link>
                                {/* Divisor */}
                                <div className="h-px bg-gray-200 dark:bg-slate-700 my-2"></div>
                                {/* Botón Cerrar Sesión */}
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Cerrar Sesión
                                </button>
                            </nav>

                            {/* Botón de Acción */}
                            <Link
                                href="/registrar-emocion"
                                className="block w-full bg-gradient-to-r from-[var(--color-theme-primary)] to-[var(--color-theme-primary-dark)] text-white font-bold py-4 rounded-2xl text-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                            >
                                + Registrar Emoción
                            </Link>
                        </aside>

                        {/* Columna Central - Contenido Principal */}
                        <main className="col-span-6 space-y-8">
                            {/* Mis Tareas */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Mis tareas</h3>
                                    <Link href="/inicio/paciente/tareas" className="text-sm hover:text-opacity-80 font-semibold transition-colors text-[var(--color-theme-primary)]">
                                        Ver todas →
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {tasks.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            title={task.title}
                                            description={task.description}
                                            tag={task.tag}
                                            isCompleted={task.isCompleted}
                                            onToggle={() => toggleTask(task.id)}
                                        />
                                    ))}
                                </div>
                            </section>
                        </main>

                        {/* Columna Derecha - Actividad */}
                        <aside className="col-span-3">
                            <section>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4">Mi actividad</h3>
                                <div className="bg-gray-50 dark:bg-slate-700 rounded-3xl p-6 shadow-lg dark:shadow-xl dark:shadow-black/30 space-y-6">
                                    {loadingStats ? (
                                        <div className="text-gray-500 dark:text-slate-400 text-center py-6">Cargando...</div>
                                    ) : emotionStats.length > 0 ? (
                                        emotionStats.map((stat) => (
                                            <EmotionChart
                                                key={stat.name}
                                                name={stat.name}
                                                percentage={stat.percentage}
                                                color={stat.color}
                                                dots={10}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-gray-500 dark:text-slate-400 text-center py-6">
                                            Sin datos de actividad aún
                                        </div>
                                    )}
                                </div>
                            </section>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}