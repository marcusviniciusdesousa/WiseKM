// src/middleware.ts
// Middleware de proteção de rotas — roda no Edge Runtime (sem acesso ao banco)

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;

  const isAuthRoute = nextUrl.pathname.startsWith("/login") ||
                      nextUrl.pathname.startsWith("/cadastro");
  const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard") ||
                            nextUrl.pathname.startsWith("/veiculo") ||
                            nextUrl.pathname.startsWith("/despesas");

  // Redireciona usuário logado que tenta acessar páginas de auth
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Redireciona usuário não logado de rotas protegidas
  if (!isLoggedIn && isProtectedRoute) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

// Matcher: evita rodar o middleware em assets estáticos e API do NextAuth
export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
