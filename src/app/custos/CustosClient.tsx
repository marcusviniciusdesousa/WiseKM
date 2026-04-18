// src/app/custos/CustosClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { salvarCustoAvulso, excluirCusto, excluirTodosCustos } from "@/actions/custo.actions";
import { CategoriaCusto } from "@prisma/client";

type Custo = {
  id: string;
  nome: string;
  categoria: CategoriaCusto;
  valorAtual: number;
  durabilidadeKm: number | null;
  durabilidadeMeses: number | null;
};

export function CustosClient({ custosIniciais }: { custosIniciais: Custo[] }) {
  const router = useRouter();

  const [modalEdicao, setModalEdicao] = useState(false);
  const [isSalvando, setIsSalvando] = useState(false);
  const [custoEditando, setCustoEditando] = useState<Custo | null>(null);

  const [custoParaExcluir, setCustoParaExcluir] = useState<Custo | null>(null);
  const [isExcluindo, setIsExcluindo] = useState(false);

  const [modalExcluirTodos, setModalExcluirTodos] = useState(false);
  const [isExcluindoTodos, setIsExcluindoTodos] = useState(false);

  const [categoriasFechadas, setCategoriasFechadas] = useState<string[]>([]);

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState<CategoriaCusto>("OUTROS");
  const [valorAtual, setValorAtual] = useState("");
  const [durabilidadeKm, setDurabilidadeKm] = useState("");
  const [durabilidadeMeses, setDurabilidadeMeses] = useState("");

  const formatMoeda = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
  const formatNum = (v: number) => new Intl.NumberFormat("pt-BR").format(v);

  const custosAgrupados = custosIniciais.reduce((acc, custo) => {
    if (!acc[custo.categoria]) acc[custo.categoria] = [];
    acc[custo.categoria].push(custo);
    return acc;
  }, {} as Record<string, Custo[]>);

  function toggleCategoria(cat: string) {
    setCategoriasFechadas((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function abrirModalEdicao(custo?: Custo) {
    if (custo) {
      setCustoEditando(custo);
      setNome(custo.nome);
      setCategoria(custo.categoria);
      setValorAtual(custo.valorAtual.toString());
      setDurabilidadeKm(custo.durabilidadeKm?.toString() || "");
      setDurabilidadeMeses(custo.durabilidadeMeses?.toString() || "");
    } else {
      setCustoEditando(null);
      setNome("");
      setCategoria("OUTROS");
      setValorAtual("");
      setDurabilidadeKm("");
      setDurabilidadeMeses("");
    }
    setModalEdicao(true);
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setIsSalvando(true);

    const valorNum = parseFloat(valorAtual);
    const kmNum = durabilidadeKm ? parseInt(durabilidadeKm, 10) : null;
    const mesesNum = durabilidadeMeses ? parseInt(durabilidadeMeses, 10) : null;

    if (isNaN(valorNum) || valorNum <= 0) {
      alert("Valor inválido.");
      setIsSalvando(false);
      return;
    }

    if (kmNum === null && mesesNum === null) {
      alert("Defina a durabilidade em KM ou Meses.");
      setIsSalvando(false);
      return;
    }

    const result = await salvarCustoAvulso({
      id: custoEditando?.id,
      nome,
      categoria,
      valorAtual: valorNum,
      durabilidadeKm: kmNum,
      durabilidadeMeses: mesesNum,
    });

    if (result.success) {
      setModalEdicao(false);
      router.refresh();
    } else {
      alert(result.message);
    }
    setIsSalvando(false);
  }

  async function confirmarExclusao() {
    if (!custoParaExcluir) return;
    setIsExcluindo(true);

    const result = await excluirCusto(custoParaExcluir.id);
    if (result.success) {
      setCustoParaExcluir(null);
      router.refresh();
    } else {
      alert(result.message);
    }
    setIsExcluindo(false);
  }

  async function handleExcluirTodos() {
    setIsExcluindoTodos(true);
    const result = await excluirTodosCustos();
    
    if (result.success) {
      setModalExcluirTodos(false);
      router.refresh();
    } else {
      alert(result.message);
    }
    setIsExcluindoTodos(false);
  }

  return (
    <div className="animate-fade-in pb-12">
      
      {/* ── CENTRO DE COMANDO ── */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-surface p-4 rounded-xl border border-border shadow-sm">
        <div className="flex w-full sm:w-auto gap-3">
          <Link href="/dashboard" className="flex-1 sm:flex-none text-center px-5 py-2.5 rounded-full text-caption font-semibold bg-background border border-border text-text-high hover:border-primary/50 transition-colors">
            ← Dashboard
          </Link>
          <Link href="/relatorio" className="flex-1 sm:flex-none text-center px-5 py-2.5 rounded-full text-caption font-semibold bg-background border border-border text-text-high hover:border-primary/50 transition-colors">
            Ver Relatório 📊
          </Link>
        </div>
        
        <div className="flex w-full sm:w-auto gap-3">
          {custosIniciais.length > 0 && (
            <button 
              onClick={() => setModalExcluirTodos(true)} 
              className="px-5 py-2.5 rounded-full text-caption font-semibold border border-danger/30 text-danger hover:bg-danger/5 transition-colors cursor-pointer flex items-center justify-center gap-2"
              title="Apagar todos os custos"
            >
              🗑️ Limpar Tudo
            </button>
          )}
          <button 
            onClick={() => abrirModalEdicao()} 
            className="w-full sm:w-auto px-6 py-2.5 rounded-full text-caption font-semibold bg-primary text-white hover:bg-primary-hover shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="text-xl leading-none">+</span> Personalizado
          </button>
        </div>
      </div>

      {custosIniciais.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border border-dashed p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-border/30 flex items-center justify-center mx-auto mb-4 text-2xl">📋</div>
          <p className="text-base font-semibold text-text-high mb-1">Nenhum custo cadastrado</p>
          <p className="text-caption text-text-low mb-8">Adicione um custo personalizado ou use o mapeamento inicial.</p>
          <Link 
            href="/custos/novo" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-caption font-semibold bg-primary text-white hover:bg-primary-hover shadow-sm transition-all cursor-pointer"
          >
            Fazer Mapeamento Inicial →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(custosAgrupados).map(([categoriaNome, lista]) => {
            const isFechado = categoriasFechadas.includes(categoriaNome);

            return (
              <div key={categoriaNome} className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm transition-all">
                <button 
                  onClick={() => toggleCategoria(categoriaNome)}
                  className="w-full px-6 py-4 bg-background hover:bg-border/20 border-b border-border flex justify-between items-center transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <h2 className="text-base font-bold text-text-high">{categoriaNome}</h2>
                    <span className="text-xs font-bold text-text-low bg-border/40 px-2.5 py-0.5 rounded-full">
                      {lista.length} itens
                    </span>
                  </div>
                  <svg 
                    viewBox="0 0 24 24" 
                    className={`w-5 h-5 text-text-low transition-transform duration-300 ${isFechado ? "rotate-180" : "rotate-0"}`} 
                    fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {!isFechado && (
                  <div className="divide-y divide-border animate-slide-down">
                    {lista.map((c) => {
                       const custoPorKm = c.durabilidadeKm ? c.valorAtual / c.durabilidadeKm : 0;
                       
                       return (
                        <div key={c.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:bg-background/40 transition-colors">
                          
                          {/* Bloco da Esquerda: Nome e Badges */}
                          <div className="flex-1">
                            <h3 className="text-base font-bold text-text-high mb-2.5">{c.nome}</h3>
                            <div className="flex flex-wrap gap-2">
                              {c.durabilidadeKm && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface border border-border text-[11px] font-semibold text-text-low">
                                  <span>🔄</span> {formatNum(c.durabilidadeKm)} km
                                </span>
                              )}
                              {c.durabilidadeMeses && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface border border-border text-[11px] font-semibold text-text-low">
                                  <span>⏳</span> {c.durabilidadeMeses} meses
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Bloco da Direita: Valores e Ações */}
                          <div className="flex flex-row items-center justify-between sm:justify-end gap-6 sm:gap-8 w-full sm:w-auto border-t sm:border-0 border-border/50 pt-4 sm:pt-0 mt-2 sm:mt-0">
                            
                            {/* Alinhamento dos custos */}
                            <div className="flex flex-col items-start sm:items-end">
                              <p className="text-lg font-bold text-text-high leading-none">
                                {formatMoeda(c.valorAtual)}
                              </p>
                              {custoPorKm > 0 && (
                                <p className="text-[11px] font-bold text-primary tracking-wide mt-1.5">
                                  {formatMoeda(custoPorKm)} / KM
                                </p>
                              )}
                            </div>
                            
                            {/* Botões de Ação */}
                            <div className="flex items-center gap-1 border-l border-border/50 pl-6 sm:pl-4">
                              <button onClick={() => abrirModalEdicao(c)} className="p-2 text-text-low hover:text-primary transition-colors cursor-pointer rounded-md hover:bg-primary/10" title="Editar">
                                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                              </button>
                              <button onClick={() => setCustoParaExcluir(c)} className="p-2 text-text-low hover:text-danger transition-colors cursor-pointer rounded-md hover:bg-danger/10" title="Excluir">
                                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                              </button>
                            </div>

                          </div>
                        </div>
                       );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAIS (CRIAR, EXCLUIR, LIMPAR TUDO) ────────────────────────── */}
      
      {modalEdicao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface rounded-xl shadow-2xl w-full max-w-lg p-8 border border-border animate-slide-down">
            <h3 className="text-heading-1 font-bold text-text-high mb-6">
              {custoEditando ? "Editar Custo" : "Novo Custo Personalizado"}
            </h3>

            <form onSubmit={handleSalvar} className="space-y-4">
              <div>
                <label className="block text-caption font-semibold text-text-high mb-1.5">Nome do Item</label>
                <input required type="text" value={nome} onChange={e => setNome(e.target.value)} className="w-full px-4 py-3 rounded-md border border-border bg-background text-base" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-caption font-semibold text-text-high mb-1.5">Categoria</label>
                  <select value={categoria} onChange={e => setCategoria(e.target.value as CategoriaCusto)} className="w-full px-4 py-3 rounded-md border border-border bg-background text-base">
                    <option value="MANUTENCAO">Manutenção</option>
                    <option value="CONSUMIVEL">Consumível</option>
                    <option value="DOCUMENTACAO">Documentação</option>
                    <option value="SEGURO">Seguro</option>
                    <option value="OUTROS">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-caption font-semibold text-text-high mb-1.5">Valor Atual (R$)</label>
                  <input required type="number" step="0.01" min="0" value={valorAtual} onChange={e => setValorAtual(e.target.value)} className="w-full px-4 py-3 rounded-md border border-border bg-background text-base" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-caption font-semibold text-text-high mb-1.5">Durabilidade (KM)</label>
                  <input type="number" min="0" value={durabilidadeKm} onChange={e => setDurabilidadeKm(e.target.value)} className="w-full px-4 py-3 rounded-md border border-border bg-background text-base" />
                </div>
                <div>
                  <label className="block text-caption font-semibold text-text-high mb-1.5">Durabilidade (Meses)</label>
                  <input type="number" min="0" value={durabilidadeMeses} onChange={e => setDurabilidadeMeses(e.target.value)} className="w-full px-4 py-3 rounded-md border border-border bg-background text-base" />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-6 mt-4 border-t border-border">
                <button type="button" onClick={() => setModalEdicao(false)} className="px-5 py-2.5 rounded-full text-caption font-semibold text-text-low hover:bg-background cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" disabled={isSalvando} className="px-5 py-2.5 rounded-full text-caption font-semibold bg-primary text-white hover:bg-primary-hover shadow-sm disabled:opacity-50 cursor-pointer">
                  {isSalvando ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {custoParaExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface rounded-xl shadow-2xl w-full max-w-md p-8 border border-border animate-slide-down">
            <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-heading-1 font-bold text-text-high mb-2">Excluir Custo?</h3>
            <p className="text-base text-text-low mb-6">
              Você está prestes a remover <strong>{custoParaExcluir.nome}</strong>. Esta ação não poderá ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setCustoParaExcluir(null)} className="px-5 py-2.5 rounded-full text-caption font-semibold text-text-low hover:bg-background cursor-pointer">
                Cancelar
              </button>
              <button onClick={confirmarExclusao} disabled={isExcluindo} className="px-5 py-2.5 rounded-full text-caption font-semibold bg-danger text-white hover:bg-danger-hover shadow-sm disabled:opacity-50 cursor-pointer">
                {isExcluindo ? "Excluindo..." : "Sim, Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalExcluirTodos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-surface rounded-xl shadow-2xl w-full max-w-md p-8 border-2 border-danger/30 animate-slide-down">
            <div className="w-16 h-16 rounded-full bg-danger/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">💣</span>
            </div>
            <h3 className="text-heading-1 font-bold text-center text-danger mb-3">Atenção: Exclusão em Massa!</h3>
            <p className="text-base text-center text-text-high mb-8">
              Você está prestes a apagar <strong>TODOS os {custosIniciais.length} custos</strong> cadastrados. 
              O seu veículo ficará sem nenhum histórico e os cálculos do relatório serão zerados. <br/><br/>
              Essa ação <strong>NÃO</strong> pode ser desfeita.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleExcluirTodos} 
                disabled={isExcluindoTodos} 
                className="w-full py-3.5 rounded-full text-base font-bold bg-danger text-white hover:bg-danger-hover shadow-md disabled:opacity-50 transition-all cursor-pointer"
              >
                {isExcluindoTodos ? "Limpando Banco de Dados..." : "Sim, Apagar Tudo!"}
              </button>
              <button 
                onClick={() => setModalExcluirTodos(false)} 
                disabled={isExcluindoTodos}
                className="w-full py-3.5 rounded-full text-base font-semibold bg-background border border-border text-text-high hover:bg-surface transition-all cursor-pointer"
              >
                Cancelar e Manter Meus Dados
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}