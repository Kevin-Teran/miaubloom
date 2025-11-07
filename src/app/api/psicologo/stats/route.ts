/**
 * @file route.ts
 * @route src/app/api/psicologo/stats/route.ts
 * @description API endpoint para obtener estadísticas del psicólogo
 * @author Kevin Mariano
 * @version 1.1.0 (Lógica de citas corregida - cuenta citas reales)
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();

// Clave secreta para verificar JWT
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || 'tu-clave-secreta-muy-segura-aqui'
);

interface JWTPayload {
  userId: string;
  rol: string;
  [key: string]: unknown;
}

/**
 * @function GET
 * @description Obtiene estadísticas del psicólogo autenticado
 * @param {NextRequest} request - Petición HTTP con JWT en cookie
 * @returns {Promise<NextResponse>} Estadísticas: citas esta semana y seguimientos activos
 */
export async function GET(request: NextRequest) {
  try {
    // Obtener el JWT de la cookie O del Authorization header
    let sessionToken: string | null = null;
    
    // Intentar desde cookie
    const sessionCookie = request.cookies.get('miaubloom_session');
    if (sessionCookie?.value) {
      sessionToken = sessionCookie.value;
    }
    
    // Si no hay cookie, intentar desde Authorization header
    if (!sessionToken) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        sessionToken = authHeader.substring(7);
      }
    }

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: 'No autenticado' },
        { status: 401 }
      );
    }

    // Verificar el JWT
    let payload: JWTPayload;
    try {
      const { payload: decodedPayload } = await jwtVerify(
        sessionToken,
        SECRET_KEY
      );
      payload = decodedPayload as JWTPayload;
    } catch (error) {
      console.error('[Stats GET] Error al verificar JWT:', error);
      return NextResponse.json(
        { success: false, message: 'Sesión inválida o expirada' },
        { status: 401 }
      );
    }

    const userId = payload.userId;
    const userRole = payload.rol;

    // Validar que sea un psicólogo
    if (userRole !== 'Psicólogo') {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 403 }
      );
    }

    // Obtener el perfil del psicólogo
    const psicologoProfile = await prisma.perfilPsicologo.findUnique({
      where: { userId },
    });

    if (!psicologoProfile) {
      return NextResponse.json(
        { success: false, message: 'Perfil de psicólogo no encontrado' },
        { status: 404 }
      );
    }

    // --- LÓGICA DE ESTADÍSTICAS CORREGIDA ---

    // 1. Calcular rango de fechas para "esta semana" (Hoy + 7 días)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Inicio del día de hoy

    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(today.getDate() + 7);
    oneWeekFromNow.setHours(23, 59, 59, 999); // Fin del día en 7 días

    // 2. Contar Citas REALES en esa semana
    const citasSemana = await prisma.cita.count({
      where: {
        psicologoId: userId,
        fechaHora: {
          gte: today,
          lte: oneWeekFromNow,
        },
      },
    });

    // 3. Contar Seguimientos (Total de pacientes asignados)
    const seguimientos = await prisma.perfilPaciente.count({
      where: {
        psicologoAsignadoId: userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        stats: {
          citasSemana: citasSemana,
          seguimientos: seguimientos,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Stats GET] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
