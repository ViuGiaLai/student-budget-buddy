import { MobileLayout } from '@/components/layout/MobileLayout';
import { Header } from '@/components/home/Header';
import { BalanceCard } from '@/components/home/BalanceCard';
import { QuickActions } from '@/components/home/QuickActions';
import { BudgetOverview } from '@/components/home/BudgetOverview';
import { RecentTransactions } from '@/components/home/RecentTransactions';

const Index = () => {
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
