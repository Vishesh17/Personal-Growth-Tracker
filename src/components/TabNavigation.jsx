import { Check, Calendar, LayoutGrid } from 'lucide-react';

export default function TabNavigation({ activeTab, setActiveTab }) {
    const tabs = [
        { id: 'mission', label: 'Daily Mission', icon: Check },
        { id: 'progress', label: 'Progress Log', icon: Calendar },
        { id: 'heatmap', label: 'Heatmap', icon: LayoutGrid }
    ];
    
    return (
        <nav className="flex gap-2 mb-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-3xl p-2 shadow-2xl border border-purple-400/20 backdrop-blur-xl">
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
}
