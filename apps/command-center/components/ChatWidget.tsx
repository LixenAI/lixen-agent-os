"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Inline SVG icons (no external dependency)
function MessageCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7.9 20A9 9 0 1 0 6 16.5L3 21l4.5-3A9 9 0 0 0 21 10.5" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m22 2-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

function BotIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}

const AGENT_OS_URL =
  process.env.NEXT_PUBLIC_AGENT_OS_URL || "http://localhost:8000";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your LixenAI assistant. Ask me anything about the platform, services, pricing, or partner program.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    const updatedMessages = [
      ...messages,
      { role: "user" as const, content: userMessage },
    ];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const res = await fetch(`${AGENT_OS_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.response || "Sorry, I couldn't process that. Please try again.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting to the AI service. Please make sure the agent-os server is running on port 8000.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-neon-400 text-white shadow-glow transition-all hover:scale-105 hover:bg-neon-500 hover:shadow-neon active:scale-95"
        aria-label="Open LixenAI chat"
      >
        <SparklesIcon className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[560px] w-[400px] flex-col overflow-hidden rounded-2xl border border-hairline bg-white shadow-glass">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-hairline bg-surface px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neon-400/10">
            <BotIcon className="h-4 w-4 text-neon-500" />
          </div>
          <div>
            <span className="text-sm font-semibold text-ink">
              LixenAI Assistant
            </span>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-2xs text-muted">Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-lg p-1.5 text-muted transition-colors hover:bg-slate-100 hover:text-ink"
          aria-label="Close chat"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neon-400/10">
                <BotIcon className="h-3.5 w-3.5 text-neon-500" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-neon-400 text-white"
                  : "bg-slate-50 text-ink border border-hairline"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neon-400/10">
              <BotIcon className="h-3.5 w-3.5 text-neon-500" />
            </div>
            <div className="flex max-w-[80%] gap-1.5 rounded-xl border border-hairline bg-slate-50 px-4 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-neon-400" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-neon-400 [animation-delay:0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-neon-400 [animation-delay:0.3s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-hairline p-3">
        <div className="flex items-center gap-2 rounded-xl border border-hairline bg-surface px-3 py-2.5 transition-all focus-within:border-neon-400/50 focus-within:shadow-neon">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about LixenAI..."
            className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neon-400 text-white transition-all hover:bg-neon-500 disabled:opacity-40 disabled:hover:bg-neon-400"
            aria-label="Send message"
          >
            <SendIcon className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1.5 text-center text-2xs text-muted">
          Powered by AI · Answers are for guidance only
        </p>
      </div>
    </div>
  );
}
