/**
 * @file page.tsx
 * @route src/app/admin/crear-usuario/page.tsx
 * @description Wrapper de página para el formulario de creación de usuarios. 
 * Simula la sesión de un Admin o Psicólogo para propósitos de prueba.
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */
import React from 'react';
import CrearUsuarioForm from '../../components/admin/CrearUsuarioForm';

const PRIMARY_COLOR = '#F2C2C1';

/**
 * @typedef {object} SessionMock
 * @property {string} userId - ID de usuario del creador.
 * @property {('Admin'|'Psicólogo')} rol - Rol del usuario logueado.
 */

/**
 * @constant sessionMock
 * @description Datos de sesión simulados. Cambia el 'rol' y 'userId' aquí
 * para probar los permisos.
 */
const sessionMock = {
    userId: 'mock-admin-123', 
    rol: 'Admin' as 'Admin' | 'Psicólogo', 
    // Para probar Psicólogo, puedes cambiar a: rol: 'Psicólogo'
};

/**
 * @function generateMetadata
 * @description Define los metadatos de la página para el App Router.
 */
export const metadata = {
    title: 'Crear Usuario | MiauBloom',
    description: 'Página de administración para la creación de nuevas cuentas.',
};

/**
 * @function CrearUsuarioPage
 * @description Componente principal de la página de creación de usuarios.
 * @returns {JSX.Element} La página renderizada.
 */
const CrearUsuarioPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen p-4" style={{ backgroundColor: '#F9F9F9' }}>
            <CrearUsuarioForm session={sessionMock} />
        </div>
    );
};

export default CrearUsuarioPage;