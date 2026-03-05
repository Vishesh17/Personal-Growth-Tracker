import { useState, useEffect } from 'react';
import Header from './components/Header';
import DailyGoals from './components/DailyGoals';
import MonthlyGoals from './components/MonthlyGoals';
import YearOverview from './components/YearOverview';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('daily');
  const [currentDate, setCurrentDate] = useState(new Date('2026-03-06'));
  const [stats, setStats] = useState({
    completed: 0,
    total: 0,
    perfectDays: 0,
    totalEarnings: 0,
    isPerfectDay: false
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1128] via-[#1a0a2e] to-[#2d0a28]">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        stats={stats}
      />
      {activeTab === 'daily' && <DailyGoals currentDate={currentDate} setStats={setStats} />}
      {activeTab === 'monthly' && <MonthlyGoals />}
      {activeTab === 'year' && <YearOverview />}
    </div>
  );
}

export default App;
