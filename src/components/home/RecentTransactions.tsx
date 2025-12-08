import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { useExpenseStore } from '@/hooks/useExpenseStore';

export const RecentTransactions = () => {
  const { transactions } = useExpenseStore();
  const recentTransactions = transactions.slice(0, 5);
  
  return (
    <div className="px-4 mt-6 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-muted-foreground">Giao dịch gần đây</h3>
        <Link to="/transactions" className="text-xs text-primary font-medium flex items-center gap-1">
          Xem tất cả <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      
      {recentTransactions.length === 0 ? (
        <div className="bg-secondary rounded-xl p-4 text-center">
          <p className="text-sm text-muted-foreground">Chưa có giao dịch nào</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-soft border border-border/50 overflow-hidden">
          {recentTransactions.map((transaction, index) => (
            <TransactionItem 
              key={transaction.id} 
              transaction={transaction}
              showDivider={index < recentTransactions.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
