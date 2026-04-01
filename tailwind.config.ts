// tailwind.config.ts
// Design Tokens do WiseKM — mapeados diretamente dos tokens Figma
// Convenção: nomes seguem o Figma (primary, background, surface, border, text-high, etc.)

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── CORES ──────────────────────────────────────────────────────────
      // Fonte: imagem "Cores" do Figma
      colors: {
        primary: {
          DEFAULT: "#0EA5E9",   // Primary-100
          10: "rgba(14,165,233,0.10)", // Primary-10 (10% opacity)
          hover: "#0284C7",     // Primary Hover
        },
        background: "#F8FAFC",  // Background — fundo geral da página
        surface: "#FFFFFF",     // Superficie — cards, modais, inputs
        border: "#E2E8F0",      // Border — linhas, divisores
        "text-high": "#0F172A", // Text High — títulos e texto principal
        "text-low": "#64748B",  // Text Low — subtítulos e labels secundários
        danger: {
          DEFAULT: "#EF4444",   // Perigo
          hover: "#C72424",     // Perigo Hover
        },
        success: {
          DEFAULT: "#22C55E",   // Sucesso
          hover: "#26A254",     // Sucesso Hover
        },
        warning: "#F59E0B",     // Aviso
      },

      // ── TIPOGRAFIA ─────────────────────────────────────────────────────
      // Fonte: imagem "Estilos de texto" do Figma
      // Display · 48/110  → text-5xl, leading-[110%], font-bold
      // Heading 1 · 24/120 → text-2xl, leading-[120%], font-semibold
      // Heading 2 · 18/130 → text-lg, leading-[130%], font-semibold
      // Base · 16/150     → text-base, leading-[150%], font-normal
      // Caption · 14/140  → text-sm, leading-[140%], font-normal
      fontSize: {
        display: ["3rem", { lineHeight: "110%", fontWeight: "700" }],      // 48px
        "heading-1": ["1.5rem", { lineHeight: "120%", fontWeight: "600" }], // 24px
        "heading-2": ["1.125rem", { lineHeight: "130%", fontWeight: "600" }], // 18px
        base: ["1rem", { lineHeight: "150%", fontWeight: "400" }],          // 16px
        caption: ["0.875rem", { lineHeight: "140%", fontWeight: "400" }],   // 14px
      },

      // ── ESPAÇAMENTOS (baseados nos tokens de spacing do Figma) ─────────
      // Micro-4=4, Micro-8=8, Pequeno-16=16, Pequeno-24=24
      // Médio-32=32, Médio-48=48, Macro-64=64
      // Os valores já existem no Tailwind padrão (p-4=16px, p-8=32px…),
      // portanto não sobrescrevemos — apenas documentamos a correspondência:
      // p-1 → 4px (Micro-4)    p-2 → 8px (Micro-8)
      // p-4 → 16px (Pequeno-16) p-6 → 24px (Pequeno-24)
      // p-8 → 32px (Médio-32)  p-12 → 48px (Médio-48)
      // p-16 → 64px (Macro-64)

      // ── ARREDONDAMENTOS ────────────────────────────────────────────────
      // Arrendodamento-8 = 8px, Arrendodamento-16 = 16px, Border-Max = 999px
      borderRadius: {
        sm: "8px",    // Arrendodamento-8
        md: "16px",   // Arrendodamento-16
        full: "999px", // Border-Max (pills, avatares)
      },

      // ── SOMBRAS ────────────────────────────────────────────────────────
      // Sombra 2-4     → sombra pequena, y=2 blur=4
      // Sombra 4-16-5% → sombra maior, y=4 blur=16 opacity=5%
      boxShadow: {
        sm: "0 2px 4px rgba(15,23,42,0.08)",          // Sombra 2-4
        md: "0 4px 16px rgba(15,23,42,0.05)",          // Sombra 4-16-5%
        // Extras para o Header glassmorphism
        header: "0 1px 0 rgba(226,232,240,0.8), 0 4px 16px rgba(15,23,42,0.04)",
      },

      // ── ANIMAÇÕES ──────────────────────────────────────────────────────
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(-6px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-down": "slide-down 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
