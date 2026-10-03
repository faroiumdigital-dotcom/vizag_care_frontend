interface Props {
  options: string[];
  onPick: (label: string) => void;
  disabled: boolean;
  label?: string;
}

export default function QuickReplies({ options, onPick, disabled, label }: Props) {
  if (!options.length) return null;
  return (
    <div className="fade-in pl-9 pt-1">
      {label && <p className="pb-1.5 text-xs text-ink/55">{label}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            disabled={disabled}
            onClick={() => onPick(o)}
            className="rounded-full border border-brand/30 bg-white px-3.5 py-1.5 text-sm text-brand transition-colors hover:border-brand hover:bg-brand-soft disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
