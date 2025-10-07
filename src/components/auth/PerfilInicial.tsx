/**
 * @file PerfilInicial.tsx
 * @route src/components/auth/PerfilInicial.tsx
 * @description Componente de personalización inicial de perfil. Se usa la primera vez que un usuario accede,
 * ya que su cuenta fue creada por un rol superior (Admin o Psicólogo).
 * @author Kevin Mariano
 * @version 1.0.2
 * @since 1.0.0
 * @copyright MiauBloom
 */
import React, { useState, FormEvent } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// --- Constantes de Diseño ---
const PRIMARY_COLOR = '#F2C2C1'; 
const TEXT_DARK = '#070806'; 
const TEXT_LIGHT = '#B6BABE'; 

type UserRole = 'Paciente' | 'Psicólogo';

// Estado inicial del perfil
const initialPacienteProfile = {
    fechaNacimiento: '',
    genero: '',
    contactoEmergencia: '',
    nicknameAvatar: '',
    horarioUso: '1-2 Horas', // Pág. 8
    duracionUso: '1-2 Horas', // Pág. 8
};

const initialPsicologoProfile = {
    identificacion: '',
    registroProfesional: '',
    especialidad: '',
    tituloUniversitario: '',
};

/**
 * @function PerfilInicial
 * @description Renderiza el formulario para completar el perfil (Pág. 8 y 11) y lo guarda en la BD.
 * @returns {JSX.Element} El componente de personalización de perfil.
 */
const PerfilInicial: React.FC = () => {
    const router = useRouter();
    // Usamos el router para obtener el rol, ID y nombre que pasamos desde el Login
    const { rol, userId, name } = router.query;
    
    // Validar el rol (asume que siempre se recibe uno válido para esta ruta)
    const defaultRole: UserRole = rol === 'Paciente' || rol === 'Psicólogo' ? rol : 'Paciente';
    const userName: string = name ? String(name) : 'Usuario';
    const currentUserId: string = userId ? String(userId) : '';

    /** @type {[object, React.Dispatch<React.SetStateAction<object>>]} */
    const [perfilData, setPerfilData] = useState(
        defaultRole === 'Paciente' ? initialPacienteProfile : initialPsicologoProfile
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // 1: Datos principales, 2: Personalización (para Paciente)

    /**
     * @function handleProfileChange
     * @description Maneja el cambio de estado de los campos específicos del perfil.
     * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - Evento de cambio.
     */
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPerfilData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * @function handleSubmit
     * @description Envía los datos del perfil a la API de personalización.
     * @param {FormEvent<HTMLFormElement>} e - Evento de envío del formulario.
     */
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
            // Usamos un endpoint genérico para actualizar el perfil basado en el rol
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
                // Redirección al dashboard principal
                router.push(`/dashboard/${defaultRole}`);
            }
        } catch (err) {
            setError('Error de conexión con el servidor. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };
    
    // --- Campos de Paciente (Pág. 8) ---
    const renderPacienteFields = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-medium" style={{ color: PRIMARY_COLOR }}>Información Personal</h3>
            <input type="date" name="fechaNacimiento" placeholder="Fecha de Nacimiento" onChange={handleProfileChange} className="w-full p-3 border rounded-xl" />
            <select name="genero" onChange={handleProfileChange} className="w-full p-3 border rounded-xl">
                <option value="">Género</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
            </select>
            <input type="tel" name="contactoEmergencia" placeholder="Contacto de emergencia (Teléfono)" onChange={handleProfileChange} className="w-full p-3 border rounded-xl" />
        </div>
    );

    // --- Campos de Psicólogo (Pág. 11) ---
    const renderPsicologoFields = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-medium" style={{ color: PRIMARY_COLOR }}>Información Profesional</h3>
            <input type="text" name="identificacion" placeholder="Identificación (CC)" onChange={handleProfileChange} className="w-full p-3 border rounded-xl" />
            <input type="text" name="registroProfesional" placeholder="N° de Registro Profesional/Licencia" onChange={handleProfileChange} className="w-full p-3 border rounded-xl" />
            <input type="text" name="especialidad" placeholder="Especialidad (Ej: Terapia Cognitiva)" onChange={handleProfileChange} className="w-full p-3 border rounded-xl" />
            <input type="text" name="tituloUniversitario" placeholder="Título universitario y Universidad" onChange={handleProfileChange} className="w-full p-3 border rounded-xl" />
        </div>
    );
    
    // --- Personalización del Avatar (Pág. 8) ---
    const renderAvatarStep = () => (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>Personaliza Tu Avatar</h2>
            <p className="mb-4" style={{ color: TEXT_DARK }}>Elige un nombre para tu avatar y define tus preferencias de uso.</p>

            <input type="text" name="nicknameAvatar" placeholder="ID Nombre avatar (ej: Nikky01)" onChange={handleProfileChange} className="w-full p-3 border rounded-xl" />

            {/* Simulación de Horario y Duración de Uso */}
            <h4 className="text-lg font-medium pt-4" style={{ color: TEXT_DARK }}>Horario de Uso</h4>
            <select name="horarioUso" onChange={handleProfileChange} className="w-full p-3 border rounded-xl">
                <option value="1-2 Horas">1-2 Horas</option>
                <option value="3-4 Horas">3-4 Horas</option>
            </select>
            
            <h4 className="text-lg font-medium pt-4" style={{ color: TEXT_DARK }}>Duración de Uso</h4>
            <select name="duracionUso" onChange={handleProfileChange} className="w-full p-3 border rounded-xl">
                <option value="1-2 Horas">1-2 Horas</option>
                <option value="3-4 Horas">3-4 Horas</option>
            </select>
            
            <button type="submit" disabled={loading} className="w-full p-3 text-lg font-bold rounded-full text-white shadow-lg transition-colors" style={{ backgroundColor: PRIMARY_COLOR }}>
                {loading ? 'Guardando...' : 'Comenzar'}
            </button>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ fontFamily: 'Roboto' }}>
            <Head>
                <title>Personaliza Perfil | MiauBloom</title>
            </Head>
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl space-y-6">
                
                <h1 className="text-2xl font-semibold" style={{ color: TEXT_DARK }}>Bienvenido/a, {userName}</h1>
                <p className="text-sm pb-4" style={{ color: TEXT_LIGHT }}>Completa tu perfil de **{defaultRole}** para comenzar.</p>

                {/* Paciente Step 1: Datos Personales */}
                {defaultRole === 'Paciente' && step === 1 && (
                    <>
                        {renderPacienteFields()}
                        <button type="button" onClick={() => setStep(2)} className="w-full p-3 text-lg font-bold rounded-full text-white shadow-lg" style={{ backgroundColor: PRIMARY_COLOR }}>
                            Siguiente
                        </button>
                    </>
                )}
                
                {/* Paciente Step 2: Personalización */}
                {defaultRole === 'Paciente' && step === 2 && renderAvatarStep()}

                {/* Psicólogo: Todo en un solo paso */}
                {defaultRole === 'Psicólogo' && (
                    <>
                        {renderPsicologoFields()}
                        <button type="submit" disabled={loading} className="w-full p-3 text-lg font-bold rounded-full text-white shadow-lg transition-colors" style={{ backgroundColor: PRIMARY_COLOR }}>
                            {loading ? 'Guardando...' : 'Comenzar'}
                        </button>
                    </>
                )}
                
                {error && <p className="text-red-500 text-center">{error}</p>}
            </form>
        </div>
    );
};

// Esta es una ruta dinámica de Next.js.
// Se recomienda crear una carpeta [rol] y dentro el archivo index.tsx, 
// o usar la estructura en el archivo pages/perfil-inicial/[rol].tsx
const PerfilInicialPage = () => {
    const router = useRouter();
    const { rol } = router.query;
    
    // Simulación: No renderizar si no hay un rol válido
    const validRole = rol === 'Paciente' || rol === 'Psicólogo' ? rol : null;

    if (!validRole) {
        // En un entorno real, podrías redireccionar o mostrar un error 404
        return <div className="p-8 text-center text-xl">Cargando datos de perfil...</div>;
    }
    
    return <PerfilInicial />;
}

export default PerfilInicialPage;