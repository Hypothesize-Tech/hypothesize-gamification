// Export the main medieval styles string
const medievalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=MedievalSharp&family=Pirata+One&family=Almendra:wght@400;700&family=Uncial+Antiqua&display=swap');

  * {
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><defs><filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="blade" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23e0f2fe;stop-opacity:1" /><stop offset="50%" style="stop-color:%23fef3c7;stop-opacity:1" /><stop offset="100%" style="stop-color:%23dbeafe;stop-opacity:1" /></linearGradient><linearGradient id="handle" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:%238b4513;stop-opacity:1" /><stop offset="100%" style="stop-color:%23654321;stop-opacity:1" /></linearGradient></defs><g transform="rotate(-45 20 20)"><rect x="18" y="5" width="4" height="20" fill="url(%23blade)" filter="url(%23glow)" opacity="0.9"/><rect x="17" y="23" width="6" height="8" fill="url(%23handle)"/><rect x="15" y="22" width="10" height="2" fill="%23d4af37"/><circle cx="20" cy="23" r="2" fill="%23ffd700" opacity="0.8"/><path d="M20,5 L18,3 L20,1 L22,3 Z" fill="%23e0f2fe" opacity="0.7"/></g><circle cx="20" cy="20" r="15" fill="none" stroke="%23ffd700" stroke-width="0.5" opacity="0.3"><animate attributeName="r" values="15;20;15" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite"/></circle></svg>'), auto !important;
  }

  body {
    background: #0a0a0a;
    position: relative;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2084') center/cover;
    filter: brightness(0.2) contrast(1.2);
    z-index: -2;
  }

  body::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 50%, rgba(139, 69, 19, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(218, 165, 32, 0.2) 0%, transparent 50%),
      radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.9) 100%);
    z-index: -1;
  }

  /* Magical particles */
  @keyframes floatParticle {
    0% { transform: translateY(100vh) translateX(0) scale(0) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-100vh) translateX(100px) scale(1) rotate(360deg); opacity: 0; }
  }

  .magic-particle {
    position: fixed;
    width: 6px;
    height: 6px;
    background: radial-gradient(circle, #ffd700 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 100;
    box-shadow: 0 0 15px #ffd700, 0 0 30px #ffa500;
  }

  /* More readable typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: 'MedievalSharp', serif !important;
    text-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 2px 4px rgba(0,0,0,0.8);
    letter-spacing: 1px;
  }

  p, span, div {
    font-family: 'Almendra', serif;
    letter-spacing: 0.5px;
    line-height: 1.6;
  }

  /* Enhanced button style */
  button {
    position: relative;
    background: linear-gradient(135deg, #2d1810 0%, #1a0e08 50%, #2d1810 100%);
    border: 2px solid #d4af37;
    border-radius: 8px;
    padding: 12px 24px;
    color: #fef3c7;
    font-family: 'MedievalSharp', serif;
    font-weight: 600;
    letter-spacing: 1px;
    box-shadow: 
      inset 0 0 20px rgba(212, 175, 55, 0.3),
      0 0 20px rgba(212, 175, 55, 0.4),
      0 4px 15px rgba(0, 0, 0, 0.8);
    transition: all 0.3s ease;
    overflow: hidden;
  }

  button::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
    transform: rotate(45deg);
    transition: all 0.5s ease;
    opacity: 0;
  }

  button:hover::before {
    opacity: 1;
    animation: shimmer 0.5s ease;
  }

  @keyframes shimmer {
    0% { transform: rotate(45deg) translateX(-100%); }
    100% { transform: rotate(45deg) translateX(100%); }
  }

  button:hover {
    transform: translateY(-2px);
    box-shadow: 
      inset 0 0 30px rgba(212, 175, 55, 0.5),
      0 0 40px rgba(212, 175, 55, 0.7),
      0 8px 20px rgba(0, 0, 0, 0.9);
    border-color: #ffd700;
  }

  /* Enhanced parchment containers */
  .parchment {
    background: 
      linear-gradient(135deg, rgba(45, 34, 30, 0.95) 0%, rgba(35, 26, 23, 0.95) 100%);
    border: 2px solid #8b6914;
    border-radius: 8px;
    position: relative;
    box-shadow: 
      inset 0 0 50px rgba(0, 0, 0, 0.5),
      0 0 30px rgba(0, 0, 0, 0.8),
      0 0 60px rgba(139, 105, 20, 0.3);
    backdrop-filter: blur(5px);
  }

  .parchment::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><defs><filter id="rough"><feTurbulence baseFrequency="0.02" numOctaves="5" result="noise" seed="5"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2"/></filter></defs><rect width="100" height="100" fill="none" stroke="%238b6914" stroke-width="0.5" opacity="0.3" filter="url(%23rough)"/></svg>');
    border-radius: 8px;
    pointer-events: none;
  }
  
  .magic-border {
    position: relative;
  }

  .magic-border::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(45deg, #ffd700, #ff6b35, #ffd700, #4ecdc4);
    background-size: 400% 400%;
    border-radius: inherit;
    z-index: -1;
    opacity: 0.7;
  }

  /* 3D effect for important elements */
  .hero-3d {
    transform-style: preserve-3d;
    transform: perspective(1000px) rotateY(0deg);
    transition: transform 0.6s ease;
  }

  .hero-3d:hover {
    transform: perspective(1000px) rotateY(10deg) rotateX(-5deg);
  }

  /* Floating animation for 3D elements */
  @keyframes float3D {
    0%, 100% { transform: translateY(0px) rotateY(0deg); }
    25% { transform: translateY(-10px) rotateY(90deg); }
    50% { transform: translateY(0px) rotateY(180deg); }
    75% { transform: translateY(-10px) rotateY(270deg); }
  }

  .float-3d {
    animation: float3D 6s ease-in-out infinite;
  }

  /* Treasure chest effect */
  .treasure-glow {
    filter: drop-shadow(0 0 20px #ffd700) drop-shadow(0 0 40px #ff6b35);
    animation: treasurePulse 2s ease-in-out infinite;
  }

  @keyframes treasurePulse {
    0%, 100% { 
      filter: drop-shadow(0 0 20px #ffd700) drop-shadow(0 0 40px #ff6b35);
      transform: scale(1);
    }
    50% { 
      filter: drop-shadow(0 0 30px #ffd700) drop-shadow(0 0 60px #ff6b35);
      transform: scale(1.05);
    }
  }

  /* Enhanced input fields */
  input, textarea, select {
    background: rgba(20, 15, 10, 0.9) !important;
    border: 2px solid #8b6914 !important;
    border-radius: 6px !important;
    color: #fef3c7 !important;
    font-family: 'Almendra', serif !important;
    padding: 12px 16px !important;
    letter-spacing: 0.5px !important;
    box-shadow: 
      inset 0 2px 8px rgba(0, 0, 0, 0.6),
      0 0 15px rgba(139, 105, 20, 0.2) !important;
    transition: all 0.3s ease !important;
  }

  input:focus, textarea:focus, select:focus {
    outline: none !important;
    border-color: #d4af37 !important;
    box-shadow: 
      inset 0 2px 8px rgba(0, 0, 0, 0.6),
      0 0 25px rgba(212, 175, 55, 0.5) !important;
    background: rgba(25, 20, 15, 0.95) !important;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(20, 15, 10, 0.8);
    border: 1px solid #8b6914;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #8b6914, #d4af37);
    border-radius: 6px;
    border: 1px solid #2d1810;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #d4af37, #ffd700);
  }

  /* 3D stage for weapons */
  .weapon-stage {
    width: 100%;
    height: 200px;
    position: relative;
    background: radial-gradient(ellipse at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
    border-radius: 8px;
    overflow: hidden;
  }
`;

export default medievalStyles; 