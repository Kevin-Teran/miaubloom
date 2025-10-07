/*
  Warnings:

  - You are about to drop the column `duracion_uso` on the `Perfiles_Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `horario_uso` on the `Perfiles_Paciente` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Perfiles_Paciente` DROP COLUMN `duracion_uso`,
    DROP COLUMN `horario_uso`;

-- CreateTable
CREATE TABLE `Registros_Emocionales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paciente_id` VARCHAR(36) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `emocion_principal` VARCHAR(191) NOT NULL,
    `nivel_afectacion` INTEGER NOT NULL,
    `que_sucedio` TEXT NULL,
    `compartir_psicologo` BOOLEAN NOT NULL DEFAULT false,
    `jardin_metadata` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tareas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `psicologo_id` VARCHAR(36) NOT NULL,
    `paciente_id` VARCHAR(36) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `fecha_limite` DATE NOT NULL,
    `estado` VARCHAR(191) NOT NULL DEFAULT 'Pendiente',
    `created_by` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Citas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `psicologo_id` VARCHAR(36) NOT NULL,
    `paciente_id` VARCHAR(36) NOT NULL,
    `fecha_hora` DATETIME(3) NOT NULL,
    `detalles` TEXT NULL,
    `creada_por` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL DEFAULT 'Programada',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Registros_Emocionales` ADD CONSTRAINT `Registros_Emocionales_paciente_id_fkey` FOREIGN KEY (`paciente_id`) REFERENCES `Perfiles_Paciente`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tareas` ADD CONSTRAINT `Tareas_psicologo_id_fkey` FOREIGN KEY (`psicologo_id`) REFERENCES `Perfiles_Psicologo`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tareas` ADD CONSTRAINT `Tareas_paciente_id_fkey` FOREIGN KEY (`paciente_id`) REFERENCES `Perfiles_Paciente`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Citas` ADD CONSTRAINT `Citas_psicologo_id_fkey` FOREIGN KEY (`psicologo_id`) REFERENCES `Perfiles_Psicologo`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Citas` ADD CONSTRAINT `Citas_paciente_id_fkey` FOREIGN KEY (`paciente_id`) REFERENCES `Perfiles_Paciente`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
