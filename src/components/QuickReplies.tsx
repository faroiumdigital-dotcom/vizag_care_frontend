interface Props {
  options: string[];
  onPick: (label: string) => void;
  disabled: boolean;
}

export default function QuickReplies({ options, onPick, disabled }: Props) {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          disabled={disabled}
          onClick={() => onPick(o)}
          className="rounded-full border border-brand bg-white px-3.5 py-1.5 text-sm font-medium text-brand hover:bg-brand hover:text-white disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {o}
        </button>
      ))}
    </div>
  );
}
