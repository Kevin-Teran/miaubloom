-- CreateTable
CREATE TABLE `Users` (
    `id` VARCHAR(36) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `nombre_completo` VARCHAR(191) NOT NULL,
    `rol` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Perfiles_Paciente` (
    `user_id` VARCHAR(36) NOT NULL,
    `fecha_nacimiento` DATE NOT NULL,
    `genero` VARCHAR(191) NOT NULL,
    `contacto_emergencia` VARCHAR(191) NOT NULL,
    `nickname_avatar` VARCHAR(191) NOT NULL DEFAULT 'Nikky',
    `horario_uso` VARCHAR(191) NOT NULL DEFAULT '1-2 Horas',
    `duracion_uso` VARCHAR(191) NOT NULL DEFAULT '1-2 Horas',
    `psicologo_asignado_id` VARCHAR(36) NULL,
    `perfil_completado_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Perfiles_Psicologo` (
    `user_id` VARCHAR(36) NOT NULL,
    `identificacion` VARCHAR(191) NOT NULL,
    `registro_profesional` VARCHAR(191) NOT NULL,
    `especialidad` VARCHAR(191) NOT NULL,
    `titulo_universitario` VARCHAR(191) NOT NULL,
    `pacientes_asignados_ids` JSON NULL,
    `perfil_completado_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Perfiles_Psicologo_identificacion_key`(`identificacion`),
    UNIQUE INDEX `Perfiles_Psicologo_registro_profesional_key`(`registro_profesional`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Password_Reset_Tokens` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Password_Reset_Tokens_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Perfiles_Paciente` ADD CONSTRAINT `Perfiles_Paciente_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Perfiles_Paciente` ADD CONSTRAINT `Perfiles_Paciente_psicologo_asignado_id_fkey` FOREIGN KEY (`psicologo_asignado_id`) REFERENCES `Perfiles_Psicologo`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Perfiles_Psicologo` ADD CONSTRAINT `Perfiles_Psicologo_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Password_Reset_Tokens` ADD CONSTRAINT `Password_Reset_Tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
