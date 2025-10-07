/**
 * @file reset-password.ts
 * @route src/pages/api/auth/reset-password.ts
 * @description Maneja el restablecimiento de contraseña utilizando un token válido.
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../db/prisma';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido. Solo POST.' });
    }

    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token y nueva contraseña son requeridos.' });
    }
    
    // Validación básica de seguridad
    if (newPassword.length < 8) {
        return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 8 caracteres.' });
    }

    try {
        // 1. Buscar el token y verificar su validez
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token: token },
        });

        if (!resetToken || resetToken.expiresAt < new Date()) {
            // Es crucial eliminar el token para evitar reintentos si existe pero ya expiró.
            if (resetToken) {
                 await prisma.passwordResetToken.delete({ where: { token: token } });
            }
            return res.status(400).json({ message: 'El token de restablecimiento es inválido o ha expirado.' });
        }
        
        // Usamos una transacción para asegurar que la contraseña se actualice Y el token se elimine
        await prisma.$transaction(async (tx) => {
            // 2. Hashear la nueva contraseña
            const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

            // 3. Actualizar la contraseña del usuario
            await tx.user.update({
                where: { id: resetToken.userId },
                data: {
                    passwordHash: passwordHash,
                },
            });

            // 4. Invalidar el token de restablecimiento eliminándolo
            await tx.passwordResetToken.delete({
                where: { token: token },
            });
        });


        return res.status(200).json({ 
            message: 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.' 
        });

    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
}
