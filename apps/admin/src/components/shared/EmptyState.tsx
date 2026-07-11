import { cn } from "@juice-vibe/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-12", className)}>
      <div className="w-10 h-10 bg-muted-background rounded-lg flex items-center justify-center mb-3 border border-border">
        <Icon className="w-5 h-5 text-muted" />
      </div>
      <p className="text-sm font-bold text-foreground">{title}</p>
      {description && <p className="text-xs text-muted mt-1">{description}</p>}
    </div>
  );
}
