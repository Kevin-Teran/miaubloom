/**
 * @file auth.ts
 * @route src/lib/auth.ts
 * @description Utilidades de autenticación compartidas
 * @author Kevin Mariano
 * @version 1.0.0
 * @copyright MiauBloom
 */

import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || 'tu-clave-secreta-muy-segura-aqui'
);

export interface AuthPayload {
  userId: string;
  rol: string;
}

/**
 * Obtiene y verifica el payload del JWT desde las cookies
 * @param request NextRequest con la cookie de sesión
 * @returns Payload con userId y rol, o null si no está autenticado
 */
export async function getAuthPayload(request: NextRequest): Promise<AuthPayload | null> {
  const token = request.cookies.get('miaubloom_session')?.value;
  if (!token) return null;
  
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return { 
      userId: payload.userId as string, 
      rol: payload.rol as string 
    };
  } catch (e) {
    // Token inválido o expirado
    return null;
  }
}

/**
 * Verifica autenticación y roles permitidos
 * @param request NextRequest
 * @param allowedRoles Array de roles permitidos
 * @returns AuthPayload si tiene permiso, null si no
 */
export async function requireAuth(
  request: NextRequest, 
  allowedRoles: string[]
): Promise<AuthPayload | null> {
  const auth = await getAuthPayload(request);
  
  if (!auth) return null;
  if (!allowedRoles.includes(auth.rol)) return null;
  
  return auth;
}

export { SECRET_KEY };

