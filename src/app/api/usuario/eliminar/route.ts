// src/app/api/usuario/eliminar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambialo'
);

export async function DELETE(request: NextRequest) {
    try {
        // Verificar autenticación
        const token = request.cookies.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        let decoded: any;
        try {
            const { payload } = await jwtVerify(token, SECRET_KEY);
            decoded = payload;
        } catch (error) {
            return NextResponse.json(
                { error: 'Token inválido' },
                { status: 401 }
            );
        }

        const usuarioId = decoded.userId as string;

        // Verificar que el usuario existe
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
            include: {
                perfil: true
            }
        });

        if (!usuario) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        // Eliminar en cascada según el rol
        if (usuario.rol === 'Paciente') {
            // Eliminar registros emocionales
            await prisma.registroEmocional.deleteMany({
                where: { pacienteId: usuarioId }
            });

            // Eliminar tareas asignadas
            await prisma.tareaAsignada.deleteMany({
                where: { pacienteId: usuarioId }
            });

            // Eliminar citas
            await prisma.cita.deleteMany({
                where: { pacienteId: usuarioId }
            });

            // Eliminar asignaciones de psicólogo
            await prisma.psicologoAsignado.deleteMany({
                where: { pacienteId: usuarioId }
            });

            // Eliminar mensajes donde es remitente o receptor
            await prisma.mensaje.deleteMany({
                where: {
                    OR: [
                        { remitenteId: usuarioId },
                        { 
                            conversacion: {
                                OR: [
                                    { pacienteId: usuarioId },
                                    { psicologoId: usuarioId }
                                ]
                            }
                        }
                    ]
                }
            });

            // Eliminar conversaciones
            await prisma.conversacion.deleteMany({
                where: { pacienteId: usuarioId }
            });
        } else if (usuario.rol === 'Psicologo') {
            // Desasignar de todos los pacientes
            await prisma.psicologoAsignado.deleteMany({
                where: { psicologoId: usuarioId }
            });

            // Eliminar citas
            await prisma.cita.deleteMany({
                where: { psicologoId: usuarioId }
            });

            // Eliminar tareas creadas
            await prisma.tareaAsignada.deleteMany({
                where: { creadoPorId: usuarioId }
            });

            // Eliminar mensajes donde es remitente
            await prisma.mensaje.deleteMany({
                where: { remitenteId: usuarioId }
            });

            // Eliminar conversaciones
            await prisma.conversacion.deleteMany({
                where: { psicologoId: usuarioId }
            });
        }

        // Eliminar perfil
        if (usuario.perfil) {
            await prisma.perfil.delete({
                where: { usuarioId: usuarioId }
            });
        }

        // Finalmente, eliminar el usuario
        await prisma.usuario.delete({
            where: { id: usuarioId }
        });

        // Crear respuesta sin cookie
        const response = NextResponse.json(
            { 
                success: true, 
                message: 'Cuenta eliminada exitosamente' 
            },
            { status: 200 }
        );

        // Eliminar cookie de autenticación
        response.cookies.set('auth_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
            path: '/'
        });

        return response;

    } catch (error: any) {
        console.error('Error al eliminar cuenta:', error);
        return NextResponse.json(
            { 
                error: 'Error al eliminar la cuenta',
                details: error.message 
            },
            { status: 500 }
        );
    }
}

