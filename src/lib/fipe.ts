// src/lib/fipe.ts
// Camada de serviço para a API FIPE (Parallelum / Brasil API)
// Isolada aqui para facilitar troca de provedor ou adicionar cache futuro
//
// Documentação: https://deividfortuna.github.io/fipe/
// Base URL: https://parallelum.com.br/fipe/api/v1

const FIPE_BASE = "https://parallelum.com.br/fipe/api/v1";

// ── Tipos ────────────────────────────────────────────────────────────────

export type TipoFipe = "carros" | "motos";

export interface FipeMarca {
  codigo: string;
  nome: string;
}

export interface FipeModelo {
  codigo: number;
  nome: string;
}

export interface FipeAno {
  codigo: string; // ex: "2021-1"
  nome: string;   // ex: "2021 Gasolina"
}

export interface FipeValor {
  TipoVeiculo: number;
  Valor: string;           // ex: "R$ 45.000,00"
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  SiglaCombustivel: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────

async function fipeFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${FIPE_BASE}${path}`, {
    // Sem cache para garantir dados atualizados da tabela FIPE
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`FIPE API error: ${res.status} ${res.statusText} — ${path}`);
  }
  return res.json() as Promise<T>;
}

// ── Funções exportadas ────────────────────────────────────────────────────

export function getMarcas(tipo: TipoFipe): Promise<FipeMarca[]> {
  return fipeFetch<FipeMarca[]>(`/${tipo}/marcas`);
}

export function getModelos(
  tipo: TipoFipe,
  codigoMarca: string
): Promise<{ modelos: FipeModelo[]; anos: FipeAno[] }> {
  return fipeFetch<{ modelos: FipeModelo[]; anos: FipeAno[] }>(
    `/${tipo}/marcas/${codigoMarca}/modelos`
  );
}

export function getAnos(
  tipo: TipoFipe,
  codigoMarca: string,
  codigoModelo: string
): Promise<FipeAno[]> {
  return fipeFetch<FipeAno[]>(
    `/${tipo}/marcas/${codigoMarca}/modelos/${codigoModelo}/anos`
  );
}

export function getValor(
  tipo: TipoFipe,
  codigoMarca: string,
  codigoModelo: string,
  codigoAno: string
): Promise<FipeValor> {
  return fipeFetch<FipeValor>(
    `/${tipo}/marcas/${codigoMarca}/modelos/${codigoModelo}/anos/${codigoAno}`
  );
}

// ── Conversor: "R$ 45.000,00" → 45000 (Float para o banco) ──────────────
export function parseFipeValor(valorStr: string): number {
  return parseFloat(
    valorStr
      .replace("R$", "")
      .trim()
      .replace(/\./g, "")
      .replace(",", ".")
  );
}
