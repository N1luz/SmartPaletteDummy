import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, ArrowRight, ShieldAlert, Award, FileText, Settings, 
  Layers, Zap, AlertCircle, Compass, Thermometer, Database,
  Check, CheckCircle2, Maximize2, Minimize2, List, Play, CheckSquare, BarChart2
} from "lucide-react";
import AnimatedPallet from "./AnimatedPallet";

const C = {
  red: "#E2001A",
  redDark: "#9E0F17",
  redDeep: "#6E0A12",
  ok: "#1A7A3C",
  okBg: "#E4F6EA",
  warnBg: "#FDE7E9",
  bg: "#F4F5F7",
  card: "#FFFFFF",
  ink: "#16181D",
  muted: "#7A8089",
  line: "#EAEBEE",
};

// Brand Logo component replicating Carl Roth
function RothBrandBadge({ style = {} }) {
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      background: C.red,
      color: "#FFFFFF",
      padding: "6px 14px",
      transform: "skewX(-10deg)",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: "relative",
      boxShadow: "0 4px 10px rgba(226,0,26,0.15)",
      userSelect: "none",
      ...style
    }}>
      <span style={{ 
        writingMode: "vertical-lr", 
        transform: "rotate(180deg)", 
        fontSize: "5px", 
        fontWeight: 800, 
        letterSpacing: 0.3,
        marginRight: 4,
        opacity: 0.95 
      }}>CARL</span>
      <span style={{ 
        fontSize: "16px", 
        fontWeight: 900, 
        letterSpacing: "-0.8px", 
        lineHeight: 1 
      }}>ROTH</span>
      <span style={{
        position: "absolute",
        top: 2,
        right: 3,
        fontSize: "5px",
        fontWeight: 800,
        border: "0.8px solid #fff",
        borderRadius: "50%",
        width: 6,
        height: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>R</span>
    </div>
  );
}

// Empathy Map Avatar SVG for warehouse worker
function WorkerAvatar({ size = 70 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ borderRadius: "50%", background: "#fff", border: `3px solid ${C.red}` }}>
      {/* Background circles */}
      <circle cx="50" cy="50" r="46" fill="#FDE7E9" />
      {/* Head */}
      <circle cx="50" cy="40" r="18" fill="#FCD3D1" />
      {/* Hair */}
      <path d="M32 38 C32 20, 68 20, 68 38 C68 22, 32 22, 32 38" fill="#3A1E1A" />
      <path d="M35 30 Q50 22 65 30" fill="#3A1E1A" />
      {/* Shirt */}
      <path d="M22 85 C22 65, 78 65, 78 85 Z" fill={C.red} />
      {/* Apron straps */}
      <path d="M35 70 L42 85 M65 70 L58 85" stroke="#16181D" strokeWidth="4" />
      {/* Apron */}
      <path d="M40 76 L60 76 L62 100 L38 100 Z" fill="#16181D" />
      {/* Logo on apron */}
      <rect x="47" y="82" width="6" height="6" fill={C.red} rx="1" />
      {/* Eyes */}
      <circle cx="44" cy="38" r="2" fill="#16181D" />
      <circle cx="56" cy="38" r="2" fill="#16181D" />
      {/* Smile */}
      <path d="M46 48 Q50 52 54 48" stroke="#16181D" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function Presentation() {
  const [slide, setSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState("deck"); // "deck" or "list"
  const containerRef = useRef(null);

  const totalSlides = 11;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (viewMode !== "deck") return;
      if (e.key === "ArrowRight" || e.key === "Space") {
        e.preventDefault();
        setSlide(s => Math.min(s + 1, totalSlides - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSlide(s => Math.max(s - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Renders the left sidebar style of Carl Roth slides
  const renderSlideFrame = (slideIndex, children) => {
    return (
      <div style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#FFFFFF",
        color: C.ink,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        display: "flex",
        overflow: "hidden",
        boxSizing: "border-box"
      }}>
        {/* Signalrot Left Vertical Sidebar */}
        <div style={{
          width: 24,
          height: "100%",
          background: C.red,
          flexShrink: 0
        }} />

        {/* Slide Content Area */}
        <div style={{
          flex: 1,
          padding: "40px 50px 30px 40px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          boxSizing: "border-box",
          overflow: "hidden"
        }}>
          {/* Top Brand Logo - omitted on slide 1 (which has large logo) */}
          {slideIndex !== 0 && (
            <div style={{ position: "absolute", top: 20, right: 30, zIndex: 100 }}>
              <RothBrandBadge />
            </div>
          )}

          {/* Slide Main Body */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
            {children}
          </div>

          {/* Slide Footer */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "11px",
            color: C.muted,
            borderTop: `1px solid ${C.line}`,
            paddingTop: "12px",
            marginTop: "16px",
            flexShrink: 0
          }}>
            <div>Carl Roth GmbH + Co. KG · smartPallet</div>
            <div>Kurs WHD24B4 · Folie {slideIndex + 1} von {totalSlides}</div>
          </div>
        </div>
      </div>
    );
  };

  // 11 high fidelity slides matching PDF content 1:1
  const renderSlideContent = (index) => {
    switch (index) {
      case 0: // Slide 1: Cover
        return (
          <div style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: "20px",
            position: "relative"
          }}>
            <div style={{
              width: "60px",
              height: "4px",
              background: C.red,
              marginBottom: "24px"
            }} />
            <h1 style={{
              fontSize: "36px",
              fontWeight: 800,
              color: C.ink,
              margin: "0 0 16px 0",
              lineHeight: 1.15
            }}>
              Effizienzsteigerungen<br />durch Digitalisierung
            </h1>
            <p style={{
              fontSize: "18px",
              fontWeight: 600,
              color: C.muted,
              margin: "0 0 40px 0",
              maxWidth: "600px",
              lineHeight: 1.4
            }}>
              Entwicklung eines Konzepts zur Einführung smarter Paletten bei der Carl Roth GmbH + Co. KG
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "130px 1fr",
              rowGap: "10px",
              fontSize: "13.5px",
              borderTop: `1px solid ${C.line}`,
              paddingTop: "24px",
              maxWidth: "500px"
            }}>
              <div style={{ fontWeight: 700, color: C.ink }}>Kursbezeichnung:</div>
              <div style={{ color: C.ink, fontFamily: "'DM Mono', monospace" }}>WHD24B4</div>
              <div style={{ fontWeight: 700, color: C.ink }}>Gruppenmitglieder:</div>
              <div style={{ color: C.ink, lineHeight: 1.5 }}>
                Elisabeth Auer, Silas Externest, Nils Flaschel, Jona Kammer, Chanel Wellalage Don de Silva
              </div>
            </div>

            {/* Large Cover ROTH Badge */}
            <div style={{ position: "absolute", right: "20px", bottom: "40px" }}>
              <RothBrandBadge style={{ padding: "12px 28px" }} />
            </div>
          </div>
        );

      case 1: // Slide 2: Ausgangssituation
        return (
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: C.red, margin: "0 0 6px 0" }}>Ausgangssituation</h2>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: C.ink, margin: "0 0 24px 0" }}>Wer ist die Carl Roth GmbH + Co. KG?</h3>
            <div style={{ width: "100%", height: "1px", background: C.red, opacity: 0.3, marginBottom: "30px" }} />
            
            <ul style={{
              listStyleType: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "18px"
            }}>
              {[
                "Chemie- und Laborfachhändler aus Karlsruhe",
                "Familienunternehmen mit über 145 Jahren Erfahrung",
                "Internationale Geschäftstätigkeit",
                "Kunden aus Forschung, Laboren und Industrie (B2B)",
                "Sortiment von Chemikalien und Laborausstattung",
                "Hohe Qualitäts- und Sicherheitsstandards"
              ].map((bullet, idx) => (
                <li key={idx} style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: C.ink
                }}>
                  <div style={{
                    width: "8px",
                    height: "8px",
                    background: C.red,
                    marginRight: "14px",
                    flexShrink: 0
                  }} />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        );

      case 2: // Slide 3: Problemstellung
        return (
          <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: C.red, margin: "0 0 6px 0" }}>Problemstellung</h2>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: C.ink, margin: "0 0 24px 0" }}>Lohnt sich die Einführung smarter Paletten bei Carl Roth?</h3>
            <div style={{ width: "100%", height: "1px", background: C.red, opacity: 0.3, marginBottom: "20px" }} />

            <div style={{ display: "flex", flex: 1, alignItems: "center", gap: "30px" }}>
              <div style={{ flex: 1.2 }}>
                <ul style={{
                  listStyleType: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px"
                }}>
                  {[
                    "Hohe Anzahl bewegter Paletten",
                    "Komplexer Liefer- und Lagerprozesse",
                    "Eingeschränkte Transparenz",
                    "Fehlende Echtzeitinformationen",
                    "Zusätzlicher Verwaltungsaufwand"
                  ].map((bullet, idx) => (
                    <li key={idx} style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: C.ink
                    }}>
                      <div style={{
                        width: "8px",
                        height: "8px",
                        background: C.red,
                        marginRight: "14px",
                        flexShrink: 0
                      }} />
                      {bullet}
                    </li>
                  ))}
                </ul>

                <div style={{
                  marginTop: "24px",
                  fontSize: "16px",
                  fontWeight: 800,
                  color: C.red,
                  fontStyle: "italic",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <span>➔</span> Smarte Palette als möglicher Lösungsansatz
                </div>
              </div>

              {/* Render Animated Pallet directly in slide */}
              <div style={{
                flex: 0.8,
                background: C.bg,
                border: `1px solid ${C.line}`,
                borderRadius: "16px",
                padding: "16px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                height: "190px"
              }}>
                <AnimatedPallet status="ok" size={170} />
              </div>
            </div>
          </div>
        );

      case 3: // Slide 4: Smarte Palette als Lösungsansatz
        return (
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: C.red, margin: "0 0 6px 0" }}>Smarte Palette als Lösungsansatz</h2>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: C.ink, margin: "0 0 24px 0" }}>Wie könnte eine smarte Palette bei Carl Roth aussehen?</h3>
            <div style={{ width: "100%", height: "1px", background: C.red, opacity: 0.3, marginBottom: "24px" }} />

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 50px 1.2fr",
              alignItems: "center",
              rowGap: "14px",
              columnGap: "10px"
            }}>
              {[
                { f: "GPS- Tracking", b: "Schnellere Lokalisierung von Palletten" },
                { f: "Temperaturüberwachung", b: "Sicherung der Produktqualität" },
                { f: "Stoß- und Vibrationssensor", b: "Früherkennung von Transportschäden" },
                { f: "Gewichtsmessung", b: "Automatische Vollständigkeitskontrolle" },
                { f: "Gefahrstofferkennung", b: "Höhere Prozess- und Arbeitssicherheit" },
                { f: "Echtzeitdaten", b: "Weniger manuelle Kontrollaufwände" }
              ].map((row, idx) => (
                <React.Fragment key={idx}>
                  <div style={{
                    fontSize: "14px",
                    fontWeight: 800,
                    color: C.ink,
                    padding: "8px 12px",
                    background: C.bg,
                    borderRadius: "6px"
                  }}>{row.f}</div>
                  
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ width: "30px", height: "4px", background: C.red }} />
                  </div>
                  
                  <div style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: C.ink,
                    padding: "8px 12px"
                  }}>{row.b}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        );

      case 4: // Slide 5: Identifikation von Optimierungspotenzialen Intro
        return (
          <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: C.red, margin: "0 0 6px 0" }}>Identifikation von Optimierungspotenzialen</h2>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: C.ink, margin: "0 0 24px 0" }}>Wo liegen die Pain Points und welche Lösungen haben Priorität?</h3>
            <div style={{ width: "100%", height: "1px", background: C.red, opacity: 0.3, marginBottom: "30px" }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", flex: 1 }}>
              <div 
                onClick={() => setSlide(5)}
                style={{
                  border: `2px solid ${C.line}`,
                  borderRadius: "16px",
                  padding: "20px",
                  background: C.bg,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: 800, color: C.red }}>Folie 6: Prozessdiagramm</h4>
                  <p style={{ margin: 0, fontSize: "13px", color: C.muted, lineHeight: 1.4 }}>
                    Detaillierte Swimlane-Analyse aller Prozessbeteiligten (Vom Lieferanten bis zum Kunden) und die Identifikation manueller Schnittstellen-Risiken.
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: C.red, marginTop: "12px" }}>
                  <span>Folie 6 ansehen</span> <ArrowRight size={14} />
                </div>
              </div>

              <div 
                onClick={() => setSlide(6)}
                style={{
                  border: `2px solid ${C.line}`,
                  borderRadius: "16px",
                  padding: "20px",
                  background: C.bg,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: 800, color: C.red }}>Folie 7: Priorisierungs-Matrix</h4>
                  <p style={{ margin: 0, fontSize: "13px", color: C.muted, lineHeight: 1.4 }}>
                    Impact-vs-Effort Matrix zur Bestimmung des idealen Pilotprojekts (Quick Win). Analyse von Aufwand und Nutzen.
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: C.red, marginTop: "12px" }}>
                  <span>Folie 7 ansehen</span> <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // Slide 6: Prozessdiagramm Swimlanes
        return (
          <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: C.red, margin: "0 0 12px 0" }}>Prozessdiagramm: Schwimmbahnen & Risiken</h2>
            
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "4.5px",
              overflowY: "auto",
              paddingRight: "6px",
              boxSizing: "border-box",
              fontSize: "10.5px"
            }}>
              {[
                { 
                  name: "Lieferant", 
                  bg: C.red, 
                  step: "Anlieferung/ Übergang Warenbegleitschein",
                  warn: "Manuelle Prüfung ➔ Zeitintensiv ➔ Fehleranfällig"
                },
                { 
                  name: "Wareneingang", 
                  bg: "#C50014", 
                  step: "Sichtprüfung der Ware ➔ Abgleich des Lieferscheins ➔ WWS erfassen" 
                },
                { 
                  name: "Gefahrgutprüfung", 
                  bg: "#A90010", 
                  step: "Kennzeichnung und Kontrolle ➔ Freigabe",
                  warn: "Manuelle Kontrolle ➔ Nicht automatisch ➔ Hoher Prüfaufwand"
                },
                { 
                  name: "Lager", 
                  bg: "#8D000C", 
                  step: "Einlagerung",
                  warn: "Lagerphase/Blackbox ➔ Kein GPS-Tracking ➔ Keine Temperaturüberwachung ➔ Keine Erfassungen von Stößen etc.,"
                },
                { 
                  name: "Kommissionierung", 
                  bg: "#710008", 
                  step: "Palette suchen ➔ Gewicht + Vollständigkeit prüfen",
                  warn: "Manuelle Kontrolle ➔ Nicht automatisch ➔ Hoher Prüfaufwand"
                },
                { 
                  name: "Versand", 
                  bg: "#550004", 
                  step: "Versand-etiketten + Verladung",
                  warn: "Nach Verlassen des Lagers ➔ Kein GPS-Tracking ➔ Keine Temperaturüberwachung ➔ Keine Erfassungen von Stößen etc.,"
                },
                { 
                  name: "WWS", 
                  bg: "#2A2B30", 
                  step: "Wareneingang buchen ➔ QS-Status ➔ Stellplatz buchen ➔ Kommissionierung buchen ➔ Versand buchen"
                },
                { 
                  name: "Kunde", 
                  bg: C.red, 
                  step: "Empfang + Manuelle Quittierung",
                  warn: "Manuelle Quittierung ➔ Keine automatische Empfangsbestätigung"
                }
              ].map((lane, idx) => (
                <div key={idx} style={{
                  display: "flex",
                  alignItems: "center",
                  border: `1px solid ${C.line}`,
                  borderRadius: "6px",
                  background: C.bg,
                  overflow: "hidden"
                }}>
                  {/* Left role tag */}
                  <div style={{
                    width: "110px",
                    background: lane.bg,
                    color: "#fff",
                    padding: "6px 10px",
                    fontWeight: 800,
                    flexShrink: 0
                  }}>{lane.name}</div>
                  
                  {/* Step */}
                  <div style={{
                    flex: 1,
                    padding: "6px 12px",
                    fontWeight: 700,
                    color: C.ink
                  }}>{lane.step}</div>

                  {/* Warning */}
                  {lane.warn && (
                    <div style={{
                      marginRight: "10px",
                      background: C.warnBg,
                      border: `1px solid ${C.red}`,
                      color: C.redDark,
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "9px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      maxWidth: "280px"
                    }}>
                      <ShieldAlert size={10} color={C.red} />
                      {lane.warn}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 6: // Slide 7: Priorisierungs-Matrix
        return (
          <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: C.red, margin: "0 0 16px 0" }}>Priorisierungs-Matrix: Impact vs. Effort</h2>
            
            <div style={{ display: "flex", flex: 1, gap: "10px", position: "relative" }}>
              {/* Vertical Impact Axis */}
              <div style={{
                width: "25px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                fontWeight: 800,
                fontSize: "10px",
                color: C.muted,
                padding: "20px 0"
              }}>
                <div>High</div>
                <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", letterSpacing: "1px", margin: "10px 0" }}>IMPACT</div>
                <div>Low</div>
              </div>

              {/* Matrix Layout */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", flex: 1, gap: "10px" }}>
                  {/* Top-Left: Quick Win */}
                  <div style={{
                    flex: 1,
                    background: C.warnBg,
                    border: `2px solid ${C.red}`,
                    borderRadius: "12px",
                    padding: "14px",
                    display: "flex",
                    flexDirection: "column"
                  }}>
                    <div style={{
                      background: C.red,
                      color: "#fff",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "9px",
                      fontWeight: 800,
                      alignSelf: "flex-start",
                      marginBottom: "10px"
                    }}>QUICK WIN</div>
                    <h4 style={{ fontSize: "14px", fontWeight: 800, margin: "0 0 6px 0", color: C.redDeep }}>Temperaturüberwachung</h4>
                    <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11px", fontWeight: 600, color: C.ink, lineHeight: 1.4 }}>
                      <li>Temperaturüberwachung (Echtzeit)</li>
                      <li>Stoß- und Vibrationssensor</li>
                      <li>Echtzeitdaten</li>
                    </ul>
                  </div>

                  {/* Top-Right: Major Projects */}
                  <div style={{
                    flex: 1,
                    background: "#FFFFFF",
                    border: `1px solid ${C.line}`,
                    borderRadius: "12px",
                    padding: "14px",
                    display: "flex",
                    flexDirection: "column"
                  }}>
                    <div style={{
                      background: C.ink,
                      color: "#fff",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "9px",
                      fontWeight: 800,
                      alignSelf: "flex-start",
                      marginBottom: "10px"
                    }}>MAJOR PROJECTS</div>
                    <h4 style={{ fontSize: "14px", fontWeight: 800, margin: "0 0 6px 0", color: C.ink }}>Komplexe Lösungen</h4>
                    <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11px", fontWeight: 600, color: C.muted, lineHeight: 1.4 }}>
                      <li>GPS-Tracking</li>
                      <li>Gefahrstofferkennung</li>
                    </ul>
                  </div>
                </div>

                <div style={{ display: "flex", flex: 1, gap: "10px" }}>
                  {/* Bottom-Left: Low-hanging fruit */}
                  <div style={{
                    flex: 1,
                    background: "#FFFFFF",
                    border: `1px solid ${C.line}`,
                    borderRadius: "12px",
                    padding: "14px",
                    display: "flex",
                    flexDirection: "column"
                  }}>
                    <div style={{
                      background: C.muted,
                      color: "#fff",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "9px",
                      fontWeight: 800,
                      alignSelf: "flex-start",
                      marginBottom: "10px"
                    }}>LOW-HANGING FRUIT</div>
                    <h4 style={{ fontSize: "14px", fontWeight: 800, margin: "0 0 6px 0", color: C.ink }}>Gewichtsmessung</h4>
                    <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11px", fontWeight: 600, color: C.muted, lineHeight: 1.4 }}>
                      <li>Automatisierte Gewichtsmessung</li>
                    </ul>
                  </div>

                  {/* Bottom-Right: Hygiene */}
                  <div style={{
                    flex: 1,
                    background: C.bg,
                    border: `1px dashed ${C.line}`,
                    borderRadius: "12px",
                    padding: "14px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                  }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: C.muted }}>HYGIENE</div>
                    <div style={{ fontSize: "10px", color: C.muted, marginTop: "4px" }}>(Keine Prioritäten definiert)</div>
                  </div>
                </div>

                {/* Horizontal Effort Axis */}
                <div style={{
                  height: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontWeight: 800,
                  fontSize: "10px",
                  color: C.muted,
                  padding: "0 40px"
                }}>
                  <div>High</div>
                  <div style={{ letterSpacing: "1px" }}>EFFORT</div>
                  <div>Low</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 7: // Slide 8: Auswahl des Quick Wins
        return (
          <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: C.red, margin: "0 0 6px 0" }}>Auswahl des Quick Wins</h2>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: C.ink, margin: "0 0 24px 0" }}>Warum wurde die Temperaturüberwachung priorisiert?</h3>
            <div style={{ width: "100%", height: "1px", background: C.red, opacity: 0.3, marginBottom: "20px" }} />

            <div style={{ display: "flex", flex: 1, gap: "30px", alignItems: "center" }}>
              <div style={{ flex: 1.2 }}>
                <ul style={{
                  listStyleType: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px"
                }}>
                  {[
                    "Hoher Nutzen",
                    "Geringer Implementierungsaufwand",
                    "Direkter Beitrag zur Produktqualität",
                    "Vermeidung von Qualitätsverlusten",
                    "Einfache Integration in bestehende Prozesse"
                  ].map((bullet, idx) => (
                    <li key={idx} style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: C.ink
                    }}>
                      <div style={{
                        width: "8px",
                        height: "8px",
                        background: C.red,
                        marginRight: "14px",
                        flexShrink: 0
                      }} />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Simplified App Live Demo in presentation */}
              <div style={{
                flex: 0.8,
                background: "#0E1013",
                borderRadius: "20px",
                padding: "10px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                display: "flex",
                flexDirection: "column",
                height: "210px",
                color: "#FFFFFF",
                fontSize: "10px",
                fontFamily: "system-ui"
              }}>
                {/* Simulated Phone Top Bar */}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 8px 6px 8px", borderBottom: "0.5px solid rgba(255,255,255,0.1)" }}>
                  <span>9:41</span>
                  <span>smartPallet App</span>
                </div>
                
                {/* Simulated Header Card */}
                <div style={{ background: C.red, padding: "8px", borderRadius: "8px", margin: "8px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "7px", opacity: 0.8 }}>Aktive Paletten</div>
                    <div style={{ fontSize: "14px", fontWeight: 800 }}>4 Paletten</div>
                  </div>
                  <div style={{ background: "#FFFFFF", color: C.red, padding: "2px 6px", borderRadius: "4px", fontWeight: 800, fontSize: "9px" }}>
                    1 Warnung
                  </div>
                </div>

                {/* Simulated Telemetry list item */}
                <div style={{ background: "rgba(255,255,255,0.05)", padding: "6px 8px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `3px solid ${C.red}` }}>
                  <div>
                    <div style={{ fontWeight: "bold" }}>Diethylether</div>
                    <div style={{ fontSize: "7px", opacity: 0.6 }}>PAL-10451 · WE</div>
                  </div>
                  <div style={{ color: C.red, fontWeight: 800, fontSize: "12px" }}>11.4 °C</div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.05)", padding: "6px 8px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `3px solid ${C.ok}`, marginTop: "4px" }}>
                  <div>
                    <div style={{ fontWeight: "bold" }}>Aceton 99.5 %</div>
                    <div style={{ fontSize: "7px", opacity: 0.6 }}>PAL-10428 · Lager B</div>
                  </div>
                  <div style={{ color: C.ok, fontWeight: 800, fontSize: "12px" }}>4.2 °C</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 8: // Slide 9: Lösungskonzept: Temperaturüberwachung
        return (
          <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: C.red, margin: "0 0 6px 0" }}>Lösungskonzept: Temperaturüberwachung</h2>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: C.ink, margin: "0 0 24px 0" }}>Wie funktioniert die Lösung im Prozess?</h3>
            <div style={{ width: "100%", height: "1px", background: C.red, opacity: 0.3, marginBottom: "30px" }} />

            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flex: 1,
              gap: "8px"
            }}>
              {[
                { step: "1", title: "Smarte Palette", desc: "Temperatursensor misst permanent", icon: <Thermometer size={22} color={C.red} /> },
                { step: "2", title: "Übertragung", desc: "Narrowband-IoT Modul funkt Daten", icon: <Database size={22} color={C.red} /> },
                { step: "3", title: "WWS / Dashboard", desc: "Zentrale validiert Werte", icon: <Layers size={22} color={C.red} /> },
                { step: "4", title: "Warnmeldung", desc: "Grenzwertverletzung löst Ticket aus", icon: <ShieldAlert size={22} color={C.red} /> },
                { step: "5", title: "Reaktion", desc: "Mitarbeiter greift korrigierend ein", icon: <CheckSquare size={22} color={C.red} /> }
              ].map((step, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <ArrowRight size={16} color={C.red} style={{ opacity: 0.7 }} />
                    </div>
                  )}

                  <div style={{
                    flex: 1,
                    background: "#FFFFFF",
                    border: `1.5px solid ${C.line}`,
                    borderRadius: "12px",
                    padding: "16px 12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    height: "170px",
                    justifyContent: "space-between",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                    position: "relative"
                  }}>
                    {/* Circle step number */}
                    <div style={{
                      position: "absolute",
                      top: "-12px",
                      background: C.red,
                      color: "#FFFFFF",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 800,
                      boxShadow: "0 2px 6px rgba(226,0,26,0.2)"
                    }}>{step.step}</div>

                    <div style={{ marginTop: "10px" }}>{step.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: "12px", color: C.ink }}>{step.title}</div>
                    <div style={{ fontSize: "10px", color: C.muted, lineHeight: 1.3 }}>{step.desc}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        );

      case 9: // Slide 10: Mitarbeiterperspektive Intro
        return (
          <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: C.red, margin: "0 0 6px 0" }}>Mitarbeiterperspektive</h2>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: C.ink, margin: "0 0 24px 0" }}>Wie kann die Akzeptanz gefördert werden?</h3>
            <div style={{ width: "100%", height: "1px", background: C.red, opacity: 0.3, marginBottom: "30px" }} />

            <div style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "40px"
            }}>
              <div style={{ flex: 1.2 }}>
                <p style={{ fontSize: "15px", color: C.ink, fontWeight: 500, lineHeight: 1.6, margin: "0 0 20px 0" }}>
                  Die Einführung smarter Logistiklösungen gelingt nur, wenn die Mitarbeiter im Lager von Anfang an eingebunden und entlastet werden.
                </p>
                <p style={{ fontSize: "14px", color: C.muted, lineHeight: 1.5, margin: "0 0 24px 0" }}>
                  Dazu haben wir eine detaillierte Empathy Map erstellt. Sie bildet ab, was der typische Lagerarbeiter im Alltag sieht, hört, denkt, fühlt sowie sagt und tut – inklusive Pain Points und Gains.
                </p>
                <button 
                  onClick={() => setSlide(10)}
                  style={{
                    background: C.red,
                    color: "#FFFFFF",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    transition: "opacity 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
                >
                  Folie 11: Empathy Map öffnen <ArrowRight size={14} />
                </button>
              </div>

              {/* Mini Empathy Map graphic placeholder */}
              <div 
                onClick={() => setSlide(10)}
                style={{
                  flex: 0.8,
                  border: `2px dashed ${C.line}`,
                  borderRadius: "16px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  background: C.bg,
                  height: "200px"
                }}
              >
                <WorkerAvatar size={60} />
                <div style={{ fontWeight: 800, fontSize: "12px", marginTop: "12px", color: C.ink }}>Empathy Map</div>
                <div style={{ fontSize: "10px", color: C.muted, marginTop: "4px" }}>(Klicken zum Öffnen)</div>
              </div>
            </div>
          </div>
        );

      case 10: // Slide 11: Empathy Map detailed
        return (
          <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: C.red, margin: "0 0 10px 0" }}>Mitarbeiterperspektive: Empathy Map</h2>
            
            <div style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr 0.9fr",
              gap: "8px",
              position: "relative",
              fontSize: "9.5px",
              boxSizing: "border-box"
            }}>
              {/* Centered Avatar Overlay */}
              <div style={{
                position: "absolute",
                top: "33.33%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                pointerEvents: "none"
              }}>
                <WorkerAvatar size={46} />
                <div style={{
                  background: "#16181D",
                  color: "#FFFFFF",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: 800,
                  fontSize: "8px",
                  marginTop: "3px",
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                }}>
                  Lagerarbeiter bei Carl Roth
                </div>
              </div>

              {/* 1. SIEHT */}
              <div style={{
                background: C.bg,
                border: `1px solid ${C.line}`,
                borderRadius: "8px",
                padding: "8px 12px",
                display: "flex",
                flexDirection: "column"
              }}>
                <h4 style={{ margin: "0 0 4px 0", fontSize: "10.5px", fontWeight: 800, color: C.red }}>👀 SIEHT</h4>
                <ul style={{ margin: 0, paddingLeft: "12px", lineHeight: 1.35, color: C.ink }}>
                  <li>Viele Paletten und empfindliche Produkte</li>
                  <li>Manuelle Temperaturkontrollen</li>
                  <li>Qualitäts- und Sicherheitsvorgaben</li>
                  <li>Zeitdruck und hohe Arbeitsbelastung</li>
                  <li>Unterschiedliche Lagerbereiche und Prozesse</li>
                </ul>
              </div>

              {/* 2. HÖRT */}
              <div style={{
                background: C.bg,
                border: `1px solid ${C.line}`,
                borderRadius: "8px",
                padding: "8px 12px 8px 30px", // space for avatar
                display: "flex",
                flexDirection: "column"
              }}>
                <h4 style={{ margin: "0 0 4px 0", fontSize: "10.5px", fontWeight: 800, color: C.red }}>👂 HÖRT</h4>
                <ul style={{ margin: 0, paddingLeft: "12px", lineHeight: 1.35, color: C.ink }}>
                  <li>„Qualität und Sicherheit stehen an erster Stelle“</li>
                  <li>„Fehler müssen vermieden werden“</li>
                  <li>„Wir müssen effizienter werden“</li>
                  <li>Kollegen sind skeptisch gegenüber neuen Systemen</li>
                </ul>
              </div>

              {/* 3. DENKT & FÜHLT */}
              <div style={{
                background: C.bg,
                border: `1px solid ${C.line}`,
                borderRadius: "8px",
                padding: "8px 12px",
                display: "flex",
                flexDirection: "column"
              }}>
                <h4 style={{ margin: "0 0 4px 0", fontSize: "10.5px", fontWeight: 800, color: C.red }}>🧠 DENKT & FÜHLT</h4>
                <ul style={{ margin: 0, paddingLeft: "12px", lineHeight: 1.35, color: C.ink }}>
                  <li>„Noch ein neues System, das ich lernen muss?“</li>
                  <li>„Funktioniert das wirklich zuverlässig?“</li>
                  <li>„Ich möchte Fehler vermeiden und Produkte schützen“</li>
                  <li>„Wenn es mir Arbeit spart, ist es sinnvoll“</li>
                </ul>
              </div>

              {/* 4. SAGT & TUT */}
              <div style={{
                background: C.bg,
                border: `1px solid ${C.line}`,
                borderRadius: "8px",
                padding: "8px 12px 8px 30px", // space for avatar
                display: "flex",
                flexDirection: "column"
              }}>
                <h4 style={{ margin: "0 0 4px 0", fontSize: "10.5px", fontWeight: 800, color: C.red }}>🗣️ SAGT & TUT</h4>
                <ul style={{ margin: 0, paddingLeft: "12px", lineHeight: 1.35, color: C.ink }}>
                  <li>Führt manuelle Temperaturkontrollen durch</li>
                  <li>Dokumentiert Ergebnisse und Abweichungen</li>
                  <li>Meldet Probleme an Vorgesetzte</li>
                  <li>Arbeitet nach festen Prozessen und Anweisungen</li>
                </ul>
              </div>

              {/* Bottom: Pain Points (Span left column) */}
              <div style={{
                background: C.warnBg,
                border: `1.5px solid ${C.red}`,
                borderRadius: "8px",
                padding: "8px 12px"
              }}>
                <h4 style={{ margin: "0 0 4px 0", fontSize: "11px", fontWeight: 800, color: C.redDark, display: "flex", alignItems: "center", gap: "4px" }}>
                  <ShieldAlert size={11} /> PAIN POINTS (Schmerzpunkte)
                </h4>
                <ul style={{ margin: 0, paddingLeft: "12px", lineHeight: 1.3, color: C.ink }}>
                  <li>Hoher Aufwand durch manuelle Temperaturprüfungen</li>
                  <li>Zeitintensive Dokumentation und Kontrollen</li>
                  <li>Fehlende Transparenz bei Temperaturabweichungen</li>
                  <li>Risiko, Probleme zu spät zu erkennen</li>
                  <li>Angst vor zusätzlichen Aufgaben und Verantwortung</li>
                </ul>
              </div>

              {/* Bottom: Gains (Span right column) */}
              <div style={{
                background: C.okBg,
                border: `1.5px solid ${C.ok}`,
                borderRadius: "8px",
                padding: "8px 12px"
              }}>
                <h4 style={{ margin: "0 0 4px 0", fontSize: "11px", fontWeight: 800, color: C.ok, display: "flex", alignItems: "center", gap: "4px" }}>
                  <CheckCircle2 size={11} color={C.ok} /> GAINS (Gewinne/Vorteile)
                </h4>
                <ul style={{ margin: 0, paddingLeft: "12px", lineHeight: 1.3, color: C.ink }}>
                  <li>Automatische Überwachung und Warnmeldungen</li>
                  <li>Weniger manuelle Kontrollen und Dokumentation</li>
                  <li>Schnellere Reaktion bei Temperaturabweichungen</li>
                  <li>Höhere Sicherheit und Qualität der Produkte</li>
                  <li>Entlastung im Arbeitsalltag und mehr Transparenz</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{
        width: "100%",
        background: "#0B0B0D",
        borderRadius: isFullscreen ? 0 : "24px",
        padding: isFullscreen ? "40px" : "32px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        color: "#FFFFFF",
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      {/* Presentation Header Controls */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        paddingBottom: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <RothBrandBadge />
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 800, margin: 0 }}>Pitch-Deck Presentation</h2>
            <p style={{ fontSize: "11px", color: C.muted, margin: "2px 0 0 0" }}>Konzept zur Einführung smarter Paletten</p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* View Mode Toggle */}
          <div style={{
            display: "flex",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "8px",
            padding: "3px",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <button 
              onClick={() => setViewMode("deck")}
              style={{
                background: viewMode === "deck" ? C.red : "transparent",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <Play size={12} /> Präsentation
            </button>
            <button 
              onClick={() => setViewMode("list")}
              style={{
                background: viewMode === "list" ? C.red : "transparent",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <List size={12} /> Liste
            </button>
          </div>

          {/* Fullscreen Trigger */}
          <button 
            onClick={toggleFullscreen}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              borderRadius: "8px",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            title={isFullscreen ? "Vollbild beenden" : "Vollbildmodus"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Slide Container (deck mode is 16:9, list mode is stacked vertical) */}
      {viewMode === "deck" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Main 16:9 Deck Box */}
          <div style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            background: "#fff"
          }}>
            {renderSlideFrame(slide, renderSlideContent(slide))}
          </div>

          {/* Navigation Controls under the deck */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <button 
              onClick={() => setSlide(s => Math.max(s - 1, 0))}
              disabled={slide === 0}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                borderRadius: "8px",
                padding: "8px 16px",
                fontWeight: 700,
                fontSize: "13px",
                cursor: slide === 0 ? "not-allowed" : "pointer",
                opacity: slide === 0 ? 0.4 : 1,
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <ArrowLeft size={16} /> Zurück
            </button>

            {/* Slide Index circles */}
            <div style={{ display: "flex", gap: "6px", overflowX: "auto", padding: "4px" }}>
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: "none",
                    background: slide === i ? C.red : "rgba(255,255,255,0.1)",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s"
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setSlide(s => Math.min(s + 1, totalSlides - 1))}
              disabled={slide === totalSlides - 1}
              style={{
                background: C.red,
                border: "none",
                color: "#fff",
                borderRadius: "8px",
                padding: "8px 16px",
                fontWeight: 700,
                fontSize: "13px",
                cursor: slide === totalSlides - 1 ? "not-allowed" : "pointer",
                opacity: slide === totalSlides - 1 ? 0.4 : 1,
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              Weiter <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* Vertical List Mode displaying all slides stacked */
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          maxHeight: "800px",
          overflowY: "auto",
          paddingRight: "10px",
          boxSizing: "border-box"
        }}>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ fontSize: "13px", fontWeight: 800, color: C.muted }}>Folie {i + 1} von {totalSlides}</div>
              <div style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16/9",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                background: "#fff"
              }}>
                {renderSlideFrame(i, renderSlideContent(i))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
