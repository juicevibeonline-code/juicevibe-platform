import { cn } from "@juice-vibe/utils";

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ children, className }: SectionCardProps) {
  return (
    <div className={cn("bg-card border border-border rounded-lg p-4 shadow-sm", className)}>
      {children}
    </div>
  );
}

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionTitle({ children, className }: SectionTitleProps) {
  return (
    <h3 className={cn("text-[10px] font-bold text-muted mb-3 uppercase tracking-wider", className)}>
      {children}
    </h3>
  );
}

interface KeyValueRowProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function KeyValueRow({ label, children, className }: KeyValueRowProps) {
  return (
    <div className={cn("flex items-center justify-between mb-1.5 last:mb-0", className)}>
      <span className="text-muted text-xs">{label}</span>
      <span className="font-bold text-foreground text-xs">{children}</span>
    </div>
  );
}
