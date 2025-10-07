/**
 * @file auth.ts
 * @route src/utils/auth.ts
 * @description Utilidades de autenticación y autorización (Simulación). 
 * En una aplicación real, esta función decodificaría un JWT.
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */
import { NextApiRequest, NextApiResponse } from 'next';

export type AuthUser = {
    id: string;
    rol: 'Admin' | 'Psicólogo' | 'Paciente';
};

/**
 * @function simulateAuth
 * @description Simula la obtención del usuario autenticado a partir de un token de sesión.
 * Asume que el ID y el rol del usuario que realiza la petición se envían en el cuerpo (SÓLO PARA PRUEBAS LOCALES).
 * @param {NextApiRequest} req - Objeto de solicitud de la API.
 * @returns {AuthUser | null} El usuario autenticado o null si no lo está.
 */
export function simulateAuth(req: NextApiRequest): AuthUser | null {
    // ESTO DEBE SER REEMPLAZADO POR LA LÓGICA DE VERIFICACIÓN JWT EN PRODUCCIÓN.
    
    // Para pruebas locales, asumimos que el usuario que llama a la API envía su ID y Rol en el cuerpo.
    // Esto simula que el usuario que está logueado es quien está realizando la acción.
    const { callingUserId, callingUserRol } = req.body;

    if (callingUserId && (callingUserRol === 'Admin' || callingUserRol === 'Psicólogo')) {
        return {
            id: callingUserId as string,
            rol: callingUserRol as 'Admin' | 'Psicólogo'
        };
    }
    
    // Si no hay información de autenticación, retorna null.
    return null;
}