/**
 * @file route.ts
 * @route src/app/api/chat/conversaciones/route.ts
 * @description API endpoint para obtener conversaciones
 * @author Kevin Mariano
 * @version 1.0.0
 * @copyright MiauBloom
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthPayload } from '@/lib/auth';

interface ConversacionConMensajes {
  id: string;
  paciente?: {
    userId: string;
    fotoPerfil: string | null;
    user: {
      nombreCompleto: string;
      email: string;
    };
  };
  psicologo?: {
    userId: string;
    fotoPerfil: string | null;
    user: {
      nombreCompleto: string;
      email: string;
    };
  };
  mensajes: Array<{
    contenido: string;
    remitente: string;
    leido: boolean;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @function GET
 * @description Obtiene las conversaciones del usuario
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthPayload(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'No autenticado' },
        { status: 401 }
      );
    }

    const userId = auth.userId;
    const rol = auth.rol;

    let conversaciones: ConversacionConMensajes[];

    if (rol === 'Psicólogo') {
      // Obtener todos los pacientes asignados al psicólogo
      const pacientesAsignados = await prisma.perfilPaciente.findMany({
        where: {
          psicologoAsignadoId: userId,
        },
        include: {
          user: {
            select: {
              nombreCompleto: true,
              email: true,
            },
          },
        },
      });

      // Para cada paciente, buscar o crear la conversación
      conversaciones = await Promise.all(
        pacientesAsignados.map(async (paciente) => {
          // Buscar conversación existente
          let conversacion = await prisma.conversacion.findUnique({
            where: {
              psicologoId_pacienteId: {
                psicologoId: userId,
                pacienteId: paciente.userId,
              },
            },
            include: {
              paciente: {
                include: {
                  user: {
                    select: {
                      nombreCompleto: true,
                      email: true,
                    },
                  },
                },
              },
              mensajes: {
                orderBy: { createdAt: 'desc' },
                take: 1,
              },
            },
          });

          // Si no existe, crear una nueva conversación
          if (!conversacion) {
            conversacion = await prisma.conversacion.create({
              data: {
                psicologoId: userId,
                pacienteId: paciente.userId,
              },
              include: {
                paciente: {
                  include: {
                    user: {
                      select: {
                        nombreCompleto: true,
                        email: true,
                      },
                    },
                  },
                },
                mensajes: {
                  orderBy: { createdAt: 'desc' },
                  take: 1,
                },
              },
            });
          }

          return conversacion;
        })
      );

      // Ordenar por última actualización
      conversaciones.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    } else if (rol === 'Paciente') {
      // Obtener el psicólogo asignado
      const paciente = await prisma.perfilPaciente.findUnique({
        where: { userId },
        include: {
          psicologoAsignado: {
            include: {
              user: {
                select: {
                  nombreCompleto: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      conversaciones = [];

      if (paciente?.psicologoAsignadoId) {
        // Buscar o crear conversación con el psicólogo asignado
        let conversacion = await prisma.conversacion.findUnique({
          where: {
            psicologoId_pacienteId: {
              psicologoId: paciente.psicologoAsignadoId,
              pacienteId: userId,
            },
          },
          include: {
            psicologo: {
              include: {
                user: {
                  select: {
                    nombreCompleto: true,
                    email: true,
                  },
                },
              },
            },
            mensajes: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        });

        // Si no existe, crear la conversación
        if (!conversacion) {
          conversacion = await prisma.conversacion.create({
            data: {
              psicologoId: paciente.psicologoAsignadoId,
              pacienteId: userId,
            },
            include: {
              psicologo: {
                include: {
                  user: {
                    select: {
                      nombreCompleto: true,
                      email: true,
                    },
                  },
                },
              },
              mensajes: {
                orderBy: { createdAt: 'desc' },
                take: 1,
              },
            },
          });
        }

        conversaciones = [conversacion];
      }
    } else {
      return NextResponse.json(
        { success: false, message: 'Rol no válido' },
        { status: 400 }
      );
    }

    // Formatear respuesta con contador de mensajes no leídos
    const conversacionesFormateadas = await Promise.all(
      conversaciones.map(async (conv: ConversacionConMensajes) => {
        // Contar mensajes no leídos
        const mensajesNoLeidos = await prisma.mensaje.count({
          where: {
            conversacionId: conv.id,
            leido: false,
            remitenteId: { not: userId },
          },
        });

        if (rol === 'Psicólogo' && conv.paciente) {
          return {
            id: conv.id,
            otroUsuario: {
              id: conv.paciente.userId,
              nombre: conv.paciente.user.nombreCompleto,
              email: conv.paciente.user.email,
              avatar: conv.paciente.fotoPerfil || '/assets/avatar-paciente.png',
            },
            ultimoMensaje: conv.mensajes[0]
              ? {
                  contenido: conv.mensajes[0].contenido,
                  remitente: conv.mensajes[0].remitente,
                  fechaHora: conv.mensajes[0].createdAt,
                  leido: conv.mensajes[0].leido,
                }
              : null,
            mensajesNoLeidos,
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt,
          };
        } else if (conv.psicologo) {
          return {
            id: conv.id,
            otroUsuario: {
              id: conv.psicologo.userId,
              nombre: conv.psicologo.user.nombreCompleto,
              email: conv.psicologo.user.email,
              avatar: conv.psicologo.fotoPerfil || '/assets/avatar-psicologo.png',
            },
            ultimoMensaje: conv.mensajes[0]
              ? {
                  contenido: conv.mensajes[0].contenido,
                  remitente: conv.mensajes[0].remitente,
                  fechaHora: conv.mensajes[0].createdAt,
                  leido: conv.mensajes[0].leido,
                }
              : null,
            mensajesNoLeidos,
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt,
          };
        }
        return null;
      })
    );

    const conversacionesFiltradas = conversacionesFormateadas.filter(Boolean);

    // Ordenar: primero las que tienen mensajes no leídos
    conversacionesFiltradas.sort((a, b) => {
      if (a && b) {
        if (a.mensajesNoLeidos !== b.mensajesNoLeidos) {
          return b.mensajesNoLeidos - a.mensajesNoLeidos;
        }
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return 0;
    });

    // Calcular total de mensajes no leídos
    const totalNoLeidos = conversacionesFiltradas.reduce((sum, conv) => {
      return sum + (conv?.mensajesNoLeidos || 0);
    }, 0);

    return NextResponse.json(
      {
        success: true,
        conversaciones: conversacionesFiltradas,
        total: conversacionesFiltradas.length,
        totalMensajesNoLeidos: totalNoLeidos,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error al obtener conversaciones' },
      { status: 500 }
    );
  }
}

/**
 * @function POST
 * @description Crea una nueva conversación o retorna la existente
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthPayload(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'No autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { otroUsuarioId } = body;

    if (!otroUsuarioId) {
      return NextResponse.json(
        { success: false, message: 'ID del otro usuario requerido' },
        { status: 400 }
      );
    }

    const userId = auth.userId;
    const rol = auth.rol;

    let conversacion;

    if (rol === 'Psicólogo') {
      // El psicólogo no puede iniciar chat, solo puede chatear con sus pacientes asignados
      const pacienteAsignado = await prisma.perfilPaciente.findUnique({
        where: { userId: otroUsuarioId },
        select: { psicologoAsignadoId: true },
      });

      if (pacienteAsignado?.psicologoAsignadoId !== userId) {
        return NextResponse.json(
          { success: false, message: 'No tienes permiso para chatear con este paciente' },
          { status: 403 }
        );
      }

      // Buscar o crear conversación
      conversacion = await prisma.conversacion.upsert({
        where: {
          psicologoId_pacienteId: {
            psicologoId: userId,
            pacienteId: otroUsuarioId,
          },
        },
        update: {},
        create: {
          psicologoId: userId,
          pacienteId: otroUsuarioId,
        },
      });
    } else if (rol === 'Paciente') {
      // El paciente solo puede chatear con su psicólogo asignado
      const pacienteData = await prisma.perfilPaciente.findUnique({
        where: { userId },
        select: { psicologoAsignadoId: true },
      });

      if (pacienteData?.psicologoAsignadoId !== otroUsuarioId) {
        return NextResponse.json(
          { success: false, message: 'Solo puedes chatear con tu psicólogo asignado' },
          { status: 403 }
        );
      }

      // Buscar o crear conversación
      conversacion = await prisma.conversacion.upsert({
        where: {
          psicologoId_pacienteId: {
            psicologoId: otroUsuarioId,
            pacienteId: userId,
          },
        },
        update: {},
        create: {
          psicologoId: otroUsuarioId,
          pacienteId: userId,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Rol no válido' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        conversacion: {
          id: conversacion.id,
          psicologoId: conversacion.psicologoId,
          pacienteId: conversacion.pacienteId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error al crear conversación' },
      { status: 500 }
    );
  }
}

