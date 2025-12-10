import { Bell, Search, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

export const Header = () => {
  const { user, logout, loading } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Chào buổi sáng');
    else if (hour < 18) setGreeting('Chào buổi chiều');
    else setGreeting('Chào buổi tối');
  }, []);

  const handleLogout = () => {
    logout();
  };
  
  return (
    <header className="px-4 pt-6 pb-3 safe-area-top" style={{ marginTop: '20px' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-primary/20">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {user ? user.name.charAt(0).toUpperCase() : 'SV'}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="text-xs text-muted-foreground">{greeting} 👋</p>
            <h1 className="font-semibold text-foreground">
              {user ? user.name : 'Đang tải...'}
            </h1>
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
          {/* <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="text-muted-foreground hover:bg-secondary/80"
            disabled={loading}
          >
            <LogOut className="w-5 h-5" />
          </Button> */}
        </div>
      </div>
    </header>
  );
};
