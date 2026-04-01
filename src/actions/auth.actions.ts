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
function validarCPF(cpf: string) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  const cpfArr = cpf.split("").map((el) => +el);
  const rest = (count: number) =>
    ((cpfArr.slice(0, count - 12).reduce((soma, el, index) => soma + el * (count - index), 0) * 10) % 11) % 10;
  return rest(10) === cpfArr[9] && rest(11) === cpfArr[10];
}

const cadastroSchema = z
  .object({
    nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    cpf: z.string().refine(validarCPF, "CPF inválido ou inexistente"), 
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

import { signOut } from "@/lib/auth"; // Adicione isso no topo junto com os outros imports se não tiver

export async function logoutUsuario() {
  await signOut({ redirectTo: "/" });
}