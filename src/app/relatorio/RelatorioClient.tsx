// src/app/relatorio/RelatorioClient.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { CategoriaCusto } from "@prisma/client";

type Custo = {
  id: string;
  nome: string;
  categoria: CategoriaCusto;
  valorAtual: number;
  durabilidadeKm: number | null;
  durabilidadeMeses: number | null;
};

type DetalheCusto = Custo & { 
  custoPorKmItem: number; 
  custoFixoMensalItem: number; 
  desgasteMensalSimulado: number; 
};

type DadosCategoria = { 
  totalFixoMensal: number; 
  totalPorKm: number; 
  totalSimuladoMensal: number;
  itens: DetalheCusto[]; 
};

const CORES_CATEGORIA: Record<string, string> = {
  "MANUTENCAO": "#3B82F6",   // Azul
  "COMBUSTIVEL": "#F59E0B",   // Laranja
  "DOCUMENTACAO": "#10B981", // Verde
  "CUSTOS_FIXOS": "#8B5CF6",       // Roxo
  "OUTROS": "#6B7280"        // Cinza
};

export function RelatorioClient({ custos }: { custos: Custo[] }) {
  const [kmMensal, setKmMensal] = useState<number | "">(1000); // Alterado default para não vir vazio
  const [orcamentoMensal, setOrcamentoMensal] = useState<number | "">(""); // Novo Estado
  const [categoriaHover, setCategoriaHover] = useState<string | null>(null);
  const [mensagemGlobal, setMensagemGlobal] = useState<{ texto: string; tipo: "success" | "error" } | null>(null);

  // Fecha o toast automático
  useEffect(() => {
    if (mensagemGlobal) {
      const timer = setTimeout(() => setMensagemGlobal(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensagemGlobal]);

  const formatMoeda = (v: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  // ── MOTOR MATEMÁTICO ──────────────────────────────────────────────────
  const analise = useMemo(() => {
    let custoVariavelPorKm = 0;
    let custoFixoMensalTotal = 0;

    // 1. Calcula as taxas base primeiro
    custos.forEach(custo => {
      if (custo.durabilidadeKm) {
        custoVariavelPorKm += (custo.valorAtual / custo.durabilidadeKm);
      }
      if (custo.durabilidadeMeses && !custo.durabilidadeKm) {
        custoFixoMensalTotal += (custo.valorAtual / custo.durabilidadeMeses);
      }
    });

    // 2. Determina o KM Simulado (por input direto ou por orçamento)
    let kmFinal = 0;
    let alertaOrcamento = "";

    if (orcamentoMensal !== "" && typeof orcamentoMensal === "number") {
      if (orcamentoMensal < custoFixoMensalTotal) {
        kmFinal = 0;
        alertaOrcamento = "O orçamento não cobre os custos fixos mensais do veículo.";
      } else {
        const disponivelParaRodar = orcamentoMensal - custoFixoMensalTotal;
        kmFinal = disponivelParaRodar / (custoVariavelPorKm > 0 ? custoVariavelPorKm : 1);
      }
    } else {
      kmFinal = typeof kmMensal === "number" ? Math.max(0, Math.min(kmMensal, 20000)) : 0;
    }

    // 3. Calcula o detalhamento baseado no kmFinal decidido
    const detalhamento: DetalheCusto[] = custos.map(custo => {
      let custoPorKmItem = 0;
      let custoFixoMensalItem = 0;

      if (custo.durabilidadeKm) {
        custoPorKmItem = custo.valorAtual / custo.durabilidadeKm;
      }
      if (custo.durabilidadeMeses && !custo.durabilidadeKm) {
        custoFixoMensalItem = custo.valorAtual / custo.durabilidadeMeses;
      }

      return {
        ...custo,
        custoPorKmItem,
        custoFixoMensalItem,
        desgasteMensalSimulado: (custoPorKmItem * kmFinal) + custoFixoMensalItem
      };
    });

    const gastoVariavelMensal = custoVariavelPorKm * kmFinal;
    const custoTotalMensal = gastoVariavelMensal + custoFixoMensalTotal;
    const custoTotalAnual = custoTotalMensal * 12;

    const categoriasMap = new Map<string, DadosCategoria>();
    
    detalhamento.forEach(item => {
      if (!categoriasMap.has(item.categoria)) {
        categoriasMap.set(item.categoria, { totalFixoMensal: 0, totalPorKm: 0, totalSimuladoMensal: 0, itens: [] });
      }
      const cat = categoriasMap.get(item.categoria)!;
      cat.totalPorKm += item.custoPorKmItem;
      cat.totalFixoMensal += item.custoFixoMensalItem;
      cat.totalSimuladoMensal += item.desgasteMensalSimulado;
      cat.itens.push(item);
    });

    const categoriasFinal = Array.from(categoriasMap.entries()).map(([nome, dados]) => ({
      nome,
      ...dados,
      percentual: custoTotalMensal > 0 ? (dados.totalSimuladoMensal / custoTotalMensal) * 100 : 0
    }));

    return {
      custoVariavelPorKm,
      custoFixoMensalTotal,
      custoTotalMensal,
      custoTotalAnual,
      categorias: categoriasFinal,
      kmSimulado: kmFinal,
      alertaOrcamento
    };
  }, [custos, kmMensal, orcamentoMensal]);

  // ── FUNÇÃO DE EXPORTAÇÃO (WHATSAPP) ──────────────────────────────────
  const handleExportarWhatsapp = () => {
    let texto = `📊 *RESUMO WISEKM - RELATÓRIO*\n`;
    texto += `🛣️ Simulação: ${analise.kmSimulado.toFixed(0)} km/mês\n\n`;
    texto += `💰 *DADOS GERAIS*\n`;
    texto += `• Custo por KM: ${formatMoeda(analise.custoVariavelPorKm)}/km\n`;
    texto += `• Custos Fixos/Mês: ${formatMoeda(analise.custoFixoMensalTotal)}/mês\n`;
    texto += `• TOTAL MENSAL: ${formatMoeda(analise.custoTotalMensal)}\n`;
    texto += `• TOTAL ANUAL: ${formatMoeda(analise.custoTotalAnual)}\n\n`;
    texto += `🗂️ *MÉTRICAS POR CATEGORIA*\n`;
    
    analise.categorias.forEach(cat => {
      let taxas = [];
      if (cat.totalPorKm > 0) taxas.push(`${formatMoeda(cat.totalPorKm)}/km`);
      if (cat.totalFixoMensal > 0) taxas.push(`${formatMoeda(cat.totalFixoMensal)}/mês`);
      
      // Junta as taxas (ex: "R$ 0,15/km | R$ 50,00/mês")
      texto += `• ${cat.nome}: ${taxas.join(" | ")}\n`;
    });

    navigator.clipboard.writeText(texto);
    setMensagemGlobal({ texto: "Resumo copiado! Cole no seu WhatsApp.", tipo: "success" });
  };

  // Dados para exibir no centro do gráfico interativo
  const infoCentroGrafico = useMemo(() => {
    if (categoriaHover) {
      const cat = analise.categorias.find(c => c.nome === categoriaHover);
      if (cat) return {
        titulo: cat.nome,
        valor: formatMoeda(cat.totalSimuladoMensal),
        sub: `${cat.percentual.toFixed(1)}% do total`
      };
    }
    return {
      titulo: "TOTAL MENSAL",
      valor: formatMoeda(analise.custoTotalMensal),
      sub: "100% dos custos"
    };
  }, [categoriaHover, analise]);

  return (
    <div className="space-y-10 pb-20 relative">
      
      {/* ── NOTIFICAÇÃO TOAST ── */}
      {mensagemGlobal && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg border animate-fade-in transition-all ${
            mensagemGlobal.tipo === "success" ? "bg-[#E6F4EA] border-[#CEEAD6] text-[#137333]" : "bg-[#FCE8E6] border-[#FAD2CF] text-[#C5221F]"
          }`}>
          <p className="text-caption font-semibold">{mensagemGlobal.texto}</p>
        </div>
      )}

      {/* ── SEÇÃO DE SIMULAÇÃO (NOVO LAYOUT) ── */}
      <div className="bg-surface rounded-2xl border border-border p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Input por KM */}
          <div className="space-y-3">
            <label className="block text-caption font-bold text-text-high uppercase tracking-wider">
              Simular por KM Mensal
            </label>
            <div className="relative">
              <input
                type="number" 
                min="0"
                max="20000"
                placeholder="Ex: 1500"
                value={kmMensal}
                onChange={(e) => {
                  setOrcamentoMensal(""); // Limpa o orçamento se o usuário digitar aqui
                  const val = e.target.value;
                  if (val === "") setKmMensal("");
                  else if (Number(val) >= 0) setKmMensal(Number(val));
                }}
                className={`w-full px-4 py-3 rounded-lg border border-border bg-background text-lg font-bold text-text-high focus:ring-2 focus:ring-primary/40 outline-none transition-all pr-14 ${orcamentoMensal !== "" ? "opacity-50" : ""}`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-caption font-bold text-text-low">
                km/mês
              </span>
            </div>
            <p className="text-[11px] text-text-low mt-2">
              Deixe em 0 para ver apenas os custos fixos.
            </p>
          </div>

          {/* Input por Orçamento */}
          <div className="space-y-3">
            <label className="block text-caption font-bold text-text-high uppercase tracking-wider">
              Simular por Orçamento (R$)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-caption font-bold text-text-low">
                R$
              </span>
              <input
                type="number" 
                min="0"
                placeholder="Ex: 800"
                value={orcamentoMensal}
                onChange={(e) => {
                  setKmMensal(""); // Limpa o KM se o usuário digitar aqui
                  const val = e.target.value;
                  if (val === "") setOrcamentoMensal("");
                  else if (Number(val) >= 0) setOrcamentoMensal(Number(val));
                }}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-lg font-bold text-text-high focus:ring-2 focus:ring-primary/40 outline-none transition-all ${kmMensal !== "" ? "opacity-50" : ""}`}
              />
            </div>
            <p className="text-[11px] text-text-low mt-2">
              Descubra quanto você pode rodar.
            </p>
          </div>

        </div>

        {/* ALERTA DE ORÇAMENTO INSUFICIENTE */}
        {analise.alertaOrcamento && (
          <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg animate-fade-in">
            <p className="text-sm text-red-600 font-bold flex items-center gap-2">
              ⚠️ {analise.alertaOrcamento}
            </p>
          </div>
        )}
      </div>

      {/* ── CARDS DE DASHBOARD ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface p-6 rounded-xl border border-border">
          <p className="text-[10px] font-bold text-text-low uppercase mb-1">Custo Variável (Uso)</p>
          <h3 className="text-xl font-bold text-text-high">{formatMoeda(analise.custoVariavelPorKm)}<span className="text-sm font-medium text-text-low">/km</span></h3>
        </div>
        <div className="bg-surface p-6 rounded-xl border border-border">
          <p className="text-[10px] font-bold text-text-low uppercase mb-1">Custo Fixo Mensal</p>
          <h3 className="text-xl font-bold text-text-high">{formatMoeda(analise.custoFixoMensalTotal)}<span className="text-sm font-medium text-text-low">/mês</span></h3>
        </div>
        <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
          <p className="text-[10px] font-bold text-primary uppercase mb-1">
            {orcamentoMensal !== "" ? "KM Alcançável" : "Simulação (Fixo + Uso)"}
          </p>
          <h3 className="text-xl font-bold text-primary">
            {orcamentoMensal !== "" ? `${analise.kmSimulado.toFixed(0)} km` : formatMoeda(analise.custoTotalMensal)}
            {orcamentoMensal === "" && <span className="text-sm font-medium text-primary/70">/mês</span>}
          </h3>
        </div>
        <div className="bg-text-high p-6 rounded-xl border border-text-high">
          <p className="text-[10px] font-bold text-surface/60 uppercase mb-1">Projeção Anual Total</p>
          <h3 className="text-xl font-bold text-surface">{formatMoeda(analise.custoTotalAnual)}<span className="text-sm font-medium text-surface/70">/ano</span></h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* ── GRÁFICO INTERATIVO DE COMPOSIÇÃO ── */}
        <div className="lg:col-span-5 bg-surface p-8 rounded-2xl border border-border flex flex-col items-center sticky top-8">
          <h3 className="text-caption font-bold text-text-high uppercase mb-8 self-start">Composição (R$/Mês)</h3>
          
          <div className="relative w-64 h-64">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 drop-shadow-sm">
              {analise.custoTotalMensal === 0 ? (
                <circle cx="18" cy="18" r="15.9" fill="none" pathLength="100" stroke="#E5E7EB" strokeWidth="3" />
              ) : (
                analise.categorias.map((cat, idx) => {
                  const totalAnterior = analise.categorias.slice(0, idx).reduce((acc, c) => acc + c.percentual, 0);
                  const isHovered = categoriaHover === cat.nome;
                  const isFaded = categoriaHover && categoriaHover !== cat.nome;
                  
                  return (
                    <circle
                      key={cat.nome}
                      cx="18" cy="18" r="15.9"
                      fill="none"           /* <-- Torna o interior vazado para cliques/hovers */
                      pathLength="100"      /* <-- Normaliza a matemática perfeitamente para 100% */
                      stroke={CORES_CATEGORIA[cat.nome] || "#9CA3AF"}
                      strokeWidth={isHovered ? "4.5" : "3.5"}
                      strokeDasharray={`${cat.percentual} ${100 - cat.percentual}`}
                      strokeDashoffset={-totalAnterior}
                      className="transition-all duration-300 cursor-pointer outline-none"
                      style={{ opacity: isFaded ? 0.3 : 1 }}
                      onMouseEnter={() => setCategoriaHover(cat.nome)}
                      onMouseLeave={() => setCategoriaHover(null)}
                    />
                  );
                })
              )}
            </svg>
            
            {/* INFORMAÇÃO CENTRAL DO GRÁFICO */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
              <span className="text-[9px] font-bold text-text-low uppercase tracking-wider mb-1">
                {infoCentroGrafico.titulo}
              </span>
              <span className="text-lg font-black text-text-high leading-none">
                {infoCentroGrafico.valor}
              </span>
              <span className="text-[10px] font-medium text-text-low mt-1">
                {infoCentroGrafico.sub}
              </span>
            </div>
          </div>
          
          {/* LEGENDA */}
          <div className="mt-8 flex flex-wrap gap-x-4 gap-y-3 justify-center w-full">
            {analise.categorias.map((cat) => (
              <div 
                key={cat.nome} 
                className={`flex items-center gap-2 cursor-pointer transition-opacity ${categoriaHover && categoriaHover !== cat.nome ? 'opacity-30' : 'opacity-100'}`}
                onMouseEnter={() => setCategoriaHover(cat.nome)}
                onMouseLeave={() => setCategoriaHover(null)}
              >
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CORES_CATEGORIA[cat.nome] || "#9CA3AF" }} />
                <span className="text-[10px] font-bold text-text-high">{cat.nome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── ACCORDIONS: DETALHAMENTO DE CUSTOS ── */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-caption font-bold text-text-high uppercase mb-4">Métricas por Categoria</h3>
          
          {analise.categorias.length === 0 && (
            <p className="text-sm text-text-low italic">Nenhum custo cadastrado para exibir.</p>
          )}

          {analise.categorias.map((grupo) => (
            <details key={grupo.nome} className="group bg-surface rounded-xl border border-border overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-background/50 transition-colors list-none">
                <div>
                  <h4 className="text-base font-bold text-text-high">{grupo.nome}</h4>
                  <div className="flex gap-3 mt-1.5">
                    {grupo.totalPorKm > 0 && (
                      <span className="inline-flex px-2 py-0.5 rounded-md bg-primary/10 text-[10px] font-bold text-primary">
                        {formatMoeda(grupo.totalPorKm)}/km
                      </span>
                    )}
                    {grupo.totalFixoMensal > 0 && (
                      <span className="inline-flex px-2 py-0.5 rounded-md bg-text-high/10 text-[10px] font-bold text-text-high">
                        {formatMoeda(grupo.totalFixoMensal)}/mês
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center group-open:rotate-180 transition-transform">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </summary>

              <div className="px-5 pb-5 pt-2 border-t border-border/50 bg-background/30 space-y-3">
                {grupo.itens.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                    <span className="text-sm font-medium text-text-high">{item.nome}</span>
                    <div className="text-right">
                      {item.custoPorKmItem > 0 && (
                        <p className="text-xs font-bold text-primary">{formatMoeda(item.custoPorKmItem)}<span className="text-[10px] font-medium text-primary/70">/km</span></p>
                      )}
                      {item.custoFixoMensalItem > 0 && (
                        <p className="text-xs font-bold text-text-high">{formatMoeda(item.custoFixoMensalItem)}<span className="text-[10px] font-medium text-text-low">/mês</span></p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* ── BOTÃO EXPORTAR ── */}
      <div className="pt-8 border-t border-border flex justify-end">
        <button 
          onClick={handleExportarWhatsapp}
          disabled={analise.categorias.length === 0}
          className="flex items-center gap-2 px-6 py-3.5 bg-[#25D366] cursor-pointer text-white rounded-xl font-bold text-sm hover:bg-[#20bd5a] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
          Exportar Resumo para o WhatsApp
        </button>
      </div>

    </div>
  );
}