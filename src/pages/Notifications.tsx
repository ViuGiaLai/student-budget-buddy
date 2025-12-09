import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, AlertTriangle, Target, TrendingUp } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useExpenseStore } from '@/hooks/useExpenseStore';
import { getCategoryInfo } from '@/types/expense';
import { formatCurrency } from '@/lib/format';

const Notifications = () => {
  const navigate = useNavigate();
  const { budgets, getBudgetStatus, savingsGoals } = useExpenseStore();
  
  // Generate notifications based on budget status
  const budgetAlerts = budgets
    .map(budget => {
      const status = getBudgetStatus(budget.id);
      const category = getCategoryInfo(budget.category);
      
      if (status.percentage >= 100) {
        return {
          id: `budget-over-${budget.id}`,
          type: 'warning' as const,
          icon: AlertTriangle,
          title: `Vượt ngân sách ${category.name}`,
          message: `Bạn đã chi ${formatCurrency(status.spent)} / ${formatCurrency(budget.limit)}`,
          time: 'Hôm nay',
          color: 'hsl(var(--destructive))',
        };
      } else if (status.percentage >= 80) {
        return {
          id: `budget-warning-${budget.id}`,
          type: 'info' as const,
          icon: Bell,
          title: `Sắp vượt ngân sách ${category.name}`,
          message: `Đã sử dụng ${status.percentage.toFixed(0)}% ngân sách`,
          time: 'Hôm nay',
          color: 'hsl(var(--warning))',
        };
      }
      return null;
    })
    .filter(Boolean);
  
  // Generate notifications for savings goals near completion
  const goalAlerts = savingsGoals
    .filter(goal => {
      const percentage = (goal.currentAmount / goal.targetAmount) * 100;
      return percentage >= 80 && percentage < 100;
    })
    .map(goal => ({
      id: `goal-${goal.id}`,
      type: 'success' as const,
      icon: Target,
      title: `Sắp đạt mục tiêu "${goal.name}"`,
      message: `Chỉ còn ${formatCurrency(goal.targetAmount - goal.currentAmount)} nữa!`,
      time: 'Hôm nay',
      color: 'hsl(var(--success))',
    }));
  
  const allNotifications = [...budgetAlerts, ...goalAlerts];
  
  return (
    <MobileLayout showNav={false}>
      <header className="px-4 py-4 pt-5 border-b border-border safe-area-top"style={{marginTop: "20px"}}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-muted rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-lg">Thông báo</h1>
        </div>
      </header>
      
      <div className="flex-1 overflow-auto">
        {allNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Không có thông báo</h3>
            <p className="text-sm text-muted-foreground">Bạn sẽ nhận thông báo khi có cảnh báo chi tiêu</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {allNotifications.map((notification) => {
              const Icon = notification!.icon;
              return (
                <div key={notification!.id} className="p-4 flex gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${notification!.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: notification!.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{notification!.title}</p>
                    <p className="text-sm text-muted-foreground">{notification!.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification!.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default Notifications;
