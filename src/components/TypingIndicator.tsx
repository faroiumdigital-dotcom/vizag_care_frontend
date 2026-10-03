export default function TypingIndicator() {
  return (
    <div className="flex justify-start" role="status" aria-label="Assistant is typing">
      <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm">
        <span className="dot h-2 w-2 rounded-full bg-brand" />
        <span className="dot h-2 w-2 rounded-full bg-brand" />
        <span className="dot h-2 w-2 rounded-full bg-brand" />
      </div>
    </div>
  );
}
