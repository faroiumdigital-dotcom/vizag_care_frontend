interface Props { emergencyNumber: string }

export default function Header({ emergencyNumber }: Props) {
  const tel = emergencyNumber.replace(/[^\d+]/g, "");
  return (
    <header className="flex items-center gap-3 bg-gradient-to-r from-brand to-[#4a9488] px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] text-white">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/95 text-base font-semibold text-brand shadow-sm" aria-hidden="true">
        VC
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold leading-tight">Vizag Care Hospital</h1>
        <p className="flex items-center gap-1.5 truncate text-xs text-white/85">
          <span className="inline-block h-2 w-2 rounded-full bg-[#9be3c4]" aria-hidden="true" />
          Here to help, anytime
        </p>
      </div>
      <a
        href={`tel:${tel}`}
        className="shrink-0 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-alert shadow-sm hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Emergency
      </a>
    </header>
  );
}
