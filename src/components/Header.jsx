export default function Header({ state }) {
    const completedDays = Object.keys(state.questLog).length;
    const avgXP = completedDays > 0 ? Math.round(state.totalPoints / completedDays) : 0;
    
    return (
        <header className="bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-purple-900/20 rounded-3xl shadow-2xl p-8 mb-8 border border-purple-400/20 backdrop-blur-xl">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 tracking-tight text-center mb-3">
                30 Day Challenge
            </h1>
            <p className="text-xl font-medium text-cyan-400 text-center">Average: {avgXP} XP/day</p>
        </header>
    );
}
