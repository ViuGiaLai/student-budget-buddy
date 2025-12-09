import { TrendingUp, TrendingDown, Wallet, Eye, EyeOff, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/lib/format';
import { useExpenseStore } from '@/hooks/useExpenseStore';

export const BalanceCard = () => {
  const navigate = useNavigate();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const { getTotalIncome, getTotalExpense, getBalance } = useExpenseStore();
  
  const income = getTotalIncome('month');
  const expense = getTotalExpense('month');
  const balance = getBalance('month');
  
  const handleBalanceClick = () => {
    navigate('/transactions');
  };
  
  const toggleBalanceVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBalanceVisible(!isBalanceVisible);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/initial-balance');
  };
  
  return (
    <div className="mx-4 mt-4">
      <div 
        onClick={handleBalanceClick}
        className="gradient-primary rounded-2xl p-6 text-primary-foreground shadow-elevated cursor-pointer hover:shadow-lg transition-shadow active:scale-95 relative group"
      >
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 opacity-80" />
            <span className="text-sm font-medium opacity-80">Số dư tháng này</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEditClick}
              className="p-1 hover:bg-primary-foreground/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <Edit2 className="w-5 h-5 opacity-80" />
            </button>
            <button
              onClick={toggleBalanceVisibility}
              className="p-1 hover:bg-primary-foreground/10 rounded-lg transition-colors"
            >
              {isBalanceVisible ? (
                <Eye className="w-5 h-5 opacity-80" />
              ) : (
                <EyeOff className="w-5 h-5 opacity-80" />
              )}
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight transition-opacity duration-300">
            {isBalanceVisible ? formatCurrency(balance) : '•••••••••'}
          </h2>
        </div>
        
        <div className="flex gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs opacity-70">Thu nhập</p>
              <p className="font-semibold transition-opacity duration-300">{isBalanceVisible ? formatCurrency(income) : '•••••••••'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs opacity-70">Chi tiêu</p>
              <p className="font-semibold transition-opacity duration-300">{isBalanceVisible ? formatCurrency(expense) : '•••••••••'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
