// src/app/relatorio/loading.tsx
export default function RelatorioLoading() {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-0.5 z-[60] bg-primary/15 overflow-hidden">
        <div className="h-full w-1/3 bg-primary animate-pulse" />
      </div>

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
          {/* Breadcrumb + título */}
          <div className="mb-8">
            <div className="h-3 w-40 rounded-full bg-border/70 animate-pulse mb-3" />
            <div className="h-8 w-72 rounded-md bg-border animate-pulse mb-2" />
            <div className="h-3 w-96 max-w-full rounded-full bg-border/70 animate-pulse" />
          </div>

          <div className="space-y-10">
            {/* Card de simulação (KM Mensal / Orçamento) */}
            <div className="bg-surface rounded-2xl border border-border p-6 md:p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="h-3 w-40 rounded-full bg-border/70 animate-pulse" />
                  <div className="h-12 w-full rounded-lg bg-border animate-pulse" />
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-44 rounded-full bg-border/70 animate-pulse" />
                  <div className="h-12 w-full rounded-lg bg-border animate-pulse" />
                </div>
              </div>
            </div>

            {/* Cards de KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="bg-surface p-6 rounded-xl border border-border">
                  <div className="h-2.5 w-24 rounded-full bg-border/70 animate-pulse mb-3" />
                  <div className="h-6 w-20 rounded-md bg-border animate-pulse" />
                </div>
              ))}
            </div>

            {/* Gráfico + Detalhamento */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Donut skeleton */}
              <div className="lg:col-span-5 bg-surface p-8 rounded-2xl border border-border flex flex-col items-center">
                <div className="h-3 w-40 rounded-full bg-border/70 animate-pulse mb-8 self-start" />
                <div className="w-56 h-56 rounded-full border-[16px] border-border animate-pulse" />
                <div className="mt-8 flex flex-wrap gap-3 justify-center w-full">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-3 w-16 rounded-full bg-border/70 animate-pulse" />
                  ))}
                </div>
              </div>

              {/* Accordions skeleton */}
              <div className="lg:col-span-7 space-y-4">
                <div className="h-3 w-48 rounded-full bg-border/70 animate-pulse mb-4" />
                {[0, 1, 2].map((i) => (
                  <div key={i} className="bg-surface rounded-xl border border-border p-5">
                    <div className="h-4 w-36 rounded-md bg-border animate-pulse mb-2.5" />
                    <div className="flex gap-3">
                      <div className="h-4 w-20 rounded-md bg-border/70 animate-pulse" />
                      <div className="h-4 w-20 rounded-md bg-border/70 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botão exportar */}
            <div className="pt-8 border-t border-border flex justify-end">
              <div className="h-12 w-64 rounded-xl bg-border animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}