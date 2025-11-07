'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { Upload, Edit2, Image as ImageIcon, Camera, X } from 'lucide-react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';

interface ProfilePhotoSectionProps {
  currentPhoto: string;
  onPhotoChange: (photoUrl: string) => void;
  userRole: 'paciente' | 'psicologo';
  availableAvatars?: string[];
  userId?: string;
}

export function ProfilePhotoSection({
  currentPhoto,
  onPhotoChange,
  userRole,
  availableAvatars = [],
  userId
}: ProfilePhotoSectionProps) {
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<'avatar' | 'upload' | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('La imagen no debe superar 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setImageToCrop(imageUrl);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
    const image = new window.Image();
    image.src = imageSrc;
    
    return new Promise((resolve, reject) => {
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) reject(new Error('No 2d context'));

        const size = 256;
        canvas.width = size;
        canvas.height = size;

        ctx?.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          size,
          size
        );

        canvas.toBlob((blob) => {
          resolve(blob as Blob);
        }, 'image/jpeg', 0.9);
      };
      image.onerror = () => reject(new Error('Image failed to load'));
    });
  };

  const handleUploadCroppedImage = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;

    setIsUploadingFile(true);
    setUploadError(null);

    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);

      const formData = new FormData();
      formData.append('file', croppedImage, 'profile-photo.jpg');
      formData.append('userRole', userRole);
      if (userId) {
        formData.append('userId', userId);
      }

      const response = await fetch('/api/perfil/update-photo', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al subir la imagen');
      }

      const data = await response.json();
      onPhotoChange(data.url);
      setImageToCrop(null);
      setSelectedMode(null);
      setIsEditing(false);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Error al subir la imagen');
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    onPhotoChange(avatarUrl);
    setSelectedMode(null);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {!isEditing && (
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-fit">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 shadow-lg" style={{
              borderColor: 'var(--color-theme-primary)',
            }}>
              <Image
                src={currentPhoto || '/assets/avatar-paciente.png'}
                alt="Foto de perfil"
                width={128}
                height={128}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="absolute -bottom-2 -right-2 bg-white rounded-full p-2.5 shadow-xl hover:shadow-2xl transition-all duration-200 border-2 hover:scale-110 active:scale-95"
              style={{ borderColor: 'var(--color-theme-primary)' }}
            >
              <Edit2 size={18} style={{ color: 'var(--color-theme-primary)' }} />
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center">Haz clic en el lápiz para cambiar tu foto</p>
        </div>
      )}

      {isEditing && selectedMode === null && !imageToCrop && (
        <div className="rounded-2xl p-6 space-y-4 border-2 shadow-lg" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderColor: 'var(--color-theme-primary)',
        }}>
          <p className="text-center font-semibold text-gray-800 flex items-center justify-center gap-2">
            <Camera size={20} style={{ color: 'var(--color-theme-primary)' }} />
            Actualizar foto
          </p>
          <div className="grid grid-cols-2 gap-3">
            {userRole === 'paciente' && availableAvatars.length > 0 && (
              <button
                onClick={() => setSelectedMode('avatar')}
                className="p-4 rounded-xl border-2 transition-all duration-200"
                style={{
                  borderColor: 'var(--color-theme-primary-light)',
                  color: 'var(--color-theme-primary)',
                }}
              >
                <div className="flex justify-center mb-2">
                  <ImageIcon size={24} />
                </div>
                <div className="text-sm font-semibold">Galería</div>
              </button>
            )}
            <button
              onClick={() => setSelectedMode('upload')}
              className="p-4 rounded-xl border-2 transition-all duration-200"
              style={{
                borderColor: 'var(--color-theme-primary-light)',
                color: 'var(--color-theme-primary)',
              }}
            >
              <div className="flex justify-center mb-2">
                <Upload size={24} />
              </div>
              <div className="text-sm font-semibold">Subir</div>
            </button>
          </div>
          <button
            onClick={() => setIsEditing(false)}
            className="w-full py-2 px-4 rounded-lg text-sm font-semibold text-white bg-gray-400 hover:bg-gray-500"
          >
            Cerrar
          </button>
        </div>
      )}

      {isEditing && selectedMode === 'avatar' && !imageToCrop && (
        <div className="space-y-4 rounded-2xl p-6 border-2 shadow-lg" style={{
          borderColor: 'var(--color-theme-primary)',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
        }}>
          <p className="font-semibold text-gray-800 flex items-center gap-2">
            <ImageIcon size={20} style={{ color: 'var(--color-theme-primary)' }} />
            Elige tu avatar:
          </p>
          <div className="grid grid-cols-4 gap-3">
            {availableAvatars.map((avatar, index) => (
              <button
                key={index}
                onClick={() => handleAvatarSelect(avatar)}
                className="relative w-16 h-16 rounded-full overflow-hidden border-4 hover:scale-110 transition-all"
                style={{
                  borderColor: currentPhoto === avatar ? 'var(--color-theme-primary)' : 'rgba(242, 194, 193, 0.3)',
                }}
              >
                <Image
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
                {currentPhoto === avatar && <span className="absolute inset-0 flex items-center justify-center bg-black/20 text-white font-bold">✓</span>}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSelectedMode(null)}
            className="w-full py-2 px-4 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
          >
            ← Atrás
          </button>
        </div>
      )}

      {isEditing && selectedMode === 'upload' && !imageToCrop && (
        <div className="space-y-3 bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer block">
              <Upload size={24} className="mx-auto mb-1 text-blue-600" />
              <p className="font-semibold text-sm text-gray-700">Haz clic para subir</p>
            </label>
          </div>
          {uploadError && <div className="p-2 bg-red-100 border border-red-300 rounded text-red-700 text-xs">{uploadError}</div>}
          <button
            onClick={() => setSelectedMode(null)}
            className="w-full py-2 px-3 rounded-lg text-sm text-gray-600 hover:bg-white"
          >
            ← Atrás
          </button>
        </div>
      )}

      {imageToCrop && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r p-4 flex items-center justify-between border-b" style={{
              background: `linear-gradient(135deg, var(--color-theme-primary), var(--color-theme-primary-light))`
            }}>
              <h3 className="font-bold text-white text-lg">Ajustar foto</h3>
              <button onClick={() => setImageToCrop(null)} className="text-white hover:text-white/80 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  restrictPosition={true}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700">Zoom: {Math.round(zoom * 100)}%</label>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.01"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setImageToCrop(null)}
                  className="flex-1 py-3 px-4 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUploadCroppedImage}
                  disabled={isUploadingFile}
                  style={{ backgroundColor: 'var(--color-theme-primary)' }}
                  className="flex-1 py-3 px-4 rounded-lg text-white hover:opacity-90 font-semibold disabled:opacity-50"
                >
                  {isUploadingFile ? 'Subiendo...' : 'Guardar foto'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
