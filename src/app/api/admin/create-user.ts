/**
 * @file create-user.ts
 * @route src/pages/api/admin/create-user.ts
 * @description API para la creación de cuentas de usuario (Admin, Psicólogo, Paciente)
 * por parte de un usuario con rol de 'Admin' o 'Psicólogo'.
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../db/prisma';
import bcrypt from 'bcryptjs';
import { simulateAuth } from '../../../utils/auth';

const SALT_ROUNDS = 10;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido. Solo POST.' });
    }

    // Datos del usuario a crear
    const { email, password, nombreCompleto, targetRol } = req.body;
    
    // 1. Autorización (Simulada)
    const callingUser = simulateAuth(req);

    if (!callingUser) {
        return res.status(401).json({ message: 'No autorizado. Se requiere sesión activa de Admin o Psicólogo.' });
    }

    // 2. Validación de Roles y Permisos
    if (callingUser.rol === 'Psicólogo' && (targetRol !== 'Paciente' && targetRol !== 'Admin')) {
        // Permitimos que el Psicólogo cree Pacientes. No permitimos Admin o Psicólogo.
    } else if (callingUser.rol === 'Psicólogo' && targetRol !== 'Paciente') {
        return res.status(403).json({ message: 'Permisos insuficientes. Un Psicólogo solo puede crear Pacientes.' });
    }

    if (!['Admin', 'Psicólogo', 'Paciente'].includes(targetRol)) {
         return res.status(400).json({ message: 'Rol de destino no válido.' });
    }
    
    // 3. Validación de datos mínimos
    if (!email || !password || !nombreCompleto) {
        return res.status(400).json({ message: 'Faltan campos obligatorios (email, password, nombreCompleto).' });
    }

    try {
        // 4. Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
        }

        // 5. Hashear la contraseña inicial
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        
        // 6. Crear el registro en la tabla Users
        const newUser = await prisma.user.create({
            data: {
                email,
                passwordHash,
                nombreCompleto,
                rol: targetRol,
            },
        });
        
        let message = `Cuenta de ${targetRol} creada exitosamente. Debe completar su perfil al iniciar sesión.`;

        // 7. Lógica de Asignación Automática para Pacientes creados por Psicólogos
        if (targetRol === 'Paciente' && callingUser.rol === 'Psicólogo') {
            
            // Creamos un PerfilPaciente inicial para asignarlo al Psicólogo que lo creó.
            await prisma.perfilPaciente.create({
                data: {
                    userId: newUser.id,
                    psicologoAsignadoId: callingUser.id,
                    // Rellenar campos obligatorios con valores por defecto para que el usuario pueda actualizarlos:
                    fechaNacimiento: new Date('2000-01-01'), 
                    genero: 'No especificado',
                    contactoEmergencia: '0000000000',
                    nicknameAvatar: newUser.nombreCompleto.split(' ')[0] || 'Miau',
                }
            });
            message = `Paciente creado y asignado con éxito al Psicólogo ${callingUser.id}.`;
        }
        
        return res.status(201).json({
            message: message,
            userId: newUser.id,
            rol: targetRol
        });

    } catch (error) {
        console.error('Error al crear el usuario:', error);
        return res.status(500).json({ message: 'Error interno del servidor al procesar la creación de usuario.' });
    }
}