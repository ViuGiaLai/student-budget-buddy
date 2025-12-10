import { supabase } from '@/lib/supabase';
import { Budget } from '@/types/expense';

export const budgetService = {
  // Lấy tất cả ngân sách của user
  async getBudgets(userId: string): Promise<Budget[]> {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching budgets:', error);
      return [];
    }

    return (data || []).map((item) => ({
      ...item,
      limit: item.budget_limit ?? item.limit ?? 0, // normalize column name
    }));
  },

  // Lấy ngân sách theo danh mục
  async getBudgetByCategory(userId: string, category: string): Promise<Budget | null> {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Không tìm thấy budget
        return null;
      }
      console.error('Error fetching budget by category:', error);
      return null;
    }

    return data
      ? {
          ...data,
          limit: data.budget_limit ?? data.limit ?? 0,
        }
      : null;
  },

  // Thêm ngân sách mới
  async addBudget(
    userId: string,
    budget: Omit<Budget, 'id' | 'spent'>
  ): Promise<Budget | null> {
    const { data, error } = await supabase
      .from('budgets')
      .insert([
        {
          id: crypto.randomUUID(),
          user_id: userId,
          category: budget.category,
          budget_limit: budget.limit,
          period: budget.period,
          spent: 0,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding budget:', error);
      return null;
    }

    return data
      ? {
          ...data,
          limit: data.budget_limit ?? data.limit ?? 0,
        }
      : null;
  },

  // Cập nhật ngân sách
  async updateBudget(id: string, updates: Partial<Budget>): Promise<Budget | null> {
    const { data, error } = await supabase
      .from('budgets')
      .update({
        ...updates,
        ...(updates.limit !== undefined ? { budget_limit: updates.limit } : {}),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating budget:', error);
      return null;
    }

    return data
      ? {
          ...data,
          limit: data.budget_limit ?? data.limit ?? 0,
        }
      : null;
  },

  // Cập nhật số tiền đã chi cho ngân sách
  async updateBudgetSpent(id: string, spent: number): Promise<Budget | null> {
    const { data, error } = await supabase
      .from('budgets')
      .update({ spent })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating budget spent:', error);
      return null;
    }

    return data;
  },

  // Xóa ngân sách
  async deleteBudget(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting budget:', error);
      return false;
    }

    return true;
  },
};
