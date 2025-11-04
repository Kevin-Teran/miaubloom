'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
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
    especialidad?: string;
    tituloUniversitario?: string;
    numeroRegistro?: string;
  };
}

export default function PerfilPsicologoPage() {
  const router = useRouter();
  const { user: authUser, isLoading: isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [fotoPerfil, setFotoPerfil] = useState('/assets/avatar-psicologo.png');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [especialidad, setEspecialidad] = useState('');
  const [tituloUniversitario, setTituloUniversitario] = useState('');
  const [numeroRegistro, setNumeroRegistro] = useState('');

  useEffect(() => {
    if (isAuthLoading || !authUser) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/login');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.authenticated) {
            setUserData(data.user);
            setFotoPerfil(data.user.perfil?.fotoPerfil || '/assets/avatar-psicologo.png');
            setEspecialidad(data.user.perfil?.especialidad || '');
            setTituloUniversitario(data.user.perfil?.tituloUniversitario || '');
            setNumeroRegistro(data.user.perfil?.numeroRegistro || '');
          } else {
            router.push('/auth/login/psicologo');
          }
        } else {
          router.push('/auth/login/psicologo');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/auth/login/psicologo');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router, authUser, isAuthLoading]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/perfil/update-psicologo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fotoPerfil: fotoPerfil,
          especialidad: especialidad,
          tituloUniversitario: tituloUniversitario,
          numeroRegistro: numeroRegistro,
        }),
      });

      if (response.ok) {
        setShowConfirmModal(false);
        router.push('/inicio/psicologo');
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

  if (authUser?.rol !== 'Psicólogo' || !userData) return null;

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
            <div className="bg-white rounded-3xl shadow-lg p-8 border-t-4 border-blue-500">
              <ProfileHeader
                nombre={userData.nombreCompleto}
                avatar={fotoPerfil}
                nicknameAvatar={userData.perfil?.nicknameAvatar || 'psicólogo'}
              />

              <div className="mt-8 space-y-4">
                <div className="bg-gradient-to-r from-blue-100 to-transparent rounded-xl p-4 border-l-4 border-blue-500">
                  <h3 className="font-roboto font-semibold text-[#070806] mb-2" style={{ fontSize: '17px' }}>
                    Completa tu perfil
                  </h3>
                  <p className="font-roboto text-gray-600 leading-relaxed" style={{ fontSize: '15px' }}>
                    Actualiza tu foto de perfil e información profesional.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border-t-4 border-blue-500">
              <div className="text-center mb-10">
                <h2 className="mb-3 font-roboto font-bold text-blue-600" style={{ fontSize: '32px' }}>
                  Tu Perfil Profesional
                </h2>
                <p className="font-roboto font-medium text-[#070806]" style={{ fontSize: '20px' }}>
                  Psicólogo
                </p>
              </div>

              <div className="space-y-8">
                {/* Sección de Foto */}
                <div>
                  <h3 className="font-roboto font-semibold mb-4" style={{ fontSize: '17px', color: '#070806' }}>
                    Foto de Perfil
                  </h3>
                  <ProfilePhotoSection
                    currentPhoto={fotoPerfil}
                    onPhotoChange={setFotoPerfil}
                    userRole="psicologo"
                  />
                </div>

                {/* Sección de Especialidad */}
                <div>
                  <label className="block font-roboto font-semibold mb-3" style={{ fontSize: '17px', color: '#070806' }}>
                    Especialidad
                  </label>
                  <input
                    type="text"
                    value={especialidad}
                    onChange={(e) => setEspecialidad(e.target.value)}
                    placeholder="Ej: Psicología clínica, Terapia cognitivo-conductual..."
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none font-roboto"
                    style={{ fontSize: '16px' }}
                  />
                </div>

                {/* Sección de Título Universitario */}
                <div>
                  <label className="block font-roboto font-semibold mb-3" style={{ fontSize: '17px', color: '#070806' }}>
                    Título Universitario
                  </label>
                  <input
                    type="text"
                    value={tituloUniversitario}
                    onChange={(e) => setTituloUniversitario(e.target.value)}
                    placeholder="Ej: Psicólogo Clínico, Universidad Nacional..."
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none font-roboto"
                    style={{ fontSize: '16px' }}
                  />
                </div>

                {/* Sección de Número de Registro */}
                <div>
                  <label className="block font-roboto font-semibold mb-3" style={{ fontSize: '17px', color: '#070806' }}>
                    Número de Registro Profesional
                  </label>
                  <input
                    type="text"
                    value={numeroRegistro}
                    onChange={(e) => setNumeroRegistro(e.target.value)}
                    placeholder="Ej: CP-12345"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none font-roboto"
                    style={{ fontSize: '16px' }}
                  />
                </div>
              </div>

              {/* Botones */}
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
                  style={{ fontSize: '17px', backgroundColor: '#4A90E2' }}
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
            nicknameAvatar={userData.perfil?.nicknameAvatar || 'psicólogo'}
          />

          <div className="mt-6 rounded-3xl shadow-lg p-6 bg-white border-t-4 border-blue-500">
            <h2 className="mb-2 font-roboto font-bold text-center text-blue-600" style={{ fontSize: '28px' }}>
              Tu Perfil
            </h2>
            <p className="font-roboto font-medium text-center text-[#070806] mb-8" style={{ fontSize: '18px' }}>
              Profesional
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="font-roboto font-semibold mb-4" style={{ fontSize: '16px', color: '#070806' }}>
                  Foto de Perfil
                </h3>
                <ProfilePhotoSection
                  currentPhoto={fotoPerfil}
                  onPhotoChange={setFotoPerfil}
                  userRole="psicologo"
                />
              </div>

              <div>
                <label className="block font-roboto font-semibold mb-3" style={{ fontSize: '16px', color: '#070806' }}>
                  Especialidad
                </label>
                <input
                  type="text"
                  value={especialidad}
                  onChange={(e) => setEspecialidad(e.target.value)}
                  placeholder="Ej: Psicología clínica..."
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none font-roboto text-sm"
                />
              </div>

              <div>
                <label className="block font-roboto font-semibold mb-3" style={{ fontSize: '16px', color: '#070806' }}>
                  Título Universitario
                </label>
                <input
                  type="text"
                  value={tituloUniversitario}
                  onChange={(e) => setTituloUniversitario(e.target.value)}
                  placeholder="Ej: Psicólogo Clínico..."
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none font-roboto text-sm"
                />
              </div>

              <div>
                <label className="block font-roboto font-semibold mb-3" style={{ fontSize: '16px', color: '#070806' }}>
                  Número de Registro
                </label>
                <input
                  type="text"
                  value={numeroRegistro}
                  onChange={(e) => setNumeroRegistro(e.target.value)}
                  placeholder="Ej: CP-12345"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none font-roboto text-sm"
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
                  style={{ fontSize: '16px', backgroundColor: '#4A90E2' }}
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
        description="¿Estás seguro de que deseas guardar los cambios en tu perfil?"
        confirmText="Guardar"
        cancelText="Cancelar"
        onConfirm={handleSaveProfile}
        onCancel={() => setShowConfirmModal(false)}
        isLoading={isSaving}
      />
    </div>
  );
}
