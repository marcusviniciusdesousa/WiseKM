import { auth } from "@/lib/auth"; // <-- 1. Importe a função auth
import { redirect } from "next/navigation"; // <-- 2. Importe o redirect
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar — WiseKM",
  description: "Acesse sua conta WiseKM.",
};

export default async function LoginPage() {
  // 3. Verificação em tempo real: se tiver sessão, bloqueia a renderização e chuta pro dashboard
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <AuthCard>
      <AuthTabs />
      <LoginForm />
    </AuthCard>
  );
}