import { useState } from 'react';

function Header({ activeTab, setActiveTab, currentDate, setCurrentDate, stats }) {
  const tabs = ['Daily Goals', 'Monthly Goals', 'Year Overview'];
  const tabKeys = ['daily', 'monthly', 'year'];

  const startDate = new Date('2026-03-06');
  const dayNumber = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  return (
    <header className="w-full py-6 px-8 border-b border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Tracker</h1>
        
        {/* Stats */}
        <div className="flex gap-6 text-sm">
          <div className="text-center">
            <div className="text-white/60">Day</div>
            <div className="text-xl font-bold">{dayNumber}</div>
          </div>
          <div className="text-center">
            <div className="text-white/60">Tasks</div>
            <div className="text-xl font-bold">{stats.completed}/{stats.total}</div>
          </div>
          <div className="text-center">
            <div className="text-white/60">Perfect Days</div>
            <div className="text-xl font-bold">{stats.perfectDays}/{dayNumber}</div>
          </div>
          <div className="text-center">
            <div className="text-white/60">Total Earned</div>
            <div className="text-xl font-bold text-green-400">₹{stats.totalEarnings || 0}</div>
          </div>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={() => changeDate(-1)}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all"
        >
          ←
        </button>
        <div className="text-lg font-semibold">
          {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <button
          onClick={() => changeDate(1)}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all"
        >
          →
        </button>
        {stats.isPerfectDay && (
          <span className="ml-4 text-2xl">🎉</span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-6">
        {tabs.map((tab, index) => (
          <button
            key={tabKeys[index]}
            onClick={() => setActiveTab(tabKeys[index])}
            className={`pb-2 px-1 transition-all ${
              activeTab === tabKeys[index]
                ? 'border-b-2 border-white text-white'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </header>
  );
}

export default Header;
