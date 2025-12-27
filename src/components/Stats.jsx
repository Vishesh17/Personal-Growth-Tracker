import { Flame } from 'lucide-react';

function StatBox({ label, value, children, color }) {
    return (
        <div className="stat-box bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-6 rounded-3xl shadow-2xl text-center border border-purple-400/20 hover:border-purple-400/40 transition-all group backdrop-blur-xl">
            <div className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${color}`}>
                {value || children}
            </div>
            <div className="text-sm font-medium text-gray-300 mt-2">{label}</div>
        </div>
    );
}

export default function Stats({ state, currentWeight }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
            <StatBox label="Challenge Day" value={`${state.currentDay} / 30`} color="from-blue-500 to-cyan-500" />
            <StatBox label="Perfect Day Streak" color="from-orange-500 to-amber-500">
                <span className="flex items-center justify-center gap-1">
                    {state.streak}
                    <Flame size={24} className="text-orange-400" style={state.streak > 0 ? { animation: 'burn 1.5s ease-in-out infinite' } : {}}/>
                </span>
            </StatBox>
            <StatBox label="Total XP" value={`${state.totalPoints} / 8100`} color="from-emerald-500 to-teal-500" />
            <StatBox label="Weight" value={`${currentWeight.toFixed(1)} kg`} color="from-purple-500 to-pink-500" />
        </div>
    );
}
