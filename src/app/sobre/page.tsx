    // src/app/sobre/page.tsx
// Rota Institucional Pública — Detalha a missão do projeto WiseKM
// Segue o design system estabelecido na Landing Page

import Link from "next/link";
import { Header } from "@/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre o WiseKM — Inteligência Financeira",
  description: "Conheça a história e o propósito do WiseKM.",
};

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
          
          {/* Cabeçalho da Página */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-display font-bold text-text-high leading-tight mb-4">
              Nossa <span className="text-primary">Missão</span>
            </h1>
            <p className="text-heading-2 text-text-low font-normal max-w-2xl mx-auto">
              Dar transparência aos custos ocultos da posse veicular e empoderar motoristas na tomada de decisões.
            </p>
          </div>

          {/* Conteúdo Principal */}
          <div className="space-y-12 animate-fade-in" style={{ animationDelay: "100ms" }}>
            
            <div className="bg-surface p-8 md:p-10 rounded-2xl border border-border shadow-sm">
              <h2 className="text-heading-1 font-bold text-text-high mb-4">O Problema</h2>
              <p className="text-base text-text-low leading-relaxed mb-4">
                A aquisição de um veículo é um marco para muitos brasileiros, mas o custo real de mantê-lo é frequentemente subestimado. Combustível é apenas a ponta do iceberg. Despesas esporádicas como IPVA, seguro, troca de pneus e depreciação formam uma cascata de "custos ocultos" que, se mal administrados, levam rapidamente ao endividamento.
              </p>
              <p className="text-base text-text-low leading-relaxed">
                Essa desorganização é criticamente perigosa para a classe de <strong className="text-text-high font-semibold">motoristas e entregadores de aplicativos</strong>. Para esses profissionais, o veículo é a ferramenta de trabalho. Não saber calcular com exatidão o custo por quilômetro rodado significa não saber se uma corrida gerou lucro ou prejuízo.
              </p>
            </div>

            <div className="bg-surface p-8 md:p-10 rounded-2xl border border-border shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-primary/5">
                <svg viewBox="0 0 24 24" className="w-48 h-48" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-heading-1 font-bold text-text-high mb-4">A Solução WiseKM</h2>
                <p className="text-base text-text-low leading-relaxed mb-6">
                  O WiseKM nasceu para transformar achismos em inteligência financeira acionável. Através de um motor paramétrico avançado, o sistema:
                </p>
                
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">✓</span>
                    <span className="text-base text-text-low"><strong className="text-text-high">Padroniza dados:</strong> Integração direta com a API da Tabela FIPE.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">✓</span>
                    <span className="text-base text-text-low"><strong className="text-text-high">Dilui gastos:</strong> Converte manutenções caras em custo exato por KM.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">✓</span>
                    <span className="text-base text-text-low"><strong className="text-text-high">Simula o futuro:</strong> Projeta quanto o usuário gastará no próximo mês com base na sua estimativa de rodagem.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center pt-8">
              <p className="text-caption font-semibold text-text-low uppercase tracking-wider mb-2">Projeto Acadêmico</p>
              <p className="text-base text-text-high mb-8">
                Desenvolvido como Trabalho de Graduação (TG) na Faculdade de Tecnologia de Franca (FATEC).
              </p>
              <Link 
                href="/cadastro" 
                className="inline-flex px-8 py-4 rounded-full bg-primary text-white font-bold hover:bg-primary-hover hover:scale-105 hover:shadow-lg transition-all cursor-pointer"
              >
                Crie sua conta gratuitamente
              </Link>
            </div>

          </div>
        </section>
      </main>

      {/* Reutilizando a estrutura de Footer da Landing Page */}
      <footer className="border-t border-border bg-surface mt-auto">
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
              Voltar ao Início
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}