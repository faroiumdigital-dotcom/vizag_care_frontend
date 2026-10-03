import { useEffect, useRef, useState } from "react";
import { ChatError, FALLBACK_CONFIG, getConfig, loadSessionId, sendMessage, type ChatConfig } from "../api";
import Header from "../components/Header";
import InputBar from "../components/InputBar";
import MessageBubble, { type Message } from "../components/MessageBubble";
import QuickReplies from "../components/QuickReplies";
import TypingIndicator from "../components/TypingIndicator";

// What each quick-reply button actually asks the assistant.
const QUICK_QUESTIONS: Record<string, string> = {
  "Doctors & timings": "Which doctors are available and what are their timings?",
  "Departments": "Which departments do you have?",
  "Health packages": "What health checkup packages do you offer?",
  "Insurance": "Do you accept health insurance?",
  "Emergency": "What is the emergency number?",
  "Location & parking": "Where is the hospital and what are the parking charges?",
};

export default function ChatPage() {
  const [config, setConfig] = useState<ChatConfig>(FALLBACK_CONFIG);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const sessionRef = useRef<string | null>(loadSessionId());
  const nextId = useRef(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  const lastBot = [...messages].reverse().find((m) => m.role === "bot");
  const add = (m: Omit<Message, "id">) => setMessages((prev) => [...prev, { ...m, id: nextId.current++ }]);

  useEffect(() => {
    getConfig().then(setConfig).catch(() => setConfig(FALLBACK_CONFIG));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const send = async (text: string) => {
    setStarted(true);
    add({ role: "user", text });
    setLoading(true);
    try {
      const reply = await sendMessage(text, sessionRef.current);
      sessionRef.current = reply.session_id;
      add({ role: "bot", text: reply.answer, emergency: reply.emergency, suggestions: reply.suggestions ?? [] });
    } catch (e) {
      const status = e instanceof ChatError ? e.status : 0;
      add({
        role: "bot",
        error: true,
        text:
          status === 429
            ? "Let's slow down just a little. Please wait a minute and ask me again."
            : status === 503
              ? "Many people are chatting with me right now. Could you please try again in a minute?"
              : `I'm sorry, I'm having a little trouble right now. Please try again in a moment, or call our reception at ${config.reception_number}.`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-full max-w-md flex-col bg-chat-bg shadow-[0_8px_40px_rgba(38,55,58,0.12)] sm:my-0">
      <Header emergencyNumber={config.emergency_number} />
      <main className="flex-1 space-y-3 overflow-y-auto px-3 py-4" aria-live="polite">
        <MessageBubble message={{ id: 0, role: "bot", text: config.greeting }} />
        {messages.map((m) => <MessageBubble key={m.id} message={m} />)}
        {!started && (
          <QuickReplies
            options={config.quick_replies}
            disabled={loading}
            label="You can tap one of these to begin"
            onPick={(label) => send(QUICK_QUESTIONS[label] ?? label)}
          />
        )}
        {!loading && lastBot?.suggestions && lastBot.suggestions.length > 0 && messages[messages.length - 1] === lastBot && (
          <QuickReplies options={lastBot.suggestions} disabled={loading} label="You may also want to ask" onPick={(label) => send(label)} />
        )}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </main>
      <InputBar onSend={send} disabled={loading} disclaimer={config.disclaimer} />
    </div>
  );
}
