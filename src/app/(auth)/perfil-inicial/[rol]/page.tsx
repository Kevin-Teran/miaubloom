/**
 * @file page.tsx
 * @route src/app/(auth)/perfil-inicial/[rol]/page.tsx
 * @description Página de personalización inicial del perfil.
 * @author Gemini
 * @version 1.0.1 
 * @since 1.0.0
 * @copyright MiauBloom
 */
"use client";

import React, { useState, FormEvent } from 'react'; 
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

type UserRole = 'Paciente' | 'Psicólogo';

const PerfilInicial: React.FC<{ defaultRole: UserRole, userName: string, currentUserId: string }> = ({ 
    defaultRole, 
    userName, 
    currentUserId 
}) => {
    const router = useRouter();

    const [perfilData, setPerfilData] = useState(
        defaultRole === 'Paciente' ? {} : {} 
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); 

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPerfilData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!currentUserId) {
             setError("Error de autenticación. No se encontró el ID de usuario.");
             setLoading(false);
             return;
        }

        try {
            const endpoint = `/api/user/complete-profile`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUserId, 
                    rol: defaultRole,
                    perfilData,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Error al completar el perfil.');
            } else {
                alert(`Perfil de ${defaultRole} completado. Redirigiendo al Dashboard.`);
                router.push(`/dashboard/${defaultRole}`);
            }
        } catch (_) { 
            setError('Error de conexión con el servidor. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };
    
    const renderPacienteFields = () => (
        <div className="space-y-6">
            <h3 className="text-body-1 font-bold text-primary">Información Personal</h3>
            <Input type="date" name="fechaNacimiento" placeholder="Fecha de Nacimiento" onChange={handleProfileChange} />
            <select name="genero" onChange={handleProfileChange} className="w-full p-4 border border-text-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 text-body-1">
                <option value="">Género</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
            </select>
            <Input type="tel" name="contactoEmergencia" placeholder="Contacto de emergencia (Teléfono)" onChange={handleProfileChange} />
        </div>
    );

    const renderPsicologoFields = () => (
        <div className="space-y-6">
            <h3 className="text-body-1 font-bold text-primary">Información Profesional</h3>
            <Input type="text" name="identificacion" placeholder="Identificación (CC)" onChange={handleProfileChange} />
            <Input type="text" name="registroProfesional" placeholder="N° de Registro Profesional/Licencia" onChange={handleProfileChange} />
            <Input type="text" name="especialidad" placeholder="Especialidad (Ej: Terapia Cognitiva)" onChange={handleProfileChange} />
            <Input type="text" name="tituloUniversitario" placeholder="Título universitario y Universidad" onChange={handleProfileChange} />
        </div>
    );
    
    const renderAvatarStep = () => (
        <div className="space-y-6">
            <h2 className="text-heading-1 font-bold mb-2 text-primary">Personaliza Tu Perfil</h2>
            <p className="mb-4 text-body-2 text-text-dark">Elige un nombre para tu avatar y define tus preferencias de uso.</p>

            <Input type="text" name="nicknameAvatar" placeholder="ID Nombre avatar (ej: Nikky01)" onChange={handleProfileChange} />

            <h4 className="text-body-1 font-medium pt-4 text-text-dark">Horario de Uso</h4>
            <select name="horarioUso" onChange={handleProfileChange} className="w-full p-4 border border-text-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 text-body-1">
                <option value="1-2 Horas">1-2 Horas</option>
                <option value="3-4 Horas">3-4 Horas</option>
            </select>
            
            <h4 className="text-body-1 font-medium pt-4 text-text-dark">Duración de Uso</h4>
            <select name="duracionUso" onChange={handleProfileChange} className="w-full p-4 border border-text-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 text-body-1">
                <option value="1-2 Horas">1-2 Horas</option>
                <option value="3-4 Horas">3-4 Horas</option>
            </select>
            
            <Button type="submit" disabled={loading} className="mt-6">
                {loading ? 'Guardando...' : 'Comenzar'}
            </Button>
        </div>
    );

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl space-y-6">
            
            <h1 className="text-heading-1 font-bold text-text-dark">Bienvenido/a, {userName}</h1>
            <p className="text-body-2 pb-4 text-text-light">Completa tu perfil de <span className="font-semibold text-primary">{defaultRole}</span> para comenzar.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Paciente Step 1: Datos Personales */}
                {defaultRole === 'Paciente' && step === 1 && (
                    <>
                        {renderPacienteFields()}
                        <Button type="button" onClick={() => setStep(2)}>
                            Siguiente
                        </Button>
                    </>
                )}
                
                {/* Paciente Step 2: Personalización */}
                {defaultRole === 'Paciente' && step === 2 && renderAvatarStep()}

                {/* Psicólogo: Todo en un solo paso */}
                {defaultRole === 'Psicólogo' && (
                    <>
                        {renderPsicologoFields()}
                        <Button type="submit" disabled={loading} className="mt-6">
                            {loading ? 'Guardando...' : 'Comenzar'}
                        </Button>
                    </>
                )}
            </form>
            
            {error && <p className="text-red-500 text-center text-body-2 mt-4">{error}</p>}
        </div>
    );
};

const PerfilInicialPage = () => {
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const name = searchParams.get('name');
    
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const rolMatch = pathname.match(/\/perfil-inicial\/(Paciente|Psicólogo)/);
    const rol = rolMatch ? rolMatch[1] : null;

    const validRole = rol === 'Paciente' || rol === 'Psicólogo' ? rol : null;
    const userName = name ? decodeURIComponent(name) : 'Usuario';
    const currentUserId = userId || '';

    if (!validRole || !currentUserId) {
        return <div className="p-8 text-center text-body-1 text-text-dark">Cargando datos de perfil o autenticando...</div>;
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <PerfilInicial 
                defaultRole={validRole as UserRole} 
                userName={userName} 
                currentUserId={currentUserId}
            />
        </div>
    );
}

export default PerfilInicialPage;