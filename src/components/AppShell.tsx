interface AppShellProps {
  header: React.ReactNode;
  center: React.ReactNode;
  objects: React.ReactNode;
  bar: React.ReactNode;
}

export function AppShell({ header, center, objects, bar }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-shrink-0 px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Capsule Guide</h1>
          {header}
        </div>
      </div>

      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 pb-28 pt-4">
        <div className="flex flex-col items-center gap-8">{center}</div>
        {objects}
      </main>

      {bar}
    </div>
  );
}
