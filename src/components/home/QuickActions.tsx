import { Link } from 'react-router-dom';
import { Plus, Minus, PiggyBank, BarChart3 } from 'lucide-react';

const actions = [
  { icon: Plus, label: 'Thu nhập', path: '/add?type=income', gradient: 'gradient-primary' },
  { icon: Minus, label: 'Chi tiêu', path: '/add?type=expense', gradient: 'gradient-accent-orange' },
  { icon: PiggyBank, label: 'Tiết kiệm', path: '/goals', gradient: 'gradient-accent-purple' },
  { icon: BarChart3, label: 'Báo cáo', path: '/statistics', gradient: 'gradient-accent-blue' },
];

export const QuickActions = () => {
  return (
    <div className="px-4 mt-6">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3">Thao tác nhanh</h3>
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.path}
              to={action.path}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`w-12 h-12 rounded-xl ${action.gradient} flex items-center justify-center shadow-soft transform transition-all group-active:scale-95`}>
                <Icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xs font-medium text-foreground">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
