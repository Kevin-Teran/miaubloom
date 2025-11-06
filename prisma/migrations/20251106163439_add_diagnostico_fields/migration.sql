-- AlterTable
ALTER TABLE `Perfiles_Paciente` ADD COLUMN `diagnostico` TEXT NULL DEFAULT 'No definido',
    ADD COLUMN `duracion_tratamiento` VARCHAR(191) NULL DEFAULT 'No definida';
