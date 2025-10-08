/**
 * @file seed.ts
 * @route prisma/seed.ts
 * @description Script para poblar la base de datos con datos de prueba
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

const { PrismaClient, Role, Gender, PracticeType } = require('@prisma/client');
const bcrypt = require('bcryptjs'); 

const prisma = new PrismaClient();

// Contraseña simple de demo.
const DUMMY_PASSWORD = 'password123';
const HASHED_PASSWORD = bcrypt.hashSync(DUMMY_PASSWORD, 10);

async function main() {
  console.log('Iniciando Seeder...');
  console.log(`Contraseña de todos los usuarios: ${DUMMY_PASSWORD}`);

  // ----------------------------------------------------------------------
  // 1. Catálogo de Emociones (EmotionCatalog)
  // ----------------------------------------------------------------------
  const emotions = [
    { name: 'Joy', category: 'positive', color_hex: '#FFD700', description: 'Sensación de felicidad y bienestar' },
    { name: 'Sadness', category: 'negative', color_hex: '#4A90E2', description: 'Sensación de pena o melancolía' },
    { name: 'Frustration', category: 'negative', color_hex: '#E74C3C', description: 'Sensación de impotencia ante obstáculos' },
    { name: 'Calm', category: 'positive', color_hex: '#2ECC71', description: 'Estado de tranquilidad y paz' },
    { name: 'Anxiety', category: 'negative', color_hex: '#F39C12', description: 'Sensación de preocupación o nerviosismo' },
    { name: 'Gratitude', category: 'positive', color_hex: '#9B59B6', description: 'Sentimiento de agradecimiento' },
  ];

  for (const data of emotions) {
    await prisma.emotionCatalog.upsert({
      where: { name: data.name },
      update: {},
      create: data,
    });
  }
  console.log('✅ Catálogo de Emociones base creado/actualizado.');

  // ----------------------------------------------------------------------
  // 2. Usuarios y Perfiles de Demostración
  // ----------------------------------------------------------------------
  
  // A. Admin (Commiszer)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@miaubloom.com' },
    update: {},
    create: {
      email: 'admin@miaubloom.com',
      password: HASHED_PASSWORD, 
      role: Role.admin,
      full_name: 'MiauBloom Admin',
      onboarding_completed: true,
      institution: 'MiauBloom Central',
    },
  });
  console.log(`👤 Admin creado: ${adminUser.email}`);
  
  // B. Psicólogo
  const psyUser = await prisma.user.upsert({
    // Email corregido a @miaubloom.com
    where: { email: 'psicologo@miaubloom.com' },
    update: {},
    create: {
      email: 'psicologo@miaubloom.com', 
      password: HASHED_PASSWORD, 
      role: Role.psychologist,
      full_name: 'Dr. Andrés Márquez Díaz',
      onboarding_completed: true,
      institution: 'IPS LA DIVINA MISERICORDIA SAS',
    },
  });

  await prisma.psychologistProfile.upsert({
    where: { user_id: psyUser.id },
    update: {},
    create: {
      user_id: psyUser.id,
      license_number: '123456-P',
      specialty: 'Terapia cognitivo-conductual',
      university_degree: 'Licenciado en Psicologia, 2010',
      practice_type: PracticeType.public,
      current_patients: 1, 
      patient_capacity: 20,
    },
  });
  console.log(`👨‍⚕️ Psicólogo creado: ${psyUser.full_name}`);
  
  // C. Paciente
  const patientUser = await prisma.user.upsert({
    // Email usando @ejemplo.com
    where: { email: 'paciente@ejemplo.com' },
    update: {},
    create: {
      email: 'paciente@ejemplo.com', 
      password: HASHED_PASSWORD, 
      role: Role.patient,
      full_name: 'Alisson Becker',
      onboarding_completed: true,
      institution: 'N/A',
    },
  });

  await prisma.patientProfile.upsert({
    where: { user_id: patientUser.id },
    update: {},
    create: {
      user_id: patientUser.id,
      date_of_birth: new Date('1995-07-20'),
      gender: Gender.female,
      emergency_contact: '+573009873587',
      previous_diagnosis: 'Trastorno depresivo mayor',
      time_since_diagnosis_months: 6,
      avatar_nickname: 'Nikky01',
      // Configuración del avatar vacía como se solicitó
      avatar_configuration: JSON.stringify({}), 
    },
  });
  console.log(`👩 Paciente creado: ${patientUser.full_name}`);

  // ----------------------------------------------------------------------
  // 3. Relación Paciente-Psicólogo (N:M)
  // ----------------------------------------------------------------------
  await prisma.patientPsychologistRelationship.upsert({
    where: { id: 'REL-DEMO-1' },
    update: { status: 'active' },
    create: {
      id: 'REL-DEMO-1',
      patient_id: patientUser.id,
      psychologist_id: psyUser.id,
      status: 'active',
    },
  });
  console.log('🔗 Relación Paciente-Psicólogo activa (Dr. Andrés y Alisson).');

  // ----------------------------------------------------------------------
  // 4. Activos (Assets) de Avatar y Targets AR
  // ----------------------------------------------------------------------
  
  // Se crean los assets como parte del sistema, pero no se asignan al paciente.
  await prisma.avatarAsset.upsert({
    where: { name: 'Gafas de Profesor' },
    update: {},
    create: {
      id: 'ASSET_GLASSES',
      name: 'Gafas de Profesor',
      category: 'glasses',
      asset_url: '/assets/avatar/glasses.glb',
    },
  });
  
  await prisma.avatarAsset.upsert({
    where: { name: 'Sombrero de Jardinero' },
    update: {},
    create: {
      id: 'ASSET_HAT',
      name: 'Sombrero de Jardinero',
      category: 'hat',
      asset_url: '/assets/avatar/hat.glb',
    },
  });
  
  const sadnessEmotion = await prisma.emotionCatalog.findUnique({ where: { name: 'Sadness' } });
  
  if (sadnessEmotion) {
    let target = await prisma.emotionTarget.findUnique({ where: { id: 'TARGET_TRISTEZA' } });
    
    if (!target) {
        target = await prisma.emotionTarget.create({
            data: {
                id: 'TARGET_TRISTEZA',
                emotion_id: sadnessEmotion.id,
                target_name: 'Card_Tristeza',
                target_ar_url: '/targets/sadness.jpg',
            }
        });
        console.log(`🖼️ Target AR: ${target.target_name} creado.`);
    } else {
        console.log(`🖼️ Target AR: ${target.target_name} ya existe.`);
    }
  } else {
    console.warn('⚠️ No se encontró la emoción "Sadness" para crear el Target AR.');
  }
  console.log('✨ Seeder completado con éxito.');
}

main()
  .catch((e) => {
    console.error('Error durante el seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });