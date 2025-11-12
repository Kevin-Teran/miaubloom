// src/app/api/paciente/jardin/cargar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambialo'
);

export async function GET(request: NextRequest) {
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

        // Buscar el registro del jardín
        const jardinRecord = await prisma.registroEmocional.findFirst({
            where: {
                pacienteId: usuarioId,
                emocionPrincipal: 'jardin'
            },
            orderBy: {
                timestamp: 'desc'
            }
        });

        if (jardinRecord && jardinRecord.jardinMetadata) {
            console.log('[API Jardín] Flores cargadas de DB');
            return NextResponse.json({
                success: true,
                flores: jardinRecord.jardinMetadata
            });
        }

        return NextResponse.json({
            success: true,
            flores: []
        });

    } catch (error: any) {
        console.error('Error al cargar jardín:', error);
        return NextResponse.json(
            { error: 'Error al cargar', details: error.message },
            { status: 500 }
        );
    }
}

