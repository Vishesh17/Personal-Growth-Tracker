import { sql } from '@vercel/postgres';

const STORAGE_KEY = 'transformationChallengeState_v3_react';

class StorageService {
  async saveDailyEntry(dayData) {
    try {
      // Check if database is available
      if (!import.meta.env.POSTGRES_URL && typeof window !== 'undefined') {
        console.log('Database not available, using localStorage only');
        return { success: true };
      }

      const { date, dayNumber, tasks, water, protein, meals, spends, chegg, freelance, weight, notes, points, isPerfect } = dayData;
      
      await sql`
        INSERT INTO daily_entries (
          user_id, date, day_number, tasks_completed, water_glasses, protein_grams,
          meal1, meal2, meal3, daily_spends, chegg_questions, freelance_income,
          weight, notes, points_earned, is_perfect_day, updated_at
        )
        VALUES (
          'default-user', ${date}, ${dayNumber}, ${tasks}, ${water}, ${protein},
          ${meals.meal1 || null}, ${meals.meal2 || null}, ${meals.meal3 || null},
          ${spends}, ${chegg}, ${freelance}, ${weight}, ${notes}, ${points}, ${isPerfect}, NOW()
        )
        ON CONFLICT (user_id, date)
        DO UPDATE SET
          tasks_completed = ${tasks},
          water_glasses = ${water},
          protein_grams = ${protein},
          meal1 = ${meals.meal1 || null},
          meal2 = ${meals.meal2 || null},
          meal3 = ${meals.meal3 || null},
          daily_spends = ${spends},
          chegg_questions = ${chegg},
          freelance_income = ${freelance},
          weight = ${weight},
          notes = ${notes},
          points_earned = ${points},
          is_perfect_day = ${isPerfect},
          updated_at = NOW()
      `;
      
      console.log('✅ Data saved to database');
      return { success: true };
    } catch (error) {
      console.error('Save daily entry error:', error);
      console.log('Falling back to localStorage only');
      return { success: false, error };
    }
  }

  async getDailyEntry(date) {
    try {
      if (!import.meta.env.POSTGRES_URL && typeof window !== 'undefined') {
        return null;
      }

      const result = await sql`
        SELECT * FROM daily_entries
        WHERE user_id = 'default-user' AND date = ${date}
      `;
      return result.rows[0] || null;
    } catch (error) {
      console.error('Get daily entry error:', error);
      return null;
    }
  }

  async getMonthEntries(month) {
    try {
      if (!import.meta.env.POSTGRES_URL && typeof window !== 'undefined') {
        return [];
      }

      const result = await sql`
        SELECT * FROM daily_entries
        WHERE user_id = 'default-user' AND date >= ${month + '-01'} AND date < (DATE ${month + '-01'} + INTERVAL '1 month')
        ORDER BY date ASC
      `;
      return result.rows;
    } catch (error) {
      console.error('Get month entries error:', error);
      return [];
    }
  }

  async saveMonthSummary(monthData) {
    try {
      if (!import.meta.env.POSTGRES_URL && typeof window !== 'undefined') {
        return;
      }

      const { month, totalXP, daysCompleted, perfectDays, startWeight, endWeight, weightLost, totalSpends, totalIncome } = monthData;
      
      await sql`
        INSERT INTO monthly_summary (
          user_id, month, total_xp, days_completed, perfect_days,
          starting_weight, ending_weight, weight_lost, total_spends, total_income
        )
        VALUES (
          'default-user', ${month}, ${totalXP}, ${daysCompleted}, ${perfectDays},
          ${startWeight}, ${endWeight}, ${weightLost}, ${totalSpends}, ${totalIncome}
        )
        ON CONFLICT (user_id, month) DO NOTHING
      `;
    } catch (error) {
      console.error('Save month summary error:', error);
    }
  }

  async getMonthHistory() {
    try {
      if (!import.meta.env.POSTGRES_URL && typeof window !== 'undefined') {
        return [];
      }

      const result = await sql`
        SELECT * FROM monthly_summary
        WHERE user_id = 'default-user'
        ORDER BY month DESC
      `;
      return result.rows;
    } catch (error) {
      console.error('Get month history error:', error);
      return [];
    }
  }

  // Legacy methods for backward compatibility
  async saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return { success: true };
  }

  async loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  }
}

export const storageService = new StorageService();
