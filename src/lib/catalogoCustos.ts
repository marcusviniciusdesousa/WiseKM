// src/lib/catalogoCustos.ts

export type CategoriaCatalogo = "MANUTENCAO" | "DOCUMENTACAO" | "SEGURO" | "CONSUMIVEL" | "OUTROS";
export type TipoVeiculo = "CARRO" | "MOTO" | "CAMINHAO";

export interface ItemCatalogo {
  idItem: string;
  nome: string;
  categoria: CategoriaCatalogo;
  sugestaoDurabilidadeKm?: number;
  sugestaoDurabilidadeMeses?: number;
  aplicavelA: TipoVeiculo[]; 
}

export const CATALOGO_MESTRE: ItemCatalogo[] = [
  // ── Consumíveis Frequentes (Combustível e Fluidos) ───────────────────────
  { idItem: "combustivel", nome: "Combustível (Gasolina/Etanol/Diesel)", categoria: "CONSUMIVEL", sugestaoDurabilidadeKm: 10, aplicavelA: ["CARRO", "MOTO", "CAMINHAO"] },
  { idItem: "oleo_motor", nome: "Óleo do Motor", categoria: "CONSUMIVEL", sugestaoDurabilidadeKm: 10000, sugestaoDurabilidadeMeses: 12, aplicavelA: ["CARRO", "MOTO", "CAMINHAO"] },
  { idItem: "aditivo_radiador", nome: "Aditivo do Radiador (Arrefecimento)", categoria: "CONSUMIVEL", sugestaoDurabilidadeKm: 30000, sugestaoDurabilidadeMeses: 24, aplicavelA: ["CARRO", "MOTO", "CAMINHAO"] },
  
  // ── Manutenção Preventiva (Itens Comuns e "Esquecidos") ──────────────────
  { idItem: "pneu_carro", nome: "Pneus (Jogo/Par)", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 40000, aplicavelA: ["CARRO"] },
  { idItem: "pneu_moto", nome: "Pneus (Kit Traseiro/Dianteiro)", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 15000, aplicavelA: ["MOTO"] },
  { idItem: "pneu_caminhao", nome: "Pneus (Eixos/Recapagem)", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 60000, aplicavelA: ["CAMINHAO"] },
  { idItem: "alinhamento_balanceamento", nome: "Alinhamento e Balanceamento", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 10000, sugestaoDurabilidadeMeses: 6, aplicavelA: ["CARRO", "CAMINHAO"] },
  { idItem: "bateria", nome: "Bateria (12v/24v)", categoria: "MANUTENCAO", sugestaoDurabilidadeMeses: 24, aplicavelA: ["CARRO", "MOTO", "CAMINHAO"] },
  { idItem: "pastilha_freio", nome: "Pastilhas de Freio", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 25000, aplicavelA: ["CARRO", "MOTO", "CAMINHAO"] },
  { idItem: "disco_freio", nome: "Discos de Freio", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 50000, aplicavelA: ["CARRO", "MOTO", "CAMINHAO"] },
  { idItem: "fluido_freio", nome: "Troca do Fluido de Freio", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 40000, sugestaoDurabilidadeMeses: 24, aplicavelA: ["CARRO", "MOTO", "CAMINHAO"] },
  { idItem: "velas_ignicao", nome: "Velas de Ignição", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 40000, aplicavelA: ["CARRO", "MOTO"] },
  { idItem: "cabos_vela", nome: "Cabos de Vela", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 60000, aplicavelA: ["CARRO"] },
  { idItem: "amortecedores", nome: "Amortecedores (Kit Suspensão)", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 80000, aplicavelA: ["CARRO", "CAMINHAO"] },
  { idItem: "revisao", nome: "Revisão do Veículo", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 5000, aplicavelA: ["CARRO", "MOTO", "CAMINHAO"] },
  { idItem: "arla_32", nome: "Arla 32", categoria: "CONSUMIVEL", sugestaoDurabilidadeKm: 1000, aplicavelA: ["CAMINHAO"] },
  { idItem: "filtro_oleo", nome: "Filtro de Óleo", categoria: "CONSUMIVEL", sugestaoDurabilidadeKm: 10000, sugestaoDurabilidadeMeses: 12, aplicavelA: ["CARRO", "MOTO", "CAMINHAO"] },
  { idItem: "filtro_combustivel", nome: "Filtro de Combustível", categoria: "CONSUMIVEL", sugestaoDurabilidadeKm: 15000, sugestaoDurabilidadeMeses: 12, aplicavelA: ["CARRO", "MOTO", "CAMINHAO"] },
  { idItem: "filtro_ar", nome: "Filtro de Ar do Motor", categoria: "CONSUMIVEL", sugestaoDurabilidadeKm: 20000, sugestaoDurabilidadeMeses: 12, aplicavelA: ["CARRO", "MOTO", "CAMINHAO"] },
  { idItem: "filtro_cabine", nome: "Filtro de Cabine (Ar-Condicionado)", categoria: "CONSUMIVEL", sugestaoDurabilidadeKm: 15000, sugestaoDurabilidadeMeses: 12, aplicavelA: ["CARRO", "CAMINHAO"] },
  
  // ── Manutenção Mecânica Pesada ───────────────────────────────────────────
  { idItem: "correia_dentada", nome: "Correia Dentada e Tensor", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 60000, aplicavelA: ["CARRO"] },
  { idItem: "correia_polyv", nome: "Correia do Alternador (Poly-V)", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 60000, aplicavelA: ["CARRO", "CAMINHAO"] },
  { idItem: "oleo_cambio_manual", nome: "Óleo de Câmbio (Manual)", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 80000, aplicavelA: ["CARRO", "CAMINHAO"] },
  { idItem: "oleo_cambio_auto", nome: "Óleo de Câmbio (Automático)", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 60000, aplicavelA: ["CARRO", "CAMINHAO"] },
  { idItem: "embreagem", nome: "Embreagem", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 100000, aplicavelA: ["CARRO", "CAMINHAO", "MOTO"] },
  { idItem: "kit_cabos", nome: "Kit dos Cabos (Embreagem/Acelerador)", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 100000, aplicavelA: ["CARRO", "CAMINHAO", "MOTO"] },

  // ── Específicos Moto ─────────────────────────────────────────────────────
  { idItem: "kit_relacao", nome: "Kit Relação (Coroa/Corrente/Pinhão)", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 20000, aplicavelA: ["MOTO"] },
  { idItem: "oleo_bengala", nome: "Óleo da Bengala (Suspensão)", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 24000, aplicavelA: ["MOTO"] },

  // ── Específicos Caminhão ─────────────────────────────────────────────────
  { idItem: "lonas_freio", nome: "Lonas e Tambores de Freio", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 60000, aplicavelA: ["CAMINHAO"] },
  { idItem: "filtro_secador", nome: "Filtro Secador de Ar (Freios)", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 80000, sugestaoDurabilidadeMeses: 12, aplicavelA: ["CAMINHAO"] },
  { idItem: "bolsas_suspensao", nome: "Bolsas de Ar (Suspensão)", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 150000, aplicavelA: ["CAMINHAO"] },
  { idItem: "oleo_diferencial", nome: "Óleo do Diferencial", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 80000, aplicavelA: ["CAMINHAO"] },
  { idItem: "graxa_chassi", nome: "Lubrificação / Graxa no Chassi", categoria: "MANUTENCAO", sugestaoDurabilidadeKm: 10000, sugestaoDurabilidadeMeses: 3, aplicavelA: ["CAMINHAO"] },
  
  // ── Documentação e Burocracia ────────────────────────────────────────────
  { idItem: "ipva", nome: "IPVA", categoria: "DOCUMENTACAO", sugestaoDurabilidadeMeses: 12, aplicavelA: ["CARRO", "MOTO", "CAMINHAO"] },
  { idItem: "licenciamento", nome: "Licenciamento / DPVAT", categoria: "DOCUMENTACAO", sugestaoDurabilidadeMeses: 12, aplicavelA: ["CARRO", "MOTO", "CAMINHAO"] },
  { idItem: "tacografo", nome: "Aferição do Tacógrafo", categoria: "DOCUMENTACAO", sugestaoDurabilidadeMeses: 24, aplicavelA: ["CAMINHAO"] },
  { idItem: "antt", nome: "Renovação ANTT", categoria: "DOCUMENTACAO", sugestaoDurabilidadeMeses: 60, aplicavelA: ["CAMINHAO"] },
  
  // ── Seguros, Assinaturas e Outros (Custos Fixos/Recorrentes) ─────────────
  { idItem: "seguro", nome: "Seguro Auto / Proteção Veicular", categoria: "SEGURO", sugestaoDurabilidadeMeses: 12, aplicavelA: ["CARRO", "MOTO", "CAMINHAO"] },
  { idItem: "seguro_carga", nome: "Seguro de Carga / RCTR-C", categoria: "SEGURO", sugestaoDurabilidadeMeses: 1, aplicavelA: ["CAMINHAO"] },
  { idItem: "rastreador", nome: "Mensalidade do Rastreador", categoria: "OUTROS", sugestaoDurabilidadeMeses: 1, aplicavelA: ["CARRO", "MOTO", "CAMINHAO"] },
  { idItem: "pedagio_tag", nome: "Mensalidade Tag de Pedágio", categoria: "OUTROS", sugestaoDurabilidadeMeses: 1, aplicavelA: ["CARRO", "CAMINHAO"] },
  { idItem: "lavagem", nome: "Lavagem / Estética Veicular", categoria: "OUTROS", sugestaoDurabilidadeMeses: 1, aplicavelA: ["CARRO", "MOTO", "CAMINHAO"] },
  { idItem: "estacionamento", nome: "Mensalidade Estacionamento", categoria: "OUTROS", sugestaoDurabilidadeMeses: 1, aplicavelA: ["CARRO", "MOTO", "CAMINHAO"] },
];