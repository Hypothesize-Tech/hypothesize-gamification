import Modal from './Modal';
import { X, Star, Coins, Sparkles } from 'lucide-react';

interface QuestCompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    questName: string;
    rating: number;
    feedback: string;
    improvementFeedback?: string;
    xpReward: number;
    goldReward: number;
}

const QuestCompletionModal: React.FC<QuestCompletionModalProps> = ({
    isOpen,
    onClose,
    questName,
    rating,
    feedback,
    improvementFeedback,
    xpReward,
    goldReward,
}) => {
    if (!isOpen) return null;

    return (
        <Modal open={isOpen} onClose={onClose} size="md">
            <div className="parchment p-8 relative bg-gray-900 text-yellow-50 border-4 border-yellow-700/50 rounded-lg">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center">
                    <h2 className="text-3xl font-bold text-yellow-300">Quest Complete!</h2>
                    <p className="text-lg text-gray-300 mt-1">You have successfully completed the "{questName}" quest.</p>
                </div>

                <div className="my-6">
                    <h3 className="text-xl font-semibold text-yellow-200 mb-3 text-center">Grand Master's Judgment</h3>
                    <div className="flex justify-center items-center space-x-2 mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={`w-10 h-10 transition-all duration-500 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                                style={{ transitionDelay: `${i * 100}ms` }}
                            />
                        ))}
                    </div>
                    <p className="text-4xl font-bold text-yellow-400 text-center">{rating}</p>
                </div>

                {feedback && (
                    <div className="mt-6 text-center">
                        <h4 className="text-xl font-semibold text-gray-300">Rating Breakdown</h4>
                        <p className="text-gray-400 mt-2">{feedback}</p>
                    </div>
                )}

                {improvementFeedback && (
                    <div className="mt-6 text-center">
                        <h4 className="text-xl font-semibold text-gray-300">How to Improve</h4>
                        <p className="text-gray-400 mt-2">{improvementFeedback}</p>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <h3 className="text-xl font-semibold text-yellow-200 mb-3 text-center">Your Spoils</h3>
                    <div className="flex justify-around items-center text-lg">
                        <div className="flex items-center space-x-3">
                            <Sparkles className="w-8 h-8 text-blue-400" />
                            <span className="font-bold text-white">+{xpReward} XP</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Coins className="w-8 h-8 text-yellow-400" />
                            <span className="font-bold text-white">+{goldReward} Gold</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 magic-border mx-auto"
                    >
                        Continue Your Journey
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default QuestCompletionModal;
