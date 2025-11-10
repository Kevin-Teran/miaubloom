/**
 * @file route.ts
 * @route src/app/api/chat/mensajes/route.ts
 * @description API endpoint para gestionar mensajes
 * @author Kevin Mariano
 * @version 1.0.0
 * @copyright MiauBloom
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthPayload } from '@/lib/auth';

/**
 * @function GET
 * @description Obtiene los mensajes de una conversación
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

    const conversacionId = request.nextUrl.searchParams.get('conversacionId');
    if (!conversacionId) {
      return NextResponse.json(
        { success: false, message: 'ID de conversación requerido' },
        { status: 400 }
      );
    }

    const userId = auth.userId;

    // Verificar que el usuario pertenezca a la conversación
    const conversacion = await prisma.conversacion.findUnique({
      where: { id: conversacionId },
      select: { psicologoId: true, pacienteId: true },
    });

    if (!conversacion || (conversacion.psicologoId !== userId && conversacion.pacienteId !== userId)) {
      return NextResponse.json(
        { success: false, message: 'No tienes acceso a esta conversación' },
        { status: 403 }
      );
    }

    // Obtener mensajes
    const mensajes = await prisma.mensaje.findMany({
      where: { conversacionId },
      orderBy: { createdAt: 'asc' },
    });

    // Marcar mensajes como leídos
    await prisma.mensaje.updateMany({
      where: {
        conversacionId,
        leido: false,
        remitenteId: { not: userId },
      },
      data: { leido: true },
    });

    return NextResponse.json(
      {
        success: true,
        mensajes,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error al obtener mensajes' },
      { status: 500 }
    );
  }
}

/**
 * @function POST
 * @description Envía un nuevo mensaje
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthPayload(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'No autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { conversacionId, contenido } = body;

    if (!conversacionId || !contenido) {
      return NextResponse.json(
        { success: false, message: 'Conversación y contenido requeridos' },
        { status: 400 }
      );
    }

    const userId = auth.userId;
    const rol = auth.rol;
    const remitente = rol === 'Psicólogo' ? 'psicologo' : 'paciente';

    // Verificar que el usuario pertenezca a la conversación
    const conversacion = await prisma.conversacion.findUnique({
      where: { id: conversacionId },
      select: { psicologoId: true, pacienteId: true },
    });

    if (!conversacion || (conversacion.psicologoId !== userId && conversacion.pacienteId !== userId)) {
      return NextResponse.json(
        { success: false, message: 'No tienes acceso a esta conversación' },
        { status: 403 }
      );
    }

    // Crear mensaje
    const mensaje = await prisma.mensaje.create({
      data: {
        conversacionId,
        remitente,
        remitenteId: userId,
        contenido,
      },
    });

    // Actualizar la fecha de actualización de la conversación
    await prisma.conversacion.update({
      where: { id: conversacionId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(
      {
        success: true,
        mensaje,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error al enviar mensaje' },
      { status: 500 }
    );
  }
}

