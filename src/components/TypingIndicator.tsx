export default function TypingIndicator() {
  return (
    <div className="fade-in flex items-end gap-2" role="status" aria-label="Assistant is typing">
      <div className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[11px] font-semibold text-brand" aria-hidden="true">VC</div>
      <div className="flex gap-1.5 rounded-3xl rounded-bl-lg bg-white px-4 py-3.5 shadow-[0_1px_3px_rgba(38,55,58,0.08)]">
        <span className="dot h-2 w-2 rounded-full bg-brand/70" />
        <span className="dot h-2 w-2 rounded-full bg-brand/70" />
        <span className="dot h-2 w-2 rounded-full bg-brand/70" />
      </div>
    </div>
  );
}
