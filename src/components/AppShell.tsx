interface AppShellProps {
  header: React.ReactNode;
  center: React.ReactNode;
  diagram: React.ReactNode;
  trace: React.ReactNode;
  cards: React.ReactNode;
  history: React.ReactNode;
}

export function AppShell({ header, center, diagram, trace, cards, history }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-shrink-0 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Hello</h1>
          {header}
        </div>
      </div>

      <main className="flex flex-1 flex-col items-center gap-8 px-6 pb-16 pt-2">
        <div className="flex flex-col items-center gap-2">{center}</div>
        {diagram}
        {trace}
        {cards}
        {history}
      </main>
    </div>
  );
}
