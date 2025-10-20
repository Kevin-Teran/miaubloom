/**
 * @file page.tsx
 * @route src/app/dashboard/paciente/page.tsx
 * @description Dashboard principal para pacientes. Muestra jardín emocional, tareas y citas.
 * @author Kevin Mariano
 * @version 3.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Settings,
  MessageCircle,
  Calendar,
  Plus,
  Home,
  BarChart3,
  User,
  Cat
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPacientePage() {
  const { user, perfil, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'patient')) {
      router.push('/');
      return;
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2C2C1]/20 to-background pb-20">
      {/* Header */}
      <div className="bg-[#F2C2C1] px-4 py-6 rounded-b-3xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => router.push('/dashboard/paciente/configuracion')}>
            <Settings className="w-6 h-6 text-white" />
          </button>
          <button onClick={() => router.push('/dashboard/paciente/chat')}>
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <Cat className="w-6 h-6 text-[#F2C2C1]" />
          </div>
          <div className="text-white">
            <p className="text-sm opacity-90">Hola,</p>
            <p className="text-xl font-semibold">{user.full_name.split(' ')[0]}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Cat className="w-20 h-20 text-[#F2C2C1]" />
          </div>
        </div>

        <div className="text-center mt-4 text-white">
          <p className="text-sm">¿Cómo te sientes hoy?</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg">Mis tareas</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard/paciente/tareas')}
            >
              Ver todas
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-4">
              No tienes tareas pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Mi actividad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-[#FFD700]/10 rounded-lg">
                <div className="text-2xl font-bold text-[#FFD700]">68%</div>
                <div className="text-xs text-muted-foreground mt-1">Alegría</div>
              </div>
              <div className="p-3 bg-[#2ECC71]/10 rounded-lg">
                <div className="text-2xl font-bold text-[#2ECC71]">75%</div>
                <div className="text-xs text-muted-foreground mt-1">Calma</div>
              </div>
              <div className="p-3 bg-[#4A90E2]/10 rounded-lg">
                <div className="text-2xl font-bold text-[#4A90E2]">65%</div>
                <div className="text-xs text-muted-foreground mt-1">Tristeza</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3">
        <div className="flex justify-around items-center">
          <button className="flex flex-col items-center space-y-1">
            <Home className="w-6 h-6 text-[#F2C2C1]" />
            <span className="text-xs text-[#F2C2C1] font-medium">Home</span>
          </button>
          <button
            onClick={() => router.push('/dashboard/paciente/calendario')}
            className="flex flex-col items-center space-y-1"
          >
            <BarChart3 className="w-6 h-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Estadísticas</span>
          </button>
          <button
            onClick={() => router.push('/dashboard/paciente/registrar')}
            className="w-14 h-14 bg-[#F2C2C1] rounded-full flex items-center justify-center -mt-6 shadow-lg"
          >
            <Plus className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={() => router.push('/dashboard/paciente/citas')}
            className="flex flex-col items-center space-y-1"
          >
            <Calendar className="w-6 h-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Citas</span>
          </button>
          <button
            onClick={() => router.push('/dashboard/paciente/perfil')}
            className="flex flex-col items-center space-y-1"
          >
            <User className="w-6 h-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}