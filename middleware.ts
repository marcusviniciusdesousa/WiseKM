// src/middleware.ts
// Guarda de trânsito do WiseKM — NextAuth v5 (Auth.js)
//
// Lógica de acesso:
//   ROTAS PÚBLICAS  → qualquer um acessa: /, /login, /cadastro, /sobre
//   ROTAS PRIVADAS  → requer sessão: tudo que não for público
//   USUÁRIO LOGADO  → redirecionado de /login e /cadastro para /dashboard
//
// O middleware roda no Edge Runtime — sem acesso ao banco de dados.
// A verificação de sessão é feita apenas via JWT (cookie HTTP-only).

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Rotas que qualquer usuário pode acessar sem autenticação
const PUBLIC_ROUTES = ["/", "/login", "/cadastro", "/sobre"];

// Rotas de autenticação — usuários logados não devem acessar
const AUTH_ROUTES = ["/login", "/cadastro"];

export default auth((req) => {
  const { nextUrl } = req;
  // No NextAuth v5, `req.auth` é injetado pelo wrapper `auth()`
  const isLoggedIn = !!req.auth?.user;
  const pathname = nextUrl.pathname;

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // ── Usuário logado tentando acessar login/cadastro → redireciona
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // ── Usuário deslogado tentando acessar rota privada → manda para /login
  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", nextUrl);
    // Preserva a URL de destino para redirecionar após login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

// ── Matcher ────────────────────────────────────────────────────────────────
// Exclui: API do NextAuth, assets estáticos, imagens otimizadas, favicon
// Inclui: todas as páginas da aplicação
export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)",
  ],
};
