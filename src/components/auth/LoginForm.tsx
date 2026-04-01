// src/components/auth/LoginForm.tsx
// Formulário de Login — Client Component que chama a Server Action

"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginUsuario } from "@/actions/auth.actions";

// Omitimos o tipo estrito ActionResult aqui para não dar erro de build no Typescript
const initialState: any = { success: false, message: "" };

export function LoginForm() {
  const [state, action, isPending] = useActionState(loginUsuario, initialState);
  const searchParams = useSearchParams();
  const cadastroSucesso = searchParams.get("cadastro") === "sucesso";

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
        Acesse sua conta
      </h1>

      {/* Banner de sucesso após cadastro */}
      {cadastroSucesso && (
        <div className="mb-5 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm text-center">
          Conta criada com sucesso! Faça seu login.
        </div>
      )}

      {/* Erro global */}
      {state.message && !state.success && (
        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">
          {state.message}
        </div>
      )}

      <form action={action} className="space-y-5">
        {/* E-mail */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/30 focus:border-[#00AEEF] transition-colors"
          />
          {state.errors?.email && (
            <p className="mt-1 text-xs text-red-500">{state.errors.email[0]}</p>
          )}
        </div>

        {/* Senha */}
        <div>
          <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1.5">
            Senha
          </label>
          <input
            id="senha"
            name="senha"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/30 focus:border-[#00AEEF] transition-colors"
          />
          {state.errors?.senha && (
            <p className="mt-1 text-xs text-red-500">{state.errors.senha[0]}</p>
          )}
        </div>

        {/* Botão submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 rounded-full bg-[#00AEEF] text-white font-semibold text-sm hover:bg-[#0099D4] active:bg-[#0085B8] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150 mt-2 cursor-pointer"
        >
          {isPending ? "Entrando..." : "Entrar"}
        </button>

        {/* Link esqueci a senha */}
        <div className="text-center">
          <Link
            href="/esqueci-senha"
            className="text-sm text-[#00AEEF] hover:text-[#0099D4] transition-colors"
          >
            Esqueci a senha
          </Link>
        </div>
      </form>
    </div>
  );
}