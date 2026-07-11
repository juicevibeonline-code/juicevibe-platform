import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  accentColor?: "primary" | "orange" | "pink" | "yellow" | "blue";
  action?: React.ReactNode;
}

const glowColors: Record<string, string> = {
  primary: "bg-primary/15",
  orange: "bg-orange/15",
  pink: "bg-pink/15",
  yellow: "bg-orange/15",
  blue: "bg-blue/15",
};

export function PageHeader({ title, subtitle, accentColor = "primary", action }: PageHeaderProps) {
  return (
    <div className="relative p-8 rounded-lg glass-panel overflow-hidden mb-8">
      <div className={`absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full blur-[80px] ${glowColors[accentColor]}`} />
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">{title}</h1>
          <p className="text-muted font-medium mt-2 text-sm">{subtitle}</p>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
