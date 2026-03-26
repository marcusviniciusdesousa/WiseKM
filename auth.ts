// src/lib/auth.ts
// Configuração NextAuth v5 (Auth.js) com Credentials Provider
// Estratégia: JWT em cookie HTTP-only (stateless, sem tabela de sessão extra)

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verificarSenha } from "@/lib/hash";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  // ── Estratégia JWT (sem banco de sessões) ──────────────────
  session: { strategy: "jwt" },

  // ── Páginas customizadas ───────────────────────────────────
  pages: {
    signIn: "/login",
    error: "/login",
  },

  // ── Providers ─────────────────────────────────────────────
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        // 1. Validação com Zod (nunca confiar no cliente)
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, senha } = parsed.data;

        // 2. Buscar usuário no banco
        const usuario = await prisma.usuario.findUnique({
          where: { email },
        });
        if (!usuario) return null;

        // 3. Verificar senha (timing-safe via bcrypt)
        const senhaOk = await verificarSenha(senha, usuario.senha);
        if (!senhaOk) return null;

        // 4. Retornar objeto do usuário (vai para o JWT)
        return {
          id: usuario.id,
          name: usuario.nome,
          email: usuario.email,
        };
      },
    }),
  ],

  // ── Callbacks ─────────────────────────────────────────────
  callbacks: {
    async jwt({ token, user }) {
      // Primeira vez: persiste o id customizado no token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Expõe o id para o cliente via useSession()
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
