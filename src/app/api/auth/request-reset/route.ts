/**
 * @file route.ts
 * @route src/app/api/auth/request-reset/route.ts
 * @description Manejador de API para solicitar la recuperación de contraseña.
 * Genera un token único y lo guarda en la BD, asociado al usuario.
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.1
 * @copyright MiauBloom
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import crypto from 'crypto';

const TOKEN_EXPIRATION_HOURS = 1;

/**
 * Genera un token seguro y único.
 */
function generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: 'El correo electrónico es requerido.' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ message: 'Si la cuenta existe, se ha enviado un enlace de recuperación.' }, { status: 200 });
        }

        const token = generateToken();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + TOKEN_EXPIRATION_HOURS);

        await prisma.$transaction([
            prisma.passwordResetToken.deleteMany({
                where: { userId: user.id }
            }),
            prisma.passwordResetToken.create({
                data: {
                    userId: user.id,
                    token: token,
                    expiresAt: expiresAt,
                }
            })
        ]);

        console.log(`[AUTH] Token de recuperación para ${email}: ${token}`);
        
        const resetUrl = `${req.nextUrl.origin}/reset-password?token=${token}&email=${email}`;
        console.log(`[AUTH] URL de Restablecimiento: ${resetUrl}`);
        
        return NextResponse.json({ 
            message: 'Si la cuenta existe, se ha enviado un enlace de recuperación.',
            debugToken: token,
            debugResetUrl: resetUrl
        }, { status: 200 });

    } catch (error) {
        console.error('Error al solicitar restablecimiento de contraseña:', error);
        return NextResponse.json({ message: 'Error interno del servidor al procesar la solicitud.' }, { status: 500 });
    }
}