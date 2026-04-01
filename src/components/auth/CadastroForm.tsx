// src/components/auth/CadastroForm.tsx
// Formulário de Cadastro — Client Component que chama a Server Action

"use client";

import { useActionState } from "react";
import { cadastrarUsuario } from "@/actions/auth.actions";

// Removido o tipo ActionResult para evitar conflitos de TS
const initialState: any = { success: false, message: "" };

// ── Helper: máscara de CPF ────────────────────────────────────
function mascararCPF(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function CadastroForm() {
  const [state, action, isPending] = useActionState(cadastrarUsuario, initialState);

  // Aplica máscara de CPF no onChange
  function handleCPF(e: React.ChangeEvent<HTMLInputElement>) {
    e.target.value = mascararCPF(e.target.value);
  }

  // Transformado em uma string de linha única para evitar Hydration Mismatch
  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/30 focus:border-[#00AEEF] transition-colors";

  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
        Crie sua conta
      </h1>

      {/* Erro global */}
      {state.message && !state.success && (
        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">
          {state.message}
        </div>
      )}

      <form action={action} className="space-y-5">
        {/* Nome Completo */}
        <div>
          <label htmlFor="nome" className={labelClass}>Nome Completo</label>
          <input
            id="nome"
            name="nome"
            type="text"
            placeholder="Digite seu nome"
            autoComplete="name"
            required
            className={inputClass}
          />
          {state.errors?.nome && <p className={errorClass}>{state.errors.nome[0]}</p>}
        </div>

        {/* CPF */}
        <div>
          <label htmlFor="cpf" className={labelClass}>CPF</label>
          <input
            id="cpf"
            name="cpf"
            type="text"
            placeholder="000.000.000-00"
            inputMode="numeric"
            autoComplete="off"
            required
            onChange={handleCPF}
            className={inputClass}
          />
          {state.errors?.cpf && <p className={errorClass}>{state.errors.cpf[0]}</p>}
        </div>

        {/* E-mail */}
        <div>
          <label htmlFor="email" className={labelClass}>E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            required
            className={inputClass}
          />
          {state.errors?.email && <p className={errorClass}>{state.errors.email[0]}</p>}
        </div>

        {/* Senha */}
        <div>
          <label htmlFor="senha" className={labelClass}>Senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            placeholder="Crie uma senha forte"
            autoComplete="new-password"
            required
            className={inputClass}
          />
          {state.errors?.senha && <p className={errorClass}>{state.errors.senha[0]}</p>}
        </div>

        {/* Confirmar Senha */}
        <div>
          <label htmlFor="confirmarSenha" className={labelClass}>Confirmar senha</label>
          <input
            id="confirmarSenha"
            name="confirmarSenha"
            type="password"
            placeholder="Repita sua senha"
            autoComplete="new-password"
            required
            className={inputClass}
          />
          {state.errors?.confirmarSenha && (
            <p className={errorClass}>{state.errors.confirmarSenha[0]}</p>
          )}
        </div>

        {/* Botão submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 rounded-full bg-[#00AEEF] text-white font-semibold text-sm hover:bg-[#0099D4] active:bg-[#0085B8] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150 mt-2 cursor-pointer"
        >
          {isPending ? "Criando conta..." : "Criar Conta"}
        </button>
      </form>
    </div>
  );
}