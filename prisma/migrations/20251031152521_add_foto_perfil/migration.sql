-- AlterTable
ALTER TABLE `Perfiles_Paciente` ADD COLUMN `foto_perfil` VARCHAR(191) NULL DEFAULT '/assets/avatar-paciente.png';

-- AlterTable
ALTER TABLE `Perfiles_Psicologo` ADD COLUMN `foto_perfil` VARCHAR(191) NULL DEFAULT '/assets/avatar-psicologo.png';
