// src/app/custos/loading.tsx
export default function CustosLoading() {
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
            <div className="h-3 w-44 rounded-full bg-border/70 animate-pulse mb-3" />
            <div className="h-8 w-64 rounded-md bg-border animate-pulse mb-2" />
            <div className="h-3 w-80 max-w-full rounded-full bg-border/70 animate-pulse" />
          </div>

          {/* Centro de comando (botões) */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-surface p-4 rounded-xl border border-border shadow-sm">
            <div className="flex w-full sm:w-auto gap-3">
              <div className="h-10 w-32 rounded-full bg-border animate-pulse" />
              <div className="h-10 w-36 rounded-full bg-border animate-pulse" />
            </div>
            <div className="flex w-full sm:w-auto gap-3">
              <div className="h-10 w-40 rounded-full bg-border animate-pulse" />
            </div>
          </div>

          {/* Categorias com itens */}
          <div className="space-y-6">
            {[0, 1, 2].map((cat) => (
              <div key={cat} className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="w-full px-6 py-4 bg-background border-b border-border flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-32 rounded-md bg-border animate-pulse" />
                    <div className="h-4 w-14 rounded-full bg-border/70 animate-pulse" />
                  </div>
                  <div className="h-4 w-4 rounded-full bg-border/70 animate-pulse" />
                </div>
                <div className="divide-y divide-border">
                  {[0, 1].map((item) => (
                    <div key={item} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                      <div className="flex-1">
                        <div className="h-4 w-40 rounded-md bg-border animate-pulse mb-2.5" />
                        <div className="h-3 w-24 rounded-full bg-border/70 animate-pulse" />
                      </div>
                      <div className="h-6 w-20 rounded-md bg-border animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}