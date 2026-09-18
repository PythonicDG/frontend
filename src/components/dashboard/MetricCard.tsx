import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  change?: string;
  isPositive?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor = 'text-penta-green',
  iconBg = 'bg-penta-green/10 border-penta-green/20',
  change,
  isPositive = true,
}) => {
  const formattedValue =
    typeof value === 'number'
      ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
      : value;

  return (
    <div className="bg-penta-card border border-penta-border/60 rounded-2xl p-5 hover:border-penta-border transition-all duration-300 hover:shadow-card group">
      <div className="flex items-center gap-4">
        {/* Icon in rounded square badge matching Figma */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 transition-transform duration-300 group-hover:scale-105 ${iconBg}`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-penta-muted mb-0.5 tracking-wide">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight text-white truncate">
            {formattedValue}
          </h3>
        </div>
      </div>

      {change && (
        <div className="mt-3 pt-3 border-t border-penta-border/30 flex items-center gap-1.5 text-xs">
          <span className={isPositive ? 'text-penta-green font-semibold' : 'text-penta-red font-semibold'}>
            {change}
          </span>
          <span className="text-penta-dim">vs previous month</span>
        </div>
      )}
    </div>
  );
};
