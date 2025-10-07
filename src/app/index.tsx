/**
 * @file index.tsx
 * @route src/pages/index.tsx
 * @description Ruta principal que muestra el Selector de Rol (Pág. 6 del PDF) y 
 * simula la navegación a la vista de login con el rol preseleccionado.
 * * NOTA: Se ha eliminado 'next/head' y 'next/router' para evitar errores de compilación
 * y la navegación se maneja con estado local (useState).
 * @author Kevin Mariano
 * @version 1.0.2
 * @since 1.0.0
 * @copyright MiauBloom
 */
import React, { useState } from 'react';

const PRIMARY_COLOR = '#F2C2C1'; 
const TEXT_DARK = '#070806'; 
const TEXT_LIGHT = '#B6BABE'; 

type UserRole = 'Paciente' | 'Psicólogo';

/**
 * @function LoginMock
 * @description Una simulación simple del componente Login, ya que el original fallaría
 * por la dependencia de useRouter.
 */
const LoginMock: React.FC<{ defaultRole: string, onBack: () => void }> = ({ defaultRole, onBack }) => (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl space-y-4">
        <button 
            onClick={onBack} 
            className="text-lg font-medium mb-4 block" 
            style={{ color: TEXT_DARK }}
        >
            &lt; Volver al Selector
        </button>
        <h2 className="text-3xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>Hola de nuevo</h2>
        <p className="mb-8" style={{ color: TEXT_DARK }}>
            Acceso simulado como <span className="font-semibold">{defaultRole}</span>.
        </p>
        <input 
            type="email" 
            placeholder="Correo electrónico" 
            className="w-full p-3 border rounded-xl" 
            style={{ borderColor: TEXT_LIGHT, color: TEXT_DARK }} 
            required
        />
        <input 
            type="password" 
            placeholder="Contraseña" 
            className="w-full p-3 border rounded-xl" 
            style={{ borderColor: TEXT_LIGHT, color: TEXT_DARK }} 
            required
        />
        <button 
            type="button" 
            className="w-full p-3 font-bold rounded-full text-white shadow-lg transition-colors duration-300" 
            style={{ backgroundColor: PRIMARY_COLOR }}
            onClick={() => alert(`Simulando login para el rol: ${defaultRole}`)}
        >
            Sign In (Simulación)
        </button>
    </div>
);


/**
 * @function RoleSelector
 * @description Componente para seleccionar el rol inicial.
 */
const RoleSelector: React.FC<{ onRoleSelect: (role: UserRole) => void }> = ({ onRoleSelect }) => {
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

    /**
     * @function RoleAvatar
     * @description Renderiza el círculo de selección con el ícono y color.
     */
    const RoleAvatar = ({ role }: { role: string }) => (
        <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-3 border-4 transition-colors duration-300"
             style={{ borderColor: role === selectedRole ? PRIMARY_COLOR : TEXT_LIGHT }}>
            <span className="text-4xl" role="img" aria-label={role}>{role === 'Psicólogo' ? '🧑‍⚕️' : '🌿'}</span>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 w-full max-w-lg" style={{ backgroundColor: 'white' }}>
            <h1 className="text-5xl font-extrabold mb-2" style={{ color: PRIMARY_COLOR }}>Miau<span style={{ color: TEXT_DARK }}>Bloom</span></h1>
            <p className="text-xl font-medium mb-10" style={{ color: TEXT_DARK }}>¿Cuál eres tú?</p>

            <div className="flex space-x-6 mb-10 w-full justify-center">
                {['Paciente', 'Psicólogo'].map((role) => (
                    <button
                        key={role}
                        onClick={() => setSelectedRole(role as UserRole)}
                        className={`p-6 rounded-2xl shadow-xl transition-all duration-300 w-36 flex flex-col items-center ${selectedRole === role ? 'ring-4 ring-offset-2 ring-opacity-75' : ''}`}
                        style={{ 
                            backgroundColor: selectedRole === role ? PRIMARY_COLOR : '#FFF', 
                            color: selectedRole === role ? 'white' : TEXT_DARK, 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            transform: selectedRole === role ? 'scale(1.05)' : 'scale(1)',
                        }}
                    >
                        <RoleAvatar role={role} />
                        <span className="font-semibold text-lg">{role}</span>
                    </button>
                ))}
            </div>

            <button
                onClick={() => selectedRole && onRoleSelect(selectedRole)}
                disabled={!selectedRole}
                className="w-full max-w-xs p-3 text-lg font-bold rounded-full transition-colors duration-300 shadow-xl"
                style={{ backgroundColor: selectedRole ? PRIMARY_COLOR : TEXT_LIGHT, color: 'white', opacity: selectedRole ? 1 : 0.6 }}
            >
                Comenzar
            </button>
        </div>
    );
};


/**
 * @function App
 * @description Componente principal que gestiona la vista de inicio.
 */
const App: React.FC = () => {
    // Usamos un estado local para simular la navegación entre vistas
    const [currentView, setCurrentView] = useState<'role_select' | 'login'>('role_select');
    const [selectedRole, setSelectedRole] = useState<UserRole>('Paciente'); // Valor por defecto

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
        setCurrentView('login');
    };

    const handleBackToRoleSelect = () => {
        setCurrentView('role_select');
    };

    return (
        <div className="App flex justify-center items-center min-h-screen w-full" style={{ fontFamily: 'Roboto', backgroundColor: '#F9F9F9' }}>
            <style jsx global>{`
                /* Cargamos la fuente Roboto globalmente */
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap');
                body {
                    font-family: 'Roboto', sans-serif;
                }
            `}</style>
            
            <div className="w-full h-full flex justify-center items-center">
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
