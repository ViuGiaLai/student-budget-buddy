import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import zp from 'zmp-sdk';
import { BottomNavigation } from './BottomNavigation';

const TITLE_MAP: Record<string, string> = {
  '/': 'Trang chủ',
  '/statistics': 'Thống kê',
  '/goals': 'Mục tiêu',
  '/settings': 'Cài đặt',
  '/settings/budgets': 'Cài đặt',
  '/add': 'Thêm giao dịch',
  '/transactions': 'Giao dịch',
  '/search': 'Tìm kiếm',
  '/notifications': 'Thông báo',
};

interface MobileLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export const MobileLayout = ({ children, showNav = true }: MobileLayoutProps) => {
  const location = useLocation();

  useEffect(() => {
    const title = TITLE_MAP[location.pathname] || 'Student Budget Buddy';
    document.title = title;

    // Cập nhật title cho thanh header của mini app (nếu SDK khả dụng)
    try {
      const zmp = zp as any;
      // zp.ready đảm bảo gọi đúng khi đang chạy trong môi trường mini app
      zmp?.ready?.(() => {
        try {
          zmp?.setNavigationBarTitle?.({ title });
        } catch (error) {
          console.warn('Unable to set navigation bar title', error);
        }
      });
    } catch (error) {
      console.warn('ZP SDK not available', error);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      <main className="flex-1 overflow-auto pb-20">
        {children}
      </main>
      {showNav && <BottomNavigation />}
    </div>
  );
};
