export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'food'
  | 'education'
  | 'transport'
  | 'entertainment'
  | 'shopping'
  | 'health'
  | 'bills'
  | 'income'
  | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: Date;
  note?: string;
}

export interface Budget {
  id: string;
  category: Category;
  limit: number;
  period: 'weekly' | 'monthly';
  spent: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  color: string;
}

export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'food', name: 'Ăn uống', icon: 'UtensilsCrossed', color: 'hsl(var(--chart-food))' },
  { id: 'education', name: 'Học tập', icon: 'GraduationCap', color: 'hsl(var(--chart-education))' },
  { id: 'transport', name: 'Di chuyển', icon: 'Car', color: 'hsl(var(--chart-transport))' },
  { id: 'entertainment', name: 'Giải trí', icon: 'Gamepad2', color: 'hsl(var(--chart-entertainment))' },
  { id: 'shopping', name: 'Mua sắm', icon: 'ShoppingBag', color: 'hsl(var(--chart-shopping))' },
  { id: 'health', name: 'Sức khỏe', icon: 'Heart', color: 'hsl(var(--accent-pink))' },
  { id: 'bills', name: 'Hóa đơn', icon: 'Receipt', color: 'hsl(var(--accent-purple))' },
  { id: 'income', name: 'Thu nhập', icon: 'Wallet', color: 'hsl(var(--success))' },
  { id: 'other', name: 'Khác', icon: 'MoreHorizontal', color: 'hsl(var(--chart-other))' },
];

export const getCategoryInfo = (categoryId: Category): CategoryInfo => {
  return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[CATEGORIES.length - 1];
};
