/**
 * @file route.ts
 * @route src/app/api/user/complete-profile/route.ts
 * @description API Route para completar el perfil inicial del usuario (Paciente o Psicólogo).
 * @author Kevin Mariano
 * @version 1.0.1 
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function POST(req: Request) {
    const { userId, rol, perfilData } = await req.json();

    if (!userId || !rol || !perfilData) {
        return NextResponse.json({ message: 'Datos incompletos.' }, { status: 400 });
    }

    try {
        if (rol === 'Paciente') {
            await prisma.perfilPaciente.upsert({
                where: { userId },
                update: { 
                    ...perfilData, 
                    fechaNacimiento: perfilData.fechaNacimiento ? new Date(perfilData.fechaNacimiento) : undefined,
                    perfilCompletadoAt: new Date(), 
                },
                create: { 
                    userId, 
                    ...perfilData, 
                    fechaNacimiento: perfilData.fechaNacimiento ? new Date(perfilData.fechaNacimiento) : undefined 
                },
            });
        } else if (rol === 'Psicólogo') {
            await prisma.perfilPsicologo.upsert({
                where: { userId },
                update: {
                    ...perfilData,
                    perfilCompletadoAt: new Date(), 
                },
                create: { userId, ...perfilData },
            });
        } else {
            return NextResponse.json({ message: 'Rol no válido.' }, { status: 400 });
        }
        
        return NextResponse.json({ message: `Perfil de ${rol} completado exitosamente.` }, { status: 200 });

    } catch (error) {
        console.error('Error al completar el perfil:', error);
        return NextResponse.json({ message: 'Error interno del servidor al guardar el perfil.' }, { status: 500 });
    }
}