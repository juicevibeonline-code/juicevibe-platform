import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  accentColor?: "primary" | "orange" | "pink" | "yellow" | "blue";
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/60 mb-6 relative">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">{title}</h1>
        <p className="text-xs text-muted mt-1.5 font-semibold">{subtitle}</p>
      </div>
      {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  );
}
