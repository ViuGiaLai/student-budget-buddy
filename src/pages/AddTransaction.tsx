import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, UtensilsCrossed, GraduationCap, Car, Gamepad2, ShoppingBag, Heart, Receipt, Wallet, MoreHorizontal, Circle, LucideIcon } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useExpenseStore } from '@/hooks/useExpenseStore';
import { useAuth } from '@/contexts/AuthContext';
import { CATEGORIES, Category, TransactionType } from '@/types/expense';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed, GraduationCap, Car, Gamepad2, ShoppingBag, Heart, Receipt, Wallet, MoreHorizontal, Circle
};

const AddTransaction = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { addTransaction } = useExpenseStore();
  
  const initialType = searchParams.get('type') as TransactionType || 'expense';
  
  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>(type === 'income' ? 'income' : 'food');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  
  const expenseCategories = CATEGORIES.filter(c => c.id !== 'income');
  const incomeCategories = CATEGORIES.filter(c => c.id === 'income' || c.id === 'other');
  
  const displayCategories = type === 'income' ? incomeCategories : expenseCategories;
  
  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ');
      return;
    }
    if (!description.trim()) {
      toast.error('Vui lòng nhập mô tả');
      return;
    }
    
    try {
      await addTransaction({
        type,
        amount: parseFloat(amount.replace(/[,.]/g, '')),
        category,
        description: description.trim(),
        date: new Date(),
        note: note.trim(),
      });
      toast.success(type === 'income' ? 'Đã thêm thu nhập' : 'Đã thêm chi tiêu');
      navigate('/');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Có lỗi xảy ra');
    }
  };
  
  const formatInputAmount = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  return (
    <MobileLayout showNav={false} > 
      {/* <header className="px-4 py-4 pt-5 flex items-center gap-4 border-b border-border safe-area-top" style={{marginTop: "20px"}}>
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-muted rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-lg">Thêm giao dịch</h1>
      </header> */}
      
      <div className="p-4 space-y-6 mt-2">
        <div className="flex bg-secondary rounded-xl p-1">
          <button
            onClick={() => { setType('expense'); setCategory('food'); }}
            className={cn("flex-1 py-3 rounded-lg font-medium text-sm transition-all", type === 'expense' ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}
          >Chi tiêu</button>
          <button
            onClick={() => { setType('income'); setCategory('income'); }}
            className={cn("flex-1 py-3 rounded-lg font-medium text-sm transition-all", type === 'income' ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}
          >Thu nhập</button>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Số tiền</label>
          <div className="relative">
            <Input type="text" inputMode="numeric" placeholder="0" value={amount} onChange={(e) => setAmount(formatInputAmount(e.target.value))} className="text-2xl font-bold h-14 pr-16" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">VND</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Danh mục</label>
          <div className="grid grid-cols-4 gap-2">
            {displayCategories.map((cat) => {
              const IconComponent = iconMap[cat.icon] || Circle;
              const isSelected = category === cat.id;
              return (
                <button key={cat.id} onClick={() => setCategory(cat.id)} className={cn("flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all", isSelected ? "border-primary bg-primary/5" : "border-transparent bg-secondary hover:bg-secondary/80")}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}20` }}>
                    <IconComponent className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <span className="text-xs font-medium text-center line-clamp-1">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Mô tả</label>
          <Input placeholder="Ví dụ: Cơm trưa, Tiền lương..." value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Ghi chú (tùy chọn)</label>
          <Textarea placeholder="Thêm ghi chú..." value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border max-w-md mx-auto safe-area-bottom">
        <Button onClick={handleSubmit} disabled={!user} className="w-full h-12 text-base font-semibold gradient-primary">
          <Check className="w-5 h-5 mr-2" />Lưu giao dịch
        </Button>
      </div>
    </MobileLayout>
  );
};

export default AddTransaction;
