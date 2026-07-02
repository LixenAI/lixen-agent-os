import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-lg border border-hairline bg-slate-50 px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-slate-400 focus:border-neon-400 focus:ring-1 focus:ring-neon-400/50 ${className}`}
      {...props}
    />
  );
}