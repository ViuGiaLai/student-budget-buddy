import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit2, Plus } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useExpenseStore } from '@/hooks/useExpenseStore';
import { formatCurrency } from '@/lib/format';
import { toast } from 'sonner';

const InitialBalance = () => {
  const navigate = useNavigate();
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useExpenseStore();
  
  const [initialBalances, setInitialBalances] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // Lấy tất cả giao dịch có ghi chú "Số dư tháng này"
  useEffect(() => {
    const balances = transactions.filter(t => t.note === 'Số dư tháng này' && t.type === 'income');
    setInitialBalances(balances);
  }, [transactions]);

  const totalInitialBalance = initialBalances.reduce((sum, b) => sum + b.amount, 0);

  const formatInputAmount = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAddBalance = async () => {
    const parsedAmount = parseFloat(amount.replace(/[,.]/g, ''));

    if (!parsedAmount || parsedAmount <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    if (!description.trim()) {
      toast.error('Vui lòng nhập mô tả');
      return;
    }

    try {
      await addTransaction({
        type: 'income',
        amount: parsedAmount,
        category: 'income',
        description: description.trim(),
        date: new Date(),
        note: 'Số dư tháng này'
      });
      toast.success('Đã thêm số dư');
      setIsAddDialogOpen(false);
      setAmount('');
      setDescription('');
    } catch (error) {
      console.error('Error adding balance:', error);
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleEditBalance = (balance: any) => {
    setEditingId(balance.id);
    setAmount(balance.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    setDescription(balance.description);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    const parsedAmount = parseFloat(amount.replace(/[,.]/g, ''));

    if (!parsedAmount || parsedAmount <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    if (!description.trim()) {
      toast.error('Vui lòng nhập mô tả');
      return;
    }

    try {
      await updateTransaction(editingId, {
        amount: parsedAmount,
        description: description.trim()
      });
      toast.success('Đã cập nhật số dư');
      setIsEditDialogOpen(false);
      setEditingId(null);
      setAmount('');
      setDescription('');
    } catch (error) {
      console.error('Error updating balance:', error);
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleDeleteBalance = async () => {
    if (deleteId) {
      try {
        await deleteTransaction(deleteId);
        toast.success('Đã xóa số dư');
        setDeleteId(null);
      } catch (error) {
        console.error('Error deleting balance:', error);
        toast.error('Có lỗi xảy ra');
      }
    }
  };

  return (
    <MobileLayout showNav={false}>
      <header className="px-4 py-4 pt-5 border-b border-border safe-area-top" style={{ marginTop: '20px' }}>
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-muted rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-lg">Quản lý số dư</h1>
        </div>

        {/* Summary Card */}
        <div className="gradient-primary rounded-xl p-4 text-primary-foreground mt-2">
          <p className="text-xs opacity-80 mb-1">Tổng số dư ban đầu</p>
          <h2 className="text-2xl font-bold">{formatCurrency(totalInitialBalance)}</h2>
        </div>
      </header>

      <div className="flex-1 overflow-auto pb-20">
        {initialBalances.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Chưa có số dư ban đầu nào</p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Thêm số dư
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {initialBalances.map((balance) => (
              <div key={balance.id} className="p-4 hover:bg-muted/50 transition-colors group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{balance.description}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(balance.date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="text-right mr-10">
                    <p className="font-semibold text-success">{formatCurrency(balance.amount)}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditBalance(balance)}
                      className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-muted"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(balance.id)}
                      className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-muted"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {initialBalances.length > 0 && (
        <div className="fixed bottom-20 right-4 md:right-auto md:left-1/2 md:-translate-x-1/2">
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="w-12 h-12 rounded-full gradient-primary shadow-lg flex items-center justify-center text-primary-foreground hover:shadow-xl transition-shadow active:scale-95"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Add Balance Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Thêm số dư mới</DialogTitle>
            <DialogDescription>
              Nhập số tiền và mô tả cho số dư
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Số tiền (VND)</label>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(formatInputAmount(e.target.value))}
                  className="text-lg font-semibold pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">VND</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mô tả</label>
              <Input
                placeholder="Ví dụ: Số dư từ tháng trước, Quỹ dự phòng..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setAmount('');
                setDescription('');
              }}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              onClick={handleAddBalance}
              className="flex-1 gradient-primary"
            >
              Thêm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Balance Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Sửa số dư</DialogTitle>
            <DialogDescription>
              Cập nhật số tiền và mô tả
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Số tiền (VND)</label>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(formatInputAmount(e.target.value))}
                  className="text-lg font-semibold pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">VND</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mô tả</label>
              <Input
                placeholder="Ví dụ: Số dư từ tháng trước, Quỹ dự phòng..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingId(null);
                setAmount('');
                setDescription('');
              }}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="flex-1 gradient-primary"
            >
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Xóa số dư</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa số dư này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteBalance} className="flex-1">
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default InitialBalance;
