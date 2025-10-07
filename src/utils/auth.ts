/**
 * @file auth.ts
 * @route src/utils/auth.ts
 * @description Utilidades de autenticación y autorización (Simulación). 
 * En una aplicación real, esta función decodificaría un JWT.
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'miasecret_miaubloom_dev';
const SALT_ROUNDS = 10;

/**
 * Hashea una contraseña usando bcrypt.
 * @param password Contraseña plana.
 * @returns Promesa con el hash.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compara una contraseña plana con un hash.
 * @param password Contraseña plana.
 * @param hash Hash almacenado.
 * @returns Promesa con true si coinciden.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Genera un token JWT para la sesión del usuario.
 * @param user Datos del usuario.
 * @returns Token JWT.
 */
export function generateAuthToken(user: User): string {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.rol,
    isProfileComplete: user.isProfileComplete,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}
