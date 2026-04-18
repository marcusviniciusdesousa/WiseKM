// src/app/custos/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { CustosClient } from "./CustosClient";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export default async function CustosPage() {
  noStore();
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const veiculo = await prisma.veiculo.findUnique({
    where: { usuarioId: session.user.id },
  });

  if (!veiculo) redirect("/dashboard");

  // Busca todos os custos cadastrados e ordena por categoria e nome
  const custos = await prisma.custo.findMany({
    where: { veiculoId: veiculo.id },
    orderBy: [
      { categoria: 'asc' },
      { nome: 'asc' }
    ]
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-caption text-text-low mb-2 flex items-center gap-1.5">
                <Link href="/dashboard" className="hover:text-primary transition-colors cursor-pointer">Dashboard</Link> › Gestão de Custos
              </p>
              <h1 className="text-heading-1 font-bold text-text-high">Custos Cadastrados</h1>
              <p className="text-base text-text-low mt-1.5">
                Gerencie as peças mapeadas, adicione itens personalizados ou edite valores.
              </p>
            </div>
            {/* O Botão de adicionar fica no Client Component, pois precisa abrir um Modal */}
          </div>
          
          <CustosClient custosIniciais={custos} />
        </div>
      </main>
    </>
  );
}