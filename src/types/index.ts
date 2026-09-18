export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  user: User;
}

export interface Transaction {
  _id: string;
  id: number;
  date: string;
  amount: number;
  category: 'Revenue' | 'Expense';
  status: 'Paid' | 'Pending';
  user_id: string;
  user_name: string;
  user_profile: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TransactionResponse {
  success: boolean;
  data: Transaction[];
  pagination: PaginationMeta;
  filtersApplied: Record<string, any>;
}

export interface SummaryMetrics {
  balance: number;
  revenue: number;
  expenses: number;
  savings: number;
  savingsRate: string;
  totalTransactions: number;
  paidTransactions: number;
  pendingTransactions: number;
}

export interface TrendDataPoint {
  month: string;
  monthIndex: number;
  Income: number;
  Expenses: number;
  Net: number;
}

export interface FilterParams {
  search?: string;
  category?: string;
  status?: string;
  user_id?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: string | number;
  maxAmount?: string | number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface AlertNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
}
