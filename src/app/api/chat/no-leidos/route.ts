/**
 * @file route.ts
 * @route src/app/api/chat/no-leidos/route.ts
 * @description API endpoint para obtener contador de mensajes no leídos
 * @author Kevin Mariano
 * @version 1.0.0
 * @copyright MiauBloom
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthPayload } from '@/lib/auth';

/**
 * @function GET
 * @description Obtiene el total de mensajes no leídos del usuario
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthPayload(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'No autenticado' },
        { status: 401 }
      );
    }

    const userId = auth.userId;

    // Contar todos los mensajes no leídos del usuario
    const totalNoLeidos = await prisma.mensaje.count({
      where: {
        leido: false,
        remitenteId: { not: userId },
        conversacion: {
          OR: [
            { psicologoId: userId },
            { pacienteId: userId },
          ],
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        totalMensajesNoLeidos: totalNoLeidos,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error al obtener mensajes no leídos' },
      { status: 500 }
    );
  }
}

