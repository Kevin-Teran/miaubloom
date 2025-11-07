"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { UsageSchedule } from '@/components/profile/UsageSchedule';
import { UsageDuration } from '@/components/profile/UsageDuration';
import { ProfilePhotoSection } from '@/components/profile/ProfilePhotoSection';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { EllipseCorner } from '@/components/EllipseCorner';
import { useAuth } from '@/context/AuthContext';
import { Save } from 'lucide-react';

interface UserData {
  id?: string;
  nombreCompleto: string;
  perfil?: {
    nicknameAvatar?: string;
    fotoPerfil?: string;
    horarioUso?: string;
    duracionUso?: string;
  };
}

const AVATARS = [
  '/assets/avatar-paciente.png',
  '/assets/gato-inicio-1.png',
  '/assets/gato-inicio-2.png',
];

export default function PacienteProfilePage() {
  const router = useRouter();
  const { user: authUser, isLoading: isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState('3-8');
  const [selectedDuration, setSelectedDuration] = useState('3-8');
  const [fotoPerfil, setFotoPerfil] = useState('/assets/avatar-paciente.png');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isAuthLoading || !authUser) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/user', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.authenticated) {
            setUserData(data.user);
            setSelectedSchedule(data.user.perfil?.horarioUso || '3-8');
            setSelectedDuration(data.user.perfil?.duracionUso || '3-8');
            setFotoPerfil(data.user.perfil?.fotoPerfil || '/assets/avatar-paciente.png');
          } else {
            router.push('/auth/login/paciente');
          }
        } else {
          router.push('/auth/login/paciente');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/auth/login/paciente');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router, authUser, isAuthLoading]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/perfil/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          horarioUso: selectedSchedule,
          duracionUso: selectedDuration,
          fotoPerfil: fotoPerfil,
        }),
      });

      if (response.ok) {
        setShowConfirmModal(false);
        router.push('/inicio/paciente');
      } else {
        alert('Error al guardar el perfil');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error al guardar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <LoadingIndicator text="Cargando tu perfil..." />
      </div>
    );
  }

  if (!authUser || !userData) return null;

  return (
    <div className="min-h-screen bg-white pb-12 md:pb-16 relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <EllipseCorner />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* LAYOUT DESKTOP */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8 lg:pt-8">
          {/* COLUMNA IZQUIERDA */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl shadow-lg p-8 border-t-4 border-[var(--color-theme-primary)]">
              <ProfileHeader
                nombre={userData.nombreCompleto}
                avatar={fotoPerfil}
                nicknameAvatar={userData.perfil?.nicknameAvatar || 'usuario'}
              />

              <div className="mt-8 space-y-4">
                <div className="bg-gradient-to-r from-[var(--color-theme-primary-light)] to-transparent rounded-xl p-4 border-l-4 border-[var(--color-theme-primary)]">
                  <h3 className="font-roboto font-semibold text-[#070806] mb-2" style={{ fontSize: '17px' }}>
                    Personaliza tu perfil
                  </h3>
                  <p className="font-roboto text-gray-600 leading-relaxed" style={{ fontSize: '15px' }}>
                    Configura tu foto, horario y duración de uso para una experiencia personalizada.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border-t-4 border-[var(--color-theme-primary)]">
              <div className="text-center mb-10">
                <h2 className="mb-3 font-roboto font-bold text-[var(--color-theme-primary)]" style={{ fontSize: '32px' }}>
                  Personaliza
                </h2>
                <p className="font-roboto font-medium text-[#070806]" style={{ fontSize: '20px' }}>
                  Tu perfil
                </p>
              </div>

              <div className="space-y-8">
                {/* Sección de Foto */}
                <div>
                  <h3 className="font-roboto font-semibold mb-4" style={{ fontSize: '17px', color: '#070806' }}>
                    Tu Foto
                  </h3>
                  <ProfilePhotoSection
                    currentPhoto={fotoPerfil}
                    onPhotoChange={setFotoPerfil}
                    userRole="paciente"
                    availableAvatars={AVATARS}
                  />
                </div>

                {/* Sección de Horario */}
                <div>
                  <h3 className="font-roboto font-semibold mb-4" style={{ fontSize: '17px', color: '#070806' }}>
                    Horario de Uso
                  </h3>
                  <UsageSchedule
                    selectedSchedule={selectedSchedule}
                    onScheduleChange={setSelectedSchedule}
                  />
                </div>

                {/* Sección de Duración */}
                <div>
                  <h3 className="font-roboto font-semibold mb-4" style={{ fontSize: '17px', color: '#070806' }}>
                    Duración de Uso
                  </h3>
                  <UsageDuration
                    selectedDuration={selectedDuration}
                    onDurationChange={setSelectedDuration}
                  />
                </div>
              </div>

              {/* Botón Guardar */}
              <div className="flex gap-4 mt-10">
                <button
                  onClick={() => router.back()}
                  className="flex-1 px-8 py-4 rounded-full font-roboto font-semibold"
                  style={{ fontSize: '17px', color: '#070806', backgroundColor: '#B6BABE' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full font-roboto font-semibold text-white hover:opacity-90 transition-opacity"
                  style={{ fontSize: '17px', backgroundColor: 'var(--color-theme-primary)' }}
                >
                  <Save size={20} />
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LAYOUT MÓVIL */}
        <div className="lg:hidden pt-6">
          <ProfileHeader
            nombre={userData.nombreCompleto}
            avatar={fotoPerfil}
            nicknameAvatar={userData.perfil?.nicknameAvatar || 'usuario'}
          />

          <div className="mt-6 rounded-3xl shadow-lg p-6 bg-white border-t-4 border-[var(--color-theme-primary)]">
            <h2 className="mb-2 font-roboto font-bold text-center text-[var(--color-theme-primary)]" style={{ fontSize: '28px' }}>
              Personaliza
            </h2>
            <p className="font-roboto font-medium text-center text-[#070806] mb-8" style={{ fontSize: '18px' }}>
              Tu perfil
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="font-roboto font-semibold mb-4" style={{ fontSize: '16px', color: '#070806' }}>
                  Tu Foto
                </h3>
                <ProfilePhotoSection
                  currentPhoto={fotoPerfil}
                  onPhotoChange={setFotoPerfil}
                  userRole="paciente"
                  availableAvatars={AVATARS}
                />
              </div>

              <div>
                <h3 className="font-roboto font-semibold mb-4" style={{ fontSize: '16px', color: '#070806' }}>
                  Horario de Uso
                </h3>
                <UsageSchedule
                  selectedSchedule={selectedSchedule}
                  onScheduleChange={setSelectedSchedule}
                />
              </div>

              <div>
                <h3 className="font-roboto font-semibold mb-4" style={{ fontSize: '16px', color: '#070806' }}>
                  Duración de Uso
                </h3>
                <UsageDuration
                  selectedDuration={selectedDuration}
                  onDurationChange={setSelectedDuration}
                />
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3.5 rounded-full font-roboto font-semibold"
                  style={{ fontSize: '16px', color: '#070806', backgroundColor: '#B6BABE' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-roboto font-semibold text-white"
                  style={{ fontSize: '16px', backgroundColor: 'var(--color-theme-primary)' }}
                >
                  <Save size={18} />
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title="¿Guardar cambios?"
        description="¿Estás seguro de que deseas guardar tu perfil con estos cambios?"
        confirmText="Guardar"
        cancelText="Cancelar"
        onConfirm={handleSaveProfile}
        onCancel={() => setShowConfirmModal(false)}
        isLoading={isSaving}
      />
    </div>
  );
}
