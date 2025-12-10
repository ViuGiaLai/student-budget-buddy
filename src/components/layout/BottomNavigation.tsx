import { Link, useLocation } from 'react-router-dom';
import { Home, PieChart, Target, Settings, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Trang chủ', path: '/' },
  { icon: PieChart, label: 'Thống kê', path: '/statistics' },
  { icon: Plus, label: 'Thêm', path: '/add', isCenter: true },
  { icon: Target, label: 'Mục tiêu', path: '/goals' },
  { icon: Settings, label: 'Cài đặt', path: '/settings' },
];

export const BottomNavigation = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-bottom max-w-md mx-auto w-full flex-none">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          if (item.isCenter) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative -mt-6"
              >
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-elevated transform transition-transform active:scale-95">
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
              </Link>
            );
          }
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive && "stroke-[2.5]")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
