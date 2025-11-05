"use client";

export const dynamic = 'force-dynamic';

/**
 * @file page.tsx
 * @route src/app/inicio/psicologo/page.tsx
 * @description Dashboard para Psicólogo con estructura desktop mejorada
 * @author Kevin Mariano
 * @version 3.3.0 // Versión actualizada con diseño móvil mejorado
 * @since 1.0.0
 * @copyright MiauBloom
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

// Interfaz para Paciente
interface Paciente {
  id: string;
  nombre: string;
  avatar: string;
  status: string;
}

// Componente Modal de Todos los Pacientes
const PatientesModal = ({ 
  pacientes, 
  onClose 
}: { 
  pacientes: Paciente[]; 
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center justify-center">
      <div className="bg-white w-full lg:w-2/3 lg:max-w-2xl rounded-t-3xl lg:rounded-3xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col animate-in">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">Todos mis pacientes</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Lista scrolleable */}
        <div className="overflow-y-auto flex-1 px-4 py-4">
          <div className="space-y-3">
            {pacientes.map((paciente, index) => (
              <div
                key={paciente.id || index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 border border-gray-100"
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: 'var(--color-theme-primary-light)' }}>
                  <Image 
                    src={paciente.avatar} 
                    alt={paciente.nombre || 'Avatar de Paciente'} 
                    fill 
                    className="object-cover pointer-events-none" 
                    unoptimized 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 mb-1">{paciente.nombre}</h3>
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                    paciente.status === 'Estable' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-orange-100 text-orange-600'
                  }`}>
                    {paciente.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Card de Paciente
const PatientCard = ({ 
    nombre, 
    avatar, 
    status,
    onClick 
}: { 
    nombre: string; 
    avatar: string; 
    status: string;
    onClick?: () => void;
}) => {
    return (
        <button
            onClick={onClick}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 w-full text-left"
        >
            <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: 'var(--color-theme-primary-light)' }}>
                    <Image 
                      src={avatar} 
                      alt={nombre || 'Avatar de Paciente'} 
                      fill 
                      className="object-cover pointer-events-none" 
                      unoptimized
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 mb-1 truncate">
                        {nombre}
                    </h4>
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        status === 'Estable' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-orange-100 text-orange-600'
                    }`}>
                        {status}
                    </span>
                </div>
            </div>
        </button>
    );
};

// Componente de Gráfico Circular de Estadística
const StatChart = ({ 
    label, 
    value, 
    percentage, 
    color 
}: { 
    label: string; 
    value: string; 
    percentage: number; 
    color: string;
}) => {
    const circumference = 2 * Math.PI * 45;
    const boundedPercentage = Math.max(0, Math.min(100, percentage));
    const strokeDashoffset = circumference - (boundedPercentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 mb-3">
                <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="45" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                    <circle
                        cx="48" cy="48" r="45"
                        stroke={color}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-800">{value}</span>
                </div>
            </div>
            <span className="text-sm font-medium text-gray-600 text-center">{label}</span>
        </div>
    );
};

// Botón de navegación móvil
const NavButton = ({ href, icon, label, isActive = false }: { href: string; icon: React.ReactNode; label: string; isActive?: boolean; }) => {
    const textColor = isActive ? 'text-[var(--color-theme-primary)]' : 'text-gray-400';
    return (
        <Link href={href} className={`flex flex-col items-center gap-0.5 ${textColor}`}>
            {icon}
            <span className="text-[10px] mt-0.5">{label}</span>
        </Link>
    );
};

export default function InicioPsicologoPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [showAllModal, setShowAllModal] = useState(false);

    const [stats, setStats] = useState({
      citasSemana: 0,
      seguimientos: 0
    });
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [dataError, setDataError] = useState<string | null>(null);
    const [isRetrying, setIsRetrying] = useState(false);

    // Cargar pacientes y estadísticas del psicólogo
    const fetchData = async () => {
      setIsDataLoading(true);
      setDataError(null);
      try {
          // Fetch Pacientes
          const responsePacientes = await fetch('/api/psicologo/pacientes');
          if (responsePacientes.ok) {
              const data = await responsePacientes.json();
              setPacientes(data.pacientes || []);
          } else if (responsePacientes.status !== 401) {
              setDataError('Error al cargar pacientes');
          }

          // Fetch Estadísticas (API Real)
          const responseStats = await fetch('/api/psicologo/stats');
          if (responseStats.ok) {
              const statsData = await responseStats.json();
              if (statsData.success && statsData.stats) {
                  setStats({
                      citasSemana: statsData.stats.citasSemana || 0,
                      seguimientos: statsData.stats.seguimientos || 0
                  });
              }
          } else if (responseStats.status !== 401) {
              setDataError('Error al cargar estadísticas');
          }

      } catch (error) {
          console.error('Error fetching dashboard data:', error);
          setDataError('Error de conexión. Intenta de nuevo.');
      } finally {
          setIsDataLoading(false);
          setIsRetrying(false);
      }
    };

    const handleRetry = async () => {
      setIsRetrying(true);
      await fetchData();
    };

    useEffect(() => {
        if (!user) {
            return;
        }

        fetchData();
    }, [user]);

    // Redirigir a login si no hay usuario después de esperar
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!user) {
                router.push('/auth/login/psicologo');
            }
        }, 3000); // Esperar 3 segundos antes de redirigir
        
        return () => clearTimeout(timer);
    }, [user, router]);

    if (isDataLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[var(--color-theme-primary-light)] via-white to-white">
                <LoadingIndicator
                    text="Cargando tu espacio..."
                    className="[&>p]:text-gray-600 [&>div]:opacity-50"
                    trackColor="var(--color-theme-primary-light)"
                    barColor="var(--color-theme-primary)"
                />
            </div>
        );
    }

    // Mostrar error si existe
    if (dataError) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[var(--color-theme-primary-light)] via-white to-white px-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
                    <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar</h2>
                    <p className="text-gray-600 mb-6">{dataError}</p>
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
    const themeColor = 'var(--color-theme-primary)';

    // Función para cerrar sesión
    const handleSignOut = async () => {
        try {
            const response = await fetch('/api/auth/logout', { method: 'POST' });
            if (response.ok) {
                if (typeof window !== 'undefined') {
                    localStorage.clear();
                    sessionStorage.clear();
                }
                // Usar router.push en lugar de window.location.href para evitar doble recarga
                router.push('/identificacion');
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            router.push('/identificacion');
        }
    };

    return (
        <>
            {/* ============================================
                VERSIÓN MÓVIL - REDISEÑADA COMO LA REFERENCIA
            ============================================ */}
            <div className="lg:hidden flex flex-col min-h-screen bg-white select-none">
                {/* Header con fondo de color tema */}
                <header className="rounded-b-3xl shadow-lg pt-8 pb-8 px-6" style={{ backgroundColor: 'var(--color-theme-primary-light)' }}>
                    <div className="flex justify-between items-center mb-6">
                        <Link href="/ajustes/psicologo" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </Link>
                        <Link href="/notificaciones/psicologo" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                        </Link>
                    </div>2

                    {/* Saludo */}
                    <div className="text-center mb-4">
                        <h2 className="text-sm text-gray-600 mb-1">Hola, {user!.nombreCompleto.split(' ')[0]}!</h2>
                        <p className="text-xl font-bold text-gray-800">Empecemos</p>
                    </div>
                    
                    {/* Avatar del gato más grande y centrado */}
                    <div className="relative w-28 h-28 mx-auto mb-4">
                        <Image
                            src={user!.avatarUrl || "/assets/avatar-psicologo.png"}
                            alt="Avatar Psicólogo"
                            fill
                            className="object-contain drop-shadow-lg"
                            priority
                            unoptimized
                        />
                    </div>

                    {/* Fecha en formato circular */}
                    <div className="flex justify-center items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                            <span className="text-base font-bold" style={{ color: themeColor }}>{formattedDate}</span>
                            <span className="text-[8px] uppercase text-gray-400 -mt-1">{formattedMonth}</span>
                        </div>
                        <span className="text-xs text-gray-600">Hoy</span>
                    </div>
                </header>

                {/* Contenido Principal con scroll */}
                <main className="flex-1 overflow-y-auto px-6 pb-24">
                    {/* Sección Mis Pacientes */}
                    <section className="mb-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Mis pacientes</h3>
                        <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
                            {pacientes.slice(0, 4).map((paciente, index) => (
                                <Link 
                                    href={`/inicio/psicologo/paciente/${paciente.id}`} 
                                    key={paciente.id || index} 
                                    className="flex-shrink-0 text-center"
                                >
                                    <div className="bg-white rounded-2xl p-3 shadow-sm mb-2 w-20">
                                        <div className="relative w-14 h-14 mx-auto mb-2 rounded-full overflow-hidden">
                                            <Image 
                                                src={paciente.avatar} 
                                                alt={paciente.nombre || 'Avatar de Paciente'} 
                                                fill 
                                                className="object-cover" 
                                                unoptimized 
                                            />
                                        </div>
                                        <span className={`inline-block px-2 py-0.5 text-[9px] font-semibold rounded-full w-full ${
                                            paciente.status === 'Estable' 
                                                ? 'bg-purple-100 text-purple-600' 
                                                : 'bg-orange-100 text-orange-600'
                                        }`}>
                                            {paciente.status}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-600 font-medium">{paciente.nombre.split(' ')[0]}</span>
                                </Link>
                            ))}
                            {pacientes.length > 4 && (
                                <button 
                                    onClick={() => setShowAllModal(true)}
                                    className="flex-shrink-0 text-center"
                                >
                                    <div className="bg-white/60 rounded-2xl p-3 shadow-sm mb-2 w-20 h-[88px] flex items-center justify-center">
                                        <span className="text-2xl text-gray-400">+{pacientes.length - 4}</span>
                                    </div>
                                    <span className="text-xs text-gray-600 font-medium">Ver más</span>
                                </button>
                            )}
                        </div>
                    </section>

                    {/* Cards de Acciones */}
                    <section className="space-y-3 mb-6">
                        <Link 
                            href="/inicio/psicologo/citas" 
                            className="block bg-[var(--color-theme-primary-light)]/80 rounded-3xl p-5 shadow-sm active:scale-98 transition-transform"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-gray-800 text-base mb-1">Mis Citas</h4>
                                    <p className="text-xs text-gray-600">
                                        {stats.citasSemana > 0 
                                            ? `${stats.citasSemana} citas esta semana` 
                                            : 'Sin citas pendientes'}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-white/60 rounded-2xl flex items-center justify-center">
                                    <svg className="w-6 h-6" style={{ color: themeColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </Link>

                        <Link 
                            href="/inicio/psicologo/seguimientos" 
                            className="block bg-[var(--color-theme-primary)]/20 rounded-3xl p-5 shadow-sm active:scale-98 transition-transform"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-gray-800 text-base mb-1">Seguimientos</h4>
                                    <p className="text-xs text-gray-600">
                                        {stats.seguimientos} pacientes activos
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-white/60 rounded-2xl flex items-center justify-center">
                                    <svg className="w-6 h-6" style={{ color: themeColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    </section>
                </main>

                {/* Barra de Navegación Inferior más minimalista */}
                <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100">
                    <div className="flex justify-around items-center h-16 px-4">
                        <NavButton
                            href="/inicio/psicologo"
                            label="Inicio"
                            isActive={true}
                            icon={
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                </svg>
                            }
                        />
                        
                        <NavButton
                            href="/inicio/psicologo/pacientes"
                            label="Pacientes"
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                </svg>
                            }
                        />
                        
                        <NavButton
                            href="/inicio/psicologo/citas"
                            label="Agenda"
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            }
                        />
                        
                        <NavButton
                            href="/perfil/psicologo"
                            label="Perfil"
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            }
                        />
                    </div>
                </nav>
            </div>

            {/* ============================================
                VERSIÓN DESKTOP - ESTRUCTURA MEJORADA (SIN CAMBIOS)
            ============================================ */}
            <div className="hidden lg:block min-h-screen bg-white">
                {/* Header Desktop */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                    <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 relative">
                                <Image
                                    src="/assets/avatar-psicologo.png"
                                    alt="MiauBloom"
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">MiauBloom</h1>
                                <p className="text-xs text-gray-500">Panel de Psicólogo</p>
                            </div>
                        </div>

                        {/* Usuario y acciones */}
                        <div className="flex items-center gap-4">
                            {/* Fecha */}
                            <div className="flex items-center gap-2 bg-[var(--color-theme-primary-light)] rounded-full px-4 py-2">
                                <svg className="w-4 h-4 text-[var(--color-theme-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm font-semibold text-gray-700">
                                    {formattedDate} {formattedMonth}
                                </span>
                            </div>

                            {/* Notificaciones */}
                            <Link href="/notificaciones/psicologo" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </Link>

                            {/* Perfil */}
                            <Link href="/perfil/psicologo" className="flex items-center gap-3 hover:bg-gray-50 rounded-full pl-3 pr-4 py-2 transition-colors">
                                <div className="w-10 h-10 relative">
                                    <Image
                                        src={user!.avatarUrl || "/assets/avatar-psicologo.png"}
                                        alt="Avatar"
                                        fill
                                        className="object-contain rounded-full"
                                        unoptimized
                                    />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-gray-800">{user!.nombreCompleto}</p>
                                    <p className="text-xs text-gray-500">Psicólogo</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Contenido Principal Desktop */}
                <div className="max-w-7xl mx-auto px-8 py-8">
                    <div className="grid grid-cols-12 gap-8">
                        {/* COLUMNA IZQUIERDA - Avatar y Navegación */}
                        <aside className="col-span-3 space-y-6">
                            {/* Card de Saludo */}
                            <div className="bg-gradient-to-br from-[var(--color-theme-primary-light)] to-[var(--color-theme-primary-light)]/60 rounded-3xl p-6 text-center shadow-lg">
                                <div className="w-32 h-32 relative mx-auto mb-4">
                                    <Image
                                        src={user!.avatarUrl || "/assets/avatar-psicologo.png"}
                                        alt="Avatar"
                                        fill
                                        className="object-contain"
                                        priority
                                        unoptimized
                                    />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">
                                    ¡Hola, Dr. {user!.nombreCompleto.split(' ')[0]}!
                                </h2>
                                <p className="text-gray-600">
                                    Empecemos el día
                                </p>
                            </div>

                            {/* Navegación */}
                            <nav className="bg-white rounded-3xl p-4 shadow-lg space-y-2">
                                <Link href="/inicio/psicologo" className="flex items-center gap-3 px-4 py-3 bg-[var(--color-theme-primary-light)] text-[var(--color-theme-primary)] rounded-xl font-semibold transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                    Inicio
                                </Link>
                                <Link href="/inicio/psicologo/pacientes" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    Mis Pacientes
                                </Link>
                                <Link href="/inicio/psicologo/citas" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Agenda
                                </Link>
                                <Link href="/ajustes/psicologo" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Ajustes
                                </Link>
                                <div className="h-px bg-gray-200 my-2"></div>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Cerrar Sesión
                                </button>
                            </nav>

                            {/* Botón de Acción */}
                            <Link
                                href="/acciones/psicologo"
                                className="block w-full bg-gradient-to-r from-[var(--color-theme-primary)] to-[var(--color-theme-primary-dark)] text-white font-bold py-4 rounded-2xl text-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                            >
                                + Nueva Acción
                            </Link>
                        </aside>

                        {/* COLUMNA CENTRAL - Contenido Principal */}
                        <main className="col-span-6 space-y-8">
                            {/* Mis Pacientes */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-bold text-gray-800">Mis pacientes</h3>
                                    <button onClick={() => setShowAllModal(true)} className="text-sm hover:text-opacity-80 font-semibold transition-colors" style={{ color: 'var(--color-theme-primary)' }}>
                                        Ver todos ({pacientes.length}) →
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {pacientes.slice(0, 4).map((paciente, index) => (
                                        <PatientCard
                                            key={paciente.id || index}
                                            nombre={paciente.nombre}
                                            avatar={paciente.avatar}
                                            status={paciente.status}
                                            onClick={() => router.push(`/inicio/psicologo/paciente/${paciente.id}`)}
                                        />
                                    ))}
                                </div>
                            </section>

                            {/* Citas Pendientes */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-bold text-gray-800">Citas pendientes</h3>
                                    <Link href="/inicio/psicologo/citas" className="text-sm hover:text-opacity-80 font-semibold transition-colors" style={{ color: 'var(--color-theme-primary)' }}>
                                        Ver agenda →
                                    </Link>
                                </div>
                                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-md text-center">
                                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {stats.citasSemana > 0 ? (
                                        <>
                                            <p className="text-gray-500 mb-3">Tienes {stats.citasSemana} cita(s) programada(s) esta semana.</p>
                                            <Link href="/inicio/psicologo/citas" className="inline-block text-sm font-semibold hover:underline" style={{ color: 'var(--color-theme-primary)' }}>
                                                Ver agenda
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-gray-500 mb-3">No tienes citas programadas para hoy.</p>
                                            <Link href="/inicio/psicologo/citas" className="inline-block text-sm font-semibold hover:underline" style={{ color: 'var(--color-theme-primary)' }}>
                                                Programar nueva cita
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </section>
                        </main>

                        {/* COLUMNA DERECHA - Estadísticas */}
                        <aside className="col-span-3">
                            <section>
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Estadísticas</h3>
                                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg space-y-6">
                                    
                                    <StatChart
                                        label="Total Pacientes"
                                        value={pacientes.length.toString()}
                                        percentage={(pacientes.length / 20) * 100} 
                                        color="#22D3EE"
                                    />
                                    <StatChart
                                        label="Citas Esta Semana"
                                        value={stats.citasSemana.toString()}
                                        percentage={(stats.citasSemana / 10) * 100}
                                        color="#FCD34D"
                                    />
                                    <StatChart
                                        label="Seguimientos"
                                        value={stats.seguimientos.toString()}
                                        percentage={(stats.seguimientos / 20) * 100}
                                        color="#C084FC"
                                    />

                                </div>
                            </section>
                        </aside>
                    </div>
                </div>
            </div>

            {/* Modal de Todos los Pacientes */}
            {showAllModal && (
                <PatientesModal pacientes={pacientes} onClose={() => setShowAllModal(false)} />
            )}
        </>
    );
}