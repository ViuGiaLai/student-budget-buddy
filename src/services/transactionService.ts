import { supabase } from '@/lib/supabase';
import { Transaction } from '@/types/expense';

export const transactionService = {
  // Lấy tất cả giao dịch của user
  async getTransactions(userId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }

    return (data || []).map(t => ({
      ...t,
      date: new Date(t.date),
    }));
  },

  // Lấy giao dịch theo khoảng thời gian
  async getTransactionsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString())
      .lte('date', endDate.toISOString())
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions by date range:', error);
      return [];
    }

    return (data || []).map(t => ({
      ...t,
      date: new Date(t.date),
    }));
  },

  // Thêm giao dịch mới
  async addTransaction(
    userId: string,
    transaction: Omit<Transaction, 'id'>
  ): Promise<Transaction | null> {
    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          id: crypto.randomUUID(),
          user_id: userId,
          type: transaction.type,
          amount: transaction.amount,
          category: transaction.category,
          description: transaction.description,
          date: transaction.date.toISOString(),
          note: transaction.note || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding transaction:', error);
      return null;
    }

    return {
      ...data,
      date: new Date(data.date),
    };
  },

  // Cập nhật giao dịch
  async updateTransaction(
    id: string,
    updates: Partial<Transaction>
  ): Promise<Transaction | null> {
    const updateData: any = { ...updates };
    if (updates.date) {
      updateData.date = updates.date.toISOString();
    }

    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating transaction:', error);
      return null;
    }

    return {
      ...data,
      date: new Date(data.date),
    };
  },

  // Xóa giao dịch
  async deleteTransaction(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transaction:', error);
      return false;
    }

    return true;
  },

  // Tìm kiếm giao dịch
  async searchTransactions(userId: string, query: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .or(`description.ilike.%${query}%,note.ilike.%${query}%`)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error searching transactions:', error);
      return [];
    }

    return (data || []).map(t => ({
      ...t,
      date: new Date(t.date),
    }));
  },
};
