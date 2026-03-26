// src/app/(auth)/cadastro/page.tsx
// Página de Cadastro — Server Component

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { CadastroForm } from "@/components/auth/CadastroForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar conta — WiseKM",
  description: "Crie sua conta WiseKM e descubra o custo real de cada quilômetro rodado.",
};

export default function CadastroPage() {
  return (
    <AuthCard>
      <AuthTabs />
      <CadastroForm />
    </AuthCard>
  );
}
