import { useState } from 'react';
import { ChevronRight, Wallet, Bell, Palette, Shield, Info, Plus, Trash2 } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useExpenseStore } from '@/hooks/useExpenseStore';
import { CATEGORIES, Category } from '@/types/expense';
import { formatCurrency } from '@/lib/format';
import { toast } from 'sonner';

const Settings = () => {
  const { budgets, addBudget, deleteBudget } = useExpenseStore();
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  const [newBudget, setNewBudget] = useState({
    category: 'food' as Category,
    limit: '',
    period: 'monthly' as 'weekly' | 'monthly',
  });
  
  const expenseCategories = CATEGORIES.filter(c => c.id !== 'income');
  
  const formatInputAmount = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  const handleAddBudget = () => {
    const limit = parseFloat(newBudget.limit.replace(/[,.]/g, ''));
    if (!limit || limit <= 0) {
      toast.error('Vui lòng nhập hạn mức hợp lệ');
      return;
    }
    
    // Check if budget for this category already exists
    const exists = budgets.find(b => b.category === newBudget.category && b.period === newBudget.period);
    if (exists) {
      toast.error('Ngân sách cho danh mục này đã tồn tại');
      return;
    }
    
    addBudget({
      category: newBudget.category,
      limit,
      period: newBudget.period,
    });
    
    toast.success('Đã thêm ngân sách mới');
    setNewBudget({ category: 'food', limit: '', period: 'monthly' });
    setIsAddBudgetOpen(false);
  };
  
  return (
    <MobileLayout>
      <header className="px-4 py-4 pt-5 safe-area-top" style={{marginTop: "20px"}}>
        <h1 className="font-bold text-xl">Cài đặt</h1>
      </header>
      
      <div className="px-4 space-y-6">
        {/* Budget Management */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold flex items-center gap-2">
              <Wallet className="w-4 h-4 text-primary" />
              Ngân sách
            </h2>
            <Dialog open={isAddBudgetOpen} onOpenChange={setIsAddBudgetOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Thêm ngân sách</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Danh mục</label>
                    <Select 
                      value={newBudget.category} 
                      onValueChange={(v) => setNewBudget(prev => ({ ...prev, category: v as Category }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Hạn mức</label>
                    <div className="relative">
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        value={newBudget.limit}
                        onChange={(e) => setNewBudget(prev => ({ ...prev, limit: formatInputAmount(e.target.value) }))}
                        className="pr-16"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        VND
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Chu kỳ</label>
                    <Select 
                      value={newBudget.period} 
                      onValueChange={(v) => setNewBudget(prev => ({ ...prev, period: v as 'weekly' | 'monthly' }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Hàng tuần</SelectItem>
                        <SelectItem value="monthly">Hàng tháng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={handleAddBudget} className="w-full gradient-primary">
                    Thêm ngân sách
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {budgets.length === 0 ? (
            <div className="bg-secondary rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">Chưa có ngân sách nào</p>
            </div>
          ) : (
            <div className="space-y-2">
              {budgets.map((budget) => {
                const category = CATEGORIES.find(c => c.id === budget.category);
                return (
                  <div key={budget.id} className="flex items-center justify-between bg-card rounded-xl p-3 border border-border/50">
                    <div>
                      <p className="font-medium text-sm">{category?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(budget.limit)} / {budget.period === 'weekly' ? 'tuần' : 'tháng'}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        deleteBudget(budget.id);
                        toast.success('Đã xóa ngân sách');
                      }}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
        
        {/* Notifications */}
        <section>
          <h2 className="font-semibold flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-accent-purple" />
            Thông báo
          </h2>
          <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-sm">Cảnh báo vượt ngân sách</p>
                <p className="text-xs text-muted-foreground">Nhận thông báo khi chi tiêu vượt hạn mức</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-sm">Nhắc nhở hàng ngày</p>
                <p className="text-xs text-muted-foreground">Nhắc nhở ghi chép chi tiêu</p>
              </div>
              <Switch />
            </div>
          </div>
        </section>
        
        {/* App Info */}
        <section>
          <h2 className="font-semibold flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-accent-blue" />
            Thông tin ứng dụng
          </h2>
          <div className="bg-card rounded-xl border border-border/50">
            <div className="flex items-center justify-between p-4">
              <span className="text-sm">Phiên bản</span>
              <span className="text-sm text-muted-foreground">
                {import.meta.env.VITE_APP_VERSION}
              </span>
            </div>
          </div>
        </section>
      </div>
    </MobileLayout>
  );
};

export default Settings;
