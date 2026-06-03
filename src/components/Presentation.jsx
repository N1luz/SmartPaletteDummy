import React, { useEffect, useRef, useState } from "react";
import { 
  ArrowRight, ShieldAlert, Award, FileText, Settings, User, 
  Layers, Zap, AlertCircle, Compass, Thermometer, Database,
  Check, CheckCircle2
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

// Scroll Reveal Helper Component
function Reveal({ children, delay = 0, className = "" }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.15 });

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div 
      ref={ref} 
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : prefersReduced ? "none" : "translateY(16px)",
        transition: `opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms`
      }}
    >
      {children}
    </div>
  );
}

// Simple CountUp helper component
function CountUp({ end, suffix = "", duration = 1500 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered) {
        setTriggered(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.5 });

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;
    let start = 0;
    const endVal = parseInt(end, 10);
    if (isNaN(endVal)) {
      setCount(end);
      return;
    }
    const stepTime = Math.abs(Math.floor(duration / endVal));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= endVal) {
        clearInterval(timer);
        setCount(end);
      }
    }, Math.max(stepTime, 15));
    return () => clearInterval(timer);
  }, [triggered, end, duration]);

  return <span ref={ref} style={{ fontFamily: "'DM Mono', monospace" }}>{count}{suffix}</span>;
}

export default function Presentation() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("start");

  // Track scroll progress and active section
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }

      const sections = ["start", "background", "problems", "swimlane", "matrix", "quickwin", "adoption"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 3 && rect.bottom >= window.innerHeight / 3) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{
      width: "100%",
      background: "#FFFFFF",
      color: C.ink,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Red Scroll Progress Bar */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: `${scrollProgress}%`,
        height: 4,
        background: C.red,
        zIndex: 1000,
        transition: "width 0.1s linear"
      }} />

      {/* Styled Inline Styles for presentation custom CSS */}
      <style>{`
        .nav-item {
          color: ${C.muted};
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 999px;
          transition: all 0.2s cubic-bezier(.2,.8,.2,1);
          position: relative;
        }
        .nav-item.active {
          color: ${C.red};
          background: ${C.warnBg};
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 18px;
          padding: 24px;
          color: #fff;
          box-shadow: 0 8px 32px rgba(0,0,0,0.06);
          transition: transform 0.2s;
        }
        .glass-card:hover {
          transform: translateY(-4px);
        }
        .reveal-card {
          background: #FFFFFF;
          border: 1px solid ${C.line};
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 3px 12px rgba(20,10,15,.03);
          transition: all 0.25s cubic-bezier(.2,.8,.2,1);
          position: relative;
        }
        .reveal-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          border-radius: 18px 0 0 18px;
          background: transparent;
          transition: background 0.25s;
        }
        .reveal-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(20,10,15,.06);
        }
        .reveal-card.highlight-red::before {
          background: ${C.red};
        }
        .reveal-card.highlight-green::before {
          background: ${C.ok};
        }
        .btn-presentation {
          background: ${C.red};
          color: #fff;
          border: none;
          border-radius: 14px;
          padding: 12px 24px;
          font-weight: 700;
          font-size: 14.5px;
          cursor: pointer;
          display: inline-flex;
          alignItems: center;
          gap: 8px;
          box-shadow: 0 4px 10px rgba(226,0,26,.15);
          transition: all 0.2s cubic-bezier(.2,.8,.2,1);
        }
        .btn-presentation:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 18px rgba(226,0,26,.32);
        }
        .btn-presentation:active {
          transform: scale(0.98);
        }
        @keyframes flowLineDraw {
          to { stroke-dashoffset: 0; }
        }
        .draw-arrow {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: flowLineDraw 1.5s ease-out forwards;
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 4px ${C.red}; transform: scale(1); }
          50% { box-shadow: 0 0 12px ${C.red}; transform: scale(1.04); }
        }
        .pulse-warning {
          animation: pulseGlow 2s ease-in-out infinite;
          border: 1px solid ${C.red};
        }
        @keyframes scanSweep {
          0% { transform: translateY(0); opacity: 0.1; }
          50% { opacity: 0.8; }
          100% { transform: translateY(180px); opacity: 0.1; }
        }
        .scan-overlay-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 2.5px;
          background: ${C.red};
          box-shadow: 0 0 10px 2px ${C.red};
          animation: scanSweep 3s infinite linear;
          pointer-events: none;
          z-index: 10;
        }
      `}</style>

      {/* STICKY PRESENTATION NAVIGATION */}
      <div style={{
        position: "sticky",
        top: 0,
        width: "100%",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.line}`,
        zIndex: 900,
        padding: "12px 24px"
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/carl-roth-logo.png" alt="Carl Roth Logo" style={{ height: 20 }} />
            <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: 0.5 }}>PITCHDECK</span>
          </div>
          <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
            {[
              { id: "start", label: "Start" },
              { id: "background", label: "Ausgangslage" },
              { id: "problems", label: "Pain Points" },
              { id: "swimlane", label: "Prozess" },
              { id: "matrix", label: "Matrix" },
              { id: "quickwin", label: "Fokus" },
              { id: "adoption", label: "Mitarbeiter" },
            ].map(sec => (
              <a 
                key={sec.id} 
                href={`#${sec.id}`} 
                className={`nav-item ${activeSection === sec.id ? "active" : ""}`}
              >
                {sec.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 1: HERO / TITLE SLIDE (Slide 1) */}
      <section id="start" style={{
        minHeight: "85vh",
        background: `linear-gradient(135deg, ${C.redDeep} 0%, ${C.redDark} 50%, ${C.red} 100%)`,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 24px",
        color: "#fff"
      }}>
        {/* Slanted branded design corner */}
        <div style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: "0 180px 180px 0",
          borderColor: `transparent #fff transparent transparent`,
          zIndex: 10
        }} />
        
        {/* Floating circles decoration */}
        <div style={{ position: "absolute", top: 120, left: 100, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.03)", filter: "blur(20px)" }} />
        <div style={{ position: "absolute", bottom: 80, right: 100, width: 340, height: 340, borderRadius: "50%", background: "rgba(255,255,255,0.03)", filter: "blur(30px)" }} />

        <div style={{ maxWidth: 1000, margin: "0 auto", width: "100%", position: "relative", zIndex: 20 }}>
          <Reveal>
            <div style={{ display: "inline-block", background: "#FFFFFF", padding: "6px 14px", borderRadius: 8, color: C.red, fontWeight: 800, fontSize: 13, marginBottom: 20 }}>
              KURS: WHD24B4
            </div>
            <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 800, margin: "0 0 16px", lineHeight: 1.1, letterSpacing: "-1px" }}>
              Effizienzsteigerungen<br />durch Digitalisierung
            </h1>
            <p style={{ fontSize: "clamp(16px, 3.5vw, 22px)", color: "#FFFFFF", opacity: 0.85, margin: "0 0 35px", maxWidth: 700, fontWeight: 500, lineHeight: 1.4 }}>
              Entwicklung eines Konzepts zur Einführung smarter Paletten bei der Carl Roth GmbH + Co. KG
            </p>
          </Reveal>

          {/* Glass-chips for Authors */}
          <Reveal delay={200}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginTop: 40 }}>
              <div className="glass-card">
                <span style={{ fontSize: 11, textTransform: "uppercase", opacity: 0.7, fontWeight: 700, letterSpacing: 0.5 }}>Unternehmen</span>
                <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4 }}>Carl Roth GmbH</div>
              </div>
              <div className="glass-card">
                <span style={{ fontSize: 11, textTransform: "uppercase", opacity: 0.7, fontWeight: 700, letterSpacing: 0.5 }}>Mitglieder</span>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4, lineHeight: 1.3 }}>
                  Elisabeth Auer · Silas Externest · Nils Flaschel · Jona Kammer · Chanel Wellalage
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 2: AUSGANGSSITUATION (Slide 2) */}
      <section id="background" style={{ padding: "100px 24px", background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <span style={{ color: C.red, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, display: "block", marginBottom: 6 }}>Fakten & Daten</span>
            <h2 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 40px", color: C.ink }}>Ausgangssituation: Wer ist Carl Roth?</h2>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            <Reveal delay={50}>
              <div className="reveal-card highlight-red" style={{ minHeight: 180 }}>
                <Award size={36} color={C.red} strokeWidth={1.5} style={{ marginBottom: 12 }} />
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 8px" }}>Tradition & Vertrauen</h3>
                <p style={{ margin: 0, fontSize: 14, color: C.muted, lineHeight: 1.5 }}>
                  Familienunternehmen mit über <CountUp end="145" suffix=" Jahren" /> Erfahrung als Chemie- und Laborfachhändler in Karlsruhe.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="reveal-card highlight-red" style={{ minHeight: 180 }}>
                <Layers size={36} color={C.red} strokeWidth={1.5} style={{ marginBottom: 12 }} />
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 8px" }}>B2B & Laboratorien</h3>
                <p style={{ margin: 0, fontSize: 14, color: C.muted, lineHeight: 1.5 }}>
                  Belieferung von Kunden aus Forschung, Wissenschaft und B2B-Industrie mit einem umfassenden Chemikalien-Sortiment.
                </p>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="reveal-card highlight-red" style={{ minHeight: 180 }}>
                <Compass size={36} color={C.red} strokeWidth={1.5} style={{ marginBottom: 12 }} />
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 8px" }}>Qualitätsführerschaft</h3>
                <p style={{ margin: 0, fontSize: 14, color: C.muted, lineHeight: 1.5 }}>
                  Globale Logistik-Geschäftstätigkeit unter höchsten Qualitäts- und Sicherheitsstandards.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SECTION 3: PROBLEMSTELLUNG (Slide 3 & 4) */}
      <section id="problems" style={{ padding: "100px 24px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          
          <div style={{ display: "flex", flexDirection: "column", mdDirection: "row", gap: 40, alignItems: "center" }}>
            <div style={{ flex: 1.2 }}>
              <Reveal>
                <span style={{ color: C.red, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, display: "block", marginBottom: 6 }}>Problemstellung</span>
                <h2 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 16px", color: C.ink }}>Lohnt sich die Einführung smarter Paletten bei Carl Roth?</h2>
                <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.6, margin: "0 0 30px" }}>
                  Der Transport von Gefahrstoffen und temperaturempfindlichen Reagenzien leidet unter einem Mangel an Transparenz und hohem manuellem Aufwand.
                </p>
              </Reveal>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  "Sehr hohe Anzahl täglich bewegter Paletten im Logistikzentrum",
                  "Komplexe Liefer- und Lagerprozesse über mehrere Stationen",
                  "Eingeschränkte Transparenz in der Lager- und Transportphase",
                  "Bislang fehlende Echtzeitinformationen über den Produktzustand",
                  "Hoher administrativer Aufwand zur Einhaltung von Sicherheitsregeln"
                ].map((txt, idx) => (
                  <Reveal key={idx} delay={idx * 60}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <AlertCircle size={18} color={C.red} style={{ flex: "0 0 auto", marginTop: 2 }} />
                      <span style={{ fontSize: 14.5, fontWeight: 600, color: C.ink }}>{txt}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            
            {/* Visual SmartPallet Showcase with Scan line */}
            <div style={{ flex: 0.8, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
              <Reveal delay={200}>
                <div style={{ 
                  background: C.bg, 
                  borderRadius: 24, 
                  padding: 16, 
                  border: `1px solid ${C.line}`,
                  position: "relative",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                  overflow: "hidden"
                }}>
                  <div className="scan-overlay-line" />
                  <AnimatedPallet status="ok" size={240} />
                  <div style={{ textAlign: "center", marginTop: 8, fontSize: 12, fontWeight: 700, color: C.muted }}>
                    Smarte Carl Roth Chemie-Palette
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Feature ➔ Benefit Mapping (Slide 4) */}
          <div style={{ marginTop: 80 }}>
            <Reveal>
              <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 24px", textAlign: "center" }}>
                Smarte Palette als Lösungsansatz
              </h3>
            </Reveal>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {[
                { f: "GPS-Tracking", b: "Schnellere Lokalisierung von Paletten" },
                { f: "Temperaturüberwachung", b: "Sicherung der empfindlichen Produktqualität" },
                { f: "Stoß- & Vibrationssensor", b: "Früherkennung von Transportschäden" },
                { f: "Gewichtsmessung", b: "Automatische Vollständigkeitskontrolle" },
                { f: "Gefahrstofferkennung", b: "Höhere Prozess- und Arbeitssicherheit" },
                { f: "Echtzeitdaten-Anbindung", b: "Wegfall manueller Kontrollaufwände" },
              ].map((map, idx) => (
                <Reveal key={idx} delay={idx * 60}>
                  <div className="reveal-card highlight-red" style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 800, color: C.red, textTransform: "uppercase" }}>Feature</span>
                        <div style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{map.f}</div>
                      </div>
                      <ArrowRight size={16} color={C.muted} />
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: C.ok, textTransform: "uppercase" }}>Nutzen</span>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: C.muted }}>{map.b}</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: PROCESS SWIMLANE FLOW (Slide 5 & 6) */}
      <section id="swimlane" style={{ padding: "100px 24px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <span style={{ color: C.red, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, display: "block", marginBottom: 6 }}>Prozessanalyse</span>
            <h2 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 16px", color: C.ink }}>Identifikation von Optimierungspotenzialen</h2>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.6, margin: "0 0 40px", maxWidth: 700 }}>
              Genaue Analyse der Liefer- und Lagerkette von Carl Roth. Die manuellen Schritte stellen signifikante Kontroll- und Qualitätslücken dar.
            </p>
          </Reveal>

          {/* Interactive Swimlanes Flow */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: 12, 
            background: "#fff", 
            borderRadius: 24, 
            padding: 24, 
            border: `1px solid ${C.line}`,
            overflowX: "auto"
          }}>
            {[
              { role: "Lieferant", color: C.red, step: "Anlieferung / Übergang Warenbegleitschein", alert: "Manuelle Prüfung: Zeitintensiv & fehleranfällig" },
              { role: "Wareneingang", color: "#B80016", step: "Sichtprüfung der Ware ➔ Abgleich des Lieferscheins ➔ WWS erfassen" },
              { role: "Gefahrgutprüfung", color: "#8E0813", step: "Kennzeichnung und Kontrolle ➔ Freigabe", alert: "Manuelle Kontrolle: Nicht automatisiert, hoher Prüfaufwand" },
              { role: "Lager", color: "#61060D", step: "Einlagerung der Paletten", alert: "Lagerphase/Blackbox: Kein GPS, keine Temperaturüberwachung, keine Stoßüberwachung" },
              { role: "Kommissionierung", color: "#450409", step: "Palette suchen ➔ Gewicht + Vollständigkeit prüfen", alert: "Hoher Suchaufwand & manuelle Prüfungen" },
              { role: "Versand", color: "#1F0104", step: "Versandetiketten + Verladung", alert: "Nach Verlassen des Lagers: Kompletter Kontrollverlust der Messwerte" },
              { role: "Kunde", color: "#16181D", step: "Empfang + Manuelle Quittierung", alert: "Manuelle Quittierung: Keine automatische Echtzeit-Empfangsbestätigung" },
            ].map((lane, idx) => (
              <Reveal key={idx} delay={idx * 50}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  border: `1px solid ${C.line}`, 
                  borderRadius: 14, 
                  background: C.bg, 
                  overflow: "hidden", 
                  minWidth: 800 
                }}>
                  {/* Left Role Header */}
                  <div style={{ 
                    width: 180, 
                    background: lane.color, 
                    color: "#fff", 
                    padding: "16px 20px", 
                    fontWeight: 800, 
                    fontSize: 14,
                    flexShrink: 0
                  }}>
                    {lane.role}
                  </div>

                  {/* Steps */}
                  <div style={{ flex: 1, padding: "12px 20px", fontSize: 13.5, fontWeight: 700, color: C.ink }}>
                    {lane.step}
                  </div>

                  {/* Pain Point Alert Badge */}
                  {lane.alert && (
                    <div className="pulse-warning" style={{ 
                      marginRight: 16, 
                      background: C.warnBg, 
                      color: C.redDark, 
                      fontSize: 11.5, 
                      fontWeight: 700, 
                      padding: "6px 12px", 
                      borderRadius: 8, 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 6,
                      maxWidth: 320
                    }}>
                      <ShieldAlert size={14} color={C.red} />
                      {lane.alert}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: PRIORITIZATION MATRIX (Slide 7) */}
      <section id="matrix" style={{ padding: "100px 24px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <span style={{ color: C.red, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, display: "block", marginBottom: 6 }}>Entscheidungsfindung</span>
            <h2 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 16px", color: C.ink }}>Priorisierung: Wo starten wir?</h2>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.6, margin: "0 0 40px" }}>
              Um den ROI zu maximieren, wurden alle Lösungsansätze anhand einer Impact-vs.-Effort-Matrix bewertet. Das Resultat führt zur klaren Definition des Quick Wins.
            </p>
          </Reveal>

          {/* Matrix Grid layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 800, margin: "0 auto" }}>
            
            {/* Quadrant 1: Quick Win */}
            <Reveal delay={50} className="reveal-card highlight-red" style={{ background: C.warnBg, border: `2px solid ${C.red}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ background: C.red, color: "#fff", padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 800 }}>IMPACT: HIGH · EFFORT: LOW</span>
                <Zap size={20} color={C.red} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: C.redDeep, margin: "0 0 8px" }}>Quick Win (Fokus)</h3>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13.5, color: C.ink, fontWeight: 600, lineHeight: 1.6 }}>
                <li>Temperaturüberwachung (Echtzeit)</li>
                <li>Stoß- und Vibrationssensor</li>
                <li>Echtzeitdaten-Anbindung</li>
              </ul>
            </Reveal>

            {/* Quadrant 2: Major Projects */}
            <Reveal delay={100} className="reveal-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ background: C.ink, color: "#fff", padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 800 }}>IMPACT: HIGH · EFFORT: HIGH</span>
                <Layers size={20} color={C.ink} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 8px" }}>Major Projects</h3>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13.5, color: C.muted, fontWeight: 600, lineHeight: 1.6 }}>
                <li>GPS-Tracking</li>
                <li>Gefahrstofferkennung</li>
              </ul>
            </Reveal>

            {/* Quadrant 3: Low-Hanging Fruits */}
            <Reveal delay={150} className="reveal-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ background: C.line, color: C.ink, padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 800 }}>IMPACT: LOW · EFFORT: LOW</span>
                <Zap size={20} color={C.muted} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 8px" }}>Low-hanging fruit</h3>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13.5, color: C.muted, fontWeight: 600, lineHeight: 1.6 }}>
                <li>Gewichtsmessung</li>
              </ul>
            </Reveal>

            {/* Quadrant 4: Hygiene */}
            <Reveal delay={200} className="reveal-card" style={{ opacity: 0.6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ background: C.line, color: C.ink, padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 800 }}>IMPACT: LOW · EFFORT: HIGH</span>
                <Settings size={20} color={C.muted} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 8px" }}>Hygiene</h3>
              <p style={{ margin: 0, fontSize: 13, color: C.muted }}>Keine vorrangigen Projekte in diesem Bereich identifiziert.</p>
            </Reveal>

          </div>
        </div>
      </section>

      {/* SECTION 6: QUICK WIN IN DETAIL (Slide 8 & 9) */}
      <section id="quickwin" style={{ padding: "100px 24px", background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          
          <div style={{ display: "flex", flexDirection: "column", mdDirection: "row", gap: 40 }}>
            
            <div style={{ flex: 1 }}>
              <Reveal>
                <span style={{ color: C.red, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, display: "block", marginBottom: 6 }}>Fokus Quick-Win</span>
                <h2 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 16px", color: C.ink }}>Warum die Temperaturüberwachung priorisiert wurde</h2>
              </Reveal>

              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
                {[
                  { title: "Hoher unmittelbarer Nutzen", desc: "Verhinderung von Chargenverlusten bei temperaturempfindlichen Gefahrstoffen." },
                  { title: "Geringer Implementierungsaufwand", desc: "Durch die Integration von vorkalibrierten Sensoren auf Standardpaletten." },
                  { title: "Direkter Beitrag zur Qualitätssicherung", desc: "Zertifizierter Nachweis lückenloser Kühlketten für B2B-Kunden." },
                  { title: "Einfache Prozessintegration", desc: "Nahtlose Anbindung an das Carl Roth Warenwirtschaftssystem (WWS)." }
                ].map((item, idx) => (
                  <Reveal key={idx} delay={idx * 60}>
                    <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: 16, display: "flex", gap: 12 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.okBg, color: C.ok, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Check size={16} strokeWidth={3} />
                      </div>
                      <div>
                        <h4 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 800, color: C.ink }}>{item.title}</h4>
                        <p style={{ margin: 0, fontSize: 13.5, color: C.muted, lineHeight: 1.4 }}>{item.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* solution concept steps flowchart */}
            <div style={{ flex: 1 }}>
              <Reveal>
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 24px" }}>Prozessfluss des Lösungskonzepts</h3>
              </Reveal>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { step: "1", title: "Smarte Palette", desc: "Palette misst kontinuierlich Temperaturwerte per Sensor." },
                  { step: "2", title: "Datenübertragung", desc: "Werte werden per Narrowband-IoT-Funkmodul gesendet." },
                  { step: "3", title: "WWS / Dashboard", desc: "Das System empfängt und validiert Werte gegen Zielwerte." },
                  { step: "4", title: "Automatische Warnmeldung", desc: "Grenzwert-Breach löst sofort ein WWS-Ticket / Push-Alarm aus." },
                  { step: "5", title: "Mitarbeiter reagiert", desc: "Klimatisierung wird geprüft oder Umlagerung veranlasst." }
                ].map((s, idx) => (
                  <Reveal key={idx} delay={idx * 70}>
                    <div style={{ display: "flex", gap: 14, alignItems: "center", position: "relative" }}>
                      <div style={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: "50%", 
                        background: C.red, 
                        color: "#fff", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        fontSize: 14, 
                        fontWeight: 800,
                        flexShrink: 0
                      }}>
                        {s.step}
                      </div>
                      <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: "10px 16px", flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: C.ink }}>{s.title}</h4>
                        <p style={{ margin: "2px 0 0", fontSize: 12.5, color: C.muted }}>{s.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 7: EMPLOYEE PERSPECTIVE & ADOPTION (Slide 10 & 11) */}
      <section id="adoption" style={{ padding: "100px 24px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <span style={{ color: C.red, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, display: "block", marginBottom: 6 }}>Changemanagement</span>
            <h2 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 16px", color: C.ink }}>Mitarbeiterperspektive & Akzeptanz</h2>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.6, margin: "0 0 45px" }}>
              Die Digitalisierung gelingt nur, wenn die Mitarbeiter im Lager voll mitgenommen werden. Hier ist die Empathy Map eines typischen Lagerarbeiters bei Carl Roth.
            </p>
          </Reveal>

          {/* Empathy Map Layout */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            
            {/* Left Block: Thoughts, Sights & Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Reveal>
                <div style={{ border: `1px solid ${C.line}`, borderRadius: 18, padding: 20, background: C.bg }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: C.red, display: "flex", alignItems: "center", gap: 6, margin: "0 0 10px" }}>
                    <span>👀</span> SIEHT
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: C.ink, lineHeight: 1.5 }}>
                    <li>Sehr viele Paletten und empfindliche Chemikalien</li>
                    <li>Zeitaufwändige, manuelle Temperaturkontrollen</li>
                    <li>Strengere Sicherheits- und Compliance-Vorgaben</li>
                    <li>Konstanten Zeitdruck und hohe Arbeitsbelastung</li>
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={50}>
                <div style={{ border: `1px solid ${C.line}`, borderRadius: 18, padding: 20, background: C.bg }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: C.red, display: "flex", alignItems: "center", gap: 6, margin: "0 0 10px" }}>
                    <span>👂</span> HÖRT
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: C.ink, lineHeight: 1.5 }}>
                    <li>„Fehler müssen absolut vermieden werden“</li>
                    <li>„Qualität steht an erster Stelle“</li>
                    <li>Kollegen äußern Skepsis gegenüber neuen IT-Systemen</li>
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div style={{ border: `1px solid ${C.line}`, borderRadius: 18, padding: 20, background: C.bg }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: C.red, display: "flex", alignItems: "center", gap: 6, margin: "0 0 10px" }}>
                    <span>🧠</span> DENKT & FÜHLT
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: C.ink, lineHeight: 1.5 }}>
                    <li>„Noch ein neues IT-System, das ich lernen muss?“</li>
                    <li>„Wenn es mir wirklich Arbeit abnimmt, ist es sinnvoll“</li>
                    <li>Sorge vor zusätzlichem administrativen Aufwand</li>
                  </ul>
                </div>
              </Reveal>
            </div>

            {/* Right Block: Pain Points & Gains */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Reveal delay={150}>
                <div className="reveal-card highlight-red" style={{ minHeight: 180 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 800, color: C.red, display: "flex", alignItems: "center", gap: 6, margin: "0 0 12px" }}>
                    <ShieldAlert size={16} /> PAIN POINTS (Mitarbeiter)
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: C.ink, lineHeight: 1.6 }}>
                    <li>Hoher manueller Aufwand zur Einhaltung von Kontrollen</li>
                    <li>Fehlende Echtzeit-Transparenz bei Abweichungen</li>
                    <li>Risiko, kritische Abweichungen zu spät zu bemerken</li>
                    <li>Angst vor zusätzlicher Verantwortung und Komplexität</li>
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="reveal-card highlight-green" style={{ minHeight: 180 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 800, color: C.ok, display: "flex", alignItems: "center", gap: 6, margin: "0 0 12px" }}>
                    <CheckCircle2 size={16} color={C.ok} /> GAINS (Mitarbeiter)
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: C.ink, lineHeight: 1.6 }}>
                    <li>Entlastung im Arbeitsalltag (weniger Handzettel)</li>
                    <li>Automatische Überwachung und Push-Warnungen</li>
                    <li>Schnellere Handlungsfähigkeit im Fehlerfall</li>
                    <li>Nachweisbare Einhaltung der Kühlkette ohne Stress</li>
                  </ul>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: C.ink,
        color: "#fff",
        padding: "40px 24px",
        textAlign: "center",
        borderTop: `1px solid ${C.line}`
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <img src="/carl-roth-logo.png" alt="Carl Roth Logo" style={{ height: 24 }} />
          <div style={{ fontSize: 13, opacity: 0.6 }}>
            © 2026 Carl Roth GmbH + Co. KG. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </div>
  );
}
