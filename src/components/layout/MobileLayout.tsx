import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { setNavigationBarTitle } from 'zmp-sdk/apis';
import zp from 'zmp-sdk';
import { BottomNavigation } from './BottomNavigation';

const normalizePath = (raw: string) => {
  if (!raw) return '/';
  const noHash = raw.split('#')[0];
  const noQuery = noHash.split('?')[0];
  const trimmed = noQuery.replace(/\/+$/, '');
  return trimmed || '/';
};

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
    const hashPath = window.location.hash?.replace(/^#/, '') || '';
    const rawPath = location.pathname === '/' && hashPath ? hashPath : location.pathname;
    const path = normalizePath(rawPath);
    const title = TITLE_MAP[path] || 'Sổ chi tiêu Viu';
    document.title = title;

    const applyTitle = () => {
      try {
        // Ưu tiên API mới
        setNavigationBarTitle({ title });
      } catch (error) {
        // Fallback API cũ nếu cần
        const zmpAny = zp as any;
        zmpAny?.setNavigationBarTitle?.({ title });
      }
    };

    applyTitle(); // web/h5 fallback

    // Đảm bảo gọi khi mini app đã sẵn sàng
    const zmp = zp as any;
    zmp?.ready?.(() => applyTitle());
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
