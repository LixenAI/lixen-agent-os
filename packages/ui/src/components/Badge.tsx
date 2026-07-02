interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variants = {
    default: "border-slate-200 bg-slate-50 text-slate-700",
    success: "border-sky-200 bg-sky-50 text-sky-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    danger: "border-rose-200 bg-rose-50 text-rose-700",
    info: "border-violet-200 bg-violet-50 text-violet-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-2xs font-semibold uppercase tracking-wide ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}