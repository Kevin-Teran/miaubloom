/**
 * @file route.ts
 * @route src/app/api/auth/request-password-reset/route.ts
 * @description API endpoint to initiate the password reset process.
 * Sends email using nodemailer. Returns role on success.
 * @author Kevin Mariano
 * @version 1.0.1 
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: parseInt(process.env.SMTP_PORT || '587', 10) === 465, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  // Opcional: Añadir configuración TLS si es necesario para Gmail/otros
  // tls: {
  //   ciphers:'SSLv3'
  // }
});


export async function POST(request: NextRequest) {
  try {
    const body: { email: string } = await request.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Por favor, ingresa un correo electrónico válido.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, rol: true, nombreCompleto: true, email: true }
    });

    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return NextResponse.json(
        { success: false, message: 'Este correo electrónico no está registrado. ¿Deseas crear una cuenta?' },
        { status: 404 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); 

    await prisma.passwordResetToken.deleteMany({
        where: { userId: user.id },
    });
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt: tokenExpiry,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;

    console.log(`Password Reset URL for ${email}: ${resetUrl}`);

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"MiauBloom" <${process.env.SMTP_USER}>`, 
        to: user.email, 
        subject: 'Restablecer Contraseña - MiauBloom', 
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px; margin: auto;">
            <h2 style="color: #F4A9A0; text-align: center;">MiauBloom - Recuperación de Contraseña</h2>
            <p>Hola ${user.nombreCompleto},</p>
            <p>Recibiste este correo porque (o alguien) solicitó restablecer la contraseña de tu cuenta en MiauBloom.</p>
            <p>Haz clic en el siguiente enlace para crear una nueva contraseña. Este enlace es válido por 1 hora:</p>
            <p style="text-align: center; margin: 25px 0;">
              <a href="${resetUrl}" target="_blank" style="background-color: #F4A9A0; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Restablecer Contraseña
              </a>
            </p>
            <p>Si el botón no funciona, copia y pega esta URL en tu navegador:</p>
            <p style="word-break: break-all; font-size: 12px;"><a href="${resetUrl}" target="_blank" style="color: #F4A9A0;">${resetUrl}</a></p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
            <p style="font-size: 12px; color: #777;">Si no solicitaste este cambio, puedes ignorar este correo de forma segura. Tu contraseña no cambiará.</p>
            <p style="font-size: 12px; color: #777;">Equipo MiauBloom</p>
          </div>
        `, 
      });
      console.log(`Password reset email sent successfully to ${email}`);
    } catch (emailError) {
      // Importante: No devolver este error al frontend directamente
      // Solo loguearlo en el servidor. Aún así devolvemos éxito para seguridad.
      // Podrías devolver un status 500 si el envío es CRÍTICO, pero expone info.
      // return NextResponse.json(
      //   { success: false, message: 'Error al enviar el correo de recuperación.' },
      //   { status: 500 }
      // ); // <<-- NO RECOMENDADO para no filtrar errores de email
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Si tu correo está registrado, recibirás las instrucciones.',
        rol: user.rol 
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Ocurrió un error en el servidor. Intenta de nuevo más tarde.' },
      { status: 500 }
    );
}
}
