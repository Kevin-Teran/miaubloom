'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import IconButton from '@/components/ui/IconButton';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';

// --- Tipos de Datos ---
interface Cita {
  id: number;
  fechaHoraInicio: string;
  estado: string;
  paciente: {
    id: string;
    nombreCompleto: string;
    avatar: string;
  };
}

/**
 * @component CitaCard
 * @description Tarjeta individual que muestra la información de una cita
 */
const CitaCard = ({ cita }: { cita: Cita }) => {
  const fecha = new Date(cita.fechaHoraInicio);
  const esFutura = fecha > new Date();

  return (
    <div className={`bg-white p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow border ${esFutura ? 'border-[#F2C2C1]' : 'border-gray-200'}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`relative w-14 h-14 rounded-full overflow-hidden ring-2 ${esFutura ? 'ring-[#F2C2C1]' : 'ring-gray-200'}`}>
          <Image
            src={cita.paciente.avatar}
            alt={cita.paciente.nombreCompleto}
            width={56}
            height={56}
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-[#070806] text-base">{cita.paciente.nombreCompleto}</h3>
          <p className={`text-sm font-medium ${esFutura ? 'text-[#F2C2C1]' : 'text-[#B6BABE]'}`}>
            {cita.estado}
          </p>
        </div>
      </div>
      <div className="bg-[#FFF5F5] rounded-2xl p-3 flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5 text-sm text-[#070806]">
          <Calendar size={18} className="text-[#F2C2C1]" />
          <span className="font-medium">{fecha.toLocaleDateString('es-ES', { dateStyle: 'long' })}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-[#070806]">
          <Clock size={18} className="text-[#F2C2C1]" />
          <span className="font-medium">{fecha.toLocaleTimeString('es-ES', { timeStyle: 'short' })}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * @component CitasContent
 * @description Contenido principal de la página
 */
const CitasContent = () => {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [citas, setCitas] = useState<Cita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      router.replace('/inicio/psicologo/citas', { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!isAuthLoading && user) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const resCitas = await fetch('/api/psicologo/citas');
          if (!resCitas.ok) throw new Error('Error al cargar citas');
          const dataCitas = await resCitas.json();
          setCitas(dataCitas.citas || []);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Un error ocurrió');
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [user, isAuthLoading]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingIndicator text="Cargando agenda..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-white to-[#FFF5F5] pb-12">
      {/* Encabezado */}
      <header className="bg-white/80 backdrop-blur-sm p-4 shadow-sm sticky top-0 z-10 border-b border-[#F2C2C1]/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <IconButton
              icon="back"
              onClick={() => router.back()}
              bgColor="#F2C2C1"
              ariaLabel="Volver"
            />
            <div>
              <h1 className="text-xl font-bold text-[#070806]">Agenda de Citas</h1>
              <p className="text-sm text-[#B6BABE]">Gestiona tus sesiones</p>
            </div>
          </div>
          <Button 
            onClick={() => router.push('/inicio/psicologo/citas/nueva')}
            className="bg-[#F2C2C1] hover:bg-[#F2C2C1]/90 text-white font-semibold rounded-2xl shadow-sm"
          >
            + Nueva Cita
          </Button>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-6xl mx-auto p-6">
        {showSuccess && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 px-5 py-4 rounded-2xl mb-6 shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-lg">✓</span>
            </div>
            <span className="font-medium">¡Cita agendada con éxito!</span>
          </div>
        )}

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl mb-6 shadow-sm">
            {error}
          </div>
        )}

        {citas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {citas.map((cita) => (
              <CitaCard key={cita.id} cita={cita} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-white rounded-3xl shadow-sm mb-6">
              <Calendar size={64} className="text-[#F2C2C1] mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-[#070806] mb-2">No hay citas programadas</h3>
            <p className="text-sm text-[#B6BABE] mb-6">Usa el botón &quot;+ Nueva Cita&quot; para empezar.</p>
          </div>
        )}
      </main>
    </div>
  );
};

/**
 * @component CitasPage
 * @description Wrapper de Suspense para manejar searchParams
 */
export default function CitasPage() {
  return (
    <Suspense fallback={<LoadingIndicator text="Cargando..." />}>
      <CitasContent />
    </Suspense>
  );
}