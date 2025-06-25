import { Gift } from "lucide-react";
import { useEffect, useState } from "react";

export const DailyBonus = ({
    guildData,
    onClaim,
    soundManager
}: {
    guildData: any;
    onClaim: () => void;
    soundManager: any;
}) => {
    if (!guildData) {
        return (
            <div className="parchment p-4 transition-all">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Gift className="w-8 h-8 text-yellow-500 treasure-glow" />
                        <div>
                            <h3 className="font-bold text-yellow-100">Daily Tribute</h3>
                            <p className="text-sm text-yellow-200/80">Awaiting thy claim...</p>
                        </div>
                    </div>
                    <button
                        disabled
                        className="px-4 py-2 rounded-lg font-semibold bg-gray-700 text-gray-400 cursor-not-allowed"
                    >
                        Claim
                    </button>
                </div>
            </div>
        );
    }

    const [canClaim, setCanClaim] = useState(false);
    const [timeUntilNext, setTimeUntilNext] = useState('');

    useEffect(() => {
        const checkDailyBonus = () => {
            const lastClaim = guildData.lastDailyBonus;
            const now = new Date();
            const lastClaimDate = lastClaim ? new Date(lastClaim) : null;

            if (!lastClaimDate ||
                now.toDateString() !== lastClaimDate.toDateString()) {
                setCanClaim(true);
                setTimeUntilNext('');
            } else {
                setCanClaim(false);
                const tomorrow = new Date(now);
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(0, 0, 0, 0);
                const diff = tomorrow.getTime() - now.getTime();
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeUntilNext(`${hours} candle marks, ${minutes} sand grains`);
            }
        };

        checkDailyBonus();
        const interval = setInterval(checkDailyBonus, 60000);

        return () => clearInterval(interval);
    }, [guildData.lastDailyBonus]);

    return (
        <div className={`parchment p-4 transition-all ${canClaim ? 'magic-border' : ''}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Gift className={`w-8 h-8 ${canClaim ? 'text-yellow-500 treasure-glow' : 'text-gray-500'}`} />
                    <div>
                        <h3 className="font-bold text-yellow-100">Daily Tribute</h3>
                        <p className="text-sm text-yellow-200/80">
                            {canClaim ? 'The kingdom offers 5 gold coins!' : `Next tribute in ${timeUntilNext}`}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => { onClaim(); soundManager.play('coinCollect'); }}
                    disabled={!canClaim}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${canClaim
                        ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:from-yellow-500 hover:to-orange-500 transform hover:scale-105'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {canClaim ? 'Claim +5 ⚡' : 'Claimed'}
                </button>
            </div>
            {guildData.dailyStreak > 1 && (
                <div className="mt-2 text-sm text-yellow-200/80">
                    🔥 {guildData.dailyStreak} day crusade!
                </div>
            )}
        </div>
    );
};
