import { sql } from '@vercel/postgres';

async function setupDatabase() {
  try {
    console.log('Creating tables...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS daily_entries (
        id SERIAL PRIMARY KEY,
        user_id TEXT DEFAULT 'default-user',
        date DATE NOT NULL,
        day_number INTEGER NOT NULL,
        tasks_completed TEXT[] DEFAULT '{}',
        water_glasses INTEGER DEFAULT 0,
        protein_grams INTEGER DEFAULT 0,
        meal1 TEXT,
        meal2 TEXT,
        meal3 TEXT,
        daily_spends INTEGER DEFAULT 0,
        chegg_questions INTEGER DEFAULT 0,
        freelance_income INTEGER DEFAULT 0,
        weight DECIMAL(5,2),
        notes TEXT,
        points_earned INTEGER DEFAULT 0,
        is_perfect_day BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, date)
      )
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS monthly_summary (
        id SERIAL PRIMARY KEY,
        user_id TEXT DEFAULT 'default-user',
        month TEXT NOT NULL,
        total_xp INTEGER DEFAULT 0,
        days_completed INTEGER DEFAULT 0,
        perfect_days INTEGER DEFAULT 0,
        starting_weight DECIMAL(5,2),
        ending_weight DECIMAL(5,2),
        weight_lost DECIMAL(5,2),
        total_spends INTEGER DEFAULT 0,
        total_income INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, month)
      )
    `;
    
    await sql`CREATE INDEX IF NOT EXISTS idx_daily_entries_date ON daily_entries(user_id, date)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_monthly_summary_month ON monthly_summary(user_id, month)`;
    
    console.log('✅ Tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

setupDatabase();
