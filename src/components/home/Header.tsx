import { Bell, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const Header = () => {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };
  
  return (
    <header className="px-4 pt-4 pb-2 safe-area-top">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              SV
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs text-muted-foreground">{greeting()} 👋</p>
            <h1 className="font-semibold text-foreground">Sinh viên</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link 
            to="/search"
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <Search className="w-5 h-5 text-muted-foreground" />
          </Link>
          <Link 
            to="/notifications"
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors relative"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent-orange rounded-full" />
          </Link>
        </div>
      </div>
    </header>
  );
};
