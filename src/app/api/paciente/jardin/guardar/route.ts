// src/app/api/paciente/jardin/guardar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambialo'
);

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        let decoded: any;
        try {
            const { payload } = await jwtVerify(token, SECRET_KEY);
            decoded = payload;
        } catch (error) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
        }

        const usuarioId = decoded.userId as string;
        const { flores } = await request.json();

        // Guardar en la tabla de perfil como JSON
        await prisma.perfilPaciente.update({
            where: { userId: usuarioId },
            data: {
                // Usamos un campo existente o creamos uno nuevo en el modelo
                // Por ahora lo guardaremos en un nuevo registro emocional especial
            }
        });

        // Alternativa: Guardar en un registro emocional especial tipo "jardin"
        await prisma.registroEmocional.upsert({
            where: {
                // Buscamos un registro especial de tipo "jardin"
                id: -1 // Usaremos un ID especial
            },
            update: {
                jardinMetadata: flores
            },
            create: {
                pacienteId: usuarioId,
                emocionPrincipal: 'jardin',
                nivelAfectacion: 0,
                compartirPsicologo: false,
                jardinMetadata: flores
            }
        }).catch(async () => {
            // Si falla el upsert, buscar y actualizar
            const existing = await prisma.registroEmocional.findFirst({
                where: {
                    pacienteId: usuarioId,
                    emocionPrincipal: 'jardin'
                }
            });

            if (existing) {
                await prisma.registroEmocional.update({
                    where: { id: existing.id },
                    data: { jardinMetadata: flores }
                });
            } else {
                await prisma.registroEmocional.create({
                    data: {
                        pacienteId: usuarioId,
                        emocionPrincipal: 'jardin',
                        nivelAfectacion: 0,
                        compartirPsicologo: false,
                        jardinMetadata: flores
                    }
                });
            }
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Error al guardar jardín:', error);
        return NextResponse.json(
            { error: 'Error al guardar', details: error.message },
            { status: 500 }
        );
    }
}

