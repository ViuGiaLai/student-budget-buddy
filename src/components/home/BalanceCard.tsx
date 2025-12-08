import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import { useExpenseStore } from '@/hooks/useExpenseStore';

export const BalanceCard = () => {
  const { getTotalIncome, getTotalExpense, getBalance } = useExpenseStore();
  
  const income = getTotalIncome('month');
  const expense = getTotalExpense('month');
  const balance = getBalance('month');
  
  return (
    <div className="mx-4 mt-4">
      <div className="gradient-primary rounded-2xl p-6 text-primary-foreground shadow-elevated">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 opacity-80" />
          <span className="text-sm font-medium opacity-80">Số dư tháng này</span>
        </div>
        
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">
            {formatCurrency(balance)}
          </h2>
        </div>
        
        <div className="flex gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs opacity-70">Thu nhập</p>
              <p className="font-semibold">{formatCurrency(income)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs opacity-70">Chi tiêu</p>
              <p className="font-semibold">{formatCurrency(expense)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
