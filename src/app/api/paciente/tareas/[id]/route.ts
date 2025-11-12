// src/app/api/paciente/tareas/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambialo'
);

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
        const tareaId = params.id;

        // Obtener el cuerpo de la petición
        const body = await request.json();
        const { estado } = body;

        // Validar estado
        const estadosValidos = ['Pendiente', 'En progreso', 'Completada'];
        if (!estadosValidos.includes(estado)) {
            return NextResponse.json(
                { error: 'Estado inválido' },
                { status: 400 }
            );
        }

        // Convertir tareaId a número
        const tareaIdNum = parseInt(tareaId);
        
        if (isNaN(tareaIdNum)) {
            return NextResponse.json(
                { error: 'ID de tarea inválido' },
                { status: 400 }
            );
        }

        // Verificar que la tarea existe y pertenece al usuario
        const tarea = await prisma.tarea.findUnique({
            where: { id: tareaIdNum }
        });

        if (!tarea) {
            return NextResponse.json(
                { error: 'Tarea no encontrada' },
                { status: 404 }
            );
        }

        if (tarea.pacienteId !== usuarioId) {
            return NextResponse.json(
                { error: 'No tienes permiso para modificar esta tarea' },
                { status: 403 }
            );
        }

        // Actualizar la tarea
        const tareaActualizada = await prisma.tarea.update({
            where: { id: tareaIdNum },
            data: { 
                estado: estado,
                updatedAt: new Date()
            }
        });

        return NextResponse.json({
            success: true,
            tarea: tareaActualizada
        });

    } catch (error: any) {
        console.error('Error al actualizar tarea:', error);
        return NextResponse.json(
            { 
                error: 'Error al actualizar la tarea',
                details: error.message 
            },
            { status: 500 }
        );
    }
}

