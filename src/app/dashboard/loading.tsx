// src/app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <>
      {/* Barra de progresso sutil no topo — feedback imediato de transição de rota */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-[60] bg-primary/15 overflow-hidden">
        <div className="h-full w-1/3 bg-primary animate-pulse" />
      </div>

      {/* Skeleton do Header — evita layout shift enquanto o Header (Server Component) resolve auth() */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border/60 shadow-header">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/20 animate-pulse" />
            <div className="h-4 w-20 rounded-full bg-border animate-pulse" />
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="h-3 w-14 rounded-full bg-border animate-pulse" />
            <div className="h-3 w-20 rounded-full bg-border animate-pulse" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-20 rounded-full bg-border animate-pulse" />
            <div className="w-9 h-9 rounded-full bg-primary/20 animate-pulse" />
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-background py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Título "Visão Geral" */}
          <div className="h-10 w-56 rounded-md bg-border/70 animate-pulse mb-8" />

          {/* Card principal do veículo */}
          <section className="bg-surface rounded-xl border border-border shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-7 w-24 rounded-full bg-border animate-pulse" />
              <div className="h-4 w-10 rounded-full bg-border/70 animate-pulse" />
            </div>
            <div className="h-10 w-2/3 rounded-md bg-border animate-pulse mb-3" />
            <div className="h-10 w-1/2 rounded-md bg-border animate-pulse mb-8" />
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border">
              <div>
                <div className="h-3 w-32 rounded-full bg-border/70 animate-pulse mb-2" />
                <div className="h-6 w-24 rounded-md bg-border animate-pulse" />
              </div>
              <div>
                <div className="h-3 w-28 rounded-full bg-border/70 animate-pulse mb-2" />
                <div className="h-6 w-20 rounded-md bg-border animate-pulse" />
              </div>
            </div>
          </section>

          {/* Painel de ações */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col p-6 bg-surface rounded-xl border border-border shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary/10 animate-pulse mb-4" />
                <div className="h-4 w-32 rounded-md bg-border animate-pulse mb-2" />
                <div className="h-3 w-40 rounded-full bg-border/70 animate-pulse" />
              </div>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}