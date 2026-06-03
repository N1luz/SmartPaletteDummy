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

/* ---------- Temperaturdiagramm ---------- */
function TempChart({ data, lo, hi, warn }) {
  const W = 304, H = 150, pad = { l: 26, r: 10, t: 14, b: 22 }, dMin = 0, dMax = 14;
  const x = (i) => pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r);
  const y = (v) => pad.t + (1 - (v - dMin) / (dMax - dMin)) * (H - pad.t - pad.b);
  const stroke = warn ? C.red : C.ok;
  const line = data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(data.length - 1).toFixed(1)},${y(dMin)} L${x(0).toFixed(1)},${y(dMin)} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
      <defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={stroke} stopOpacity="0.18" /><stop offset="100%" stopColor={stroke} stopOpacity="0" />
      </linearGradient></defs>
      <rect x={pad.l} y={y(hi)} width={W - pad.l - pad.r} height={y(lo) - y(hi)} fill={C.okBg} />
      <line x1={pad.l} y1={y(hi)} x2={W - pad.r} y2={y(hi)} stroke="#BFE6CC" strokeWidth="1" strokeDasharray="3 3" />
      <line x1={pad.l} y1={y(lo)} x2={W - pad.r} y2={y(lo)} stroke="#BFE6CC" strokeWidth="1" strokeDasharray="3 3" />
      <text x={4} y={y(hi) + 3} fontSize="9" fill={C.muted}>{hi}°</text>
      <text x={4} y={y(lo) + 3} fontSize="9" fill={C.muted}>{lo}°</text>
      <path d={area} fill="url(#fill)" />
      <path d={line} fill="none" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1])} r="4.5" fill={stroke} stroke="#fff" strokeWidth="2" />
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
    <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px 0 30px", color: col }}>
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

function Dashboard({ pallets, query, setQuery, status, setStatus, area, setArea, onOpen, onScan, openInfo }) {
  const warnCount = pallets.filter((p) => p.warn).length;
  const areaOf = (p) => p.location.split(" ")[0];
  const areas = ["Alle", "Wareneingang", "Lager", "Versand"];
  const q = query.trim().toLowerCase();
  const filtered = pallets.filter((p) => {
    const sOk = status === "alle" || (status === "warn" ? p.warn : !p.warn);
    const aOk = area === "Alle" || areaOf(p) === area;
    const qOk = !q || p.product.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    return sOk && aOk && qOk;
  });
  const sorted = [...filtered].sort((a, b) => (b.warn ? 1 : 0) - (a.warn ? 1 : 0));
  const filterActive = status !== "alle" || area !== "Alle" || q.length > 0;
  return (
    <div style={{ animation: "fade .3s ease", paddingBottom: 96 }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(150deg, ${C.red} 0%, ${C.redDark} 62%, ${C.redDeep} 100%)`, borderRadius: "0 0 30px 30px", padding: "4px 22px 22px", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -40, top: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,.07)" }} />
        <div style={{ position: "absolute", right: 40, top: 70, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,.06)" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <img src="/carl-roth-logo.png" alt="Carl Roth Logo" style={{ height: 22, objectFit: "contain", borderRadius: 3 }} />
            <span style={{ fontSize: 19, fontWeight: 800 }}>SmartPallet</span>
          </div>
          <Bell size={20} color="#fff" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16 }}>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.9 }}>Aktive Paletten · Temperatur</p>
          <InfoBtn light onClick={() => openInfo("overview")} />
        </div>
        {/* Stat-Chips */}
        <div style={{ display: "flex", gap: 9, marginTop: 14, position: "relative" }}>
          <Chip value={pallets.length} label="Paletten" />
          <Chip value={pallets.length - warnCount} label="Im Bereich" />
          <Chip value={warnCount} label="Warnungen" highlight={warnCount > 0} />
        </div>
      </div>

      {/* Suche + Filter */}
      <div style={{ padding: "16px 20px 4px", display: "flex", flexDirection: "column", gap: 11 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: "11px 13px", boxShadow: "0 2px 8px rgba(20,10,15,.04)" }}>
          <Search size={17} color={C.muted} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Palette suchen …"
            style={{ border: "none", outline: "none", flex: 1, fontSize: 14, color: C.ink, background: "transparent", fontFamily: "inherit", minWidth: 0 }} />
          {query && <button onClick={() => setQuery("")} aria-label="Suche löschen" style={{ border: "none", background: "none", cursor: "pointer", color: C.muted, padding: 0, display: "flex" }}><X size={16} /></button>}
        </div>
        <Segmented value={status} onChange={setStatus} options={[{ key: "alle", label: "Alle" }, { key: "ok", label: "Im Bereich", color: C.ok }, { key: "warn", label: "Warnung", color: C.red }]} />
        <Chips value={area} onChange={setArea} options={areas} />
      </div>

      {/* Ergebniszeile */}
      <div style={{ padding: "8px 22px 10px", display: "flex", alignItems: "center", gap: 6 }}>
        <Filter size={14} color={C.muted} />
        <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>{sorted.length} {sorted.length === 1 ? "Palette" : "Paletten"}{filterActive ? " gefiltert" : ""}</span>
        {filterActive && <button onClick={() => { setStatus("alle"); setArea("Alle"); setQuery(""); }} style={{ marginLeft: "auto", border: "none", background: "none", color: C.red, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Zurücksetzen</button>}
      </div>

      {/* Liste */}
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 11 }}>
        {sorted.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 20px 10px", color: C.muted }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: C.card, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Search size={24} color={C.muted} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>Keine Paletten gefunden</div>
            <div style={{ fontSize: 13, marginTop: 3 }}>Passe Suche oder Filter an.</div>
          </div>
        ) : sorted.map((p) => (
          <button key={p.id} onClick={() => onOpen(p.id)} style={{ textAlign: "left", border: "none", background: C.card, borderRadius: 16, padding: 0, cursor: "pointer", display: "flex", width: "100%", overflow: "hidden", boxShadow: "0 3px 12px rgba(20,10,15,.05)" }}>
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
    <div style={{ animation: "slide .3s ease", paddingBottom: 30 }}>
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

        <div style={{ marginTop: 14, background: C.card, border: `1px solid ${C.line}`, borderRadius: 18, padding: 18, boxShadow: "0 3px 12px rgba(20,10,15,.04)" }}>
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px 8px", color: "#fff" }}>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,.12)", border: "none", borderRadius: 999, width: 34, height: 34, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={19} /></button>
        <span style={{ fontSize: 16, fontWeight: 700 }}>QR-Code scannen</span>
        <InfoBtn light onClick={() => openInfo("qr")} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "0 24px" }}>
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

        {/* Viewfinder */}
        <button onClick={onDetect} style={{ position: "relative", width: 200, height: 200, background: "#15161A", borderRadius: 26, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <div style={{ background: "#fff", padding: 10, borderRadius: 14 }}><QRCode value="PAL-NEW-2026" size={120} /></div>
          {[["t","l"],["t","r"],["b","l"],["b","r"]].map(([v,h],i) => (
            <span key={i} style={{ position: "absolute", [v === "t" ? "top" : "bottom"]: 12, [h === "l" ? "left" : "right"]: 12, width: 30, height: 30, borderTop: v === "t" ? `3px solid ${C.red}` : "none", borderBottom: v === "b" ? `3px solid ${C.red}` : "none", borderLeft: h === "l" ? `3px solid ${C.red}` : "none", borderRight: h === "r" ? `3px solid ${C.red}` : "none", borderTopLeftRadius: v === "t" && h === "l" ? 8 : 0, borderTopRightRadius: v === "t" && h === "r" ? 8 : 0, borderBottomLeftRadius: v === "b" && h === "l" ? 8 : 0, borderBottomRightRadius: v === "b" && h === "r" ? 8 : 0 }} />
          ))}
          <div style={{ position: "absolute", left: 14, right: 14, height: 2, background: `linear-gradient(90deg, transparent, ${C.red}, transparent)`, boxShadow: `0 0 12px 2px ${C.red}`, animation: "scanmove 2.1s ease-in-out infinite alternate" }} />
        </button>

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
    <div style={{ animation: "slide .3s ease", paddingBottom: 30 }}>
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

function Toast({ text }) {
  if (!text) return null;
  return (
    <div style={{ position: "absolute", top: 54, left: 20, right: 20, zIndex: 45, background: C.ink, color: "#fff", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 9, boxShadow: "0 10px 24px rgba(0,0,0,.3)", animation: "drop .3s ease" }}>
      <CheckCircle2 size={19} color="#4ADE80" strokeWidth={2.6} /> <span style={{ fontSize: 14, fontWeight: 600 }}>{text}</span>
    </div>
  );
}

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

  const confirmAdd = () => {
    setPallets((prev) => (prev.some((p) => p.id === scanned.id) ? prev : [...prev, scanned]));
    setStatus("alle"); setArea("Alle"); setQuery("");
    setScreen("home");
    setToast(`${scanned.product} aufgenommen`);
  };

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
        * { -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      <p style={{ color: C.muted, fontSize: 13, marginBottom: 18, textAlign: "center", maxWidth: 360 }}>
        Tippe auf <b style={{ color: C.red }}>„Palette scannen"</b> für den QR-Flow · die <b style={{ color: C.red }}>(i)</b>-Symbole erklären jede Funktion
      </p>

      <div style={{ width: 380, maxWidth: "100%", height: 800, background: "#0B0B0D", borderRadius: 56, padding: 12, boxShadow: "0 30px 60px rgba(60,10,15,.28), 0 4px 12px rgba(0,0,0,.2)", position: "relative" }}>
        <div style={{ width: "100%", height: "100%", background: C.bg, borderRadius: 46, overflow: "hidden", position: "relative", display: "flex", flexDirection: "column" }}>
          <div style={{ position: "absolute", top: 11, left: "50%", transform: "translateX(-50%)", width: 116, height: 33, background: "#0B0B0D", borderRadius: 999, zIndex: 30 }} />

          {!light && <StatusBar />}

          <div style={{ flex: 1, overflowY: "auto", paddingTop: light ? 0 : 4 }}>
            {screen === "home" && <Dashboard pallets={pallets} query={query} setQuery={setQuery} status={status} setStatus={setStatus} area={area} setArea={setArea} onOpen={(id) => { setSelected(id); setScreen("detail"); }} onScan={() => setScreen("scan")} openInfo={openInfo} />}
            {screen === "detail" && <Detail pallet={pallet} onBack={() => setScreen("home")} openInfo={openInfo} />}
            {screen === "register" && <Register pallet={scanned} onCancel={() => setScreen("home")} onConfirm={confirmAdd} openInfo={openInfo} />}
          </div>

          {screen === "scan" && <Scan onClose={() => setScreen("home")} onDetect={detect} openInfo={openInfo} />}

          <div style={{ position: "absolute", bottom: 9, left: "50%", transform: "translateX(-50%)", width: 130, height: 5, background: light ? "rgba(255,255,255,.7)" : "#0B0B0D", opacity: 0.85, borderRadius: 999, zIndex: 30 }} />

          <Toast text={toast} />
          <InfoSheet info={info} onClose={() => setInfo(null)} />
        </div>
      </div>
    </div>
  );
}
