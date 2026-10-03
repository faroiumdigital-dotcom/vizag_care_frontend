import { useState } from "react";

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
  disclaimer: string;
}

const MAX_CHARS = 500;

export default function InputBar({ onSend, disabled, disclaimer }: Props) {
  const [value, setValue] = useState("");

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  };

  return (
    <div className="bg-white px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] pt-2">
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submit(); } }}
          maxLength={MAX_CHARS}
          placeholder="Type your question"
          aria-label="Type your question"
          className="min-w-0 flex-1 rounded-full bg-chat-bg px-4 py-2.5 text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-brand"
        />
        <button
          type="button"
          onClick={submit}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white hover:bg-brand-dark disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3.4 20.4 21 12 3.4 3.6 3.3 10l12 2-12 2z" />
          </svg>
        </button>
      </div>
      <p className="px-2 pt-1.5 text-center text-[11px] leading-tight text-ink/60">{disclaimer}</p>
    </div>
  );
}
