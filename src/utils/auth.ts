/**
 * @file auth.ts
 * @route src/utils/auth.ts
 * @description Utilidades completas de autenticación y autorización con JWT y bcrypt
 * @author Kevin Mariano
 * @version 2.0.1 
 * @copyright MiauBloom
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; 

const JWT_SECRET = process.env.JWT_SECRET || 'miasecret_miaubloom_dev_2025';
const SALT_ROUNDS = 12; 

// Tipos
interface UserTokenPayload {
  id: string;
  email: string;
  rol: string;
  nombreCompleto: string;
}

interface DecodedToken extends UserTokenPayload {
  iat: number;
  exp: number;
}

/**
 * Hashea una contraseña usando bcrypt
 * @param password - Contraseña en texto plano
 * @returns Promesa con el hash de la contraseña
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    if (!password || password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
  } catch (error) {
    console.error('[AUTH] Error al hashear contraseña:', error);
    throw new Error('Error al procesar la contraseña');
  }
}

/**
 * Compara una contraseña en texto plano con un hash
 * @param password - Contraseña en texto plano
 * @param hash - Hash almacenado en la base de datos
 * @returns Promesa con true si las contraseñas coinciden
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    if (!password || !hash) {
      return false;
    }
    
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    console.error('[AUTH] Error al comparar contraseña:', error);
    return false;
  }
}

/**
 * Genera un token JWT para la sesión del usuario
 * @param user - Datos del usuario para incluir en el token
 * @returns Token JWT firmado
 */
export function generateAuthToken(user: UserTokenPayload): string {
  try {
    const payload: UserTokenPayload = {
      id: user.id,
      email: user.email,
      rol: user.rol,
      nombreCompleto: user.nombreCompleto,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '7d', // Token válido por 7 días
      issuer: 'miaubloom',
      audience: 'miaubloom-users',
    });

    return token;
  } catch (error) {
    console.error('[AUTH] Error al generar token:', error);
    throw new Error('Error al generar token de autenticación');
  }
}

/**
 * Verifica y decodifica un token JWT
 * @param token - Token JWT a verificar
 * @returns Datos decodificados del token o null si es inválido
 */
export function verifyAuthToken(token: string): DecodedToken | null {
  try {
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'miaubloom',
      audience: 'miaubloom-users',
    }) as DecodedToken;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error('[AUTH] Token inválido:', error.message);
    } else if (error instanceof jwt.TokenExpiredError) {
      console.error('[AUTH] Token expirado:', error.message);
    } else {
      console.error('[AUTH] Error al verificar token:', error);
    }
    return null;
  }
}

/**
 * Genera un token de restablecimiento de contraseña
 * @returns Token aleatorio seguro
 */
export function generateResetToken(): string {
  // CORRECCIÓN: Eliminada la línea const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Verifica si un token de restablecimiento es válido
 * @param token - Token a verificar
 * @param expiresAt - Fecha de expiración del token
 * @returns true si el token es válido
 */
export function isResetTokenValid(token: string, expiresAt: Date): boolean {
  if (!token || !expiresAt) {
    return false;
  }

  const now = new Date();
  return now < expiresAt;
}

/**
 * Sanitiza un email (lowercase y trim)
 * @param email - Email a sanitizar
 * @returns Email sanitizado
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Valida la fortaleza de una contraseña
 * @param password - Contraseña a validar
 * @returns Objeto con validez y mensaje
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  message: string;
} {
  if (password.length < 6) {
    return {
      isValid: false,
      message: 'La contraseña debe tener al menos 6 caracteres',
    };
  }

  if (password.length < 8) {
    return {
      isValid: true,
      message: 'Contraseña aceptable (se recomienda 8+ caracteres)',
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strengthCount = [
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
  ].filter(Boolean).length;

  if (strengthCount >= 3) {
    return {
      isValid: true,
      message: 'Contraseña fuerte',
    };
  }

  return {
    isValid: true,
    message: 'Contraseña válida',
  };
}

/**
 * Extrae el token de autenticación de las cookies
 * @param cookies - String de cookies del request
 * @returns Token o null si no existe
 */
export function extractTokenFromCookies(cookies: string): string | null {
  if (!cookies) {
    return null;
  }

  const match = cookies.match(/auth_token=([^;]+)/);
  return match ? match[1] : null;
}