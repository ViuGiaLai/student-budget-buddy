import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Trash2 } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Input } from '@/components/ui/input';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { useExpenseStore } from '@/hooks/useExpenseStore';
import { CATEGORIES, Category } from '@/types/expense';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const Transactions = () => {
  const navigate = useNavigate();
  const { transactions, searchTransactions, deleteTransaction } = useExpenseStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  let filteredTransactions = searchQuery 
    ? searchTransactions(searchQuery)
    : transactions;
  
  if (selectedCategory !== 'all') {
    filteredTransactions = filteredTransactions.filter(t => t.category === selectedCategory);
  }
  
  const handleDelete = () => {
    if (deleteId) {
      deleteTransaction(deleteId);
      toast.success('Đã xóa giao dịch');
      setDeleteId(null);
    }
  };
  
  return (
    <MobileLayout showNav={false}>
      <header className="px-4 py-4 border-b border-border safe-area-top">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-muted rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-lg">Tất cả giao dịch</h1>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm giao dịch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Category Filter */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 -mx-4 px-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
              selectedCategory === 'all'
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground"
            )}
          >
            Tất cả
          </button>
          {CATEGORIES.filter(c => c.id !== 'income').map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>
      
      <div className="flex-1 overflow-auto">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Không tìm thấy giao dịch nào</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="relative group">
                <TransactionItem transaction={transaction} />
                <button
                  onClick={() => setDeleteId(transaction.id)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Xóa giao dịch</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa giao dịch này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="flex-1">
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default Transactions;
