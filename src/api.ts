const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "http://localhost:8000";

export interface ChatConfig {
  greeting: string;
  greeting_te: string;
  quick_replies: string[];
  disclaimer: string;
  emergency_number: string;
  reception_number: string;
}

export interface ChatReply {
  answer: string;
  session_id: string;
  emergency: boolean;
  suggestions?: string[];
}

export const FALLBACK_CONFIG: ChatConfig = {
  greeting: "Hello! Welcome to Vizag Care Hospital. How can I help you today?",
  greeting_te: "",
  quick_replies: ["Doctors & timings", "Departments", "Health packages", "Insurance", "Emergency", "Location & parking"],
  disclaimer: "I am an AI assistant and cannot give medical advice.",
  emergency_number: "0891-400-1108",
  reception_number: "0891-400-1000",
};

const SESSION_KEY = "vizag_care_session";

export function loadSessionId(): string | null {
  try { return localStorage.getItem(SESSION_KEY); } catch { return null; }
}
function saveSessionId(id: string) {
  try { localStorage.setItem(SESSION_KEY, id); } catch { /* storage may be blocked */ }
}

export async function getConfig(): Promise<ChatConfig> {
  const res = await fetch(`${API_URL}/config`);
  if (!res.ok) throw new Error("config failed");
  return res.json();
}

export class ChatError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export async function sendMessage(message: string, sessionId: string | null): Promise<ChatReply> {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId }),
  });
  if (!res.ok) {
    let detail = "";
    try { detail = (await res.json()).detail ?? ""; } catch { /* ignore */ }
    throw new ChatError(res.status, detail);
  }
  const data: ChatReply = await res.json();
  saveSessionId(data.session_id);
  return data;
}
