// src/actions/perfil.actions.ts
"use server";

import { z } from "zod";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashSenha, verificarSenha } from "@/lib/hash";
import { revalidatePath } from "next/cache";

export type PerfilActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

// ── 1. Atualizar Dados Pessoais ───────────────────────────────────────────
const dadosSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100),
  email: z.string().email("E-mail inválido"),
});

export async function atualizarDados(prevState: PerfilActionResult, formData: FormData): Promise<PerfilActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Sessão expirada." };

  const raw = { nome: formData.get("nome"), email: formData.get("email") };
  const parsed = dadosSchema.safeParse(raw);
  
  if (!parsed.success) {
    return { success: false, message: "Corrija os erros.", errors: parsed.error.flatten().fieldErrors };
  }

  const { nome, email } = parsed.data;

  if (email !== session.user.email) {
    const existe = await prisma.usuario.findFirst({ where: { email, id: { not: session.user.id } } });
    if (existe) return { success: false, message: "E-mail já em uso." };
  }

  await prisma.usuario.update({
    where: { id: session.user.id },
    data: { nome, email },
  });

  revalidatePath("/perfil");
  return { success: true, message: "Informações atualizadas com sucesso!" };
}

// ── 2. Atualizar Senha (Agora exige a senha atual) ────────────────────────
const senhaSchema = z.object({
  senhaAtual: z.string().min(1, "Informe sua senha atual"),
  novaSenha: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  confirmarSenha: z.string()
}).refine((data) => data.novaSenha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

export async function atualizarSenha(prevState: PerfilActionResult, formData: FormData): Promise<PerfilActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Sessão expirada." };

  const raw = { 
    senhaAtual: formData.get("senhaAtual"),
    novaSenha: formData.get("novaSenha"), 
    confirmarSenha: formData.get("confirmarSenha") 
  };
  const parsed = senhaSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, message: "Verifique as senhas informadas.", errors: parsed.error.flatten().fieldErrors };
  }

  // Busca o usuário para verificar a senha atual
  const usuarioDb = await prisma.usuario.findUnique({ where: { id: session.user.id } });
  if (!usuarioDb) return { success: false, message: "Usuário não encontrado." };

  // Verifica se a senha atual está correta
  const senhaCorreta = await verificarSenha(parsed.data.senhaAtual, usuarioDb.senha);
  if (!senhaCorreta) return { success: false, message: "A senha atual está incorreta." };

  const senhaHash = await hashSenha(parsed.data.novaSenha);
  
  await prisma.usuario.update({
    where: { id: session.user.id },
    data: { senha: senhaHash },
  });

  return { success: true, message: "Senha alterada com segurança!" };
}

// ── 3. Excluir Conta ──────────────────────────────────────────────────────
export async function deletarContaComSenha(prevState: PerfilActionResult, formData: FormData): Promise<PerfilActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Sessão expirada." };

  const senhaDigitada = formData.get("senhaExclusao") as string;
  if (!senhaDigitada) return { success: false, message: "A senha é obrigatória para excluir a conta." };

  const usuarioDb = await prisma.usuario.findUnique({ where: { id: session.user.id } });
  if (!usuarioDb) return { success: false, message: "Usuário não encontrado." };

  const senhaCorreta = await verificarSenha(senhaDigitada, usuarioDb.senha);
  if (!senhaCorreta) return { success: false, message: "Senha incorreta. A exclusão foi cancelada." };

  await prisma.usuario.delete({ where: { id: session.user.id } });
  await signOut({ redirectTo: "/?conta=excluida" });

  return { success: true, message: "Conta excluída." };
}