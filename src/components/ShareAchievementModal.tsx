import React from 'react';
import { Linkedin, X as XIcon, Share2, Download } from 'lucide-react';
import wallpaperImage from '../assets/wallpaper_9.png';

interface ShareAchievementModalProps {
    isOpen: boolean;
    onClose: () => void;
    achievement: {
        name: string;
        description: string;
    };
    shareUrls: {
        linkedIn: string;
        twitter: string;
    };
}

const ShareAchievementModal: React.FC<ShareAchievementModalProps> = ({
    isOpen,
    onClose,
    achievement,
    shareUrls,
}) => {
    if (!isOpen) return null;

    const handleShare = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
        onClose();
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = wallpaperImage;
        link.download = `${achievement.name.replace(/\s+/g, '_')}_Achievement.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center" onClick={onClose}>
            <div className="parchment max-w-lg w-full p-8 m-4 rounded-lg shadow-2xl text-yellow-100 border-2 border-yellow-700 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <XIcon className="w-6 h-6" />
                </button>

                <div className="text-center">
                    <Share2 className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                    <h2 className="text-3xl font-bold">Achievement Unlocked!</h2>
                    <p className="text-lg text-gray-300 mt-2">You've completed "{achievement.name}"</p>
                </div>

                <div className="my-6">
                    <img
                        src={wallpaperImage}
                        alt={`${achievement.name} Achievement`}
                        className="w-full rounded-lg border-2 border-yellow-600 shadow-lg"
                    />
                </div>

                <div className="text-center mb-6">
                    <p className="text-gray-300 italic">Share your glorious achievement with the world!</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => handleShare(shareUrls.linkedIn)}
                        className="flex-1 px-6 py-3 bg-[#0077B5] text-white rounded-lg hover:bg-[#005582] transition-all flex items-center justify-center space-x-2 text-lg font-semibold"
                    >
                        <Linkedin className="w-6 h-6" />
                        <span>Share on LinkedIn</span>
                    </button>
                    <button
                        onClick={() => handleShare(shareUrls.twitter)}
                        className="flex-1 px-6 py-3 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#0c85d0] transition-all flex items-center justify-center space-x-2 text-lg font-semibold"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
                        </svg>
                        <span>Share on X</span>
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={handleDownload}
                        className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center space-x-2 text-base font-semibold mx-auto"
                    >
                        <Download className="w-5 h-5" />
                        <span>Download Image</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareAchievementModal;