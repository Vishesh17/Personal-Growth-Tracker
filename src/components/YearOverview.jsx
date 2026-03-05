import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllData } from '../services/dynamodb';

function YearOverview() {
  const [yearData, setYearData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadYearData();
  }, []);

  const loadYearData = async () => {
    const data = await getAllData();
    setYearData(data);
    setLoading(false);
  };

  // Group data by month
  const monthlyStats = {};
  yearData.forEach(day => {
    const month = day.date.substring(0, 7); // YYYY-MM
    if (!monthlyStats[month]) {
      monthlyStats[month] = {
        totalTasks: 0,
        completedTasks: 0,
        totalEarnings: 0,
        perfectDays: 0,
        totalDays: 0
      };
    }
    monthlyStats[month].totalTasks += day.stats?.total || 0;
    monthlyStats[month].completedTasks += day.stats?.completed || 0;
    monthlyStats[month].totalEarnings += day.stats?.totalEarnings || 0;
    monthlyStats[month].perfectDays += day.stats?.isPerfectDay ? 1 : 0;
    monthlyStats[month].totalDays += 1;
  });

  // Sort months
  const sortedMonths = Object.keys(monthlyStats).sort();

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Year Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedMonths.map((month, idx) => {
          const stats = monthlyStats[month];
          const completionRate = stats.totalTasks > 0 
            ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
            : 0;
          
          return (
            <motion.div
              key={month}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="mb-4">
                <h3 className="text-2xl font-bold">
                  {new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
              </div>

              <div className="space-y-4">
                {/* Tasks */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60">Tasks Completed</span>
                    <span className="font-bold">{stats.completedTasks} / {stats.totalTasks}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionRate}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.05 + 0.2 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    />
                  </div>
                  <div className="text-center mt-1 text-sm text-white/60">{completionRate}%</div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-white/60">Days Tracked</div>
                    <div className="text-xl font-bold">{stats.totalDays}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-white/60">Perfect Days</div>
                    <div className="text-xl font-bold text-green-400">{stats.perfectDays}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 col-span-2">
                    <div className="text-xs text-white/60">Total Earned</div>
                    <div className="text-2xl font-bold text-green-400">₹{stats.totalEarnings}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Overall Year Stats */}
      {sortedMonths.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sortedMonths.length * 0.05 }}
          className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <h3 className="text-2xl font-bold mb-6">Overall Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/60 text-sm">Total Days</div>
              <div className="text-3xl font-bold">
                {Object.values(monthlyStats).reduce((sum, m) => sum + m.totalDays, 0)}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/60 text-sm">Perfect Days</div>
              <div className="text-3xl font-bold text-green-400">
                {Object.values(monthlyStats).reduce((sum, m) => sum + m.perfectDays, 0)}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/60 text-sm">Total Earned</div>
              <div className="text-3xl font-bold text-green-400">
                ₹{Object.values(monthlyStats).reduce((sum, m) => sum + m.totalEarnings, 0)}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/60 text-sm">Completion Rate</div>
              <div className="text-3xl font-bold">
                {Math.round(
                  (Object.values(monthlyStats).reduce((sum, m) => sum + m.completedTasks, 0) /
                    Object.values(monthlyStats).reduce((sum, m) => sum + m.totalTasks, 0)) * 100
                )}%
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {sortedMonths.length === 0 && (
        <div className="text-center text-white/60 py-12">
          No data yet. Start tracking your daily goals!
        </div>
      )}
    </div>
  );
}

export default YearOverview;
