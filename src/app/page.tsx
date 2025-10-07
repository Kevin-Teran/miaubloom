/**
 * @file page.tsx
 * @route src/app/page.tsx
 * @description Página principal de selección de rol con persistencia en cookies.
 * Solo aparece la primera vez que se accede desde un navegador.
 * @author Kevin Mariano
 * @version 2.0.0
 * @copyright MiauBloom
 */

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Cat, User, Users, ArrowRight, Loader2 } from 'lucide-react';

type Role = 'Paciente' | 'Psicólogo' | null;

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario ya seleccionó un rol previamente
    const savedRole = localStorage.getItem('miaubloom_selected_role');
    const hasVisited = localStorage.getItem('miaubloom_has_visited');
    
    if (hasVisited && savedRole) {
      // Si ya visitó antes, redirigir directamente al login
      router.push(`/login?role=${savedRole}`);
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleRoleSelection = (role: Role) => {
    setSelectedRole(role);
    setIsAnimating(true);
    
    // Animación suave antes de continuar
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleContinue = () => {
    if (!selectedRole) return;
    
    // Guardar la selección y marcar como visitado
    localStorage.setItem('miaubloom_selected_role', selectedRole);
    localStorage.setItem('miaubloom_has_visited', 'true');
    
    // Redirigir al login con el rol seleccionado
    router.push(`/login?role=${selectedRole}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <p className="text-body-1 text-text-light">Cargando MiauBloom...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-white px-4">
      
      {/* Elementos decorativos de fondo */}
      <div 
        className="absolute rounded-full opacity-20 transition-transform duration-1000"
        style={{
          top: '-180px',
          left: '-150px',
          width: '400px',
          height: '400px',
          background: '#F2C2C1',
          border: '40px solid #FFFFFF',
          transform: selectedRole ? 'scale(1.1)' : 'scale(1)',
        }}
      />
      <div 
        className="absolute rounded-full opacity-15 transition-transform duration-1000"
        style={{
          bottom: '-120px',
          right: '-120px',
          width: '320px',
          height: '320px',
          background: '#F2C2C1',
          border: '30px solid #FFFFFF',
          transform: selectedRole ? 'scale(1.1)' : 'scale(1)',
        }}
      />
      
      {/* Puntos decorativos */}
      <div className="absolute top-12 left-8 w-3 h-3 rounded-full bg-primary opacity-60 animate-pulse" />
      <div className="absolute top-24 right-6 w-2 h-2 rounded-full bg-primary opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-32 left-16 w-2 h-2 rounded-full bg-primary opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Contenedor principal */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-primary p-8 space-y-8">
          
          {/* Logo y Título */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-2">
              <Cat className="w-10 h-10 text-primary" strokeWidth={2.5} />
            </div>
            
            <div>
              <h1 className="text-5xl font-black text-dark leading-tight">
                <span className="text-primary">Miau</span>Bloom
              </h1>
              <p className="text-body-1 text-text-light mt-2">
                Crece y siente
              </p>
            </div>
          </div>

          {/* Pregunta Principal */}
          <div className="text-center">
            <h2 className="text-heading-1 font-bold text-dark mb-2">
              ¿Cuál eres tú?
            </h2>
            <p className="text-body-2 text-text-light">
              Selecciona tu rol para continuar
            </p>
          </div>

          {/* Tarjetas de Selección */}
          <div className="grid grid-cols-2 gap-4">
            {/* Tarjeta Paciente */}
            <button
              onClick={() => handleRoleSelection('Paciente')}
              className={`
                relative overflow-hidden rounded-2xl p-6 transition-all duration-300 
                ${selectedRole === 'Paciente' 
                  ? 'bg-primary shadow-primary scale-105' 
                  : 'bg-white shadow-soft hover:shadow-md hover:scale-102'
                }
                ${isAnimating && selectedRole === 'Paciente' ? 'animate-pulse' : ''}
              `}
              aria-label="Seleccionar rol de Paciente"
            >
              {/* Badge Superior */}
              <div className={`
                inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase mb-4
                ${selectedRole === 'Paciente'
                  ? 'bg-white/30 text-white'
                  : 'bg-primary/20 text-dark'
                }
              `}>
                Paciente
              </div>

              {/* Icono */}
              <div className="flex justify-center mb-2">
                <User 
                  className={`w-16 h-16 transition-colors ${
                    selectedRole === 'Paciente' ? 'text-white' : 'text-dark'
                  }`}
                  strokeWidth={1.5}
                />
              </div>

              {/* Indicador de Selección */}
              {selectedRole === 'Paciente' && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-primary rounded-full" />
                </div>
              )}
            </button>

            {/* Tarjeta Psicólogo */}
            <button
              onClick={() => handleRoleSelection('Psicólogo')}
              className={`
                relative overflow-hidden rounded-2xl p-6 transition-all duration-300
                ${selectedRole === 'Psicólogo'
                  ? 'bg-primary shadow-primary scale-105'
                  : 'bg-white shadow-soft hover:shadow-md hover:scale-102'
                }
                ${isAnimating && selectedRole === 'Psicólogo' ? 'animate-pulse' : ''}
              `}
              aria-label="Seleccionar rol de Psicólogo"
            >
              {/* Badge Superior */}
              <div className={`
                inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase mb-4
                ${selectedRole === 'Psicólogo'
                  ? 'bg-white/30 text-white'
                  : 'bg-primary/20 text-dark'
                }
              `}>
                Psicólogo
              </div>

              {/* Icono */}
              <div className="flex justify-center mb-2">
                <Users 
                  className={`w-16 h-16 transition-colors ${
                    selectedRole === 'Psicólogo' ? 'text-white' : 'text-dark'
                  }`}
                  strokeWidth={1.5}
                />
              </div>

              {/* Indicador de Selección */}
              {selectedRole === 'Psicólogo' && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-primary rounded-full" />
                </div>
              )}
            </button>
          </div>

          {/* Botón Continuar */}
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`
              w-full py-4 rounded-full text-lg font-bold text-white
              transition-all duration-300 flex items-center justify-center gap-2
              ${selectedRole
                ? 'bg-primary hover:bg-primary-dark shadow-primary hover:shadow-lg active:scale-95'
                : 'bg-light cursor-not-allowed opacity-60'
              }
            `}
            aria-label="Continuar al inicio de sesión"
          >
            Comenzar
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Texto de Ayuda */}
          <p className="text-center text-body-2 text-text-light">
            Esta selección se guardará para tus próximas visitas
          </p>
        </div>
      </div>
    </div>
  );
}