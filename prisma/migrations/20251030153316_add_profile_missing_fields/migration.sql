-- AlterTable
ALTER TABLE `Perfiles_Paciente` ADD COLUMN `duracion_uso` VARCHAR(191) NULL DEFAULT 'No especificado',
    ADD COLUMN `horario_uso` VARCHAR(191) NULL DEFAULT 'No especificado',
    ADD COLUMN `institucionReferida` VARCHAR(191) NOT NULL DEFAULT 'Privada',
    ADD COLUMN `nombre_institucion` VARCHAR(191) NULL,
    ALTER COLUMN `nickname_avatar` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Perfiles_Psicologo` ADD COLUMN `duracion_uso` VARCHAR(191) NULL DEFAULT 'No especificado',
    ADD COLUMN `horario_uso` VARCHAR(191) NULL DEFAULT 'No especificado',
    ADD COLUMN `nickname_avatar` VARCHAR(191) NULL DEFAULT 'Avatar';
