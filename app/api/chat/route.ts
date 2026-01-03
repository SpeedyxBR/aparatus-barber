import { streamText, convertToModelMessages, tool, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getDateAvailableTimeSlots } from "@/app/_actions/get-date-available-time-slots";
import { createBooking } from "@/app/_actions/create-booking";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const POST = async (request: Request) => {
  const { messages } = await request.json();

  // Get current user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id;
  const userName = session?.user?.name || "usuário";

  // Get user's booking history for personalization
  let userBookingHistory: string[] = [];
  if (userId) {
    const recentBookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        service: true,
        barbershop: true,
      },
      orderBy: { date: "desc" },
      take: 5,
    });
    userBookingHistory = recentBookings.map(
      (b) =>
        `${b.service.name} na ${b.barbershop.name} em ${b.date.toLocaleDateString("pt-BR")}`
    );
  }

  const historyContext =
    userBookingHistory.length > 0
      ? `\n\nHistórico de agendamentos do usuário:\n${userBookingHistory.map((h, i) => `${i + 1}. ${h}`).join("\n")}`
      : "";

  const result = streamText({
    // Updated to Gemini 2.5 Flash for improved performance and capabilities
    model: google("gemini-2.5-flash-preview-05-20"),
    stopWhen: stepCountIs(10),
    system: `Você é o Aparatus.ai, um assistente virtual de agendamento de barbearias amigável e eficiente.

    DATA ATUAL: Hoje é ${new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })} (${new Date().toISOString().split("T")[0]})

    ${userId ? `USUÁRIO LOGADO: ${userName}` : "USUÁRIO NÃO LOGADO: Para criar agendamentos, o usuário precisará fazer login."}
    ${historyContext}

    Seu objetivo é ajudar os usuários a:
    - Encontrar barbearias (por nome ou todas disponíveis)
    - Verificar disponibilidade de horários para barbearias específicas
    - Fornecer informações sobre serviços e preços
    - Criar agendamentos de forma simples e rápida

    PERSONALIDADE:
    - Seja amigável, simpático e use emojis ocasionalmente (mas sem exagerar)
    - Use linguagem informal e brasileira
    - Seja proativo ao sugerir opções e horários
    - Reconheça padrões do usuário baseado no histórico (se disponível)

    FLUXO DE ATENDIMENTO:

    CENÁRIO 1 - Usuário menciona data/horário na primeira mensagem:
    1. Use a ferramenta searchBarbershops para buscar barbearias
    2. IMEDIATAMENTE após receber as barbearias, use getAvailableTimeSlotsForBarbershop para CADA barbearia, passando a data
    3. Apresente APENAS as barbearias com horários disponíveis:
       - 📍 Nome e endereço
       - ✂️ Serviços com preços
       - ⏰ 4-5 horários disponíveis espaçados
    4. Quando o usuário escolher, forneça o resumo final

    CENÁRIO 2 - Usuário não menciona data inicialmente:
    1. Use searchBarbershops para buscar barbearias
    2. Apresente as opções de forma organizada
    3. Quando demonstrar interesse, pergunte a data desejada
    4. Use getAvailableTimeSlotsForBarbershop com a data
    5. Apresente horários disponíveis (4-5 opções)

    CENÁRIO 3 - Usuário tem histórico de agendamentos:
    - Se o usuário perguntar "quero o mesmo de sempre" ou similar, use o histórico para sugerir
    - Lembre o usuário de suas preferências anteriores

    RESUMO FINAL (quando o usuário escolher):
    📋 **Resumo do Agendamento**
    - 🏪 Barbearia: [nome]
    - 📍 Endereço: [endereço]
    - ✂️ Serviço: [serviço]
    - 📅 Data: [data por extenso]
    - ⏰ Horário: [horário]
    - 💰 Valor: R$ [preço]

    Deseja confirmar?

    CRIAÇÃO DA RESERVA:
    - Após confirmação explícita ("confirmo", "pode agendar", "quero esse"), use createBooking
    - Parâmetros: serviceId (ID do serviço) e date (ISO: YYYY-MM-DDTHH:mm:ss)
    - Se success: true → Celebre! "🎉 Reserva confirmada com sucesso!"
    - Se error "User must be logged in" → Peça para o usuário fazer login
    - Outros erros → Explique e peça para tentar novamente

    REGRAS IMPORTANTES:
    - NUNCA mostre IDs, formatos técnicos ou dados sensíveis ao usuário
    - Use datas por extenso (ex: "terça-feira, 15 de janeiro")
    - Preços sempre em Reais (R$ XX,XX)
    - Liste apenas 4-5 horários, não todos
    - Se não houver horários, sugira outra data
    - Para "hoje", "amanhã", dias da semana → calcule a data correta`,
    messages: convertToModelMessages(messages),
    tools: {
      searchBarbershops: tool({
        description:
          "Pesquisa barbearias pelo nome. Se nenhum nome é fornecido, retorna todas as barbearias.",
        inputSchema: z.object({
          name: z.string().optional().describe("Nome opcional da barbearia"),
        }),
        execute: async ({ name }: { name?: string }) => {
          if (!name?.trim()) {
            const barbershops = await prisma.barbershop.findMany({
              include: {
                services: true,
              },
            });
            return barbershops.map((barbershop) => ({
              barbershopId: barbershop.id,
              name: barbershop.name,
              address: barbershop.address,
              imageUrl: barbershop.imageUrl,
              services: barbershop.services.map((service) => ({
                id: service.id,
                name: service.name,
                price: service.priceInCents / 100,
              })),
            }));
          }
          const barbershops = await prisma.barbershop.findMany({
            where: {
              name: {
                contains: name,
                mode: "insensitive",
              },
            },
            include: {
              services: true,
            },
          });
          return barbershops.map((barbershop) => ({
            barbershopId: barbershop.id,
            name: barbershop.name,
            address: barbershop.address,
            imageUrl: barbershop.imageUrl,
            services: barbershop.services.map((service) => ({
              id: service.id,
              name: service.name,
              price: service.priceInCents / 100,
            })),
          }));
        },
      }),

      getAvailableTimeSlotsForBarbershop: tool({
        description:
          "Obtém os horários disponíveis para uma barbearia em uma data específica.",
        inputSchema: z.object({
          barbershopId: z.string().describe("ID da barbearia"),
          date: z
            .string()
            .describe(
              "Data no formato YYYY-MM-DD para a qual deseja obter os horários disponíveis"
            ),
        }),
        execute: async ({
          barbershopId,
          date,
        }: {
          barbershopId: string;
          date: string;
        }) => {
          const parsedDate = new Date(date);
          const result = await getDateAvailableTimeSlots({
            barbershopId,
            date: parsedDate,
          });
          if (result.serverError || result.validationErrors) {
            return {
              error:
                result.validationErrors?._errors?.[0] ||
                "Erro ao buscar horários disponíveis",
            };
          }
          return {
            barbershopId,
            date,
            availableTimeSlots: result.data,
          };
        },
      }),

      getBarbershopDetails: tool({
        description:
          "Busca detalhes completos de uma barbearia específica incluindo imagem, descrição e telefones.",
        inputSchema: z.object({
          barbershopId: z.string().describe("ID da barbearia"),
        }),
        execute: async ({ barbershopId }: { barbershopId: string }) => {
          const barbershop = await prisma.barbershop.findUnique({
            where: { id: barbershopId },
            include: {
              services: true,
            },
          });
          if (!barbershop) {
            return { error: "Barbearia não encontrada" };
          }
          return {
            barbershopId: barbershop.id,
            name: barbershop.name,
            address: barbershop.address,
            description: barbershop.description,
            imageUrl: barbershop.imageUrl,
            phones: barbershop.phones,
            services: barbershop.services.map((service) => ({
              id: service.id,
              name: service.name,
              description: service.description,
              price: service.priceInCents / 100,
              imageUrl: service.imageUrl,
            })),
          };
        },
      }),

      getUserBookingHistory: tool({
        description:
          "Busca os últimos agendamentos do usuário logado para personalização e sugestões.",
        inputSchema: z.object({}),
        execute: async () => {
          if (!userId) {
            return {
              error: "Usuário não está logado",
              bookings: [],
            };
          }
          const bookings = await prisma.booking.findMany({
            where: { userId },
            include: {
              service: {
                include: {
                  barbershop: true,
                },
              },
              barbershop: true,
            },
            orderBy: { date: "desc" },
            take: 10,
          });
          return {
            bookings: bookings.map((booking) => ({
              id: booking.id,
              date: booking.date.toISOString(),
              cancelled: booking.cancelled,
              service: {
                id: booking.service.id,
                name: booking.service.name,
                price: booking.service.priceInCents / 100,
              },
              barbershop: {
                id: booking.barbershop.id,
                name: booking.barbershop.name,
                address: booking.barbershop.address,
              },
            })),
          };
        },
      }),

      checkUserAuthentication: tool({
        description:
          "Verifica se o usuário está autenticado e retorna informações básicas.",
        inputSchema: z.object({}),
        execute: async () => {
          if (!session?.user) {
            return {
              isAuthenticated: false,
              message:
                "Usuário não está logado. Para criar agendamentos, é necessário fazer login.",
            };
          }
          return {
            isAuthenticated: true,
            user: {
              name: session.user.name,
              email: session.user.email,
            },
          };
        },
      }),

      createBooking: tool({
        description:
          "Cria um agendamento para um serviço em uma data específica. O usuário precisa estar logado.",
        inputSchema: z.object({
          serviceId: z.string().describe("ID do serviço"),
          date: z
            .string()
            .describe(
              "Data em ISO String para a qual deseja agendar (YYYY-MM-DDTHH:mm:ss)"
            ),
        }),
        execute: async ({
          serviceId,
          date,
        }: {
          serviceId: string;
          date: string;
        }) => {
          if (!userId) {
            return {
              success: false,
              error: "User must be logged in",
            };
          }
          const parsedDate = new Date(date);
          const result = await createBooking({
            serviceId,
            date: parsedDate,
          });
          if (result.serverError || result.validationErrors) {
            return {
              success: false,
              error:
                result.validationErrors?._errors?.[0] ||
                result.serverError ||
                "Erro ao criar agendamento",
            };
          }
          return {
            success: true,
            message: "Agendamento criado com sucesso! 🎉",
            bookingId: result.data?.id,
          };
        },
      }),
    },
  });
  return result.toUIMessageStreamResponse();
};
