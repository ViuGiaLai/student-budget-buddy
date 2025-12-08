import { Transaction, getCategoryInfo } from '@/types/expense';
import { formatCurrency, formatRelativeDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { UtensilsCrossed, GraduationCap, Car, Gamepad2, ShoppingBag, Heart, Receipt, Wallet, MoreHorizontal, Circle, LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed, GraduationCap, Car, Gamepad2, ShoppingBag, Heart, Receipt, Wallet, MoreHorizontal, Circle
};

interface TransactionItemProps {
  transaction: Transaction;
  showDivider?: boolean;
  onClick?: () => void;
}

export const TransactionItem = ({ transaction, showDivider = false, onClick }: TransactionItemProps) => {
  const categoryInfo = getCategoryInfo(transaction.category);
  const IconComponent = iconMap[categoryInfo.icon] || Circle;
  const isIncome = transaction.type === 'income';
  
  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-4 active:bg-muted/50 transition-colors cursor-pointer",
        showDivider && "border-b border-border/50"
      )}
      onClick={onClick}
    >
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${categoryInfo.color}15` }}
      >
        <IconComponent className="w-5 h-5" style={{ color: categoryInfo.color }} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{transaction.description}</p>
        <p className="text-xs text-muted-foreground">{formatRelativeDate(transaction.date)}</p>
      </div>
      
      <span className={cn(
        "font-semibold text-sm shrink-0",
        isIncome ? "text-success" : "text-foreground"
      )}>
        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
      </span>
    </div>
  );
};
