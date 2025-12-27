import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import {
    Bed,
    GlassWater,
    Sun,
    Pill,
    Clock,
    Ban,
    Egg,
    Bolt,
    Fish,
    Footprints,
    Dumbbell,
    PlusSquare,
    Sparkles,
    Check,
    Moon,
    Snowflake,
    Bath,
    Wind,
    Code,
    Network,
    Landmark,
    Calendar,
    LayoutGrid,
    Flame,
    Gauge,
    Target,
    ArrowRight,
    X,
    Save,
    Undo2,
    CheckCheck,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// --- CONSTANTS ---
const STARTING_WEIGHT = 74.0;
const GOAL_WEIGHT = 69.0;
const TOTAL_CHALLENGE_DAYS = 30;
const STORAGE_KEY = 'transformationChallengeState_v3_react';

// --- TASK DEFINITIONS ---
const allTasks = [
    { id: 'sleep', text: 'Slept 7.5 Hours', desc: 'Sleep 2 AM - 9:30 AM', points: 20, category: 'core', icon: Bed },
    { id: 'hydrate', text: 'Morning Hydration', desc: '500ml warm water + lemon', points: 10, category: 'core', icon: GlassWater },
    { id: 'sunlight', text: 'Morning Sunlight', desc: '10-15 minutes of morning rays', points: 10, category: 'core', icon: Sun },
    { id: 'supplements', text: 'Take Supplements', desc: 'Multi, D3, Omega', points: 10, category: 'core', icon: Pill },
    { id: 'fasting', text: 'Fasting Window 16/8', desc: 'Eat only from 1 PM - 9 PM', points: 15, category: 'diet', icon: Clock },
    { id: 'noJunk', text: 'No Sugar / Processed', desc: 'Eat clean, whole foods only', points: 30, category: 'diet', icon: Ban },
    { id: 'meal1', text: 'Meal 1 (Break-Fast)', desc: 'Log your high-protein meal', points: 10, category: 'diet', icon: Egg, type: 'log' },
    { id: 'meal2', text: 'Meal 2 (Fuel)', desc: 'Log your protein shake / nuts', points: 10, category: 'diet', icon: Bolt, type: 'log' },
    { id: 'meal3', text: 'Meal 3 (Dinner)', desc: 'Log your lean & green meal', points: 10, category: 'diet', icon: Fish, type: 'log' },
    { id: 'steps', text: '10,000 Steps', desc: 'Daily non-negotiable walk', points: 20, category: 'fitness', icon: Footprints },
    { id: 'workout', text: 'Gym / Badminton', desc: 'Main workout session', points: 25, category: 'fitness', icon: Dumbbell },
    { id: 'physio1', text: 'Physio Session 1', desc: '10 min Theraband exercises', points: 10, category: 'fitness', icon: PlusSquare },
    { id: 'physio2', text: 'Physio Session 2', desc: '10 min Towel roll / stretches', points: 10, category: 'fitness', icon: PlusSquare },
    { id: 'morningRoutine', text: 'Morning Skin Routine', desc: 'Face wash + Vit C + Moisturizer + SPF', points: 20, category: 'grooming', icon: Sun },
    { id: 'nightRoutine', text: 'Night Skin Routine', desc: 'Face wash + Niacinamide + Moisturizer', points: 20, category: 'grooming', icon: Moon },
    { id: 'shower', text: '60s Cold Shower', desc: 'Finish with a cold blast', points: 15, category: 'grooming', icon: Snowflake },
    { id: 'hairWash', text: 'Shampoo Hair', desc: 'Sulphate-free (every 2nd day)', points: 5, category: 'grooming', icon: Bath, day: 'shampoo' },
    { id: 'hairOil', text: 'Hair Oiling', desc: 'Oil your hair (day after shampoo)', points: 5, category: 'grooming', icon: Wind, day: 'oiling' },
    { id: 'dsa', text: 'DSA Problem (Odd Days)', desc: 'Solve one DSA question', points: 15, category: 'tech', icon: Code },
    { id: 'systemDesign', text: 'System Design (Even Days)', desc: 'Watch one video', points: 15, category: 'tech', icon: Network },
    { id: 'spends', text: 'Log Spends', desc: 'Log today\'s total spends', points: 5, category: 'finance', icon: Landmark, type: 'log' },
    { id: 'chegg', text: 'Chegg Questions', desc: 'Number of questions solved', points: 10, category: 'income', icon: Code, type: 'log' },
    { id: 'freelance', text: 'Freelance Work', desc: 'Money earned from freelance (₹)', points: 10, category: 'income', icon: Landmark, type: 'log' }
];

// --- HELPER FUNCTIONS ---
const getInitialState = () => {
    try {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            const parsed = JSON.parse(savedState);
            // Ensure data structure is correct after loading
            if (!parsed.dailyMetrics) parsed.dailyMetrics = { waterGlasses: 0, protein: 0 };
            if (!parsed.dailyLogs) parsed.dailyLogs = {};
            if (!parsed.totalSpends) parsed.totalSpends = 0;
            if (!parsed.totalChegg) parsed.totalChegg = 0;
            if (!parsed.totalFreelance) parsed.totalFreelance = 0;
            return parsed;
        }
    } catch (e) {
        console.error("Failed to parse state from localStorage", e);
    }
    // Default state if nothing saved
    return {
        currentDay: 1,
        streak: 0,
        totalPoints: 0,
        totalSpends: 0,
        totalChegg: 0,
        totalFreelance: 0,
        weightLogs: [{ day: 0, weight: STARTING_WEIGHT }],
        dailyMetrics: { waterGlasses: 0, protein: 0 },
        dailyTasks: [],
        dailyLogs: {},
        questLog: {},
        notes: "",
        lastCompletionDate: null,
        lastVisitDate: new Date().toLocaleDateString(), // Set to today
    };
};

const getPlayerRank = (day) => {
    if (day <= 3) return `Day ${day}: The Challenger`;
    if (day <= 7) return `Day ${day}: The Striker`;
    if (day <= 14) return `Day ${day}: The Operator`;
    if (day <= 21) return `Day ${day}: The Elite`;
    if (day <= 29) return `Day ${day}: The Master`;
    return `Day ${day}: TRANSFORMED`;
};

const getCategoryStyle = (category) => {
    switch (category) {
        case 'core': return { border: 'border-blue-500', icon: 'text-blue-400' };
        case 'diet': return { border: 'border-emerald-500', icon: 'text-emerald-400' };
        case 'fitness': return { border: 'border-orange-500', icon: 'text-orange-400' };
        case 'grooming': return { border: 'border-purple-500', icon: 'text-purple-400' };
        case 'tech': return { border: 'border-amber-500', icon: 'text-amber-400' };
        case 'finance': return { border: 'border-yellow-600', icon: 'text-yellow-400' };
        case 'income': return { border: 'border-green-500', icon: 'text-green-400' };
        default: return { border: 'border-gray-500', icon: 'text-gray-400' };
    }
};

// --- MAIN APP COMPONENT ---
export default function App() {
    const [state, setState] = useState(getInitialState);
    const [activeTab, setActiveTab] = useState('mission');
    const [showWeightModal, setShowWeightModal] = useState(false);
    const [showDayCompleteModal, setShowDayCompleteModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [dayCompleteStats, setDayCompleteStats] = useState({ title: '', message: '', points: 0 });

    const isDayComplete = state.lastCompletionDate === new Date().toLocaleDateString();

    // --- LOCALSTORAGE SYNC ---
    // Save state to localStorage on every change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error("Failed to save state to localStorage", e);
        }
    }, [state]);

    // --- NEW DAY LOGIC ---
    useEffect(() => {
        const today = new Date().toLocaleDateString();
        if (state.lastVisitDate !== today) {
            // First visit of a new day
            setState(prevState => ({
                ...prevState,
                lastVisitDate: today,
                dailyTasks: [],
                dailyLogs: {},
                dailyMetrics: { waterGlasses: 0, protein: 0 }
            }));
            
            if (state.currentDay > 1) {
                setShowWeightModal(true);
            }
        }
    }, []); // Runs only on mount

    // --- COMPUTED VALUES ---
    const currentWeight = state.weightLogs[state.weightLogs.length - 1].weight;
    const weightLost = STARTING_WEIGHT - currentWeight;
    const totalWeightToLose = STARTING_WEIGHT - GOAL_WEIGHT;
    const weightProgressPercent = Math.max(0, Math.min(100, (weightLost / totalWeightToLose) * 100));

    // --- EVENT HANDLERS ---
    const handleTaskToggle = (id, points) => {
        if (isDayComplete) return;
        setState(prevState => {
            const newDailyTasks = prevState.dailyTasks.includes(id)
                ? prevState.dailyTasks.filter(taskId => taskId !== id)
                : [...prevState.dailyTasks, id];
            
            const newTotalPoints = newDailyTasks.length > prevState.dailyTasks.length
                ? prevState.totalPoints + points
                : prevState.totalPoints - points;

            return { ...prevState, dailyTasks: newDailyTasks, totalPoints: newTotalPoints };
        });
    };

    const handleLogChange = (id, value) => {
        if (isDayComplete) return;
        setState(prevState => {
            const newLogs = { ...prevState.dailyLogs, [id]: value };
            const task = allTasks.find(t => t.id === id);
            
            // Auto-check meal tasks when text is entered
            let newDailyTasks = [...prevState.dailyTasks];
            let newTotalPoints = prevState.totalPoints;
            
            if (task && task.type === 'log' && (id === 'meal1' || id === 'meal2' || id === 'meal3')) {
                const wasChecked = prevState.dailyTasks.includes(id);
                const hasValue = value && value.trim() !== '';
                
                if (hasValue && !wasChecked) {
                    // Add task and points
                    newDailyTasks.push(id);
                    newTotalPoints += task.points;
                } else if (!hasValue && wasChecked) {
                    // Remove task and points
                    newDailyTasks = newDailyTasks.filter(taskId => taskId !== id);
                    newTotalPoints -= task.points;
                }
            }
            
            return {
                ...prevState,
                dailyLogs: newLogs,
                dailyTasks: newDailyTasks,
                totalPoints: newTotalPoints
            };
        });
    };

    const handleWaterChange = (glassNum) => {
        if (isDayComplete) return;
        setState(prevState => ({
            ...prevState,
            dailyMetrics: {
                ...prevState.dailyMetrics,
                waterGlasses: prevState.dailyMetrics.waterGlasses === glassNum ? glassNum - 1 : glassNum
            }
        }));
    };

    const handleProteinChange = (amount) => {
        if (isDayComplete) return;
        setState(prevState => ({
            ...prevState,
            dailyMetrics: {
                ...prevState.dailyMetrics,
                protein: Math.min(500, (prevState.dailyMetrics.protein || 0) + amount)
            }
        }));
    };

    const handleNotesChange = (value) => {
        setState(prevState => ({
            ...prevState,
            notes: value
        }));
    };

    const handleSaveWeight = (weight) => {
        if (weight > 30 && weight < 150) {
            setState(prevState => ({
                ...prevState,
                weightLogs: [...prevState.weightLogs, { day: prevState.currentDay, weight: parseFloat(weight) }]
            }));
            setShowWeightModal(false);
        } else {
            alert("Please enter a valid weight.");
        }
    };

    const handleCompleteDay = () => {
        const today = new Date().toLocaleDateString();
        if (state.lastCompletionDate === today) return;

        const tasksForToday = allTasks.filter(task => {
            if (task.id === 'spends') return false;
            if (task.id === 'dsa' || task.id === 'systemDesign') return false;
            if (!task.day) return true;
            if (task.day === 'shampoo' && state.currentDay % 2 === 0) return true;
            if (task.day === 'oiling' && state.currentDay % 2 === 1 && state.currentDay > 1) return true;
            return false;
        });
        
        const hasTechTask = state.dailyTasks.includes('dsa') || state.dailyTasks.includes('systemDesign');
        const allTasksCompleted = state.dailyTasks.length >= tasksForToday.length && hasTechTask;
        
        let pointsToday = 0;
        state.dailyTasks.forEach(id => {
            const task = allTasks.find(t => t.id === id);
            if (task) pointsToday += task.points;
        });

        const spendsTodayStr = state.dailyLogs['spends'] || '0';
        const spendsTodayNum = parseInt(spendsTodayStr.replace(/[^0-9]/g, '')) || 0;
        const cheggToday = parseInt(state.dailyLogs['chegg']) || 0;
        const freelanceToday = parseInt(state.dailyLogs['freelance']) || 0;

        let newTotalPoints = state.totalPoints;
        let newStreak = state.streak;

        if (allTasksCompleted) {
            newStreak++;
            pointsToday += 50; // Streak bonus
            newTotalPoints += 50;
            setDayCompleteStats({
                title: "PERFECT DAY!",
                message: `Mission flawless. Streak maintained! +50 XP Bonus!`,
                points: pointsToday
            });
        } else {
            newStreak = 0;
            setDayCompleteStats({
                title: "Day Complete",
                message: "Good work. Aim for 100% tomorrow!",
                points: pointsToday
            });
        }
        
        setState(prevState => ({
            ...prevState,
            totalPoints: newTotalPoints,
            streak: newStreak,
            totalSpends: (prevState.totalSpends || 0) + spendsTodayNum,
            totalChegg: (prevState.totalChegg || 0) + cheggToday,
            totalFreelance: (prevState.totalFreelance || 0) + freelanceToday,
            lastCompletionDate: today,
            questLog: {
                ...prevState.questLog,
                [prevState.currentDay]: {
                    tasks: [...prevState.dailyTasks],
                    logs: { ...prevState.dailyLogs },
                    spends: spendsTodayNum,
                    points: pointsToday,
                    status: allTasksCompleted ? 'perfect' : 'partial',
                    water: prevState.dailyMetrics.waterGlasses,
                    protein: prevState.dailyMetrics.protein,
                    chegg: cheggToday,
                    freelance: freelanceToday,
                    notes: prevState.notes,
                    date: today
                }
            }
        }));
        
        setShowDayCompleteModal(true);
    };

    const handleNextDay = () => {
        if (state.currentDay >= TOTAL_CHALLENGE_DAYS) {
            alert("CHALLENGE COMPLETE! You are TRANSFORMED!");
            handleReset();
            return;
        }

        setState(prevState => ({
            ...prevState,
            currentDay: prevState.currentDay + 1,
            dailyTasks: [],
            dailyLogs: {},
            dailyMetrics: { waterGlasses: 0, protein: 0 },
            lastCompletionDate: null,
            lastVisitDate: new Date().toLocaleDateString() // Set for the new day
        }));

        setShowDayCompleteModal(false);
        setShowWeightModal(true);
    };

    const handleReset = () => {
        localStorage.removeItem(STORAGE_KEY);
        setState(getInitialState());
        setShowResetModal(false);
    };

    return (
        <div className="bg-gradient-to-br from-[#0f0e1a] via-[#1a1830] to-[#0f0e1a] text-white min-h-screen p-6 md:p-10 font-sans">
            <div className="w-full">
                
                {/* Header */}
                <Header state={state} />
                
                {/* Main Stats */}
                <Stats state={state} currentWeight={currentWeight} />

                {/* Weight Goal Progress Bar */}
                <WeightProgress progress={weightProgressPercent} toGo={(currentWeight - GOAL_WEIGHT).toFixed(1)} />

                {/* Tab Navigation */}
                <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
                
                {/* Tab Panels */}
                <div className="mt-6">
                    {activeTab === 'mission' && (
                        <DailyMission
                            state={state}
                            onTaskToggle={handleTaskToggle}
                            onLogChange={handleLogChange}
                            onWaterChange={handleWaterChange}
                            onProteinChange={handleProteinChange}
                            onNotesChange={handleNotesChange}
                            isDayComplete={isDayComplete}
                        />
                    )}
                    {activeTab === 'progress' && <ProgressLog state={state} />}
                    {activeTab === 'heatmap' && <Heatmap state={state} />}
                </div>

                {/* Controls */}
                <div className="flex justify-between items-center mt-8 max-w-6xl mx-auto">
                    <button
                        id="completeDay"
                        onClick={handleCompleteDay}
                        disabled={isDayComplete}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-emerald-500/30 text-lg transition-all hover:scale-105 disabled:from-gray-600 disabled:to-gray-600 disabled:hover:from-gray-600 disabled:hover:to-gray-600 disabled:scale-100 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        <span className="flex items-center gap-2">
                            {isDayComplete ? 'Day Complete' : 'Complete Day'}
                            <CheckCheck size={20} />
                        </span>
                    </button>
                    <button
                        id="resetApp"
                        onClick={() => setShowResetModal(true)}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-2 px-4 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-red-500/20"
                    >
                        <Undo2 size={16} /> Reset Challenge
                    </button>
                </div>
            </div>

            {/* Modals */}
            <WeightModal
                show={showWeightModal}
                onClose={() => setShowWeightModal(false)}
                onSave={handleSaveWeight}
                lastWeight={currentWeight}
            />
            <DayCompleteModal
                show={showDayCompleteModal}
                onClose={handleNextDay}
                stats={dayCompleteStats}
            />
            <ResetModal
                show={showResetModal}
                onClose={() => setShowResetModal(false)}
                onConfirm={handleReset}
            />
        </div>
    );
}

// --- SUB-COMPONENTS ---

const Header = ({ state }) => {
    const completedDays = Object.keys(state.questLog).length;
    const totalDailyXP = Object.values(state.questLog).reduce((sum, log) => sum + (log.points || 0), 0);
    const avgXP = completedDays > 0 ? Math.round(totalDailyXP / completedDays) : 0;
    
    return (
        <header className="bg-gradient-to-r from-purple-900/15 via-blue-900/15 to-purple-900/15 rounded-3xl shadow-2xl p-8 mb-8 border border-purple-500/15 backdrop-blur-xl">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 tracking-tight text-center mb-3">30 Day Challenge</h1>
            <p className="text-xl font-medium text-cyan-400 text-center">Average: {avgXP} XP/day</p>
        </header>
    );
};

const Stats = ({ state, currentWeight }) => {
    const totalIncome = (state.totalChegg || 0) * 100 + (state.totalFreelance || 0);
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
            <StatBox label="Challenge Day" value={`${state.currentDay} / 30`} color="from-blue-500 to-cyan-500" />
            <StatBox label="Extra Money Earned" value={`₹${totalIncome}`} color="from-green-500 to-emerald-500" />
            <StatBox label="Total XP" value={`${state.totalPoints} / 10050`} color="from-emerald-500 to-teal-500" />
            <StatBox label="Weight" value={`${currentWeight.toFixed(1)} kg`} color="from-purple-500 to-pink-500" />
        </div>
    );
};

const StatBox = ({ label, value, children, color }) => (
    <div className="stat-box bg-gradient-to-br from-purple-900/15 to-blue-900/15 p-6 rounded-3xl shadow-2xl text-center border border-purple-500/15 hover:border-purple-400/25 transition-all group backdrop-blur-xl">
        <div className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${color}`}>{value || children}</div>
        <div className="text-sm font-medium text-gray-200 mt-2">{label}</div>
    </div>
);

const WeightProgress = ({ progress, toGo }) => (
    <div className="bg-gradient-to-br from-purple-900/15 to-blue-900/15 rounded-3xl shadow-2xl p-6 mb-8 border border-purple-500/15 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-gray-200 flex items-center gap-2"><Target size={18} className="text-cyan-400"/> Weight Goal: {GOAL_WEIGHT} kg</span>
            <span className="text-sm font-bold text-cyan-400">{toGo} kg to go</span>
        </div>
        <div className="w-full bg-purple-950/50 rounded-full h-3 overflow-hidden">
            <div
                className="h-3 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 transition-all duration-500 shadow-lg shadow-purple-500/50"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    </div>
);

const TabNavigation = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'mission', label: 'Daily Mission', icon: Check },
        { id: 'progress', label: 'Progress Log', icon: Calendar },
        { id: 'heatmap', label: 'Heatmap', icon: LayoutGrid }
    ];
    return (
        <nav className="flex gap-2 mb-8 bg-gradient-to-r from-purple-900/15 to-blue-900/15 rounded-3xl p-2 shadow-2xl border border-purple-500/15 backdrop-blur-xl">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 text-base font-semibold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all ${
                        activeTab === tab.id 
                            ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-white shadow-lg shadow-purple-500/30' 
                            : 'text-gray-300 hover:text-white hover:bg-purple-900/40'
                    }`}
                >
                    <tab.icon size={18} /> {tab.label}
                </button>
            ))}
        </nav>
    );
};

// --- Daily Mission Components ---

const DailyMission = ({ state, onTaskToggle, onLogChange, onWaterChange, onProteinChange, onNotesChange, isDayComplete }) => {
    const { currentDay, dailyTasks, dailyLogs, dailyMetrics, notes } = state;

    const tasksForToday = useMemo(() => {
        return allTasks.filter(task => {
            if (task.id === 'spends') return false;
            if (!task.day) return true;
            if (task.day === 'shampoo' && currentDay % 2 === 0) return true;
            if (task.day === 'oiling' && currentDay % 2 === 1 && currentDay > 1) return true;
            return false;
        });
    }, [currentDay]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Daily Mission: <span className="text-gray-300">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></h2>
            
            {/* Top Row: Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <WaterTracker
                    waterGlasses={dailyMetrics.waterGlasses}
                    onWaterChange={onWaterChange}
                    isDayComplete={isDayComplete}
                />
                <ProteinTracker
                    protein={dailyMetrics.protein}
                    onProteinChange={onProteinChange}
                    isDayComplete={isDayComplete}
                />
                <SpendsTracker
                    spends={dailyLogs['spends'] || ''}
                    onSpendsChange={onLogChange}
                    isDayComplete={isDayComplete}
                />
                <CaptainsLog
                    notes={notes}
                    onNotesChange={onNotesChange}
                />
            </div>
            
            {/* Tasks Grouped by Category */}
            <div className="space-y-6">
                {['core', 'diet', 'fitness', 'grooming', 'tech', 'income'].map(category => {
                    const categoryTasks = tasksForToday.filter(t => t.category === category);
                    if (categoryTasks.length === 0) return null;
                    
                    const categoryNames = {
                        core: 'Core Habits',
                        diet: 'Diet & Nutrition',
                        fitness: 'Fitness & Movement',
                        grooming: 'Grooming & Self-Care',
                        tech: 'Tech & Learning (Pick One)',
                        income: 'Passive Income'
                    };
                    
                    const categoryColors = {
                        core: 'text-blue-400',
                        diet: 'text-emerald-400',
                        fitness: 'text-orange-400',
                        grooming: 'text-purple-400',
                        tech: 'text-amber-400',
                        income: 'text-green-400'
                    };
                    
                    return (
                        <div key={category}>
                            <h3 className={`text-xl font-bold mb-3 ${categoryColors[category]}`}>
                                {categoryNames[category]}
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {categoryTasks.map(task => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        isChecked={dailyTasks.includes(task.id)}
                                        logValue={dailyLogs[task.id] || ''}
                                        onToggle={onTaskToggle}
                                        onLogChange={onLogChange}
                                        isDayComplete={isDayComplete}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const TaskCard = React.memo(({ task, isChecked, logValue, onToggle, onLogChange, isDayComplete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const style = getCategoryStyle(task.category);
    
    return (
        <div className={`task-card bg-gradient-to-br from-purple-900/18 to-blue-900/18 rounded-2xl shadow-xl ${style.border} border transition-all duration-200 backdrop-blur-xl hover:shadow-2xl hover:shadow-purple-500/8`}>
            <div className="p-4 flex items-start">
                <task.icon size={28} className={`w-12 text-center ${style.icon} mt-1`} />
                <div className="flex-1 mx-4">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-white">{task.text}</span>
                        <span className="text-sm text-emerald-400 ml-2">(+{task.points} XP)</span>
                    </div>
                    <p className="text-sm text-gray-400">{task.desc}</p>
                    {task.type === 'log' && (
                        <input
                            type={task.category === 'income' ? 'number' : 'text'}
                            data-log-id={task.id}
                            className="w-full bg-purple-950/50 border border-purple-500/30 rounded-xl p-2 mt-2 text-sm text-gray-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none disabled:bg-purple-950/30 disabled:cursor-not-allowed"
                            placeholder={task.desc}
                            value={logValue}
                            onChange={(e) => onLogChange(task.id, e.target.value)}
                            disabled={isDayComplete}
                        />
                    )}
                </div>
                <input
                    type="checkbox"
                    id={task.id}
                    className="form-checkbox h-6 w-6 rounded bg-purple-950/50 border-purple-500/40 text-emerald-500 focus:ring-0 appearance-none mt-2 cursor-pointer disabled:cursor-not-allowed"
                    checked={isChecked}
                    onChange={() => onToggle(task.id, task.points)}
                    disabled={isDayComplete}
                />
            </div>
        </div>
    );
});

const WaterTracker = ({ waterGlasses, onWaterChange, isDayComplete }) => (
    <div className="bg-gradient-to-br from-purple-900/15 to-blue-900/15 rounded-3xl shadow-2xl p-6 border border-purple-500/15 hover:border-blue-500/25 transition-all group backdrop-blur-xl">
        <h3 className="font-semibold text-sm mb-4 text-gray-200">Water Intake</h3>
        <div className="flex justify-between gap-1 mb-4">
            {[...Array(7)].map((_, i) => (
                <GlassWater
                    key={i}
                    size={28}
                    className={`water-glass cursor-pointer transition-all ${i < waterGlasses ? 'text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'text-zinc-700 hover:text-blue-400'}`}
                    onClick={() => onWaterChange(i + 1)}
                    style={{ pointerEvents: isDayComplete ? 'none' : 'auto' }}
                />
            ))}
        </div>
        <div className="bg-purple-950/50 rounded-2xl p-3 border border-purple-500/30">
            <div className="text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">{(waterGlasses * 0.5).toFixed(1)}L</div>
            <div className="text-center text-xs font-medium text-gray-400 mt-1">of 3.5L</div>
        </div>
    </div>
);

const ProteinTracker = ({ protein, onProteinChange, isDayComplete }) => {
    const proteinInputRef = useRef(null);

    const handleAdd = () => {
        const amount = parseInt(proteinInputRef.current.value);
        if (amount > 0) {
            onProteinChange(amount);
            proteinInputRef.current.value = '';
        }
    };

    return (
        <div className="bg-gradient-to-br from-purple-900/15 to-blue-900/15 rounded-3xl shadow-2xl p-6 border border-purple-500/15 hover:border-emerald-500/25 transition-all backdrop-blur-xl">
            <h3 className="font-semibold text-sm mb-4 text-gray-200">Protein Intake</h3>
            <div className="flex items-stretch gap-2 mb-4">
                <input
                    type="number"
                    ref={proteinInputRef}
                    className="bg-purple-950/50 border-2 border-purple-500/30 focus:border-emerald-500 rounded-2xl p-3 text-center text-white font-semibold disabled:bg-purple-950/50 disabled:cursor-not-allowed flex-[7] focus:outline-none transition-all focus:shadow-lg focus:shadow-emerald-500/20"
                    placeholder="grams"
                    disabled={isDayComplete}
                />
                <button
                    onClick={handleAdd}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold rounded-2xl text-sm transition-all disabled:from-zinc-700 disabled:to-zinc-700 disabled:cursor-not-allowed flex-[3] shadow-lg shadow-emerald-500/30"
                    disabled={isDayComplete}
                >
                    Add
                </button>
            </div>
            <div className="bg-purple-950/50 rounded-2xl p-3 border border-purple-500/30">
                <div className="text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">{protein}g</div>
                <div className="text-center text-xs font-medium text-gray-400 mt-1">of 150g</div>
            </div>
        </div>
    );
};

const SpendsTracker = ({ spends, onSpendsChange, isDayComplete }) => {
    const spendsInputRef = useRef(null);
    const currentSpends = parseInt(spends) || 0;

    const handleAdd = () => {
        const amount = parseInt(spendsInputRef.current.value);
        if (amount > 0) {
            onSpendsChange('spends', (currentSpends + amount).toString());
            spendsInputRef.current.value = '';
        }
    };

    return (
        <div className="bg-gradient-to-br from-purple-900/15 to-blue-900/15 rounded-3xl shadow-2xl p-6 border border-purple-500/15 hover:border-orange-500/25 transition-all backdrop-blur-xl">
            <h3 className="font-semibold text-sm mb-4 text-gray-200">Daily Spends</h3>
            <div className="flex items-stretch gap-2 mb-4">
                <input
                    type="number"
                    ref={spendsInputRef}
                    className="bg-purple-950/50 border-2 border-purple-500/30 focus:border-orange-500 rounded-2xl p-3 text-center text-white font-semibold disabled:bg-purple-950/50 disabled:cursor-not-allowed flex-[7] focus:outline-none transition-all focus:shadow-lg focus:shadow-orange-500/20"
                    placeholder="amount"
                    disabled={isDayComplete}
                />
                <button
                    onClick={handleAdd}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-semibold rounded-2xl text-sm transition-all disabled:from-zinc-700 disabled:to-zinc-700 disabled:cursor-not-allowed flex-[3] shadow-lg shadow-orange-500/30"
                    disabled={isDayComplete}
                >
                    Add
                </button>
            </div>
            <div className="bg-purple-950/50 rounded-2xl p-3 border border-purple-500/30">
                <div className="text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">₹{currentSpends}</div>
                <div className="text-center text-xs font-medium text-gray-400 mt-1">today</div>
            </div>
        </div>
    );
};

const CaptainsLog = ({ notes, onNotesChange }) => (
    <div className="bg-gradient-to-br from-purple-900/15 to-blue-900/15 rounded-3xl shadow-2xl p-6 border border-purple-500/15 hover:border-purple-400/25 transition-all backdrop-blur-xl">
        <h3 className="font-semibold text-sm mb-4 text-gray-200">Captain's Log</h3>
        <textarea
            id="notesInput"
            className="w-full h-20 bg-purple-950/50 border-2 border-purple-500/30 focus:border-purple-500 rounded-2xl p-3 text-sm text-white focus:outline-none transition-all resize-none focus:shadow-lg focus:shadow-purple-500/20"
            placeholder="Your daily notes..."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
        ></textarea>
    </div>
);




// --- Progress Log Components ---

const ProgressLog = ({ state }) => {
    const { questLog, currentDay, weightLogs, totalSpends } = state;
    const [selectedDay, setSelectedDay] = useState(null);
    
    const spendData = [];
    for (let day = 1; day <= currentDay; day++) {
        const dayLog = questLog[day];
        spendData.push({ day, amount: dayLog ? dayLog.spends : 0 });
    }
    
    const chartData = {
        labels: spendData.map(log => `Day ${log.day}`),
        datasets: [{
            label: 'Daily Spends (₹)',
            data: spendData.map(log => log.amount),
            borderColor: '#FBBF24',
            backgroundColor: 'rgba(251, 191, 36, 0.1)',
            fill: true,
            tension: 0.1,
            pointBackgroundColor: '#FBBF24',
            pointRadius: 4,
        }]
    };
    
    const chartOptions = {
        responsive: true,
        plugins: { legend: { labels: { color: '#D1D5DB' } } },
        scales: {
            y: { ticks: { color: '#9CA3AF' }, grid: { color: '#4B5563' }, title: { display: true, text: 'Spends (₹)', color: '#D1D5DB' } },
            x: { ticks: { color: '#9CA3AF' }, grid: { color: '#4B5563' } }
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-900/18 to-blue-900/18 rounded-3xl shadow-2xl p-6 text-center border border-purple-500/15 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-amber-400">Total Challenge Spends</h3>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">₹{totalSpends || 0}</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/18 to-blue-900/18 rounded-3xl shadow-2xl p-6 border border-purple-500/15 backdrop-blur-xl">
                <h2 className="text-2xl font-bold mb-4">30-Day Challenge Log</h2>
                <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-3">
                    {[...Array(TOTAL_CHALLENGE_DAYS)].map((_, i) => {
                        const day = i + 1;
                        let dayClass = 'future';
                        let content = day;
                        
                        if (day < currentDay) {
                            const log = questLog[day];
                            if (log) {
                                dayClass = log.status;
                                content = log.status === 'perfect' ? <CheckCheck size={20} /> : <Check size={20} />;
                            } else {
                                dayClass = 'partial';
                                content = <X size={20} />;
                            }
                        } else if (day == currentDay) {
                            dayClass = 'current';
                        }
                        
                        const dayGridItemClass = 'day-grid-item w-full h-12 flex justify-center items-center font-bold rounded-xl cursor-pointer';
                        const styles = {
                            perfect: 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30',
                            partial: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30',
                            current: 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white ring-2 ring-cyan-400 shadow-lg shadow-blue-500/30',
                            future: 'bg-purple-950/30 text-gray-500 border border-purple-500/20'
                        };
                        
                        return (
                            <div 
                                key={day} 
                                className={`${dayGridItemClass} ${styles[dayClass]}`}
                                onClick={() => questLog[day] && setSelectedDay(day)}
                            >
                                {content}
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/18 to-blue-900/18 rounded-3xl shadow-2xl p-6 border border-purple-500/15 backdrop-blur-xl">
                <h2 className="text-2xl font-bold mb-4">Daily Spending Tracker</h2>
                <Line options={chartOptions} data={chartData} />
            </div>
            
            {selectedDay && questLog[selectedDay] && (
                <div className="bg-gradient-to-br from-purple-900/18 to-blue-900/18 rounded-3xl shadow-2xl p-6 border border-purple-500/15 backdrop-blur-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Day {selectedDay} Details</h2>
                        <button onClick={() => setSelectedDay(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-purple-950/50 p-4 rounded-2xl border border-purple-500/30">
                            <div className="text-sm text-gray-400">Water Intake</div>
                            <div className="text-2xl font-bold">{(questLog[selectedDay].water * 0.5).toFixed(1)}L</div>
                        </div>
                        <div className="bg-purple-950/50 p-4 rounded-2xl border border-purple-500/30">
                            <div className="text-sm text-gray-400">Protein</div>
                            <div className="text-2xl font-bold">{questLog[selectedDay].protein}g</div>
                        </div>
                        <div className="bg-purple-950/50 p-4 rounded-2xl border border-purple-500/30">
                            <div className="text-sm text-gray-400">Spends</div>
                            <div className="text-2xl font-bold">₹{questLog[selectedDay].spends}</div>
                        </div>
                        <div className="bg-purple-950/50 p-4 rounded-2xl border border-purple-500/30">
                            <div className="text-sm text-gray-400">XP Earned</div>
                            <div className="text-2xl font-bold">{questLog[selectedDay].points}</div>
                        </div>
                        <div className="bg-purple-950/50 p-4 rounded-2xl border border-purple-500/30">
                            <div className="text-sm text-gray-400">Chegg Questions</div>
                            <div className="text-2xl font-bold">{questLog[selectedDay].chegg || 0}</div>
                        </div>
                        <div className="bg-purple-950/50 p-4 rounded-2xl border border-purple-500/30">
                            <div className="text-sm text-gray-400">Freelance</div>
                            <div className="text-2xl font-bold">₹{questLog[selectedDay].freelance || 0}</div>
                        </div>
                    </div>
                    {questLog[selectedDay].logs && Object.keys(questLog[selectedDay].logs).filter(k => k !== 'spends').length > 0 && (
                        <div className="bg-purple-950/50 p-4 rounded-2xl border border-purple-500/30 mb-4">
                            <div className="text-sm text-gray-400 mb-2">Meals</div>
                            {Object.entries(questLog[selectedDay].logs).filter(([key]) => key !== 'spends').map(([key, value]) => (
                                value && <div key={key} className="text-white mb-1"><span className="text-emerald-400">{key}:</span> {value}</div>
                            ))}
                        </div>
                    )}
                    {questLog[selectedDay].notes && (
                        <div className="bg-purple-950/50 p-4 rounded-2xl border border-purple-500/30">
                            <div className="text-sm text-gray-400 mb-2">Captain's Log</div>
                            <div className="text-white whitespace-pre-wrap">{questLog[selectedDay].notes}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// --- Heatmap Component ---

const Heatmap = ({ state }) => {
    const { questLog, currentDay } = state;
    
    return (
        <div className="bg-gradient-to-br from-purple-900/18 to-blue-900/18 rounded-3xl shadow-2xl p-6 overflow-x-auto border border-purple-500/15 backdrop-blur-xl">
            <h2 className="text-2xl font-bold mb-4">Consistency Heatmap</h2>
            <p className="text-gray-400 mb-6">See your consistency for every task, every day. Green = Done.</p>
            <div className="grid gap-1.5" style={{ gridTemplateColumns: `160px repeat(${TOTAL_CHALLENGE_DAYS}, minmax(30px, 1fr))` }}>
                {/* Header Row (Day numbers) */}
                <div className="heatmap-task-label font-bold text-gray-200">TASK</div>
                {[...Array(TOTAL_CHALLENGE_DAYS)].map((_, i) => (
                    <div key={i} className="heatmap-day-header text-gray-400">{i + 1}</div>
                ))}

                {/* Task Rows */}
                {allTasks.filter(task => task.id !== 'spends').map(task => (
                    <React.Fragment key={task.id}>
                        <div className={`heatmap-task-label ${getCategoryStyle(task.category).icon} truncate`} title={task.text}>
                            {task.text}
                        </div>
                        {[...Array(TOTAL_CHALLENGE_DAYS)].map((_, i) => {
                            const day = i + 1;
                            let cellClass = 'bg-purple-950/30 border border-purple-500/20';
                            const log = questLog[day];
                            if (log && log.tasks.includes(task.id)) {
                                cellClass = 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-sm shadow-emerald-500/30';
                            } else if (day == currentDay) {
                                cellClass = 'bg-gradient-to-br from-blue-500 to-cyan-500 opacity-50';
                            } else if (day < currentDay) {
                                cellClass = 'bg-purple-950/20 opacity-30';
                            }
                            return (
                                <div
                                    key={day}
                                    className={`heatmap-cell ${cellClass} rounded-sm`}
                                    title={`${task.text} - Day ${day}`}
                                >
                                    <div className="w-full h-full" style={{ paddingBottom: '100%' }}></div>
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};


// --- Modal Components ---

const Modal = ({ show, onClose, children }) => {
    if (!show) return null;
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center p-4 z-50 transition-opacity duration-300"
            onClick={onClose}
        >
            <div
                className="modal-content bg-gradient-to-br from-purple-900/95 to-blue-900/95 rounded-3xl shadow-2xl w-full max-w-sm scale-100 transition-transform duration-300 border border-purple-500/30 backdrop-blur-xl"
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

const WeightModal = ({ show, onClose, onSave, lastWeight }) => {
    const [weight, setWeight] = useState('');
    
    const handleSave = () => {
        onSave(weight);
        setWeight('');
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">New Day: Log Your Weight</h2>
                <p className="text-gray-400 mb-4">Log your weight to track progress. Your last log was <span className="font-bold">{lastWeight.toFixed(1)}</span> kg.</p>
                <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    className="w-full bg-purple-950/50 border-2 border-purple-500/40 rounded-2xl p-3 text-center text-2xl text-white focus:outline-none focus:border-purple-500"
                    placeholder="e.g. 73.5"
                />
                <div className="flex justify-between mt-6">
                    <button onClick={onClose} className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-2 px-6 rounded-2xl transition-all shadow-lg">Skip</button>
                    <button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-bold py-2 px-6 rounded-2xl transition-all shadow-lg shadow-blue-500/30">Save</button>
                </div>
            </div>
        </Modal>
    );
};

const DayCompleteModal = ({ show, onClose, stats }) => (
    <Modal show={show} onClose={onClose}>
        <div className="p-8 text-center">
            <h2 className="text-3xl font-black text-emerald-400 mb-3">{stats.title}</h2>
            <p className="text-lg mb-4">{stats.message}</p>
            <p className="text-5xl font-bold mb-6">{stats.points > 0 ? `+${stats.points}` : stats.points} XP</p>
            <button
                onClick={onClose}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-3 px-8 rounded-2xl text-lg transition-all shadow-lg shadow-emerald-500/30"
            >
                Start Next Day
            </button>
        </div>
    </Modal>
);

const ResetModal = ({ show, onClose, onConfirm }) => (
    <Modal show={show} onClose={onClose}>
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Reset Challenge?</h2>
            <p className="text-gray-300 mb-6">Are you sure? This will erase all your progress, points, and weight logs.</p>
            <div className="flex justify-between mt-6">
                <button onClick={onClose} className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-2 px-6 rounded-2xl transition-all shadow-lg">Cancel</button>
                <button onClick={onConfirm} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-2 px-6 rounded-2xl transition-all shadow-lg shadow-red-500/30">Confirm Reset</button>
            </div>
        </div>
    </Modal>
);