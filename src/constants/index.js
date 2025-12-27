import {
    Bed, GlassWater, Sun, Pill, Clock, Ban, Egg, Bolt, Fish,
    Footprints, Dumbbell, PlusSquare, Moon, Snowflake, Bath,
    Wind, Code, Network, DollarSign
} from 'lucide-react';

export const STARTING_WEIGHT = 74.0;
export const GOAL_WEIGHT = 69.0;
export const TOTAL_CHALLENGE_DAYS = 30;
export const STORAGE_KEY = 'transformationChallengeState_v3_react';

export const allTasks = [
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
    { id: 'chegg', text: 'Chegg Questions', desc: 'Number of questions solved', points: 10, category: 'income', icon: Code, type: 'log' },
    { id: 'freelance', text: 'Freelance Work', desc: 'Money earned from freelance (₹)', points: 10, category: 'income', icon: DollarSign, type: 'log' }
];

export const getCategoryStyle = (category) => {
    switch (category) {
        case 'core': return { border: 'border-blue-500', icon: 'text-blue-400' };
        case 'diet': return { border: 'border-emerald-500', icon: 'text-emerald-400' };
        case 'fitness': return { border: 'border-orange-500', icon: 'text-orange-400' };
        case 'grooming': return { border: 'border-purple-500', icon: 'text-purple-400' };
        case 'tech': return { border: 'border-amber-500', icon: 'text-amber-400' };
        case 'income': return { border: 'border-green-500', icon: 'text-green-400' };
        default: return { border: 'border-gray-500', icon: 'text-gray-400' };
    }
};
