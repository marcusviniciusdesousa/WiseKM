// src/app/esqueci-senha/page.tsx
// Rota Pública — Recuperação de Senha (Mock)
// Utiliza o layout consistente do AuthCard sem expor funcionalidades de e-mail ativas.

"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    // Simulando delay de rede para manter a experiência realista
    setTimeout(() => {
      setIsSubmitting(false);
      setSucesso(true);
      setEmail("");
    }, 1500);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/30 focus:border-[#00AEEF] transition-colors";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <AuthCard>
      <div className="px-8 py-10 animate-fade-in">
        
        {/* Título e Navegação */}
        <div className="mb-8">
          <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-[#00AEEF] transition-colors flex items-center gap-1.5 mb-6 w-fit cursor-pointer">
            ← Voltar para o login
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Esqueceu a senha?
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Digite o e-mail associado à sua conta. Enviaremos um link de recuperação.
          </p>
        </div>

        {/* Mock de Sucesso */}
        {sucesso ? (
          <div className="animate-slide-down bg-green-50 border border-green-200 rounded-xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto text-green-600">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800 mb-1">E-mail enviado!</p>
              <p className="text-xs text-green-700">
                Se este e-mail estiver cadastrado em nossa base, você receberá um link de recuperação em instantes.
              </p>
            </div>
          </div>
        ) : (
          /* Formulário de Simulação */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className={labelClass}>
                E-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full bg-[#00AEEF] text-white font-semibold text-sm hover:bg-[#0099D4] active:bg-[#0085B8] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer flex items-center justify-center"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Enviando...
                </span>
              ) : (
                "Enviar Link"
              )}
            </button>
          </form>
        )}
        
      </div>
    </AuthCard>
  );
}