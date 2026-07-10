import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  accentColor?: "primary" | "orange" | "pink" | "yellow" | "blue";
  action?: React.ReactNode;
}

const glowColors: Record<string, string> = {
  primary: "bg-primary/20",
  orange: "bg-orange/20",
  pink: "bg-pink/20",
  yellow: "bg-yellow/20",
  blue: "bg-blue-500/20",
};

export function PageHeader({ title, subtitle, accentColor = "primary", action }: PageHeaderProps) {
  return (
    <div className="relative p-8 rounded-[2rem] glass-panel overflow-hidden mb-8">
      <div className={`absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full blur-[80px] ${glowColors[accentColor]}`} />
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">{title}</h1>
          <p className="text-muted font-medium mt-2">{subtitle}</p>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
