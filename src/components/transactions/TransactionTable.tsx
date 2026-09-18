import React from 'react';
import { Transaction } from '../../types';
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (column: string) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
}) => {
  // Format Date matching Figma e.g. "Sat, 20 Apr 2024"
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${days[d.getUTCDay()]}, ${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  const renderSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-penta-dim opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-penta-green" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-penta-green" />
    );
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-penta-border/60 bg-penta-card">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-penta-border/80 text-xs font-semibold text-penta-muted">
            {/* Name Column */}
            <th
              onClick={() => onSort('user_name')}
              className="py-4 px-6 cursor-pointer hover:text-white transition-colors group select-none"
            >
              <div className="flex items-center gap-1.5">
                <span>Name</span>
                {renderSortIcon('user_name')}
              </div>
            </th>

            {/* Date Column */}
            <th
              onClick={() => onSort('date')}
              className="py-4 px-6 cursor-pointer hover:text-white transition-colors group select-none"
            >
              <div className="flex items-center gap-1.5">
                <span>Date</span>
                {renderSortIcon('date')}
              </div>
            </th>

            {/* Category Column */}
            <th
              onClick={() => onSort('category')}
              className="py-4 px-6 cursor-pointer hover:text-white transition-colors group select-none"
            >
              <div className="flex items-center gap-1.5">
                <span>Category</span>
                {renderSortIcon('category')}
              </div>
            </th>

            {/* Amount Column */}
            <th
              onClick={() => onSort('amount')}
              className="py-4 px-6 cursor-pointer hover:text-white transition-colors group select-none"
            >
              <div className="flex items-center gap-1.5">
                <span>Amount</span>
                {renderSortIcon('amount')}
              </div>
            </th>

            {/* Status Column */}
            <th
              onClick={() => onSort('status')}
              className="py-4 px-6 cursor-pointer hover:text-white transition-colors group select-none"
            >
              <div className="flex items-center gap-1.5">
                <span>Status</span>
                {renderSortIcon('status')}
              </div>
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-penta-border/40 text-sm">
          {isLoading ? (
            <tr>
              <td colSpan={5} className="py-20 text-center">
                <div className="inline-flex flex-col items-center gap-3">
                  <div className="w-7 h-7 border-2 border-penta-green border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-penta-muted">Loading transactions...</span>
                </div>
              </td>
            </tr>
          ) : transactions.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-16 text-center text-penta-muted text-sm">
                No transactions match the selected filters.
              </td>
            </tr>
          ) : (
            transactions.map((tx) => {
              const isRevenue = tx.category === 'Revenue';
              const isPaid = tx.status === 'Paid';

              return (
                <tr
                  key={tx._id || tx.id}
                  className="hover:bg-penta-cardHover/70 transition-colors group"
                >
                  {/* Name Column with Avatar matching Figma */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={tx.user_profile || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                        alt={tx.user_name}
                        className="w-9 h-9 rounded-full object-cover border border-penta-border/80 shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-white text-sm group-hover:text-penta-green transition-colors">
                          {tx.user_name}
                        </p>
                        <span className="text-[11px] text-penta-dim">ID: {tx.user_id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Date Column matching Figma */}
                  <td className="py-4 px-6 text-xs text-penta-text font-medium whitespace-nowrap">
                    {formatDate(tx.date)}
                  </td>

                  {/* Category Column */}
                  <td className="py-4 px-6 text-xs font-medium">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                        isRevenue
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {tx.category}
                    </span>
                  </td>

                  {/* Amount Column matching Figma (Green + for Revenue, Amber/Red - for Expense) */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span
                      className={`text-sm font-bold ${
                        isRevenue ? 'text-penta-green' : 'text-penta-yellow'
                      }`}
                    >
                      {isRevenue ? `+$${tx.amount.toFixed(2)}` : `-$${tx.amount.toFixed(2)}`}
                    </span>
                  </td>

                  {/* Status Pill matching Figma */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        isPaid
                          ? 'bg-emerald-950/60 text-penta-green border border-penta-green/30'
                          : 'bg-amber-950/60 text-penta-yellow border border-penta-yellow/30'
                      }`}
                    >
                      {isPaid ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
