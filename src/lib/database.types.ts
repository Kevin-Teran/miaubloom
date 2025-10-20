/**
 * @file database.types.ts
 * @route lib/database.types.ts
 * @description Tipos TypeScript generados para la base de datos de Supabase.
 * Define la estructura completa de todas las tablas y relaciones.
 * @author Kevin Mariano
 * @version 2.0.5
 * @since 1.0.0
 * @copyright MiauBloom
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      perfiles: {
        Row: {
          id: string;
          rol: 'paciente' | 'psicologo' | 'admin';
          nombre_completo: string;
          fecha_nacimiento: string | null;
          genero: 'masculino' | 'femenino' | 'otro' | 'prefiero_no_decir' | null;
          telefono: string | null;
          avatar_url: string | null;
          institucion: string | null;
          onboarding_completado: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          rol: 'paciente' | 'psicologo' | 'admin';
          nombre_completo: string;
          fecha_nacimiento?: string | null;
          genero?: 'masculino' | 'femenino' | 'otro' | 'prefiero_no_decir' | null;
          telefono?: string | null;
          avatar_url?: string | null;
          institucion?: string | null;
          onboarding_completado?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          rol?: 'paciente' | 'psicologo' | 'admin';
          nombre_completo?: string;
          fecha_nacimiento?: string | null;
          genero?: 'masculino' | 'femenino' | 'otro' | 'prefiero_no_decir' | null;
          telefono?: string | null;
          avatar_url?: string | null;
          institucion?: string | null;
          onboarding_completado?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      perfiles_paciente: {
        Row: {
          id: string;
          perfil_id: string;
          contacto_emergencia: string | null;
          diagnostico_previo: string | null;
          tiempo_diagnostico_meses: number | null;
          horario_uso_preferido: Json;
          duracion_uso_preferida: string;
          nickname_avatar: string;
          configuracion_avatar: Json;
          psicologo_asignado_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          perfil_id: string;
          contacto_emergencia?: string | null;
          diagnostico_previo?: string | null;
          tiempo_diagnostico_meses?: number | null;
          horario_uso_preferido?: Json;
          duracion_uso_preferida?: string;
          nickname_avatar?: string;
          configuracion_avatar?: Json;
          psicologo_asignado_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          perfil_id?: string;
          contacto_emergencia?: string | null;
          diagnostico_previo?: string | null;
          tiempo_diagnostico_meses?: number | null;
          horario_uso_preferido?: Json;
          duracion_uso_preferida?: string;
          nickname_avatar?: string;
          configuracion_avatar?: Json;
          psicologo_asignado_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      perfiles_psicologo: {
        Row: {
          id: string;
          perfil_id: string;
          numero_licencia: string | null;
          especialidad: string | null;
          titulo_universitario: string | null;
          universidad: string | null;
          anio_egreso: number | null;
          tipo_practica: 'privada' | 'publica' | 'ambas' | null;
          capacidad_pacientes: number;
          pacientes_actuales: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          perfil_id: string;
          numero_licencia?: string | null;
          especialidad?: string | null;
          titulo_universitario?: string | null;
          universidad?: string | null;
          anio_egreso?: number | null;
          tipo_practica?: 'privada' | 'publica' | 'ambas' | null;
          capacidad_pacientes?: number;
          pacientes_actuales?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          perfil_id?: string;
          numero_licencia?: string | null;
          especialidad?: string | null;
          titulo_universitario?: string | null;
          universidad?: string | null;
          anio_egreso?: number | null;
          tipo_practica?: 'privada' | 'publica' | 'ambas' | null;
          capacidad_pacientes?: number;
          pacientes_actuales?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      emociones_catalogo: {
        Row: {
          id: string;
          nombre: string;
          categoria: 'positiva' | 'negativa' | 'neutra';
          color_hex: string;
          icono_3d_url: string | null;
          target_ar_url: string | null;
          descripcion: string | null;
          activa: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          categoria: 'positiva' | 'negativa' | 'neutra';
          color_hex: string;
          icono_3d_url?: string | null;
          target_ar_url?: string | null;
          descripcion?: string | null;
          activa?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          categoria?: 'positiva' | 'negativa' | 'neutra';
          color_hex?: string;
          icono_3d_url?: string | null;
          target_ar_url?: string | null;
          descripcion?: string | null;
          activa?: boolean;
          created_at?: string;
        };
      };
      registros_emocionales: {
        Row: {
          id: string;
          paciente_id: string;
          emocion_id: string;
          intensidad: number;
          fecha_registro: string;
          contexto: string | null;
          dificultad_identificacion: 'muy_facil' | 'facil' | 'algo_dificil' | 'muy_dificil' | null;
          actividad_asociada: string | null;
          acompaniado: boolean | null;
          seguridad_identificacion: string | null;
          afecto_evento: number | null;
          respuestas_adicionales: Json;
          notas: string | null;
          creado_via: 'app' | 'ar_scan' | 'recordatorio';
          created_at: string;
        };
        Insert: {
          id?: string;
          paciente_id: string;
          emocion_id: string;
          intensidad: number;
          fecha_registro?: string;
          contexto?: string | null;
          dificultad_identificacion?: 'muy_facil' | 'facil' | 'algo_dificil' | 'muy_dificil' | null;
          actividad_asociada?: string | null;
          acompaniado?: boolean | null;
          seguridad_identificacion?: string | null;
          afecto_evento?: number | null;
          respuestas_adicionales?: Json;
          notas?: string | null;
          creado_via?: 'app' | 'ar_scan' | 'recordatorio';
          created_at?: string;
        };
        Update: {
          id?: string;
          paciente_id?: string;
          emocion_id?: string;
          intensidad?: number;
          fecha_registro?: string;
          contexto?: string | null;
          dificultad_identificacion?: 'muy_facil' | 'facil' | 'algo_dificil' | 'muy_dificil' | null;
          actividad_asociada?: string | null;
          acompaniado?: boolean | null;
          seguridad_identificacion?: string | null;
          afecto_evento?: number | null;
          respuestas_adicionales?: Json;
          notas?: string | null;
          creado_via?: 'app' | 'ar_scan' | 'recordatorio';
          created_at?: string;
        };
      };
      relacion_paciente_psicologo: {
        Row: {
          id: string;
          paciente_id: string;
          psicologo_id: string;
          fecha_inicio: string;
          fecha_fin: string | null;
          estado: 'activa' | 'pausada' | 'finalizada';
          notas_psicologo: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          paciente_id: string;
          psicologo_id: string;
          fecha_inicio?: string;
          fecha_fin?: string | null;
          estado?: 'activa' | 'pausada' | 'finalizada';
          notas_psicologo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          paciente_id?: string;
          psicologo_id?: string;
          fecha_inicio?: string;
          fecha_fin?: string | null;
          estado?: 'activa' | 'pausada' | 'finalizada';
          notas_psicologo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      citas: {
        Row: {
          id: string;
          paciente_id: string;
          psicologo_id: string;
          fecha_hora: string;
          duracion_minutos: number;
          tipo: 'presencial' | 'virtual' | 'emergencia';
          estado: 'programada' | 'confirmada' | 'completada' | 'cancelada' | 'no_asistio';
          motivo: string | null;
          notas_paciente: string | null;
          notas_psicologo: string | null;
          solicitada_por: 'paciente' | 'psicologo' | null;
          recordatorio_enviado: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          paciente_id: string;
          psicologo_id: string;
          fecha_hora: string;
          duracion_minutos?: number;
          tipo?: 'presencial' | 'virtual' | 'emergencia';
          estado?: 'programada' | 'confirmada' | 'completada' | 'cancelada' | 'no_asistio';
          motivo?: string | null;
          notas_paciente?: string | null;
          notas_psicologo?: string | null;
          solicitada_por?: 'paciente' | 'psicologo' | null;
          recordatorio_enviado?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          paciente_id?: string;
          psicologo_id?: string;
          fecha_hora?: string;
          duracion_minutos?: number;
          tipo?: 'presencial' | 'virtual' | 'emergencia';
          estado?: 'programada' | 'confirmada' | 'completada' | 'cancelada' | 'no_asistio';
          motivo?: string | null;
          notas_paciente?: string | null;
          notas_psicologo?: string | null;
          solicitada_por?: 'paciente' | 'psicologo' | null;
          recordatorio_enviado?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tareas_terapeuticas: {
        Row: {
          id: string;
          paciente_id: string;
          psicologo_id: string;
          titulo: string;
          descripcion: string | null;
          tipo: 'diaria' | 'semanal' | 'unica';
          fecha_asignacion: string;
          fecha_vencimiento: string | null;
          completada: boolean;
          fecha_completada: string | null;
          notas_paciente: string | null;
          prioridad: 'baja' | 'media' | 'alta';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          paciente_id: string;
          psicologo_id: string;
          titulo: string;
          descripcion?: string | null;
          tipo?: 'diaria' | 'semanal' | 'unica';
          fecha_asignacion?: string;
          fecha_vencimiento?: string | null;
          completada?: boolean;
          fecha_completada?: string | null;
          notas_paciente?: string | null;
          prioridad?: 'baja' | 'media' | 'alta';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          paciente_id?: string;
          psicologo_id?: string;
          titulo?: string;
          descripcion?: string | null;
          tipo?: 'diaria' | 'semanal' | 'unica';
          fecha_asignacion?: string;
          fecha_vencimiento?: string | null;
          completada?: boolean;
          fecha_completada?: string | null;
          notas_paciente?: string | null;
          prioridad?: 'baja' | 'media' | 'alta';
          created_at?: string;
          updated_at?: string;
        };
      };
      notificaciones: {
        Row: {
          id: string;
          usuario_id: string;
          tipo: 'cita' | 'tarea' | 'mensaje' | 'alerta' | 'recordatorio';
          titulo: string;
          mensaje: string;
          leida: boolean;
          fecha_leida: string | null;
          accion_url: string | null;
          prioridad: 'normal' | 'alta' | 'critica';
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          usuario_id: string;
          tipo: 'cita' | 'tarea' | 'mensaje' | 'alerta' | 'recordatorio';
          titulo: string;
          mensaje: string;
          leida?: boolean;
          fecha_leida?: string | null;
          accion_url?: string | null;
          prioridad?: 'normal' | 'alta' | 'critica';
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          usuario_id?: string;
          tipo?: 'cita' | 'tarea' | 'mensaje' | 'alerta' | 'recordatorio';
          titulo?: string;
          mensaje?: string;
          leida?: boolean;
          fecha_leida?: string | null;
          accion_url?: string | null;
          prioridad?: 'normal' | 'alta' | 'critica';
          metadata?: Json;
          created_at?: string;
        };
      };
      mensajes_chat: {
        Row: {
          id: string;
          relacion_id: string;
          remitente_id: string;
          destinatario_id: string;
          mensaje: string;
          tipo: 'texto' | 'alerta' | 'sistema';
          leido: boolean;
          fecha_leido: string | null;
          es_alerta: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          relacion_id: string;
          remitente_id: string;
          destinatario_id: string;
          mensaje: string;
          tipo?: 'texto' | 'alerta' | 'sistema';
          leido?: boolean;
          fecha_leido?: string | null;
          es_alerta?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          relacion_id?: string;
          remitente_id?: string;
          destinatario_id?: string;
          mensaje?: string;
          tipo?: 'texto' | 'alerta' | 'sistema';
          leido?: boolean;
          fecha_leido?: string | null;
          es_alerta?: boolean;
          created_at?: string;
        };
      };
      sesiones_terapia: {
        Row: {
          id: string;
          cita_id: string | null;
          paciente_id: string;
          psicologo_id: string;
          fecha_sesion: string;
          duracion_real_minutos: number | null;
          objetivos: string | null;
          intervenciones: string | null;
          observaciones: string | null;
          estado_paciente: string | null;
          plan_accion: string | null;
          proxima_sesion_sugerida: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cita_id?: string | null;
          paciente_id: string;
          psicologo_id: string;
          fecha_sesion: string;
          duracion_real_minutos?: number | null;
          objetivos?: string | null;
          intervenciones?: string | null;
          observaciones?: string | null;
          estado_paciente?: string | null;
          plan_accion?: string | null;
          proxima_sesion_sugerida?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cita_id?: string | null;
          paciente_id?: string;
          psicologo_id?: string;
          fecha_sesion?: string;
          duracion_real_minutos?: number | null;
          objetivos?: string | null;
          intervenciones?: string | null;
          observaciones?: string | null;
          estado_paciente?: string | null;
          plan_accion?: string | null;
          proxima_sesion_sugerida?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      analisis_emocional: {
        Row: {
          id: string;
          paciente_id: string;
          periodo_inicio: string;
          periodo_fin: string;
          emocion_predominante_id: string | null;
          total_registros: number;
          emociones_distribucion: Json;
          intensidad_promedio: number | null;
          dias_con_registro: number;
          tendencia: 'mejorando' | 'estable' | 'empeorando' | null;
          generado_automaticamente: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          paciente_id: string;
          periodo_inicio: string;
          periodo_fin: string;
          emocion_predominante_id?: string | null;
          total_registros?: number;
          emociones_distribucion?: Json;
          intensidad_promedio?: number | null;
          dias_con_registro?: number;
          tendencia?: 'mejorando' | 'estable' | 'empeorando' | null;
          generado_automaticamente?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          paciente_id?: string;
          periodo_inicio?: string;
          periodo_fin?: string;
          emocion_predominante_id?: string | null;
          total_registros?: number;
          emociones_distribucion?: Json;
          intensidad_promedio?: number | null;
          dias_con_registro?: number;
          tendencia?: 'mejorando' | 'estable' | 'empeorando' | null;
          generado_automaticamente?: boolean;
          created_at?: string;
        };
      };
    };
  };
}
