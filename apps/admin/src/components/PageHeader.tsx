import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">{title}</h1>
        <p className="text-sm text-muted mt-2">{subtitle}</p>
      </div>
      {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  );
}
