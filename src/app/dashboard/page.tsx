// src/app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DashboardClient } from "./DashboardClient";
import { Header } from "@/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — WiseKM",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Busca o veículo e os dados do usuário em uma única query
  const veiculo = await prisma.veiculo.findUnique({
    where: { usuarioId: session.user.id },
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-10 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Saudação */}
          <h1 className="text-display font-bold text-text-high mb-8">
            Visão Geral
          </h1>

          {!veiculo ? (
            /* ── ESTADO VAZIO (EMPTY STATE) ─────────────────────────── */
            <div className="bg-surface rounded-xl border border-border border-dashed shadow-sm p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 17H3a1 1 0 0 1-1-1v-5l2.5-6h15L22 11v5a1 1 0 0 1-1 1h-2" />
                  <circle cx="7.5" cy="17.5" r="2.5" />
                  <circle cx="16.5" cy="17.5" r="2.5" />
                  <path d="M5 11h14" />
                </svg>
              </div>
              <h2 className="text-heading-1 font-bold text-text-high mb-3">
                Nenhum veículo encontrado
              </h2>
              <p className="text-base text-text-low mb-8 max-w-md">
                Para o WiseKM começar a calcular seus custos e gerar relatórios, você precisa cadastrar o seu veículo primeiro.
              </p>
              <Link
                href="/veiculo/novo"
                className="px-8 py-4 rounded-full text-base font-semibold bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                Cadastrar meu veículo
              </Link>
            </div>
          ) : (
            /* ── ESTADO PREENCHIDO ──────────────────────────────────── */
            <DashboardClient veiculo={veiculo} />
          )}
        </div>
      </main>
    </>
  );
}