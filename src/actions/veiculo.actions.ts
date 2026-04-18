// src/actions/veiculo.actions.ts
// Server Actions do Módulo de Garagem

"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

// ── Tipos de retorno ──────────────────────────────────────────────────────

export type VeiculoActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

// ── Schema de validação ───────────────────────────────────────────────────
// Os dados da FIPE chegam já validados pelo Client Component, mas validamos
// novamente no servidor (never trust the client)

const cadastrarVeiculoSchema = z.object({
  tipo: z.enum(["CARRO", "MOTO", "CAMINHAO"]), // <-- MUDANÇA: Caminhão adicionado
  codigoFipe: z.string().min(1, "Código FIPE obrigatório"),
  marca: z.string().min(1, "Marca obrigatória"),
  modelo: z.string().min(1, "Modelo obrigatório"),
  ano: z.string().min(1, "Ano obrigatório"),
  valorFipeAtual: z
    .string()
    .min(1, "Valor FIPE obrigatório")
    .transform((v) => parseFloat(v))
    .refine((v) => !isNaN(v) && v > 0, "Valor FIPE inválido"),
  quilometragem: z
    .string()
    .min(1, "Quilometragem obrigatória")
    .transform((v) => parseInt(v, 10))
    .refine((v) => !isNaN(v) && v >= 0, "Quilometragem deve ser 0 ou maior")
    .refine((v) => v <= 5_000_000, "Quilometragem parece inválida (máx 5.000.000 km)"), // <-- MUDANÇA: Limite aumentado
});

// ── Action: Cadastrar Veículo ─────────────────────────────────────────────

export async function cadastrarVeiculo(
  prevState: VeiculoActionResult,
  formData: FormData
): Promise<VeiculoActionResult> {
  // 1. Verificar autenticação
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sessão expirada. Faça login novamente." };
  }

  const usuarioId = session.user.id;

  // 2. Regra de negócio: 1 usuário = 1 veículo
  const veiculoExistente = await prisma.veiculo.findUnique({
    where: { usuarioId },
    select: { id: true },
  });

  if (veiculoExistente) {
    return {
      success: false,
      message:
        "Você já possui um veículo cadastrado. Acesse a Garagem para gerenciá-lo.",
    };
  }

  // 3. Extrair e validar dados do FormData
  const raw = {
    tipo: formData.get("tipo"),
    codigoFipe: formData.get("codigoFipe"),
    marca: formData.get("marca"),
    modelo: formData.get("modelo"),
    ano: formData.get("ano"),
    valorFipeAtual: formData.get("valorFipeAtual"),
    quilometragem: formData.get("quilometragem"),
  };

  const parsed = cadastrarVeiculoSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Corrija os erros abaixo",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { tipo, codigoFipe, marca, modelo, ano, valorFipeAtual, quilometragem } =
    parsed.data;

  // 4. Persistir no banco
  await prisma.veiculo.create({
    data: {
      usuarioId,
      tipo,
      codigoFipe,
      marca,
      modelo,
      ano,
      valorFipeAtual,
      quilometragem,
    },
  });

  // 5. Redirecionar para o dashboard após cadastro bem-sucedido
  redirect("/dashboard");
}

// ── Action: Excluir Veículo ───────────────────────────────────────────────

export async function excluirVeiculo(): Promise<VeiculoActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sessão expirada." };
  }

  const veiculoExistente = await prisma.veiculo.findUnique({
    where: { usuarioId: session.user.id },
  });

  if (!veiculoExistente) {
    return { success: false, message: "Veículo não encontrado." };
  }

  // O Prisma fará o Cascade Delete automático de todos os custos atrelados
  await prisma.veiculo.delete({
    where: { id: veiculoExistente.id },
  });

  return { success: true, message: "Veículo excluído com sucesso." };
}

// ── Action: Atualizar Quilometragem (Hodômetro) ───────────────────────────

export async function atualizarQuilometragem(novaQuilometragem: number): Promise<VeiculoActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sessão expirada." };
  }

  // Validação básica de segurança
  if (isNaN(novaQuilometragem) || novaQuilometragem < 0 || novaQuilometragem > 5000000) {
    return { success: false, message: "Valor de quilometragem inválido." };
  }

  try {
    // Atualiza apenas o campo quilometragem do veículo pertencente ao usuário
    await prisma.veiculo.update({
      where: { usuarioId: session.user.id },
      data: { quilometragem: novaQuilometragem },
    });

    return { success: true, message: "Hodômetro atualizado com sucesso." };
  } catch (error) {
    console.error("Erro ao atualizar KM:", error);
    return { success: false, message: "Falha ao atualizar o veículo no banco de dados." };
  }
}