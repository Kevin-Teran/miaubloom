/**
 * @file complete-profile.ts
 * @route src/pages/api/user/complete-profile.ts
 * @description API para completar el perfil detallado del usuario (Paciente o Psicólogo)
 * en su primer inicio de sesión, una vez que la cuenta base ha sido creada.
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../db/prisma';

// Definición de tipos de datos para la solicitud
interface CompleteProfileBody {
    userId: string;
    rol: 'Paciente' | 'Psicólogo';
    perfilData: any; // Contiene los datos específicos del rol
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 1. Solo aceptar peticiones POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido. Solo POST.' });
    }

    const { userId, rol, perfilData }: CompleteProfileBody = req.body;

    // 2. Validación de datos mínimos
    if (!userId || !rol || !perfilData) {
        return res.status(400).json({ message: 'Datos incompletos para la personalización del perfil.' });
    }

    try {
        // 3. Verificar que el usuario base existe
        const user = await prisma.user.findUnique({
            where: { id: userId, rol: rol },
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuario base no encontrado o rol incorrecto.' });
        }

        // 4. Crear el perfil detallado según el rol
        await prisma.$transaction(async (tx) => {
            if (rol === 'Paciente') {
                // Crear Perfil de Paciente (Pág. 8 del PDF)
                await tx.perfilPaciente.create({
                    data: {
                        userId: userId,
                        fechaNacimiento: new Date(perfilData.fechaNacimiento),
                        genero: perfilData.genero,
                        contactoEmergencia: perfilData.contactoEmergencia,
                        nicknameAvatar: perfilData.nicknameAvatar,
                        horarioUso: perfilData.horarioUso,
                        duracionUso: perfilData.duracionUso,
                        // El psicologoAsignadoId se asignará después por un Admin/Psicólogo
                    },
                });
            } else if (rol === 'Psicólogo') {
                // Crear Perfil de Psicólogo (Pág. 11 del PDF)
                await tx.perfilPsicologo.create({
                    data: {
                        userId: userId,
                        identificacion: perfilData.identificacion,
                        registroProfesional: perfilData.registroProfesional,
                        especialidad: perfilData.especialidad,
                        tituloUniversitario: perfilData.tituloUniversitario,
                        pacientesAsignadosIds: JSON.stringify([]), // Inicializa la lista de pacientes
                    },
                });
            }
        });

        // 5. Perfil creado exitosamente
        return res.status(200).json({ 
            message: `Perfil de ${rol} completado exitosamente.`,
        });

    } catch (error) {
        // Manejar errores de validación de datos (ej: fecha) o duplicados (ej: registro profesional)
        console.error('Error al completar el perfil:', error);
        return res.status(500).json({ message: 'Error interno del servidor al guardar el perfil.' });
    }
}