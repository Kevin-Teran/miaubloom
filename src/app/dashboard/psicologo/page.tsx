/**
 * @file page.tsx
 * @route app/dashboard/psicologo/page.tsx
 * @description Dashboard principal para psicólogos.
 * Incluye lista de pacientes, citas pendientes y notificaciones importantes.
 * @author Kevin Mariano
 * @version 2.0.5
 * @since 1.0.0
 * @copyright MiauBloom
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context;
import { supabase } from '@/src/lib/supabase';
import {
  Settings,
  Bell,
  Calendar,
  Home,
  MessageCircle,
  Users,
  User,
  Cat
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import type { Database } from '@/src/lib/database.types';

type Perfil = Database['public']['Tables']['perfiles']['Row'];
type Cita = Database['public']['Tables']['citas']['Row'] & {
  paciente?: Perfil;
};

export default function DashboardPsicologoPage() {
  const { user, perfil, loading } = useAuth();
  const router = useRouter();
  const [citasHoy, setCitasHoy] = useState<Cita[]>([]);
  const [pacientesActivos, setPacientesActivos] = useState(0);

  useEffect(() => {
    if (!loading && (!user || !perfil || perfil.rol !== 'psicologo')) {
      router.push('/');
      return;
    }

    if (user && perfil?.rol === 'psicologo') {
      fetchCitasHoy();
      fetchPacientesActivos();
    }
  }, [user, perfil, loading, router]);

  const fetchCitasHoy = async () => {
    if (!user) return;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const { data } = await supabase
      .from('citas')
      .select(`
        *,
        paciente:perfiles!citas_paciente_id_fkey(*)
      `)
      .eq('psicologo_id', user.id)
      .gte('fecha_hora', hoy.toISOString())
      .lt('fecha_hora', manana.toISOString())
      .order('fecha_hora', { ascending: true });

    if (data) setCitasHoy(data as Cita[]);
  };

  const fetchPacientesActivos = async () => {
    if (!user) return;

    const { count } = await supabase
      .from('relacion_paciente_psicologo')
      .select('*', { count: 'exact', head: true })
      .eq('psicologo_id', user.id)
      .eq('estado', 'activa');

    if (count !== null) setPacientesActivos(count);
  };

  if (loading || !perfil) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2C2C1]/20 to-white pb-20">
      <div className="bg-[#F2C2C1] px-4 py-6 rounded-b-3xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => router.push('/dashboard/psicologo/configuracion')}>
            <Settings className="w-6 h-6 text-white" />
          </button>
          <button onClick={() => router.push('/dashboard/psicologo/notificaciones')}>
            <Bell className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <Cat className="w-6 h-6 text-[#F2C2C1]" />
          </div>
          <div className="text-white">
            <p className="text-sm opacity-90">Hola, Andrés!</p>
            <p className="text-lg font-semibold">Empecemos</p>
          </div>
        </div>

        <div className="flex items-center justify-center py-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Cat className="w-16 h-16 text-[#F2C2C1]" />
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-[#F2C2C1]">{citasHoy.length}</div>
              <div className="text-sm text-gray-600 mt-1">Citas hoy</div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-[#2ECC71]">{pacientesActivos}</div>
              <div className="text-sm text-gray-600 mt-1">Pacientes activos</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Mis pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  onClick={() => router.push('/dashboard/psicologo/pacientes')}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                >
                  <div className="w-12 h-12 bg-[#F2C2C1]/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-[#F2C2C1]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Paciente {i}</p>
                    <p className="text-xs text-gray-600">Última sesión hace 3 días</p>
                  </div>
                  <Badge
                    variant={i === 1 ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {i === 1 ? 'Crítico' : 'Estable'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Citas pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            {citasHoy.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No tienes citas programadas para hoy
              </p>
            ) : (
              <div className="space-y-3">
                {citasHoy.map((cita) => (
                  <div
                    key={cita.id}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-[#F2C2C1]/10"
                  >
                    <Calendar className="w-10 h-10 text-[#F2C2C1]" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {new Date(cita.fecha_hora).toLocaleTimeString('es', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-xs text-gray-600">
                        {cita.duracion_minutos} minutos
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex justify-around items-center">
          <button className="flex flex-col items-center space-y-1">
            <Home className="w-6 h-6 text-[#F2C2C1]" />
            <span className="text-xs text-[#F2C2C1] font-medium">Home</span>
          </button>
          <button
            onClick={() => router.push('/dashboard/psicologo/chat')}
            className="flex flex-col items-center space-y-1"
          >
            <MessageCircle className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Mensajes</span>
          </button>
          <button
            onClick={() => router.push('/dashboard/psicologo/citas')}
            className="flex flex-col items-center space-y-1"
          >
            <Calendar className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Citas</span>
          </button>
          <button
            onClick={() => router.push('/dashboard/psicologo/pacientes')}
            className="flex flex-col items-center space-y-1"
          >
            <Users className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Pacientes</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
