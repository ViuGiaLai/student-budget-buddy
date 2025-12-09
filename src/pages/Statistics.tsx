import { useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useExpenseStore } from '@/hooks/useExpenseStore';
import { CATEGORIES } from '@/types/expense';
import { formatCurrency, formatShortCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import { PieChart as PieChartIcon, BarChart3, TrendingUp, UtensilsCrossed, GraduationCap, Car, Gamepad2, ShoppingBag, Heart, Receipt, Wallet, MoreHorizontal, Circle, LucideIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Tooltip } from 'recharts';

const iconMap: Record<string, LucideIcon> = { UtensilsCrossed, GraduationCap, Car, Gamepad2, ShoppingBag, Heart, Receipt, Wallet, MoreHorizontal, Circle };

type Period = 'week' | 'month';
type ChartType = 'pie' | 'bar' | 'line';

const Statistics = () => {
  const [period, setPeriod] = useState<Period>('month');
  const [chartType, setChartType] = useState<ChartType>('pie');
  const { getCategoryExpenses, getTotalExpense, getTotalIncome, transactions } = useExpenseStore();
  
  const categoryExpenses = getCategoryExpenses(period);
  const totalExpense = getTotalExpense(period);
  const totalIncome = getTotalIncome(period);
  
  const pieData = CATEGORIES.filter(cat => cat.id !== 'income' && categoryExpenses[cat.id] > 0).map(cat => ({ name: cat.name, value: categoryExpenses[cat.id], color: cat.color }));
  const barData = CATEGORIES.filter(cat => cat.id !== 'income').map(cat => ({ name: cat.name.substring(0, 4), fullName: cat.name, amount: categoryExpenses[cat.id], color: cat.color })).filter(item => item.amount > 0);
  
  const lineData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayTransactions = transactions.filter(t => { const tDate = new Date(t.date); return tDate.toDateString() === date.toDateString() && t.type === 'expense'; });
    return { day: date.toLocaleDateString('vi-VN', { weekday: 'short' }), amount: dayTransactions.reduce((sum, t) => sum + t.amount, 0) };
  });
  
  return (
    <MobileLayout>
      <header className="px-4 py-4 pt-5 safe-area-top" style={{marginTop: "20px"}}><h1 className="font-bold text-xl">Thống kê</h1></header>
      
      <div className="px-4 mb-4">
        <div className="flex bg-secondary rounded-xl p-1">
          <button onClick={() => setPeriod('week')} className={cn("flex-1 py-2.5 rounded-lg font-medium text-sm transition-all", period === 'week' ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}>Tuần này</button>
          <button onClick={() => setPeriod('month')} className={cn("flex-1 py-2.5 rounded-lg font-medium text-sm transition-all", period === 'month' ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}>Tháng này</button>
        </div>
      </div>
      
      <div className="px-4 grid grid-cols-2 gap-3 mb-6">
        <div className="bg-success/10 rounded-xl p-4"><p className="text-xs text-success font-medium mb-1">Thu nhập</p><p className="text-lg font-bold text-success">{formatShortCurrency(totalIncome)}</p></div>
        <div className="bg-accent-orange/10 rounded-xl p-4"><p className="text-xs text-accent-orange font-medium mb-1">Chi tiêu</p><p className="text-lg font-bold text-accent-orange">{formatShortCurrency(totalExpense)}</p></div>
      </div>
      
      <div className="px-4 mb-4">
        <div className="flex gap-2">
          {[{ type: 'pie' as ChartType, icon: PieChartIcon, label: 'Tròn' }, { type: 'bar' as ChartType, icon: BarChart3, label: 'Cột' }, { type: 'line' as ChartType, icon: TrendingUp, label: 'Đường' }].map((item) => (
            <button key={item.type} onClick={() => setChartType(item.type)} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all", chartType === item.type ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80")}>
              <item.icon className="w-4 h-4" />{item.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="px-4 mb-6">
        <div className="bg-card rounded-xl p-4 shadow-soft border border-border/50">
          {totalExpense === 0 ? <div className="h-48 flex items-center justify-center text-muted-foreground">Chưa có dữ liệu chi tiêu</div> : (
            <>
              {chartType === 'pie' && <div className="h-48"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">{pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie><Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} /></PieChart></ResponsiveContainer></div>}
              {chartType === 'bar' && <div className="h-48"><ResponsiveContainer width="100%" height="100%"><BarChart data={barData}><CartesianGrid strokeDasharray="3 3" opacity={0.3} /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => formatShortCurrency(v)} /><Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} /><Bar dataKey="amount" radius={[4, 4, 0, 0]}>{barData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Bar></BarChart></ResponsiveContainer></div>}
              {chartType === 'line' && <div className="h-48"><ResponsiveContainer width="100%" height="100%"><LineChart data={lineData}><CartesianGrid strokeDasharray="3 3" opacity={0.3} /><XAxis dataKey="day" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => formatShortCurrency(v)} /><Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} /><Line type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }} /></LineChart></ResponsiveContainer></div>}
            </>
          )}
        </div>
      </div>
      
      <div className="px-4 mb-6">
        <h3 className="font-semibold mb-3">Chi tiết theo danh mục</h3>
        <div className="space-y-2">
          {CATEGORIES.filter(cat => cat.id !== 'income' && categoryExpenses[cat.id] > 0).sort((a, b) => categoryExpenses[b.id] - categoryExpenses[a.id]).map((cat) => {
            const IconComponent = iconMap[cat.icon] || Circle;
            const amount = categoryExpenses[cat.id];
            const percentage = totalExpense > 0 ? (amount / totalExpense * 100).toFixed(1) : 0;
            return (
              <div key={cat.id} className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border/50">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}20` }}><IconComponent className="w-5 h-5" style={{ color: cat.color }} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1"><span className="font-medium text-sm">{cat.name}</span><span className="font-semibold text-sm">{formatCurrency(amount)}</span></div>
                  <div className="flex items-center gap-2"><div className="flex-1 h-2 bg-muted rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${percentage}%`, backgroundColor: cat.color }} /></div><span className="text-xs text-muted-foreground w-12 text-right">{percentage}%</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Statistics;
