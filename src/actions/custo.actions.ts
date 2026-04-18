// src/actions/custo.actions.ts
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache"; // <-- MUDANÇA 1: Importando o limpador de cache

export interface LoteCustoInput {
  nome: string;
  categoria: "MANUTENCAO" | "DOCUMENTACAO" | "SEGURO" | "CONSUMIVEL" | "OUTROS";
  valorAtual: number;
  durabilidadeKm: number | null;
  durabilidadeMeses: number | null;
}

export async function salvarLoteCustos(custosInput: LoteCustoInput[]) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sessão expirada." };
  }

  const veiculo = await prisma.veiculo.findUnique({
    where: { usuarioId: session.user.id },
    select: { id: true },
  });

  if (!veiculo) {
    return { success: false, message: "Veículo não encontrado." };
  }

  const custosValidos = custosInput.filter((c) => {
    const valorValido = c.valorAtual > 0;
    const kmValido = c.durabilidadeKm === null || c.durabilidadeKm > 0;
    const mesesValido = c.durabilidadeMeses === null || c.durabilidadeMeses > 0;
    const temPeloMenosUm = c.durabilidadeKm !== null || c.durabilidadeMeses !== null;

    return valorValido && kmValido && mesesValido && temPeloMenosUm;
  });

  if (custosValidos.length === 0) {
    return { success: false, message: "Nenhum dado válido para salvar. Valores não podem ser negativos ou zero." };
  }

  try {
    await prisma.custo.createMany({
      data: custosValidos.map((custo) => ({
        veiculoId: veiculo.id,
        nome: custo.nome,
        categoria: custo.categoria,
        valorAtual: custo.valorAtual,
        durabilidadeKm: custo.durabilidadeKm,
        durabilidadeMeses: custo.durabilidadeMeses,
      })),
    });

    // <-- MUDANÇA 2: Avisa o Next.js para atualizar a tela de listagem
    revalidatePath("/custos"); 
    revalidatePath("/custos/novo"); 

    return { success: true, message: `${custosValidos.length} itens salvos com sucesso.` };
  } catch (error) {
    console.error("Erro no Batch Insert de Custos:", error);
    return { success: false, message: "Falha ao salvar os itens no banco de dados." };
  }
}

export async function salvarCustoAvulso(
  dados: {
    id?: string; 
    nome: string;
    categoria: "MANUTENCAO" | "DOCUMENTACAO" | "SEGURO" | "CONSUMIVEL" | "OUTROS";
    valorAtual: number;
    durabilidadeKm: number | null;
    durabilidadeMeses: number | null;
  }
): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Sessão expirada." };

  const veiculo = await prisma.veiculo.findUnique({
    where: { usuarioId: session.user.id },
    select: { id: true },
  });

  if (!veiculo) return { success: false, message: "Veículo não encontrado." };

  if (
    dados.valorAtual <= 0 ||
    (dados.durabilidadeKm === null && dados.durabilidadeMeses === null) ||
    (dados.durabilidadeKm !== null && dados.durabilidadeKm <= 0) ||
    (dados.durabilidadeMeses !== null && dados.durabilidadeMeses <= 0)
  ) {
    return { success: false, message: "Dados inválidos. Os valores e durabilidades devem ser maiores que zero." };
  }

  try {
    if (dados.id) {
      await prisma.custo.update({
        where: { id: dados.id, veiculoId: veiculo.id }, 
        data: {
          nome: dados.nome,
          categoria: dados.categoria,
          valorAtual: dados.valorAtual,
          durabilidadeKm: dados.durabilidadeKm,
          durabilidadeMeses: dados.durabilidadeMeses,
        },
      });
      revalidatePath("/custos"); // Limpa cache
      return { success: true, message: "Custo atualizado com sucesso." };
    } else {
      await prisma.custo.create({
        data: {
          veiculoId: veiculo.id,
          nome: dados.nome,
          categoria: dados.categoria,
          valorAtual: dados.valorAtual,
          durabilidadeKm: dados.durabilidadeKm,
          durabilidadeMeses: dados.durabilidadeMeses,
        },
      });
      revalidatePath("/custos"); // Limpa cache
      return { success: true, message: "Custo adicionado com sucesso." };
    }
  } catch (error) {
    return { success: false, message: "Falha ao salvar no banco de dados." };
  }
}

export async function excluirCusto(id: string): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Sessão expirada." };

  try {
    const veiculo = await prisma.veiculo.findUnique({ where: { usuarioId: session.user.id }});
    if (!veiculo) return { success: false, message: "Veículo não encontrado." };

    await prisma.custo.delete({
      where: { id: id, veiculoId: veiculo.id }, 
    });
    
    revalidatePath("/custos"); // Limpa cache
    return { success: true, message: "Custo excluído." };
  } catch (error) {
    return { success: false, message: "Falha ao excluir o custo." };
  }
}

export async function excluirTodosCustos(): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Sessão expirada." };

  try {
    const veiculo = await prisma.veiculo.findUnique({ where: { usuarioId: session.user.id }});
    if (!veiculo) return { success: false, message: "Veículo não encontrado." };

    await prisma.custo.deleteMany({
      where: { veiculoId: veiculo.id }, 
    });
    
    revalidatePath("/custos");
    revalidatePath("/custos/novo");

    return { success: true, message: "Todos os custos foram excluídos." };
  } catch (error) {
    console.error("Erro ao excluir todos os custos:", error);
    return { success: false, message: "Falha ao limpar o banco de dados." };
  }
}