-- Supabase Database Schema for My Quest App
-- Run this in Supabase SQL Editor

-- Table for storing daily quest data
CREATE TABLE IF NOT EXISTS quest_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  month TEXT NOT NULL,
  state_data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- Table for storing completed month history
CREATE TABLE IF NOT EXISTS month_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  month TEXT NOT NULL,
  total_xp INTEGER DEFAULT 0,
  days_completed INTEGER DEFAULT 0,
  weight_lost DECIMAL(5,2) DEFAULT 0,
  total_spends INTEGER DEFAULT 0,
  total_income INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quest_data_user_month ON quest_data(user_id, month);
CREATE INDEX IF NOT EXISTS idx_month_history_user ON month_history(user_id);

-- Enable Row Level Security
ALTER TABLE quest_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE month_history ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now, can add auth later)
DROP POLICY IF EXISTS "Allow all operations" ON quest_data;
CREATE POLICY "Allow all operations" ON quest_data
  FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations" ON month_history;
CREATE POLICY "Allow all operations" ON month_history
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: Create a function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_quest_data_updated_at ON quest_data;
CREATE TRIGGER update_quest_data_updated_at
    BEFORE UPDATE ON quest_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('quest_data', 'month_history');
