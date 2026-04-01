// src/app/perfil/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PerfilClient } from "./PerfilClient";
import { Header } from "@/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meu Perfil — WiseKM",
};

export default async function PerfilPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const usuario = await prisma.usuario.findUnique({
    where: { id: session.user.id },
    select: { id: true, nome: true, email: true, cpf: true },
  });

  if (!usuario) redirect("/login");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-display font-bold text-text-high mb-8">
            Olá, {usuario.nome.split(" ")[0]}!
          </h1>
          <PerfilClient usuario={usuario} />
        </div>
      </main>
    </>
  );
}