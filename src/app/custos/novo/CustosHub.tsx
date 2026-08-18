// src/app/custos/novo/CustosHub.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATALOGO_MESTRE, CategoriaCatalogo, ItemCatalogo } from "@/lib/catalogoCustos";
import { salvarCustoAvulso } from "@/actions/custo.actions";

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

type DraftState = Record<string, { 
  valorAtual: string; 
  durabilidadeKm: string; 
  durabilidadeMeses: string;
  tipoDurabilidade: "KM" | "MESES"; // Novo controle de exclusividade
}>;

const formatarNomeCategoria = (categoria: string) => {
  return categoria === "CUSTOS_FIXOS" ? "CUSTOS FIXOS" : categoria;
};

export function CustosHub({ veiculo, nomesCadastrados }: CustosHubProps) {
  const router = useRouter();
  
  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaCatalogo | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [isSalvando, setIsSalvando] = useState(false);
  const [drafts, setDrafts] = useState<DraftState>({});
  const [mensagemGlobal, setMensagemGlobal] = useState<{ texto: string; tipo: "success" | "error" } | null>(null);

  // Estados locais para controlar a UI sem precisar dar reload na página inteira
  const [salvosIds, setSalvosIds] = useState<string[]>([]);
  const [removidosIds, setRemovidosIds] = useState<string[]>([]);

  useEffect(() => {
    if (mensagemGlobal) {
      const timer = setTimeout(() => setMensagemGlobal(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensagemGlobal]);

  // Filtra os itens que realmente precisam ser exibidos
  const itensAtivosGlobais = useMemo(() => {
    return CATALOGO_MESTRE.filter((item) => {
      const isAplicavel = item.aplicavelA ? item.aplicavelA.includes(veiculo.tipo as any) : true;
      const naoCadastrado = !nomesCadastrados.includes(item.nome);
      const naoSalvoLocal = !salvosIds.includes(item.idItem);
      const naoRemovido = !removidosIds.includes(item.idItem);
      return isAplicavel && naoCadastrado && naoSalvoLocal && naoRemovido;
    });
  }, [nomesCadastrados, veiculo.tipo, salvosIds, removidosIds]);

  const grupos = useMemo(() => {
    const map = new Map<CategoriaCatalogo, typeof CATALOGO_MESTRE>();
    itensAtivosGlobais.forEach((item) => {
      if (!map.has(item.categoria)) map.set(item.categoria, []);
      map.get(item.categoria)!.push(item);
    });
    return map;
  }, [itensAtivosGlobais]);

  const categorias = ["MANUTENCAO", "COMBUSTIVEL", "DOCUMENTACAO", "CUSTOS_FIXOS", "OUTROS"] as CategoriaCatalogo[];

  function handleAbrirCategoria(cat: CategoriaCatalogo) {
    if ((grupos.get(cat)?.length || 0) === 0) return; 
    setCategoriaAtiva(cat);
    setCardIndex(0);
  }

  function handleDraftChange(idItem: string, campo: keyof DraftState[string], valor: string) {
    let valorFormatado = valor;

    if (campo === "valorAtual") {
      const apenasNumeros = valor.replace(/\D/g, ""); 
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
      const rascunhoBase = prev[idItem] || { valorAtual: "", durabilidadeKm: "", durabilidadeMeses: "", tipoDurabilidade: "KM" };
      return {
        ...prev,
        [idItem]: { ...rascunhoBase, [campo]: valorFormatado },
      };
    });
  }

  async function handleSalvarAtual(itemAtual: ItemCatalogo, totalNaCategoria: number) {
    setIsSalvando(true);
    const draft = drafts[itemAtual.idItem];

    if (!draft) {
      setMensagemGlobal({ texto: "Preencha os valores antes de salvar.", tipo: "error" });
      setIsSalvando(false);
      return;
    }

    const rawValor = draft.valorAtual.replace(/\D/g, "");
    const valorNum = rawValor ? parseInt(rawValor, 10) / 100 : 0;

    const rawKm = draft.durabilidadeKm.replace(/\D/g, "");
    const rawMeses = draft.durabilidadeMeses.replace(/\D/g, "");

    const isKm = draft.tipoDurabilidade === "KM";
    const kmNum = isKm && rawKm ? parseInt(rawKm, 10) : null;
    const mesesNum = !isKm && rawMeses ? parseInt(rawMeses, 10) : null;

    if (valorNum <= 0 || (kmNum === null && mesesNum === null)) {
      setMensagemGlobal({ texto: "Informe um valor válido e a durabilidade escolhida.", tipo: "error" });
      setIsSalvando(false);
      return;
    }

    const result = await salvarCustoAvulso({
      nome: itemAtual.nome,
      categoria: itemAtual.categoria,
      valorAtual: valorNum,
      durabilidadeKm: kmNum,
      durabilidadeMeses: mesesNum,
    });

    if (result.success) {
      setMensagemGlobal({ texto: `${itemAtual.nome} salvo com sucesso!`, tipo: "success" });
      setSalvosIds((prev) => [...prev, itemAtual.idItem]);

      // Verifica se a categoria esvaziou após salvar
      if (totalNaCategoria <= 1) {
        setCategoriaAtiva(null);
      } else {
        // Se ainda tem itens, avança garantindo que o index não estoure
        setCardIndex((prev) => Math.min(prev, totalNaCategoria - 2));
      }
      router.refresh(); 
    } else {
      setMensagemGlobal({ texto: result.message, tipo: "error" });
    }
    setIsSalvando(false);
  }

  function handleRemoverItem(itemAtual: ItemCatalogo, totalNaCategoria: number) {
    setRemovidosIds((prev) => [...prev, itemAtual.idItem]);
    if (totalNaCategoria <= 1) {
      setCategoriaAtiva(null);
    } else {
      setCardIndex((prev) => Math.min(prev, totalNaCategoria - 2));
    }
  }

  function handleRestaurarItem(idItem: string) {
    setRemovidosIds((prev) => prev.filter((id) => id !== idItem));
    setMensagemGlobal({ texto: "Item restaurado com sucesso.", tipo: "success" });
  }

  const IconeLupa = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );

  const btnPesquisaClass = "flex items-center gap-1.5 text-primary hover:text-primary-hover bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full text-caption font-medium transition-colors cursor-pointer shrink-0";
  
  // Itens removidos para mostrar no Accordion da lixeira
  const listaRemovidos = CATALOGO_MESTRE.filter(item => removidosIds.includes(item.idItem));

  return (
    <>
      {/* NAVEGAÇÃO FIXA TOPO/RODAPÉ SOLICITADA NA MISSÃO 4 */}
      {!categoriaAtiva && (
        <div className="flex flex-wrap gap-3 mb-8">
          <Link href="/dashboard" className="px-5 py-2.5 rounded-full text-caption font-semibold bg-surface border border-border text-text-high hover:border-primary/50 transition-colors">
            ← Voltar ao Dashboard
          </Link>
          <Link href="/custos" className="px-5 py-2.5 rounded-full text-caption font-semibold bg-surface border border-border text-text-high hover:border-primary/50 transition-colors">
            Ver Custos Cadastrados
          </Link>
          <Link href="/relatorio" className="px-5 py-2.5 rounded-full text-caption font-semibold bg-surface border border-border text-text-high hover:border-primary/50 transition-colors">
            Ir para Relatório
          </Link>
        </div>
      )}

      {mensagemGlobal && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg border animate-fade-in transition-all ${
            mensagemGlobal.tipo === "success" ? "bg-[#E6F4EA] border-[#CEEAD6] text-[#137333]" : "bg-[#FCE8E6] border-[#FAD2CF] text-[#C5221F]"
          }`}>
          <p className="text-caption font-semibold">{mensagemGlobal.texto}</p>
        </div>
      )}

      {categoriaAtiva ? (
        <div className="animate-fade-in flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setCategoriaAtiva(null)} className="text-text-low hover:text-text-high transition-colors text-caption font-medium flex items-center gap-2 cursor-pointer">
              ← Sair da Categoria
            </button>
            <span className="px-3 py-1 bg-surface border border-border rounded-full text-xs font-semibold text-text-low">
              {cardIndex + 1} de {(grupos.get(categoriaAtiva) || []).length}
            </span>
          </div>

          {(() => {
            const itens = grupos.get(categoriaAtiva) || [];
            if (itens.length === 0) return null; // Prevenção de crash
            const itemAtual = itens[cardIndex];
            const draftAtual = drafts[itemAtual.idItem] || { valorAtual: "", durabilidadeKm: "", durabilidadeMeses: "", tipoDurabilidade: "KM" };

            const sufixoVeiculo = `${veiculo.marca} ${veiculo.modelo} ${veiculo.ano}`;
            const linkGooglePreco = `https://www.google.com/search?q=${encodeURIComponent(`Preço ${itemAtual.nome} ${sufixoVeiculo}`)}`;
            const linkGoogleDurabilidade = `https://www.google.com/search?q=${encodeURIComponent(`Durabilidade média ${itemAtual.nome} ${sufixoVeiculo}`)}`;

            return (
              <>
                <div className="bg-surface rounded-xl border border-border shadow-sm p-8 flex-1 relative animate-slide-down">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-1">
                    <h2 className="text-display font-bold text-text-high leading-tight flex-1 min-w-0 break-words">
                      {itemAtual.nome}
                    </h2>
                    <a href={linkGooglePreco} target="_blank" rel="noopener noreferrer" className={btnPesquisaClass}>
                      <IconeLupa /> Pesquisar Preço
                    </a>
                  </div>
                  <p className="text-caption text-text-low mb-8">
                    Se não souber utilize os botões de pesquisa para auxilio, caso não faça parte do veículo clique em 'Remover'.
                  </p>

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
                          <IconeLupa /> Pesquisar Durabilidade
                        </a>
                      </div>

                      {/* TOGGLE EXCLUSIVO (MISSÃO 2) */}
                      <div className="flex bg-background border border-border rounded-lg p-1 w-fit mb-6">
                        <button 
                          type="button"
                          className={`px-5 py-2 rounded-md text-caption font-bold transition-all ${draftAtual.tipoDurabilidade === 'KM' ? 'bg-surface shadow-sm text-primary' : 'text-text-low hover:text-text-high cursor-pointer'}`}
                          onClick={() => handleDraftChange(itemAtual.idItem, 'tipoDurabilidade', 'KM')}
                        >
                          Por Quilometragem
                        </button>
                        <button 
                          type="button"
                          className={`px-5 py-2 rounded-md text-caption font-bold transition-all ${draftAtual.tipoDurabilidade === 'MESES' ? 'bg-surface shadow-sm text-primary' : 'text-text-low hover:text-text-high cursor-pointer'}`}
                          onClick={() => handleDraftChange(itemAtual.idItem, 'tipoDurabilidade', 'MESES')}
                        >
                          Por Tempo (Meses)
                        </button>
                      </div>

                      {/* EXIBIÇÃO CONDICIONAL BASEADA NO TOGGLE */}
                      <div className="animate-fade-in">
                        {draftAtual.tipoDurabilidade === 'KM' ? (
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
                        ) : (
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
                        )}
                      </div>

                    </div>
                  </div>
                </div>

                {/* NOVA BARRA DE AÇÕES (MISSÃO 1.3) */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 bg-background/80 backdrop-blur-md p-4 rounded-xl border border-border shadow-md z-10">
                  <button
                    onClick={() => setCategoriaAtiva(null)}
                    className="w-full sm:w-auto px-6 py-3 rounded-md font-semibold text-text-high hover:bg-surface border border-transparent transition-colors cursor-pointer"
                  >
                    Voltar
                  </button>
                  
                  <button
                    onClick={() => handleRemoverItem(itemAtual, itens.length)}
                    className="w-full sm:w-auto px-6 py-3 rounded-md font-semibold text-danger border border-danger/30 hover:bg-danger/10 transition-colors cursor-pointer"
                  >
                    Remover Item
                  </button>

                  <button
                    onClick={() => handleSalvarAtual(itemAtual, itens.length)}
                    disabled={isSalvando}
                    className="w-full sm:w-auto px-10 py-3 rounded-md font-bold text-white bg-primary hover:bg-primary-hover shadow-sm disabled:opacity-60 transition-all cursor-pointer"
                  >
                    {isSalvando ? "Salvando..." : "Próximo"}
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      ) : (
        <div className="grid gap-4 animate-fade-in relative">
          {categorias.map((cat) => {
            // Conta totais usando os arrays que vieram do banco + salvas/removidas locais
            const itensAplicaveisNestaCat = CATALOGO_MESTRE.filter(
              (i) => i.categoria === cat && (i.aplicavelA ? i.aplicavelA.includes(veiculo.tipo as any) : true)
            );
            
            const total = itensAplicaveisNestaCat.length;
            
            // O que já está "concluído" = (No banco) + (Salvo localmente) + (Removido)
            const concluidosNestaCat = itensAplicaveisNestaCat.filter(i => 
              nomesCadastrados.includes(i.nome) || salvosIds.includes(i.idItem) || removidosIds.includes(i.idItem)
            ).length;

            const concluido = total > 0 && concluidosNestaCat === total;

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
                  <h3 className="text-base font-bold text-text-high mb-1">{formatarNomeCategoria(cat)}</h3>
                  <p className="text-caption text-text-low">
                    {concluido ? "Todos os itens mapeados ou ignorados." : "Clique para mapear itens pendentes."}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`text-caption font-semibold ${concluido ? "text-primary" : "text-text-low"}`}>
                    {concluidosNestaCat} / {total}
                  </span>
                  {!concluido && (
                    <span className="text-text-low/50">→</span>
                  )}
                </div>
              </button>
            );
          })}

          {/* LIXEIRA (MISSÃO 3) */}
          {listaRemovidos.length > 0 && (
             <details className="mt-4 bg-surface border border-border rounded-xl overflow-hidden group">
                <summary className="p-6 font-bold cursor-pointer flex justify-between items-center text-text-high hover:bg-background/50 transition-colors list-none outline-none">
                  <div className="flex items-center gap-2">
                    <span>🗑️</span> Custos Removidos / Pulados
                    <span className="ml-2 text-xs font-bold text-danger bg-danger/10 px-2 py-0.5 rounded-full">{listaRemovidos.length}</span>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-open:rotate-180 transition-transform"><path d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="px-6 pb-6 pt-2 border-t border-border/50 bg-background/30 space-y-2 animate-slide-down origin-top">
                  {listaRemovidos.map(item => (
                    <div key={item.idItem} className="flex justify-between items-center py-3 border-b border-border/40 last:border-0 hover:bg-surface px-3 -mx-3 rounded-md transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-text-high">{item.nome}</p>
                        <p className="text-xs text-text-low">{formatarNomeCategoria(item.categoria)}</p>
                      </div>
                      <button onClick={() => handleRestaurarItem(item.idItem)} className="px-4 py-2 bg-background border border-border hover:border-primary text-primary text-xs font-bold rounded-md transition-colors cursor-pointer">
                        Restaurar
                      </button>
                    </div>
                  ))}
                </div>
             </details>
          )}

        </div>
      )}
    </>
  );
}