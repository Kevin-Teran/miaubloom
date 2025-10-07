/**
 * @file login.ts
 * @route src/pages/api/auth/login.ts
 * @description Maneja la autenticación de usuarios por correo/contraseña y verifica
 * si el perfil detallado del usuario (Paciente/Psicólogo) ha sido completado.
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../db/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido. Solo POST.' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Faltan credenciales: email y password son requeridos.' });
    }

    try {
        // 1. Buscar usuario por correo
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // 2. Comparar contraseña hasheada
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        let isProfileComplete = false;

        // 3. Verificar si el perfil detallado ha sido completado
        if (user.rol === 'Paciente') {
            const profile = await prisma.perfilPaciente.findUnique({ where: { userId: user.id } });
            isProfileComplete = !!profile;
        } else if (user.rol === 'Psicólogo') {
            const profile = await prisma.perfilPsicologo.findUnique({ where: { userId: user.id } });
            isProfileComplete = !!profile;
        } else if (user.rol === 'Admin') {
            // Asumimos que el Admin no requiere un perfil detallado adicional
            isProfileComplete = true; 
        }

        // 4. Crear un token de sesión (Simulación con datos de usuario)
        // Nota: En una app real, usarías 'jwt.sign' para crear un token seguro
        const sessionData = {
            userId: user.id,
            email: user.email,
            nombreCompleto: user.nombreCompleto,
            rol: user.rol,
            isProfileComplete: isProfileComplete,
        };
        
        // const token = jwt.sign(sessionData, process.env.JWT_SECRET!, { expiresIn: '7d' });

        // 5. Devolver datos de sesión y estado del perfil
        return res.status(200).json({
            // token, // Retornar token real
            sessionData, // Retornar datos de sesión para el frontend
            message: 'Inicio de sesión exitoso.',
        });

    } catch (error) {
        console.error('Error durante el login:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
}
