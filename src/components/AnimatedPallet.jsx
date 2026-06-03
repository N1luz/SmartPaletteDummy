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

  // Isometric Projection Math
  // Origin offset in viewbox
  const ox = 35;
  const oy = 135;

  // Projection vectors
  // a: length-direction (slats) -> up-right (1.9, -0.95)
  // b: width-direction (runners) -> down-right (1.25, 0.625)
  // c: height-direction -> straight up (0, -1)
  const getPt = (a, b, c) => {
    const x = ox + a * 1.9 + b * 1.25;
    const y = oy - a * 0.95 + b * 0.625 - c * 1.0;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  // Helper component to render a 3D isometric block
  // Top face is at c2, Bottom at c1. Left face at a1. Right face at b2.
  const IsoBlock = ({ a1, a2, b1, b2, c1, c2, fillTop, fillLeft, fillRight, stroke = "#1E2023", className = "" }) => {
    const topPath = `M ${getPt(a1, b1, c2)} L ${getPt(a2, b1, c2)} L ${getPt(a2, b2, c2)} L ${getPt(a1, b2, c2)} Z`;
    const leftPath = `M ${getPt(a1, b1, c1)} L ${getPt(a1, b2, c1)} L ${getPt(a1, b2, c2)} L ${getPt(a1, b1, c2)} Z`;
    const rightPath = `M ${getPt(a1, b2, c1)} L ${getPt(a2, b2, c1)} L ${getPt(a2, b2, c2)} L ${getPt(a1, b2, c2)} Z`;
    
    return (
      <g className={className}>
        {/* Front-left face */}
        <path d={leftPath} fill={fillLeft} stroke={stroke} strokeWidth="0.4" strokeLinejoin="round" />
        {/* Front-right face */}
        <path d={rightPath} fill={fillRight} stroke={stroke} strokeWidth="0.4" strokeLinejoin="round" />
        {/* Top face */}
        <path d={topPath} fill={fillTop} stroke={stroke} strokeWidth="0.4" strokeLinejoin="round" />
      </g>
    );
  };

  // Modern tech-wood styling palette
  const woodTop = "url(#woodGradTop)";
  const woodLeft = "#2E3136";
  const woodRight = "#3E4249";
  const woodStroke = "#161719";

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
          0% { transform: translateY(0px) rotateX(8deg); }
          50% { transform: translateY(-7px) rotateX(8deg); }
          100% { transform: translateY(0px) rotateX(8deg); }
        }
        @keyframes glowPulse {
          0% { transform: scale(0.96); opacity: 0.35; }
          50% { transform: scale(1.04); opacity: 0.7; }
          100% { transform: scale(0.96); opacity: 0.35; }
        }
        @keyframes ledBlink {
          0%, 100% { opacity: 1; filter: drop-shadow(0 0 6px ${ledColor}); }
          50% { opacity: 0.3; filter: drop-shadow(0 0 1px ${ledColor}); }
        }
        @keyframes laserSweep {
          0% { transform: translateY(-30px) scaleX(0.85); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(50px) scaleX(1.1); opacity: 0; }
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
            <stop offset="60%" stopColor={glowColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          
          {/* Shaded wood gradients */}
          <linearGradient id="woodGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#545A62" />
            <stop offset="50%" stopColor="#4A4F55" />
            <stop offset="100%" stopColor="#3C4046" />
          </linearGradient>

          <radialGradient id="alertGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={ledColor} stopOpacity="0.6" />
            <stop offset="100%" stopColor={ledColor} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Ground Glow */}
        <ellipse 
          cx="120" 
          cy="165" 
          rx="82" 
          ry="30" 
          fill="url(#floorGlow)" 
          className="floor-glow" 
        />

        {/* 2. Dynamic 3D Pallet Group (drawn Back-to-Front) */}
        <g className="pallet-container">
          
          {/* LEVEL 1: Bottom boards (running lengthwise) */}
          <IsoBlock a1={0} a2={60} b1={0} b2={8} c1={0} c2={3} fillTop={woodTop} fillLeft={woodLeft} fillRight={woodRight} stroke={woodStroke} />
          <IsoBlock a1={0} a2={60} b1={24} b2={32} c1={0} c2={3} fillTop={woodTop} fillLeft={woodLeft} fillRight={woodRight} stroke={woodStroke} />
          <IsoBlock a1={0} a2={60} b1={48} b2={56} c1={0} c2={3} fillTop={woodTop} fillLeft={woodLeft} fillRight={woodRight} stroke={woodStroke} />

          {/* LEVEL 2: 9 spacer support blocks (ordered back-to-front, row-by-row) */}
          {/* Row 1 (b = 0..8, back-left row) */}
          <IsoBlock a1={54} a2={60} b1={0} b2={8} c1={3} c2={11} fillTop="#2C2F34" fillLeft="#1A1C1F" fillRight="#24262A" stroke={woodStroke} />
          <IsoBlock a1={27} a2={33} b1={0} b2={8} c1={3} c2={11} fillTop="#2C2F34" fillLeft="#1A1C1F" fillRight="#24262A" stroke={woodStroke} />
          <IsoBlock a1={0} a2={6} b1={0} b2={8} c1={3} c2={11} fillTop="#2C2F34" fillLeft="#1A1C1F" fillRight="#24262A" stroke={woodStroke} />

          {/* Row 2 (b = 24..32, middle row) */}
          <IsoBlock a1={54} a2={60} b1={24} b2={32} c1={3} c2={11} fillTop="#2C2F34" fillLeft="#1A1C1F" fillRight="#24262A" stroke={woodStroke} />
          <IsoBlock a1={27} a2={33} b1={24} b2={32} c1={3} c2={11} fillTop="#2C2F34" fillLeft="#1A1C1F" fillRight="#24262A" stroke={woodStroke} />
          <IsoBlock a1={0} a2={6} b1={24} b2={32} c1={3} c2={11} fillTop="#2C2F34" fillLeft="#1A1C1F" fillRight="#24262A" stroke={woodStroke} />

          {/* Row 3 (b = 48..56, front-right row) */}
          <IsoBlock a1={54} a2={60} b1={48} b2={56} c1={3} c2={11} fillTop="#2C2F34" fillLeft="#1A1C1F" fillRight="#24262A" stroke={woodStroke} />
          <IsoBlock a1={27} a2={33} b1={48} b2={56} c1={3} c2={11} fillTop="#2C2F34" fillLeft="#1A1C1F" fillRight="#24262A" stroke={woodStroke} />
          <IsoBlock a1={0} a2={6} b1={48} b2={56} c1={3} c2={11} fillTop="#2C2F34" fillLeft="#1A1C1F" fillRight="#24262A" stroke={woodStroke} />

          {/* LEVEL 3: 3 cross-runners (running perpendicular to slats) */}
          <IsoBlock a1={54} a2={60} b1={0} b2={56} c1={11} c2={15} fillTop={woodTop} fillLeft={woodLeft} fillRight={woodRight} stroke={woodStroke} />
          <IsoBlock a1={27} a2={33} b1={0} b2={56} c1={11} c2={15} fillTop={woodTop} fillLeft={woodLeft} fillRight={woodRight} stroke={woodStroke} />
          <IsoBlock a1={0} a2={6} b1={0} b2={56} c1={11} c2={15} fillTop={woodTop} fillLeft={woodLeft} fillRight={woodRight} stroke={woodStroke} />

          {/* LEVEL 4: Top Deck boards (5 parallel slats, running back-to-front) */}
          <IsoBlock a1={0} a2={60} b1={0} b2={8} c1={15} c2={19} fillTop={woodTop} fillLeft={woodLeft} fillRight={woodRight} stroke={woodStroke} />
          <IsoBlock a1={0} a2={60} b1={12} b2={20} c1={15} c2={19} fillTop={woodTop} fillLeft={woodLeft} fillRight={woodRight} stroke={woodStroke} />
          <IsoBlock a1={0} a2={60} b1={24} b2={32} c1={15} c2={19} fillTop={woodTop} fillLeft={woodLeft} fillRight={woodRight} stroke={woodStroke} />
          <IsoBlock a1={0} a2={60} b1={36} b2={44} c1={15} c2={19} fillTop={woodTop} fillLeft={woodLeft} fillRight={woodRight} stroke={woodStroke} />
          <IsoBlock a1={0} a2={60} b1={48} b2={56} c1={15} c2={19} fillTop={woodTop} fillLeft={woodLeft} fillRight={woodRight} stroke={woodStroke} />

          {/* LEVEL 5: IoT Sensor Box (resting centrally on top of slat 3) */}
          <IsoBlock a1={26} a2={34} b1={25} b2={31} c1={19} c2={25} fillTop="#1E222B" fillLeft="#121419" fillRight="#1B1E26" stroke="#2D323F" />

          {/* Glowing Status components centered on the IoT Box */}
          <g transform={`translate(0, 0)`}>
            {/* The SVG coordinates for center of IoT Box (a=30, b=28, c=25) */}
            {(() => {
              const pt = getPt(30, 28, 25).split(",");
              const cx = parseFloat(pt[0]);
              const cy = parseFloat(pt[1]);
              return (
                <g>
                  {/* Glowing sensor circuit lines on top */}
                  <line x1={cx - 6} y1={cy + 1.5} x2={cx} y2={cy + 4.5} stroke={ledColor} strokeWidth="0.8" opacity="0.75" />
                  <line x1={cx} y1={cy + 4.5} x2={cx + 6} y2={cy + 1.5} stroke={ledColor} strokeWidth="0.8" opacity="0.75" />

                  {/* Pulsing Status LED */}
                  <circle cx={cx} cy={cy + 2.5} r="3.2" fill={ledColor} className="sensor-led" />
                  <circle cx={cx} cy={cy + 2.5} r="1.0" fill="#FFFFFF" />

                  {/* Critical warning sign floating above */}
                  {status === "warn" && (
                    <g transform={`translate(${cx}, ${cy - 16})`}>
                      <circle cx="0" cy="0" r="10" fill="url(#alertGlow)" className="floor-glow" />
                      {/* Red triangle exclamation */}
                      <path d="M 0 -7 L 7 5 L -7 5 Z" fill="#E2001A" stroke="#FFFFFF" strokeWidth="0.7" />
                      <rect x="-0.8" y="-2" width="1.6" height="3.5" fill="#FFFFFF" rx="0.5" />
                      <circle cx="0" cy="3" r="0.9" fill="#FFFFFF" />
                    </g>
                  )}
                </g>
              );
            })()}
          </g>
        </g>

        {/* 3. Scanning Laser Sweep (renders when scanning) */}
        {showLaser && (
          <g>
            {/* The laser plane/line slicing the pallet */}
            <path 
              d="M 22 120 L 132 65 L 218 108 L 108 163 Z" 
              fill="rgba(226,0,26,0.05)" 
              stroke="url(#laserGrad)" 
              strokeWidth="2.0" 
              className="laser-beam" 
              style={{ filter: "drop-shadow(0 0 5px #E2001A)" }}
            />
            {/* Custom gradient for laser line */}
            <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2001A" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#E2001A" stopOpacity="1" />
              <stop offset="100%" stopColor="#E2001A" stopOpacity="0.1" />
            </linearGradient>
          </g>
        )}

        {/* 4. Wireless Data Waves pulsing out (status ok/warn) */}
        <g opacity="0.8">
          {(() => {
            const pt = getPt(30, 28, 25).split(",");
            const cx = parseFloat(pt[0]);
            const cy = parseFloat(pt[1]);
            return (
              <g transform={`translate(${cx}, ${cy})`}>
                <path d="M -12 -12 A 18 12 0 0 1 12 -12" fill="none" stroke={ledColor} strokeWidth="1.2" strokeLinecap="round" className="data-stream" />
                <path d="M -22 -22 A 32 20 0 0 1 22 -22" fill="none" stroke={ledColor} strokeWidth="0.9" strokeLinecap="round" className="data-stream" style={{ animationDelay: "0.5s" }} />
              </g>
            );
          })()}
        </g>

        {/* 5. Success Checkmark Overlay (renders when confirmed/added) */}
        {showCheck && (
          <g className="success-checkmark" transform={`translate(120, 85)`}>
            {/* Floating green confirmation plaque */}
            <rect x="-22" y="-22" width="44" height="44" rx="22" fill="#E4F6EA" stroke="#1A7A3C" strokeWidth="2.2" style={{ filter: "drop-shadow(0 4px 10px rgba(26,122,60,0.3))" }} />
            <path d="M -8 0 L -2 6 L 10 -6" fill="none" stroke="#1A7A3C" strokeWidth="4.0" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Burst particle lines */}
            {[-45, 0, 45, 135, 180, 225].map((angle, idx) => {
              const rad = (angle * Math.PI) / 180;
              const x1 = Math.cos(rad) * 26;
              const y1 = Math.sin(rad) * 26;
              const x2 = Math.cos(rad) * 33;
              const y2 = Math.sin(rad) * 33;
              return (
                <line 
                  key={idx} 
                  x1={x1} 
                  y1={y1} 
                  x2={x2} 
                  y2={y2} 
                  stroke="#1A7A3C" 
                  strokeWidth="1.8" 
                  strokeLinecap="round"
                  opacity="0.75" 
                />
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
