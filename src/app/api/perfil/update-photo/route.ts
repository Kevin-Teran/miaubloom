import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const userRole = formData.get('userRole') as string;

    if (!file || !userRole) {
      return NextResponse.json(
        { success: false, error: 'Datos incompletos' },
        { status: 400 }
      );
    }

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
