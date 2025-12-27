// Monthly Goal Configuration
// Edit this at the start of each month to customize your goals

export const MONTHLY_CONFIG = {
  // Current month identifier (format: YYYY-MM)
  currentMonth: '2025-01',
  
  // Challenge duration
  totalDays: 30,
  
  // Weight goals
  startingWeight: 74.0,
  goalWeight: 69.0,
  
  // Daily targets
  dailyTargets: {
    waterGlasses: 7,  // 3.5L
    proteinGrams: 150,
    steps: 10000
  },
  
  // Tasks for this month (you can enable/disable tasks)
  enabledTasks: {
    // Core Habits
    sleep: true,
    hydrate: true,
    sunlight: true,
    supplements: true,
    
    // Diet & Nutrition
    fasting: true,
    noJunk: true,
    meal1: true,
    meal2: true,
    meal3: true,
    
    // Fitness & Movement
    steps: true,
    workout: true,
    physio1: true,
    physio2: true,
    
    // Grooming & Self-Care
    morningRoutine: true,
    nightRoutine: true,
    shower: true,
    hairWash: true,
    hairOil: true,
    
    // Tech & Learning
    dsa: true,
    systemDesign: true,
    
    // Finance & Income
    spends: true,
    chegg: true,
    freelance: true
  },
  
  // Custom tasks (add your own!)
  customTasks: [
    // Example:
    // { id: 'meditation', text: 'Meditate 10 mins', desc: 'Morning meditation', points: 15, category: 'core', icon: 'Sparkles' }
  ]
};

// Month history - keeps track of past months
export const MONTH_HISTORY = [
  // Will be populated as you complete months
  // { month: '2025-01', totalXP: 8500, daysCompleted: 28, weightLost: 4.2 }
];
