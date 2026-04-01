// src/app/(auth)/login/page.tsx
// Página de Login — Server Component (compõe os Client Components)

import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar — WiseKM",
  description: "Acesse sua conta WiseKM e gerencie os custos do seu veículo.",
};

export default function LoginPage() {
  return (
    <AuthCard>
      <AuthTabs />
      {/* Suspense necessário pois LoginForm usa useSearchParams() */}
      <Suspense fallback={<div className="p-8 text-center text-sm text-gray-400">Carregando...</div>}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
