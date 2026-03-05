import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllData } from '../services/dynamodb';

function MonthlyGoals() {
  const [monthData, setMonthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('2026-03'); // March 2026

  useEffect(() => {
    loadMonthData();
  }, []);

  const loadMonthData = async () => {
    const data = await getAllData();
    setMonthData(data);
    setLoading(false);
  };

  // Define all tasks
  const tasks = [
    { label: 'Water (12 glasses)', check: (day) => day.waterGlasses >= 12 },
    { label: 'Protein (150g)', check: (day) => day.protein >= 150 },
    { label: 'Fish Oil', check: (day) => day.supplements?.fishOil },
    { label: 'Multivitamins', check: (day) => day.supplements?.multivitamins },
    { label: 'Ashwagandha', check: (day) => day.supplements?.ashwagandha },
    { label: 'Badminton', check: (day) => day.fitness?.badminton },
    { label: 'Gym', check: (day) => day.fitness?.gym },
    { label: '20min Walk', check: (day) => day.fitness?.walk },
    { label: 'Physio 1', check: (day) => day.fitness?.physio1 },
    { label: 'Physio 2', check: (day) => day.fitness?.physio2 },
    { label: 'Office Work', check: (day) => !!day.officeWork },
    { label: 'Korzi Hours', check: (day) => !!day.freelance?.korziHours },
    { label: 'Aman Updates', check: (day) => !!day.freelance?.amanUpdates },
    { label: 'Chegg Questions', check: (day) => !!day.freelance?.cheggQuestions },
    { label: 'Extra Money', check: (day) => !!day.freelance?.extraMoney },
    { label: 'Music Practice', check: (day) => Object.values(day.music || {}).some(Boolean) },
    { label: 'Meal 1', check: (day) => !!day.meals?.meal1 },
    { label: 'Meal 2', check: (day) => !!day.meals?.meal2 },
    { label: 'Meal 3', check: (day) => !!day.meals?.meal3 },
    { label: 'No Sugar', check: (day) => day.diet?.noSugar },
    { label: 'No Processed Food', check: (day) => day.diet?.noProcessed },
    { label: 'Night Skincare', check: (day) => day.wellness?.nightSkincare },
    { label: 'Morning Skincare', check: (day) => day.wellness?.morningSkincare },
    { label: 'Hair Oil', check: (day) => day.wellness?.hairOil },
    { label: 'Cold Shower', check: (day) => day.wellness?.coldShower },
    { label: 'No Smoke', check: (day) => day.wellness?.noSmoke },
  ];

  // Generate all days for the selected month
  const [year, month] = selectedMonth.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const allDays = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${selectedMonth}-${String(day).padStart(2, '0')}`;
    const existingData = monthData.find(d => d.date === dateStr);
    allDays.push(existingData || { date: dateStr });
  }

  // Sort data by date
  const sortedData = allDays.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Get available months from data
  const availableMonths = [...new Set(monthData.map(d => d.date.substring(0, 7)))].sort();
  if (availableMonths.length === 0) {
    availableMonths.push('2026-03'); // Default to March 2026
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Monthly Overview</h2>
        
        {/* Month Selector */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-white/10 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          {availableMonths.map(month => (
            <option key={month} value={month} className="bg-gray-900">
              {new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </option>
          ))}
        </select>
      </div>
      
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2 sticky left-0 bg-[#1a0a2e] z-10">Task</th>
              {sortedData.map((day) => (
                <th key={day.date} className="p-2 text-center min-w-[40px]">
                  <div className="text-xs">{new Date(day.date).getDate()}</div>
                  <div className="text-[10px] text-white/40">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, idx) => (
              <motion.tr 
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.02 }}
                className="border-t border-white/5 hover:bg-white/5"
              >
                <td className="p-2 sticky left-0 bg-[#1a0a2e] z-10 font-medium text-xs">
                  {task.label}
                </td>
                {sortedData.map((day) => {
                  const isCompleted = task.check(day);
                  return (
                    <td key={day.date} className="p-2 text-center">
                      <div 
                        className={`w-6 h-6 mx-auto rounded transition-all ${
                          isCompleted 
                            ? 'bg-green-500' 
                            : 'bg-white/10'
                        }`}
                      />
                    </td>
                  );
                })}
              </motion.tr>
            ))}
            
            {/* Perfect Day Row */}
            <tr className="border-t-2 border-white/20 bg-white/5">
              <td className="p-2 sticky left-0 bg-[#1a0a2e] z-10 font-bold">
                Perfect Day 🎉
              </td>
              {sortedData.map((day) => (
                <td key={day.date} className="p-2 text-center">
                  {day.stats?.isPerfectDay && (
                    <span className="text-2xl">🎉</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-white/60 text-sm">Total Days</div>
          <div className="text-2xl font-bold">{sortedData.length}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-white/60 text-sm">Perfect Days</div>
          <div className="text-2xl font-bold text-green-400">
            {sortedData.filter(d => d.stats?.isPerfectDay).length}
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-white/60 text-sm">Total Earned</div>
          <div className="text-2xl font-bold text-green-400">
            ₹{sortedData.reduce((sum, d) => sum + (d.stats?.totalEarnings || 0), 0)}
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-white/60 text-sm">Completion Rate</div>
          <div className="text-2xl font-bold">
            {sortedData.length > 0 
              ? Math.round((sortedData.reduce((sum, d) => sum + (d.stats?.completed || 0), 0) / 
                  sortedData.reduce((sum, d) => sum + (d.stats?.total || 1), 0)) * 100)
              : 0}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthlyGoals;
