"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Image as ImageIcon, FileText } from 'lucide-react';
import IconButton from '@/components/ui/IconButton';

export default function RegistrarEmocionPage() {
  const router = useRouter();
  const [isAnimated, setIsAnimated] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setTimeout(() => setIsAnimated(true), 100);
  }, []);

  const handleManualForm = () => {
    router.push('/registrar-emocion/formulario');
  };

  const handleCameraClick = () => {
    // Próximamente - Cámara deshabilitada
  };

  const handleGalleryClick = () => {
    // Abrir selector de archivos
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar 5MB');
      return;
    }

    // Guardar en sessionStorage para el siguiente paso
    const reader = new FileReader();
    reader.onload = (event) => {
      sessionStorage.setItem('emocion_image', event.target?.result as string);
      router.push('/registrar-emocion/formulario?tipo=galeria');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video de fondo (cámara) */}
      <div className="absolute inset-0">
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center">
            <div className="text-center text-white/50">
              <Camera size={80} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm">Vista previa de cámara</p>
            </div>
          </div>
        )}
      </div>

      {/* Overlay oscuro suave */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Header superior */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent">
        <div className="px-4 py-6 flex items-center justify-between">
          <IconButton
            icon="back"
            onClick={() => router.back()}
            bgColor="rgba(255, 255, 255, 0.2)"
            iconColor="white"
            variant="filled"
            className="backdrop-blur-md hover:bg-white/30 transition-all"
            ariaLabel="Volver"
          />
          <h1 className="text-lg font-semibold text-white drop-shadow-lg">
            Registrar Emoción
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Texto central */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`text-center transition-all duration-700 ${isAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-2xl mb-3">
            ¿Cómo te sientes?
          </h2>
          <p className="text-white/90 drop-shadow-lg text-base">
            Elige una opción para continuar
          </p>
        </div>
      </div>

      {/* Botones inferiores - SOLO 3 BOTONES */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/70 via-black/50 to-transparent pb-8">
        <div className="px-6 py-8">
          <div className="flex items-center justify-center gap-8 max-w-md mx-auto">
            {/* Galería - IZQUIERDA */}
            <button
              onClick={handleGalleryClick}
              className="flex flex-col items-center gap-2 group active:scale-95 transition-transform"
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md border-2 border-white/30 transition-all group-hover:scale-110 group-hover:border-white/50"
                style={{ backgroundColor: 'rgba(var(--color-theme-primary-rgb, 242, 194, 193), 0.3)' }}
              >
                <ImageIcon size={28} className="text-white" />
              </div>
              <span className="text-xs text-white font-medium drop-shadow-lg">Galería</span>
            </button>

            {/* Cámara - CENTRO (GRANDE) - DESHABILITADO */}
            <button
              onClick={handleCameraClick}
              disabled
              className="flex flex-col items-center gap-2 relative opacity-50 cursor-not-allowed"
            >
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-md border-4 border-white/40 shadow-2xl"
                style={{ backgroundColor: 'rgba(var(--color-theme-primary-rgb, 242, 194, 193), 0.4)' }}
              >
                <Camera size={36} className="text-white" />
              </div>
              <span className="text-xs text-white/70 font-medium drop-shadow-lg">Próximamente</span>
            </button>

            {/* Formulario - DERECHA */}
            <button
              onClick={handleManualForm}
              className="flex flex-col items-center gap-2 group active:scale-95 transition-transform"
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md border-2 border-white/30 transition-all group-hover:scale-110 group-hover:border-white/50"
                style={{ backgroundColor: 'rgba(var(--color-theme-primary-rgb, 242, 194, 193), 0.3)' }}
              >
                <FileText size={28} className="text-white" />
              </div>
              <span className="text-xs text-white font-medium drop-shadow-lg">Manual</span>
            </button>
          </div>
        </div>
      </div>

      {/* Input file oculto para galería */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Seleccionar imagen"
      />
    </div>
  );
}
