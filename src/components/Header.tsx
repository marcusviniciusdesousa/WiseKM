// src/components/Header.tsx
//
// ── Decisões de UI/UX ────────────────────────────────────────────────────────
//
// 1. ARQUITETURA: Server Component puro — lê a sessão com `auth()` do NextAuth
//    diretamente no servidor. Zero bundle JS para o header em si.
//    O "Sair" usa um pequeno Client Component isolado para chamar `signOut()`.
//
// 2. GLASSMORPHISM NO SCROLL: O wrapper usa `sticky top-0` + `backdrop-blur-md`
//    + fundo semi-transparente. No topo da página parece limpo; ao rolar, o blur
//    cria profundidade sobre o conteúdo — padrão SaaS (Linear, Vercel, Raycast).
//
// 3. AVATAR COM INICIAIS: Quando não há foto, geramos as iniciais do nome em um
//    círculo com gradiente usando as cores primárias do design system.
//    É mais premium que um ícone genérico e personaliza a experiência.
//
// 4. SOMBRA SUTIL: `shadow-header` (token customizado) — linha fina na base +
//    sombra difusa. Separa o header do conteúdo sem "peso visual" excessivo.
//
// 5. TRANSIÇÕES: Todos os links/botões têm `transition-colors duration-150`
//    para feedback imediato sem ser distrativo.
//
// 6. BOTÃO "SAIR": Isolado em `<SignOutButton>` (Client Component) para não
//    "contaminar" o Server Component com `"use client"`.

import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";

// ── Helper: extrai as duas primeiras letras do nome ────────────────────────
function getInitials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}

export async function Header() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <header
      className="
        sticky top-0 z-50
        bg-surface/80 backdrop-blur-md
        border-b border-border/60
        shadow-header
        transition-shadow duration-300
      "
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

        {/* ── Logo ─────────────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="
            w-8 h-8 rounded-full
            bg-gradient-to-br from-primary to-primary-hover
            flex items-center justify-center
            shadow-sm group-hover:scale-105 transition-transform duration-200
          ">
            {/* Ícone de roda — inline SVG */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-none stroke-current stroke-[1.5]">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="2"  x2="12" y2="5"  />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="2"  y1="12" x2="5"  y2="12" />
              <line x1="19" y1="12" x2="22" y2="12" />
              <line x1="4.9"  y1="4.9"  x2="7.1"  y2="7.1"  />
              <line x1="16.9" y1="16.9" x2="19.1" y2="19.1" />
              <line x1="19.1" y1="4.9"  x2="16.9" y2="7.1"  />
              <line x1="4.9"  y1="19.1" x2="7.1"  y2="16.9" />
            </svg>
          </div>
          <span className="text-heading-2 font-bold text-text-high tracking-tight">
            WiseKM
          </span>
        </Link>

        {/* ── Navegação central ────────────────────────────────────── */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/">Início</NavLink>
          <NavLink href="/">Sobre Nós</NavLink>
          {isLoggedIn && <NavLink href="/dashboard">Dashboard</NavLink>}
        </nav>

        {/* ── Ações à direita ──────────────────────────────────────── */}
        <div className="flex items-center gap-2.5">
          {isLoggedIn ? (
            <>
              {/* Botão Sair — Client Component isolado */}
              <SignOutButton />

              {/* Avatar com iniciais */}
              <Link
                href="/perfil"
                title={`Perfil de ${session.user?.name}`}
                className="
                  w-9 h-9 rounded-full shrink-0
                  bg-gradient-to-br from-primary to-primary-hover
                  flex items-center justify-center
                  text-white text-caption font-semibold
                  shadow-sm ring-2 ring-surface ring-offset-1
                  hover:ring-primary/30 hover:scale-105
                  transition-all duration-200
                "
              >
                {getInitials(session.user?.name)}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="
                  hidden sm:inline-flex
                  px-4 py-2 rounded-full text-caption font-medium
                  text-text-low hover:text-text-high
                  hover:bg-border/40
                  transition-colors duration-150
                "
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="
                  px-4 py-2 rounded-full text-caption font-semibold
                  bg-primary text-white
                  hover:bg-primary-hover
                  shadow-sm hover:shadow-md
                  transition-all duration-150
                "
              >
                Cadastrar
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}

// ── Sub-componente: link de navegação com hover state ──────────────────────
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (

    
    <Link
      href={href}
      className="
        px-3 py-2 rounded-md text-caption font-medium
        text-text-low hover:text-text-high 
        hover:bg-border/40 
        transition-all duration-200 hover:-translate-y-0.5
      "
    >
      {children}
    </Link>
  );
}
