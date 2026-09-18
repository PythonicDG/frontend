import React from 'react';
import { Transaction } from '../../types';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onSeeAll?: () => void;
  isLoading?: boolean;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  onSeeAll,
  isLoading,
}) => {
  return (
    <div className="bg-penta-card border border-penta-border/60 rounded-2xl p-6 flex flex-col justify-between">
      {/* Header matching Figma */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-white tracking-tight">Recent Transaction</h2>
        <button
          onClick={onSeeAll}
          className="text-xs font-semibold text-penta-green hover:underline cursor-pointer transition-colors"
        >
          See all
        </button>
      </div>

      {/* Transaction list */}
      <div className="space-y-4 flex-1">
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="w-6 h-6 border-2 border-penta-green border-t-transparent rounded-full animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-12 text-center text-xs text-penta-muted">No recent transactions</div>
        ) : (
          transactions.slice(0, 4).map((tx) => {
            const isRevenue = tx.category === 'Revenue';
            const prefix = isRevenue ? 'Transfers from ' : 'Transfers to ';

            return (
              <div
                key={tx._id || tx.id}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-penta-input/50 transition-colors group"
              >
                {/* Avatar and Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={tx.user_profile || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                    alt={tx.user_name}
                    className="w-10 h-10 rounded-full object-cover border border-penta-border shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-penta-muted truncate">{prefix}</p>
                    <p className="text-sm font-semibold text-white truncate group-hover:text-penta-green transition-colors">
                      {tx.user_name}
                    </p>
                  </div>
                </div>

                {/* Amount formatted matching Figma */}
                <div className="text-right shrink-0">
                  <span
                    className={`text-sm font-bold ${
                      isRevenue ? 'text-penta-green' : 'text-penta-yellow'
                    }`}
                  >
                    {isRevenue ? `+$${tx.amount.toFixed(2)}` : `-$${tx.amount.toFixed(2)}`}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
