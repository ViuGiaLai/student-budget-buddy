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
      <header className="px-4 py-4 border-b border-border safe-area-top">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-muted rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm giao dịch..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-auto">
        {query.trim() === '' ? (
          <div className="text-center py-12">
            <SearchIcon className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Nhập từ khóa để tìm kiếm</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Không tìm thấy kết quả nào</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
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
