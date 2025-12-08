import { useState } from 'react';
import { Plus, Target, Trash2, PiggyBank } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useExpenseStore } from '@/hooks/useExpenseStore';
import { formatCurrency, formatShortCurrency, formatDate } from '@/lib/format';
import { toast } from 'sonner';

const GOAL_COLORS = [
  'hsl(var(--accent-blue))',
  'hsl(var(--accent-purple))',
  'hsl(var(--accent-orange))',
  'hsl(var(--primary))',
  'hsl(var(--accent-pink))',
];

const Goals = () => {
  const { savingsGoals, addSavingsGoal, addToSavings, deleteSavingsGoal } = useExpenseStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addAmountId, setAddAmountId] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState('');
  
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    color: GOAL_COLORS[0],
  });
  
  const handleCreateGoal = () => {
    if (!newGoal.name.trim()) {
      toast.error('Vui lòng nhập tên mục tiêu');
      return;
    }
    
    const target = parseFloat(newGoal.targetAmount.replace(/[,.]/g, ''));
    if (!target || target <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ');
      return;
    }
    
    addSavingsGoal({
      name: newGoal.name.trim(),
      targetAmount: target,
      currentAmount: 0,
      deadline: newGoal.deadline ? new Date(newGoal.deadline) : undefined,
      color: newGoal.color,
    });
    
    toast.success('Đã tạo mục tiêu mới');
    setNewGoal({ name: '', targetAmount: '', deadline: '', color: GOAL_COLORS[0] });
    setIsAddOpen(false);
  };
  
  const handleAddToSavings = (goalId: string) => {
    const amount = parseFloat(addAmount.replace(/[,.]/g, ''));
    if (!amount || amount <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ');
      return;
    }
    
    addToSavings(goalId, amount);
    toast.success(`Đã thêm ${formatCurrency(amount)} vào mục tiêu`);
    setAddAmount('');
    setAddAmountId(null);
  };
  
  const formatInputAmount = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  return (
    <MobileLayout>
      <header className="px-4 py-4 flex items-center justify-between safe-area-top">
        <h1 className="font-bold text-xl">Mục tiêu tiết kiệm</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-primary">
              <Plus className="w-4 h-4 mr-1" />
              Thêm
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] rounded-2xl">
            <DialogHeader>
              <DialogTitle>Tạo mục tiêu mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tên mục tiêu</label>
                <Input
                  placeholder="Ví dụ: Mua laptop, Du lịch..."
                  value={newGoal.name}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Số tiền mục tiêu</label>
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: formatInputAmount(e.target.value) }))}
                    className="pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    VND
                  </span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Hạn hoàn thành (tùy chọn)</label>
                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Màu sắc</label>
                <div className="flex gap-2 mt-2">
                  {GOAL_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewGoal(prev => ({ ...prev, color }))}
                      className="w-8 h-8 rounded-full border-2 transition-transform"
                      style={{ 
                        backgroundColor: color,
                        borderColor: newGoal.color === color ? 'hsl(var(--foreground))' : 'transparent',
                        transform: newGoal.color === color ? 'scale(1.1)' : 'scale(1)'
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <Button onClick={handleCreateGoal} className="w-full gradient-primary">
                Tạo mục tiêu
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>
      
      <div className="px-4 space-y-4">
        {savingsGoals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Chưa có mục tiêu nào</h3>
            <p className="text-sm text-muted-foreground">Tạo mục tiêu tiết kiệm đầu tiên của bạn</p>
          </div>
        ) : (
          savingsGoals.map((goal) => {
            const percentage = (goal.currentAmount / goal.targetAmount) * 100;
            const isComplete = percentage >= 100;
            
            return (
              <div key={goal.id} className="bg-card rounded-2xl p-4 shadow-soft border border-border/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${goal.color}20` }}
                    >
                      <PiggyBank className="w-6 h-6" style={{ color: goal.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{goal.name}</h3>
                      {goal.deadline && (
                        <p className="text-xs text-muted-foreground">
                          Hạn: {formatDate(goal.deadline)}
                        </p>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      deleteSavingsGoal(goal.id);
                      toast.success('Đã xóa mục tiêu');
                    }}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{formatShortCurrency(goal.currentAmount)}</span>
                    <span className="text-muted-foreground">{formatShortCurrency(goal.targetAmount)}</span>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className="h-2.5"
                    style={{ '--progress-color': goal.color } as React.CSSProperties}
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {percentage.toFixed(1)}% hoàn thành
                  </p>
                </div>
                
                {!isComplete && (
                  addAmountId === goal.id ? (
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="Số tiền"
                        value={addAmount}
                        onChange={(e) => setAddAmount(formatInputAmount(e.target.value))}
                        className="flex-1"
                      />
                      <Button 
                        size="sm"
                        onClick={() => handleAddToSavings(goal.id)}
                        style={{ backgroundColor: goal.color }}
                      >
                        Thêm
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => {
                          setAddAmountId(null);
                          setAddAmount('');
                        }}
                      >
                        Hủy
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setAddAmountId(goal.id)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm tiền tiết kiệm
                    </Button>
                  )
                )}
                
                {isComplete && (
                  <div className="bg-success/10 text-success text-center py-2 rounded-lg text-sm font-medium">
                    🎉 Đã hoàn thành mục tiêu!
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </MobileLayout>
  );
};

export default Goals;
