import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { Role } from '@prisma/client';

// Tipos de sesión (basados en el modelo User de Prisma)
export interface SessionUser {
  id: string;
  email: string;
  role: Role;
  onboarding_completed: boolean;
  full_name: string;
}

export type SessionData = {
  user: SessionUser;
};

// Configuración de Iron Session
export const sessionOptions = {
  // Asegúrate de definir SECRET_COOKIE_PASSWORD en .env (min 32 caracteres)
  cookieName: "miaubloom_session",
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 días de duración
  },
};

// Función de utilidad para acceder a la sesión en Server Components/Routes
export function getSession() {
  const session = getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
}