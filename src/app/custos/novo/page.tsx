// src/app/custos/novo/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { CustosHub } from "./CustosHub";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export default async function NovoCustoPage() {
  noStore();
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Busca o veículo do usuário
  const veiculo = await prisma.veiculo.findUnique({
    where: { usuarioId: session.user.id },
  });

  if (!veiculo) {
    redirect("/dashboard"); // Proteção: Não pode cadastrar custo sem veículo
  }

  // Busca os custos que já existem para este veículo (apenas o nome para fazer o filtro)
  const custosExistentes = await prisma.custo.findMany({
    where: { veiculoId: veiculo.id },
    select: { nome: true },
  });

  const nomesCadastrados = custosExistentes.map((c) => c.nome);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <p className="text-caption text-text-low mb-2 flex items-center gap-1.5">
              <Link href="/dashboard" className="hover:text-primary transition-colors cursor-pointer">Dashboard</Link> › Inicialização de Custos
            </p>
            <h1 className="text-heading-1 font-bold text-text-high">Mapeamento Inicial</h1>
            <p className="text-base text-text-low mt-1.5">
              Preencha os valores atuais e a durabilidade das peças. Pule o que não souber ou não fazer parte do veículo. Itens em branco serão ignorados.
            </p>
          </div>
          
          {/* Injeta os dados no Client Component */}
          <CustosHub veiculo={veiculo} nomesCadastrados={nomesCadastrados} />
        </div>
      </main>
    </>
  );
}