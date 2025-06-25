import React from 'react';

const EpicMedievalLoaderStyles: React.FC = () => (
    <style>{`
    @keyframes float-up {
      0% { transform: translateY(0) scale(0); opacity: 0; }
      10% { opacity: 1; transform: scale(1); }
      90% { opacity: 1; }
      100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes glow-pulse {
      0%, 100% { filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)); }
      50% { filter: drop-shadow(0 0 40px rgba(255, 215, 0, 1)); }
    }
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }
    .animate-float-up { animation: float-up 10s ease-out infinite; }
    .animate-spin-slow { animation: spin-slow 20s linear infinite; }
    .animate-glow-pulse { animation: glow-pulse 2s ease-in-out infinite; }
    .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
  `}</style>
);

export default EpicMedievalLoaderStyles; 