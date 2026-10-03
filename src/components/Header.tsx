interface Props { emergencyNumber: string }

export default function Header({ emergencyNumber }: Props) {
  const tel = emergencyNumber.replace(/[^\d+]/g, "");
  return (
    <header className="flex items-center gap-3 bg-brand px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] text-white">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-lg font-semibold text-brand" aria-hidden="true">
        VC
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold leading-tight">Vizag Care Hospital</h1>
        <p className="truncate text-xs text-white/80">Virtual assistant</p>
      </div>
      <a
        href={`tel:${tel}`}
        className="shrink-0 rounded-full bg-alert px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Call Emergency
      </a>
    </header>
  );
}
