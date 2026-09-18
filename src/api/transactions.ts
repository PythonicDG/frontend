import { apiClient } from './client';
import {
  TransactionResponse,
  SummaryMetrics,
  TrendDataPoint,
  Transaction,
  FilterParams,
} from '../types';

export interface ExportCSVPayload {
  columns: string[];
  columnAliases?: Record<string, string>;
  delimiter?: string;
  dateFormat?: string;
  exportAll?: boolean;
  filters?: FilterParams;
}

export const transactionApi = {
  getTransactions: async (params: FilterParams = {}): Promise<TransactionResponse> => {
    const res = await apiClient.get<TransactionResponse>('/transactions', { params });
    return res.data;
  },

  getSummary: async (params: FilterParams = {}): Promise<{ success: boolean; data: SummaryMetrics }> => {
    const res = await apiClient.get<{ success: boolean; data: SummaryMetrics }>('/transactions/analytics/summary', { params });
    return res.data;
  },

  getTrends: async (year: number = 2024): Promise<{ success: boolean; data: TrendDataPoint[]; year: number }> => {
    const res = await apiClient.get<{ success: boolean; data: TrendDataPoint[]; year: number }>('/transactions/analytics/trends', {
      params: { year },
    });
    return res.data;
  },

  getRecent: async (limit: number = 5): Promise<{ success: boolean; data: Transaction[] }> => {
    const res = await apiClient.get<{ success: boolean; data: Transaction[] }>('/transactions/recent', {
      params: { limit },
    });
    return res.data;
  },

  // Export CSV and initiate direct browser download
  exportCSV: async (payload: ExportCSVPayload): Promise<{ filename: string; blob: Blob }> => {
    const response = await apiClient.post('/transactions/export', payload, {
      responseType: 'blob',
    });

    // Extract filename from Content-Disposition header if present
    let filename = `penta_transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    const disposition = response.headers['content-disposition'];
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    
    // Trigger direct browser download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { filename, blob };
  },
};
