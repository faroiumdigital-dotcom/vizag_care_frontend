import type { ReactNode } from "react";

export interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
  emergency?: boolean;
  error?: boolean;
}

// Turns **bold** into <strong> and keeps line breaks. Nothing else is interpreted.
function renderText(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? <strong key={i}>{part.slice(2, -2)}</strong> : part
  );
}

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const base = "max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-[15px] leading-relaxed shadow-sm";
  const style = isUser
    ? "bg-bubble-user rounded-br-sm"
    : message.emergency
      ? "bg-white rounded-bl-sm border-l-4 border-alert"
      : message.error
        ? "bg-white rounded-bl-sm text-alert"
        : "bg-white rounded-bl-sm";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`${base} ${style}`}>{renderText(message.text)}</div>
    </div>
  );
}
