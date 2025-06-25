import { Suspense, useState } from "react";
import { calculateLevel, triggerConfetti } from "../utils/helper";
import { Canvas } from "@react-three/fiber";
import { TreasureChest3D } from "./TreasureChest3D";
import { Coins, Diamond, PocketIcon, Shield, ShoppingBag, X } from "lucide-react";
import { ARMORY_ITEMS } from "../utils/constant";

export const ArmoryInterface = ({
    guildData,
    onPurchase,
    onClose,
    soundManager
}: {
    guildData: any;
    onPurchase: (item: any, category: string) => void;
    onClose: () => void;
    soundManager: any;
}) => {
    const [selectedCategory, setSelectedCategory] = useState<'items' | 'supplies' | 'specials'>('items');
    const userLevel = calculateLevel(guildData.xp || 0).level;

    const canAfford = (price: number) => (guildData.gold || 0) >= price;
    const canEquip = (levelRequired: number) => userLevel >= levelRequired;
    const isOwned = (itemId: string) => {
        return guildData.inventory?.includes(itemId) ||
            guildData.equippedGear?.includes(itemId) ||
            guildData.treasures?.includes(itemId);
    };

    const handlePurchase = async (item: any, category: string) => {
        if (!canAfford(item.price) || isOwned(item.id)) return;

        await onPurchase(item, category);
        soundManager.play('purchase');
        triggerConfetti({
            particleCount: 50,
            spread: 45,
            origin: { y: 0.8 }
        });
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="parchment rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
                {/* 3D Treasure Chest */}
                <div className="absolute top-4 left-4 w-32 h-32 z-10">
                    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                        <Suspense fallback={null}>
                            <TreasureChest3D isOpen={selectedCategory === 'specials'} />
                        </Suspense>
                    </Canvas>
                </div>

                {/* Header */}
                <div className="bg-gradient-to-r from-orange-900 to-amber-900 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <ShoppingBag className="w-6 h-6 text-yellow-500 treasure-glow" />
                        <h2 className="text-2xl font-bold text-yellow-100">Store</h2>
                        <div className="flex items-center space-x-2 ml-6">
                            <Coins className="w-5 h-5 text-yellow-500" />
                            <span className="font-bold text-yellow-100">{guildData.gold || 0}</span>
                        </div>
                    </div>
                    <button onClick={() => { onClose(); soundManager.play('swordDraw'); }} className="text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Category Tabs */}
                <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 px-6 py-3 flex space-x-4 border-b border-yellow-700">
                    <button
                        onClick={() => setSelectedCategory('items')}
                        className={`px-4 py-2 rounded-lg transition-all ${selectedCategory === 'items'
                            ? 'bg-purple-800 text-white magic-border'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4" />
                            <span>Items</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setSelectedCategory('supplies')}
                        className={`px-4 py-2 rounded-lg transition-all ${selectedCategory === 'supplies'
                            ? 'bg-purple-800 text-white magic-border'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        <div className="flex items-center space-x-2">
                            <PocketIcon className="w-4 h-4" />
                            <span>Supplies</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setSelectedCategory('specials')}
                        className={`px-4 py-2 rounded-lg transition-all ${selectedCategory === 'specials'
                            ? 'bg-purple-800 text-white magic-border'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        <div className="flex items-center space-x-2">
                            <Diamond className="w-4 h-4" />
                            <span>Specials</span>
                        </div>
                    </button>
                </div>

                {/* Items Grid */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ARMORY_ITEMS[selectedCategory].map((item: any) => {
                            const owned = isOwned(item.id);
                            const affordable = canAfford(item.price);
                            const levelMet = canEquip(item.levelRequired || 1);
                            const canPurchase = !owned && affordable && levelMet;

                            return (
                                <div
                                    key={item.id}
                                    className={`parchment p-4 border-2 transition-all ${owned ? 'magic-border' :
                                        canPurchase ? 'border-gray-600 hover:border-yellow-500 hover:transform hover:scale-105' :
                                            'border-gray-700 opacity-50'
                                        } hero-3d`}
                                    onMouseEnter={() => canPurchase && soundManager.play('swordDraw')}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-3xl float-3d">{item.icon}</span>
                                            <div>
                                                <h4 className="font-bold text-yellow-100">{item.name}</h4>
                                                <p className="text-xs text-gray-300">
                                                    Level {item.levelRequired || 1} Required
                                                </p>
                                            </div>
                                        </div>
                                        {owned && (
                                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                                                Owned
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-300 mb-3">{item.description}</p>

                                    {item.stats && (
                                        <div className="mb-3 space-y-1">
                                            {item.stats.xpBonus && (
                                                <p className="text-xs text-purple-400">
                                                    +{item.stats.xpBonus}% Experience Bonus
                                                </p>
                                            )}
                                            {item.stats.goldBonus && (
                                                <p className="text-xs text-yellow-400">
                                                    +{item.stats.goldBonus}% Gold Bonus
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {item.requirement && (
                                        <p className="text-xs text-orange-400 mb-3">
                                            Requires: {item.requirement}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Coins className="w-4 h-4 text-yellow-500" />
                                            <span className={`${affordable || owned ? 'text-yellow-100' : 'text-red-400'}`}>
                                                {item.price}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handlePurchase(item, selectedCategory)}
                                            disabled={!canPurchase}
                                            className={`px-3 py-1 rounded-full text-sm transition-all ${owned ? 'bg-gray-600 text-gray-400 cursor-not-allowed' :
                                                canPurchase
                                                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white transform hover:scale-110'
                                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            {owned ? 'Owned' :
                                                !levelMet ? `Level ${item.levelRequired}` :
                                                    !affordable ? 'Insufficient Gold' :
                                                        'Buy'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};