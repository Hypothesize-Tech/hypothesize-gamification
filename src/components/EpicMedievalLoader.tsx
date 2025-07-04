import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

export const EpicMedievalLoader = () => {
    const [loadingPhrase, setLoadingPhrase] = useState(0);
    const [progress, setProgress] = useState(0);

    const loadingPhrases = [
        "Initializing resources...",
        "Loading essential tools...",
        "Connecting to the network...",
        "Preparing your workspace...",
        "Starting up services...",
        "Optimizing performance...",
        "Syncing your documents...",
        "Collaborating with your team...",
        "Setting up your dashboard...",
        "Almost ready..."
    ];

    useEffect(() => {
        const phraseInterval = setInterval(() => {
            setLoadingPhrase((prev) => (prev + 1) % loadingPhrases.length);
        }, 2000);

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return Math.min(prev + Math.random() * 10, 100);
            });
        }, 300);

        return () => {
            clearInterval(phraseInterval);
            clearInterval(progressInterval);
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center text-white font-sans">
            {/* Logo */}
            <img src={logo} alt="Logo" className="w-80 h-80 mb-6 animate-pulse" />

            {/* Loading text */}
            <p className="text-lg text-gray-300 mb-4 transition-all duration-500">
                {loadingPhrases[loadingPhrase]}
            </p>

            {/* Progress bar */}
            <div className="w-64 bg-gray-700 rounded-full h-2.5">
                <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-linear"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                />
            </div>

            {/* Progress percentage */}
            <p className="mt-3 text-sm text-gray-400">
                {Math.floor(Math.min(progress, 100))}%
            </p>
        </div>
    );
};