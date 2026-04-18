// src/app/relatorio/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { RelatorioClient } from "./RelatorioClient";
import Link from "next/link";

export default async function RelatorioPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const veiculo = await prisma.veiculo.findUnique({
    where: { usuarioId: session.user.id },
  });

  if (!veiculo) redirect("/dashboard");

  const custos = await prisma.custo.findMany({
    where: { veiculoId: veiculo.id },
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <p className="text-caption text-text-low mb-2 flex items-center gap-1.5">
              <Link href="/dashboard" className="hover:text-primary transition-colors cursor-pointer">Dashboard</Link> › Relatório Preditivo
            </p>
            <h1 className="text-heading-1 font-bold text-text-high">Simulador Financeiro</h1>
            <p className="text-base text-text-low mt-1.5">
              Descubra o custo real do seu veículo por quilômetro rodado.
            </p>
          </div>
          
          {/* Se não houver custos, avisa. Se houver, carrega o motor matemático */}
          {custos.length === 0 ? (
            <div className="bg-surface rounded-xl border border-border p-12 text-center">
              <p className="text-base font-semibold text-text-high mb-4">Sem dados suficientes</p>
              <Link href="/custos/novo" className="px-6 py-3 rounded-full bg-primary text-white text-caption font-semibold hover:bg-primary-hover transition-colors">
                Mapear Custos Agora
              </Link>
            </div>
          ) : (
            <RelatorioClient custos={custos} />
          )}
        </div>
      </main>
    </>
  );
}