// src/app/cadastro/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { CadastroForm } from "@/components/auth/CadastroForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar conta — WiseKM",
  description: "Crie sua conta WiseKM e descubra o custo real de cada quilômetro rodado.",
};

export default async function CadastroPage() {
  // Verificação em tempo real
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <AuthCard>
      <AuthTabs />
      <CadastroForm />
    </AuthCard>
  );
}