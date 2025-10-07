/**
 * @file page.tsx
 * @route src/app/page.tsx
 * @description Implementación final del Selector de Rol (Pág. 6 del PDF) con la estética PWA
 * que incluye fondos decorativos, selección de estado, y transiciones.
 * @author Kevin Mariano | Refactor: Gemini
 * @version 2.0.1
 * @since 1.0.0
 * @copyright MiauBloom
 */
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Cat, User, Users, ArrowRight } from 'lucide-react'; 

// Definimos los tokens de diseño como variables locales para los estilos complejos
const PRIMARY = '#F2C2C1'; // Rosa
const DARK = '#070806';    // Negro
const LIGHT = '#B6BABE';   // Gris Claro
const WHITE = '#FFFFFF';

type Role = 'Paciente' | 'Psicólogo' | null;

// Componente de Tarjeta de Selección Reutilizable
const RoleCard: React.FC<{ role: Role; selected: boolean; onSelect: (r: Role) => void }> = ({ role, selected, onSelect }) => {
    
    // Estilos basados en la estética PWA
    const baseStyle: React.CSSProperties = {
        background: selected ? PRIMARY : WHITE,
        boxShadow: selected 
            ? `0 8px 24px rgba(242, 194, 193, 0.4), 0 0 0 3px rgba(242, 194, 193, 0.3)`
            : '0 4px 12px rgba(0, 0, 0, 0.08)',
        transform: selected ? 'scale(1.02)' : 'scale(1)'
    };

    return (
        <button
            onClick={() => onSelect(role)}
            className="flex-1 rounded-2xl p-4 transition-all duration-300 relative text-body-2"
            style={baseStyle}
        >
            <div 
              className="text-xs font-bold uppercase py-1 px-3 rounded-lg mb-3 inline-block"
              style={{ 
                background: PRIMARY,
                color: DARK,
                opacity: selected ? 1 : 0.5
              }}
            >
              {role}
            </div>
            
            <div className="flex justify-center items-center py-8">
              {role === 'Paciente' ? (
                <User size={80} style={{ color: selected ? WHITE : DARK }} strokeWidth={1.5} />
              ) : (
                <Users size={80} style={{ color: selected ? WHITE : DARK }} strokeWidth={1.5} />
              )}
            </div>
        </button>
    );
};

export default function HomePage() {
    const [selectedRole, setSelectedRole] = useState<Role>(null);
    const router = useRouter();

    const handleComenzar = () => {
        if (selectedRole) {
            // Redirige al login, que ahora está en la ruta /login
            router.push(`/login?role=${selectedRole}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden w-full" style={{ background: WHITE }}>
            
            {/* Elementos decorativos de fondo (Estilos de tu código PWA) */}
            <div 
                className="absolute rounded-full opacity-20"
                style={{
                    top: '-180px',
                    left: '-150px',
                    width: '400px',
                    height: '400px',
                    background: PRIMARY,
                    border: `40px solid ${WHITE}`
                }}
            />
            <div 
                className="absolute rounded-full opacity-15"
                style={{
                    bottom: '-120px',
                    right: '-120px',
                    width: '320px',
                    height: '320px',
                    background: PRIMARY,
                    border: `30px solid ${WHITE}`
                }}
            />
            
            {/* Puntos decorativos */}
            <div className="absolute top-12 left-8 w-3 h-3 rounded-full" style={{ background: PRIMARY, opacity: 0.6 }} />
            <div className="absolute top-24 right-6 w-2 h-2 rounded-full" style={{ background: PRIMARY, opacity: 0.5 }} />
            <div className="absolute bottom-32 left-16 w-2 h-2 rounded-full" style={{ background: PRIMARY, opacity: 0.4 }} />

            {/* Contenido principal (Tarjeta centrada) */}
            <div className="relative z-10 w-full max-w-sm px-6 flex flex-col items-center bg-white p-8 rounded-2xl shadow-2xl">
                
                {/* Logo y título */}
                <div className="mb-8 text-center">
                    <div className="mb-3 flex justify-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: `${PRIMARY}20` }}>
                          <Cat size={32} style={{ color: PRIMARY }} strokeWidth={2.5} />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black" style={{ color: DARK }}>
                        <span style={{ color: PRIMARY }}>Miau</span>Bloom
                    </h1>
                    <p className="text-body-1 font-medium" style={{ color: DARK, opacity: 0.8 }}>
                        Crece y siente
                    </p>
                </div>

                {/* Pregunta */}
                <h2 className="text-heading-1 font-bold mb-8" style={{ color: DARK }}>
                    ¿Cuál eres tú?
                </h2>

                {/* Tarjetas de selección */}
                <div className="flex gap-4 w-full mb-12">
                    <RoleCard 
                        role="Paciente" 
                        selected={selectedRole === 'Paciente'} 
                        onSelect={setSelectedRole} 
                    />
                    <RoleCard 
                        role="Psicólogo" 
                        selected={selectedRole === 'Psicólogo'} 
                        onSelect={setSelectedRole} 
                    />
                </div>

                {/* Botón Comenzar */}
                <button
                    onClick={handleComenzar}
                    disabled={!selectedRole}
                    className="w-full py-4 rounded-full text-lg font-bold text-white transition-all duration-300 flex items-center justify-center gap-2"
                    style={{
                        background: selectedRole ? PRIMARY : LIGHT,
                        opacity: selectedRole ? 1 : 0.5,
                        boxShadow: selectedRole ? '0 6px 20px rgba(242, 194, 193, 0.4)' : 'none'
                    }}
                >
                    Comenzar
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
}
