import { cn } from "@juice-vibe/utils";

interface FilterBarProps {
  children: React.ReactNode;
  className?: string;
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div className={cn("bg-card border border-border/80 p-1.5 rounded-xl flex items-center gap-1 overflow-x-auto custom-scrollbar max-w-full shrink-0 shadow-sm", className)}>
      {children}
    </div>
  );
}

interface FilterTabProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
  variant?: "primary" | "danger";
}

export function FilterTab({ active, onClick, children, count, variant = "primary" }: FilterTabProps) {
  const activeStyles = variant === "danger"
    ? "bg-rose-600 text-white shadow-sm shadow-rose-600/10"
    : "bg-primary text-white shadow-sm";

  const countActiveStyles = variant === "danger"
    ? "bg-white/20 text-white"
    : "bg-white/20 text-white";

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
        active
          ? activeStyles
          : variant === "danger"
            ? "text-rose-600 dark:text-rose-400 hover:bg-rose-500/5 dark:hover:bg-rose-500/10"
            : "text-muted hover:text-foreground hover:bg-muted-background/50"
      )}
    >
      {children}
      {count !== undefined && (
        <span className={cn(
          "text-[9px] px-1.5 py-0.5 rounded-md font-extrabold",
          active ? countActiveStyles : "bg-muted-background/80 text-muted"
        )}>
          {count}
        </span>
      )}
    </button>
  );
}
