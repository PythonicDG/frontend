import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { useAlert } from './context/AlertContext';
import { LoginPage } from './components/auth/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { MetricCard } from './components/dashboard/MetricCard';
import { OverviewChart } from './components/dashboard/OverviewChart';
import { RecentTransactions } from './components/dashboard/RecentTransactions';
import { TransactionTable } from './components/transactions/TransactionTable';
import { TransactionFilters } from './components/transactions/TransactionFilters';
import { Pagination } from './components/transactions/Pagination';
import { ExportCSVModal } from './components/export/ExportCSVModal';
import { transactionApi } from './api/transactions';
import {
  Transaction,
  SummaryMetrics,
  TrendDataPoint,
  FilterParams,
  PaginationMeta,
} from './types';
import {
  Wallet,
  Coins,
  CreditCard,
  PiggyBank,
  RefreshCw,
} from 'lucide-react';

export const App: React.FC = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { showAlert } = useAlert();

  // Layout & Tab state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Data states
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<SummaryMetrics>({
    balance: 0,
    revenue: 0,
    expenses: 0,
    savings: 0,
    savingsRate: '0.0%',
    totalTransactions: 0,
    paidTransactions: 0,
    pendingTransactions: 0,
  });
  const [trends, setTrends] = useState<TrendDataPoint[]>([]);

  // Filter & Pagination state
  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    category: 'all',
    status: 'all',
    user_id: 'all',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });

  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Loading states
  const [isLoadingTx, setIsLoadingTx] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);

  // Fetch summary metrics
  const fetchSummary = useCallback(async () => {
    setIsLoadingSummary(true);
    try {
      const res = await transactionApi.getSummary();
      if (res.success) {
        setSummary(res.data);
      }
    } catch (err: any) {
      showAlert('Failed to load financial metrics.', 'error');
    } finally {
      setIsLoadingSummary(false);
    }
  }, [showAlert]);

  // Fetch trends for Overview spline chart
  const fetchTrends = useCallback(async () => {
    setIsLoadingTrends(true);
    try {
      const res = await transactionApi.getTrends(2024);
      if (res.success) {
        setTrends(res.data);
      }
    } catch (err: any) {
      showAlert('Failed to load chart cashflow trends.', 'error');
    } finally {
      setIsLoadingTrends(false);
    }
  }, [showAlert]);

  // Fetch recent transactions
  const fetchRecent = useCallback(async () => {
    try {
      const res = await transactionApi.getRecent(5);
      if (res.success) {
        setRecentTransactions(res.data);
      }
    } catch {
      // silently handle
    }
  }, []);

  // Fetch paginated transactions with current filters
  const fetchTransactions = useCallback(async () => {
    setIsLoadingTx(true);
    try {
      const res = await transactionApi.getTransactions(filters);
      if (res.success) {
        setTransactions(res.data);
        setPagination(res.pagination);
      }
    } catch (err: any) {
      showAlert(err.response?.data?.message || 'Failed to load transactions.', 'error');
    } finally {
      setIsLoadingTx(false);
    }
  }, [filters, showAlert]);

  // Initial load when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchSummary();
      fetchTrends();
      fetchRecent();
    }
  }, [isAuthenticated, fetchSummary, fetchTrends, fetchRecent]);

  // Fetch transactions when filters change (with slight debounce for search)
  useEffect(() => {
    if (!isAuthenticated) return;

    const timer = setTimeout(() => {
      fetchTransactions();
    }, 250);

    return () => clearTimeout(timer);
  }, [isAuthenticated, filters, fetchTransactions]);

  // Sorting handler
  const handleSort = (column: string) => {
    setFilters((prev) => {
      const isSameCol = prev.sortBy === column;
      const newOrder = isSameCol && prev.sortOrder === 'asc' ? 'desc' : 'asc';
      return {
        ...prev,
        sortBy: column,
        sortOrder: newOrder,
        page: 1,
      };
    });
  };

  // Topbar search synchronization
  const handleGlobalSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query, page: 1 }));
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-penta-bg flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-penta-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-penta-bg text-penta-text flex">
      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Topbar */}
        <Topbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          globalSearch={filters.search || ''}
          setGlobalSearch={handleGlobalSearch}
        />

        {/* Dashboard Body matching Figma */}
        <main className="flex-1 p-6 lg:p-10 space-y-8 max-w-7xl w-full mx-auto">
          {/* Top 4 Metric Cards matching Figma layout */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <MetricCard
              title="Balance"
              value={summary.balance}
              icon={Wallet}
              iconColor="text-penta-green"
              iconBg="bg-emerald-500/10 border-emerald-500/20"
              change="+14.2%"
              isPositive={true}
            />
            <MetricCard
              title="Revenue"
              value={summary.revenue}
              icon={Coins}
              iconColor="text-penta-green"
              iconBg="bg-emerald-500/10 border-emerald-500/20"
              change="+8.4%"
              isPositive={true}
            />
            <MetricCard
              title="Expenses"
              value={summary.expenses}
              icon={CreditCard}
              iconColor="text-penta-yellow"
              iconBg="bg-amber-500/10 border-amber-500/20"
              change="-3.1%"
              isPositive={true}
            />
            <MetricCard
              title="Savings"
              value={summary.savings}
              icon={PiggyBank}
              iconColor="text-penta-green"
              iconBg="bg-emerald-500/10 border-emerald-500/20"
              change={summary.savingsRate}
              isPositive={true}
            />
          </section>

          {/* Middle Section: Overview Spline Chart (left) & Recent Transaction List (right) */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overview Spline Chart (2 columns on large screens) */}
            <div className="lg:col-span-2">
              <OverviewChart data={trends} isLoading={isLoadingTrends} />
            </div>

            {/* Recent Transaction List (1 column on large screens) */}
            <div className="lg:col-span-1">
              <RecentTransactions
                transactions={recentTransactions}
                isLoading={isLoadingTx}
                onSeeAll={() => {
                  const tableElement = document.getElementById('transactions-table-section');
                  tableElement?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </div>
          </section>

          {/* Lower Section: Transactions Table & Advanced Controls */}
          <section id="transactions-table-section" className="bg-penta-card/60 border border-penta-border/60 rounded-3xl p-6 lg:p-8 space-y-4">
            {/* Filter controls, search, date range, and export modal trigger */}
            <TransactionFilters
              filters={filters}
              setFilters={setFilters}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              totalResults={pagination.total}
            />

            {/* Main Interactive Table */}
            <TransactionTable
              transactions={transactions}
              isLoading={isLoadingTx}
              sortBy={filters.sortBy || 'date'}
              sortOrder={filters.sortOrder || 'desc'}
              onSort={handleSort}
            />

            {/* Pagination */}
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalRecords={pagination.total}
              pageSize={filters.limit || 10}
              onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
              onPageSizeChange={(size) => setFilters((prev) => ({ ...prev, limit: size, page: 1 }))}
            />
          </section>
        </main>
      </div>

      {/* Creative Configurable CSV Export Modal */}
      <ExportCSVModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        currentFilters={filters}
        sampleTransactions={transactions}
        totalFilteredCount={pagination.total}
      />
    </div>
  );
};
