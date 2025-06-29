import { useEffect } from 'react';
import { Trophy, X } from 'lucide-react';

const AchievementPopup = ({ achievements, onClose, soundManager }: { achievements: any[], onClose: () => void, soundManager: any }) => {
    useEffect(() => {
        soundManager.play('levelUp');
    }, [soundManager]);

    if (!achievements || achievements.length === 0) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 border-2 border-yellow-500 rounded-lg shadow-2xl p-6 max-w-sm w-full text-center relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white">
                    <X size={20} />
                </button>
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Achievement Unlocked!</h2>
                {achievements.map((ach, index) => (
                    <div key={index} className="mb-4">
                        <p className="text-lg font-semibold text-yellow-500">{ach.icon} {ach.name}</p>
                        <p className="text-gray-300">{ach.description}</p>
                    </div>
                ))}
                <button
                    onClick={onClose}
                    className="mt-4 px-6 py-2 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-500 transition-colors"
                >
                    Awesome!
                </button>
            </div>
        </div>
    );
};

export default AchievementPopup; 