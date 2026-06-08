interface HeaderStatusProps {
  dbKind: string;
  helloCount: number;
  uptimeSeconds: number;
}

export function HeaderStatus({ dbKind, helloCount, uptimeSeconds }: HeaderStatusProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <span className="rounded-full bg-slate-100 px-3 py-1 font-medium capitalize">
        {dbKind}
      </span>
      <span className="rounded-full bg-slate-100 px-3 py-1 font-medium">
        {helloCount} hellos
      </span>
      <span className="rounded-full bg-slate-100 px-3 py-1 font-mono">
        uptime {uptimeSeconds}s
      </span>
    </div>
  );
}
