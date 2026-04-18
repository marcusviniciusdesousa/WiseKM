// src/app/veiculo/novo/page.tsx
// Página de Cadastro de Veículo — rota protegida: /veiculo/novo
// Regra: se o usuário já tem veículo, redireciona para /dashboard

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { VeiculoForm } from "./VeiculoForm";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cadastrar Veículo — WiseKM",
  description: "Adicione seu veículo e comece a calcular o custo por quilômetro.",
};

export default async function VeiculoNovoPage() {
  // 1. Verificar autenticação
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // 2. Verificar se usuário já possui veículo — evita duplicata na UI
  const veiculoExistente = await prisma.veiculo.findUnique({
    where: { usuarioId: session.user.id },
    select: { id: true, modelo: true, marca: true },
  });

  if (veiculoExistente) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-xl mx-auto">

        {/* ── Cabeçalho da página ──────────────────────────── */}
        <div className="mb-8">
          {/* Breadcrumb visual */}
          <p className="text-caption text-text-low mb-2 flex items-center gap-1.5">
            <Link href="/dashboard" className="hover:text-primary transition-colors cursor-pointer">Dashboard</Link>
            <span>›</span>
            <span className="text-primary font-medium">Novo veículo</span>
          </p>

          <h1 className="text-heading-1 font-bold text-text-high">
            Cadastrar Veículo
          </h1>
          <p className="text-base text-text-low mt-1.5">
            Use a Tabela FIPE para garantir dados precisos. Você pode ter{" "}
            <strong className="text-text-high font-medium">apenas um veículo</strong>{" "}
            cadastrado por conta.
          </p>
        </div>

        {/* ── Card do formulário ───────────────────────────── */}
        <div className="bg-surface rounded-md border border-border shadow-sm p-8">

          {/* Indicador de etapas — visual/decorativo */}
          <div className="flex items-center gap-2 mb-8 pb-6 border-b border-border">
            {["Tipo", "Marca", "Modelo", "Ano", "Hodômetro"].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="
                  w-6 h-6 rounded-full
                  bg-primary/10 text-primary text-caption font-semibold
                  flex items-center justify-center shrink-0
                ">
                  {i + 1}
                </div>
                <span className="text-caption text-text-low hidden sm:inline">{step}</span>
                {i < 4 && (
                  <svg viewBox="0 0 16 16" className="w-3 h-3 text-border shrink-0" fill="currentColor">
                    <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                )}
              </div>
            ))}
          </div>

          {/* Client Component com toda a lógica FIPE + estados */}
          <VeiculoForm />
        </div>

        {/* Nota informativa */}
        <p className="text-caption text-text-low text-center mt-4">
          Os valores da Tabela FIPE são consultados em tempo real e servem como base
          para os cálculos de depreciação do sistema.
        </p>
      </div>
    </main>
  );
}
