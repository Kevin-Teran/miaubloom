-- CreateTable
CREATE TABLE `Conversaciones` (
    `id` VARCHAR(36) NOT NULL,
    `psicologo_id` VARCHAR(36) NOT NULL,
    `paciente_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Conversaciones_psicologo_id_paciente_id_key`(`psicologo_id`, `paciente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mensajes` (
    `id` VARCHAR(36) NOT NULL,
    `conversacion_id` VARCHAR(36) NOT NULL,
    `remitente` VARCHAR(191) NOT NULL,
    `remitente_id` VARCHAR(36) NOT NULL,
    `contenido` TEXT NOT NULL,
    `leido` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Conversaciones` ADD CONSTRAINT `Conversaciones_psicologo_id_fkey` FOREIGN KEY (`psicologo_id`) REFERENCES `Perfiles_Psicologo`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conversaciones` ADD CONSTRAINT `Conversaciones_paciente_id_fkey` FOREIGN KEY (`paciente_id`) REFERENCES `Perfiles_Paciente`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mensajes` ADD CONSTRAINT `Mensajes_conversacion_id_fkey` FOREIGN KEY (`conversacion_id`) REFERENCES `Conversaciones`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

