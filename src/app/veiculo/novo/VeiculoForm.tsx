// src/app/veiculo/novo/VeiculoForm.tsx
// Client Component — fluxo em etapas (stepped form) para cadastro de veículo
// Consome a API FIPE diretamente do browser (fetch client-side)
// Co-localizado na rota por ser específico desta página

"use client";

import { useActionState, useState, useEffect } from "react";
import { cadastrarVeiculo, type VeiculoActionResult } from "@/actions/veiculo.actions";
import type { TipoFipe, FipeMarca, FipeModelo, FipeAno } from "@/lib/fipe";
import { parseFipeValor } from "@/lib/fipe";
import { Usuario, TipoVeiculo } from "@prisma/client";

// ── Constantes ────────────────────────────────────────────────────────────

const FIPE_BASE = "https://parallelum.com.br/fipe/api/v1";

const initialState: VeiculoActionResult = { success: false, message: "" };

// ── Tipos internos ────────────────────────────────────────────────────────

interface ValorFipe {
  valorStr: string;   // "R$ 45.000,00"
  valorFloat: number; // 45000
  codigoFipe: string; // "038006-6"
  mesRef: string;     // "dezembro de 2024"
}

// ── Helpers de UI ─────────────────────────────────────────────────────────

function Spinner({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-caption text-text-low py-2.5 px-4">
      <svg
        className="w-4 h-4 animate-spin text-primary shrink-0"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <span>{text}</span>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────

export function VeiculoForm() {
  const [state, action, isPending] = useActionState(cadastrarVeiculo, initialState);

  // ── Estado do formulário em etapas ────────────────────────────────────
  const [tipo, setTipo] = useState<TipoVeiculo | null>(null);

  const [marcas, setMarcas] = useState<FipeMarca[]>([]);
  const [marcaSelecionada, setMarcaSelecionada] = useState("");
  const [marcaNome, setMarcaNome] = useState("");
  const [loadingMarcas, setLoadingMarcas] = useState(false);

  const [modelos, setModelos] = useState<FipeModelo[]>([]);
  const [modeloSelecionado, setModeloSelecionado] = useState("");
  const [modeloNome, setModeloNome] = useState("");
  const [loadingModelos, setLoadingModelos] = useState(false);

  const [anos, setAnos] = useState<FipeAno[]>([]);
  const [anoSelecionado, setAnoSelecionado] = useState("");
  const [anoNome, setAnoNome] = useState("");
  const [loadingAnos, setLoadingAnos] = useState(false);

  const [valorFipe, setValorFipe] = useState<ValorFipe | null>(null);
  const [loadingValor, setLoadingValor] = useState(false);

  const [quilometragem, setQuilometragem] = useState("");

  // ── Helpers de mapeamento tipo ────────────────────────────────────────

  function toFipeTipo(t: TipoVeiculo): TipoFipe {
    if (t === "CARRO") return "carros";
    if (t === "MOTO") return "motos";
    return "caminhoes" as TipoFipe; 
  }

 // ── Efeito: buscar marcas quando tipo muda ────────────────────────────

  useEffect(() => {
    if (!tipo) return;

    // Reset cascata
    setMarcas([]);
    setMarcaSelecionada("");
    setMarcaNome("");
    setModelos([]);
    setModeloSelecionado("");
    setModeloNome("");
    setAnos([]);
    setAnoSelecionado("");
    setAnoNome("");
    setValorFipe(null);

    const fipeTipo = toFipeTipo(tipo);
    setLoadingMarcas(true);

    fetch(`${FIPE_BASE}/${fipeTipo}/marcas`)
      .then((r) => r.json())
      .then((data) => {
        // BLINDAGEM: Se não for Array, garante que seja um Array vazio
        setMarcas(Array.isArray(data) ? data : []);
      })
      .catch(() => setMarcas([]))
      .finally(() => setLoadingMarcas(false));
  }, [tipo]);

  // ── Efeito: buscar modelos quando marca muda ──────────────────────────

  useEffect(() => {
    if (!tipo || !marcaSelecionada) return;

    setModelos([]);
    setModeloSelecionado("");
    setModeloNome("");
    setAnos([]);
    setAnoSelecionado("");
    setAnoNome("");
    setValorFipe(null);

    const fipeTipo = toFipeTipo(tipo);
    setLoadingModelos(true);

    fetch(`${FIPE_BASE}/${fipeTipo}/marcas/${marcaSelecionada}/modelos`)
      .then((r) => r.json())
      .then((data) => {
        // BLINDAGEM: O endpoint de modelos retorna { modelos: [...] }
        setModelos(data && Array.isArray(data.modelos) ? data.modelos : []);
      })
      .catch(() => setModelos([]))
      .finally(() => setLoadingModelos(false));
  }, [tipo, marcaSelecionada]);

  // ── Efeito: buscar anos quando modelo muda ────────────────────────────

  useEffect(() => {
    if (!tipo || !marcaSelecionada || !modeloSelecionado) return;

    setAnos([]);
    setAnoSelecionado("");
    setAnoNome("");
    setValorFipe(null);

    const fipeTipo = toFipeTipo(tipo);
    setLoadingAnos(true);

    fetch(
      `${FIPE_BASE}/${fipeTipo}/marcas/${marcaSelecionada}/modelos/${modeloSelecionado}/anos`
    )
      .then((r) => r.json())
      .then((data) => {
        // BLINDAGEM: Onde o seu código quebrou. Garante o Array.
        setAnos(Array.isArray(data) ? data : []);
      })
      .catch(() => setAnos([]))
      .finally(() => setLoadingAnos(false));
  }, [tipo, marcaSelecionada, modeloSelecionado]);
  
  // ── Efeito: buscar valor FIPE quando ano muda ─────────────────────────

  useEffect(() => {
    if (!tipo || !marcaSelecionada || !modeloSelecionado || !anoSelecionado) return;

    setValorFipe(null);
    const fipeTipo = toFipeTipo(tipo);
    setLoadingValor(true);

    fetch(
      `${FIPE_BASE}/${fipeTipo}/marcas/${marcaSelecionada}/modelos/${modeloSelecionado}/anos/${anoSelecionado}`
    )
      .then((r) => r.json())
      .then((data: {
        Valor: string;
        CodigoFipe: string;
        MesReferencia: string;
      }) => {
        setValorFipe({
          valorStr: data.Valor,
          valorFloat: parseFipeValor(data.Valor),
          codigoFipe: data.CodigoFipe,
          mesRef: data.MesReferencia,
        });
      })
      .catch(() => setValorFipe(null))
      .finally(() => setLoadingValor(false));
  }, [tipo, marcaSelecionada, modeloSelecionado, anoSelecionado]);

  // ── Classes reutilizáveis ─────────────────────────────────────────────

  const selectClass = `
    w-full px-4 py-3 rounded-sm border border-border
    bg-surface text-base text-text-high
    focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
    transition-colors duration-150
    disabled:bg-background disabled:text-text-low disabled:cursor-not-allowed
    appearance-none
  `;

  const inputClass = `
    w-full px-4 py-3 rounded-sm border border-border
    bg-surface text-base text-text-high
    placeholder:text-text-low/60
    focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
    transition-colors duration-150
  `;

  const labelClass = "block text-caption font-medium text-text-low mb-1.5";

  // ── Render ────────────────────────────────────────────────────────────

  const formularioCompleto =
    tipo &&
    marcaSelecionada &&
    modeloSelecionado &&
    anoSelecionado &&
    valorFipe &&
    quilometragem;

  return (
    <form action={action} className="space-y-8">

      {/* Feedback global de erro */}
      {state.message && !state.success && (
        <div className="px-4 py-3 rounded-sm text-caption font-medium text-center bg-danger/10 border border-danger/30 text-danger">
          {state.message}
        </div>
      )}

      {/* ── ETAPA 1: Tipo de Veículo ─────────────────────────── */}
        <div className="animate-fade-in mb-10">
          <label className="block text-caption font-semibold text-text-high mb-3">
            Qual é o tipo do veículo?
          </label>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {(["CARRO", "MOTO", "CAMINHAO"] as TipoVeiculo[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipo(t)}
                className={`
                  flex flex-col items-center
                  rounded-xl border-2 font-semibold
                  transition-all duration-200 cursor-pointer
                  hover:scale-[1.03] shadow-sm hover:shadow-md
                  py-4 px-3 gap-2 text-xs
                  ${tipo === t
                    ? "border-primary bg-primary/10 text-primary scale-[1.03]"
                    : "border-border bg-surface text-text-low hover:border-primary/40 hover:bg-background"
                  }
                `}
              >
                {t === "CARRO" && (
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M19 11l-1.5-4h-11L5 11h14z" />
                    <path d="M19 13H5v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-1h6v1a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4z" />
                  </svg>
                )}
                {t === "MOTO" && (
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M11 9H8l-1 2h7" />
                    <circle cx="5.5" cy="17" r="2.5" />
                    <circle cx="18.5" cy="17" r="2.5" />
                    <path d="M3.5 17h17M13 5.5l2 2" />
                  </svg>
                )}
                {t === "CAMINHAO" && (
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 4h14a1 1 0 0 1 1 1v8H4V5a1 1 0 0 1 1-1z" />
                    <path d="M3 13h18v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3z" />
                    <circle cx="7" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                    <path d="M7 8h10" />
                  </svg>
                )}
                {t === "CARRO" ? "Carro" : t === "MOTO" ? "Moto" : "Caminhão"}
              </button>
            ))}
          </div>
        </div>

      {/* ── ETAPA 2: Marca ───────────────────────────────────── */}
      {tipo && (
        <div className="animate-fade-in">
          <label htmlFor="marca-select" className={labelClass}>Marca</label>
          {loadingMarcas ? (
            <Spinner text="Buscando marcas..." />
          ) : (
            <div className="relative">
              <select
                id="marca-select"
                value={marcaSelecionada}
                onChange={(e) => {
                  setMarcaSelecionada(e.target.value);
                  setMarcaNome(e.target.options[e.target.selectedIndex].text);
                }}
                className={selectClass}
                disabled={marcas.length === 0}
              >
                <option value="">Selecione a marca</option>
                {marcas.map((m) => (
                  <option key={m.codigo} value={m.codigo}>
                    {m.nome}
                  </option>
                ))}
              </select>
              <ChevronIcon />
            </div>
          )}
          {state.errors?.marca && (
            <p className="mt-1 text-caption text-danger">{state.errors.marca[0]}</p>
          )}
        </div>
      )}

      {/* ── ETAPA 3: Modelo ──────────────────────────────────── */}
      {marcaSelecionada && (
        <div className="animate-fade-in">
          <label htmlFor="modelo-select" className={labelClass}>Modelo</label>
          {loadingModelos ? (
            <Spinner text="Buscando modelos..." />
          ) : (
            <div className="relative">
              <select
                id="modelo-select"
                value={modeloSelecionado}
                onChange={(e) => {
                  setModeloSelecionado(e.target.value);
                  setModeloNome(e.target.options[e.target.selectedIndex].text);
                }}
                className={selectClass}
                disabled={modelos.length === 0}
              >
                <option value="">Selecione o modelo</option>
                {modelos.map((m) => (
                  <option key={m.codigo} value={String(m.codigo)}>
                    {m.nome}
                  </option>
                ))}
              </select>
              <ChevronIcon />
            </div>
          )}
          {state.errors?.modelo && (
            <p className="mt-1 text-caption text-danger">{state.errors.modelo[0]}</p>
          )}
        </div>
      )}

      {/* ── ETAPA 4: Ano ─────────────────────────────────────── */}
      {modeloSelecionado && (
        <div className="animate-fade-in">
          <label htmlFor="ano-select" className={labelClass}>Ano / Combustível</label>
          {loadingAnos ? (
            <Spinner text="Buscando anos..." />
          ) : (
            <div className="relative">
              <select
                id="ano-select"
                value={anoSelecionado}
                onChange={(e) => {
                  setAnoSelecionado(e.target.value);
                  setAnoNome(e.target.options[e.target.selectedIndex].text);
                }}
                className={selectClass}
                disabled={anos.length === 0}
              >
                <option value="">Selecione o ano</option>
                {anos.map((a) => (
                  <option key={a.codigo} value={a.codigo}>
                    {a.nome}
                  </option>
                ))}
              </select>
              <ChevronIcon />
            </div>
          )}
          {state.errors?.ano && (
            <p className="mt-1 text-caption text-danger">{state.errors.ano[0]}</p>
          )}
        </div>
      )}

      {/* ── ETAPA 5: Valor FIPE (somente leitura) ───────────── */}
      {anoSelecionado && (
        <div className="animate-fade-in">
          {loadingValor ? (
            <Spinner text="Consultando Tabela FIPE..." />
          ) : valorFipe ? (
            <div className="
              flex items-center justify-between
              bg-primary/5 border border-primary/20 rounded-md px-5 py-4
            ">
              <div>
                <p className="text-caption text-text-low">Valor estimado (Tabela FIPE)</p>
                <p className="text-heading-1 font-bold text-primary mt-0.5">
                  {valorFipe.valorStr}
                </p>
                <p className="text-caption text-text-low/70 mt-0.5">
                  Referência: {valorFipe.mesRef} · Código {valorFipe.codigoFipe}
                </p>
              </div>
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary/40 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
          ) : null}
        </div>
      )}

      {/* ── ETAPA 6: Quilometragem ────────────────────────────── */}
      {valorFipe && (
        <div className="animate-fade-in">
          <label htmlFor="quilometragem" className={labelClass}>
            Quilometragem atual (hodômetro)
          </label>
          <div className="relative">
            <input
              id="quilometragem"
              name="quilometragem"
              type="number"
              inputMode="numeric"
              min="0"
              max="2000000"
              placeholder="Ex: 45000"
              value={quilometragem}
              onChange={(e) => setQuilometragem(e.target.value)}
              required
              className={`${inputClass} pr-12`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-caption text-text-low font-medium">
              km
            </span>
          </div>
          {state.errors?.quilometragem && (
            <p className="mt-1 text-caption text-danger">{state.errors.quilometragem[0]}</p>
          )}
        </div>
      )}

      {/* ── Campos hidden para a Server Action ───────────────── */}
      {tipo && <input type="hidden" name="tipo" value={tipo} />}
      {marcaNome && <input type="hidden" name="marca" value={marcaNome} />}
      {modeloNome && <input type="hidden" name="modelo" value={modeloNome} />}
      {anoNome && <input type="hidden" name="ano" value={anoNome} />}
      {valorFipe && (
        <>
          <input type="hidden" name="codigoFipe" value={valorFipe.codigoFipe} />
          <input type="hidden" name="valorFipeAtual" value={String(valorFipe.valorFloat)} />
        </>
      )}

      {/* ── Botão de submit ───────────────────────────────────── */}
      {formularioCompleto && (
        <div className="animate-fade-in pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="
              w-full py-3.5 rounded-full
              bg-primary text-white text-base font-semibold
              hover:bg-primary-hover
              disabled:opacity-60 disabled:cursor-not-allowed
              shadow-sm hover:shadow-md
              transition-all duration-150 cursor-pointer
            "
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Salvando...
              </span>
            ) : (
              "Salvar Veículo"
            )}
          </button>
        </div>
      )}
    </form>
  );
}

// ── Ícone de chevron para selects ─────────────────────────────────────────
function ChevronIcon() {
  return (
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-low">
      <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor">
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    </span>
  );
}