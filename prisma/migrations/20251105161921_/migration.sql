-- CreateTable
CREATE TABLE "Users" (
    "id" VARCHAR(36) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Perfiles_Paciente" (
    "user_id" VARCHAR(36) NOT NULL,
    "fecha_nacimiento" DATE NOT NULL,
    "genero" TEXT NOT NULL,
    "contacto_emergencia" TEXT NOT NULL,
    "institucionReferida" TEXT NOT NULL DEFAULT 'Privada',
    "nombre_institucion" TEXT,
    "nickname_avatar" TEXT NOT NULL,
    "foto_perfil" TEXT DEFAULT '/assets/avatar-paciente.png',
    "horario_uso" TEXT DEFAULT 'No especificado',
    "duracion_uso" TEXT DEFAULT 'No especificado',
    "psicologo_asignado_id" VARCHAR(36),
    "perfil_completado_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Perfiles_Paciente_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Perfiles_Psicologo" (
    "user_id" VARCHAR(36) NOT NULL,
    "genero" TEXT,
    "identificacion" TEXT NOT NULL,
    "registro_profesional" TEXT NOT NULL,
    "especialidad" TEXT NOT NULL,
    "titulo_universitario" TEXT NOT NULL,
    "nickname_avatar" TEXT DEFAULT 'Avatar',
    "foto_perfil" TEXT DEFAULT '/assets/avatar-psicologo.png',
    "horario_uso" TEXT DEFAULT 'No especificado',
    "duracion_uso" TEXT DEFAULT 'No especificado',
    "pacientes_asignados_ids" JSONB,
    "perfil_completado_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Perfiles_Psicologo_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Password_Reset_Tokens" (
    "id" VARCHAR(36) NOT NULL,
    "user_id" VARCHAR(36) NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Password_Reset_Tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registros_Emocionales" (
    "id" SERIAL NOT NULL,
    "paciente_id" VARCHAR(36) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emocion_principal" TEXT NOT NULL,
    "nivel_afectacion" INTEGER NOT NULL,
    "que_sucedio" TEXT,
    "compartir_psicologo" BOOLEAN NOT NULL DEFAULT false,
    "jardin_metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Registros_Emocionales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tareas" (
    "id" SERIAL NOT NULL,
    "psicologo_id" VARCHAR(36) NOT NULL,
    "paciente_id" VARCHAR(36) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_limite" DATE NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Pendiente',
    "created_by" VARCHAR(36) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tareas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Citas" (
    "id" SERIAL NOT NULL,
    "psicologo_id" VARCHAR(36) NOT NULL,
    "paciente_id" VARCHAR(36) NOT NULL,
    "fecha_hora" TIMESTAMP(3) NOT NULL,
    "detalles" TEXT,
    "creada_por" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Programada',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Citas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Perfiles_Psicologo_identificacion_key" ON "Perfiles_Psicologo"("identificacion");

-- CreateIndex
CREATE UNIQUE INDEX "Perfiles_Psicologo_registro_profesional_key" ON "Perfiles_Psicologo"("registro_profesional");

-- CreateIndex
CREATE UNIQUE INDEX "Password_Reset_Tokens_token_key" ON "Password_Reset_Tokens"("token");

-- AddForeignKey
ALTER TABLE "Perfiles_Paciente" ADD CONSTRAINT "Perfiles_Paciente_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perfiles_Paciente" ADD CONSTRAINT "Perfiles_Paciente_psicologo_asignado_id_fkey" FOREIGN KEY ("psicologo_asignado_id") REFERENCES "Perfiles_Psicologo"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perfiles_Psicologo" ADD CONSTRAINT "Perfiles_Psicologo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Password_Reset_Tokens" ADD CONSTRAINT "Password_Reset_Tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registros_Emocionales" ADD CONSTRAINT "Registros_Emocionales_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Perfiles_Paciente"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tareas" ADD CONSTRAINT "Tareas_psicologo_id_fkey" FOREIGN KEY ("psicologo_id") REFERENCES "Perfiles_Psicologo"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tareas" ADD CONSTRAINT "Tareas_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Perfiles_Paciente"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citas" ADD CONSTRAINT "Citas_psicologo_id_fkey" FOREIGN KEY ("psicologo_id") REFERENCES "Perfiles_Psicologo"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citas" ADD CONSTRAINT "Citas_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Perfiles_Paciente"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
