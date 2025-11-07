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
import Input from '@/components/ui/Input';
import { Save, Edit2, X } from 'lucide-react';
import IconButton from '@/components/ui/IconButton';
import { SuccessToast } from '@/components/ui/SuccessToast';

interface ProfileFieldProps {
  label: string;
  value: string | undefined;
  placeholder: string;
}

function ProfileField({ label, value, placeholder }: ProfileFieldProps) {
  return (
    <div>
      <label className="block font-roboto font-semibold mb-3" style={{ fontSize: '17px', color: '#070806' }}>
        {label}
      </label>
      <div className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 font-roboto text-gray-700" style={{ fontSize: '16px' }}>
        {value || <span className="text-gray-400">{placeholder}</span>}
      </div>
    </div>
  );
}

type ProfileEditData = {
  especialidad: string;
  tituloUniversitario: string;
  numeroRegistro: string;
};

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: ProfileEditData) => void;
  initialData: ProfileEditData;
}

function ProfileEditModal({ isOpen, onClose, onConfirm, initialData }: EditModalProps) {
  const [data, setData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleConfirmClick = () => {
    onConfirm(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-lg w-full z-51">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Editar Perfil Profesional</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="space-y-4">
          <Input
            label="Especialidad"
            name="especialidad"
            value={data.especialidad}
            onChange={handleChange}
            placeholder="Ej: Psicología clínica..."
            className="focus:border-[var(--color-theme-primary)] focus:ring-[var(--color-theme-primary)]"
          />
          <Input
            label="Título Universitario"
            name="tituloUniversitario"
            value={data.tituloUniversitario}
            onChange={handleChange}
            placeholder="Ej: Psicólogo Clínico, Universidad Nacional..."
            className="focus:border-[var(--color-theme-primary)] focus:ring-[var(--color-theme-primary)]"
          />
          <Input
            label="Número de Registro Profesional"
            name="numeroRegistro"
            value={data.numeroRegistro}
            onChange={handleChange}
            placeholder="Ej: CP-12345"
            className="focus:border-[var(--color-theme-primary)] focus:ring-[var(--color-theme-primary)]"
          />
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-full font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmClick}
            style={{ backgroundColor: 'var(--color-theme-primary)' }}
            className="flex-1 px-4 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

interface UserData {
  id?: string;
  nombreCompleto: string;
  perfil?: {
    nicknameAvatar?: string;
    fotoPerfil?: string;
    especialidad?: string;
    tituloUniversitario?: string;
    numeroRegistro?: string;
    genero?: string;
  };
}

export default function PerfilPsicologoPage() {
  const router = useRouter();
  const { user: authUser, isLoading: isAuthLoading } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const { refetchUser } = useAuth();
  
  const [fotoPerfil, setFotoPerfil] = useState('/assets/avatar-psicologo.png');
  const [especialidad, setEspecialidad] = useState('');
  const [tituloUniversitario, setTituloUniversitario] = useState('');
  const [numeroRegistro, setNumeroRegistro] = useState('');

  useEffect(() => {
    if (!authUser || isAuthLoading) return;

    try {
      setUserData({
        id: authUser.id,
        nombreCompleto: authUser.nombreCompleto,
        perfil: authUser.perfil
      });
      setFotoPerfil(authUser.perfil?.fotoPerfil || '/assets/avatar-psicologo.png');
      setEspecialidad(authUser.perfil?.especialidad || '');
      setTituloUniversitario(authUser.perfil?.tituloUniversitario || '');
      setNumeroRegistro(authUser.perfil?.numeroRegistro || '');
    } catch (error) {
      console.error('Error setting user data:', error);
      router.push('/auth/login/psicologo');
    } finally {
      setIsLoading(false);
    }
  }, [router, authUser, isAuthLoading]);

  const handleOpenModal = () => {
    setIsEditModalOpen(true);
  };

  const handleModalConfirm = (newData: ProfileEditData) => {
    setEspecialidad(newData.especialidad);
    setTituloUniversitario(newData.tituloUniversitario);
    setNumeroRegistro(newData.numeroRegistro);
    setIsEditModalOpen(false);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/perfil/update-psicologo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fotoPerfil: fotoPerfil,
          especialidad: especialidad,
          tituloUniversitario: tituloUniversitario,
          numeroRegistro: numeroRegistro,
        }),
      });

      if (response.ok) {
        await refetchUser(); 
        setShowConfirmModal(false);
        setShowSuccessToast(true);
        setTimeout(() => {
          setShowSuccessToast(false);
        }, 3000);
      } else {
        const errorData = await response.json();
        console.error('Error al guardar:', errorData.message);
        alert(`Error al guardar el perfil: ${errorData.message}`);
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
      {/* --- BOTÓN VOLVER (CORREGIDO) --- */}
      <IconButton
        icon="back"
        onClick={() => router.back()}
        ariaLabel="Volver"
        bgColor="var(--color-theme-primary)"
        className="fixed top-6 left-6 z-50 shadow-md"
      />
      {/* --- FIN BOTÓN VOLVER --- */}

      <div className="absolute inset-0 z-0 pointer-events-none">
        <EllipseCorner />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* LAYOUT DESKTOP (CORREGIDO) */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8 lg:pt-8">
          {/* COLUMNA IZQUIERDA */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl shadow-lg p-8 border-t-4" style={{ borderColor: 'var(--color-theme-primary)' }}>
              <ProfileHeader
                nombre={userData.nombreCompleto}
                avatar={fotoPerfil}
                nicknameAvatar={userData.perfil?.nicknameAvatar || 'psicólogo'}
              />
              <div className="mt-8 space-y-4">
                <div className="bg-gradient-to-r rounded-xl p-4 border-l-4" style={{ 
                  backgroundColor: 'var(--color-theme-primary-light)',
                  borderColor: 'var(--color-theme-primary)'
                }}>
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
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border-t-4" style={{ borderColor: 'var(--color-theme-primary)' }}>
              <div className="text-center mb-10">
                <h2 className="mb-3 font-roboto font-bold text-[var(--color-theme-primary)]" style={{ fontSize: '32px' }}>
                  Tu Perfil Profesional
                </h2>
                <p className="font-roboto font-medium text-[#070806]" style={{ fontSize: '20px' }}>
                  Psicólogo
                </p>
              </div>

              <div className="space-y-8">
                {/* Sección Foto */}
                <div>
                  <h3 className="font-roboto font-semibold mb-4" style={{ fontSize: '17px', color: '#070806' }}>
                    Foto de Perfil
                  </h3>
                  <ProfilePhotoSection
                    currentPhoto={fotoPerfil}
                    onPhotoChange={setFotoPerfil}
                    userRole="psicologo"
                    userId={userData.id}
                  />
                </div>
                
                <div className="relative space-y-8">
                  <button
                    onClick={handleOpenModal}
                    className="absolute top-0 right-0 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    aria-label="Editar perfil profesional"
                  >
                    <Edit2 size={18} className="text-gray-600" />
                  </button>
                  <ProfileField
                    label="Especialidad"
                    value={especialidad}
                    placeholder="Ej: Psicología clínica..."
                  />
                  <ProfileField
                    label="Título Universitario"
                    value={tituloUniversitario}
                    placeholder="Ej: Psicólogo Clínico, Universidad Nacional..."
                  />
                  <ProfileField
                    label="Número de Registro Profesional"
                    value={numeroRegistro}
                    placeholder="Ej: CP-12345"
                  />
                </div>
              </div>

              {/* Botones (CORREGIDO) */}
              <div className="flex gap-4 mt-10">
                <button
                  onClick={() => router.back()}
                  className="flex-1 px-8 py-4 rounded-full font-roboto font-semibold"
                  style={{ fontSize: '17px', color: '#070806', backgroundColor: '#F0F0F0' }}
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

        {/* LAYOUT MÓVIL (CORREGIDO) */}
        <div className="lg:hidden pt-6">
          <ProfileHeader
            nombre={userData.nombreCompleto}
            avatar={fotoPerfil}
            nicknameAvatar={userData.perfil?.nicknameAvatar || 'psicólogo'}
          />

          <div className="mt-6 rounded-3xl shadow-lg p-6 bg-white border-t-4" style={{ borderColor: 'var(--color-theme-primary)' }}>
            <h2 className="mb-2 font-roboto font-bold text-center text-[var(--color-theme-primary)]" style={{ fontSize: '28px' }}>
              Tu Perfil
            </h2>
            <p className="font-roboto font-medium text-center text-[#070806] mb-8" style={{ fontSize: '18px' }}>
              Profesional
            </p>

            <div className="space-y-6">
              {/* Sección Foto */}
              <div>
                <h3 className="font-roboto font-semibold mb-4" style={{ fontSize: '16px', color: '#070806' }}>
                  Foto de Perfil
                </h3>
                <ProfilePhotoSection
                  currentPhoto={fotoPerfil}
                  onPhotoChange={setFotoPerfil}
                  userRole="psicologo"
                  userId={userData.id}
                />
              </div>

              <div className="relative space-y-6">
                <button
                  onClick={handleOpenModal}
                  className="absolute -top-2 right-0 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  aria-label="Editar perfil profesional"
                >
                  <Edit2 size={16} className="text-gray-600" />
                </button>
                
                <div>
                  <label className="block font-roboto font-semibold mb-2" style={{ fontSize: '16px', color: '#070806' }}>
                    Especialidad
                  </label>
                  <div className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-700 text-sm">
                    {especialidad || <span className="text-gray-400">Ej: Psicología clínica...</span>}
                  </div>
                </div>
                
                <div>
                  <label className="block font-roboto font-semibold mb-2" style={{ fontSize: '16px', color: '#070806' }}>
                    Título Universitario
                  </label>
                  <div className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-700 text-sm">
                    {tituloUniversitario || <span className="text-gray-400">Ej: Psicólogo Clínico...</span>}
                  </div>
                </div>

                <div>
                  <label className="block font-roboto font-semibold mb-2" style={{ fontSize: '16px', color: '#070806' }}>
                    Número de Registro
                  </label>
                  <div className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-700 text-sm">
                    {numeroRegistro || <span className="text-gray-400">Ej: CP-12345</span>}
                  </div>
                </div>
              </div>

              {/* Botones (CORREGIDO) */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3.5 rounded-full font-roboto font-semibold"
                  style={{ fontSize: '16px', color: '#070806', backgroundColor: '#F0F0F0' }}
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

      {/* Modales */}
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
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleModalConfirm}
        initialData={{
          especialidad,
          tituloUniversitario,
          numeroRegistro,
        }}
      />
      <SuccessToast 
        message="Perfil guardado exitosamente" 
        isOpen={showSuccessToast} 
      />
    </div>
  );
}
