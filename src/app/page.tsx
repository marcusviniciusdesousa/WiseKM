// src/app/page.tsx
// Landing Page pública do WiseKM
// Usa estritamente os tokens do tailwind.config.ts (bg-background, text-text-high, etc.)
// Responsivo: Mobile-first — cards empilham em coluna no mobile, grid em desktop

import Link from "next/link";
import { Header } from "@/components/Header";

// ── Ícones inline (sem dependência de lib de ícones) ───────────────────────

function IconCar() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 17H3a1 1 0 0 1-1-1v-5l2.5-6h15L22 11v5a1 1 0 0 1-1 1h-2" />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="16.5" cy="17.5" r="2.5" />
      <path d="M5 11h14" />
    </svg>
  );
}

function IconWallet() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M16 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z" />
      <path d="M2 10h20" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 3v18h18" />
      <path d="M7 16l4-4 4 4 4-8" />
    </svg>
  );
}

// ── Dados das features ────────────────────────────────────────────────────

const features = [
  {
    icon: <IconCar />,
    step: "1",
    title: "Cadastre seu veículo",
    description:
      "Insira os dados básicos do seu carro ou moto, incluindo a quilometragem atual do veículo.",
  },
  {
    icon: <IconWallet />,
    step: "2",
    title: "Mapeie os custos",
    description:
      "Registre despesas fixas, variáveis e impostos. Defina a durabilidade das peças para calcular a depreciação real.",
  },
  {
    icon: <IconChart />,
    step: "3",
    title: "Simule e analise",
    description:
      "Receba relatórios visuais instantâneos. Insira sua estimativa de rodagem mensal e veja o custo por km calculado.",
  },
];

// ── Componente principal ──────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">

        {/* ── HERO SECTION ──────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Copy */}
            <div className="animate-fade-in">
              <h1 className="text-display text-text-high mb-6 leading-[1.1]">
                Assuma o controle.{" "}
                <span className="text-primary">Descubra o custo real</span> de cada
                quilômetro rodado.
              </h1>
              <p className="text-base text-text-low mb-8 max-w-md">
                Muito além do combustível. O WiseKM consolida impostos, manutenções e
                seguros em um único painel inteligente. Pare de "achar" que sabe quanto
                seu veículo custa e comece a calcular.
              </p>
              <Link
                href="/cadastro"
                className="
                  inline-flex items-center gap-2
                  px-6 py-3.5 rounded-full
                  bg-primary text-white text-base font-semibold
                  hover:bg-primary-hover shadow-md hover:shadow-lg
                  transition-all duration-200
                "
              >
                Começar agora
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3.5 8h9m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </Link>
            </div>

            {/* Ilustração — placeholder SVG do carro */}
            <div className="flex justify-center md:justify-end">
              <div className="
                relative w-full max-w-sm md:max-w-full
                bg-gradient-to-br from-primary/5 to-primary/10
                rounded-md p-8
                flex items-center justify-center
              ">
                {/* SVG estilizado do carro */}
                <svg
                  viewBox="0 0 420 260"
                  className="w-full h-auto drop-shadow-lg"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Corpo do carro */}
                  <rect x="40" y="140" width="340" height="80" rx="12" fill="#F97316" />
                  {/* Teto */}
                  <path d="M110 140 L150 80 L280 80 L340 140 Z" fill="#EA580C" />
                  {/* Janelas */}
                  <rect x="160" y="90" width="60" height="45" rx="6" fill="#BAE6FD" opacity="0.9" />
                  <rect x="235" y="90" width="60" height="45" rx="6" fill="#BAE6FD" opacity="0.9" />
                  {/* Rodas */}
                  <circle cx="120" cy="220" r="30" fill="#1E293B" />
                  <circle cx="120" cy="220" r="16" fill="#94A3B8" />
                  <circle cx="300" cy="220" r="30" fill="#1E293B" />
                  <circle cx="300" cy="220" r="16" fill="#94A3B8" />
                  {/* Farol */}
                  <ellipse cx="370" cy="165" rx="14" ry="10" fill="#FEF08A" opacity="0.9" />
                  {/* Detalhes */}
                  <rect x="40" y="175" width="340" height="3" rx="1" fill="#C2410C" opacity="0.4" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES SECTION ──────────────────────────────────────── */}
        <section className="bg-surface border-y border-border">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
            <h2 className="text-heading-1 text-text-high text-center mb-3">
              Gestão financeira veicular em três etapas
            </h2>
            <p className="text-base text-text-low text-center mb-12 max-w-lg mx-auto">
              Uma metodologia simples para revelar todos os custos invisíveis do seu veículo.
            </p>

            {/* Grid responsivo: 1 coluna → 3 colunas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="
                    group relative
                    bg-surface rounded-xl p-8
                    border border-border hover:border-primary/50
                    shadow-sm hover:shadow-2xl
                    transition-all duration-300 ease-out
                    hover:-translate-y-2 hover:scale-[1.02] cursor-pointer
                  "
                >
                  {/* Número do passo — decorativo */}
                  <span className="
                    absolute top-4 right-4
                    text-[2.5rem] font-black text-border/60
                    leading-none select-none
                    group-hover:text-primary/10 transition-colors duration-200
                  ">
                    {feature.step}
                  </span>

                  {/* Ícone */}
                  <div className="
                    w-12 h-12 rounded-sm mb-4
                    bg-primary/10 text-primary
                    flex items-center justify-center
                    group-hover:bg-primary group-hover:text-white
                    transition-all duration-200
                  ">
                    {feature.icon}
                  </div>

                  <h3 className="text-heading-2 text-text-high mb-2">
                    {feature.step}. {feature.title}
                  </h3>
                  <p className="text-caption text-text-low leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SOBRE SECTION ─────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-heading-1 text-text-high mb-4">
              O objetivo por trás do WiseKM
            </h2>
            <p className="text-base text-text-low mb-8 leading-relaxed">
              Nascido da necessidade real de rastreabilidade financeira, o WiseKM não é apenas
              um software, é uma ferramenta de mudança de comportamento. Nosso objetivo é
              transformar dados automotivos soltos em inteligência financeira acionável,
              eliminando os custos invisíveis que corroem o orçamento de motoristas e frotistas.
            </p>

            {/* Badge acadêmico */}
            <div className="
              inline-flex items-center gap-3
              bg-surface border border-border rounded-md
              px-5 py-3 shadow-sm
            ">
              <span className="text-xl">🎓</span>
              <span className="text-caption text-text-low">
                Desenvolvido em Análise e Desenvolvimento de Sistemas (ADS)
              </span>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <svg viewBox="0 0 12 12" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="6" cy="6" r="4.5" />
                <circle cx="6" cy="6" r="1.5" />
              </svg>
            </div>
            <span className="text-caption font-semibold text-text-high">WiseKM</span>
          </div>
          <p className="text-caption text-text-low text-center">
            © 2026 — Projeto Acadêmico Fatec Franca
          </p>
          <div className="flex gap-4">
            <Link href="/" className="text-caption text-text-low hover:text-text-high transition-colors">
              Sobre
            </Link>
            <Link href="/login" className="text-caption text-text-low hover:text-text-high transition-colors">
              Entrar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
