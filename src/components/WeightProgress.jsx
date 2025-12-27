import { Target } from 'lucide-react';
import { GOAL_WEIGHT } from '../constants';

export default function WeightProgress({ progress, toGo }) {
    return (
        <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-3xl shadow-2xl p-6 mb-8 border border-purple-400/20 backdrop-blur-xl">
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                    <Target size={18} className="text-cyan-400"/> Weight Goal: {GOAL_WEIGHT} kg
                </span>
                <span className="text-sm font-bold text-cyan-400">{toGo} kg to go</span>
            </div>
            <div className="w-full bg-blue-950/50 rounded-full h-3 overflow-hidden">
                <div
                    className="h-3 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 transition-all duration-500 shadow-lg shadow-purple-500/50"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
}
