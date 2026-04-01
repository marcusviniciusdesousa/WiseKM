// src/app/perfil/PerfilClient.tsx
"use client";

import { useActionState, useState, useEffect } from "react";
import Link from "next/link";
import { atualizarDados, atualizarSenha, deletarContaComSenha, type PerfilActionResult } from "@/actions/perfil.actions";

interface Usuario { id: string; nome: string; email: string; cpf: string; }

export function PerfilClient({ usuario }: { usuario: Usuario }) {
  const [editandoDados, setEditandoDados] = useState(false);
  const [editandoSenha, setEditandoSenha] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [mensagemGlobal, setMensagemGlobal] = useState<{ texto: string; tipo: "success" | "error" } | null>(null);

  const [dadosState, actionDados, isPendingDados] = useActionState(atualizarDados, { success: false, message: "" });
  const [senhaState, actionSenha, isPendingSenha] = useActionState(atualizarSenha, { success: false, message: "" });
  const [deleteState, actionDelete, isPendingDelete] = useActionState(deletarContaComSenha, { success: false, message: "" });

  // Limpa a notificação automaticamente após 5 segundos
  useEffect(() => {
    if (mensagemGlobal) {
      const timer = setTimeout(() => setMensagemGlobal(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensagemGlobal]);

  // Olheiro do formulário de DADOS
  useEffect(() => {
    if (dadosState.message) {
      setMensagemGlobal({ texto: dadosState.message, tipo: dadosState.success ? "success" : "error" });
      if (dadosState.success) setEditandoDados(false);
    }
  }, [dadosState]);

  // Olheiro do formulário de SENHA
  useEffect(() => {
    if (senhaState.message) {
      setMensagemGlobal({ texto: senhaState.message, tipo: senhaState.success ? "success" : "error" });
      if (senhaState.success) setEditandoSenha(false);
    }
  }, [senhaState]);

  // Olheiro do modal de EXCLUIR CONTA
  useEffect(() => {
    if (deleteState.message) {
      setMensagemGlobal({ texto: deleteState.message, tipo: deleteState.success ? "success" : "error" });
      if (!deleteState.success) setModalExcluir(false); // Fecha o modal imediatamente se errar a senha
    }
  }, [deleteState]);

  const inputBase = "w-full px-4 py-3 rounded-md border border-border text-base text-text-high bg-surface placeholder:text-text-low/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors disabled:bg-background disabled:text-text-low disabled:cursor-not-allowed cursor-text";
  const labelClass = "block text-caption font-medium text-text-low mb-1.5";

  return (
    <div className="flex flex-col gap-8 relative">
      
      {/* ── NOTIFICAÇÃO FLUTUANTE (TOAST TRANSLÚCIDO) ──────────────────────── */}
      {mensagemGlobal && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 rounded-full shadow-lg backdrop-blur-md border animate-slide-down flex items-center gap-3 transition-all ${
          mensagemGlobal.tipo === "success" 
            ? "bg-success/70 border-success/30 text-white" 
            : "bg-danger/80 border-danger/30 text-white"
        }`}>
          <span className="text-base">{mensagemGlobal.tipo === "success" ? "✅" : "⚠️"}</span>
          <span className="text-caption font-semibold tracking-wide drop-shadow-sm">{mensagemGlobal.texto}</span>
        </div>
      )}

      <Link href="/dashboard" className="text-caption font-medium text-text-low hover:text-primary transition-colors flex items-center gap-2 w-fit cursor-pointer">
        ← Voltar para o Dashboard
      </Link>

      {/* ── SEÇÃO 1: DADOS PESSOAIS ────────────────────────────────────────── */}
      <section className="bg-surface rounded-xl border border-border shadow-sm p-8">
        <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
          <div>
            <h2 className="text-heading-2 font-bold text-text-high">Informações Pessoais</h2>
            <p className="text-caption text-text-low">Gerencie seus dados de contato e identidade.</p>
          </div>
          {!editandoDados && (
            <button onClick={() => setEditandoDados(true)} className="px-4 py-2 rounded-full text-caption font-semibold bg-background text-text-high hover:bg-border/50 transition-colors cursor-pointer">
              Editar Dados
            </button>
          )}
        </div>

        {editandoDados ? (
          <form action={actionDados} className="animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label className={labelClass}>Nome Completo</label>
                <input name="nome" type="text" defaultValue={usuario.nome} required className={inputBase} />
                {dadosState.errors?.nome && <p className="mt-1 text-caption text-danger">{dadosState.errors.nome[0]}</p>}
              </div>
              <div>
                <label className={labelClass}>CPF <span className="text-primary">(Não Editável)</span></label>
                <input type="text" value={usuario.cpf} disabled className={inputBase} />
              </div>
            </div>
            <div className="mb-6">
              <label className={labelClass}>E-mail</label>
              <input name="email" type="email" defaultValue={usuario.email} required className={inputBase} />
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setEditandoDados(false)} className="px-5 py-2.5 rounded-full text-caption font-semibold text-text-low hover:bg-background cursor-pointer">Cancelar</button>
              <button type="submit" disabled={isPendingDados} className="px-5 py-2.5 rounded-full text-caption font-semibold bg-primary text-white hover:bg-primary-hover shadow-sm disabled:opacity-50 cursor-pointer">
                {isPendingDados ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
            <DataField label="Nome Completo" value={usuario.nome} />
            <DataField label="CPF" value={usuario.cpf} />
            <DataField label="E-mail" value={usuario.email} />
          </div>
        )}
      </section>

      {/* ── SEÇÃO 2: SEGURANÇA ─────────────────────────────────────────────── */}
      <section className="bg-surface rounded-xl border border-border shadow-sm p-8">
        <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
          <div>
            <h2 className="text-heading-2 font-bold text-text-high">Segurança</h2>
            <p className="text-caption text-text-low">Mantenha sua conta protegida alterando sua senha regularmente.</p>
          </div>
          {!editandoSenha && (
            <button onClick={() => setEditandoSenha(true)} className="px-4 py-2 rounded-full text-caption font-semibold bg-background text-text-high hover:bg-border/50 transition-colors cursor-pointer">
              Alterar Senha
            </button>
          )}
        </div>

        {editandoSenha ? (
          <form action={actionSenha} className="animate-fade-in">
            
            <div className="mb-6 bg-background/50 p-5 rounded-lg border border-border/50">
              <label className={labelClass}>Senha Atual</label>
              <input name="senhaAtual" type="password" placeholder="Sua senha atual" required className={inputBase} />
              {senhaState.errors?.senhaAtual && <p className="mt-1 text-caption text-danger">{senhaState.errors.senhaAtual[0]}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label className={labelClass}>Nova Senha</label>
                <input name="novaSenha" type="password" placeholder="Mínimo 8 caracteres" required className={inputBase} />
                {senhaState.errors?.novaSenha && <p className="mt-1 text-caption text-danger">{senhaState.errors.novaSenha[0]}</p>}
              </div>
              <div>
                <label className={labelClass}>Confirme a Nova Senha</label>
                <input name="confirmarSenha" type="password" placeholder="Repita a senha" required className={inputBase} />
                {senhaState.errors?.confirmarSenha && <p className="mt-1 text-caption text-danger">{senhaState.errors.confirmarSenha[0]}</p>}
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setEditandoSenha(false)} className="px-5 py-2.5 rounded-full text-caption font-semibold text-text-low hover:bg-background cursor-pointer">Cancelar</button>
              <button type="submit" disabled={isPendingSenha} className="px-5 py-2.5 rounded-full text-caption font-semibold bg-primary text-white hover:bg-primary-hover shadow-sm disabled:opacity-50 cursor-pointer">
                {isPendingSenha ? "Atualizando..." : "Atualizar Senha"}
              </button>
            </div>
          </form>
        ) : (
          <div className="animate-fade-in">
            <p className="text-base text-text-high">••••••••</p>
          </div>
        )}
      </section>

      {/* ── SEÇÃO 3: ZONA DE PERIGO ────────────────────────────────────────── */}
      <section className="bg-danger/5 rounded-xl border border-danger/20 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-heading-2 font-bold text-danger">Excluir Conta</h2>
          <p className="text-caption text-danger/80 mt-1">Ao excluir sua conta, todos os seus dados serão apagados permanentemente.</p>
        </div>
        <button onClick={() => setModalExcluir(true)} className="px-5 py-2.5 rounded-full text-caption font-semibold bg-danger text-white hover:bg-danger-hover shadow-sm transition-colors shrink-0 cursor-pointer">
          Excluir minha conta
        </button>
      </section>

      {/* ── MODAL DE EXCLUSÃO CUSTOMIZADO ─────────────────────────────────── */}
      {modalExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface rounded-xl shadow-2xl w-full max-w-md p-8 border border-border animate-slide-down">
            <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-heading-1 font-bold text-text-high mb-2">Excluir Conta Definitivamente?</h3>
            <p className="text-base text-text-low mb-6">
              Esta ação <strong>não pode ser desfeita</strong>. Para confirmar que você é o dono desta conta, por favor, digite sua senha de acesso abaixo.
            </p>
            
            <form action={actionDelete}>
              <input name="senhaExclusao" type="password" placeholder="Sua senha atual" required className={inputBase} />
              
              <div className="flex gap-3 justify-end mt-8">
                <button type="button" onClick={() => setModalExcluir(false)} className="px-5 py-2.5 rounded-full text-caption font-semibold text-text-low hover:bg-background cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" disabled={isPendingDelete} className="px-5 py-2.5 rounded-full text-caption font-semibold bg-danger text-white hover:bg-danger-hover shadow-sm disabled:opacity-50 cursor-pointer">
                  {isPendingDelete ? "Excluindo..." : "Sim, excluir conta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-caption text-text-low mb-1">{label}</p>
      <p className="text-base text-text-high font-medium">{value}</p>
    </div>
  );
}