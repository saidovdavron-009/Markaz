import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg?: string;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function StatCard({ title, value, subtitle, icon, iconBg, trend, className }: StatCardProps) {
  const isPositive = trend && trend.value >= 0;

  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 sm:p-5 shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-[var(--muted-foreground)] truncate">{title}</p>
          <p className="mt-1 text-xl sm:text-2xl font-bold text-[var(--foreground)] truncate">{value}</p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)] truncate">{subtitle}</p>
          )}
          {trend && (
            <div className={cn("mt-1.5 flex items-center gap-1 text-xs font-medium", isPositive ? "text-green-600" : "text-red-500")}>
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span className="truncate">{isPositive ? "+" : ""}{trend.value}% {trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn("flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl ml-2 sm:ml-3", iconBg || "bg-[#1E3A5F]/10")}>
          <div className="text-[#1E3A5F] [&>svg]:h-4 [&>svg]:w-4 sm:[&>svg]:h-5 sm:[&>svg]:w-5">{icon}</div>
        </div>
      </div>
    </div>
  );
}
