import { Link } from 'react-router-dom';
import { ChevronRight, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useExpenseStore } from '@/hooks/useExpenseStore';
import { getCategoryInfo } from '@/types/expense';
import { formatShortCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

export const BudgetOverview = () => {
  const { budgets, getBudgetStatus } = useExpenseStore();
  
  if (budgets.length === 0) {
    return (
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Ngân sách</h3>
          <Link to="/settings/budgets" className="text-xs text-primary font-medium flex items-center gap-1">
            Thêm mới <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="bg-secondary rounded-xl p-4 text-center">
          <p className="text-sm text-muted-foreground">Chưa có ngân sách nào</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-4 mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-muted-foreground">Ngân sách tháng này</h3>
        <Link to="/settings/budgets" className="text-xs text-primary font-medium flex items-center gap-1">
          Xem tất cả <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      
      <div className="space-y-3">
        {budgets.slice(0, 3).map((budget) => {
          const status = getBudgetStatus(budget.id);
          const categoryInfo = getCategoryInfo(budget.category);
          const isOverBudget = status.percentage >= 100;
          const isWarning = status.percentage >= 80;
          
          return (
            <div key={budget.id} className="bg-card rounded-xl p-4 shadow-soft border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${categoryInfo.color}20` }}
                  >
                    <span className="text-sm" style={{ color: categoryInfo.color }}>
                      {categoryInfo.name.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium text-sm">{categoryInfo.name}</span>
                  {isOverBudget && (
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatShortCurrency(status.spent)} / {formatShortCurrency(budget.limit)}
                </span>
              </div>
              
              <Progress 
                value={Math.min(status.percentage, 100)} 
                className={cn(
                  "h-2",
                  isOverBudget && "[&>div]:bg-destructive",
                  isWarning && !isOverBudget && "[&>div]:bg-warning"
                )}
              />
              
              <p className={cn(
                "text-xs mt-2",
                isOverBudget ? "text-destructive" : "text-muted-foreground"
              )}>
                {isOverBudget 
                  ? `Vượt ${formatShortCurrency(status.spent - budget.limit)}`
                  : `Còn lại ${formatShortCurrency(status.remaining)}`
                }
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
