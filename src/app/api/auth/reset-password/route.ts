/**
 * @file route.ts
 * @route src/app/api/auth/reset-password/route.ts
 * @description Manejador de API para restablecer la contraseña.
 * Verifica el token de recuperación y actualiza la contraseña del usuario.
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.1
 * @copyright MiauBloom
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import bcrypt from 'bcryptjs';

const MIN_PASSWORD_LENGTH = 8;

/**
 * Handler para el método POST (Restablecer Contraseña)
 */
export async function POST(req: NextRequest) {
    try {
        const { email, token, newPassword } = await req.json();

        if (!email || !token || !newPassword) {
            return NextResponse.json({ message: 'Faltan campos requeridos (email, token o nueva contraseña).' }, { status: 400 });
        }

        if (newPassword.length < MIN_PASSWORD_LENGTH) {
            return NextResponse.json({ message: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.` }, { status: 400 });
        }

        const resetToken = await prisma.passwordResetToken.findFirst({
            where: {
                token: token,
                user: { email: email }, 
                expiresAt: {
                    gte: new Date(), 
                },
            },
            include: { user: true },
        });

        if (!resetToken || !resetToken.user) {
            return NextResponse.json({ message: 'El enlace de restablecimiento no es válido o ha expirado.' }, { status: 400 });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetToken.userId },
                data: { password: hashedPassword },
            }),

            prisma.passwordResetToken.delete({
                where: { id: resetToken.id },
            })
        ]);

        console.log(`[AUTH] Contraseña restablecida exitosamente para: ${email}`);
        
        return NextResponse.json({ 
            message: 'Contraseña actualizada exitosamente. Ahora puedes iniciar sesión.' 
        }, { status: 200 });

    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        return NextResponse.json({ message: 'Error interno del servidor al procesar el restablecimiento.' }, { status: 500 });
    }
}