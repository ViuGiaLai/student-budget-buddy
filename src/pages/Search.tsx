import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Input } from '@/components/ui/input';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { useExpenseStore } from '@/hooks/useExpenseStore';

const Search = () => {
  const navigate = useNavigate();
  const { searchTransactions } = useExpenseStore();
  const [query, setQuery] = useState('');
  
  const results = query.trim() ? searchTransactions(query) : [];
  
  return (
    <MobileLayout showNav={false}>
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border safe-area-top px-4 py-3 pt-5"style={{marginTop: "20px"}}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm giao dịch..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-11 rounded-full bg-secondary border-transparent focus-visible:ring-2 focus-visible:ring-primary/50"
              autoFocus
            />
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-auto px-4">
        {query.trim() === '' ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
              <SearchIcon className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground text-base">Nhập từ khóa để tìm kiếm</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center mb-3">
              <SearchIcon className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground text-base">Không tìm thấy kết quả nào</p>
          </div>
        ) : (
          <div className="divide-y divide-border/60 rounded-2xl overflow-hidden shadow-soft border border-border/60 bg-card">
            {results.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default Search;
