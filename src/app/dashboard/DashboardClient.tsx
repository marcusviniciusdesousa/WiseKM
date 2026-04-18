// src/app/dashboard/DashboardClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { excluirVeiculo, atualizarQuilometragem } from "@/actions/veiculo.actions";

interface Veiculo {
  id: string;
  tipo: string;
  marca: string;
  modelo: string;
  ano: string;
  valorFipeAtual: number;
  quilometragem: number;
}

export function DashboardClient({ veiculo }: { veiculo: Veiculo }) {
  // Estados do Modal de Exclusão
  const [modalExcluir, setModalExcluir] = useState(false);
  const [isDeletando, setIsDeletando] = useState(false);

  // Estados do Modal de Edição
  const [modalEditar, setModalEditar] = useState(false);
  const [isSalvando, setIsSalvando] = useState(false);
  const [novaKm, setNovaKm] = useState(veiculo.quilometragem.toString());

  const router = useRouter();

  // ── Helpers de Formatação ───────────────────────────────────────────────
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
  };

  const formatarKM = (km: number) => {
    return new Intl.NumberFormat("pt-BR").format(km) + " km";
  };

  // ── Handlers de Ação ────────────────────────────────────────────────────
  async function handleExcluir() {
    setIsDeletando(true);
    try {
      const result = await excluirVeiculo();
      if (result.success) {
        setModalExcluir(false);
        router.refresh(); 
      } else {
        alert("Erro: " + result.message);
      }
    } catch (error) {
      alert("Falha de comunicação com o servidor.");
    } finally {
      setIsDeletando(false);
    }
  }

  async function handleEditar() {
    const kmNum = parseInt(novaKm, 10);
    
    if (isNaN(kmNum) || kmNum < 0) {
      alert("Por favor, digite uma quilometragem válida.");
      return;
    }

    setIsSalvando(true);
    try {
      const result = await atualizarQuilometragem(kmNum);
      if (result.success) {
        setModalEditar(false);
        router.refresh(); // O Next.js busca o dado novo no banco e atualiza a tela na hora
      } else {
        alert("Erro: " + result.message);
      }
    } catch (error) {
      alert("Falha de comunicação com o servidor.");
    } finally {
      setIsSalvando(false);
    }
  }

  function abrirModalEditar() {
    setNovaKm(veiculo.quilometragem.toString()); // Reseta para o valor atual
    setModalEditar(true);
  }

  // ── Renderização ────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* ── CARD PRINCIPAL DO VEÍCULO ─────────────────────────────── */}
      <section className="bg-surface rounded-xl border border-border shadow-sm p-8 relative overflow-hidden">
        {/* Detalhe de fundo */}
        <div className="absolute -top-12 -right-12 text-border/20 pointer-events-none">
          {veiculo.tipo === "CARRO" && (
             <svg viewBox="0 0 24 24" className="w-64 h-64" fill="currentColor">
               <path d="M5 17H3a1 1 0 0 1-1-1v-5l2.5-6h15L22 11v5a1 1 0 0 1-1 1h-2M5 11h14" />
             </svg>
          )}
          {veiculo.tipo === "MOTO" && (
            <svg viewBox="0 0 24 24" className="w-64 h-64" fill="currentColor">
               <path d="M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM15 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
            </svg>
          )}
          {veiculo.tipo === "CAMINHAO" && (
            <svg viewBox="0 0 24 24" className="w-64 h-64" fill="currentColor">
              <path d="M3 17h2m14 0h2m-5-9V4a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v4M3 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm-6 0h6M5 11h14" />
            </svg>
          )}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-background border border-border rounded-full text-caption font-semibold text-text-low">
              {veiculo.tipo === "CARRO" ? "🚗" : veiculo.tipo === "MOTO" ? "🏍️" : "🚚"} 
              {veiculo.tipo}
            </span>
            <span className="text-caption text-text-low">{veiculo.ano}</span>
          </div>

          <h2 className="text-display font-bold text-text-high leading-tight mb-8">
            {veiculo.marca} <br />
            <span className="text-primary">{veiculo.modelo}</span>
          </h2>

          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border">
            <div>
              <p className="text-caption text-text-low mb-1">Valor Estimado (FIPE)</p>
              <p className="text-heading-2 font-bold text-text-high">{formatarMoeda(veiculo.valorFipeAtual)}</p>
            </div>
            <div>
              <p className="text-caption text-text-low mb-1">Hodômetro Atual</p>
              <p className="text-heading-2 font-bold text-text-high">{formatarKM(veiculo.quilometragem)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PAINEL DE AÇÕES (BOTOES) ─────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Ação Primária 1: Cadastrar Custos */}
        <Link href="/custos/novo" className="flex flex-col p-6 bg-surface rounded-xl border border-border hover:border-primary/50 shadow-sm hover:shadow-md transition-all group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
             <span className="text-xl leading-none">+</span>
          </div>
          <h3 className="text-base font-semibold text-text-high mb-1">Cadastrar Custos</h3>
          <p className="text-caption text-text-low">Registre peças, IPVA e seguro.</p>
        </Link>

        {/* Ação Primária 2: Ver Relatório */}
        <Link href="/relatorio" className="flex flex-col p-6 bg-surface rounded-xl border border-border hover:border-primary/50 shadow-sm hover:shadow-md transition-all group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18M19 9l-5 5-4-4-3 3" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-text-high mb-1">Ver Relatório</h3>
          <p className="text-caption text-text-low">Estatísticas e Custo por KM.</p>
        </Link>

        {/* Ações Secundárias */}
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
          <Link href="/custos" className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border hover:bg-background transition-colors cursor-pointer">
            <span className="text-caption font-semibold text-text-high">📋 Ver Custos Lançados</span>
            <span className="text-text-low">→</span>
          </Link>
          
          <button onClick={abrirModalEditar} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border hover:bg-background transition-colors cursor-pointer text-left w-full">
            <span className="text-caption font-semibold text-text-high">✏️ Editar Hodômetro</span>
            <span className="text-text-low">→</span>
          </button>

          <button onClick={() => setModalExcluir(true)} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-danger/20 hover:bg-danger/5 transition-colors cursor-pointer text-left w-full">
            <span className="text-caption font-semibold text-danger">🗑️ Excluir Veículo</span>
          </button>
        </div>
      </section>

      {/* ── MODAL DE EDIÇÃO DO HODÔMETRO ─────────────────────────────── */}
      {modalEditar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface rounded-xl shadow-2xl w-full max-w-md p-8 border border-border animate-slide-down">
            <h3 className="text-heading-1 font-bold text-text-high mb-2">Atualizar Hodômetro</h3>
            <p className="text-caption text-text-low mb-6">
              Corrija a quilometragem base do seu veículo.
            </p>
            
            <div className="relative mb-8">
              <input
                type="number"
                inputMode="numeric"
                min="0"
                value={novaKm}
                onChange={(e) => setNovaKm(e.target.value)}
                className="w-full px-4 py-3 rounded-sm border border-border bg-surface text-base text-text-high focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-caption text-text-low font-medium">
                km
              </span>
            </div>

            <div className="flex gap-3 justify-end">
              <button onClick={() => setModalEditar(false)} className="px-5 py-2.5 rounded-full text-caption font-semibold text-text-low hover:bg-background cursor-pointer">
                Cancelar
              </button>
              <button onClick={handleEditar} disabled={isSalvando} className="px-5 py-2.5 rounded-full text-caption font-semibold bg-primary text-white hover:bg-primary-hover shadow-sm disabled:opacity-50 cursor-pointer">
                {isSalvando ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DE EXCLUSÃO ────────────────────────────────────────── */}
      {modalExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface rounded-xl shadow-2xl w-full max-w-md p-8 border border-border animate-slide-down">
            <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-heading-1 font-bold text-text-high mb-2">Excluir Veículo?</h3>
            <p className="text-base text-text-low mb-6">
              Todos os custos, configurações e estatísticas vinculadas a este veículo serão apagados para sempre.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setModalExcluir(false)} className="px-5 py-2.5 rounded-full text-caption font-semibold text-text-low hover:bg-background cursor-pointer">
                Cancelar
              </button>
              <button onClick={handleExcluir} disabled={isDeletando} className="px-5 py-2.5 rounded-full text-caption font-semibold bg-danger text-white hover:bg-danger-hover shadow-sm disabled:opacity-50 cursor-pointer">
                {isDeletando ? "Excluindo..." : "Sim, Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}