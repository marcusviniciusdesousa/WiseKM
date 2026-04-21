// src/app/custos/novo/CustosHub.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATALOGO_MESTRE, CategoriaCatalogo } from "@/lib/catalogoCustos";
import { salvarLoteCustos, LoteCustoInput } from "@/actions/custo.actions";

interface VeiculoBasico {
  marca: string;
  modelo: string;
  ano: string;
  tipo: string; 
}

interface CustosHubProps {
  veiculo: VeiculoBasico;
  nomesCadastrados: string[];
}

type DraftState = Record<string, { valorAtual: string; durabilidadeKm: string; durabilidadeMeses: string }>;

export function CustosHub({ veiculo, nomesCadastrados }: CustosHubProps) {
  const router = useRouter();
  
  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaCatalogo | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [isSalvando, setIsSalvando] = useState(false);
  const [drafts, setDrafts] = useState<DraftState>({});
  const [mensagemGlobal, setMensagemGlobal] = useState<{ texto: string; tipo: "success" | "error" } | null>(null);

  useEffect(() => {
    if (mensagemGlobal) {
      const timer = setTimeout(() => setMensagemGlobal(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensagemGlobal]);

  const itensPendentes = useMemo(() => {
    return CATALOGO_MESTRE.filter((item) => {
      const isAplicavel = item.aplicavelA ? item.aplicavelA.includes(veiculo.tipo as any) : true;
      const naoCadastrado = !nomesCadastrados.includes(item.nome);
      return isAplicavel && naoCadastrado;
    });
  }, [nomesCadastrados, veiculo.tipo]);

  const grupos = useMemo(() => {
    const map = new Map<CategoriaCatalogo, typeof CATALOGO_MESTRE>();
    itensPendentes.forEach((item) => {
      if (!map.has(item.categoria)) map.set(item.categoria, []);
      map.get(item.categoria)!.push(item);
    });
    return map;
  }, [itensPendentes]);

  const categorias = ["MANUTENCAO", "COMBUSTIVEL", "DOCUMENTACAO", "CUSTOS_FIXOS", "OUTROS"] as CategoriaCatalogo[];

  function handleAbrirCategoria(cat: CategoriaCatalogo) {
    if ((grupos.get(cat)?.length || 0) === 0) return; 
    setCategoriaAtiva(cat);
    setCardIndex(0);
  }

  function handleDraftChange(idItem: string, campo: keyof DraftState[string], valor: string) {
    let valorFormatado = valor;

    if (campo === "valorAtual") {
      const apenasNumeros = valor.replace(/\D/g, ""); // Remove tudo que não for número
      if (apenasNumeros) {
        valorFormatado = (parseInt(apenasNumeros, 10) / 100).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      } else {
        valorFormatado = "";
      }
    } else if (campo === "durabilidadeKm" || campo === "durabilidadeMeses") {
      const apenasNumeros = valor.replace(/\D/g, "");
      if (apenasNumeros) {
        valorFormatado = parseInt(apenasNumeros, 10).toLocaleString("pt-BR");
      } else {
        valorFormatado = "";
      }
    }

    setDrafts((prev) => {
      const rascunhoBase = prev[idItem] || { valorAtual: "", durabilidadeKm: "", durabilidadeMeses: "" };
      return {
        ...prev,
        [idItem]: {
          ...rascunhoBase,
          [campo]: valorFormatado,
        },
      };
    });
  }

  async function handleSalvarLote() {
    setIsSalvando(true);
    const loteInput: LoteCustoInput[] = [];
    const itensDaCategoria = grupos.get(categoriaAtiva as CategoriaCatalogo) || [];
    
    itensDaCategoria.forEach((item) => {
      const draft = drafts[item.idItem];
      if (draft) {
        // "Desformata" o dinheiro (Ex: "R$ 1.000,50" vira 1000.5)
        const rawValor = draft.valorAtual.replace(/\D/g, "");
        const valorNum = rawValor ? parseInt(rawValor, 10) / 100 : NaN;

        // "Desformata" a quilometragem e meses (Ex: "10.000" vira 10000)
        const rawKm = draft.durabilidadeKm.replace(/\D/g, "");
        const kmNum = rawKm ? parseInt(rawKm, 10) : null;

        const rawMeses = draft.durabilidadeMeses.replace(/\D/g, "");
        const mesesNum = rawMeses ? parseInt(rawMeses, 10) : null;
        
        const kmValido = kmNum === null || kmNum > 0;
        const mesesValido = mesesNum === null || mesesNum > 0;
        
        if (!isNaN(valorNum) && valorNum > 0 && kmValido && mesesValido && (kmNum !== null || mesesNum !== null)) {
          loteInput.push({
            nome: item.nome,
            categoria: item.categoria,
            valorAtual: valorNum,
            durabilidadeKm: kmNum,
            durabilidadeMeses: mesesNum,
          });
        }
      }
    });

    if (loteInput.length === 0) {
      setMensagemGlobal({ texto: "Nenhum dado válido para salvar. Preencha os valores corretamente.", tipo: "error" });
      setIsSalvando(false);
      return;
    }

    const result = await salvarLoteCustos(loteInput);
    if (result.success) {
      setCategoriaAtiva(null);
      setMensagemGlobal({ texto: "Categoria salva com sucesso!", tipo: "success" });
      router.refresh(); 
    } else {
      setMensagemGlobal({ texto: result.message, tipo: "error" });
    }
    setIsSalvando(false);
  }

  const IconeLupa = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );

  const btnPesquisaClass = "flex items-center gap-1.5 text-primary hover:text-primary-hover bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full text-caption font-medium transition-colors cursor-pointer shrink-0";

  return (
    <>
      {mensagemGlobal && (
        <div 
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg border animate-fade-in transition-all ${
            mensagemGlobal.tipo === "success" 
              ? "bg-[#E6F4EA] border-[#CEEAD6] text-[#137333]" 
              : "bg-[#FCE8E6] border-[#FAD2CF] text-[#C5221F]"
          }`}
        >
          <p className="text-caption font-semibold">{mensagemGlobal.texto}</p>
        </div>
      )}

      {categoriaAtiva ? (
        <div className="animate-fade-in flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setCategoriaAtiva(null)} className="text-text-low hover:text-text-high transition-colors text-caption font-medium flex items-center gap-2 cursor-pointer">
              ← Voltar ao Menu
            </button>
            <span className="px-3 py-1 bg-surface border border-border rounded-full text-xs font-semibold text-text-low">
              {cardIndex + 1} de {(grupos.get(categoriaAtiva) || []).length}
            </span>
          </div>

          {(() => {
            const itens = grupos.get(categoriaAtiva) || [];
            const itemAtual = itens[cardIndex];
            const draftAtual = drafts[itemAtual.idItem] || { valorAtual: "", durabilidadeKm: "", durabilidadeMeses: "" };

            const sufixoVeiculo = `${veiculo.marca} ${veiculo.modelo} ${veiculo.ano}`;
            const linkGooglePreco = `https://www.google.com/search?q=${encodeURIComponent(`Preço ${itemAtual.nome} ${sufixoVeiculo}`)}`;
            const linkGoogleDurabilidade = `https://www.google.com/search?q=${encodeURIComponent(`Durabilidade média ${itemAtual.nome} ${sufixoVeiculo}`)}`;

            return (
              <>
                <div className="bg-surface rounded-xl border border-border shadow-sm p-8 flex-1 relative">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-1">
                    <h2 className="text-display font-bold text-text-high leading-tight flex-1 min-w-0 break-words">
                      {itemAtual.nome}
                    </h2>
                    <a href={linkGooglePreco} target="_blank" rel="noopener noreferrer" className={btnPesquisaClass}>
                      <IconeLupa />
                      Pesquisar Preço
                    </a>
                  </div>
                  <p className="text-caption text-text-low mb-8">Se não souber ou não fizer parte do veículo, deixe em branco e avance.</p>

                  <div className="space-y-8">
                    <div>
                      <label className="block text-caption font-semibold text-text-high mb-2">Qual o custo da substituição? (R$)</label>
                      <input
                        type="text" 
                        placeholder="R$ 0,00"
                        value={draftAtual.valorAtual}
                        onChange={(e) => handleDraftChange(itemAtual.idItem, "valorAtual", e.target.value)}
                        className="w-full px-4 py-3 rounded-md border border-border bg-background text-base text-text-high focus:ring-2 focus:ring-primary/30 outline-none"
                      />
                    </div>

                    <div className="pt-6 border-t border-border">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <label className="block text-caption font-semibold text-text-high">Regras de Durabilidade</label>
                        <a href={linkGoogleDurabilidade} target="_blank" rel="noopener noreferrer" className={btnPesquisaClass}>
                          <IconeLupa />
                          Pesquisar Durabilidade
                        </a>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="durabilidadeKm" className="block text-caption text-text-low mb-1.5">Desgaste em KM</label>
                          <div className="relative">
                            <input
                              id="durabilidadeKm"
                              type="text" 
                              placeholder={itemAtual.sugestaoDurabilidadeKm ? itemAtual.sugestaoDurabilidadeKm.toLocaleString("pt-BR") : "N/A"}
                              value={draftAtual.durabilidadeKm}
                              onChange={(e) => handleDraftChange(itemAtual.idItem, "durabilidadeKm", e.target.value)}
                              className="w-full px-4 py-3 rounded-md border border-border bg-background text-base text-text-high focus:ring-2 focus:ring-primary/30 outline-none pr-10"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-caption text-text-low">km</span>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="durabilidadeMeses" className="block text-caption text-text-low mb-1.5">Desgaste em Meses</label>
                          <div className="relative">
                            <input
                              id="durabilidadeMeses"
                              type="text" 
                              placeholder={itemAtual.sugestaoDurabilidadeMeses ? itemAtual.sugestaoDurabilidadeMeses.toLocaleString("pt-BR") : "N/A"}
                              value={draftAtual.durabilidadeMeses}
                              onChange={(e) => handleDraftChange(itemAtual.idItem, "durabilidadeMeses", e.target.value)}
                              className="w-full px-4 py-3 rounded-md border border-border bg-background text-base text-text-high focus:ring-2 focus:ring-primary/30 outline-none pr-14"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-caption text-text-low">meses</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between gap-4 sticky bottom-4 bg-background/80 backdrop-blur-md p-4 rounded-xl border border-border">
                  <button
                    onClick={() => setCardIndex((i) => Math.max(0, i - 1))}
                    disabled={cardIndex === 0}
                    className="px-6 py-3 rounded-md font-semibold text-text-high disabled:opacity-30 hover:bg-surface transition-colors cursor-pointer"
                  >
                    Anterior
                  </button>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCardIndex((i) => Math.min(itens.length - 1, i + 1))}
                      disabled={cardIndex === itens.length - 1}
                      className="px-6 py-3 rounded-md font-semibold text-text-high bg-surface border border-border disabled:opacity-30 hover:bg-border/50 transition-colors cursor-pointer"
                    >
                      Próximo
                    </button>
                    <button
                      onClick={handleSalvarLote}
                      disabled={isSalvando}
                      className="px-8 py-3 rounded-md font-semibold text-white bg-primary hover:bg-primary-hover shadow-sm disabled:opacity-60 transition-all cursor-pointer"
                    >
                      {isSalvando ? "Salvando..." : "Salvar Categoria"}
                    </button>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      ) : (
        <div className="grid gap-4 animate-fade-in relative">
          {categorias.map((cat) => {
            const itensAplicaveisNestaCat = CATALOGO_MESTRE.filter(
              (i) => i.categoria === cat && (i.aplicavelA ? i.aplicavelA.includes(veiculo.tipo as any) : true)
            );
            
            const pendentesNestaCat = grupos.get(cat) || [];
            
            const total = itensAplicaveisNestaCat.length;
            const preenchidos = total - pendentesNestaCat.length;
            const concluido = total > 0 && pendentesNestaCat.length === 0;

            if (total === 0) return null;

            return (
              <button
                key={cat}
                onClick={() => handleAbrirCategoria(cat)}
                disabled={concluido}
                className={`
                  flex items-center justify-between p-6 rounded-xl border text-left transition-all
                  ${concluido 
                    ? "bg-surface/50 border-border opacity-60 cursor-not-allowed" 
                    : "bg-surface border-border hover:border-primary/40 hover:shadow-sm cursor-pointer"}
                `}
              >
                <div>
                  <h3 className="text-base font-bold text-text-high mb-1">{cat}</h3>
                  <p className="text-caption text-text-low">
                    {concluido ? "Todos os itens mapeados." : "Clique para mapear itens."}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`text-caption font-semibold ${concluido ? "text-primary" : "text-text-low"}`}>
                    {preenchidos} / {total}
                  </span>
                  {!concluido && (
                    <span className="text-text-low/50">→</span>
                  )}
                </div>
              </button>
            );
          })}

          <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/20 text-center">
            <p className="text-caption text-text-high font-medium mb-1.5">Deseja adicionar um custo personalizado?</p>
            <p className="text-xs text-text-low">
              Vá até o painel{" "}
              <Link href="/custos" className="text-primary font-semibold hover:text-primary-hover underline cursor-pointer">
                "Ver Custos Cadastrados"
              </Link>{" "}
              para gerenciar itens avulsos ou remover os atuais.
            </p>
          </div>
        </div>
      )}
    </>
  );
}