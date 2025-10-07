/**
 * @file page.tsx
 * @route src/app/page.tsx
 * @description Implementación final del Selector de Rol (Pág. 6 del PDF) con estilo PWA,
 * con CSS en línea para garantizar la estabilidad del diseño y el espaciado correcto.
 * @author Kevin Mariano
 * @version 1.1.4
 * @since 1.0.0
 * @copyright MiauBloom
 */
"use client"; 

import React, { useState } from 'react';
// Importamos iconos para placeholders de imagen
import { Cat, Smile, Users, X } from 'lucide-react';

// --- Constantes de Diseño ---
const PRIMARY_COLOR = '#F2C2C1'; // Rosa claro
const TEXT_DARK = '#070806';     // Negro
const TEXT_LIGHT = '#B6BABE';    // Gris
const BACKGROUND_LIGHT = '#FFF'; // Blanco
const CARD_ACTIVE_COLOR = 'rgba(242, 194, 193, 0.9)'; // Rosa para el fondo activo del Psicólogo

type UserRole = 'Paciente' | 'Psicólogo';

// Componente para simular el Login después de la selección
const LoginMock: React.FC<{ defaultRole: string, onBack: () => void }> = ({ defaultRole, onBack }) => (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl space-y-4">
        <button 
            onClick={onBack} 
            className="text-lg font-medium mb-4 block hover:text-pink-500 transition-colors" 
            style={{ color: TEXT_DARK }}
        >
            &lt; Volver al Selector
        </button>
        <h2 className="text-3xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>Hola de nuevo</h2>
        <p className="mb-8" style={{ color: TEXT_DARK }}>Accede como <span className="font-semibold">{defaultRole}</span>.</p>
        <input type="email" placeholder="Correo electrónico" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-300" style={{ borderColor: TEXT_LIGHT, color: TEXT_DARK }} required/>
        <input type="password" placeholder="Contraseña" className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-300" style={{ borderColor: TEXT_LIGHT, color: TEXT_DARK }} required/>
        <button 
            type="button" 
            className="w-full p-3 font-bold rounded-full text-white shadow-lg transition-colors duration-300 hover:bg-pink-400" 
            style={{ backgroundColor: PRIMARY_COLOR }}
            onClick={() => alert(`Simulando redirección a /login?role=${defaultRole}`)}
        >
            Continuar
        </button>
    </div>
);


/**
 * @function RoleSelector
 * @description Componente principal con el diseño vertical de selección de rol.
 */
const RoleSelector: React.FC<{ onRoleSelect: (role: UserRole) => void }> = ({ onRoleSelect }) => {
    const [selectedRole, setSelectedRole] = useState<UserRole>('Paciente'); 

    /**
     * @function RoleCard
     * @description Renderiza una tarjeta de selección de rol con el diseño de la Pág. 6.
     */
    const RoleCard = ({ role }: { role: UserRole }) => {
        const isActive = selectedRole === role;
        // El Psicólogo se muestra con el fondo rosa activo en la imagen del PDF
        const activeBg = role === 'Psicólogo' && isActive ? CARD_ACTIVE_COLOR : BACKGROUND_LIGHT;
        const activeText = role === 'Psicólogo' && isActive ? 'white' : TEXT_DARK;
        
        return (
            <button
                onClick={() => setSelectedRole(role)}
                // Uso de Flex y dimensiones fijas para la estabilidad en el móvil
                className={`flex flex-col items-center justify-start h-56 rounded-2xl shadow-lg p-4 transition-all duration-300 ${isActive ? 'ring-4 ring-offset-2 ring-pink-300 scale-[1.03]' : 'hover:scale-[1.03] hover:shadow-xl'}`}
                style={{ 
                    // CLAVE: Definimos ancho fijo y el color de fondo aquí
                    width: 'calc(50% - 8px)', // Ocupa la mitad del contenedor (menos el espacio entre ellas)
                    backgroundColor: activeBg,
                    color: activeText,
                    borderColor: isActive && role === 'Paciente' ? PRIMARY_COLOR : 'transparent',
                    borderWidth: '2px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Etiqueta superior del Rol */}
                <span 
                    className="text-base font-bold uppercase block w-full text-center"
                    style={{ color: TEXT_DARK, backgroundColor: PRIMARY_COLOR, padding: '4px 8px', borderRadius: '8px', opacity: isActive ? 1 : 0.4, transition: 'all 0.3s' }}
                >
                    {role}
                </span>

                {/* Placeholder de la imagen del gato (Icono) */}
                <div className="w-full flex-grow flex items-center justify-center text-8xl">
                    {role === 'Psicólogo' 
                        ? <Users size={120} style={{ color: TEXT_DARK }} /> 
                        : <Smile size={120} style={{ color: TEXT_DARK }} />}
                </div>
            </button>
        );
    };

    return (
        <div className="relative flex flex-col items-center justify-start min-h-screen w-full overflow-hidden" style={{ backgroundColor: BACKGROUND_LIGHT, fontFamily: 'Roboto' }}>
            
            {/* Elementos Gráficos de Fondo (Semi-círculos/Dona) */}
            
            {/* 1. Semicírculo Superior Izquierdo (Tipo Dona) - Grande y visible en esquina */}
            <div className="absolute top-[-250px] left-[-200px] w-[500px] h-[500px] rounded-full opacity-30" style={{ backgroundColor: PRIMARY_COLOR, boxShadow: `0 0 0 50px ${BACKGROUND_LIGHT} inset` }}></div>
            
            {/* 2. Semicírculo Inferior Derecho (Tipo Dona) - Grande y visible en esquina opuesta */}
            <div className="absolute bottom-[-150px] right-[-150px] w-[350px] h-[350px] rounded-full opacity-20" style={{ backgroundColor: PRIMARY_COLOR, boxShadow: `0 0 0 30px ${BACKGROUND_LIGHT} inset` }}></div>

            {/* Puntos de detalle */}
            <div className="absolute top-10 left-10 w-3 h-3 rounded-full opacity-60" style={{ backgroundColor: PRIMARY_COLOR }}></div>
            <div className="absolute top-20 right-5 w-2 h-2 rounded-full opacity-50" style={{ backgroundColor: PRIMARY_COLOR }}></div>

            {/* Contenedor Principal Centrado y con Espaciado Vertical Fijo */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-sm p-4 pt-16" style={{ maxWidth: '380px', margin: '0 auto' }}>

                {/* Logo y Texto Principal */}
                <div className="flex flex-col items-center mb-10">
                    {/* Placeholder para el logo del gato con sombrero */}
                    <div className="w-20 h-20 mb-2 flex items-center justify-center text-5xl rounded-full" style={{ color: PRIMARY_COLOR }}>
                        <Cat size={64} style={{ color: PRIMARY_COLOR }} />
                    </div>
                    <h1 className="text-4xl font-extrabold mb-0" style={{ color: TEXT_DARK }}>
                        <span style={{ color: PRIMARY_COLOR }}>Miau</span>Bloom
                    </h1>
                    <p className="text-base font-medium mt-1" style={{ color: TEXT_DARK }}>
                        Crece y siente
                    </p>
                </div>

                {/* Separación Ajustada */}
                <p className="text-xl font-medium mb-12" style={{ color: TEXT_DARK }}>
                    ¿Cual eres tú?
                </p>

                {/* Contenedor de las Tarjetas de Rol */}
                {/* CLAVE: Usamos gap-4 para la separación y mantenemos el ancho total fijo */}
                <div className="flex gap-4 mb-16 w-full justify-center"> 
                    <RoleCard role="Paciente" />
                    <RoleCard role="Psicólogo" />
                </div>

                {/* Botón Comenzar (Ancho Ajustado al Contenedor de Tarjetas) */}
                <button
                    onClick={() => onRoleSelect(selectedRole)}
                    // El botón toma un ancho fijo para que se vea centrado y proporcionado
                    className="w-full max-w-[200px] p-3 text-lg font-bold rounded-full transition-colors duration-300 shadow-xl hover:bg-pink-400"
                    style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}
                >
                    Comenzar
                </button>
            </div>
        </div>
    );
};


/**
 * @function App
 * @description Componente controlador que alterna entre el selector de rol y el login.
 */
const App: React.FC = () => {
    // Define la vista actual: si muestra el selector de rol o el mock de login
    const [currentView, setCurrentView] = useState<'role_select' | 'login'>('role_select');
    const [selectedRole, setSelectedRole] = useState<UserRole>('Paciente'); 

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
        setCurrentView('login');
    };

    const handleBackToRoleSelect = () => {
        setCurrentView('role_select');
    };

    return (
        <div className="App flex justify-center items-start min-h-screen w-full">
            <div className="w-full h-full flex justify-center items-start">
                {currentView === 'role_select' ? (
                    <RoleSelector onRoleSelect={handleRoleSelect} />
                ) : (
                    <LoginMock defaultRole={selectedRole} onBack={handleBackToRoleSelect} />
                )}
            </div>
        </div>
    );
}

export default App;
