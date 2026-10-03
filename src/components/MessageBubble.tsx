import type { ReactNode } from "react";

export interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
  emergency?: boolean;
  error?: boolean;
  suggestions?: string[];
}

// Turns **bold** into <strong> and keeps line breaks. Nothing else is interpreted.
function renderText(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? <strong key={i}>{part.slice(2, -2)}</strong> : part
  );
}

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const base = "max-w-[82%] whitespace-pre-wrap break-words rounded-3xl px-4 py-2.5 text-[15px] leading-[1.6] shadow-[0_1px_3px_rgba(38,55,58,0.08)]";
  const style = isUser
    ? "bg-bubble-user rounded-br-lg"
    : message.emergency
      ? "bg-white rounded-bl-lg border-l-4 border-alert"
      : message.error
        ? "bg-white rounded-bl-lg text-alert"
        : "bg-white rounded-bl-lg";
  return (
    <div className={`fade-in flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[11px] font-semibold text-brand" aria-hidden="true">
          VC
        </div>
      )}
      <div className={`${base} ${style}`}>{renderText(message.text)}</div>
    </div>
  );
}
