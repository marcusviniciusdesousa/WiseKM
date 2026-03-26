// src/actions/auth.actions.ts
// Server Actions — lógica de negócio no servidor, zero exposição ao cliente

"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashSenha } from "@/lib/hash";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

// ── Schemas de validação ───────────────────────────────────────

const cadastroSchema = z
  .object({
    nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    cpf: z
      .string()
      .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
    email: z.string().email("E-mail inválido"),
    senha: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(1, "Informe a senha"),
});

// ── Tipos de retorno ──────────────────────────────────────────

export type ActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

// ── Action: Cadastro ──────────────────────────────────────────

export async function cadastrarUsuario(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    nome: formData.get("nome"),
    cpf: formData.get("cpf"),
    email: formData.get("email"),
    senha: formData.get("senha"),
    confirmarSenha: formData.get("confirmarSenha"),
  };

  // Validar
  const parsed = cadastroSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Corrija os erros abaixo",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { nome, cpf, email, senha } = parsed.data;

  // Verificar duplicatas
  const existente = await prisma.usuario.findFirst({
    where: { OR: [{ email }, { cpf }] },
  });

  if (existente) {
    return {
      success: false,
      message:
        existente.email === email
          ? "Este e-mail já está cadastrado"
          : "Este CPF já está cadastrado",
    };
  }

  // Criar usuário com senha hasheada
  const senhaHash = await hashSenha(senha);
  await prisma.usuario.create({
    data: { nome, cpf, email, senha: senhaHash },
  });

  redirect("/login?cadastro=sucesso");
}

// ── Action: Login ─────────────────────────────────────────────

export async function loginUsuario(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    email: formData.get("email"),
    senha: formData.get("senha"),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Corrija os erros abaixo",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      senha: parsed.data.senha,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: "E-mail ou senha inválidos",
      };
    }
    throw error; // deixa o Next.js tratar erros inesperados
  }

  return { success: true, message: "Login realizado!" };
}
