import { STORAGE_KEY, STARTING_WEIGHT } from '../constants';

export const getInitialState = () => {
    try {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            const parsed = JSON.parse(savedState);
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
        lastVisitDate: new Date().toLocaleDateString(),
    };
};

export const saveState = (state) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error("Failed to save state to localStorage", e);
    }
};
