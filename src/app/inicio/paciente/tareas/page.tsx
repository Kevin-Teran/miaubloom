'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import IconButton from '@/components/ui/IconButton';
import { CheckCircle2, Circle, Clock, Calendar } from 'lucide-react';

interface Tarea {
    id: string;
    titulo: string;
    descripcion: string;
    estado: 'Pendiente' | 'En progreso' | 'Completada';
    prioridad: 'Baja' | 'Media' | 'Alta';
    fechaLimite: string | null;
    creadoEn: string;
    categoria?: string;
}

export default function TareasPacientePage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const [tareas, setTareas] = useState<Tarea[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filtro, setFiltro] = useState<'todas' | 'pendientes' | 'completadas'>('todas');

    useEffect(() => {
        console.log('[Tareas Page] Estado:', { authLoading, hasUser: !!user, userId: user?.id });
        
        if (!authLoading && user) {
            console.log('[Tareas Page] Usuario cargado, iniciando fetch...');
            // Pequeño delay para asegurar que la cookie esté disponible
            setTimeout(() => {
                fetchTareas();
            }, 100);
        } else if (!authLoading && !user) {
            console.log('[Tareas Page] No hay usuario, redirigiendo...');
            router.push('/identificacion');
        }
    }, [authLoading, user, router]);

    const fetchTareas = async () => {
        try {
            setIsLoading(true);
            console.log('[Tareas] Cargando tareas...');
            console.log('[Tareas] Cookies disponibles:', document.cookie);
            
            const response = await fetch('/api/paciente/tareas', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('[Tareas] Respuesta:', response.status);
            console.log('[Tareas] Headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = { error: `Error ${response.status}` };
                }
                console.error('[Tareas] Error en respuesta:', errorData);
                console.error('[Tareas] Status completo:', {
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url
                });
                throw new Error(errorData.error || errorData.details || `Error ${response.status}: No se pudieron cargar las tareas`);
            }

            const data = await response.json();
            console.log('[Tareas] Tareas recibidas:', data.tareas?.length || 0);
            setTareas(data.tareas || []);
        } catch (err: any) {
            console.error('[Tareas] Error al cargar tareas:', err);
            setError(err.message || 'Error al cargar las tareas');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleComplete = async (tareaId: string, currentEstado: string) => {
        try {
            const nuevoEstado = currentEstado === 'Completada' ? 'Pendiente' : 'Completada';
            
            const response = await fetch(`/api/paciente/tareas/${tareaId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado: nuevoEstado }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la tarea');
            }

            // Actualizar el estado local
            setTareas(prevTareas =>
                prevTareas.map(tarea =>
                    tarea.id === tareaId ? { ...tarea, estado: nuevoEstado } : tarea
                )
            );
        } catch (err: any) {
            console.error('Error al actualizar tarea:', err);
            alert('Error al actualizar la tarea');
        }
    };

    const getPrioridadColor = (prioridad: string) => {
        switch (prioridad) {
            case 'Alta':
                return 'bg-red-100 text-red-700 border-red-300';
            case 'Media':
                return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            case 'Baja':
                return 'bg-green-100 text-green-700 border-green-300';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    const formatFecha = (fecha: string | null) => {
        if (!fecha) return null;
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        });
    };

    const tareasFiltradas = tareas.filter(tarea => {
        if (filtro === 'todas') return true;
        if (filtro === 'pendientes') return tarea.estado !== 'Completada';
        if (filtro === 'completadas') return tarea.estado === 'Completada';
        return true;
    });

    const contadores = {
        todas: tareas.length,
        pendientes: tareas.filter(t => t.estado !== 'Completada').length,
        completadas: tareas.filter(t => t.estado === 'Completada').length,
    };

    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 via-pink-50 to-white">
                <LoadingIndicator text="Cargando tareas..." className="[&>p]:text-gray-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 via-pink-50 to-white px-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
                    <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            fetchTareas();
                        }}
                        className="px-6 py-2 bg-[var(--color-theme-primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-100 via-pink-50 to-white pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--color-theme-primary)] to-[var(--color-theme-primary-dark)] text-white sticky top-0 z-40 shadow-lg">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <IconButton
                        icon="back"
                        onClick={() => router.back()}
                        bgColor="rgba(255, 255, 255, 0.2)"
                        iconColor="white"
                        ariaLabel="Volver"
                    />
                    <h1 className="text-xl font-bold">Mis Tareas</h1>
                    <div className="w-10" />
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Filtros */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    <button
                        onClick={() => setFiltro('todas')}
                        className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                            filtro === 'todas'
                                ? 'bg-[var(--color-theme-primary)] text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        Todas ({contadores.todas})
                    </button>
                    <button
                        onClick={() => setFiltro('pendientes')}
                        className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                            filtro === 'pendientes'
                                ? 'bg-[var(--color-theme-primary)] text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        Pendientes ({contadores.pendientes})
                    </button>
                    <button
                        onClick={() => setFiltro('completadas')}
                        className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                            filtro === 'completadas'
                                ? 'bg-[var(--color-theme-primary)] text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        Completadas ({contadores.completadas})
                    </button>
                </div>

                {/* Lista de tareas */}
                {tareasFiltradas.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-[var(--color-theme-primary-light)] to-[var(--color-theme-primary)] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {filtro === 'todas' && 'En este momento no tienes tareas'}
                            {filtro === 'pendientes' && '¡Todo completado!'}
                            {filtro === 'completadas' && 'Aún no has completado tareas'}
                        </h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            {filtro === 'todas' && 'Tu psicólogo te asignará actividades y tareas terapéuticas que aparecerán aquí. ¡Mantente atento!'}
                            {filtro === 'pendientes' && '¡Excelente trabajo! Has completado todas tus tareas pendientes. Tu psicólogo puede asignarte nuevas actividades pronto.'}
                            {filtro === 'completadas' && 'A medida que completes tus tareas, aparecerán aquí para que puedas hacer seguimiento de tu progreso.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tareasFiltradas.map((tarea) => (
                            <div
                                key={tarea.id}
                                className={`bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5 ${
                                    tarea.estado === 'Completada' ? 'opacity-75' : ''
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Checkbox */}
                                    <button
                                        onClick={() => handleToggleComplete(tarea.id, tarea.estado)}
                                        className="flex-shrink-0 mt-1 active:scale-95 transition-transform"
                                        aria-label={tarea.estado === 'Completada' ? 'Marcar como pendiente' : 'Marcar como completada'}
                                    >
                                        {tarea.estado === 'Completada' ? (
                                            <CheckCircle2 className="w-7 h-7 text-[var(--color-theme-primary)]" />
                                        ) : (
                                            <Circle className="w-7 h-7 text-gray-300 hover:text-[var(--color-theme-primary)] transition-colors" />
                                        )}
                                    </button>

                                    {/* Contenido */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className={`font-bold text-gray-800 text-lg ${tarea.estado === 'Completada' ? 'line-through' : ''}`}>
                                                {tarea.titulo}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-md text-xs font-semibold border flex-shrink-0 ${getPrioridadColor(tarea.prioridad)}`}>
                                                {tarea.prioridad}
                                            </span>
                                        </div>

                                        <p className={`text-gray-600 text-sm mb-3 ${tarea.estado === 'Completada' ? 'line-through' : ''}`}>
                                            {tarea.descripcion}
                                        </p>

                                        {/* Footer info */}
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                            {tarea.categoria && (
                                                <span className="px-2 py-1 bg-[var(--color-theme-primary-light)] text-[var(--color-theme-primary)] rounded-full font-medium">
                                                    {tarea.categoria}
                                                </span>
                                            )}
                                            {tarea.fechaLimite && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {formatFecha(tarea.fechaLimite)}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {tarea.estado}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

