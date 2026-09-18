import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Filter,
  Download,
  X,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { FilterParams } from '../../types';

interface TransactionFiltersProps {
  filters: FilterParams;
  setFilters: React.Dispatch<React.SetStateAction<FilterParams>>;
  onOpenExportModal: () => void;
  totalResults: number;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  setFilters,
  onOpenExportModal,
  totalResults,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Quick search input handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  // Reset all filters
  const handleReset = () => {
    setFilters({
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
  };

  const hasActiveFilters =
    Boolean(filters.search) ||
    (filters.category && filters.category !== 'all') ||
    (filters.status && filters.status !== 'all') ||
    (filters.user_id && filters.user_id !== 'all') ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate) ||
    Boolean(filters.minAmount) ||
    Boolean(filters.maxAmount);

  return (
    <div className="space-y-4 mb-4">
      {/* Top row: Title, Search, Date Range, Filter toggle, Export button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white tracking-tight">Transactions</h2>
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-penta-input text-penta-muted rounded-full border border-penta-border">
            {totalResults} records
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar matching Figma ("Search for anything...") */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search for anything..."
              value={filters.search || ''}
              onChange={handleSearchChange}
              className="w-full bg-penta-input border border-penta-border rounded-xl py-2 pl-9 pr-4 text-xs text-penta-text placeholder-penta-dim focus:outline-none focus:border-penta-green focus:ring-1 focus:ring-penta-green/30 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-penta-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {filters.search && (
              <button
                onClick={() => setFilters((p) => ({ ...p, search: '', page: 1 }))}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-penta-muted hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Date Range Button matching Figma */}
          <div className="relative">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 bg-penta-input border border-penta-border px-3.5 py-2 rounded-xl text-xs font-medium text-penta-text hover:border-penta-muted transition-all"
            >
              <Calendar className="w-3.5 h-3.5 text-penta-muted" />
              <span>
                {filters.startDate || filters.endDate
                  ? `${filters.startDate || 'Start'} → ${filters.endDate || 'End'}`
                  : 'Date Range'}
              </span>
            </button>
          </div>

          {/* Advanced Filter Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
              hasActiveFilters || showAdvanced
                ? 'bg-penta-green/10 border-penta-green/40 text-penta-green'
                : 'bg-penta-input border-penta-border text-penta-muted hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-penta-green ml-0.5" />
            )}
          </button>

          {/* Creative Export CSV Button */}
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-2 bg-penta-green hover:bg-penta-greenHover text-black px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-glow hover:shadow-[0_0_25px_rgba(32,223,116,0.35)] active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter Collapsible Drawer */}
      {showAdvanced && (
        <div className="bg-penta-input/80 border border-penta-border rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 animate-fade-in text-xs">
          {/* Category */}
          <div>
            <label className="block text-penta-muted mb-1 font-medium">Category</label>
            <select
              value={filters.category || 'all'}
              onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value, page: 1 }))}
              className="w-full bg-penta-card border border-penta-border rounded-lg py-1.5 px-2.5 text-xs text-white focus:outline-none focus:border-penta-green"
            >
              <option value="all">All Categories</option>
              <option value="Revenue">Revenue</option>
              <option value="Expense">Expense</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-penta-muted mb-1 font-medium">Status</label>
            <select
              value={filters.status || 'all'}
              onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value, page: 1 }))}
              className="w-full bg-penta-card border border-penta-border rounded-lg py-1.5 px-2.5 text-xs text-white focus:outline-none focus:border-penta-green"
            >
              <option value="all">All Statuses</option>
              <option value="Paid">Paid / Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* User / Analyst */}
          <div>
            <label className="block text-penta-muted mb-1 font-medium">Analyst</label>
            <select
              value={filters.user_id || 'all'}
              onChange={(e) => setFilters((p) => ({ ...p, user_id: e.target.value, page: 1 }))}
              className="w-full bg-penta-card border border-penta-border rounded-lg py-1.5 px-2.5 text-xs text-white focus:outline-none focus:border-penta-green"
            >
              <option value="all">All Analysts</option>
              <option value="user_001">Matheus Ferrero</option>
              <option value="user_002">Floyd Miles</option>
              <option value="user_003">Jerome Bell</option>
              <option value="user_004">Eleanor Pena</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-penta-muted mb-1 font-medium">Start Date</label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value, page: 1 }))}
              className="w-full bg-penta-card border border-penta-border rounded-lg py-1.5 px-2 text-xs text-white focus:outline-none focus:border-penta-green"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-penta-muted mb-1 font-medium">End Date</label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value, page: 1 }))}
              className="w-full bg-penta-card border border-penta-border rounded-lg py-1.5 px-2 text-xs text-white focus:outline-none focus:border-penta-green"
            />
          </div>

          {/* Amount range & reset */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-penta-muted mb-1 font-medium">Min $</label>
              <input
                type="number"
                placeholder="Min"
                value={filters.minAmount || ''}
                onChange={(e) => setFilters((p) => ({ ...p, minAmount: e.target.value, page: 1 }))}
                className="w-full bg-penta-card border border-penta-border rounded-lg py-1.5 px-2 text-xs text-white focus:outline-none focus:border-penta-green"
              />
            </div>
            <div className="flex-1">
              <label className="block text-penta-muted mb-1 font-medium">Max $</label>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxAmount || ''}
                onChange={(e) => setFilters((p) => ({ ...p, maxAmount: e.target.value, page: 1 }))}
                className="w-full bg-penta-card border border-penta-border rounded-lg py-1.5 px-2 text-xs text-white focus:outline-none focus:border-penta-green"
              />
            </div>
            <button
              onClick={handleReset}
              title="Reset Filters"
              className="p-2 bg-penta-card hover:bg-penta-border/60 border border-penta-border rounded-lg text-penta-muted hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Active Filter Chips Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-penta-dim">Active filters:</span>

          {filters.search && (
            <span className="inline-flex items-center gap-1.5 bg-penta-green/10 text-penta-green border border-penta-green/20 px-2.5 py-0.5 rounded-full text-[11px] font-medium">
              Search: "{filters.search}"
              <button onClick={() => setFilters((p) => ({ ...p, search: '', page: 1 }))}>
                <X className="w-3 h-3 hover:text-white" />
              </button>
            </span>
          )}

          {filters.category && filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1.5 bg-penta-card text-penta-text border border-penta-border px-2.5 py-0.5 rounded-full text-[11px] font-medium">
              Category: {filters.category}
              <button onClick={() => setFilters((p) => ({ ...p, category: 'all', page: 1 }))}>
                <X className="w-3 h-3 hover:text-white" />
              </button>
            </span>
          )}

          {filters.status && filters.status !== 'all' && (
            <span className="inline-flex items-center gap-1.5 bg-penta-card text-penta-text border border-penta-border px-2.5 py-0.5 rounded-full text-[11px] font-medium">
              Status: {filters.status}
              <button onClick={() => setFilters((p) => ({ ...p, status: 'all', page: 1 }))}>
                <X className="w-3 h-3 hover:text-white" />
              </button>
            </span>
          )}

          {filters.user_id && filters.user_id !== 'all' && (
            <span className="inline-flex items-center gap-1.5 bg-penta-card text-penta-text border border-penta-border px-2.5 py-0.5 rounded-full text-[11px] font-medium">
              Analyst: {filters.user_id}
              <button onClick={() => setFilters((p) => ({ ...p, user_id: 'all', page: 1 }))}>
                <X className="w-3 h-3 hover:text-white" />
              </button>
            </span>
          )}

          {(filters.startDate || filters.endDate) && (
            <span className="inline-flex items-center gap-1.5 bg-penta-card text-penta-text border border-penta-border px-2.5 py-0.5 rounded-full text-[11px] font-medium">
              Date: {filters.startDate || '...'} to {filters.endDate || '...'}
              <button onClick={() => setFilters((p) => ({ ...p, startDate: '', endDate: '', page: 1 }))}>
                <X className="w-3 h-3 hover:text-white" />
              </button>
            </span>
          )}

          {(filters.minAmount || filters.maxAmount) && (
            <span className="inline-flex items-center gap-1.5 bg-penta-card text-penta-text border border-penta-border px-2.5 py-0.5 rounded-full text-[11px] font-medium">
              Amount: ${filters.minAmount || '0'} - ${filters.maxAmount || '∞'}
              <button onClick={() => setFilters((p) => ({ ...p, minAmount: '', maxAmount: '', page: 1 }))}>
                <X className="w-3 h-3 hover:text-white" />
              </button>
            </span>
          )}

          <button
            onClick={handleReset}
            className="text-[11px] text-penta-muted hover:text-penta-red underline ml-2 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
