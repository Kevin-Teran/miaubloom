/**
 * @file request-reset.ts
 * @route src/pages/api/auth/request-reset.ts
 * @description Maneja la solicitud de restablecimiento de contraseña. Genera un token
 * único y lo almacena en la base de datos con fecha de expiración.
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../db/prisma';
import crypto from 'crypto';

// Token expira en 60 minutos (3600 segundos * 1000 milisegundos)
const EXPIRATION_TIME_MS = 60 * 60 * 1000; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido. Solo POST.' });
    }

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'El correo electrónico es requerido.' });
    }

    try {
        // 1. Verificar si el usuario existe
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Es buena práctica devolver un mensaje genérico por seguridad, incluso si el usuario no existe.
            return res.status(200).json({ message: 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.' });
        }

        // 2. Generar un token seguro y establecer la expiración
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + EXPIRATION_TIME_MS);
        
        // 3. Crear o actualizar el token en la base de datos (eliminar tokens antiguos)
        await prisma.passwordResetToken.deleteMany({
            where: { userId: user.id },
        });

        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                token: token,
                expiresAt: expiresAt,
            },
        });

        // 4. Simular el envío del correo electrónico (para pruebas locales)
        const resetUrl = `${req.headers.origin}/reset-password?token=${token}`;

        console.log(`
            ==================================================
            SIMULACIÓN DE CORREO: Recuperación de Contraseña
            Para: ${user.email}
            Token: ${token}
            Enlace de Restablecimiento: ${resetUrl}
            ==================================================
        `);


        return res.status(200).json({ 
            message: 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.',
            testToken: token // Devolvemos el token para facilitar las pruebas locales
        });

    } catch (error) {
        console.error('Error al solicitar el restablecimiento:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
}