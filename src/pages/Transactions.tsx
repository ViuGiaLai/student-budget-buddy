import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Trash2, Edit2 } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Input } from '@/components/ui/input';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { useExpenseStore } from '@/hooks/useExpenseStore';
import { useAuth } from '@/contexts/AuthContext';
import { CATEGORIES, Category, Transaction } from '@/types/expense';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const Transactions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { transactions, searchTransactions, deleteTransaction, updateTransaction } = useExpenseStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState('');
  
  let filteredTransactions = searchQuery 
    ? searchTransactions(searchQuery)
    : transactions;
  
  if (selectedCategory !== 'all') {
    filteredTransactions = filteredTransactions.filter(t => t.category === selectedCategory);
  }
  
  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteTransaction(deleteId);
        toast.success('Đã xóa giao dịch');
        setDeleteId(null);
      } catch (error) {
        console.error('Error deleting transaction:', error);
        toast.error('Có lỗi xảy ra');
      }
    }
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditingNote(transaction.note || '');
  };

  const handleSaveEdit = async () => {
    if (editingId) {
      try {
        await updateTransaction(editingId, { note: editingNote });
        toast.success('Đã cập nhật ghi chú');
        setEditingId(null);
        setEditingNote('');
      } catch (error) {
        console.error('Error updating transaction:', error);
        toast.error('Có lỗi xảy ra');
      }
    }
  };
  
  return (
    <MobileLayout showNav={false}>
      <header className="px-4 py-4 pt-5 border-b border-border safe-area-top" style={{marginTop: "20px"}}>
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-muted rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-lg">Ví của tôi</h1>
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
          {CATEGORIES.map((cat) => (
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
      
      <div className="flex-1 overflow-auto pb-20">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Không tìm thấy giao dịch nào</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="relative group">
                <TransactionItem transaction={transaction} />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditClick(transaction)}
                    className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-muted"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(transaction.id)}
                    className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-muted"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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

      {/* Edit Note Dialog */}
      <Dialog open={!!editingId} onOpenChange={() => { setEditingId(null); setEditingNote(''); }}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Sửa ghi chú</DialogTitle>
            <DialogDescription>
              Cập nhật ghi chú cho giao dịch này
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Nhập ghi chú..."
              value={editingNote}
              onChange={(e) => setEditingNote(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <DialogFooter className="flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => { setEditingId(null); setEditingNote(''); }} 
              className="flex-1"
            >
              Hủy
            </Button>
            <Button 
              onClick={handleSaveEdit} 
              className="flex-1"
            >
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default Transactions;
