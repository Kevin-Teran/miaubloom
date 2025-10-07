/**
 * @file setup-check.js
 * @description Script de verificación de instalación y configuración de MiauBloom
 * @author Kevin Mariano
 * @version 1.0.0
 * @copyright MiauBloom
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60) + '\n');
}

// Verificaciones
const checks = {
  // 1. Verificar Node.js
  async checkNode() {
    try {
      const { stdout } = await execPromise('node --version');
      const version = stdout.trim();
      const majorVersion = parseInt(version.split('.')[0].replace('v', ''));
      
      if (majorVersion >= 18) {
        log(`✓ Node.js ${version} instalado`, 'green');
        return true;
      } else {
        log(`✗ Node.js ${version} (se requiere v18+)`, 'red');
        return false;
      }
    } catch (error) {
      log('✗ Node.js no está instalado', 'red');
      return false;
    }
  },

  // 2. Verificar npm/pnpm
  async checkPackageManager() {
    try {
      const { stdout } = await execPromise('npm --version');
      log(`✓ npm ${stdout.trim()} instalado`, 'green');
      return true;
    } catch (error) {
      log('✗ npm no está instalado', 'red');
      return false;
    }
  },

  // 3. Verificar dependencias instaladas
  checkNodeModules() {
    const nodeModulesPath = path.join(process.cwd(), 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
      log('✓ Dependencias instaladas (node_modules existe)', 'green');
      return true;
    } else {
      log('✗ Dependencias no instaladas', 'red');
      log('  Ejecuta: npm install', 'yellow');
      return false;
    }
  },

  // 4. Verificar archivos críticos
  checkCriticalFiles() {
    const files = [
      'package.json',
      'next.config.ts',
      'tsconfig.json',
      'tailwind.config.ts',
      'src/app/globals.css',
      'src/app/layout.tsx',
      'src/app/page.tsx',
      'prisma/schema.prisma',
    ];

    let allExist = true;
    files.forEach((file) => {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        log(`✓ ${file}`, 'green');
      } else {
        log(`✗ ${file} no encontrado`, 'red');
        allExist = false;
      }
    });

    return allExist;
  },

  // 5. Verificar variables de entorno
  checkEnvVariables() {
    const envPath = path.join(process.cwd(), '.env');
    
    if (!fs.existsSync(envPath)) {
      log('⚠ Archivo .env no encontrado', 'yellow');
      log('  Crea un archivo .env con las siguientes variables:', 'yellow');
      log('  DATABASE_URL="mysql://user:password@localhost:3306/miaubloom"', 'cyan');
      log('  JWT_SECRET="tu_secreto_super_seguro"', 'cyan');
      return false;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const hasDatabase = envContent.includes('DATABASE_URL');
    const hasJWT = envContent.includes('JWT_SECRET');

    if (hasDatabase && hasJWT) {
      log('✓ Variables de entorno configuradas', 'green');
      return true;
    } else {
      log('⚠ Faltan variables de entorno', 'yellow');
      if (!hasDatabase) log('  - DATABASE_URL', 'yellow');
      if (!hasJWT) log('  - JWT_SECRET', 'yellow');
      return false;
    }
  },

  // 6. Verificar base de datos
  async checkDatabase() {
    try {
      const { stdout } = await execPromise('npx prisma db push --skip-generate');
      log('✓ Base de datos configurada correctamente', 'green');
      return true;
    } catch (error) {
      log('✗ Error al conectar con la base de datos', 'red');
      log('  Verifica que MySQL esté corriendo y DATABASE_URL sea correcto', 'yellow');
      return false;
    }
  },

  // 7. Verificar Tailwind
  checkTailwind() {
    const cssPath = path.join(process.cwd(), 'src/app/globals.css');
    
    if (!fs.existsSync(cssPath)) {
      log('✗ globals.css no encontrado', 'red');
      return false;
    }

    const cssContent = fs.readFileSync(cssPath, 'utf8');
    const hasTailwind = cssContent.includes('@import "tailwindcss"') || 
                       cssContent.includes('@tailwind');

    if (hasTailwind) {
      log('✓ Tailwind CSS configurado', 'green');
      return true;
    } else {
      log('✗ Tailwind CSS no está configurado en globals.css', 'red');
      return false;
    }
  },
};

// Función principal
async function runChecks() {
  logSection('🔍 VERIFICACIÓN DE INSTALACIÓN - MiauBloom');

  const results = {
    node: false,
    packageManager: false,
    nodeModules: false,
    files: false,
    env: false,
    tailwind: false,
  };

  // Ejecutar verificaciones
  logSection('1. Sistema y Herramientas');
  results.node = await checks.checkNode();
  results.packageManager = await checks.checkPackageManager();

  logSection('2. Dependencias');
  results.nodeModules = checks.checkNodeModules();

  logSection('3. Archivos del Proyecto');
  results.files = checks.checkCriticalFiles();

  logSection('4. Configuración');
  results.env = checks.checkEnvVariables();
  results.tailwind = checks.checkTailwind();

  // Resumen final
  logSection('📊 RESUMEN');
  
  const totalChecks = Object.keys(results).length;
  const passedChecks = Object.values(results).filter(Boolean).length;
  const percentage = Math.round((passedChecks / totalChecks) * 100);

  log(`Verificaciones completadas: ${passedChecks}/${totalChecks} (${percentage}%)`, 
      percentage === 100 ? 'green' : percentage >= 70 ? 'yellow' : 'red');

  if (percentage === 100) {
    log('\n✓ ¡Todo listo! Puedes ejecutar:', 'green');
    log('  npm run dev', 'cyan');
  } else if (percentage >= 70) {
    log('\n⚠ Algunas configuraciones necesitan atención', 'yellow');
    log('  Revisa los errores arriba y corrígelos', 'yellow');
  } else {
    log('\n✗ Se encontraron problemas críticos', 'red');
    log('  Corrígelos antes de continuar', 'red');
  }

  // Siguientes pasos
  if (!results.nodeModules) {
    log('\n📝 SIGUIENTE PASO:', 'blue');
    log('  1. Ejecuta: npm install', 'cyan');
  } else if (!results.env) {
    log('\n📝 SIGUIENTE PASO:', 'blue');
    log('  1. Crea un archivo .env en la raíz del proyecto', 'cyan');
    log('  2. Agrega las variables necesarias', 'cyan');
  } else if (percentage === 100) {
    log('\n🚀 PROYECTO LISTO PARA DESARROLLO', 'green');
    log('\nComandos disponibles:', 'cyan');
    log('  npm run dev      - Iniciar servidor de desarrollo', 'cyan');
    log('  npm run build    - Construir para producción', 'cyan');
    log('  npm run start    - Iniciar servidor de producción', 'cyan');
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

// Ejecutar
runChecks().catch((error) => {
  console.error('Error durante la verificación:', error);
  process.exit(1);
});