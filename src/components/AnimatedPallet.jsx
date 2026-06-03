import React from "react";

export default function AnimatedPallet({ status = "ok", size = 200 }) {
  // Determine colors and glows based on status
  let glowColor = "rgba(26, 122, 60, 0.4)"; // Green
  let ledColor = "#1A7A3C";
  let alertRing = null;
  let showLaser = false;
  let showCheck = false;

  if (status === "warn") {
    glowColor = "rgba(226, 0, 26, 0.4)"; // Red
    ledColor = "#E2001A";
  } else if (status === "scanning") {
    glowColor = "rgba(226, 0, 26, 0.25)"; // scanning uses red laser
    ledColor = "#E2001A";
    showLaser = true;
  } else if (status === "confirm") {
    glowColor = "rgba(26, 122, 60, 0.5)";
    ledColor = "#1A7A3C";
    showCheck = true;
  }

  return (
    <div style={{
      position: "relative",
      width: size,
      height: size,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      perspective: "1000px"
    }}>
      <style>{`
        @keyframes palletFloat {
          0% { transform: translateY(0px) rotateX(10deg); }
          50% { transform: translateY(-8px) rotateX(10deg); }
          100% { transform: translateY(0px) rotateX(10deg); }
        }
        @keyframes glowPulse {
          0% { transform: scale(0.95); opacity: 0.4; }
          50% { transform: scale(1.05); opacity: 0.75; }
          100% { transform: scale(0.95); opacity: 0.4; }
        }
        @keyframes ledBlink {
          0%, 100% { opacity: 1; filter: drop-shadow(0 0 6px ${ledColor}); }
          50% { opacity: 0.3; filter: drop-shadow(0 0 1px ${ledColor}); }
        }
        @keyframes laserSweep {
          0% { transform: translateY(-30px) scaleX(0.85); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(60px) scaleX(1.1); opacity: 0; }
        }
        @keyframes dataPulse {
          0% { stroke-dashoffset: 40; opacity: 0.3; }
          50% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0.3; }
        }
        @keyframes successPop {
          0% { transform: scale(0) translateY(-20px); opacity: 0; }
          70% { transform: scale(1.15) translateY(-5px); opacity: 0.9; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .pallet-container {
          animation: palletFloat 4s ease-in-out infinite;
          transform-style: preserve-3d;
        }
        .floor-glow {
          animation: glowPulse 4s ease-in-out infinite;
          mix-blend-mode: screen;
        }
        .sensor-led {
          animation: ledBlink 1.5s ease-in-out infinite;
        }
        .laser-beam {
          animation: laserSweep 2s ease-in-out infinite;
        }
        .data-stream {
          stroke-dasharray: 8 4;
          animation: dataPulse 3s linear infinite;
        }
        .success-checkmark {
          animation: successPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>

      {/* SVG Container */}
      <svg width="100%" height="100%" viewBox="0 0 240 220" style={{ overflow: "visible" }}>
        <defs>
          {/* Radial glow for floor */}
          <radialGradient id="floorGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={glowColor} />
            <stop offset="60%" stopColor={glowColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          
          {/* Linear gradients for high-tech wood boards */}
          <linearGradient id="boardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A4E54" />
            <stop offset="50%" stopColor="#303337" />
            <stop offset="100%" stopColor="#1E2023" />
          </linearGradient>
          
          <linearGradient id="boardHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8A929B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8A929B" stopOpacity="0" />
          </linearGradient>

          {/* Alert glow overlay */}
          <radialGradient id="alertGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={ledColor} stopOpacity="0.6" />
            <stop offset="100%" stopColor={ledColor} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Ground Glow */}
        <ellipse 
          cx="120" 
          cy="175" 
          rx="80" 
          ry="30" 
          fill="url(#floorGlow)" 
          className="floor-glow" 
        />

        {/* 2. Floating 3D Pallet Group */}
        <g className="pallet-container">
          {/* A. Bottom Runners (Three supports running back-left to front-right) */}
          {/* Left Runner */}
          <path d="M 45 130 L 95 155 L 95 163 L 45 138 Z" fill="#1C1E20" stroke="#2B2E32" strokeWidth="0.5" />
          <path d="M 95 155 L 195 105 L 195 113 L 95 163 Z" fill="#24272B" stroke="#2B2E32" strokeWidth="0.5" />
          
          {/* Middle Runner */}
          <path d="M 75 115 L 125 140 L 125 148 L 75 123 Z" fill="#1C1E20" />
          <path d="M 125 140 L 225 90 L 225 98 L 125 148 Z" fill="#24272B" />

          {/* B. Spacer Blocks (representing wooden blocks on the pallet) */}
          {/* Left blocks */}
          <path d="M 45 130 L 55 135 L 55 141 L 45 136 Z" fill="#1C1E20" />
          <path d="M 55 135 L 75 125 L 75 131 L 55 141 Z" fill="#2D3035" />
          
          <path d="M 90 152 L 100 157 L 100 163 L 90 158 Z" fill="#1C1E20" />
          <path d="M 100 157 L 120 147 L 120 153 L 100 163 Z" fill="#2D3035" />

          {/* Right blocks */}
          <path d="M 140 128 L 150 133 L 150 139 L 140 134 Z" fill="#1C1E20" />
          <path d="M 150 133 L 170 123 L 170 129 L 150 139 Z" fill="#2D3035" />

          <path d="M 185 106 L 195 111 L 195 117 L 185 112 Z" fill="#1C1E20" />
          <path d="M 195 111 L 215 101 L 215 107 L 195 117 Z" fill="#2D3035" />

          {/* C. Top Deck Boards (running parallel, crosswise) */}
          {/* Slat 1 (Back-left) */}
          <path d="M 40 125 L 140 75 L 150 80 L 50 130 Z" fill="url(#boardGrad)" stroke="#111" strokeWidth="0.5" />
          <path d="M 40 125 L 50 130 L 50 133 L 40 128 Z" fill="#1C1D1F" />
          <path d="M 50 130 L 150 80 L 150 83 L 50 133 Z" fill="#252729" />
          
          {/* Slat 2 */}
          <path d="M 55 132.5 L 155 82.5 L 165 87.5 L 65 137.5 Z" fill="url(#boardGrad)" stroke="#111" strokeWidth="0.5" />
          <path d="M 55 132.5 L 65 137.5 L 65 140.5 L 55 135.5 Z" fill="#1C1D1F" />
          <path d="M 65 137.5 L 165 87.5 L 165 90.5 L 65 140.5 Z" fill="#252729" />

          {/* Slat 3 (Middle slat with IoT chemical monitoring block attached) */}
          <path d="M 70 140 L 170 90 L 180 95 L 80 145 Z" fill="url(#boardGrad)" stroke="#111" strokeWidth="0.5" />
          <path d="M 70 140 L 80 145 L 80 148 L 70 143 Z" fill="#1C1D1F" />
          <path d="M 80 145 L 180 95 L 180 98 L 80 148 Z" fill="#252729" />

          {/* IoT Sensor Box (glowing lab sensor attached to the center slat) */}
          <g transform="translate(125, 115)">
            {/* Base Box (Isometric) */}
            {/* Top face */}
            <path d="M 0 -12 L 15 -4 L 0 4 L -15 -4 Z" fill="#16181D" stroke="#3A3F47" strokeWidth="1" />
            {/* Left face */}
            <path d="M -15 -4 L 0 4 L 0 14 L -15 6 Z" fill="#20232A" stroke="#3A3F47" strokeWidth="0.5" />
            {/* Right face */}
            <path d="M 0 4 L 15 -4 L 15 6 L 0 14 Z" fill="#2C313C" stroke="#3A3F47" strokeWidth="0.5" />
            
            {/* Laser grid/circuit lines on top of sensor */}
            <path d="M -10 -6 L 0 -1 L 10 -6 M -5 -8 L 5 -3" fill="none" stroke={ledColor} strokeWidth="1" opacity="0.65" />

            {/* Glowing LED */}
            <circle cx="0" cy="-3" r="4.5" fill={ledColor} className="sensor-led" />
            <circle cx="0" cy="-3" r="1.5" fill="#FFFFFF" />

            {/* Status symbol floating/glowing text for alerts */}
            {status === "warn" && (
              <g transform="translate(0, -26)">
                <circle cx="0" cy="0" r="11" fill="url(#alertGlow)" className="floor-glow" />
                <path d="M 0 -4 L 0 1 M 0 4 L 0 4.5" stroke="#E2001A" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            )}
          </g>

          {/* Slat 4 */}
          <path d="M 85 147.5 L 185 97.5 L 195 102.5 L 95 152.5 Z" fill="url(#boardGrad)" stroke="#111" strokeWidth="0.5" />
          <path d="M 85 147.5 L 95 152.5 L 95 155.5 L 85 150.5 Z" fill="#1C1D1F" />
          <path d="M 95 152.5 L 195 102.5 L 195 105.5 L 95 155.5 Z" fill="#252729" />

          {/* Slat 5 (Front-right) */}
          <path d="M 100 155 L 200 105 L 210 110 L 110 160 Z" fill="url(#boardGrad)" stroke="#111" strokeWidth="0.5" />
          <path d="M 100 155 L 110 160 L 110 163 L 100 158 Z" fill="#1C1D1F" />
          <path d="M 110 160 L 210 110 L 210 113 L 110 163 Z" fill="#252729" />
        </g>

        {/* 3. Scanning Laser Sweep (renders when scanning) */}
        {showLaser && (
          <g>
            {/* The laser plane/line slicing the pallet */}
            <path 
              d="M 25 130 L 130 75 L 215 118 L 110 173 Z" 
              fill="rgba(226,0,26,0.06)" 
              stroke="url(#laserGrad)" 
              strokeWidth="2.5" 
              className="laser-beam" 
              style={{ filter: "drop-shadow(0 0 5px #E2001A)" }}
            />
            {/* Custom gradient for laser line */}
            <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2001A" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#E2001A" stopOpacity="1" />
              <stop offset="100%" stopColor="#E2001A" stopOpacity="0.2" />
            </linearGradient>
            
            {/* Scanning HUD/grid overlay */}
            <path d="M 40 70 L 200 70" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M 40 180 L 200 180" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
          </g>
        )}

        {/* 4. Wireless Data Waves pulsing out (status ok/warn) */}
        <g opacity="0.8">
          <path d="M 125 105 A 25 25 0 0 1 155 125" fill="none" stroke={ledColor} strokeWidth="1.5" strokeLinecap="round" className="data-stream" />
          <path d="M 125 105 A 40 40 0 0 1 175 135" fill="none" stroke={ledColor} strokeWidth="1.2" strokeLinecap="round" className="data-stream" style={{ animationDelay: "0.5s" }} />
          <path d="M 125 105 A 55 55 0 0 1 195 145" fill="none" stroke={ledColor} strokeWidth="0.8" strokeLinecap="round" className="data-stream" style={{ animationDelay: "1s" }} />
        </g>

        {/* 5. Success Checkmark Overlay (renders when confirmed/added) */}
        {showCheck && (
          <g className="success-checkmark" transform="translate(125, 90)">
            {/* Floating green confirmation plaque */}
            <rect x="-24" y="-24" width="48" height="48" rx="24" fill="#E4F6EA" stroke="#1A7A3C" strokeWidth="2.5" style={{ filter: "drop-shadow(0 4px 10px rgba(26,122,60,0.3))" }} />
            <path d="M -9 0 L -2 7 L 11 -7" fill="none" stroke="#1A7A3C" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Burst particle lines */}
            {[-45, 0, 45, 135, 180, 225].map((angle, idx) => {
              const rad = (angle * Math.PI) / 180;
              const x1 = Math.cos(rad) * 28;
              const y1 = Math.sin(rad) * 28;
              const x2 = Math.cos(rad) * 36;
              const y2 = Math.sin(rad) * 36;
              return (
                <line 
                  key={idx} 
                  x1={x1} 
                  y1={y1} 
                  x2={x2} 
                  y2={y2} 
                  stroke="#1A7A3C" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  opacity="0.7" 
                />
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
