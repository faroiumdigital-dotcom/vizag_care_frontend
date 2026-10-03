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
      add({ role: "bot", text: reply.answer, emergency: reply.emergency });
    } catch (e) {
      const tooMany = e instanceof ChatError && e.status === 429;
      add({
        role: "bot",
        error: true,
        text: tooMany
          ? "You are sending messages too quickly. Please wait a minute and try again."
          : `Sorry, something went wrong. Please try again or call ${config.reception_number}.`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-full max-w-md flex-col bg-chat-bg shadow-xl">
      <Header emergencyNumber={config.emergency_number} />
      <main className="flex-1 space-y-2 overflow-y-auto px-3 py-3" aria-live="polite">
        <MessageBubble message={{ id: 0, role: "bot", text: config.greeting }} />
        {messages.map((m) => <MessageBubble key={m.id} message={m} />)}
        {!started && (
          <QuickReplies
            options={config.quick_replies}
            disabled={loading}
            onPick={(label) => send(QUICK_QUESTIONS[label] ?? label)}
          />
        )}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </main>
      <InputBar onSend={send} disabled={loading} disclaimer={config.disclaimer} />
    </div>
  );
}
