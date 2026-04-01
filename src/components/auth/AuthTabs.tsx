// src/components/auth/AuthTabs.tsx
// Tabs "Entrar / Cadastrar" — navegação entre as duas telas de auth

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AuthTabs() {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  const tabBase =
    "flex-1 text-center py-4 text-sm font-medium transition-colors duration-150 cursor-pointer select-none";
  const activeTab = "text-[#00AEEF] border-b-2 border-[#00AEEF]";
  const inactiveTab = "text-gray-500 border-b-2 border-transparent hover:text-gray-700";

  return (
    <div className="flex border-b border-gray-100">
      <Link href="/login" className={`${tabBase} ${isLogin ? activeTab : inactiveTab}`}>
        Entrar
      </Link>
      <Link href="/cadastro" className={`${tabBase} ${!isLogin ? activeTab : inactiveTab}`}>
        Cadastrar
      </Link>
    </div>
  );
}
