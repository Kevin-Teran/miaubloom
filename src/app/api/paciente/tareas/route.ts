// src/app/api/paciente/tareas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambialo'
);

export async function GET(request: NextRequest) {
    try {
        console.log('[API Tareas] Iniciando petición...');
        
        // Verificar autenticación
        const token = request.cookies.get('auth_token')?.value;

        if (!token) {
            console.log('[API Tareas] No hay token');
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        let decoded: any;
        try {
            const { payload } = await jwtVerify(token, SECRET_KEY);
            decoded = payload;
            console.log('[API Tareas] Token válido, usuario:', decoded.userId);
        } catch (error) {
            console.error('[API Tareas] Error al verificar token:', error);
            return NextResponse.json(
                { error: 'Token inválido' },
                { status: 401 }
            );
        }

        const usuarioId = decoded.userId as string;

        // Verificar que sea paciente
        const usuario = await prisma.user.findUnique({
            where: { id: usuarioId }
        });

        console.log('[API Tareas] Usuario encontrado:', usuario?.nombreCompleto, 'Rol:', usuario?.rol);

        if (!usuario || usuario.rol !== 'Paciente') {
            console.log('[API Tareas] Acceso denegado - no es paciente');
            return NextResponse.json(
                { error: 'Acceso denegado' },
                { status: 403 }
            );
        }

        console.log('[API Tareas] Buscando tareas para paciente:', usuarioId);

        // Obtener tareas del paciente
        const tareas = await prisma.tarea.findMany({
            where: {
                pacienteId: usuarioId
            },
            orderBy: [
                { estado: 'asc' }, // Pendientes primero
                { fechaLimite: 'asc' }, // Por fecha límite
                { createdAt: 'desc' } // Más recientes primero
            ],
            include: {
                psicologo: {
                    include: {
                        user: {
                            select: {
                                nombreCompleto: true
                            }
                        }
                    }
                }
            }
        });

        console.log('[API Tareas] Tareas encontradas:', tareas.length);

        // Mapear las tareas al formato esperado
        const tareasMapeadas = tareas.map(tarea => ({
            id: tarea.id.toString(),
            titulo: `Tarea asignada`, // Genérico ya que no hay campo titulo
            descripcion: tarea.descripcion,
            estado: tarea.estado,
            prioridad: 'Media', // Por defecto
            fechaLimite: tarea.fechaLimite,
            creadoEn: tarea.createdAt,
            categoria: 'Tarea terapéutica',
            asignadoPor: tarea.psicologo.user.nombreCompleto
        }));

        console.log('[API Tareas] Enviando respuesta exitosa con', tareasMapeadas.length, 'tareas');

        return NextResponse.json({
            success: true,
            tareas: tareasMapeadas
        });

    } catch (error: any) {
        console.error('[API Tareas] Error crítico:', error);
        console.error('[API Tareas] Stack:', error.stack);
        return NextResponse.json(
            { 
                error: 'Error al obtener las tareas',
                details: error.message 
            },
            { status: 500 }
        );
    }
}

