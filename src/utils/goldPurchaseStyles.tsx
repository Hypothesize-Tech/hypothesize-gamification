export const goldPurchaseStyles = `
  @keyframes fall {
    0% {
      transform: translateY(-100vh) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }

  .animate-fall {
    animation: fall linear;
  }

  .gold-shine {
    background: linear-gradient(
      45deg,
      #FFD700,
      #FFA500,
      #FFD700,
      #FFA500,
      #FFD700
    );
    background-size: 200% 200%;
    animation: shine 3s ease-in-out infinite;
  }

  @keyframes shine {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .treasure-glow {
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
    animation: glow 2s ease-in-out infinite;
  }

  @keyframes glow {
    0%, 100% {
      filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
    }
    50% {
      filter: drop-shadow(0 0 30px rgba(255, 215, 0, 1));
    }
  }

  .vip-badge {
    background: linear-gradient(
      135deg,
      #9333ea,
      #ec4899,
      #9333ea
    );
    background-size: 200% 200%;
    animation: vip-gradient 4s ease infinite;
  }

  @keyframes vip-gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .coin-flip {
    animation: flip 0.6s ease-out;
  }

  @keyframes flip {
    0% {
      transform: rotateY(0deg);
    }
    100% {
      transform: rotateY(360deg);
    }
  }

  .limited-pulse {
    animation: pulse-red 2s infinite;
  }

  @keyframes pulse-red {
    0% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    70% {
      box-shadow: 0 0 0 20px rgba(239, 68, 68, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
    }
  }

  .chest-open {
    animation: chest-bounce 0.5s ease-out;
  }

  @keyframes chest-bounce {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  .gold-particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: #FFD700;
    border-radius: 50%;
    pointer-events: none;
    animation: particle-float 3s ease-out forwards;
  }

  @keyframes particle-float {
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(var(--x), var(--y)) scale(0);
      opacity: 0;
    }
  }

  .weekend-gradient {
    background: linear-gradient(
      270deg,
      #7c3aed,
      #2563eb,
      #7c3aed
    );
    background-size: 200% 200%;
    animation: weekend-wave 5s ease infinite;
  }

  @keyframes weekend-wave {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .purchase-success {
    animation: success-burst 0.6s ease-out;
  }

  @keyframes success-burst {
    0% {
      transform: scale(0) rotate(0deg);
      opacity: 0;
    }
    50% {
      transform: scale(1.2) rotate(180deg);
      opacity: 1;
    }
    100% {
      transform: scale(1) rotate(360deg);
      opacity: 1;
    }
  }

  .currency-badge {
    background: radial-gradient(
      ellipse at center,
      rgba(255, 215, 0, 0.3) 0%,
      rgba(255, 215, 0, 0) 70%
    );
  }

  .paypal-buttons {
    margin-top: 1rem;
  }

  .paypal-button {
    border-radius: 0.5rem !important;
  }
`;