import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, Budget, SavingsGoal, Category } from '@/types/expense';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface ExpenseState {
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  
  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // Budget actions
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  
  // Savings goals actions
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  addToSavings: (id: string, amount: number) => void;
  
  // Computed values
  getTotalIncome: (period?: 'week' | 'month' | 'all') => number;
  getTotalExpense: (period?: 'week' | 'month' | 'all') => number;
  getBalance: (period?: 'week' | 'month' | 'all') => number;
  getCategoryExpenses: (period?: 'week' | 'month' | 'all') => Record<Category, number>;
  getBudgetStatus: (budgetId: string) => { spent: number; remaining: number; percentage: number };
  getTransactionsByDateRange: (start: Date, end: Date) => Transaction[];
  searchTransactions: (query: string) => Transaction[];
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const getDateRange = (period?: 'week' | 'month' | 'all'): { start: Date; end: Date } | null => {
  if (!period || period === 'all') return null;
  
  const now = new Date();
  if (period === 'week') {
    return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
  }
  return { start: startOfMonth(now), end: endOfMonth(now) };
};

const filterTransactionsByPeriod = (transactions: Transaction[], period?: 'week' | 'month' | 'all'): Transaction[] => {
  const range = getDateRange(period);
  if (!range) return transactions;
  
  return transactions.filter(t => 
    isWithinInterval(new Date(t.date), { start: range.start, end: range.end })
  );
};

// Sample data for demo
const sampleTransactions: Transaction[] = [
  { id: '1', type: 'expense', amount: 35000, category: 'food', description: 'Cơm trưa', date: new Date(), note: '' },
  { id: '2', type: 'expense', amount: 150000, category: 'education', description: 'Sách giáo trình', date: new Date(Date.now() - 86400000), note: '' },
  { id: '3', type: 'expense', amount: 50000, category: 'transport', description: 'Xăng xe', date: new Date(Date.now() - 86400000 * 2), note: '' },
  { id: '4', type: 'income', amount: 2000000, category: 'income', description: 'Lương part-time', date: new Date(Date.now() - 86400000 * 3), note: '' },
  { id: '5', type: 'expense', amount: 120000, category: 'entertainment', description: 'Xem phim', date: new Date(Date.now() - 86400000 * 4), note: '' },
  { id: '6', type: 'expense', amount: 80000, category: 'food', description: 'Cafe với bạn', date: new Date(Date.now() - 86400000 * 5), note: '' },
];

const sampleBudgets: Budget[] = [
  { id: '1', category: 'food', limit: 2000000, period: 'monthly', spent: 0 },
  { id: '2', category: 'entertainment', limit: 500000, period: 'monthly', spent: 0 },
  { id: '3', category: 'transport', limit: 300000, period: 'weekly', spent: 0 },
];

const sampleGoals: SavingsGoal[] = [
  { id: '1', name: 'MacBook Pro', targetAmount: 35000000, currentAmount: 8500000, color: 'hsl(var(--accent-blue))' },
  { id: '2', name: 'Du lịch Đà Lạt', targetAmount: 3000000, currentAmount: 1200000, deadline: new Date('2025-03-01'), color: 'hsl(var(--accent-purple))' },
];

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      transactions: sampleTransactions,
      budgets: sampleBudgets,
      savingsGoals: sampleGoals,
      
      addTransaction: (transaction) => {
        const newTransaction = { ...transaction, id: generateId() };
        set((state) => ({ 
          transactions: [newTransaction, ...state.transactions] 
        }));
      },
      
      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map(t => 
            t.id === id ? { ...t, ...updates } : t
          )
        }));
      },
      
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter(t => t.id !== id)
        }));
      },
      
      addBudget: (budget) => {
        set((state) => ({
          budgets: [...state.budgets, { ...budget, id: generateId(), spent: 0 }]
        }));
      },
      
      updateBudget: (id, updates) => {
        set((state) => ({
          budgets: state.budgets.map(b => 
            b.id === id ? { ...b, ...updates } : b
          )
        }));
      },
      
      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter(b => b.id !== id)
        }));
      },
      
      addSavingsGoal: (goal) => {
        set((state) => ({
          savingsGoals: [...state.savingsGoals, { ...goal, id: generateId() }]
        }));
      },
      
      updateSavingsGoal: (id, updates) => {
        set((state) => ({
          savingsGoals: state.savingsGoals.map(g => 
            g.id === id ? { ...g, ...updates } : g
          )
        }));
      },
      
      deleteSavingsGoal: (id) => {
        set((state) => ({
          savingsGoals: state.savingsGoals.filter(g => g.id !== id)
        }));
      },
      
      addToSavings: (id, amount) => {
        set((state) => ({
          savingsGoals: state.savingsGoals.map(g => 
            g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g
          )
        }));
      },
      
      getTotalIncome: (period) => {
        const transactions = filterTransactionsByPeriod(get().transactions, period);
        return transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
      },
      
      getTotalExpense: (period) => {
        const transactions = filterTransactionsByPeriod(get().transactions, period);
        return transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
      },
      
      getBalance: (period) => {
        return get().getTotalIncome(period) - get().getTotalExpense(period);
      },
      
      getCategoryExpenses: (period) => {
        const transactions = filterTransactionsByPeriod(get().transactions, period);
        const expenses: Record<Category, number> = {
          food: 0, education: 0, transport: 0, entertainment: 0,
          shopping: 0, health: 0, bills: 0, income: 0, other: 0
        };
        
        transactions
          .filter(t => t.type === 'expense')
          .forEach(t => {
            expenses[t.category] += t.amount;
          });
        
        return expenses;
      },
      
      getBudgetStatus: (budgetId) => {
        const budget = get().budgets.find(b => b.id === budgetId);
        if (!budget) return { spent: 0, remaining: 0, percentage: 0 };
        
        const period = budget.period === 'weekly' ? 'week' : 'month';
        const categoryExpenses = get().getCategoryExpenses(period);
        const spent = categoryExpenses[budget.category] || 0;
        
        return {
          spent,
          remaining: Math.max(0, budget.limit - spent),
          percentage: Math.min(100, (spent / budget.limit) * 100)
        };
      },
      
      getTransactionsByDateRange: (start, end) => {
        return get().transactions.filter(t => 
          isWithinInterval(new Date(t.date), { start, end })
        );
      },
      
      searchTransactions: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().transactions.filter(t => 
          t.description.toLowerCase().includes(lowerQuery) ||
          t.note?.toLowerCase().includes(lowerQuery)
        );
      },
    }),
    {
      name: 'expense-storage',
    }
  )
);
