/**
 * @file seed.ts
 * @route prisma/seed.ts
 * @description Script para poblar la base de datos con datos de prueba
 * @author Kevin Mariano
 * @version 1.0.0
 * @copyright MiauBloom
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...\n');

  // Limpiar datos existentes (opcional - comentar en producción)
  console.log('🧹 Limpiando datos existentes...');
  await prisma.passwordResetToken.deleteMany();
  await prisma.cita.deleteMany();
  await prisma.tarea.deleteMany();
  await prisma.registroEmocional.deleteMany();
  await prisma.perfilPaciente.deleteMany();
  await prisma.perfilPsicologo.deleteMany();
  await prisma.user.deleteMany();
  console.log('✓ Datos limpiados\n');

  // Hash de contraseña para usuarios de prueba
  const password = await bcrypt.hash('test123', 12);

  // ============================================
  // CREAR PSICÓLOGOS
  // ============================================
  console.log('👨‍⚕️ Creando psicólogos de prueba...');

  const psicologo1 = await prisma.user.create({
    data: {
      email: 'dra.gonzalez@miaubloom.com',
      password,
      nombreCompleto: 'Dra. María González',
      rol: 'Psicólogo',
      perfilPsicologo: {
        create: {
          identificacion: '1234567890',
          registroProfesional: 'PSI-2024-001',
          especialidad: 'Terapia Cognitivo-Conductual',
          tituloUniversitario: 'Psicología Clínica - Universidad Nacional',
          genero: 'Femenino',
        },
      },
    },
  });

  const psicologo2 = await prisma.user.create({
    data: {
      email: 'dr.martinez@miaubloom.com',
      password,
      nombreCompleto: 'Dr. Carlos Martínez',
      rol: 'Psicólogo',
      perfilPsicologo: {
        create: {
          identificacion: '0987654321',
          registroProfesional: 'PSI-2024-002',
          especialidad: 'Psicología Infantil',
          tituloUniversitario: 'Psicología - Universidad de Los Andes',
          genero: 'Masculino',
        },
      },
    },
  });

  console.log(`✓ Psicólogo creado: ${psicologo1.email}`);
  console.log(`✓ Psicólogo creado: ${psicologo2.email}\n`);

  // ============================================
  // CREAR PACIENTES
  // ============================================
  console.log('👥 Creando pacientes de prueba...');

  const paciente1 = await prisma.user.create({
    data: {
      email: 'juan.perez@email.com',
      password,
      nombreCompleto: 'Juan Pérez',
      rol: 'Paciente',
      perfilPaciente: {
        create: {
          fechaNacimiento: new Date('1995-05-15'),
          genero: 'Masculino',
          contactoEmergencia: '+57 300 123 4567',
          nicknameAvatar: 'JuanP01',
          psicologoAsignadoId: psicologo1.id,
        },
      },
    },
  });

  const paciente2 = await prisma.user.create({
    data: {
      email: 'maria.lopez@email.com',
      password,
      nombreCompleto: 'María López',
      rol: 'Paciente',
      perfilPaciente: {
        create: {
          fechaNacimiento: new Date('1998-08-22'),
          genero: 'Femenino',
          contactoEmergencia: '+57 310 987 6543',
          nicknameAvatar: 'MariL02',
          psicologoAsignadoId: psicologo1.id,
        },
      },
    },
  });

  const paciente3 = await prisma.user.create({
    data: {
      email: 'carlos.ruiz@email.com',
      password,
      nombreCompleto: 'Carlos Ruiz',
      rol: 'Paciente',
      perfilPaciente: {
        create: {
          fechaNacimiento: new Date('2000-03-10'),
          genero: 'Masculino',
          contactoEmergencia: '+57 320 456 7890',
          nicknameAvatar: 'CarlosR03',
          psicologoAsignadoId: psicologo2.id,
        },
      },
    },
  });

  // Paciente sin perfil completo (para probar flujo de completar perfil)
  const pacienteSinPerfil = await prisma.user.create({
    data: {
      email: 'nuevo.paciente@email.com',
      password,
      nombreCompleto: 'Nuevo Paciente',
      rol: 'Paciente',
    },
  });

  console.log(`✓ Paciente creado: ${paciente1.email}`);
  console.log(`✓ Paciente creado: ${paciente2.email}`);
  console.log(`✓ Paciente creado: ${paciente3.email}`);
  console.log(`✓ Paciente sin perfil creado: ${pacienteSinPerfil.email}\n`);

  // ============================================
  // CREAR REGISTROS EMOCIONALES
  // ============================================
  console.log('💭 Creando registros emocionales...');

  await prisma.registroEmocional.createMany({
    data: [
      {
        pacienteId: paciente1.id,
        emocionPrincipal: 'Alegría',
        nivelAfectacion: 8,
        queOcurrio: 'Tuve una reunión',
        quePense: 'Esto salió muy bien',
        queHice: 'Presenté mis ideas con confianza',
        lugar: 'Oficina',
        compartirPsicologo: true,
        jardinMetadata: { planta: 'girasol', crecimiento: 80 },
      },
      {
        pacienteId: paciente1.id,
        emocionPrincipal: 'Ansiedad',
        nivelAfectacion: 6,
        queOcurrio: 'Tengo una presentación importante',
        quePense: '¿Y si me equivoco?',
        queHice: 'Empecé a preparar el material',
        lugar: 'Casa',
        compartirPsicologo: true,
        jardinMetadata: { planta: 'cactus', crecimiento: 60 },
      },
      {
        pacienteId: paciente2.id,
        emocionPrincipal: 'Tristeza',
        nivelAfectacion: 7,
        queOcurrio: 'Tuve una discusión',
        quePense: 'No se entienden mis puntos',
        queHice: 'Me retiré a mi cuarto',
        lugar: 'Casa',
        compartirPsicologo: true,
        jardinMetadata: { planta: 'sauce', crecimiento: 70 },
      },
      {
        pacienteId: paciente2.id,
        emocionPrincipal: 'Calma',
        nivelAfectacion: 9,
        queOcurrio: 'Practiqué meditación',
        quePense: 'Estoy en paz conmigo',
        queHice: 'Medité 20 minutos',
        lugar: 'Parque',
        compartirPsicologo: false,
        jardinMetadata: { planta: 'loto', crecimiento: 90 },
      },
    ],
  });

  console.log('✓ Registros emocionales creados\n');

  // ============================================
  // CREAR TAREAS
  // ============================================
  console.log('📝 Creando tareas terapéuticas...');

  await prisma.tarea.createMany({
    data: [
      {
        psicologoId: psicologo1.id,
        pacienteId: paciente1.id,
        descripcion: 'Practicar técnica de respiración 4-7-8 dos veces al día',
        fechaLimite: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 días
        estado: 'Pendiente',
        createdBy: psicologo1.id,
      },
      {
        psicologoId: psicologo1.id,
        pacienteId: paciente1.id,
        descripcion: 'Llenar diario de gratitud cada noche',
        fechaLimite: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // +14 días
        estado: 'Pendiente',
        createdBy: psicologo1.id,
      },
      {
        psicologoId: psicologo1.id,
        pacienteId: paciente2.id,
        descripcion: 'Realizar 30 minutos de ejercicio cardiovascular',
        fechaLimite: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        estado: 'Completada',
        createdBy: psicologo1.id,
      },
    ],
  });

  console.log('✓ Tareas creadas\n');

  // ============================================
  // CREAR CITAS
  // ============================================
  console.log('📅 Creando citas...');

  await prisma.cita.createMany({
    data: [
      {
        psicologoId: psicologo1.id,
        pacienteId: paciente1.id,
        fechaHora: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // En 2 días
        detalles: 'Sesión de seguimiento - Revisión de progreso',
        creadaPor: 'Psicólogo',
        estado: 'Programada',
      },
      {
        psicologoId: psicologo1.id,
        pacienteId: paciente2.id,
        fechaHora: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // En 3 días
        detalles: 'Terapia de manejo de emociones',
        creadaPor: 'Psicólogo',
        estado: 'Programada',
      },
      {
        psicologoId: psicologo2.id,
        pacienteId: paciente3.id,
        fechaHora: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // En 5 días
        detalles: 'Primera consulta - Evaluación inicial',
        creadaPor: 'Paciente',
        estado: 'Programada',
      },
    ],
  });

  console.log('✓ Citas creadas\n');

  // ============================================
  // RESUMEN
  // ============================================
  console.log('📊 RESUMEN DE DATOS CREADOS:');
  console.log('═'.repeat(50));
  console.log(`👨‍⚕️ Psicólogos: 2`);
  console.log(`👥 Pacientes: 4 (3 con perfil completo, 1 sin perfil)`);
  console.log(`💭 Registros Emocionales: 4`);
  console.log(`📝 Tareas: 3`);
  console.log(`📅 Citas: 3`);
  console.log('═'.repeat(50));
  console.log('\n✅ Seed completado exitosamente!\n');

  console.log('🔑 CREDENCIALES DE PRUEBA:');
  console.log('─'.repeat(50));
  console.log('Psicólogos:');
  console.log('  • dra.gonzalez@miaubloom.com / test123');
  console.log('  • dr.martinez@miaubloom.com / test123');
  console.log('\nPacientes:');
  console.log('  • juan.perez@email.com / test123 (perfil completo)');
  console.log('  • maria.lopez@email.com / test123 (perfil completo)');
  console.log('  • carlos.ruiz@email.com / test123 (perfil completo)');
  console.log('  • nuevo.paciente@email.com / test123 (sin perfil)');
  console.log('─'.repeat(50));
  console.log('\n💡 TIP: Usa "nuevo.paciente@email.com" para probar');
  console.log('   el flujo de completar perfil por primera vez.\n');
}

main()
  .catch((e) => {
    console.error('\n❌ Error durante el seed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });