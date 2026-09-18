import React, { useState, useMemo } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Settings2,
  CheckSquare,
  Square,
  Sparkles,
  Eye,
  Check,
} from 'lucide-react';
import { transactionApi } from '../../api/transactions';
import { useAlert } from '../../context/AlertContext';
import { FilterParams, Transaction } from '../../types';

interface ExportCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: FilterParams;
  sampleTransactions: Transaction[];
  totalFilteredCount: number;
}

interface ColumnConfig {
  key: string;
  defaultLabel: string;
  alias: string;
  selected: boolean;
  description: string;
}

export const ExportCSVModal: React.FC<ExportCSVModalProps> = ({
  isOpen,
  onClose,
  currentFilters,
  sampleTransactions,
  totalFilteredCount,
}) => {
  const { showAlert } = useAlert();
  const [isExporting, setIsExporting] = useState(false);

  // Column definitions with default state
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'id', defaultLabel: 'Transaction ID', alias: 'Transaction ID', selected: true, description: 'Unique integer identifier' },
    { key: 'date', defaultLabel: 'Date', alias: 'Date', selected: true, description: 'Timestamp of transaction' },
    { key: 'amount', defaultLabel: 'Amount ($)', alias: 'Amount ($)', selected: true, description: 'Monetary figure in USD' },
    { key: 'category', defaultLabel: 'Category', alias: 'Category', selected: true, description: 'Revenue or Expense classification' },
    { key: 'status', defaultLabel: 'Status', alias: 'Status', selected: true, description: 'Paid or Pending completion state' },
    { key: 'user_id', defaultLabel: 'User ID', alias: 'Analyst ID', selected: true, description: 'Assigned analyst code' },
    { key: 'user_name', defaultLabel: 'Analyst Name', alias: 'Analyst Name', selected: true, description: 'Full name of the team member' },
    { key: 'user_profile', defaultLabel: 'Profile URL', alias: 'Avatar URL', selected: false, description: 'Direct image link' },
  ]);

  // Options
  const [delimiter, setDelimiter] = useState<string>(',');
  const [dateFormat, setDateFormat] = useState<string>('yyyy-mm-dd');
  const [exportScope, setExportScope] = useState<'filtered' | 'all'>('filtered');

  // Preset Handlers
  const applyPreset = (preset: 'all' | 'minimal' | 'audit') => {
    if (preset === 'all') {
      setColumns((prev) => prev.map((c) => ({ ...c, selected: true })));
    } else if (preset === 'minimal') {
      const minimalKeys = ['id', 'date', 'amount', 'category', 'status'];
      setColumns((prev) => prev.map((c) => ({ ...c, selected: minimalKeys.includes(c.key) })));
    } else if (preset === 'audit') {
      const auditKeys = ['id', 'date', 'amount', 'category', 'status', 'user_id', 'user_name'];
      setColumns((prev) => prev.map((c) => ({ ...c, selected: auditKeys.includes(c.key) })));
    }
  };

  const toggleColumn = (key: string) => {
    setColumns((prev) =>
      prev.map((c) => (c.key === key ? { ...c, selected: !c.selected } : c))
    );
  };

  const updateAlias = (key: string, alias: string) => {
    setColumns((prev) =>
      prev.map((c) => (c.key === key ? { ...c, alias } : c))
    );
  };

  // Generate Live CSV Preview
  const previewRows = useMemo(() => {
    const activeCols = columns.filter((c) => c.selected);
    if (activeCols.length === 0 || sampleTransactions.length === 0) return [];

    return sampleTransactions.slice(0, 3).map((tx) => {
      const row: Record<string, string> = {};
      activeCols.forEach((col) => {
        let val = '';
        if (col.key === 'id') val = String(tx.id);
        else if (col.key === 'date') {
          const d = new Date(tx.date);
          if (dateFormat === 'yyyy-mm-dd') val = d.toISOString().split('T')[0];
          else if (dateFormat === 'us') val = `${d.getUTCMonth() + 1}/${d.getUTCDate()}/${d.getUTCFullYear()}`;
          else if (dateFormat === 'readable') val = d.toDateString();
          else val = d.toISOString();
        } else if (col.key === 'amount') val = tx.amount.toFixed(2);
        else if (col.key === 'category') val = tx.category;
        else if (col.key === 'status') val = tx.status;
        else if (col.key === 'user_id') val = tx.user_id;
        else if (col.key === 'user_name') val = tx.user_name;
        else if (col.key === 'user_profile') val = tx.user_profile;
        row[col.alias || col.defaultLabel] = val;
      });
      return row;
    });
  }, [columns, sampleTransactions, dateFormat]);

  const handleExport = async () => {
    const activeCols = columns.filter((c) => c.selected);
    if (activeCols.length === 0) {
      showAlert('Please select at least one column to export.', 'warning');
      return;
    }

    setIsExporting(true);
    showAlert('Generating CSV report with custom configuration...', 'info', 2500);

    try {
      const columnAliases: Record<string, string> = {};
      activeCols.forEach((c) => {
        if (c.alias && c.alias.trim() !== '') {
          columnAliases[c.key] = c.alias.trim();
        }
      });

      const { filename } = await transactionApi.exportCSV({
        columns: activeCols.map((c) => c.key),
        columnAliases,
        delimiter,
        dateFormat,
        exportAll: exportScope === 'all',
        filters: currentFilters,
      });

      showAlert(`Successfully downloaded ${filename}!`, 'success', 5000);
      onClose();
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Failed to export CSV. Please try again.';
      showAlert(errMsg, 'error', 5000);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  const selectedCount = columns.filter((c) => c.selected).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-penta-card border border-penta-border rounded-3xl shadow-2xl overflow-hidden z-10 animate-fade-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-penta-border/60 flex items-center justify-between bg-penta-input/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-penta-green/10 border border-penta-green/30 flex items-center justify-center text-penta-green">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Configure CSV Export
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-penta-green/10 text-penta-green rounded-md border border-penta-green/20">
                  Interactive
                </span>
              </h2>
              <p className="text-xs text-penta-muted">
                Select columns, customize header aliases, configure formatting, and download directly.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-penta-muted hover:text-white rounded-xl hover:bg-penta-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Quick Presets */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-penta-input/60 p-3 rounded-2xl border border-penta-border/50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-penta-green" />
              <span className="font-semibold text-white">Smart Column Presets:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => applyPreset('all')}
                className="px-3 py-1.5 rounded-lg bg-penta-card border border-penta-border hover:border-penta-green text-penta-text hover:text-white transition-all font-medium"
              >
                All Columns (8)
              </button>
              <button
                onClick={() => applyPreset('audit')}
                className="px-3 py-1.5 rounded-lg bg-penta-card border border-penta-border hover:border-penta-green text-penta-text hover:text-white transition-all font-medium"
              >
                Financial Audit (7)
              </button>
              <button
                onClick={() => applyPreset('minimal')}
                className="px-3 py-1.5 rounded-lg bg-penta-card border border-penta-border hover:border-penta-green text-penta-text hover:text-white transition-all font-medium"
              >
                Minimal Summary (5)
              </button>
            </div>
          </div>

          {/* Column Selection & Header Renaming Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-penta-green" />
                Columns & Header Aliases ({selectedCount} of {columns.length} selected)
              </h3>
              <span className="text-penta-dim">Click checkbox to include, edit text to rename header</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {columns.map((col) => (
                <div
                  key={col.key}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    col.selected
                      ? 'bg-penta-input/80 border-penta-green/40 shadow-xs'
                      : 'bg-penta-input/30 border-penta-border/50 opacity-60'
                  }`}
                >
                  <button
                    onClick={() => toggleColumn(col.key)}
                    className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer"
                  >
                    {col.selected ? (
                      <CheckSquare className="w-4 h-4 text-penta-green shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-penta-dim shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{col.defaultLabel}</p>
                      <p className="text-[10px] text-penta-muted truncate">{col.description}</p>
                    </div>
                  </button>

                  {/* Header Alias Input */}
                  {col.selected && (
                    <div className="w-36 shrink-0">
                      <input
                        type="text"
                        value={col.alias}
                        onChange={(e) => updateAlias(col.key, e.target.value)}
                        placeholder="Column alias"
                        className="w-full bg-penta-card border border-penta-border rounded-lg px-2.5 py-1 text-xs text-white placeholder-penta-dim focus:outline-none focus:border-penta-green"
                        title="Custom column title in exported file"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Format Settings & Scope */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Delimiter */}
            <div className="bg-penta-input/60 p-4 rounded-2xl border border-penta-border/50">
              <label className="block font-bold text-white mb-2">CSV Delimiter</label>
              <div className="space-y-1.5">
                {[
                  { value: ',', label: 'Comma (,)' },
                  { value: ';', label: 'Semicolon (;)' },
                  { value: '\t', label: 'Tab (TSV)' },
                ].map((d) => (
                  <label
                    key={d.value}
                    className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-penta-card transition-colors"
                  >
                    <input
                      type="radio"
                      name="delimiter"
                      value={d.value}
                      checked={delimiter === d.value}
                      onChange={(e) => setDelimiter(e.target.value)}
                      className="text-penta-green focus:ring-0"
                    />
                    <span className="text-penta-text font-medium">{d.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Format */}
            <div className="bg-penta-input/60 p-4 rounded-2xl border border-penta-border/50">
              <label className="block font-bold text-white mb-2">Date Format</label>
              <div className="space-y-1.5">
                {[
                  { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD (2024-01-15)' },
                  { value: 'us', label: 'MM/DD/YYYY (01/15/2024)' },
                  { value: 'readable', label: 'Human Readable (Jan 15 2024)' },
                  { value: 'iso', label: 'Full ISO 8601' },
                ].map((df) => (
                  <label
                    key={df.value}
                    className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-penta-card transition-colors"
                  >
                    <input
                      type="radio"
                      name="dateFormat"
                      value={df.value}
                      checked={dateFormat === df.value}
                      onChange={(e) => setDateFormat(e.target.value)}
                      className="text-penta-green focus:ring-0"
                    />
                    <span className="text-penta-text font-medium">{df.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Export Scope */}
            <div className="bg-penta-input/60 p-4 rounded-2xl border border-penta-border/50">
              <label className="block font-bold text-white mb-2">Export Scope</label>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-penta-card transition-colors">
                  <input
                    type="radio"
                    name="scope"
                    value="filtered"
                    checked={exportScope === 'filtered'}
                    onChange={() => setExportScope('filtered')}
                    className="text-penta-green focus:ring-0"
                  />
                  <span className="text-penta-text font-medium">
                    Current Filtered ({totalFilteredCount} records)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-penta-card transition-colors">
                  <input
                    type="radio"
                    name="scope"
                    value="all"
                    checked={exportScope === 'all'}
                    onChange={() => setExportScope('all')}
                    className="text-penta-green focus:ring-0"
                  />
                  <span className="text-penta-text font-medium">All Records in Database (300 records)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Live CSV Preview */}
          <div className="bg-penta-input/60 p-4 rounded-2xl border border-penta-border/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-penta-green" />
                <h4 className="font-bold text-white">Live CSV Preview (First 3 Sample Rows)</h4>
              </div>
              <span className="text-penta-dim">Simulated output matching your custom configuration</span>
            </div>

            <div className="overflow-x-auto bg-penta-card rounded-xl border border-penta-border/70 p-2 font-mono text-[11px]">
              {previewRows.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-penta-border text-penta-green font-bold">
                      {Object.keys(previewRows[0]).map((h) => (
                        <th key={h} className="py-1 px-3 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-penta-border/30 text-penta-text">
                    {previewRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-penta-border/20">
                        {Object.values(row).map((val, cIdx) => (
                          <td key={cIdx} className="py-1.5 px-3 whitespace-nowrap">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-penta-muted p-2">Select at least one column to preview output</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-penta-border/60 bg-penta-input/50 flex items-center justify-between">
          <div className="text-xs text-penta-muted">
            Format: <span className="text-white font-mono">{delimiter === '\t' ? 'TSV (Tab)' : delimiter === ';' ? 'CSV (Semicolon)' : 'CSV (Comma)'}</span> |{' '}
            Target: <span className="text-white font-semibold">{exportScope === 'filtered' ? `${totalFilteredCount} filtered items` : 'All database records'}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isExporting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-penta-muted hover:text-white hover:bg-penta-card border border-penta-border transition-all"
            >
              Cancel
            </button>

            <button
              onClick={handleExport}
              disabled={isExporting || selectedCount === 0}
              className="flex items-center gap-2 bg-penta-green hover:bg-penta-greenHover text-black px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-glow hover:shadow-[0_0_25px_rgba(32,223,116,0.4)] disabled:opacity-50 disabled:pointer-events-none active:scale-95"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Generating Report...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download CSV Directly</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
