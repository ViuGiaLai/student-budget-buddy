import { useEffect } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Header } from '@/components/home/Header';
import { BalanceCard } from '@/components/home/BalanceCard';
import { QuickActions } from '@/components/home/QuickActions';
import { BudgetOverview } from '@/components/home/BudgetOverview';
import { RecentTransactions } from '@/components/home/RecentTransactions';
import { useAuth } from '@/contexts/AuthContext';
import { useExpenseStore } from '@/hooks/useExpenseStore';

const Index = () => {
  const { user } = useAuth();
  const { userId: storeUserId, initializeStore } = useExpenseStore();

  // Initialize store when user logs in
  useEffect(() => {
    if (user && user.id && !storeUserId) {
      initializeStore(user.id);
    }
  }, [user, storeUserId, initializeStore]);

  return (
    <MobileLayout>
      <Header />
      <BalanceCard />
      <QuickActions />
      <BudgetOverview />
      <RecentTransactions />
    </MobileLayout>
  );
};

export default Index;
