// src/components/auth/AuthCard.tsx
// Wrapper visual do card de autenticação — compartilhado entre Login e Cadastro

import Image from "next/image";
import Link from "next/link";

interface AuthCardProps {
  children: React.ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4 px-6 flex items-center justify-center">
        <Link href="/" className="flex items-center gap-2">
          {/* Ícone de roda/engrenagem — inline SVG para evitar dependência de assets */}
          <svg
            className="w-8 h-8 text-gray-800"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
            <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="2" />
            <circle cx="16" cy="4"  r="2" fill="currentColor" />
            <circle cx="16" cy="28" r="2" fill="currentColor" />
            <circle cx="4"  cy="16" r="2" fill="currentColor" />
            <circle cx="28" cy="16" r="2" fill="currentColor" />
            <circle cx="7.5"  cy="7.5"  r="2" fill="currentColor" />
            <circle cx="24.5" cy="24.5" r="2" fill="currentColor" />
            <circle cx="24.5" cy="7.5"  r="2" fill="currentColor" />
            <circle cx="7.5"  cy="24.5" r="2" fill="currentColor" />
          </svg>
          <span className="text-xl font-bold text-gray-900 tracking-tight">WiseKM</span>
        </Link>
      </header>

      {/* Conteúdo central */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
