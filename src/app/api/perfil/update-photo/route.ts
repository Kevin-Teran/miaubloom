import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { jwtVerify } from 'jose';

// --- LÓGICA DE AUTENTICACIÓN JWT REUTILIZABLE ---
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || 'tu-clave-secreta-muy-segura-aqui'
);

async function getAuthPayload(request: NextRequest): Promise<{ userId: string; rol: string } | null> {
  const token = request.cookies.get('miaubloom_session')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return { userId: payload.userId as string, rol: payload.rol as string };
  } catch (e) {
    console.warn('Error al verificar JWT en API:', e instanceof Error ? e.message : String(e));
    return null;
  }
}
// --- FIN DE LÓGICA DE AUTENTICACIÓN ---

export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticación por JWT
    const auth = await getAuthPayload(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Datos incompletos' },
        { status: 400 }
      );
    }
    
    // Usar el userId y rol del JWT, no del cliente
    const userId = auth.userId;
    const userRole = auth.rol;

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'El archivo debe ser una imagen' },
        { status: 400 }
      );
    }

    // Validar tamaño máximo (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'La imagen no debe superar 5MB' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const filename = userId 
      ? `${userRole.toLowerCase()}-${userId}-${Date.now()}.${file.type.split('/')[1]}`
      : `${userRole.toLowerCase()}-temp-${Date.now()}.${file.type.split('/')[1]}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filepath = path.join(uploadDir, filename);

    // Crear directorio si no existe
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch {
      // El directorio ya existe
    }

    // Guardar archivo
    await fs.writeFile(filepath, Buffer.from(buffer));

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
      message: 'Imagen guardada correctamente'
    });
  } catch (error) {
    console.error('Error al guardar foto:', error);
    return NextResponse.json(
      { success: false, error: 'Error al guardar la imagen' },
      { status: 500 }
    );
  }
}
