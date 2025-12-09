import { supabase } from '@/lib/supabase';
import { SavingsGoal } from '@/types/expense';

export const savingsGoalService = {
  // Lấy tất cả mục tiêu tiết kiệm của user
  async getSavingsGoals(userId: string): Promise<SavingsGoal[]> {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching savings goals:', error);
      return [];
    }

    return (data || []).map(g => ({
      ...g,
      deadline: g.deadline ? new Date(g.deadline) : undefined,
    }));
  },

  // Thêm mục tiêu tiết kiệm mới
  async addSavingsGoal(
    userId: string,
    goal: Omit<SavingsGoal, 'id'>
  ): Promise<SavingsGoal | null> {
    const { data, error } = await supabase
      .from('savings_goals')
      .insert([
        {
          id: crypto.randomUUID(),
          user_id: userId,
          name: goal.name,
          target_amount: goal.targetAmount,
          current_amount: goal.currentAmount || 0,
          deadline: goal.deadline?.toISOString() || null,
          color: goal.color,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding savings goal:', error);
      return null;
    }

    return {
      ...data,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
    };
  },

  // Cập nhật mục tiêu tiết kiệm
  async updateSavingsGoal(
    id: string,
    updates: Partial<SavingsGoal>
  ): Promise<SavingsGoal | null> {
    const updateData: any = { ...updates };
    if (updates.deadline) {
      updateData.deadline = updates.deadline.toISOString();
    }

    const { data, error } = await supabase
      .from('savings_goals')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating savings goal:', error);
      return null;
    }

    return {
      ...data,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
    };
  },

  // Thêm tiền vào mục tiêu tiết kiệm
  async addToSavings(id: string, amount: number): Promise<SavingsGoal | null> {
    // Lấy thông tin hiện tại
    const { data: goal, error: fetchError } = await supabase
      .from('savings_goals')
      .select('current_amount')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching savings goal:', fetchError);
      return null;
    }

    const newAmount = (goal.current_amount || 0) + amount;

    const { data, error } = await supabase
      .from('savings_goals')
      .update({ current_amount: newAmount })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error adding to savings:', error);
      return null;
    }

    return {
      ...data,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
    };
  },

  // Xóa mục tiêu tiết kiệm
  async deleteSavingsGoal(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('savings_goals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting savings goal:', error);
      return false;
    }

    return true;
  },
};
