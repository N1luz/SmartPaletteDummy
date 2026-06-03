import React, { useState, useEffect } from "react";
import {
  ChevronLeft, Info, Thermometer, AlertTriangle, Check, CheckCircle2,
  Search, Bell, Wifi, BatteryFull, Signal, X, Clock, ChevronRight,
  QrCode, ScanLine, MapPin, Package, Filter
} from "lucide-react";
import AnimatedPallet from "./components/AnimatedPallet";

/* ============================================================
   SmartPallet – Clickdummy (Carl Roth GmbH + Co. KG)
   Fokus: Quick-Win "Temperaturüberwachung"
   Flows: Übersicht → Detail  ·  Übersicht → QR scannen → Aufnehmen
   ============================================================ */

const C = {
  red: "#E2001A", redDark: "#9E0F17", redDeep: "#6E0A12",
  ok: "#1A7A3C", okBg: "#E4F6EA",
  warnBg: "#FDE7E9",
  bg: "#F4F5F7", card: "#FFFFFF",
  ink: "#16181D", muted: "#7A8089", line: "#EAEBEE",
};

const INFO = {
  monitor: { title: "Temperaturüberwachung", body: "Die Palette misst ihre Temperatur in Echtzeit und meldet automatisch, sobald der zulässige Bereich verlassen wird – ganz ohne manuelle Kontrolle." },
  range:   { title: "Zielbereich", body: "Der für das Produkt freigegebene Temperaturbereich. Wird er über- oder unterschritten, schlägt die Palette Alarm." },
  history: { title: "Temperaturverlauf", body: "Zeigt die Messwerte der letzten 24 Stunden. So werden auch kurze Abweichungen während Lagerung und Transport sichtbar." },
  status:  { title: "Status", body: "Grün = Temperatur im zulässigen Bereich. Rot = Grenzwert überschritten und Prüfung erforderlich." },
  overview:{ title: "Übersicht", body: "Alle aktiven Paletten auf einen Blick. Auffällige Paletten werden oben hervorgehoben, damit sie sofort bearbeitet werden können." },
  updated: { title: "Letzte Messung", body: "Zeitpunkt der jüngsten Messung. Die Palette sendet in festen Intervallen automatisch neue Werte." },
  qr:      { title: "Aufnahme per QR-Code", body: "Jede Palette trägt einen QR-Code. Einmal gescannt, übernimmt das System Produkt, ID und Zielbereich automatisch – kein manuelles Anlegen mehr." },
};

const makeHistory = (t) =>
  [-0.3, 0.1, -0.2, 0.2, 0, -0.1, 0.15, -0.05, 0.1, -0.15, 0.05, 0, 0]
    .map((d, i) => (i === 12 ? t : +(t + d).toFixed(1)));

const START = [
  { id: "PAL-10451", product: "Diethylether", temp: 11.4, min: 2, max: 8, location: "Versand · Tor 3", updated: "vor 2 Min.", warn: true,
    history: [5.1, 5.0, 5.3, 5.6, 6.0, 6.4, 7.1, 7.9, 8.6, 9.4, 10.2, 10.9, 11.4] },
  { id: "PAL-10428", product: "Aceton 99,5 %", temp: 4.2, min: 2, max: 8, location: "Lager B · Reihe 12", updated: "vor 1 Min.", warn: false, history: makeHistory(4.2) },
  { id: "PAL-10433", product: "Ethanol, vergällt", temp: 6.8, min: 2, max: 8, location: "Lager B · Reihe 09", updated: "vor 3 Min.", warn: false, history: makeHistory(6.8) },
  { id: "PAL-10460", product: "Natronlauge 1 mol/l", temp: 5.1, min: 2, max: 8, location: "Lager A · Reihe 04", updated: "vor 1 Min.", warn: false, history: makeHistory(5.1) },
];

const PENDING = [
  { id: "PAL-10477", product: "Toluol", temp: 3.6, min: 2, max: 8, location: "Wareneingang · Tor 1", updated: "gerade eben", warn: false, history: makeHistory(3.6) },
  { id: "PAL-10482", product: "Salzsäure 37 %", temp: 7.2, min: 2, max: 8, location: "Wareneingang · Tor 2", updated: "gerade eben", warn: false, history: makeHistory(7.2) },
  { id: "PAL-10490", product: "Methanol", temp: 4.9, min: 2, max: 8, location: "Lager A · Reihe 02", updated: "gerade eben", warn: false, history: makeHistory(4.9) },
];

/* ---------- QR-Code (echtes Muster, SVG) ---------- */
function QRCode({ value = "ROTH", size = 150 }) {
  const N = 21;
  let h = 2166136261;
  for (const ch of value) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  let seed = h >>> 0;
  const rnd = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const finder = (r, c, R, Cc) => { const lr = r - R, lc = c - Cc; const edge = lr === 0 || lr === 6 || lc === 0 || lc === 6; const core = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4; return edge || core; };
  const cells = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    let on;
    if (r < 8 && c < 8) on = r < 7 && c < 7 ? finder(r, c, 0, 0) : false;
    else if (r < 8 && c >= N - 8) on = r < 7 && c >= N - 7 ? finder(r, c, 0, N - 7) : false;
    else if (r >= N - 8 && c < 8) on = r >= N - 7 && c < 7 ? finder(r, c, N - 7, 0) : false;
    else if (r === 6 || c === 6) on = (r + c) % 2 === 0;
    else on = rnd() > 0.52;
    if (on) cells.push(<rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" />);
  }
  return (
    <svg width={size} height={size} viewBox={`-1 -1 ${N + 2} ${N + 2}`} shapeRendering="crispEdges" style={{ display: "block" }}>
      <rect x="-1" y="-1" width={N + 2} height={N + 2} fill="#fff" />
      <g fill={C.ink}>{cells}</g>
    </svg>
  );
}

/* ---------- Temperaturdiagramm mit Zeichenanimation ---------- */
function TempChart({ data, lo, hi, warn }) {
  const W = 304, H = 150, pad = { l: 26, r: 10, t: 14, b: 22 }, dMin = 0, dMax = 14;
  const x = (i) => pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r);
  const y = (v) => pad.t + (1 - (v - dMin) / (dMax - dMin)) * (H - pad.t - pad.b);
  const stroke = warn ? C.red : C.ok;
  const line = data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(data.length - 1).toFixed(1)},${y(dMin)} L${x(0).toFixed(1)},${y(dMin)} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.18" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={pad.l} y={y(hi)} width={W - pad.l - pad.r} height={y(lo) - y(hi)} fill={C.okBg} />
      <line x1={pad.l} y1={y(hi)} x2={W - pad.r} y2={y(hi)} stroke="#BFE6CC" strokeWidth="1" strokeDasharray="3 3" />
      <line x1={pad.l} y1={y(lo)} x2={W - pad.r} y2={y(lo)} stroke="#BFE6CC" strokeWidth="1" strokeDasharray="3 3" />
      <text x={4} y={y(hi) + 3} fontSize="9" fill={C.muted}>{hi}°</text>
      <text x={4} y={y(lo) + 3} fontSize="9" fill={C.muted}>{lo}°</text>
      
      {/* Area Fill - Fades in after line draws */}
      <path d={area} fill="url(#fill)" className="chart-area" />
      
      {/* Dynamic line - Draws itself in */}
      <path d={line} fill="none" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="chart-line" />
      
      {/* Current point */}
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1])} r="4.5" fill={stroke} stroke="#fff" strokeWidth="2" className="chart-point" />
      
      <text x={pad.l} y={H - 5} fontSize="9" fill={C.muted}>−24h</text>
      <text x={W / 2 - 8} y={H - 5} fontSize="9" fill={C.muted}>−12h</text>
      <text x={W - pad.r - 22} y={H - 5} fontSize="9" fill={C.muted}>Jetzt</text>
    </svg>
  );
}

function StatusPill({ warn, small }) {
  const s = warn ? { bg: C.warnBg, fg: C.red, label: "Warnung", Icon: AlertTriangle }
                 : { bg: C.okBg, fg: C.ok, label: "Im Bereich", Icon: Check };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: s.bg, color: s.fg, borderRadius: 999, padding: small ? "3px 8px" : "5px 11px", fontSize: small ? 11 : 12.5, fontWeight: 700 }}>
      <s.Icon size={small ? 12 : 14} strokeWidth={2.6} /> {s.label}
    </span>
  );
}

function StatusBar({ light }) {
  const col = light ? "#fff" : C.ink;
  return (
    <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px 0 30px", color: col, zIndex: 10, position: "relative" }}>
      <span style={{ fontSize: 15, fontWeight: 700 }}>9:41</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Signal size={16} fill={col} color={col} /><Wifi size={16} color={col} strokeWidth={2.4} /><BatteryFull size={22} color={col} strokeWidth={1.8} />
      </div>
    </div>
  );
}

function InfoBtn({ onClick, light }) {
  return (
    <button onClick={onClick} aria-label="Information" style={{ width: 22, height: 22, borderRadius: 999, border: "none", cursor: "pointer", background: light ? "rgba(255,255,255,.25)" : C.bg, color: light ? "#fff" : C.red, display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto", padding: 0 }}>
      <Info size={14} strokeWidth={2.6} />
    </button>
  );
}

/* ---------- Übersicht ---------- */
function Segmented({ value, onChange, options }) {
  return (
    <div style={{ display: "flex", background: "#E7E8EB", borderRadius: 12, padding: 3, gap: 3 }}>
      {options.map((o) => {
        const on = value === o.key;
        return (
          <button key={o.key} onClick={() => onChange(o.key)} style={{ flex: 1, border: "none", cursor: "pointer", borderRadius: 9, padding: "8px 4px", fontSize: 13, fontWeight: 700, fontFamily: "inherit", background: on ? "#fff" : "transparent", color: on ? (o.color || C.ink) : C.muted, boxShadow: on ? "0 1px 3px rgba(0,0,0,.12)" : "none", transition: "color .15s" }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Chips({ value, onChange, options }) {
  return (
    <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
      {options.map((o) => {
        const on = value === o;
        return (
          <button key={o} onClick={() => onChange(o)} style={{ flex: "0 0 auto", border: on ? "none" : `1px solid ${C.line}`, background: on ? C.red : C.card, color: on ? "#fff" : C.ink, borderRadius: 999, padding: "7px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", boxShadow: on ? "0 4px 10px rgba(226,0,26,.28)" : "none" }}>
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Dashboard({ allPallets, displayPallets, query, setQuery, status, setStatus, area, setArea, onOpen, onScan, openInfo, onOpenFilter, isFilterActive, onResetAll, onOpenNotifs, unreadCount, simulating, onToggleSim }) {
  const warnCount = allPallets.filter((p) => p.warn).length;
  const areas = ["Alle", "Wareneingang", "Lager", "Versand"];
  const filterActive = status !== "alle" || area !== "Alle" || query.trim().length > 0 || isFilterActive;
  
  return (
    <div style={{ animation: "fade .3s ease", paddingBottom: 96, position: "relative", zIndex: 5 }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(150deg, ${C.red} 0%, ${C.redDark} 62%, ${C.redDeep} 100%)`, borderRadius: "0 0 30px 30px", padding: "4px 22px 22px", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -40, top: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,.07)" }} />
        <div style={{ position: "absolute", right: 40, top: 70, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,.06)" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <img src="/carl-roth-logo.png" alt="Carl Roth Logo" style={{ height: 22, objectFit: "contain", borderRadius: 3 }} />
            <span style={{ fontSize: 19, fontWeight: 800 }}>SmartPallet</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Live simulation control */}
            <button onClick={onToggleSim} 
              style={{ 
                border: "none", 
                background: simulating ? "rgba(74,222,128,0.22)" : "rgba(255,255,255,0.12)", 
                color: simulating ? "#4ADE80" : "#fff", 
                borderRadius: 999, 
                padding: "5px 10px", 
                fontSize: 11, 
                fontWeight: 700, 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                gap: 5,
                transition: "all 0.2s" 
              }}>
              <span style={{ 
                width: 6, 
                height: 6, 
                borderRadius: "50%", 
                background: simulating ? "#4ADE80" : "#fff", 
                display: "inline-block", 
                animation: simulating ? "pulse 1.2s infinite" : "none" 
              }} />
              Live-Demo
            </button>

            {/* Notification Bell with Badge */}
            <button onClick={onOpenNotifs} style={{ border: "none", background: "none", cursor: "pointer", position: "relative", padding: 2, display: "flex", color: "#fff", transition: "transform 0.15s" }} className="bell-btn">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span style={{ position: "absolute", top: -3, right: -3, background: C.red, color: "#fff", fontSize: 9, fontWeight: 800, minWidth: 14, height: 14, padding: "0 2px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #E2001A" }}>
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16 }}>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.9 }}>Aktive Paletten · Temperatur</p>
          <InfoBtn light onClick={() => openInfo("overview")} />
        </div>
        {/* Stat-Chips */}
        <div style={{ display: "flex", gap: 9, marginTop: 14, position: "relative" }}>
          <Chip value={allPallets.length} label="Paletten" />
          <Chip value={allPallets.length - warnCount} label="Im Bereich" />
          <Chip value={warnCount} label="Warnungen" highlight={warnCount > 0} />
        </div>
      </div>

      {/* Suche + Filter */}
      <div style={{ padding: "16px 20px 4px", display: "flex", flexDirection: "column", gap: 11 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: "11px 13px", boxShadow: "0 2px 8px rgba(20,10,15,.04)", flex: 1 }}>
            <Search size={17} color={C.muted} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Palette suchen …"
              style={{ border: "none", outline: "none", flex: 1, fontSize: 14, color: C.ink, background: "transparent", fontFamily: "inherit", minWidth: 0 }} />
            {query && <button onClick={() => setQuery("")} aria-label="Suche löschen" style={{ border: "none", background: "none", cursor: "pointer", color: C.muted, padding: 0, display: "flex" }}><X size={16} /></button>}
          </div>
          {/* Extended Filter Bottom Sheet Trigger */}
          <button onClick={onOpenFilter} 
            style={{ 
              border: isFilterActive ? `1px solid ${C.red}` : `1px solid ${C.line}`, 
              background: isFilterActive ? C.warnBg : C.card, 
              borderRadius: 12, 
              padding: "0 13px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              cursor: "pointer", 
              color: isFilterActive ? C.red : C.ink, 
              boxShadow: "0 2px 8px rgba(20,10,15,.04)",
              transition: "all 0.2s" 
            }}>
            <Filter size={18} strokeWidth={isFilterActive ? 2.8 : 2.2} />
          </button>
        </div>
        
        <Segmented value={status} onChange={setStatus} options={[{ key: "alle", label: "Alle" }, { key: "ok", label: "Im Bereich", color: C.ok }, { key: "warn", label: "Warnung", color: C.red }]} />
        <Chips value={area} onChange={setArea} options={areas} />
      </div>

      {/* Ergebniszeile */}
      <div style={{ padding: "8px 22px 10px", display: "flex", alignItems: "center", gap: 6 }}>
        <Filter size={14} color={C.muted} />
        <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>{displayPallets.length} {displayPallets.length === 1 ? "Palette" : "Paletten"}{filterActive ? " gefiltert" : ""}</span>
        {filterActive && <button onClick={onResetAll} style={{ marginLeft: "auto", border: "none", background: "none", color: C.red, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Zurücksetzen</button>}
      </div>

      {/* Liste */}
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 11 }}>
        {displayPallets.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 20px 10px", color: C.muted }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: C.card, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Search size={24} color={C.muted} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>Keine Paletten gefunden</div>
            <div style={{ fontSize: 13, marginTop: 3 }}>Passe Suche, Filter oder Bereich an.</div>
          </div>
        ) : displayPallets.map((p) => (
          <button key={p.id} onClick={() => onOpen(p.id)} style={{ textAlign: "left", border: "none", background: C.card, borderRadius: 16, padding: 0, cursor: "pointer", display: "flex", width: "100%", overflow: "hidden", boxShadow: "0 3px 12px rgba(20,10,15,.05)", transition: "transform 0.15s, box-shadow 0.15s" }} className="pallet-list-item">
            <div style={{ width: 5, background: p.warn ? C.red : C.ok, flex: "0 0 auto" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 13, padding: 14, flex: 1, minWidth: 0 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, flex: "0 0 auto", background: p.warn ? C.warnBg : C.okBg, color: p.warn ? C.red : C.ok, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Thermometer size={22} strokeWidth={2.2} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{p.product}</div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{p.id} · {p.location}</div>
                <div style={{ marginTop: 8 }}><StatusPill warn={p.warn} small /></div>
              </div>
              <div style={{ textAlign: "right", flex: "0 0 auto" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 500, color: p.warn ? C.red : C.ink }}>{p.temp.toFixed(1)}°</div>
                <ChevronRight size={18} color={C.muted} style={{ marginTop: 6 }} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* FAB: QR scannen */}
      <button onClick={onScan} style={{ position: "absolute", bottom: 30, right: 20, zIndex: 15, background: C.red, color: "#fff", border: "none", borderRadius: 999, padding: "14px 18px", display: "flex", alignItems: "center", gap: 8, fontSize: 14.5, fontWeight: 700, cursor: "pointer", boxShadow: "0 10px 22px rgba(226,0,26,.4)" }}>
        <QrCode size={20} strokeWidth={2.4} /> Palette scannen
      </button>
    </div>
  );
}

function Chip({ value, label, highlight }) {
  return (
    <div style={{ flex: 1, background: highlight ? "rgba(255,255,255,.95)" : "rgba(255,255,255,.16)", color: highlight ? C.red : "#fff", borderRadius: 14, padding: "11px 8px", textAlign: "center", backdropFilter: "blur(4px)" }}>
      <div style={{ fontSize: 23, fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>{value}</div>
      <div style={{ fontSize: 11, opacity: highlight ? 0.85 : 0.9, marginTop: 1 }}>{label}</div>
    </div>
  );
}

/* ---------- Detailansicht ---------- */
function Detail({ pallet, onBack, openInfo }) {
  const p = pallet;
  return (
    <div style={{ animation: "slide .3s ease", paddingBottom: 30, position: "relative", zIndex: 5 }}>
      <div style={{ display: "flex", alignItems: "center", padding: "2px 16px 10px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", display: "flex", alignItems: "center", fontSize: 16, fontWeight: 600, padding: 4 }}>
          <ChevronLeft size={22} /> Übersicht
        </button>
      </div>
      <div style={{ padding: "0 20px" }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink }}>{p.product}</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 3, display: "flex", alignItems: "center", gap: 5 }}><MapPin size={13} /> {p.id} · {p.location}</div>

        {/* Dynamic 3D Pallet Graphic representing Current Status */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "12px 0 16px 0",
          background: p.warn ? "radial-gradient(circle, rgba(226,0,26,0.06) 0%, rgba(0,0,0,0) 70%)" : "radial-gradient(circle, rgba(26,122,60,0.06) 0%, rgba(0,0,0,0) 70%)",
          borderRadius: 24,
          padding: "8px 0"
        }}>
          <AnimatedPallet status={p.warn ? "warn" : "ok"} size={160} />
        </div>

        {p.warn && (
          <div style={{ marginTop: 12, background: C.warnBg, border: "1px solid #F6C9CE", borderRadius: 14, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <AlertTriangle size={20} color={C.red} strokeWidth={2.4} style={{ flex: "0 0 auto", marginTop: 1 }} />
            <div style={{ fontSize: 13, color: C.redDark, lineHeight: 1.4 }}><b>Grenzwert überschritten.</b> Die Temperatur liegt über dem Zielbereich – bitte Palette prüfen.</div>
          </div>
        )}

        {/* Temperature Card with glowing alert animation */}
        <div style={{ marginTop: 14, background: C.card, border: `1px solid ${C.line}`, borderRadius: 18, padding: 18, boxShadow: "0 3px 12px rgba(20,10,15,.04)", position: "relative", overflow: "hidden" }}>
          {p.warn && (
            <div style={{ position: "absolute", inset: 0, borderRadius: 18, pointerEvents: "none", border: `2px solid ${C.red}`, animation: "hotPulse 2s infinite" }} />
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>Aktuelle Temperatur</span><InfoBtn onClick={() => openInfo("monitor")} />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 46, fontWeight: 500, lineHeight: 1, color: p.warn ? C.red : C.ink }}>{p.temp.toFixed(1)}<span style={{ fontSize: 24 }}>°C</span></div>
            <StatusPill warn={p.warn} />
          </div>
        </div>

        <div style={{ marginTop: 14, background: C.card, border: `1px solid ${C.line}`, borderRadius: 18, padding: "16px 14px 10px", boxShadow: "0 3px 12px rgba(20,10,15,.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 4px 6px" }}>
            <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>Temperaturverlauf (24 h)</span><InfoBtn onClick={() => openInfo("history")} />
          </div>
          <TempChart data={p.history} lo={p.min} hi={p.max} warn={p.warn} />
        </div>

        <div style={{ marginTop: 14, background: C.card, border: `1px solid ${C.line}`, borderRadius: 18, overflow: "hidden", boxShadow: "0 3px 12px rgba(20,10,15,.04)" }}>
          <Row label="Zielbereich" value={`${p.min} – ${p.max} °C`} onInfo={() => openInfo("range")} />
          <Row label="Status" value={p.warn ? "Warnung" : "Im Bereich"} valueColor={p.warn ? C.red : C.ok} onInfo={() => openInfo("status")} border />
          <Row label="Letzte Messung" value={p.updated} icon={<Clock size={14} color={C.muted} />} onInfo={() => openInfo("updated")} border />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, valueColor, onInfo, border, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderTop: border ? `1px solid ${C.line}` : "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 14, color: C.ink, fontWeight: 600 }}>{label}</span><InfoBtn onClick={onInfo} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700, color: valueColor || C.ink }}>{icon} {value}</div>
    </div>
  );
}

/* ---------- QR-Scan ---------- */
function Scan({ onClose, onDetect, openInfo }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#0B0B0D", zIndex: 25, display: "flex", flexDirection: "column", animation: "fade .25s ease", borderRadius: 46, overflow: "hidden" }}>
      <StatusBar light />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px 8px", color: "#fff", zIndex: 10 }}>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,.12)", border: "none", borderRadius: 999, width: 34, height: 34, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={19} /></button>
        <span style={{ fontSize: 16, fontWeight: 700 }}>QR-Code scannen</span>
        <InfoBtn light onClick={() => openInfo("qr")} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "0 24px", zIndex: 10 }}>
        {/* Holographic Laser Scanner Overlay for SmartPallets */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 110,
          marginBottom: -10,
          opacity: 0.85
        }}>
          <AnimatedPallet status="scanning" size={130} />
        </div>

        {/* Viewfinder with radar wave animation */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Radar waves */}
          <div className="radar-wave" />
          <div className="radar-wave" style={{ animationDelay: "1.2s" }} />

          <button onClick={onDetect} style={{ position: "relative", width: 200, height: 200, background: "#15161A", borderRadius: 26, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", zIndex: 2 }}>
            <div style={{ background: "#fff", padding: 10, borderRadius: 14 }}><QRCode value="PAL-NEW-2026" size={120} /></div>
            {[["t","l"],["t","r"],["b","l"],["b","r"]].map(([v,h],i) => (
              <span key={i} style={{ position: "absolute", [v === "t" ? "top" : "bottom"]: 12, [h === "l" ? "left" : "right"]: 12, width: 30, height: 30, borderTop: v === "t" ? `3px solid ${C.red}` : "none", borderBottom: v === "b" ? `3px solid ${C.red}` : "none", borderLeft: h === "l" ? `3px solid ${C.red}` : "none", borderRight: h === "r" ? `3px solid ${C.red}` : "none", borderTopLeftRadius: v === "t" && h === "l" ? 8 : 0, borderTopRightRadius: v === "t" && h === "r" ? 8 : 0, borderBottomLeftRadius: v === "b" && h === "l" ? 8 : 0, borderBottomRightRadius: v === "b" && h === "r" ? 8 : 0 }} />
            ))}
            <div style={{ position: "absolute", left: 14, right: 14, height: 2, background: `linear-gradient(90deg, transparent, ${C.red}, transparent)`, boxShadow: `0 0 12px 2px ${C.red}`, animation: "scanmove 2.1s ease-in-out infinite alternate" }} />
          </button>
        </div>

        <div style={{ textAlign: "center", color: "#fff" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, opacity: 0.85 }}>
            <ScanLine size={16} /> QR-Code im Rahmen positionieren
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(255,255,255,.45)" }}>Erkennung läuft automatisch · oder tippen</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Aufnahme bestätigen ---------- */
function Register({ pallet, onCancel, onConfirm, openInfo }) {
  const p = pallet;
  return (
    <div style={{ animation: "slide .3s ease", paddingBottom: 30, position: "relative", zIndex: 5 }}>
      <div style={{ display: "flex", alignItems: "center", padding: "2px 16px 10px" }}>
        <button onClick={onCancel} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", display: "flex", alignItems: "center", fontSize: 16, fontWeight: 600, padding: 4 }}>
          <ChevronLeft size={22} /> Abbrechen
        </button>
      </div>
      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.okBg, color: C.ok, borderRadius: 999, padding: "5px 12px", fontSize: 13, fontWeight: 700 }}>
          <CheckCircle2 size={16} strokeWidth={2.6} /> QR-Code erkannt
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "14px 0 2px" }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.ink }}>Palette aufnehmen</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <p style={{ margin: 0, fontSize: 13, color: C.muted }}>Daten automatisch aus QR übernommen</p><InfoBtn onClick={() => openInfo("qr")} />
        </div>

        {/* Floating Confirmation Pallet graphic showing confirm state */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "12px 0 16px 0",
          background: "radial-gradient(circle, rgba(26,122,60,0.06) 0%, rgba(0,0,0,0) 70%)",
          borderRadius: 24,
          padding: "6px 0"
        }}>
          <AnimatedPallet status="confirm" size={150} />
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 18, padding: 16, display: "flex", alignItems: "center", gap: 14, boxShadow: "0 3px 12px rgba(20,10,15,.04)" }}>
          <div style={{ width: 52, height: 52, borderRadius: 13, background: C.warnBg, color: C.red, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}><Package size={26} strokeWidth={2.2} /></div>
          <div><div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>{p.product}</div><div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{p.id}</div></div>
        </div>

        <div style={{ marginTop: 14, background: C.card, border: `1px solid ${C.line}`, borderRadius: 18, overflow: "hidden", boxShadow: "0 3px 12px rgba(20,10,15,.04)" }}>
          <Row label="Zielbereich" value={`${p.min} – ${p.max} °C`} onInfo={() => openInfo("range")} />
          <Row label="Aktuelle Temperatur" value={`${p.temp.toFixed(1)} °C`} valueColor={C.ok} onInfo={() => openInfo("monitor")} border />
          <Row label="Standort" value={p.location} icon={<MapPin size={14} color={C.muted} />} onInfo={() => openInfo("overview")} border />
        </div>

        <button onClick={onConfirm} style={{ width: "100%", marginTop: 20, background: C.red, color: "#fff", border: "none", borderRadius: 14, padding: "15px 0", fontSize: 15.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 8px 18px rgba(226,0,26,.32)" }}>
          <Check size={19} strokeWidth={2.8} /> Ins System aufnehmen
        </button>
      </div>
    </div>
  );
}

function InfoSheet({ info, onClose }) {
  if (!info) return null;
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.32)", display: "flex", alignItems: "flex-end", zIndex: 40, borderRadius: 46, animation: "fade .2s ease" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "26px 26px 46px 46px", padding: "10px 22px 34px", animation: "up .28s cubic-bezier(.2,.8,.2,1)" }}>
        <div style={{ width: 38, height: 5, background: "#D9DBE0", borderRadius: 999, margin: "0 auto 16px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: C.warnBg, color: C.red, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}><Info size={20} strokeWidth={2.4} /></div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: C.ink }}>{info.title}</h3>
          </div>
          <button onClick={onClose} style={{ border: "none", background: C.bg, borderRadius: 999, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.muted }}><X size={18} /></button>
        </div>
        <p style={{ margin: "14px 0 18px", fontSize: 14.5, lineHeight: 1.55, color: "#4A4F57" }}>{info.body}</p>
        <button onClick={onClose} style={{ width: "100%", background: C.red, color: "#fff", border: "none", borderRadius: 13, padding: "13px 0", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Verstanden</button>
      </div>
    </div>
  );
}

/* ---------- Extended Filter Drawer Bottom Sheet ---------- */
function FilterSheet({ open, onClose, sortBy, setSortBy, tempMin, setTempMin, tempMax, setTempMax, onReset }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.32)", display: "flex", alignItems: "flex-end", zIndex: 40, borderRadius: 46, animation: "fade .2s ease" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "26px 26px 46px 46px", padding: "10px 22px 34px", animation: "up .28s cubic-bezier(.2,.8,.2,1)" }}>
        <div style={{ width: 38, height: 5, background: "#D9DBE0", borderRadius: 999, margin: "0 auto 16px" }} />
        
        {/* Title */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: C.warnBg, color: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}><Filter size={18} strokeWidth={2.4} /></div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: C.ink }}>Filter & Sortierung</h3>
          </div>
          <button onClick={onClose} style={{ border: "none", background: C.bg, borderRadius: 999, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.muted }}><X size={18} /></button>
        </div>

        {/* Sort Options */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 12.5, color: C.muted, fontWeight: 700, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Sortieren nach</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { key: "warnFirst", label: "Warnungen zuerst (Standard)" },
              { key: "tempDesc", label: "Temperatur (höchste zuerst)" },
              { key: "tempAsc", label: "Temperatur (niedrigste zuerst)" },
              { key: "id", label: "Paletten-ID (A-Z)" },
              { key: "updated", label: "Messzeitpunkt (jüngste)" }
            ].map(opt => {
              const active = sortBy === opt.key;
              return (
                <button key={opt.key} onClick={() => setSortBy(opt.key)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", border: active ? `1px solid ${C.red}` : `1px solid ${C.line}`, background: active ? C.warnBg : C.card, color: active ? C.redDark : C.ink, borderRadius: 10, padding: "10px 14px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                  {opt.label}
                  {active && <Check size={16} strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Temperature Range Slider */}
        <div style={{ marginBottom: 22 }}>
          <label style={{ fontSize: 12.5, color: C.muted, fontWeight: 700, display: "block", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Temperaturbereich filtern</label>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12, background: C.bg, padding: "12px 14px", borderRadius: 14 }}>
            {/* Min Slider */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 600, color: C.ink, marginBottom: 4 }}>
                <span>Minimalwert</span>
                <span style={{ color: C.red, fontFamily: "monospace" }}>{tempMin.toFixed(1)} °C</span>
              </div>
              <input type="range" min="0" max="10" step="0.5" value={tempMin} onChange={e => setTempMin(Math.min(parseFloat(e.target.value), tempMax))} style={{ width: "100%", accentColor: C.red, cursor: "pointer" }} />
            </div>

            {/* Max Slider */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 600, color: C.ink, marginBottom: 4 }}>
                <span>Maximalwert</span>
                <span style={{ color: C.red, fontFamily: "monospace" }}>{tempMax.toFixed(1)} °C</span>
              </div>
              <input type="range" min="5" max="15" step="0.5" value={tempMax} onChange={e => setTempMax(Math.max(parseFloat(e.target.value), tempMin))} style={{ width: "100%", accentColor: C.red, cursor: "pointer" }} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onReset} style={{ flex: 1, background: C.bg, color: C.ink, border: "none", borderRadius: 12, padding: "13px 0", fontSize: 14.5, fontWeight: 700, cursor: "pointer" }}>Zurücksetzen</button>
          <button onClick={onClose} style={{ flex: 2, background: C.red, color: "#fff", border: "none", borderRadius: 12, padding: "13px 0", fontSize: 14.5, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(226,0,26,.2)" }}>Anwenden</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Notification Drawer Bottom Sheet ---------- */
function NotificationSheet({ open, onClose, notifications, onMarkAllRead, onClearAll, onSelectPallet }) {
  if (!open) return null;
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.32)", display: "flex", alignItems: "flex-end", zIndex: 40, borderRadius: 46, animation: "fade .2s ease" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "26px 26px 46px 46px", padding: "10px 22px 34px", animation: "up .28s cubic-bezier(.2,.8,.2,1)", display: "flex", flexDirection: "column", maxHeight: "80%" }}>
        <div style={{ width: 38, height: 5, background: "#D9DBE0", borderRadius: 999, margin: "0 auto 16px" }} />
        
        {/* Title */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: C.warnBg, color: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}><Bell size={18} /></div>
            <div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: C.ink }}>Meldungen & Alarme</h3>
              <span style={{ fontSize: 12, color: C.muted }}>{unreadCount} ungelesen</span>
            </div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: C.bg, borderRadius: 999, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.muted }}><X size={18} /></button>
        </div>

        {/* Action Bar */}
        {notifications.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${C.line}` }}>
            <button onClick={onMarkAllRead} style={{ border: "none", background: "none", color: C.red, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Alle als gelesen markieren</button>
            <button onClick={onClearAll} style={{ border: "none", background: "none", color: C.muted, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Leeren</button>
          </div>
        )}

        {/* Notifications Scroll Area */}
        <div style={{ overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 10, paddingRight: 2, paddingBottom: 10 }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: C.muted }}>
              <Bell size={36} style={{ strokeWidth: 1.5, marginBottom: 8, opacity: 0.5 }} />
              <div style={{ fontSize: 14.5, fontWeight: 700, color: C.ink }}>Keine neuen Meldungen</div>
              <div style={{ fontSize: 12.5, marginTop: 2 }}>Alles in Ordnung! Telemetriedaten laufen im Hintergrund.</div>
            </div>
          ) : (
            notifications.map(n => (
              <button key={n.id} onClick={() => onSelectPallet(n)} style={{ width: "100%", background: n.read ? C.card : "rgba(226, 0, 26, 0.04)", border: n.read ? `1px solid ${C.line}` : `1px solid rgba(226, 0, 26, 0.15)`, borderRadius: 12, padding: 12, cursor: "pointer", textAlign: "left", fontFamily: "inherit", display: "flex", gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: n.type === "warn" ? C.warnBg : C.okBg, color: n.type === "warn" ? C.red : C.ok, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto", marginTop: 2 }}>
                  {n.type === "warn" ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: C.ink }}>{n.product} ({n.palletId})</span>
                    <span style={{ fontSize: 11, color: C.muted }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize: 12.5, color: "#4A4F57", margin: "4px 0 0", lineHeight: 1.4 }}>{n.text}</p>
                </div>
              </button>
            ))
          )}
        </div>

        <button onClick={onClose} style={{ width: "100%", background: C.red, color: "#fff", border: "none", borderRadius: 12, padding: "13px 0", fontSize: 14.5, fontWeight: 700, cursor: "pointer", marginTop: 10 }}>Schließen</button>
      </div>
    </div>
  );
}

function Toast({ text }) {
  if (!text) return null;
  return (
    <div style={{ position: "absolute", top: 54, left: 20, right: 20, zIndex: 45, background: C.ink, color: "#fff", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 9, boxShadow: "0 10px 24px rgba(0,0,0,.3)", animation: "drop .3s ease" }}>
      <CheckCircle2 size={19} color="#4ADE80" strokeWidth={2.6} /> <span style={{ fontSize: 14, fontWeight: 600 }}>{text}</span>
    </div>
  );
}

const START_NOTIFS = [
  { id: 1, type: "warn", palletId: "PAL-10451", product: "Diethylether", text: "Grenzwert überschritten! Aktuell: 11.4 °C (Ziel: 2-8 °C)", time: "vor 2 Min.", read: false },
  { id: 2, type: "info", palletId: "PAL-10460", product: "Natronlauge 1 mol/l", text: "Palette erfolgreich im Lager A erfasst.", time: "vor 5 Min.", read: true },
  { id: 3, type: "info", palletId: "PAL-10428", product: "Aceton 99,5 %", text: "Temperatur stabilisiert bei 4.2 °C.", time: "vor 10 Min.", read: true },
];

/* ---------- App ---------- */
export default function App() {
  const [screen, setScreen] = useState("home");
  const [pallets, setPallets] = useState(START);
  const [selected, setSelected] = useState(null);
  const [scanned, setScanned] = useState(null);
  const [info, setInfo] = useState(null);
  const [toast, setToast] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("alle");
  const [area, setArea] = useState("Alle");

  // Splash Screen States
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);

  // Notification States
  const [notificationSheetOpen, setNotificationSheetOpen] = useState(false);
  const [notifications, setNotifications] = useState(START_NOTIFS);
  const [simulating, setSimulating] = useState(false);

  // Extended Filter States
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [sortBy, setSortBy] = useState("warnFirst");
  const [tempMin, setTempMin] = useState(0);
  const [tempMax, setTempMax] = useState(15);

  const pallet = pallets.find((p) => p.id === selected);
  const openInfo = (k) => setInfo(INFO[k]);

  const nextPending = () => {
    const ids = new Set(pallets.map((p) => p.id));
    const avail = PENDING.find((p) => !ids.has(p.id));
    return avail || { id: `PAL-105${pallets.length}`, product: "Isopropanol", temp: 4.4, min: 2, max: 8, location: "Wareneingang · Tor 1", updated: "gerade eben", warn: false, history: makeHistory(4.4) };
  };
  const detect = () => { setScanned(nextPending()); setScreen("register"); };

  useEffect(() => {
    if (screen !== "scan") return;
    const t = setTimeout(detect, 2100);
    return () => clearTimeout(t);
  }, [screen]); // eslint-disable-line

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  // Timer for boot Splash Screen
  useEffect(() => {
    const timerFade = setTimeout(() => setFadeSplash(true), 2000);
    const timerRemove = setTimeout(() => setShowSplash(false), 2600);
    return () => {
      clearTimeout(timerFade);
      clearTimeout(timerRemove);
    };
  }, []);

  // Live Telemetry Simulation Timer
  useEffect(() => {
    if (!simulating) return;
    const interval = setInterval(() => {
      setPallets(prev => prev.map(p => {
        // Change temperature by random delta between -0.3 and +0.3
        const delta = +(Math.random() * 0.6 - 0.3).toFixed(1);
        const newTemp = +(p.temp + delta).toFixed(1);
        const warn = newTemp < p.min || newTemp > p.max;
        
        // Add to history (keeping the last 13 entries)
        const newHistory = [...p.history.slice(1), newTemp];
        
        // Detect transitions to trigger push alerts
        if (warn && !p.warn) {
          const newNotif = {
            id: Date.now() + Math.random(),
            type: "warn",
            palletId: p.id,
            product: p.product,
            text: `Grenzwert überschritten! Aktuell: ${newTemp} °C (Ziel: ${p.min}-${p.max} °C)`,
            time: "gerade eben",
            read: false
          };
          setNotifications(prevNotifs => [newNotif, ...prevNotifs]);
          setToast(`Alarm: ${p.product} kritische Temperatur!`);
        } else if (!warn && p.warn) {
          const newNotif = {
            id: Date.now() + Math.random(),
            type: "info",
            palletId: p.id,
            product: p.product,
            text: `Temperatur wieder im Normalbereich: ${newTemp} °C (Ziel: ${p.min}-${p.max} °C)`,
            time: "gerade eben",
            read: false
          };
          setNotifications(prevNotifs => [newNotif, ...prevNotifs]);
          setToast(`${p.product} wieder im Bereich`);
        }
        
        return {
          ...p,
          temp: newTemp,
          warn,
          history: newHistory
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [simulating, pallets]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAllNotifs = () => {
    setNotifications([]);
  };

  const handleSelectNotifPallet = (n) => {
    // Mark as read
    setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
    setNotificationSheetOpen(false);
    
    // Check if the pallet is active in the system
    if (pallets.some(p => p.id === n.palletId)) {
      setSelected(n.palletId);
      setScreen("detail");
    } else {
      setToast("Palette nicht aktiv im System");
    }
  };

  const confirmAdd = () => {
    setPallets((prev) => (prev.some((p) => p.id === scanned.id) ? prev : [...prev, scanned]));
    handleResetAllFilters();
    setScreen("home");
    setToast(`${scanned.product} aufgenommen`);
  };

  const handleResetFiltersOnly = () => {
    setSortBy("warnFirst");
    setTempMin(0);
    setTempMax(15);
  };

  const handleResetAllFilters = () => {
    setStatus("alle");
    setArea("Alle");
    setQuery("");
    handleResetFiltersOnly();
  };

  // Pre-calculate Filtering & Sorting
  const areaOf = (p) => p.location.split(" ")[0];
  const q = query.trim().toLowerCase();
  
  const filteredPallets = pallets.filter((p) => {
    const sOk = status === "alle" || (status === "warn" ? p.warn : !p.warn);
    const aOk = area === "Alle" || areaOf(p) === area;
    const qOk = !q || p.product.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    const tOk = p.temp >= tempMin && p.temp <= tempMax;
    return sOk && aOk && qOk && tOk;
  });

  const sortedPallets = [...filteredPallets].sort((a, b) => {
    if (sortBy === "warnFirst") {
      return (b.warn ? 1 : 0) - (a.warn ? 1 : 0);
    }
    if (sortBy === "tempDesc") {
      return b.temp - a.temp;
    }
    if (sortBy === "tempAsc") {
      return a.temp - b.temp;
    }
    if (sortBy === "id") {
      return a.id.localeCompare(b.id);
    }
    if (sortBy === "updated") {
      const getMin = (str) => {
        if (str.includes("eben")) return 0;
        const match = str.match(/\d+/);
        return match ? parseInt(match[0], 10) : 999;
      };
      return getMin(a.updated) - getMin(b.updated);
    }
    return 0;
  });

  const isFilterActive = sortBy !== "warnFirst" || tempMin !== 0 || tempMax !== 15;
  const light = screen === "scan";

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "radial-gradient(120% 80% at 50% 0%, #FBE9EB 0%, #F1F2F4 46%, #E9EAEC 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 16px", boxSizing: "border-box", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slide { from { opacity: 0; transform: translateX(14px) } to { opacity: 1; transform: none } }
        @keyframes up { from { transform: translateY(100%) } to { transform: none } }
        @keyframes drop { from { opacity: 0; transform: translateY(-12px) } to { opacity: 1; transform: none } }
        @keyframes scanmove { from { top: 16px } to { bottom: 16px; top: auto } }
        
        /* Ambient Floating Particles Background Keyframes */
        @keyframes floatParticle1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -45px) scale(1.1); }
        }
        @keyframes floatParticle2 {
          0%, 100% { transform: translate(0, 0) scale(1.05); }
          50% { transform: translate(-35px, 25px) scale(0.9); }
        }

        /* Temp Chart SVG Draw animation */
        @keyframes drawPath {
          from { stroke-dashoffset: 600; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeInArea {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popPoint {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .chart-line {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: drawPath 1.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .chart-area {
          animation: fadeInArea 1s ease-out 0.8s forwards;
          opacity: 0;
        }
        .chart-point {
          transform-origin: center;
          animation: popPoint 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 1.5s forwards;
          opacity: 0;
        }

        /* Radar Sonar scan effect */
        @keyframes radarPulse {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        .radar-wave {
          position: absolute;
          width: 250px;
          height: 250px;
          border: 1.5px solid rgba(226, 0, 26, 0.25);
          border-radius: 50%;
          animation: radarPulse 2.4s linear infinite;
          pointer-events: none;
          z-index: 1;
        }

        /* Glowing warning halo */
        @keyframes hotPulse {
          0%, 100% { box-shadow: 0 0 10px rgba(226, 0, 26, 0.08); }
          50% { box-shadow: 0 0 22px rgba(226, 0, 26, 0.25); }
        }

        /* Hover micro-animation for pallet items */
        .pallet-list-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(20,10,15,.08) !important;
        }

        /* Splash Screen keyframes */
        @keyframes logoBoot {
          0% { transform: scale(0.9) translateY(0); }
          100% { transform: scale(1.04) translateY(-4px); }
        }
        @keyframes labelFade {
          0% { opacity: 0.55; }
          100% { opacity: 1; }
        }
        @keyframes bootProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }

        * { -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      <p style={{ color: C.muted, fontSize: 13, marginBottom: 18, textAlign: "center", maxWidth: 360 }}>
        Tippe auf <b style={{ color: C.red }}>„Palette scannen"</b> für den QR-Flow · die <b style={{ color: C.red }}>(i)</b>-Symbole erklären jede Funktion
      </p>

      {/* Device Frame */}
      <div style={{ width: 380, maxWidth: "100%", height: 800, background: "#0B0B0D", borderRadius: 56, padding: 12, boxShadow: "0 30px 60px rgba(60,10,15,.28), 0 4px 12px rgba(0,0,0,.2)", position: "relative", overflow: "hidden" }}>
        
        {/* Floating Background Glow Particles */}
        <div style={{ position: "absolute", top: 120, left: 30, width: 150, height: 150, borderRadius: "50%", background: "rgba(226,0,26,0.035)", filter: "blur(40px)", animation: "floatParticle1 20s ease-in-out infinite", pointerEvents: "none", zIndex: 1 }} />
        <div style={{ position: "absolute", bottom: 180, right: 20, width: 160, height: 160, borderRadius: "50%", background: "rgba(26,122,60,0.035)", filter: "blur(45px)", animation: "floatParticle2 24s ease-in-out infinite", pointerEvents: "none", zIndex: 1 }} />
        
        <div style={{ width: "100%", height: "100%", background: C.bg, borderRadius: 46, overflow: "hidden", position: "relative", display: "flex", flexDirection: "column", zIndex: 2 }}>
          
          {/* Boot Splash Screen */}
          {showSplash && (
            <div style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, ${C.red} 0%, ${C.redDark} 100%)`,
              zIndex: 100,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              opacity: fadeSplash ? 0 : 1,
              transition: "opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
              pointerEvents: fadeSplash ? "none" : "auto"
            }}>
              <div style={{
                background: "#fff",
                padding: "16px 24px",
                borderRadius: 20,
                boxShadow: "0 15px 35px rgba(0,0,0,0.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "logoBoot 1.5s cubic-bezier(0.25, 0.8, 0.25, 1) infinite alternate"
              }}>
                <img src="/carl-roth-logo.png" alt="Carl Roth Logo" style={{ height: 42, objectFit: "contain" }} />
              </div>
              
              <div style={{ 
                color: "#fff", 
                fontSize: 21, 
                fontWeight: 800, 
                letterSpacing: 1.2,
                marginTop: 6,
                fontStyle: "italic",
                animation: "labelFade 1.2s ease-in-out infinite alternate"
              }}>
                SmartPallet
              </div>

              <div style={{
                width: 120,
                height: 3,
                background: "rgba(255,255,255,0.22)",
                borderRadius: 999,
                overflow: "hidden",
                marginTop: 10
              }}>
                <div style={{
                  height: "100%",
                  background: "#fff",
                  borderRadius: 999,
                  animation: "bootProgress 2.0s cubic-bezier(0.4, 0, 0.2, 1) forwards"
                }} />
              </div>
            </div>
          )}

          <div style={{ position: "absolute", top: 11, left: "50%", transform: "translateX(-50%)", width: 116, height: 33, background: "#0B0B0D", borderRadius: 999, zIndex: 30 }} />

          {!light && <StatusBar />}

          <div style={{ flex: 1, overflowY: "auto", paddingTop: light ? 0 : 4, zIndex: 5 }}>
            {screen === "home" && (
              <Dashboard 
                allPallets={pallets} 
                displayPallets={sortedPallets} 
                query={query} 
                setQuery={setQuery} 
                status={status} 
                setStatus={setStatus} 
                area={area} 
                setArea={setArea} 
                onOpen={(id) => { setSelected(id); setScreen("detail"); }} 
                onScan={() => setScreen("scan")} 
                openInfo={openInfo} 
                onOpenFilter={() => setFilterSheetOpen(true)}
                isFilterActive={isFilterActive}
                sortBy={sortBy}
                tempMin={tempMin}
                tempMax={tempMax}
                onResetAll={handleResetAllFilters}
                onOpenNotifs={() => setNotificationSheetOpen(true)}
                unreadCount={notifications.filter(n => !n.read).length}
                simulating={simulating}
                onToggleSim={() => setSimulating(prev => !prev)}
              />
            )}
            {screen === "detail" && <Detail pallet={pallet} onBack={() => setScreen("home")} openInfo={openInfo} />}
            {screen === "register" && <Register pallet={scanned} onCancel={() => setScreen("home")} onConfirm={confirmAdd} openInfo={openInfo} />}
          </div>

          {screen === "scan" && <Scan onClose={() => setScreen("home")} onDetect={detect} openInfo={openInfo} />}

          <div style={{ position: "absolute", bottom: 9, left: "50%", transform: "translateX(-50%)", width: 130, height: 5, background: light ? "rgba(255,255,255,.7)" : "#0B0B0D", opacity: 0.85, borderRadius: 999, zIndex: 30 }} />

          <Toast text={toast} />
          <InfoSheet info={info} onClose={() => setInfo(null)} />
          <FilterSheet 
            open={filterSheetOpen} 
            onClose={() => setFilterSheetOpen(false)} 
            sortBy={sortBy} 
            setSortBy={setSortBy} 
            tempMin={tempMin} 
            setTempMin={setTempMin} 
            tempMax={tempMax} 
            setTempMax={setTempMax} 
            onReset={handleResetFiltersOnly} 
          />
          <NotificationSheet
            open={notificationSheetOpen}
            onClose={() => setNotificationSheetOpen(false)}
            notifications={notifications}
            onMarkAllRead={handleMarkAllRead}
            onClearAll={handleClearAllNotifs}
            onSelectPallet={handleSelectNotifPallet}
          />
        </div>
      </div>
    </div>
  );
}
