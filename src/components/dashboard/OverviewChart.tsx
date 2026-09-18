import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendDataPoint } from '../../types';
import { ChevronDown } from 'lucide-react';

interface OverviewChartProps {
  data: TrendDataPoint[];
  isLoading?: boolean;
}

// Custom Tooltip component replicating the Figma floating green badge
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const incomeItem = payload.find((p: any) => p.dataKey === 'Income');
    const expenseItem = payload.find((p: any) => p.dataKey === 'Expenses');

    return (
      <div className="flex flex-col items-center">
        {/* Figma green callout pill */}
        <div className="bg-penta-green text-black px-3 py-1.5 rounded-xl shadow-glow text-center border border-emerald-400">
          <p className="text-[10px] font-bold uppercase tracking-wider opacity-85">Income</p>
          <p className="text-sm font-extrabold tracking-tight">
            ${incomeItem ? Number(incomeItem.value).toLocaleString() : '0'}
          </p>
        </div>

        {/* Expenses secondary indicator */}
        {expenseItem && (
          <div className="mt-1 bg-penta-card/90 backdrop-blur-sm border border-penta-border px-2.5 py-1 rounded-lg text-[11px] text-penta-yellow font-medium shadow-md">
            Expenses: ${Number(expenseItem.value).toLocaleString()}
          </div>
        )}

        <div className="mt-1 text-[10px] font-medium text-penta-muted">{label}</div>
      </div>
    );
  }
  return null;
};

export const OverviewChart: React.FC<OverviewChartProps> = ({ data, isLoading }) => {
  const [timeframe, setTimeframe] = useState<'Monthly' | 'Quarterly'>('Monthly');

  // Filter or transform if quarterly
  const chartData = timeframe === 'Quarterly'
    ? [
        {
          month: 'Q1 (Jan-Mar)',
          Income: data.slice(0, 3).reduce((acc, c) => acc + c.Income, 0),
          Expenses: data.slice(0, 3).reduce((acc, c) => acc + c.Expenses, 0),
        },
        {
          month: 'Q2 (Apr-Jun)',
          Income: data.slice(3, 6).reduce((acc, c) => acc + c.Income, 0),
          Expenses: data.slice(3, 6).reduce((acc, c) => acc + c.Expenses, 0),
        },
        {
          month: 'Q3 (Jul-Sep)',
          Income: data.slice(6, 9).reduce((acc, c) => acc + c.Income, 0),
          Expenses: data.slice(6, 9).reduce((acc, c) => acc + c.Expenses, 0),
        },
        {
          month: 'Q4 (Oct-Dec)',
          Income: data.slice(9, 12).reduce((acc, c) => acc + c.Income, 0),
          Expenses: data.slice(9, 12).reduce((acc, c) => acc + c.Expenses, 0),
        },
      ]
    : data;

  return (
    <div className="bg-penta-card border border-penta-border/60 rounded-2xl p-6 flex flex-col justify-between">
      {/* Header matching Figma */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Overview</h2>
          <p className="text-xs text-penta-muted mt-0.5">Revenue & Expense Cashflow Trends</p>
        </div>

        <div className="flex items-center gap-6">
          {/* Legend dots matching Figma */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-penta-green shadow-[0_0_8px_rgba(32,223,116,0.6)]" />
              <span className="text-white">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-penta-yellow shadow-[0_0_8px_rgba(242,167,53,0.6)]" />
              <span className="text-white">Expenses</span>
            </div>
          </div>

          {/* Timeframe selector dropdown matching Figma */}
          <div className="relative">
            <button
              onClick={() => setTimeframe(timeframe === 'Monthly' ? 'Quarterly' : 'Monthly')}
              className="flex items-center gap-2 bg-penta-input border border-penta-border px-3 py-1.5 rounded-lg text-xs font-medium text-penta-muted hover:text-white transition-all"
            >
              <span>{timeframe}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart container */}
      <div className="h-72 w-full">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-penta-green border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#20DF74" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#20DF74" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F2A735" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#F2A735" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#242936" vertical={false} opacity={0.4} />

              <XAxis
                dataKey="month"
                stroke="#555C6E"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#242936' }}
              />
              <YAxis
                stroke="#555C6E"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Income smooth curved line */}
              <Area
                type="monotone"
                dataKey="Income"
                stroke="#20DF74"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorIncome)"
              />

              {/* Expenses smooth curved line */}
              <Area
                type="monotone"
                dataKey="Expenses"
                stroke="#F2A735"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorExpenses)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
